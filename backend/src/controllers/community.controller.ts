import { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import logger from '../utils/logger.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

// GET /api/community/categories - Listar categorias
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.communityCategory.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      data: categories.map(cat => ({
        ...cat,
        postsCount: cat._count.posts,
      })),
    });
  } catch (error: any) {
    logger.error('Error fetching categories', { error });
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao buscar categorias' },
    });
  }
};

// GET /api/community/posts - Listar posts por categoria
export const getPosts = async (req: Request, res: Response) => {
  try {
    const categoryId = req.query.categoryId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const posts = await prisma.communityPost.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    const total = await prisma.communityPost.count({ where });

    res.json({
      success: true,
      data: {
        posts: posts.map(post => ({
          ...post,
          commentsCount: post._count.comments,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    logger.error('Error fetching posts', { error });
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao buscar posts' },
    });
  }
};

// POST /api/community/posts - Criar post
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Não autenticado' },
      });
    }

    const { categoryId, title, content } = req.body;

    if (!categoryId || !title || !content) {
      return res.status(400).json({
        success: false,
        error: { message: 'Categoria, título e conteúdo são obrigatórios' },
      });
    }

    const post = await prisma.communityPost.create({
      data: {
        userId,
        categoryId,
        title: title.trim(),
        content: content.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    logger.error('Error creating post', { error });
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao criar post' },
    });
  }
};

// GET /api/community/posts/:id - Detalhes do post
export const getPost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: { message: 'Post não encontrado' },
      });
    }

    // Incrementar views
    await prisma.communityPost.update({
      where: { id: postId },
      data: { views: { increment: 1 } },
    });

    res.json({
      success: true,
      data: {
        ...post,
        views: post.views + 1,
        commentsCount: post.comments.length,
      },
    });
  } catch (error: any) {
    logger.error('Error fetching post', { error });
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao buscar post' },
    });
  }
};

// POST /api/community/posts/:id/comments - Comentar post
export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Não autenticado' },
      });
    }

    const postId = req.params.id;
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Texto do comentário é obrigatório' },
      });
    }

    const comment = await prisma.communityComment.create({
      data: {
        postId,
        userId,
        text: text.trim(),
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
      data: comment,
    });
  } catch (error: any) {
    logger.error('Error creating comment', { error });
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao criar comentário' },
    });
  }
};

