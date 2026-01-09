import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateQuery, validateBody, validateParams } from '../../shared/middleware/validate.middleware.js';
import {
  getFeedQuerySchema,
  createPostBodySchema,
  toggleLikeParamsSchema,
  createCommentParamsSchema,
  createCommentBodySchema,
  getCommentsParamsSchema,
  getCommentsQuerySchema,
} from './validators/social.validators.js';
import { prisma } from '../../config/prisma.js';
import { SocialRepository } from './repositories/social.repository.js';
import { SocialService } from './services/social.service.js';
import { SocialController } from './controllers/social.controller.js';

const router = Router();

// Inicializar dependências
const repository = new SocialRepository(prisma);
const service = new SocialService(repository);
const controller = new SocialController(service);

// Rotas públicas
router.get('/feed', validateQuery(getFeedQuerySchema), controller.getFeed);
router.get('/posts/:id/comments', validateParams(getCommentsParamsSchema), validateQuery(getCommentsQuerySchema), controller.getComments);

// Rotas protegidas
router.post('/posts', authenticate, validateBody(createPostBodySchema), controller.createPost);
router.post('/posts/:id/like', authenticate, validateParams(toggleLikeParamsSchema), controller.toggleLike);
router.post('/posts/:id/comments', authenticate, validateParams(createCommentParamsSchema), validateBody(createCommentBodySchema), controller.createComment);

export default router;
