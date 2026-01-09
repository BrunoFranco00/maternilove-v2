import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import logger from '../utils/logger.js';

// GET /api/social/feed - Feed de posts
export const getFeed = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await prisma.socialPost.findMany({
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
        likes_rel: {
          select: {
            userId: true,
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
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
    });

    const total = await prisma.socialPost.count();

    res.json({
      success: true,
      data: {
        posts: posts.map(post => ({
          ...post,
          isLiked: userId ? post.likes_rel.some(like => like.userId === userId) : false,
          likesCount: post.likes_rel.length,
          commentsCount: post.comments.length,
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
    logger.error('Error fetching feed', { error });
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao buscar feed' },
    });
  }
};

// POST /api/social/posts - Criar post
export const createPost = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Não autenticado' },
      });
    }

    const { content, images } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Conteúdo do post é obrigatório' },
      });
    }

    const post = await prisma.socialPost.create({
      data: {
        userId,
        content: content.trim(),
        images: images || [],
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

// POST /api/social/posts/:id/like - Curtir/descurtir post
export const toggleLike = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Não autenticado' },
      });
    }

    const postId = req.params.id;

    const existingLike = await prisma.socialLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      await prisma.socialLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      await prisma.socialPost.update({
        where: { id: postId },
        data: {
          likes: { decrement: 1 },
        },
      });

      res.json({
        success: true,
        data: { liked: false },
      });
    } else {
      await prisma.socialLike.create({
        data: {
          postId,
          userId,
        },
      });

      await prisma.socialPost.update({
        where: { id: postId },
        data: {
          likes: { increment: 1 },
        },
      });

      res.json({
        success: true,
        data: { liked: true },
      });
    }
  } catch (error: any) {
    logger.error('Error toggling like', { error });
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao curtir post' },
    });
  }
};

// POST /api/social/posts/:id/comments - Comentar post
export const createComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
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

    const comment = await prisma.socialComment.create({
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

// GET /api/social/posts/:id/comments - Listar comentários
export const getComments = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const comments = await prisma.socialComment.findMany({
      where: { postId },
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
      },
    });

    const total = await prisma.socialComment.count({
      where: { postId },
    });

    res.json({
      success: true,
      data: {
        comments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    logger.error('Error fetching comments', { error });
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao buscar comentários' },
    });
  }
};

