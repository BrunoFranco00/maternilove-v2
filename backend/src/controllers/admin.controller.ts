import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AppError } from '../shared/errors/AppError.js';
import { ErrorCode } from '../shared/errors/ErrorCatalog.js';
import logger from '../utils/logger.js';

const ALLOWED_ROLES = ['USER', 'TESTER'] as const;
type AllowedRole = typeof ALLOWED_ROLES[number];

interface UpdateRoleRequest {
  role: AllowedRole;
}

export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    logger.error('Error listing users', { error });
    next(error);
  }
};

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body as UpdateRoleRequest;

    if (!role) {
      return next(new AppError(ErrorCode.VALIDATION_ERROR, 'Role é obrigatória'));
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return next(new AppError(ErrorCode.VALIDATION_ERROR, `Role deve ser uma das seguintes: ${ALLOWED_ROLES.join(', ')}`));
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true, deletedAt: true },
    });

    if (!existingUser) {
      return next(new AppError(ErrorCode.NOT_FOUND, 'Usuário não encontrado'));
    }

    if (existingUser.deletedAt) {
      return next(new AppError(ErrorCode.NOT_FOUND, 'Usuário não encontrado'));
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        role: role as 'USER' | 'TESTER',
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    logger.info('User role updated', {
      userId: id,
      oldRole: existingUser.role,
      newRole: role,
      updatedBy: req.user?.id,
    });

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    logger.error('Error updating user role', { error, userId: req.params.id });
    next(error);
  }
};
