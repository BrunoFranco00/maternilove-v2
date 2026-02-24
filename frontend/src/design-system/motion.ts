/**
 * Motion tokens — transições e animações
 */

export const MOTION = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '400ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  transition: {
    default: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors: 'color 200ms, background-color 200ms',
    transform: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    shadow: 'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;
