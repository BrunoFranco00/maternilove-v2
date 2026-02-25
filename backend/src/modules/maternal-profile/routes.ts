import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateBody } from '../../shared/middleware/validate.middleware.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { patchMaternalProfileBodySchema } from './validators/maternal-profile.validators.js';
import { prisma } from '../../config/prisma.js';
import { MaternalProfileRepository } from './repositories/maternal-profile.repository.js';
import { MaternalProfileService } from './services/maternal-profile.service.js';
import { MaternalProfileController } from './controllers/maternal-profile.controller.js';

const router = Router();

const repository = new MaternalProfileRepository(prisma);
const service = new MaternalProfileService(repository);
const controller = new MaternalProfileController(service);

router.get('/status', authenticate, asyncHandler(controller.getStatus));
router.get('/', authenticate, asyncHandler(controller.getProfile));
router.patch(
  '/',
  authenticate,
  validateBody(patchMaternalProfileBodySchema),
  asyncHandler(controller.patchProfile)
);
router.get('/context', authenticate, asyncHandler(controller.getContext));

export default router;
