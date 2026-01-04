import { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import logger from '../utils/logger.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

// GET /api/marketplace/products - Listar produtos
export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;
    const search = req.query.search as string;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            verified: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    // Calcular rating médio para cada produto
    const productsWithRating = await Promise.all(
      products.map(async (product) => {
        const reviews = await prisma.review.findMany({
          where: { productId: product.id },
          select: { rating: true },
        });

        const avgRating =
          reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        return {
          ...product,
          rating: avgRating,
          reviewsCount: product._count.reviews,
        };
      })
    );

    const total = await prisma.product.count({ where });

    res.json({
      success: true,
      data: {
        products: productsWithRating,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    logger.error('Error fetching products', { error });
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao buscar produtos' },
    });
  }
};

// GET /api/marketplace/products/:id - Detalhes do produto
export const getProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            verified: true,
            description: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: { message: 'Produto não encontrado' },
      });
    }

    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

    res.json({
      success: true,
      data: {
        ...product,
        rating: avgRating,
        reviewsCount: product.reviews.length,
      },
    });
  } catch (error: any) {
    logger.error('Error fetching product', { error });
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao buscar produto' },
    });
  }
};

// POST /api/marketplace/products/:id/reviews - Criar review
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Não autenticado' },
      });
    }

    const productId = req.params.id;
    const { rating, text } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: { message: 'Rating deve ser entre 1 e 5' },
      });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        text: text?.trim() || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error: any) {
    logger.error('Error creating review', { error });
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao criar avaliação' },
    });
  }
};

// GET /api/marketplace/orders - Listar pedidos do usuário
export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Não autenticado' },
      });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    logger.error('Error fetching orders', { error });
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao buscar pedidos' },
    });
  }
};

// POST /api/marketplace/orders - Criar pedido
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Não autenticado' },
      });
    }

    const { items } = req.body; // [{ productId, quantity }]

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Items são obrigatórios' },
      });
    }

    // Calcular total e validar produtos
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return res.status(400).json({
          success: false,
          error: { message: `Produto ${item.productId} não encontrado` },
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: { message: `Estoque insuficiente para ${product.name}` },
        });
      }

      total += product.price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });

      // Atualizar estoque
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: 'pending',
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    logger.error('Error creating order', { error });
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao criar pedido' },
    });
  }
};

