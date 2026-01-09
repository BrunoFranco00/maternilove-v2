import { ZodError } from 'zod';
import { AppError } from './AppError.js';
import { ErrorCode } from './ErrorCatalog.js';
import logger from '../../utils/logger.js';

/**
 * Mapeia qualquer erro para AppError padronizado
 * 
 * @param error - Erro a ser mapeado
 * @returns AppError padronizado
 */
export function mapError(error: unknown): AppError {
  // Se já é AppError, retorna direto
  if (error instanceof AppError) {
    return error;
  }

  // Se é ZodError (validação), converte para AppError com detalhes
  if (error instanceof ZodError) {
    const details = error.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
      code: e.code,
    }));

    return new AppError(
      ErrorCode.VALIDATION_ERROR,
      'Erro de validação nos dados fornecidos',
      400,
      { issues: details },
      true
    );
  }

  // Se é Error padrão do JavaScript
  if (error instanceof Error) {
    // Log de erro não esperado
    logger.error('Unexpected error mapped to AppError', {
      error: error.message,
      stack: error.stack,
    });

    return new AppError(
      ErrorCode.INTERNAL_ERROR,
      error.message || 'Erro interno do servidor',
      500,
      undefined,
      false // Erros não esperados não são operacionais
    );
  }

  // Erro desconhecido (não Error, não AppError)
  logger.error('Unknown error type mapped to AppError', { error });

  return new AppError(
    ErrorCode.INTERNAL_ERROR,
    'Erro interno do servidor',
    500,
    { originalError: String(error) },
    false
  );
}
