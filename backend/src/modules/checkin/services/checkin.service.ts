import { MoodType } from '@prisma/client';
import { CheckinRepository } from '../repositories/checkin.repository.js';

export class CheckinService {
  constructor(private repository: CheckinRepository) {}

  /**
   * Criar emotional checkin
   */
  async createCheckin(userId: string, data: { mood: MoodType; note?: string | null }) {
    const checkin = await this.repository.create({
      userId,
      mood: data.mood,
      note: data.note ?? null,
    });
    return checkin;
  }

  /**
   * Buscar último checkin do usuário
   */
  async getLatest(userId: string) {
    return this.repository.findLatest(userId);
  }

  /**
   * Buscar histórico de checkins (últimos 50)
   */
  async getHistory(userId: string) {
    return this.repository.findByUser(userId, 50);
  }
}
