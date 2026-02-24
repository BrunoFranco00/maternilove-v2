import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateBody } from '../../shared/middleware/validate.middleware.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { createCheckinBodySchema } from './validators/checkin.validators.js';
import { prisma } from '../../config/prisma.js';
import { CheckinRepository } from './repositories/checkin.repository.js';
import { CheckinService } from './services/checkin.service.js';
import { CheckinController } from './controllers/checkin.controller.js';

const router = Router();

// Inicializar dependências
const repository = new CheckinRepository(prisma);
const service = new CheckinService(repository);
const controller = new CheckinController(service);

// Rotas protegidas (requer autenticação)
router.post('/', authenticate, validateBody(createCheckinBodySchema), asyncHandler(controller.createCheckin));
router.get('/latest', authenticate, asyncHandler(controller.getLatest));
router.get('/', authenticate, asyncHandler(controller.getHistory));

export default router;
