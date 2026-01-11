import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../repositories/BaseRepository.js';

export class JourneyRepository extends BaseRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Criar jornada
   */
  async create(data: { userId: string; type: string; startDate: Date; expectedDate?: Date | null }) {
    return this.prisma.journey.create({
      data: {
        userId: data.userId,
        type: data.type as any,
        startDate: data.startDate,
        expectedDate: data.expectedDate,
      },
      select: {
        id: true,
        userId: true,
        type: true,
        startDate: true,
        expectedDate: true,
        currentStage: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Buscar jornadas do usuário
   */
  async findByUser(userId: string) {
    return this.prisma.journey.findMany({
      where: { userId },
      select: {
        id: true,
        userId: true,
        type: true,
        startDate: true,
        expectedDate: true,
        currentStage: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Buscar jornada do usuário (como userId é unique, retorna no máximo 1)
   */
  async findByUserId(userId: string) {
    return this.prisma.journey.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        type: true,
        startDate: true,
        expectedDate: true,
        currentStage: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
