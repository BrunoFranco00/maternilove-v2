/**
 * Mapeamento categoria → imagem para cards de conteúdo.
 * Imagens locais em /images/categories/
 */

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  NUTRICAO: '/images/categories/nutricao.svg',
  nutricao: '/images/categories/nutricao.svg',
  SONO: '/images/categories/sono.svg',
  sono: '/images/categories/sono.svg',
  MOVIMENTO: '/images/categories/exercicios.svg',
  movimento: '/images/categories/exercicios.svg',
  exercicios: '/images/categories/exercicios.svg',
  PRENATAL: '/images/categories/prenatal.svg',
  prenatal: '/images/categories/prenatal.svg',
  GRAVIDEZ: '/images/categories/prenatal.svg',
  gravidez: '/images/categories/prenatal.svg',
  PARTO: '/images/categories/parto.svg',
  parto: '/images/categories/parto.svg',
  POS_PARTO: '/images/categories/parto.svg',
  'pos-parto': '/images/categories/parto.svg',
  EMOCIONAL: '/images/categories/emocional.svg',
  emocional: '/images/categories/emocional.svg',
  COMUNIDADE: '/images/categories/comunidade.svg',
  comunidade: '/images/categories/comunidade.svg',
  community: '/images/categories/comunidade.svg',
  MARKETPLACE: '/images/categories/marketplace.svg',
  marketplace: '/images/categories/marketplace.svg',
  mercado: '/images/categories/marketplace.svg',
  BEBE: '/images/categories/parto.svg',
  bebe: '/images/categories/parto.svg',
  CRIANCA: '/images/categories/comunidade.svg',
  crianca: '/images/categories/comunidade.svg',
  'recem-nascido': '/images/categories/parto.svg',
  '1-2 anos': '/images/categories/comunidade.svg',
  '3-5 anos': '/images/categories/comunidade.svg',
};

const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg, #F8C7D8 0%, #F3A9BF 100%)',
  'linear-gradient(135deg, #B2DFDB 0%, #80CBC4 100%)',
  'linear-gradient(135deg, #FFCCBC 0%, #FFAB91 100%)',
  'linear-gradient(135deg, #E1BEE7 0%, #CE93D8 100%)',
  'linear-gradient(135deg, #C5E1A5 0%, #9CCC65 100%)',
  'linear-gradient(135deg, #B3E5FC 0%, #81D4FA 100%)',
];

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export type ContentCategory =
  | 'GRAVIDEZ'
  | 'NUTRICAO'
  | 'MOVIMENTO'
  | 'SONO'
  | 'POS_PARTO'
  | 'BEBE'
  | 'CRIANCA'
  | 'EMOCIONAL'
  | 'COMUNIDADE'
  | 'MARKETPLACE';

export function getCategoryImage(category: string): string {
  const normalized = (category || '').trim();
  const mapped = CATEGORY_IMAGE_MAP[normalized] ?? CATEGORY_IMAGE_MAP[normalized.toLowerCase()];
  if (mapped) return mapped;
  return '/images/categories/prenatal.svg';
}

/** Retorna URL de fallback por gradiente para categorias desconhecidas (usar em style.background) */
export function getCategoryFallbackGradient(category: string): string {
  const idx = hashString((category || 'default')) % FALLBACK_GRADIENTS.length;
  return FALLBACK_GRADIENTS[idx];
}
