import { UserRole } from '@prisma/client';
import { AppError } from '../../../shared/errors/AppError.js';
import { ErrorCode } from '../../../shared/errors/ErrorCatalog.js';
import { OnboardingRepository } from '../repositories/onboarding.repository.js';

export class OnboardingService {
  constructor(private repository: OnboardingRepository) {}

  /**
   * Completar onboarding do usuário
   */
  async completeOnboarding(userId: string, role: UserRole) {
    // Buscar usuário
    const user = await this.repository.findUserById(userId);
    
    if (!user) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Usuário não encontrado');
    }

    // Verificar se onboarding já foi completado
    if (user.onboardingCompleted) {
      throw new AppError(ErrorCode.CONFLICT, 'Onboarding já foi completado');
    }

    // Validar que role fornecido é válido para onboarding
    const validOnboardingRoles: UserRole[] = ['MOTHER', 'PROFESSIONAL', 'COMPANY'];
    if (!validOnboardingRoles.includes(role)) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        'Role deve ser MOTHER, PROFESSIONAL ou COMPANY'
      );
    }

    // Completar onboarding
    const updatedUser = await this.repository.completeOnboarding(userId, role);

    return {
      user: updatedUser,
      message: 'Onboarding completado com sucesso',
    };
  }
}
