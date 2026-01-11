import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import { ErrorCode } from '../errors/ErrorCatalog.js';

/**
 * Middleware de autorização por role (RBAC)
 * 
 * Verifica se o usuário autenticado tem uma das roles permitidas.
 * Deve ser usado APÓS o middleware `authenticate`.
 * 
 * @param allowedRoles - Array de roles permitidas
 * @returns Middleware que retorna 403 (AUTH_FORBIDDEN) se o usuário não tiver a role permitida
 * 
 * @example
 * // Permitir apenas ADMIN
 * router.get('/admin/logs', authenticate, authorize('ADMIN'), controller.listLogs);
 * 
 * @example
 * // Permitir ADMIN ou PROFESSIONAL
 * router.get('/professional/dashboard', authenticate, authorize('ADMIN', 'PROFESSIONAL'), controller.dashboard);
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    // Verificar se usuário está autenticado
    if (!req.user) {
      return next(new AppError(ErrorCode.AUTH_UNAUTHORIZED, 'Usuário não autenticado'));
    }

    // Verificar se usuário tem role
    const userRole = req.user.role;
    if (!userRole) {
      return next(new AppError(ErrorCode.AUTH_FORBIDDEN, 'Acesso negado: role não definida'));
    }

    // Verificar se role do usuário está na lista de roles permitidas
    if (!allowedRoles.includes(userRole)) {
      return next(new AppError(ErrorCode.AUTH_FORBIDDEN, `Acesso negado: requer uma das roles [${allowedRoles.join(', ')}]`));
    }

    next();
  };
};
