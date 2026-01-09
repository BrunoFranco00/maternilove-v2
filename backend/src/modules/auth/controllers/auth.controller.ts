import { Request, Response } from 'express';
import { ok, created } from '../../../shared/http/response.js';
import { AuthService } from '../services/auth.service.js';
import logger from '../../../utils/logger.js';

export class AuthController {
  constructor(private service: AuthService) {}

  /**
   * POST /register
   */
  register = async (req: Request, res: Response): Promise<void> => {
    // Body já validado pelo middleware validateBody
    const { email, password, name } = req.body as { email: string; password: string; name: string };
    
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.socket.remoteAddress;

    const result = await this.service.register({ email, password, name }, userAgent, ipAddress);

    logger.info('User registered', { email: result.user.email, userId: result.user.id });

    created(res, result);
  };

  /**
   * POST /login
   */
  login = async (req: Request, res: Response): Promise<void> => {
    // Body já validado pelo middleware validateBody
    const { email, password } = req.body as { email: string; password: string };

    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.socket.remoteAddress;

    const result = await this.service.login({ email, password }, userAgent, ipAddress);

    logger.info('User logged in', { email: result.user.email, userId: result.user.id });

    ok(res, result);
  };

  /**
   * POST /refresh
   */
  refreshToken = async (req: Request, res: Response): Promise<void> => {
    // Body já validado pelo middleware validateBody
    const { refreshToken } = req.body as { refreshToken: string };

    const result = await this.service.refreshToken(refreshToken);

    logger.info('Token refreshed', { requestId: req.context?.requestId });

    ok(res, result);
  };

  /**
   * POST /logout
   */
  logout = async (req: Request, res: Response): Promise<void> => {
    // Body já validado pelo middleware validateBody
    const { refreshToken } = req.body as { refreshToken: string };

    await this.service.logout(refreshToken);

    // Logout pode ser feito sem estar autenticado (usa refresh token)
    const userId = req.user?.id || 'unknown';
    logger.info('User logged out', { userId, requestId: req.context?.requestId });

    ok(res, { success: true });
  };
}
