/**
 * Design System Premium MaterniLove v2
 */

export const theme = {
  colors: {
    primary: '#C2185B',
    primaryDark: '#8E0E3A',
    softBackground: '#FFF1F4',
    cardBackground: 'rgba(255, 255, 255, 0.75)',
    textPrimary: '#1C1C1C',
    textSecondary: '#5F5F5F',
  },
  typography: {
    fontTitle: "'Playfair Display', serif",
    fontBody: "'Inter', sans-serif",
  },
  radius: {
    card: '20px',
  },
  shadow: {
    card: '0 8px 32px rgba(194, 24, 91, 0.08)',
    cardHover: '0 12px 40px rgba(194, 24, 91, 0.12)',
    button: '0 4px 14px rgba(194, 24, 91, 0.35)',
    buttonHover: '0 6px 20px rgba(194, 24, 91, 0.4)',
  },
  transition: {
    default: '200ms ease',
  },
} as const;
