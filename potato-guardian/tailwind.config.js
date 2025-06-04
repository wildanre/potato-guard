/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        green: {
          50: '#f0f9f1',
          100: '#dcf1de',
          200: '#bde4c2',
          300: '#94d1a0',
          400: '#6cb87b',
          500: '#4b9d5c',
          600: '#3b7f52',
          700: '#316542',
          800: '#2a5137',
          900: '#244430',
          950: '#0e2517',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};