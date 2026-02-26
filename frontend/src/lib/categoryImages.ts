/**
 * Mapeamento categoria → imagem para cards do feed/início.
 * Categorias: GRAVIDEZ, NUTRICAO, MOVIMENTO, SONO, POS_PARTO, BEBE, CRIANCA
 * TODO: substituir por imagens locais em /public/images/categories/*.jpg quando houver assets.
 */
export type ContentCategory =
  | 'GRAVIDEZ'
  | 'NUTRICAO'
  | 'MOVIMENTO'
  | 'SONO'
  | 'POS_PARTO'
  | 'BEBE'
  | 'CRIANCA';

const CATEGORY_IMAGES: Record<string, string> = {
  GRAVIDEZ: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80',
  gravidez: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80',
  NUTRICAO: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
  nutricao: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
  MOVIMENTO: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
  movimento: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
  SONO: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=600&q=80',
  sono: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=600&q=80',
  POS_PARTO: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80',
  'pos-parto': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80',
  BEBE: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80',
  bebe: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80',
  CRIANCA: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
  crianca: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
  emocional: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
  'recem-nascido': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80',
  '1-2 anos': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
  '3-5 anos': 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=600&q=80',
};

export function getCategoryImage(category: string): string {
  return CATEGORY_IMAGES[category] ?? CATEGORY_IMAGES.GRAVIDEZ;
}
