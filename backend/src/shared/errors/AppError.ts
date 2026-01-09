import { ErrorCode, ErrorStatusMap, ErrorMessages } from './ErrorCatalog.js';

/**
 * Classe base de erro da aplicação
 * 
 * Todos os erros da aplicação devem estender AppError ou ser mapeados para AppError
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(
    code: ErrorCode,
    message?: string,
    statusCode?: number,
    details?: unknown,
    isOperational: boolean = true
  ) {
    const finalMessage = message || ErrorMessages[code];
    super(finalMessage);

    this.code = code;
    this.statusCode = statusCode || ErrorStatusMap[code];
    this.details = details;
    this.isOperational = isOperational;

    // Manter stack trace útil
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Converte AppError para formato de resposta HTTP
   */
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}
