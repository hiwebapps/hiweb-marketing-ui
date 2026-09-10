// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://hiweb-marketing-ui.vercel.app',
  integrations: [react()],
  redirects: {
    '/work': '/portafolio',
    '/contact': '/contacto',
  },
  vite: {
    plugins: [tailwindcss()]
  }
});