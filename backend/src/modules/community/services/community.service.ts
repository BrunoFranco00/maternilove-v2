import { CommunityRepository } from '../repositories/community.repository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { ErrorCode } from '../../../shared/errors/ErrorCatalog.js';

export class CommunityService {
  constructor(private repository: CommunityRepository) {}

  /**
   * Buscar categorias
   */
  async getCategories() {
    const categories = await this.repository.getCategories();
    return categories.map(cat => ({
      ...cat,
      postsCount: cat._count.posts,
    }));
  }

  /**
   * Buscar posts
   */
  async getPosts(categoryId: string | undefined, page: number, limit: number) {
    return this.repository.getPosts(categoryId, page, limit);
  }

  /**
   * Buscar post por ID
   */
  async getPostById(postId: string) {
    const post = await this.repository.getPostById(postId);

    if (!post) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Post não encontrado');
    }

    // Incrementar views
    await this.repository.incrementViews(postId);

    return {
      ...post,
      views: post.views + 1,
      commentsCount: post.comments.length,
    };
  }

  /**
   * Criar post
   */
  async createPost(userId: string, categoryId: string, title: string, content: string) {
    return this.repository.createPost(userId, categoryId, title, content);
  }

  /**
   * Criar comentário
   */
  async createComment(postId: string, userId: string, text: string) {
    return this.repository.createComment(postId, userId, text);
  }
}
