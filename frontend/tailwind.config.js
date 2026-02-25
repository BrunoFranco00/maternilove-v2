/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/premium/**/*.{js,ts,jsx,tsx}",
    "./src/design-system/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        brand: {
          primary: "rgb(var(--color-brand-primary) / <alpha-value>)",
          accent: "rgb(var(--color-brand-accent) / <alpha-value>)",
          muted: "rgb(var(--color-brand-muted) / <alpha-value>)",
          "rosa-light": "rgb(var(--color-brand-rosa-light) / <alpha-value>)",
          "rosa-soft": "rgb(var(--color-brand-rosa-soft) / <alpha-value>)",
        },
        text: {
          primary: "rgb(var(--color-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
        },
        /* Mapeamento para componentes existentes (substitui rosa por paleta adulta) */
        primary: {
          50: "rgb(245 247 250)",
          100: "rgb(230 235 245)",
          200: "rgb(180 195 220)",
          300: "rgb(130 155 195)",
          400: "rgb(80 115 170)",
          500: "rgb(var(--color-brand-primary))",
          600: "rgb(var(--color-brand-primary))",
          700: "rgb(30 42 71)",
        },
        secondary: {
          500: "rgb(var(--color-brand-accent))",
          600: "rgb(var(--color-brand-accent))",
        },
        /* Materni Love — rosa institucional elegante */
        "ml-rosa": {
          50: "rgb(255 250 252)",
          100: "rgb(255 240 248)",
          200: "rgb(252 228 240)",
          300: "rgb(248 218 232)",
          400: "rgb(245 200 220)",
          500: "rgb(238 175 200)",
          600: "rgb(220 150 175)",
          700: "rgb(180 120 150)",
        },
        "ml-bg": {
          DEFAULT: "rgb(252 250 251)",
          surface: "rgb(255 255 255)",
          muted: "rgb(248 247 248)",
        },
        /* Premium v2 */
        premium: {
          primary: "#C2185B",
          "primary-dark": "#8E0E3A",
          "soft-bg": "#FFF1F4",
          "text-primary": "#1C1C1C",
          "text-secondary": "#5F5F5F",
        },
      },
      fontFamily: {
        title: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        "premium-card": "20px",
      },
      boxShadow: {
        "premium-card": "0 8px 32px rgba(194, 24, 91, 0.08)",
        "premium-card-hover": "0 12px 40px rgba(194, 24, 91, 0.12)",
        "premium-button": "0 4px 14px rgba(194, 24, 91, 0.35)",
        "premium-button-hover": "0 6px 20px rgba(194, 24, 91, 0.4)",
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        "ml-sm": "0.5rem",
        "ml-md": "0.75rem",
        "ml-lg": "1rem",
        "ml-xl": "1.25rem",
        "ml-2xl": "1.5rem",
      },
      boxShadow: {
        "ml-xs": "0 1px 2px rgba(0, 0, 0, 0.04)",
        "ml-sm": "0 2px 8px rgba(0, 0, 0, 0.04)",
        "ml-md": "0 4px 20px rgba(0, 0, 0, 0.04)",
        "ml-lg": "0 8px 30px rgba(0, 0, 0, 0.06)",
        "ml-xl": "0 12px 40px rgba(0, 0, 0, 0.08)",
        "ml-glow-rosa": "0 0 24px rgba(238, 175, 200, 0.25)",
        "ml-glow-rosa-soft": "0 0 40px rgba(248, 218, 232, 0.3)",
        "ml-inner": "inset 0 1px 2px rgba(0, 0, 0, 0.04)",
        "ml-logo": "inset 0 1px 2px rgba(255,255,255,0.4), 0 0 24px rgba(248, 218, 232, 0.4)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.4s ease-out",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
