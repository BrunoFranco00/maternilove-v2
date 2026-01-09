import { Request, Response, NextFunction } from 'express';
import { mapError } from '../shared/errors/mapError.js';
import { failFromAppError } from '../shared/http/response.js';
import logger from '../utils/logger.js';

/**
 * Error Handler global
 * 
 * Sempre responde no formato Alternativa A:
 * { success: false, error: "<code>", message: "<message>", details?: ..., requestId: "<id>" }
 * 
 * Em desenvolvimento, permite details.stack; em produção, não inclui stack.
 */
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Mapear erro para AppError padronizado
  const appError = mapError(err);

  // Log do erro
  if (appError.isOperational) {
    logger.warn(`AppError: ${appError.message}`, {
      code: appError.code,
      statusCode: appError.statusCode,
      path: req.path,
      requestId: req.context?.requestId,
    });
  } else {
    logger.error('Non-operational error', {
      code: appError.code,
      message: appError.message,
      statusCode: appError.statusCode,
      path: req.path,
      requestId: req.context?.requestId,
      stack: err instanceof Error ? err.stack : undefined,
    });
  }

  // Preparar detalhes (incluir stack apenas em desenvolvimento)
  let details: unknown = appError.details;
  if (process.env.NODE_ENV === 'development' && err instanceof Error && err.stack) {
    if (typeof appError.details === 'object' && appError.details !== null && !Array.isArray(appError.details)) {
      details = {
        ...(appError.details as Record<string, unknown>),
        stack: err.stack,
      };
    } else {
      details = {
        ...(appError.details ? { value: appError.details } : {}),
        stack: err.stack,
      };
    }
  } else {
    details = appError.details;
  }

  // Responder no formato padronizado
  failFromAppError(res, {
    code: appError.code,
    message: appError.message,
    statusCode: appError.statusCode,
    details,
  });
};
