/**
 * Resolvers de imagens: categorias e progresso.
 * Fallback SVG determinístico quando assets não existem.
 * Sem IA, sem URLs externas.
 */

// === Mapeamento de categorias para assets locais ===
const CATEGORY_SLUG_MAP: Record<string, string> = {
  nutricao: 'nutricao',
  sono: 'sono',
  exercicios: 'exercicios',
  prenatal: 'prenatal',
  gravidez: 'prenatal',
  parto: 'parto',
  'pos-parto': 'parto',
  emocional: 'emocional',
  comunidade: 'comunidade',
  marketplace: 'marketplace',
  'recem-nascido': 'parto',
  '1-2 anos': 'comunidade',
  '3-5 anos': 'comunidade',
};

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Gera cor HSL determinística a partir de seed */
export function hashToHsl(seed: string): { h: number; s: number; l: number } {
  const h = hashString(seed) % 360;
  const s = 45 + (hashString(seed + 's') % 25); // 45-70%
  const l = 55 + (hashString(seed + 'l') % 20); // 55-75%
  return { h, s, l };
}

/** SVG como data URI determinístico para fallback */
export function makeSvgCard(title: string, subtitle: string, seed: string): string {
  const { h, s, l } = hashToHsl(seed);
  const hsl = `hsl(${h}, ${s}%, ${l}%)`;
  const hslDark = `hsl(${h}, ${s}%, ${Math.max(30, l - 15)}%)`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225" width="400" height="225">
<defs>
  <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${hsl}"/>
    <stop offset="100%" stop-color="${hslDark}"/>
  </linearGradient>
</defs>
<rect width="400" height="225" fill="url(#g)"/>
<text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="rgba(255,255,255,0.95)" font-family="system-ui,sans-serif" font-size="24" font-weight="600">${escapeXml(title)}</text>
<text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="system-ui,sans-serif" font-size="14">${escapeXml(subtitle)}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Resolve visual de categoria.
 * Primeiro tenta /images/categories/<slug>.svg via map.
 * Se category não está no map, retorna SVG determinístico.
 */
export function resolveCategoryVisual(category: string): string {
  const normalized = (category || '').trim().toLowerCase();
  const slug = CATEGORY_SLUG_MAP[normalized] ?? CATEGORY_SLUG_MAP[category];
  if (slug) {
    return `/images/categories/${slug}.svg`;
  }
  return makeSvgCard(category || 'Conteúdo', 'MaterniLove', `cat-${category}`);
}

/**
 * Resolve visual de progresso.
 * Pregnancy: /images/progress/pregnancy/trimester-N.svg por trimestre.
 * Child: /images/progress/child/phase-X.svg por fase.
 * Fallback: SVG determinístico quando fora do range ou asset não existe.
 */
export type ProgressType = { type: 'pregnancy'; week: number } | { type: 'child'; month: number };

const TRIMESTER_ASSETS = [
  '/images/progress/pregnancy/trimester-1.svg',
  '/images/progress/pregnancy/trimester-2.svg',
  '/images/progress/pregnancy/trimester-3.svg',
  '/images/progress/pregnancy/trimester-4.svg',
];

const CHILD_PHASE_ASSETS: Record<string, string> = {
  '0-3': '/images/progress/child/phase-0-3.svg',
  '3-6': '/images/progress/child/phase-3-6.svg',
  '6-12': '/images/progress/child/phase-6-12.svg',
  '12-24': '/images/progress/child/phase-1-2y.svg',
  '24-36': '/images/progress/child/phase-2-3y.svg',
  '36-60': '/images/progress/child/phase-3-5y.svg',
};

function getChildPhaseKey(month: number): string {
  if (month < 3) return '0-3';
  if (month < 6) return '3-6';
  if (month < 12) return '6-12';
  if (month < 24) return '12-24';
  if (month < 36) return '24-36';
  return '36-60';
}

export function resolveProgressVisual(params: ProgressType): string {
  if (params.type === 'pregnancy') {
    const week = Math.max(1, Math.min(40, params.week ?? 24));
    const trimester = Math.min(Math.floor((week - 1) / 10), TRIMESTER_ASSETS.length - 1);
    const idx = Math.max(0, trimester);
    return TRIMESTER_ASSETS[idx];
  }

  if (params.type === 'child') {
    const month = Math.max(0, Math.min(60, params.month ?? 0));
    const phase = getChildPhaseKey(month);
    const asset = CHILD_PHASE_ASSETS[phase];
    if (asset) return asset;
    return makeSvgCard(
      month === 0 ? 'Recém-nascido' : `Mês ${month}`,
      `Fase ${phase}`,
      `child-${month}`
    );
  }

  return makeSvgCard('Progresso', 'MaterniLove', 'progress-default');
}
