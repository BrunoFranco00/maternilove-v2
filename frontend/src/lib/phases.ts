/**
 * Fases do ciclo materno — preparação para suporte 0–5 anos.
 * GRAVIDEZ: semanas 1–40
 * POS_PARTO: 0–12 meses (conteúdo futuro)
 * BEBE: 12–36 meses (conteúdo futuro)
 * CRIANCA: 3–5 anos (conteúdo futuro)
 */
export type PhaseType = 'GRAVIDEZ' | 'POS_PARTO' | 'BEBE' | 'CRIANCA';

export const PHASE_LABELS: Record<PhaseType, string> = {
  GRAVIDEZ: 'Gravidez',
  POS_PARTO: 'Pós-parto (0–12 meses)',
  BEBE: 'Bebê (1–3 anos)',
  CRIANCA: 'Criança (3–5 anos)',
};

/** Retorna a fase baseada em idade gestacional ou idade do filho. */
export function getPhaseFromContext(
  gestationalWeek?: number,
  childAgeMonths?: number
): PhaseType {
  if (childAgeMonths != null) {
    if (childAgeMonths <= 12) return 'POS_PARTO';
    if (childAgeMonths <= 36) return 'BEBE';
    if (childAgeMonths <= 60) return 'CRIANCA';
  }
  return 'GRAVIDEZ';
}
