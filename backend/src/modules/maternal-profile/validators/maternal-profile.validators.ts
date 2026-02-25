import { z } from 'zod';

/** Validação básica de CPF: 11 dígitos (não valida algoritmo, não trava) */
const cpfOptional = z
  .string()
  .optional()
  .refine((v) => !v || /^\d{11}$/.test(v.replace(/\D/g, '')), {
    message: 'CPF deve conter 11 dígitos',
  })
  .transform((v) => (v ? v.replace(/\D/g, '') : undefined));

const score1to5 = z.number().int().min(1).max(5).optional();

const pregnancyStageEnum = z.enum(['TRYING', 'PREGNANT', 'POSTPARTUM', 'HAS_CHILD']);
const pregnancyTypeEnum = z.enum(['SINGLE', 'TWINS', 'MULTIPLE', 'UNKNOWN']);
const childSexEnum = z.enum(['FEMALE', 'MALE', 'UNKNOWN']);
const contentFocusEnum = z.enum(['PREGNANCY', 'NEWBORN', 'TODDLER_1_2', 'TODDLER_3_5', 'POSTPARTUM', 'GENERAL']);
const riskFlagEnum = z.enum(['DIABETES', 'HYPERTENSION', 'THYROID', 'ANEMIA', 'DEPRESSION', 'ANXIETY', 'OTHER']);
const moodTypeEnum = z.enum(['HAPPY', 'CALM', 'TIRED', 'ANXIOUS', 'SAD', 'OVERWHELMED']);

const personalSection = z
  .object({
    fullName: z.string().max(200).optional(),
    phone: z.string().max(50).optional(),
    cpf: cpfOptional,
    birthDate: z.union([z.string().datetime(), z.string().regex(/^\d{4}-\d{2}-\d{2}/)]).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
  })
  .strict()
  .optional();

const addressSection = z
  .object({
    postalCode: z.string().max(20).optional(),
    street: z.string().max(200).optional(),
    number: z.string().max(30).optional(),
    complement: z.string().max(200).optional(),
    neighborhood: z.string().max(100).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
  })
  .strict()
  .optional();

const pregnancySection = z
  .object({
    stage: pregnancyStageEnum.optional(),
    dueDate: z.union([z.string().datetime(), z.string().regex(/^\d{4}-\d{2}-\d{2}/)]).optional(),
    lastMenstrualPeriod: z.union([z.string().datetime(), z.string().regex(/^\d{4}-\d{2}-\d{2}/)]).optional(),
    gestationalWeek: z.number().int().min(0).max(45).optional(),
    gestationalDay: z.number().int().min(0).max(6).optional(),
    pregnancyType: pregnancyTypeEnum.optional(),
    isHighRisk: z.boolean().optional(),
    riskFlags: z.array(riskFlagEnum).optional(),
    preferredContentFocus: z.array(contentFocusEnum).optional(),
    locale: z.string().max(20).optional(),
    timeZone: z.string().max(50).optional(),
  })
  .strict()
  .optional();

const healthSection = z
  .object({
    conditions: z.array(z.string().max(200)).optional(),
    medications: z.array(z.string().max(200)).optional(),
    allergies: z.array(z.string().max(200)).optional(),
    hasPrenatalCare: z.boolean().optional(),
    prenatalCareNotes: z.string().max(500).optional(),
  })
  .strict()
  .optional();

const lifestyleSection = z
  .object({
    sleepQuality: score1to5,
    activityLevel: score1to5,
    nutritionFocus: z.string().max(300).optional(),
    supplements: z.array(z.string().max(200)).optional(),
  })
  .strict()
  .optional();

const emotionalSection = z
  .object({
    baselineMood: moodTypeEnum.optional(),
    stressLevel: score1to5,
    supportNetwork: score1to5,
    notes: z.string().max(500).optional(),
  })
  .strict()
  .optional();

const childSection = z
  .object({
    childName: z.string().max(200).optional(),
    childSex: childSexEnum.optional(),
    birthDate: z.union([z.string().datetime(), z.string().regex(/^\d{4}-\d{2}-\d{2}/)]).optional(),
    ageMonths: z.number().int().min(0).max(72).optional(),
    notes: z.string().max(500).optional(),
  })
  .strict()
  .optional();

/**
 * PATCH /api/v1/maternal-profile - Body parcial
 * Aceita seções opcionais para upsert progressivo
 */
export const patchMaternalProfileBodySchema = z
  .object({
    personal: personalSection,
    address: addressSection,
    pregnancy: pregnancySection,
    health: healthSection,
    lifestyle: lifestyleSection,
    emotional: emotionalSection,
    child: childSection,
  })
  .strict();
