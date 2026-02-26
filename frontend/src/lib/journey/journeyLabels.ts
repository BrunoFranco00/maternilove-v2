/**
 * Labels determinísticos por semana (gravidez) e mês (pós-parto).
 * Cíclicos e variados para exibição na timeline.
 */

const WEEK_LABELS = [
  'Exames', 'Nutrição', 'Sono', 'Emoções', 'Movimento', 'Pré-natal',
  'Descanso', 'Alimentação', 'Ultrassom', 'Ácido fólico', 'Vínculo',
  'Consultas', 'Preparação', 'Crescimento', 'Desenvolvimento',
  'Movimentos', 'Som', 'Ritmo', 'Conexão', 'Cuidados',
  'Organização', 'Enxoval', 'Parto', 'Amamentação', 'Pós-parto',
  'Rotina', 'Sono bebê', 'Choro', 'Banho', 'Vacinas',
  'Desenvolvimento', 'Estimulação', 'Socialização', 'Escola',
];

const MONTH_LABELS = [
  'Amamentação', 'Sono', 'Choro', 'Desenvolvimento', 'Vacinas',
  'Banho', 'Alimentação', 'Movimento', 'Social', 'Linguagem',
  'Crescimento', 'Rotina', 'Escola', 'Independência', 'Brincadeiras',
];

export function getLabelForWeek(week: number): string {
  const idx = (week - 1) % WEEK_LABELS.length;
  return WEEK_LABELS[idx];
}

export function getLabelForMonth(month: number): string {
  const idx = month % MONTH_LABELS.length;
  return MONTH_LABELS[idx];
}
