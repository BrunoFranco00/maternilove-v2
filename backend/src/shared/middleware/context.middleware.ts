import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/**
 * Valores padrão para contexto global
 */
const DEFAULT_LOCALE = 'pt-BR';
const DEFAULT_TIMEZONE = 'America/Sao_Paulo';

/**
 * Middleware que injeta contexto global na requisição
 * 
 * - Gera requestId único (UUID) por requisição
 * - Lê headers opcionais: X-Locale e X-Timezone
 * - Define defaults: locale = "pt-BR", timeZone = "America/Sao_Paulo"
 * - Injeta req.context = { requestId, locale, timeZone }
 */
export function contextMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Gerar requestId único
  const requestId = randomUUID();

  // Ler headers opcionais
  const locale = (req.headers['x-locale'] as string) || DEFAULT_LOCALE;
  const timeZone = (req.headers['x-timezone'] as string) || DEFAULT_TIMEZONE;

  // Injetar contexto na requisição
  req.context = {
    requestId,
    locale,
    timeZone,
  };

  next();
}
