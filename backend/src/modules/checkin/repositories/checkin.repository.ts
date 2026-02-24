import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../repositories/BaseRepository.js';
import { MoodType } from '@prisma/client';

export class CheckinRepository extends BaseRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Criar emotional checkin
   */
  async create(data: { userId: string; mood: MoodType; note?: string | null }) {
    return this.prisma.emotionalCheckin.create({
      data: {
        userId: data.userId,
        mood: data.mood,
        note: data.note ?? null,
      },
      select: {
        id: true,
        userId: true,
        mood: true,
        note: true,
        createdAt: true,
      },
    });
  }

  /**
   * Buscar último checkin do usuário
   */
  async findLatest(userId: string) {
    return this.prisma.emotionalCheckin.findFirst({
      where: { userId },
      select: {
        id: true,
        userId: true,
        mood: true,
        note: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Buscar histórico de checkins do usuário
   */
  async findByUser(userId: string, limit: number = 50) {
    return this.prisma.emotionalCheckin.findMany({
      where: { userId },
      select: {
        id: true,
        userId: true,
        mood: true,
        note: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
