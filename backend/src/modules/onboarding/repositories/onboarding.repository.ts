import { PrismaClient, UserRole } from '@prisma/client';

export class OnboardingRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Buscar usuário por ID
   */
  async findUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        onboardingCompleted: true,
        onboardingRole: true,
        onboardingAt: true,
      },
    });
  }

  /**
   * Completar onboarding do usuário
   */
  async completeOnboarding(
    userId: string,
    onboardingRole: UserRole
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: true,
        onboardingRole,
        onboardingAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        onboardingCompleted: true,
        onboardingRole: true,
        onboardingAt: true,
      },
    });
  }
}
