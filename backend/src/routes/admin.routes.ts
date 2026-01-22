import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../shared/middleware/authorize.middleware.js';

const router = Router();

router.get(
  '/users',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  adminController.listUsers
);

router.patch(
  '/users/:id/role',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  adminController.updateUserRole
);

export default router;
