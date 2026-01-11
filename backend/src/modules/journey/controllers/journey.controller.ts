import { Request, Response } from 'express';
import { ok, created } from '../../../shared/http/response.js';
import { JourneyService } from '../services/journey.service.js';
import logger from '../../../utils/logger.js';

export class JourneyController {
  constructor(private service: JourneyService) {}

  /**
   * POST /journey
   * Criar nova jornada
   */
  createJourney = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id!; // Já validado pelo middleware authenticate
    const { type, startDate, expectedDate } = req.body as {
      type: string;
      startDate: string | Date;
      expectedDate?: string | Date | null;
    };

    const journey = await this.service.createJourney(userId, { type, startDate, expectedDate });

    logger.info('Journey created', { userId, journeyId: journey.id, type: journey.type });

    created(res, journey);
  };

  /**
   * GET /journey
   * Listar jornadas do usuário autenticado
   */
  getJourneys = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id!; // Já validado pelo middleware authenticate

    const journeys = await this.service.getJourneys(userId);

    ok(res, journeys);
  };
}
