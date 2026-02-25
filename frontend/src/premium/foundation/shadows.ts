/**
 * Sistema de profundidade visual MaterniLove Premium
 */

export const shadows = {
  depthSoft: '0 4px 12px rgba(194,24,91,0.08)',
  depthMedium: '0 12px 30px rgba(194,24,91,0.15)',
  depthDeep: '0 20px 60px rgba(142,14,58,0.25)',
} as const;

export type Shadows = typeof shadows;
