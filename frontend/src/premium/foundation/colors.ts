/**
 * Paleta oficial MaterniLove Premium — Elite
 */

export const colors = {
  primaryRose: '#B3124F',
  primaryRoseDark: '#7F0E36',
  primaryRoseLight: '#F6A9C4',

  glassBorder: 'rgba(255,255,255,0.55)',
  glassBackground: 'rgba(255,255,255,0.65)',

  textPrimary: '#1C1C1C',
  textSecondary: '#5F5F5F',
  textMuted: '#8E8E8E',
} as const;

export type Colors = typeof colors;
