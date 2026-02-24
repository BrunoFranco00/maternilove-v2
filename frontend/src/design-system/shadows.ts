/**
 * Shadows modernas — elevação suave
 */

export const SHADOWS = {
  xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
  sm: '0 2px 8px rgba(0, 0, 0, 0.04)',
  md: '0 4px 20px rgba(0, 0, 0, 0.04)',
  lg: '0 8px 30px rgba(0, 0, 0, 0.06)',
  xl: '0 12px 40px rgba(0, 0, 0, 0.08)',
  glow: {
    rosa: '0 0 24px rgba(238, 175, 200, 0.25)',
    rosaSoft: '0 0 40px rgba(248, 218, 232, 0.3)',
  },
  inner: {
    subtle: 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
  },
} as const;
