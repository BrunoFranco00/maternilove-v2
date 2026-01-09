import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../repositories/BaseRepository.js';

export class SocialRepository extends BaseRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Buscar feed de posts
   */
  async getFeed(page: number, limit: number, userId?: string) {
    const skip = (page - 1) * limit;

    const posts = await this.prisma.socialPost.findMany({
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

    const total = await this.prisma.socialPost.count();

    return {
      posts: posts.map(post => ({
        ...post,
        isLiked: userId ? post.likes_rel.some(like => like.userId === userId) : false,
        likesCount: post.likes_rel.length,
        commentsCount: post.comments.length,
      })),
      total,
    };
  }

  /**
   * Criar post
   */
  async createPost(userId: string, content: string, images: string[]) {
    return this.prisma.socialPost.create({
      data: {
        userId,
        content,
        images,
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
   * Buscar like existente
   */
  async findLike(postId: string, userId: string) {
    return this.prisma.socialLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });
  }

  /**
   * Remover like
   */
  async removeLike(likeId: string, postId: string) {
    await this.prisma.socialLike.delete({
      where: { id: likeId },
    });

    await this.prisma.socialPost.update({
      where: { id: postId },
      data: {
        likes: { decrement: 1 },
      },
    });
  }

  /**
   * Adicionar like
   */
  async addLike(postId: string, userId: string) {
    await this.prisma.socialLike.create({
      data: {
        postId,
        userId,
      },
    });

    await this.prisma.socialPost.update({
      where: { id: postId },
      data: {
        likes: { increment: 1 },
      },
    });
  }

  /**
   * Criar comentário
   */
  async createComment(postId: string, userId: string, text: string) {
    return this.prisma.socialComment.create({
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

  /**
   * Buscar comentários de um post
   */
  async getComments(postId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const comments = await this.prisma.socialComment.findMany({
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

    const total = await this.prisma.socialComment.count({
      where: { postId },
    });

    return { comments, total };
  }
}
