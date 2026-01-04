import { Router } from 'express';
import * as communityController from '../controllers/community.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Rotas públicas
router.get('/categories', communityController.getCategories as any);
router.get('/posts', communityController.getPosts as any);
router.get('/posts/:id', communityController.getPost as any);

// Rotas protegidas
router.post('/posts', authenticate, communityController.createPost);
router.post('/posts/:id/comments', authenticate, communityController.createComment);

export default router;

