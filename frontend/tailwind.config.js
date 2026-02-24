/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
      },
      borderRadius: {
        lg: "var(--radius-lg)",
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
