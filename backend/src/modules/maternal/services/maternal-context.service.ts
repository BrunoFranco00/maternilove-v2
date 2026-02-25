/**
 * MaternalContextService — Serviço central de contexto materno para personalização.
 * Não substitui orientação médica.
 */

import { prisma } from '../../../config/prisma.js';
import type {
  PregnancyStage,
  JourneyType,
  ContentFocus,
  RiskFlag,
} from '@prisma/client';
import type { MaternalContext } from '../types/maternal-context.types.js';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const AVG_WEEKS_PREGNANCY = 40;

function daysBetween(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / MS_PER_DAY);
}

function monthsBetween(from: Date, to: Date): number {
  const days = daysBetween(from, to);
  return Math.floor(days / 30.44); // ~30.44 days/month average
}

/**
 * Constrói o contexto materno agregado para personalização.
 * Busca MaternalProfile, ChildProfile, Journey e MaternalEmotional.
 */
export async function buildMaternalContext(userId: string): Promise<MaternalContext> {
  const [maternalProfile, childProfile, journey, emotional] = await Promise.all([
    prisma.maternalProfile.findUnique({ where: { userId } }),
    prisma.childProfile.findUnique({ where: { userId } }),
    prisma.journey.findUnique({ where: { userId } }),
    prisma.maternalEmotional.findUnique({ where: { userId } }),
  ]);

  const now = new Date();
  const mode: PregnancyStage = maternalProfile?.stage ?? 'HAS_CHILD';
  let gestationalWeek: number | null = maternalProfile?.gestationalWeek ?? null;
  let gestationalDay: number | null = maternalProfile?.gestationalDay ?? null;
  let trimester: 1 | 2 | 3 | null = null;
  let babyAgeMonths: number | null = childProfile?.ageMonths ?? null;
  let contentFocus: ContentFocus[] =
    maternalProfile?.preferredContentFocus?.length
      ? [...maternalProfile.preferredContentFocus]
      : [];

  // ---- PREGNANT ----
  if (mode === 'PREGNANT') {
    // Estimativa por dueDate
    if (maternalProfile?.dueDate) {
      const dueDate = maternalProfile.dueDate instanceof Date
        ? maternalProfile.dueDate
        : new Date(maternalProfile.dueDate);
      const daysRemaining = daysBetween(now, dueDate);
      const weeksRemaining = daysRemaining / 7;
      const estimatedWeek = AVG_WEEKS_PREGNANCY - weeksRemaining;
      if (gestationalWeek == null || gestationalWeek === 0) {
        gestationalWeek = Math.max(0, Math.min(45, Math.round(estimatedWeek)));
        gestationalDay = Math.round((weeksRemaining % 1) * 7) % 7;
      }
    }

    // Estimativa por lastMenstrualPeriod (sobrescreve se existir e não tiver dueDate ou preferir)
    if (maternalProfile?.lastMenstrualPeriod) {
      const lmp =
        maternalProfile.lastMenstrualPeriod instanceof Date
          ? maternalProfile.lastMenstrualPeriod
          : new Date(maternalProfile.lastMenstrualPeriod);
      const days = daysBetween(lmp, now);
      gestationalWeek = Math.floor(days / 7);
      gestationalDay = days % 7;
    }

    // Trimester
    if (gestationalWeek != null) {
      if (gestationalWeek >= 0 && gestationalWeek <= 13) trimester = 1;
      else if (gestationalWeek >= 14 && gestationalWeek <= 27) trimester = 2;
      else if (gestationalWeek >= 28) trimester = 3;
    }

    if (contentFocus.length === 0) {
      contentFocus = ['PREGNANCY'];
    }
  }

  // ---- POSTPARTUM ----
  if (mode === 'POSTPARTUM') {
    const birthDate = childProfile?.birthDate;
    if (birthDate) {
      const birth =
        birthDate instanceof Date ? birthDate : new Date(birthDate);
      babyAgeMonths = Math.max(0, monthsBetween(birth, now));
    }
    if (contentFocus.length === 0) {
      const age = babyAgeMonths ?? 0;
      contentFocus = age <= 3 ? ['NEWBORN', 'POSTPARTUM'] : ['POSTPARTUM'];
    }
  }

  // ---- HAS_CHILD ----
  // Mapeamento idade (meses) → ContentFocus: 0–3=NEWBORN, 3–6=NEWBORN, 6–12=NEWBORN,
  // 12–24=TODDLER_1_2, 24–36=TODDLER_1_2, 36–60=TODDLER_3_5
  if (mode === 'HAS_CHILD') {
    const birthDate = childProfile?.birthDate;
    if (birthDate) {
      const birth =
        birthDate instanceof Date ? birthDate : new Date(birthDate);
      babyAgeMonths = Math.max(0, monthsBetween(birth, now));
    }
    if (contentFocus.length === 0 && babyAgeMonths != null) {
      const age = babyAgeMonths;
      if (age < 12) contentFocus = ['NEWBORN', 'GENERAL'];
      else if (age < 36) contentFocus = ['TODDLER_1_2', 'GENERAL'];
      else if (age < 60) contentFocus = ['TODDLER_3_5', 'GENERAL'];
      else contentFocus = ['GENERAL'];
    }
    if (contentFocus.length === 0) contentFocus = ['GENERAL'];
  }

  // ---- TRYING ou fallback ----
  if ((mode === 'TRYING' || contentFocus.length === 0) && contentFocus.length === 0) {
    contentFocus = ['GENERAL'];
  }

  const journeyType: JourneyType | null = journey?.type ?? null;

  const ctx: MaternalContext = {
    mode,
    gestationalWeek,
    gestationalDay,
    babyAgeMonths,
    trimester,
    isHighRisk: maternalProfile?.isHighRisk ?? null,
    riskFlags: maternalProfile?.riskFlags ?? [],
    baseMood: emotional?.baselineMood ?? null,
    journeyType,
    contentFocus,
  };

  return ctx;
}
