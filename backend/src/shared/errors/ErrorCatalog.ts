/**
 * Catálogo de códigos de erro estáveis e seus status HTTP padrão
 * 
 * Padrão: {MODULO}_{TIPO}
 * Exemplo: AUTH_UNAUTHORIZED, VALIDATION_ERROR
 */
export enum ErrorCode {
  // Autenticação e Autorização
  AUTH_UNAUTHORIZED = 'AUTH_UNAUTHORIZED',
  AUTH_FORBIDDEN = 'AUTH_FORBIDDEN',
  AUTH_TOKEN_INVALID = 'AUTH_TOKEN_INVALID',
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_MISSING = 'AUTH_TOKEN_MISSING',

  // Validação
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  // Recursos
  NOT_FOUND = 'NOT_FOUND',

  // Conflitos
  CONFLICT = 'CONFLICT',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',

  // Rate Limiting
  RATE_LIMITED = 'RATE_LIMITED',

  // Erros Internos
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
}

/**
 * Mapeamento de códigos de erro para status HTTP padrão
 */
export const ErrorStatusMap: Record<ErrorCode, number> = {
  [ErrorCode.AUTH_UNAUTHORIZED]: 401,
  [ErrorCode.AUTH_FORBIDDEN]: 403,
  [ErrorCode.AUTH_TOKEN_INVALID]: 401,
  [ErrorCode.AUTH_TOKEN_EXPIRED]: 401,
  [ErrorCode.AUTH_TOKEN_MISSING]: 401,
  [ErrorCode.VALIDATION_ERROR]: 400,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.CONFLICT]: 409,
  [ErrorCode.DUPLICATE_ENTRY]: 409,
  [ErrorCode.RATE_LIMITED]: 429,
  [ErrorCode.INTERNAL_ERROR]: 500,
  [ErrorCode.DATABASE_ERROR]: 500,
};

/**
 * Mensagens padrão para códigos de erro
 */
export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.AUTH_UNAUTHORIZED]: 'Não autenticado',
  [ErrorCode.AUTH_FORBIDDEN]: 'Acesso negado',
  [ErrorCode.AUTH_TOKEN_INVALID]: 'Token inválido',
  [ErrorCode.AUTH_TOKEN_EXPIRED]: 'Token expirado',
  [ErrorCode.AUTH_TOKEN_MISSING]: 'Token não fornecido',
  [ErrorCode.VALIDATION_ERROR]: 'Erro de validação',
  [ErrorCode.NOT_FOUND]: 'Recurso não encontrado',
  [ErrorCode.CONFLICT]: 'Conflito na operação',
  [ErrorCode.DUPLICATE_ENTRY]: 'Registro duplicado',
  [ErrorCode.RATE_LIMITED]: 'Muitas requisições. Tente novamente mais tarde.',
  [ErrorCode.INTERNAL_ERROR]: 'Erro interno do servidor',
  [ErrorCode.DATABASE_ERROR]: 'Erro no banco de dados',
};
