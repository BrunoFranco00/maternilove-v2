import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateQuery, validateBody, validateParams } from '../../shared/middleware/validate.middleware.js';
import {
  getProductsQuerySchema,
  getProductParamsSchema,
  createReviewParamsSchema,
  createReviewBodySchema,
  createOrderBodySchema,
} from './validators/marketplace.validators.js';
import { prisma } from '../../config/prisma.js';
import { MarketplaceRepository } from './repositories/marketplace.repository.js';
import { MarketplaceService } from './services/marketplace.service.js';
import { MarketplaceController } from './controllers/marketplace.controller.js';

const router = Router();

// Inicializar dependências
const repository = new MarketplaceRepository(prisma);
const service = new MarketplaceService(repository);
const controller = new MarketplaceController(service);

// Rotas públicas
router.get('/products', validateQuery(getProductsQuerySchema), controller.getProducts);
router.get('/products/:id', validateParams(getProductParamsSchema), controller.getProduct);

// Rotas protegidas
router.post('/products/:id/reviews', authenticate, validateParams(createReviewParamsSchema), validateBody(createReviewBodySchema), controller.createReview);
router.get('/orders', authenticate, controller.getOrders);
router.post('/orders', authenticate, validateBody(createOrderBodySchema), controller.createOrder);

export default router;
