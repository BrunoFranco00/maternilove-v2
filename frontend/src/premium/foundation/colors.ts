/**
 * Paleta oficial MaterniLove Premium
 */

export const colors = {
  primaryRose: '#C2185B',
  primaryRoseDark: '#8E0E3A',
  primaryRoseLight: '#F8BBD0',

  glassBorder: 'rgba(255,255,255,0.55)',
  glassBackground: 'rgba(255,255,255,0.65)',

  textPrimary: '#1C1C1C',
  textSecondary: '#5F5F5F',
  textMuted: '#8E8E8E',
} as const;

export type Colors = typeof colors;
