import { Router } from 'express';
import { validateBody } from '../../shared/middleware/validate.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { completeOnboardingBodySchema } from './validators/onboarding.validators.js';
import { prisma } from '../../config/prisma.js';
import { OnboardingRepository } from './repositories/onboarding.repository.js';
import { OnboardingService } from './services/onboarding.service.js';
import { OnboardingController } from './controllers/onboarding.controller.js';

const router = Router();

// Inicializar dependências
const repository = new OnboardingRepository(prisma);
const service = new OnboardingService(repository);
const controller = new OnboardingController(service);

// Rota protegida: completar onboarding
router.post(
  '/complete',
  authenticate,
  validateBody(completeOnboardingBodySchema),
  asyncHandler(controller.complete)
);

export default router;
