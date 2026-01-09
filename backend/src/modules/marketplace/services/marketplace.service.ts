import { MarketplaceRepository } from '../repositories/marketplace.repository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { ErrorCode } from '../../../shared/errors/ErrorCatalog.js';

export class MarketplaceService {
  constructor(private repository: MarketplaceRepository) {}

  /**
   * Buscar produtos
   */
  async getProducts(search: string | undefined, page: number, limit: number) {
    return this.repository.getProducts(search, page, limit);
  }

  /**
   * Buscar produto por ID
   */
  async getProductById(productId: string) {
    const product = await this.repository.getProductById(productId);

    if (!product) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Produto não encontrado');
    }

    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

    return {
      ...product,
      rating: avgRating,
      reviewsCount: product.reviews.length,
    };
  }

  /**
   * Criar review
   */
  async createReview(userId: string, productId: string, rating: number, text: string | null | undefined) {
    return this.repository.createReview(userId, productId, rating, text || null);
  }

  /**
   * Buscar pedidos do usuário
   */
  async getOrdersByUserId(userId: string) {
    return this.repository.getOrdersByUserId(userId);
  }

  /**
   * Criar pedido
   */
  async createOrder(userId: string, items: Array<{ productId: string; quantity: number }>) {
    // Validar produtos e calcular total
    let total = 0;
    const orderItems: Array<{ productId: string; quantity: number; price: number }> = [];

    for (const item of items) {
      const product = await this.repository.findProductById(item.productId);

      if (!product) {
        throw new AppError(ErrorCode.NOT_FOUND, `Produto ${item.productId} não encontrado`);
      }

      if (product.stock < item.quantity) {
        throw new AppError(ErrorCode.VALIDATION_ERROR, `Estoque insuficiente para ${product.name}`);
      }

      total += product.price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });

      // Atualizar estoque
      await this.repository.updateProductStock(item.productId, item.quantity);
    }

    return this.repository.createOrder(userId, total, orderItems);
  }
}
