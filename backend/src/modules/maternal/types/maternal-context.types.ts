import type { PregnancyStage, JourneyType, ContentFocus, RiskFlag, MoodType } from '@prisma/client';

/**
 * Contexto materno central para personalização.
 * Usado pelo MaternalContextService como output do buildMaternalContext.
 */
export interface MaternalContext {
  mode: PregnancyStage;
  gestationalWeek: number | null;
  gestationalDay: number | null;
  babyAgeMonths: number | null;
  trimester: 1 | 2 | 3 | null;
  isHighRisk: boolean | null;
  riskFlags: RiskFlag[];
  baseMood: MoodType | null;
  journeyType: JourneyType | null;
  contentFocus: ContentFocus[];
}
