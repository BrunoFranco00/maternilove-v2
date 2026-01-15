import { z } from 'zod';

/**
 * Schema de validação para completar onboarding
 */
export const completeOnboardingBodySchema = z.object({
  role: z.enum(['MOTHER', 'PROFESSIONAL', 'COMPANY'], {
    errorMap: () => ({ message: 'Role deve ser MOTHER, PROFESSIONAL ou COMPANY' }),
  }),
});
