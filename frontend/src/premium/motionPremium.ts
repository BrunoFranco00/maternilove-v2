/**
 * Sistema de motion premium — polimento elite
 * fadeInStagger, pageTransitionSmooth, pressEffectReal, navActiveBounce
 */

export const motionPremium = {
  /** Delay incremental para filhos (ex: nth-child) */
  fadeInStagger: (index: number, baseMs = 50) => ({
    animation: `fadeInSmooth ${250 + index * baseMs}ms ease forwards`,
    animationDelay: `${index * baseMs}ms`,
    opacity: 0,
  }),

  /** Transição suave entre páginas */
  pageTransitionSmooth: {
    animation: 'pageTransitionSmooth 280ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
  },

  /** Efeito de press real: scale + shadow reduction */
  pressEffectReal: {
    transform: 'scale(0.94)',
    boxShadow: '0 2px 8px rgba(127, 14, 54, 0.12)',
    transition: 'transform 120ms ease-out, box-shadow 120ms ease-out',
  },

  /** Bounce leve no item ativo da nav */
  navActiveBounce: {
    animation: 'navActiveBounce 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
  },

  /** Durações */
  durationFast: '120ms',
  durationStandard: '250ms',
  durationSmooth: '280ms',
} as const;
