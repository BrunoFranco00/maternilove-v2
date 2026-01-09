import { SocialRepository } from '../repositories/social.repository.js';

export class SocialService {
  constructor(private repository: SocialRepository) {}

  /**
   * Buscar feed de posts
   */
  async getFeed(page: number, limit: number, userId?: string) {
    return this.repository.getFeed(page, limit, userId);
  }

  /**
   * Criar post
   */
  async createPost(userId: string, content: string, images: string[]) {
    return this.repository.createPost(userId, content, images);
  }

  /**
   * Toggle like em post
   */
  async toggleLike(postId: string, userId: string) {
    const existingLike = await this.repository.findLike(postId, userId);

    if (existingLike) {
      await this.repository.removeLike(existingLike.id, postId);
      return { liked: false };
    } else {
      await this.repository.addLike(postId, userId);
      return { liked: true };
    }
  }

  /**
   * Criar comentário
   */
  async createComment(postId: string, userId: string, text: string) {
    return this.repository.createComment(postId, userId, text);
  }

  /**
   * Buscar comentários
   */
  async getComments(postId: string, page: number, limit: number) {
    return this.repository.getComments(postId, page, limit);
  }
}
