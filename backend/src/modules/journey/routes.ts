import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateBody } from '../../shared/middleware/validate.middleware.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { createJourneyBodySchema } from './validators/journey.validators.js';
import { prisma } from '../../config/prisma.js';
import { JourneyRepository } from './repositories/journey.repository.js';
import { JourneyService } from './services/journey.service.js';
import { JourneyController } from './controllers/journey.controller.js';

const router = Router();

// Inicializar dependências
const repository = new JourneyRepository(prisma);
const service = new JourneyService(repository);
const controller = new JourneyController(service);

// Rotas protegidas (requer autenticação)
router.post('/', authenticate, validateBody(createJourneyBodySchema), asyncHandler(controller.createJourney));
router.get('/', authenticate, asyncHandler(controller.getJourneys));

export default router;
