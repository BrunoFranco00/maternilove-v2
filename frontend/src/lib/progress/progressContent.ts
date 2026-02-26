/**
 * Conteúdo de progresso por semana (gravidez) e por mês (0-5 anos).
 * Dataset mock determinístico, escalável para backend.
 */

export interface PregnancyWeekContent {
  title: string;
  subtitle: string;
  image: string;
  lengthCm: string;
  weightG: string;
  highlight: string;
}

export interface ChildMonthContent {
  title: string;
  subtitle: string;
  image: string;
  highlight: string;
}

const TRIMESTER_IMAGES = [
  '/images/progress/pregnancy/trimester-1.svg',
  '/images/progress/pregnancy/trimester-2.svg',
  '/images/progress/pregnancy/trimester-3.svg',
  '/images/progress/pregnancy/trimester-4.svg',
];

const CHILD_PHASE_IMAGES: Record<string, string> = {
  '0-3': '/images/progress/child/phase-0-3.svg',
  '3-6': '/images/progress/child/phase-3-6.svg',
  '6-12': '/images/progress/child/phase-6-12.svg',
  '12-24': '/images/progress/child/phase-1-2y.svg',
  '24-36': '/images/progress/child/phase-2-3y.svg',
  '36-60': '/images/progress/child/phase-3-5y.svg',
};

const SIZE_DATA: Record<number, { cm: string; g: string }> = {
  4: { cm: '0,2', g: '0,5' }, 8: { cm: '1,6', g: '1' }, 12: { cm: '6', g: '14' },
  16: { cm: '12', g: '100' }, 20: { cm: '25', g: '300' }, 24: { cm: '30', g: '600' },
  28: { cm: '37', g: '1000' }, 32: { cm: '42', g: '1700' }, 36: { cm: '47', g: '2600' },
  40: { cm: '51', g: '3400' },
};

const WEEK_HIGHLIGHTS: Record<number, string> = {
  4: 'Coração começando a bater.', 8: 'Órgãos principais em formação.', 12: 'Movimentos involuntários começam.',
  16: 'Sexo identificável no ultrassom.', 20: 'Mãe pode sentir os movimentos.', 24: 'Bebê ouve sua voz.',
  28: 'Olhos abrem e fecham.', 32: 'Unhas crescendo.', 36: 'Posicionando para nascer.',
  40: 'Pronto para o mundo.',
};

function getNearestSize(week: number): { cm: string; g: string } {
  const keys = Object.keys(SIZE_DATA).map(Number).sort((a, b) => a - b);
  const nearest = keys.reduce((p, c) => Math.abs(c - week) < Math.abs(p - week) ? c : p);
  return SIZE_DATA[nearest] ?? { cm: '~30', g: '~600' };
}

function getWeekHighlight(week: number): string {
  const keys = Object.keys(WEEK_HIGHLIGHTS).map(Number).sort((a, b) => a - b);
  const nearest = keys.reduce((p, c) => Math.abs(c - week) < Math.abs(p - week) ? c : p);
  return WEEK_HIGHLIGHTS[nearest] ?? 'Sua jornada continua.';
}

export function getPregnancyWeekContent(week: number): PregnancyWeekContent {
  const clamped = Math.max(1, Math.min(40, week));
  const trimester = clamped <= 13 ? 1 : clamped <= 27 ? 2 : 3;
  const imgIdx = Math.min(Math.floor((clamped - 1) / 10), TRIMESTER_IMAGES.length - 1);
  const size = getNearestSize(clamped);

  return {
    title: `Semana ${clamped}`,
    subtitle: `Trimestre ${trimester}`,
    image: TRIMESTER_IMAGES[imgIdx],
    lengthCm: `${size.cm} cm`,
    weightG: `${size.g} g`,
    highlight: getWeekHighlight(clamped),
  };
}

function getChildPhaseKey(month: number): string {
  if (month < 3) return '0-3';
  if (month < 6) return '3-6';
  if (month < 12) return '6-12';
  if (month < 24) return '12-24';
  if (month < 36) return '24-36';
  return '36-60';
}

const MONTH_HIGHLIGHTS: Record<string, string> = {
  '0-3': 'Alimentação, sono e vínculo.', '3-6': 'Sorrindo e seguindo objetos.',
  '6-12': 'Sentando, engatinhando.', '12-24': 'Primeiros passos e palavras.',
  '24-36': 'Explorando e imitando.', '36-60': 'Socialização e pré-escola.',
};

export function getChildMonthContent(month: number): ChildMonthContent {
  const clamped = Math.max(0, Math.min(60, month));
  const phase = getChildPhaseKey(clamped);
  const phaseImg = CHILD_PHASE_IMAGES[phase] ?? CHILD_PHASE_IMAGES['0-3'];

  return {
    title: month === 0 ? 'Recém-nascido' : `Mês ${clamped}`,
    subtitle: `Fase ${phase}`,
    image: phaseImg,
    highlight: MONTH_HIGHLIGHTS[phase] ?? 'Crescendo a cada dia.',
  };
}
