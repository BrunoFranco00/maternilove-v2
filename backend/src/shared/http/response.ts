import { Response, Request } from 'express';

/**
 * Metadata opcional para respostas paginadas ou com informações adicionais
 */
export interface ResponseMeta {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  [key: string]: unknown;
}

/**
 * Helper para resposta de sucesso (200)
 */
export function ok<T>(res: Response, data: T, meta?: ResponseMeta): Response {
  const requestId = (res.req as Request).context?.requestId || 'unknown';

  return res.status(200).json({
    success: true,
    data,
    ...(meta && { meta }),
    requestId,
  });
}

/**
 * Helper para resposta de criação (201)
 */
export function created<T>(res: Response, data: T, meta?: ResponseMeta): Response {
  const requestId = (res.req as Request).context?.requestId || 'unknown';

  return res.status(201).json({
    success: true,
    data,
    ...(meta && { meta }),
    requestId,
  });
}

/**
 * Helper para resposta de erro (Alternativa A)
 */
export function fail(
  res: Response,
  error: {
    error: string;
    message: string;
    details?: unknown;
  },
  statusCode: number = 500
): Response {
  const requestId = (res.req as Request).context?.requestId || 'unknown';

  const response: {
    success: boolean;
    error: string;
    message: string;
    details?: unknown;
    requestId: string;
  } = {
    success: false,
    error: error.error,
    message: error.message,
    requestId,
  };

  if (error.details) {
    response.details = error.details;
  }

  return res.status(statusCode).json(response);
}

/**
 * Helper para resposta de erro a partir de AppError
 */
export function failFromAppError(res: Response, appError: { code: string; message: string; statusCode: number; details?: unknown }): Response {
  return fail(
    res,
    {
      error: appError.code,
      message: appError.message,
      details: appError.details,
    },
    appError.statusCode
  );
}
