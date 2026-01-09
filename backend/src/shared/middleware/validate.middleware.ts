import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';
import { ErrorCode } from '../errors/ErrorCatalog.js';

/**
 * Middleware para validar body da requisição
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
          code: e.code,
        }));

        next(
          new AppError(
            ErrorCode.VALIDATION_ERROR,
            'Erro de validação no corpo da requisição',
            400,
            { issues: details },
            true
          )
        );
      } else {
        next(error);
      }
    }
  };
}

/**
 * Middleware para validar query parameters
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query) as typeof req.query;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
          code: e.code,
        }));

        next(
          new AppError(
            ErrorCode.VALIDATION_ERROR,
            'Erro de validação nos parâmetros de consulta',
            400,
            { issues: details },
            true
          )
        );
      } else {
        next(error);
      }
    }
  };
}

/**
 * Middleware para validar route parameters
 */
export function validateParams(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.params = schema.parse(req.params) as typeof req.params;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
          code: e.code,
        }));

        next(
          new AppError(
            ErrorCode.VALIDATION_ERROR,
            'Erro de validação nos parâmetros da rota',
            400,
            { issues: details },
            true
          )
        );
      } else {
        next(error);
      }
    }
  };
}
