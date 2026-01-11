import { z } from 'zod';

/**
 * POST /journey - Body
 * Criar nova jornada
 */
export const createJourneyBodySchema = z.object({
  type: z.enum(['PREGNANCY', 'POSTPARTUM', 'BABY_0_3M', 'BABY_3_6M', 'BABY_6_12M', 'BABY_1_2Y', 'BABY_2_3Y', 'BABY_3_5Y'], {
    errorMap: () => ({ message: 'Tipo de jornada inválido' }),
  }),
  startDate: z.string().datetime('Data de início inválida. Use formato ISO 8601').or(z.date()),
  expectedDate: z.string().datetime('Data esperada inválida. Use formato ISO 8601').or(z.date()).optional(),
});
