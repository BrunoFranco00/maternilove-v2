/**
 * Sistema de profundidade visual MaterniLove Premium — Elite
 * Adaptado para primaryRose #B3124F, primaryRoseDark #7F0E36
 */

export const shadows = {
  depthSoft: '0 4px 12px rgba(179,18,79,0.08)',
  depthMedium: '0 12px 30px rgba(179,18,79,0.15)',
  depthDeep: '0 20px 60px rgba(127,14,54,0.25)',
  glowRose: '0 0 24px rgba(179,18,79,0.18), 0 0 48px rgba(179,18,79,0.08)',
  glowRoseSubtle: '0 0 16px rgba(179,18,79,0.12)',
  pressReduced: '0 2px 8px rgba(127,14,54,0.12)',
} as const;

export type Shadows = typeof shadows;
