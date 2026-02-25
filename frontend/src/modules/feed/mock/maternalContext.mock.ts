/**
 * Mock de MaternalContext para desenvolvimento e testes do Feed B+
 * Substitui chamada à API até integração com backend.
 */

export const mockMaternalContext = {
  mode: 'PREGNANT',
  gestationalWeek: 24,
  trimester: 2,
  babyAgeMonths: null,
  isHighRisk: false,
  riskFlags: [] as string[],
  baseMood: 'ANXIOUS',
  contentFocus: 'PREGNANCY',
} as const;
