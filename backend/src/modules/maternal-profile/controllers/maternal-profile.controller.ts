import { Request, Response } from 'express';
import { ok } from '../../../shared/http/response.js';
import { MaternalProfileService } from '../services/maternal-profile.service.js';

export class MaternalProfileController {
  constructor(private service: MaternalProfileService) {}

  /**
   * GET /api/v1/maternal-profile/status
   * Retorna score de completude, missingCritical, stage e flags de seções
   */
  getStatus = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const data = await this.service.getStatus(userId);
    ok(res, data);
  };

  /**
   * GET /api/v1/maternal-profile
   * Retorna perfil agregado (todas as seções)
   */
  getProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const data = await this.service.getProfile(userId);
    ok(res, data);
  };

  /**
   * PATCH /api/v1/maternal-profile
   * Atualiza seções parciais do perfil (upsert em transaction)
   */
  patchProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const body = req.body as Record<string, unknown>;
    const data = await this.service.patchProfile(userId, body);
    ok(res, data);
  };

  /**
   * GET /api/v1/maternal-profile/context
   * Retorna contexto para personalização (stage, contentFocus, recommendedTone, etc.)
   */
  getContext = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const data = await this.service.getContext(userId);
    ok(res, data);
  };
}
