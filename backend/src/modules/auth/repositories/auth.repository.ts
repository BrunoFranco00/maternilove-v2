import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../repositories/BaseRepository.js';
import crypto from 'crypto';

export class AuthRepository extends BaseRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Criar sessão de autenticação
   */
  async createSession(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
    userAgent?: string,
    ipAddress?: string
  ) {
    return this.prisma.authSession.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
        userAgent,
        ipAddress,
      },
    });
  }

  /**
   * Buscar sessão por token hash
   */
  async findSessionByTokenHash(tokenHash: string) {
    return this.prisma.authSession.findUnique({
      where: { tokenHash },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            status: true,
          },
        },
      },
    });
  }

  /**
   * Revogar sessão
   */
  async revokeSession(sessionId: string) {
    return this.prisma.authSession.update({
      where: { id: sessionId },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  /**
   * Atualizar hash do token de uma sessão
   */
  async updateSessionTokenHash(sessionId: string, tokenHash: string) {
    return this.prisma.authSession.update({
      where: { id: sessionId },
      data: { tokenHash },
    });
  }

  /**
   * Revogar todas as sessões de um usuário (exceto a atual)
   */
  async revokeAllUserSessions(userId: string, excludeSessionId?: string) {
    const where: any = {
      userId,
      revokedAt: null,
    };

    if (excludeSessionId) {
      where.id = { not: excludeSessionId };
    }

    return this.prisma.authSession.updateMany({
      where,
      data: {
        revokedAt: new Date(),
      },
    });
  }

  /**
   * Gerar hash de token
   */
  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Buscar usuário por email
   */
  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        status: true,
      },
    });
  }

  /**
   * Criar usuário
   */
  async createUser(email: string, hashedPassword: string, name: string) {
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }

  /**
   * Verificar se usuário existe
   */
  async userExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!user;
  }

  /**
   * Limpar sessões expiradas (útil para job de limpeza)
   */
  async cleanupExpiredSessions() {
    return this.prisma.authSession.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
