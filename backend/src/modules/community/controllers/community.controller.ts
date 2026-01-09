import { Request, Response } from 'express';
import { ok, created } from '../../../shared/http/response.js';
import { CommunityService } from '../services/community.service.js';

export class CommunityController {
  constructor(private service: CommunityService) {}

  /**
   * GET /categories
   */
  getCategories = async (req: Request, res: Response): Promise<void> => {
    const categories = await this.service.getCategories();
    ok(res, categories);
  };

  /**
   * GET /posts
   */
  getPosts = async (req: Request, res: Response): Promise<void> => {
    // Valores já validados e transformados pelo middleware validateQuery
    const { categoryId, page, limit } = req.query as unknown as { categoryId?: string; page: number; limit: number };

    const { posts, total } = await this.service.getPosts(categoryId, page, limit);

    ok(res, {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  };

  /**
   * GET /posts/:id
   */
  getPost = async (req: Request, res: Response): Promise<void> => {
    const { id: postId } = req.params;

    const post = await this.service.getPostById(postId);

    ok(res, post);
  };

  /**
   * POST /posts
   */
  createPost = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id!;
    // Body já validado pelo middleware validateBody
    const { categoryId, title, content } = req.body as { categoryId: string; title: string; content: string };

    const post = await this.service.createPost(userId, categoryId, title, content);

    created(res, post);
  };

  /**
   * POST /posts/:id/comments
   */
  createComment = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id!;
    const { id: postId } = req.params;
    // Body já validado pelo middleware validateBody
    const { text } = req.body as { text: string };

    const comment = await this.service.createComment(postId, userId, text);

    created(res, comment);
  };
}
