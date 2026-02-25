/**
 * Tipografia MaterniLove Premium
 */

export const typography = {
  fontTitle: 'var(--font-title, "Georgia", serif)',
  fontBody: 'var(--font-body, system-ui, sans-serif)',

  sizeXs: '0.75rem',
  sizeSm: '0.875rem',
  sizeBase: '1rem',
  sizeLg: '1.125rem',
  sizeXl: '1.25rem',
  size2xl: '1.5rem',
  size3xl: '1.875rem',
  size4xl: '2.25rem',

  lineHeightTight: 1.25,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.625,
  lineHeightLoose: 1.75,

  letterSpacingWide: '0.05em',
  letterSpacingWider: '0.1em',
} as const;

export type Typography = typeof typography;
