import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateQuery, validateBody, validateParams } from '../../shared/middleware/validate.middleware.js';
import {
  getPostsQuerySchema,
  getPostParamsSchema,
  createPostBodySchema,
  createCommentParamsSchema,
  createCommentBodySchema,
} from './validators/community.validators.js';
import { prisma } from '../../config/prisma.js';
import { CommunityRepository } from './repositories/community.repository.js';
import { CommunityService } from './services/community.service.js';
import { CommunityController } from './controllers/community.controller.js';

const router = Router();

// Inicializar dependências
const repository = new CommunityRepository(prisma);
const service = new CommunityService(repository);
const controller = new CommunityController(service);

// Rotas públicas
router.get('/categories', controller.getCategories);
router.get('/posts', validateQuery(getPostsQuerySchema), controller.getPosts);
router.get('/posts/:id', validateParams(getPostParamsSchema), controller.getPost);

// Rotas protegidas
router.post('/posts', authenticate, validateBody(createPostBodySchema), controller.createPost);
router.post('/posts/:id/comments', authenticate, validateParams(createCommentParamsSchema), validateBody(createCommentBodySchema), controller.createComment);

export default router;
