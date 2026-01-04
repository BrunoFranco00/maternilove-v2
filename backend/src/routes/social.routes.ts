import { Router } from 'express';
import * as socialController from '../controllers/social.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Rotas públicas (feed pode ser visto sem autenticação, mas com funcionalidade limitada)
router.get('/feed', socialController.getFeed);
router.get('/posts/:id/comments', socialController.getComments);

// Rotas protegidas
router.post('/posts', authenticate, socialController.createPost);
router.post('/posts/:id/like', authenticate, socialController.toggleLike);
router.post('/posts/:id/comments', authenticate, socialController.createComment);

export default router;

