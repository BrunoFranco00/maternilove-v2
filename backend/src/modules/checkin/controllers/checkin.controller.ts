import { Request, Response } from 'express';
import { ok, created } from '../../../shared/http/response.js';
import { CheckinService } from '../services/checkin.service.js';
import logger from '../../../utils/logger.js';

export class CheckinController {
  constructor(private service: CheckinService) {}

  /**
   * POST /checkin
   * Criar novo emotional checkin
   */
  createCheckin = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id!;
    const { mood, note } = req.body as { mood: string; note?: string | null };

    const checkin = await this.service.createCheckin(userId, { mood: mood as any, note });

    logger.info('Emotional checkin created', { userId, checkinId: checkin.id, mood: checkin.mood });

    created(res, checkin);
  };

  /**
   * GET /checkin/latest
   * Buscar último checkin do usuário
   */
  getLatest = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id!;

    const checkin = await this.service.getLatest(userId);

    ok(res, checkin);
  };

  /**
   * GET /checkin
   * Listar histórico de checkins do usuário
   */
  getHistory = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id!;

    const checkins = await this.service.getHistory(userId);

    ok(res, checkins);
  };
}
