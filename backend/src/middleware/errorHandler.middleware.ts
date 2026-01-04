import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { ValidationError as ZodValidationError } from 'zod';
import logger from '../utils/logger.js';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Tratar erros de validação do Zod
  if (err instanceof ZodValidationError) {
    logger.warn(`Validation error: ${err.message}`, { path: req.path });
    return res.status(400).json({
      success: false,
      error: {
        message: err.errors.map(e => e.message).join(', '),
      },
    });
  }

  if (err instanceof AppError) {
    logger.warn(`AppError: ${err.message}`, { statusCode: err.statusCode, path: req.path });
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      },
    });
  }

  // Erro não esperado
  logger.error('Unexpected error', { error: err, stack: err.stack, path: req.path });
  
  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};
