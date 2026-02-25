/**
 * Mock: calcula percentual de completude do perfil materno.
 * Baseado em: pregnancy (dueDate, stage), health, lifestyle, emotional, child.
 */

export interface MockProfileData {
  dueDate?: string | null;
  stage?: string | null;
  gestationalWeek?: number | null;
  /** Campos de saúde preenchidos */
  health?: {
    conditions?: string[];
    medications?: string[];
    allergies?: string[];
    hasPrenatalCare?: boolean | null;
  } | null;
  /** Campos de estilo de vida */
  lifestyle?: {
    sleepQuality?: number | null;
    activityLevel?: number | null;
    nutritionFocus?: string | null;
  } | null;
  /** Campos emocionais */
  emotional?: {
    baselineMood?: string | null;
    stressLevel?: number | null;
    supportNetwork?: number | null;
  } | null;
  /** Dados do filho */
  child?: {
    childName?: string | null;
    birthDate?: string | null;
    ageMonths?: number | null;
  } | null;
  /** Dados pessoais */
  personal?: {
    fullName?: string | null;
    phone?: string | null;
  } | null;
}

export function calculateProfileCompletion(profileData: MockProfileData): number {
  let score = 0;
  const weights: { key: keyof MockProfileData; max: number; check: (v: unknown) => boolean }[] = [
    { key: 'stage', max: 15, check: (v) => !!v && String(v).length > 0 },
    { key: 'dueDate', max: 10, check: (v) => !!v },
    { key: 'gestationalWeek', max: 5, check: (v) => v != null && typeof v === 'number' },
    {
      key: 'health',
      max: 20,
      check: (v) => {
        const h = v as MockProfileData['health'];
        if (!h) return false;
        return !!(
          (h.conditions?.length ?? 0) > 0 ||
          (h.medications?.length ?? 0) > 0 ||
          (h.allergies?.length ?? 0) > 0 ||
          h.hasPrenatalCare != null
        );
      },
    },
    {
      key: 'lifestyle',
      max: 15,
      check: (v) => {
        const l = v as MockProfileData['lifestyle'];
        if (!l) return false;
        return !!(l.sleepQuality != null || l.activityLevel != null || l.nutritionFocus);
      },
    },
    {
      key: 'emotional',
      max: 15,
      check: (v) => {
        const e = v as MockProfileData['emotional'];
        if (!e) return false;
        return !!(e.baselineMood || e.stressLevel != null || e.supportNetwork != null);
      },
    },
    {
      key: 'child',
      max: 10,
      check: (v) => {
        const c = v as MockProfileData['child'];
        if (!c) return false;
        return !!(c.childName || c.birthDate || c.ageMonths != null);
      },
    },
    {
      key: 'personal',
      max: 10,
      check: (v) => {
        const p = v as MockProfileData['personal'];
        if (!p) return false;
        return !!(p.fullName || p.phone);
      },
    },
  ];

  for (const { key, max, check } of weights) {
    if (check(profileData[key])) score += max;
  }

  return Math.min(100, Math.round(score));
}
