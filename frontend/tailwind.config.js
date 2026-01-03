/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FBE7F3',
          100: '#F8D5EA',
          200: '#F472B6',
          500: '#D946A6',
          600: '#BE185D',
          700: '#9D174D',
          900: '#500724',
        },
        secondary: {
          50: '#E9D5FF',
          500: '#A855F7',
          600: '#9333EA',
        },
        success: {
          500: '#10B981',
        },
        info: {
          500: '#3B82F6',
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
