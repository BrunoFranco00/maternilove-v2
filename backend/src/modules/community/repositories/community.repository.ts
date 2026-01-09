import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../repositories/BaseRepository.js';

export class CommunityRepository extends BaseRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Buscar categorias
   */
  async getCategories() {
    return this.prisma.communityCategory.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Buscar posts
   */
  async getPosts(categoryId: string | undefined, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const where: any = {};
    
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const posts = await this.prisma.communityPost.findMany({
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

    const total = await this.prisma.communityPost.count({ where });

    return {
      posts: posts.map(post => ({
        ...post,
        commentsCount: post._count.comments,
      })),
      total,
    };
  }

  /**
   * Buscar post por ID
   */
  async getPostById(postId: string) {
    return this.prisma.communityPost.findUnique({
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
  }

  /**
   * Incrementar views do post
   */
  async incrementViews(postId: string) {
    return this.prisma.communityPost.update({
      where: { id: postId },
      data: { views: { increment: 1 } },
    });
  }

  /**
   * Criar post
   */
  async createPost(userId: string, categoryId: string, title: string, content: string) {
    return this.prisma.communityPost.create({
      data: {
        userId,
        categoryId,
        title,
        content,
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
  }

  /**
   * Criar comentário
   */
  async createComment(postId: string, userId: string, text: string) {
    return this.prisma.communityComment.create({
      data: {
        postId,
        userId,
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
}
