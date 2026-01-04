import { Router } from 'express';
import * as marketplaceController from '../controllers/marketplace.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Rotas públicas
router.get('/products', marketplaceController.getProducts);
router.get('/products/:id', marketplaceController.getProduct);

// Rotas protegidas
router.post('/products/:id/reviews', authenticate, marketplaceController.createReview);
router.get('/orders', authenticate, marketplaceController.getOrders);
router.post('/orders', authenticate, marketplaceController.createOrder);

export default router;

