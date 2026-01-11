import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../shared/errors/AppError.js';
import { ErrorCode } from '../shared/errors/ErrorCatalog.js';

/**
 * Middleware de autenticação JWT
 * 
 * Verifica token Bearer e injeta req.user com dados do token
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(ErrorCode.AUTH_TOKEN_MISSING);
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    // Mapear userId do token para id no req.user
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role as 'USER' | 'MOTHER' | 'PROFESSIONAL' | 'COMPANY' | 'ADMIN' | 'SUPER_ADMIN',
    };
    next();
  } catch (error) {
    // Se erro é AppError, passa direto
    if (error instanceof AppError) {
      return next(error);
    }
    // Senão, mapeia para token inválido/expirado
    next(new AppError(ErrorCode.AUTH_TOKEN_INVALID));
  }
};

/**
 * Middleware de autorização por role
 * 
 * Verifica se usuário tem uma das roles especificadas
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError(ErrorCode.AUTH_UNAUTHORIZED));
    }

    if (!req.user.role || !roles.includes(req.user.role)) {
      return next(new AppError(ErrorCode.AUTH_FORBIDDEN));
    }

    next();
  };
};
