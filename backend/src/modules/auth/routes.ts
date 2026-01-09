import { Router } from 'express';
import { validateBody } from '../../shared/middleware/validate.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authLimiter } from '../../middleware/rateLimiter.middleware.js';
import {
  registerBodySchema,
  loginBodySchema,
  refreshTokenBodySchema,
  logoutBodySchema,
} from './validators/auth.validators.js';
import { prisma } from '../../config/prisma.js';
import { AuthRepository } from './repositories/auth.repository.js';
import { AuthService } from './services/auth.service.js';
import { AuthController } from './controllers/auth.controller.js';

const router = Router();

// Inicializar dependências
const repository = new AuthRepository(prisma);
const service = new AuthService(repository);
const controller = new AuthController(service);

// Rotas públicas
router.post('/register', authLimiter, validateBody(registerBodySchema), controller.register);
router.post('/login', authLimiter, validateBody(loginBodySchema), controller.login);
router.post('/refresh', authLimiter, validateBody(refreshTokenBodySchema), controller.refreshToken);

// Rotas protegidas (logout pode ser feito sem autenticação, apenas com refresh token válido)
router.post('/logout', validateBody(logoutBodySchema), controller.logout);

export default router;
