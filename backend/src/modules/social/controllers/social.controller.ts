import { Request, Response } from 'express';
import { ok, created } from '../../../shared/http/response.js';
import { SocialService } from '../services/social.service.js';

export class SocialController {
  constructor(private service: SocialService) {}

  /**
   * GET /feed
   */
  getFeed = async (req: Request, res: Response): Promise<void> => {
    // Valores já validados e transformados pelo middleware validateQuery
    const { page, limit } = req.query as unknown as { page: number; limit: number };
    const userId = req.user?.id;

    const { posts, total } = await this.service.getFeed(page, limit, userId);

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
   * POST /posts
   */
  createPost = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id!; // Já validado pelo middleware authenticate
    // Body já validado pelo middleware validateBody
    const { content, images } = req.body as { content: string; images?: string[] };

    const post = await this.service.createPost(userId, content, images || []);

    created(res, post);
  };

  /**
   * POST /posts/:id/like
   */
  toggleLike = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id!;
    const { id: postId } = req.params;

    const result = await this.service.toggleLike(postId, userId);

    ok(res, result);
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

  /**
   * GET /posts/:id/comments
   */
  getComments = async (req: Request, res: Response): Promise<void> => {
    const { id: postId } = req.params;
    // Valores já validados e transformados pelo middleware validateQuery
    const { page, limit } = req.query as unknown as { page: number; limit: number };

    const { comments, total } = await this.service.getComments(postId, page, limit);

    ok(res, {
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  };
}
