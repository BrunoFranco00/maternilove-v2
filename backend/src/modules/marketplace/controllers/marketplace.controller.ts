import { Request, Response } from 'express';
import { ok, created } from '../../../shared/http/response.js';
import { MarketplaceService } from '../services/marketplace.service.js';

export class MarketplaceController {
  constructor(private service: MarketplaceService) {}

  /**
   * GET /products
   */
  getProducts = async (req: Request, res: Response): Promise<void> => {
    // Valores já validados e transformados pelo middleware validateQuery
    const { search, page, limit } = req.query as unknown as { search?: string; page: number; limit: number };

    const { products, total } = await this.service.getProducts(search, page, limit);

    ok(res, {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  };

  /**
   * GET /products/:id
   */
  getProduct = async (req: Request, res: Response): Promise<void> => {
    const { id: productId } = req.params;

    const product = await this.service.getProductById(productId);

    ok(res, product);
  };

  /**
   * POST /products/:id/reviews
   */
  createReview = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id!;
    const { id: productId } = req.params;
    // Body já validado pelo middleware validateBody
    const { rating, text } = req.body as { rating: number; text: string | null | undefined };

    const review = await this.service.createReview(userId, productId, rating, text);

    created(res, review);
  };

  /**
   * GET /orders
   */
  getOrders = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id!;

    const orders = await this.service.getOrdersByUserId(userId);

    ok(res, orders);
  };

  /**
   * POST /orders
   */
  createOrder = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id!;
    // Body já validado pelo middleware validateBody
    const { items } = req.body as { items: Array<{ productId: string; quantity: number }> };

    const order = await this.service.createOrder(userId, items);

    created(res, order);
  };
}
