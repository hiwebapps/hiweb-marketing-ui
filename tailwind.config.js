/**
 * Hiweb Marketing — Design Tokens
 * Light Product-Tool (Cal + Linear + Raycast)
 * Tipografía: Clash Display + Inter (locales en /fonts)
 *
 * Astro + Tailwind v4 aplica tokens vía @theme en src/styles/global.css.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        canvas: '#ffffff',
        surface: {
          DEFAULT: '#f5f5f5',
          elevated: '#eeeeee',
        },
        ink: {
          DEFAULT: '#111111',
          soft: '#3a3a3a',
        },
        muted: '#6b7280',
        border: {
          DEFAULT: 'rgba(0, 0, 0, 0.08)',
          strong: 'rgba(0, 0, 0, 0.14)',
        },
        hiweb: {
          dark: '#070902',
          darkGray: '#3a3a3a',
          light: '#f5f5f5',
          lightGray: '#dbdbdb',
        },
        accent: {
          orange: '#fe621c',
          cyan: '#01e7ff',
          purple: '#927afe',
          lime: '#dbe64c',
          blue: '#1e4990',
          deepBlue: '#2b2f8f',
          red: '#a91e23',
          green: '#74c465',
          teal: '#059b7a',
        },
      },
      blur: {
        '3xl': '64px',
        '4xl': '100px',
      },
      fontFamily: {
        display: ['"Clash Display"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        serif: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
