/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Novara: negro, blanco, gris, dorado (acento principal) y un
        // toque mínimo de rojo (el guion bajo la marca, como en el logotipo).
        brand: {
          black: '#0a0a0a',
          dark: '#151515',
          gray: {
            50: '#f7f7f7',
            100: '#eeeeee',
            200: '#dddddd',
            300: '#bbbbbb',
            400: '#888888',
            500: '#5f5f5f',
            600: '#3d3d3d',
            700: '#2a2a2a',
          },
          gold: '#c9a24a',
          goldDark: '#a3822f',
          red: '#e5121a',
          redDark: '#b80e14',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      letterSpacing: {
        widest2: '0.25em',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.6s ease-out both',
        marquee: 'marquee 18s linear infinite',
      },
    },
  },
  plugins: [],
};
