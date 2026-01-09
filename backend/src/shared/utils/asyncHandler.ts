import { Request, Response, NextFunction } from 'express';

/**
 * Wrapper para handlers async que captura erros automaticamente
 * 
 * Permite usar async/await em controllers sem precisar de try/catch
 * Erros são automaticamente passados para o error handler via next()
 * 
 * Suporta tanto funções que recebem (req, res, next) quanto (req, res)
 */
export function asyncHandler(
  fn: ((req: Request, res: Response, next?: NextFunction) => Promise<void>) | ((req: Request, res: Response) => Promise<void>)
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
