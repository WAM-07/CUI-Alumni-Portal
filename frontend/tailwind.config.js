/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F5FA',
          100: '#E1EAF4',
          200: '#C2D5E9',
          300: '#94B6DA',
          400: '#5C90C6',
          500: '#3470B2',
          600: '#235594',
          700: '#1C4477',
          800: '#1E3A8A',
          900: '#0F2942',
          950: '#0A1B2D',
        },
        academic: {
          gold: '#D97706',
          bronze: '#B45309',
          slate: '#0F172A',
          muted: '#64748B',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
        }
      },
    },
  },
  plugins: [],
};
