// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, PUBLIC_SITE_URL } = loadEnv(
  process.env.NODE_ENV ?? 'development',
  process.cwd(),
  '',
);

const projectId = PUBLIC_SANITY_PROJECT_ID || 'fxardjr1';
const dataset = PUBLIC_SANITY_DATASET || 'web-2026';

/** Hosted Studio (not embedded). Do not deploy to hiweb-marketing. */
const SANITY_STUDIO_URL = 'https://hiweb-web.sanity.studio';

export default defineConfig({
  site: PUBLIC_SITE_URL || 'https://hiweb-marketing-ui.hiwebapps.workers.dev',
  output: 'server',
  session: false,
  integrations: [
    sanity({
      projectId,
      dataset,
      useCdn: false,
      apiVersion: '2026-09-18',
      stega: {
        enabled: false,
        studioUrl: SANITY_STUDIO_URL,
      },
    }),
    react(),
  ],
  adapter: cloudflare({
    imageService: 'compile',
    imagesBindingName: false,
    prerenderEnvironment: 'node',
  }),
  redirects: {
    '/work': '/portafolio',
    '/contact': '/contacto',
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['gsap'],
    },
  },
});
