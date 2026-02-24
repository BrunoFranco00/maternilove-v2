import { z } from 'zod';

/**
 * POST /checkin - Body
 * Criar novo emotional checkin
 */
export const createCheckinBodySchema = z.object({
  mood: z.enum(['HAPPY', 'CALM', 'TIRED', 'ANXIOUS', 'SAD', 'OVERWHELMED'], {
    errorMap: () => ({ message: 'Mood inválido' }),
  }),
  note: z.string().max(500).optional(),
});
