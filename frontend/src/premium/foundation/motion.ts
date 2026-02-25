/**
 * Animações padronizadas MaterniLove Premium
 */

export const motion = {
  fadeInSmooth: {
    animation: 'fadeInSmooth 300ms ease forwards',
  },
  elevateHover: {
    transform: 'translateY(-6px)',
  },
  pressEffect: {
    transform: 'scale(0.95)',
  },
  transitionDefault: '250ms ease',
  transitionFast: '150ms ease',
  transitionSmooth: '300ms ease',
} as const;

export const keyframes = {
  fadeInSmooth: `
    @keyframes fadeInSmooth {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
} as const;
