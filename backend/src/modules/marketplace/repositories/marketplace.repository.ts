import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../repositories/BaseRepository.js';

export class MarketplaceRepository extends BaseRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Buscar produtos
   */
  async getProducts(search: string | undefined, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const products = await this.prisma.product.findMany({
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

    const total = await this.prisma.product.count({ where });

    // Calcular rating médio para cada produto
    const productsWithRating = await Promise.all(
      products.map(async (product) => {
        const reviews = await this.prisma.review.findMany({
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

    return { products: productsWithRating, total };
  }

  /**
   * Buscar produto por ID
   */
  async getProductById(productId: string) {
    return this.prisma.product.findUnique({
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
  }

  /**
   * Criar review
   */
  async createReview(userId: string, productId: string, rating: number, text: string | null) {
    return this.prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        text,
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
  }

  /**
   * Buscar pedidos do usuário
   */
  async getOrdersByUserId(userId: string) {
    return this.prisma.order.findMany({
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
  }

  /**
   * Buscar produto para validação
   */
  async findProductById(productId: string) {
    return this.prisma.product.findUnique({
      where: { id: productId },
    });
  }

  /**
   * Atualizar estoque do produto
   */
  async updateProductStock(productId: string, quantity: number) {
    return this.prisma.product.update({
      where: { id: productId },
      data: { stock: { decrement: quantity } },
    });
  }

  /**
   * Criar pedido
   */
  async createOrder(userId: string, total: number, items: Array<{ productId: string; quantity: number; price: number }>) {
    return this.prisma.order.create({
      data: {
        userId,
        total,
        status: 'pending',
        items: {
          create: items,
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
  }
}
