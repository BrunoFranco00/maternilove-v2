import { Request, Response } from 'express';
import { OnboardingService } from '../services/onboarding.service.js';
import logger from '../../../utils/logger.js';

export class OnboardingController {
  constructor(private service: OnboardingService) {}

  /**
   * Completar onboarding
   * POST /api/v1/onboarding/complete
   */
  complete = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const { role } = req.body as { role: string };

    const result = await this.service.completeOnboarding(userId, role as any);

    logger.info('Onboarding completado', {
      userId,
      role,
      requestId: req.context?.requestId,
    });

    res.status(200).json({
      success: true,
      data: result,
      requestId: req.context?.requestId,
    });
  };
}
