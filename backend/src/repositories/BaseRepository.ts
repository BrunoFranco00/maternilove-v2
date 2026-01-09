import { PrismaClient } from '@prisma/client';

/**
 * Base Repository com Prisma injetado
 * 
 * Repositórios específicos devem estender esta classe
 */
export class BaseRepository {
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Helper básico para buscar por ID (opcional)
   * 
   * @param model - Modelo do Prisma (ex: prisma.user)
   * @param id - ID do registro
   * @returns Registro encontrado ou null
   */
  protected async findById<T>(model: { findUnique: (args: { where: { id: string } }) => Promise<T | null> }, id: string): Promise<T | null> {
    return model.findUnique({ where: { id } });
  }
}
