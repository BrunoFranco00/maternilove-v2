/**
 * Gradientes MaterniLove Premium
 */

export const gradients = {
  backgroundGradient:
    'linear-gradient(180deg, #FFF5F8 0%, #FFE6EC 100%)',
  primaryGradient:
    'linear-gradient(180deg, #C2185B 0%, #8E0E3A 100%)',
  primaryRadial:
    'radial-gradient(ellipse at center, #C2185B 0%, #8E0E3A 100%)',
  heroOverlay:
    'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,245,248,0.8) 100%)',
} as const;

export type Gradients = typeof gradients;
