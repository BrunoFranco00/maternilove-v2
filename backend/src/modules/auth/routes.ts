import { Router } from 'express';
import { validateBody } from '../../shared/middleware/validate.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { loginLimiter, registerLimiter } from '../../middleware/rateLimiter.middleware.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';
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

// Rotas públicas (usando asyncHandler para capturar erros assíncronos)
router.post('/register', registerLimiter, validateBody(registerBodySchema), asyncHandler(controller.register));
router.post('/login', loginLimiter, validateBody(loginBodySchema), asyncHandler(controller.login));
router.post('/refresh', loginLimiter, validateBody(refreshTokenBodySchema), asyncHandler(controller.refreshToken));

// Rotas protegidas (logout pode ser feito sem autenticação, apenas com refresh token válido)
router.post('/logout', validateBody(logoutBodySchema), asyncHandler(controller.logout));

export default router;
