// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import { sanityRedirects } from './integrations/sanity-redirects.mjs';

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, PUBLIC_SITE_URL } = loadEnv(
  process.env.NODE_ENV ?? 'development',
  process.cwd(),
  '',
);

const projectId = PUBLIC_SANITY_PROJECT_ID || 'fxardjr1';
const dataset = PUBLIC_SANITY_DATASET || 'web-2026';
const isStaging = process.env.PUBLIC_SITE_ENV === 'staging';
const gsapSsrStub = fileURLToPath(new URL('./src/lib/gsap-ssr-stub.ts', import.meta.url));

/** GSAP's import starts a timer. Workers only allow that inside a request. */
function gsapSsrStubPlugin() {
  return {
    name: 'gsap-ssr-stub',
    enforce: 'pre',
    resolveId(source, _importer, options) {
      if (!options?.ssr) return null;
      if (source === 'gsap' || source.startsWith('gsap/')) return gsapSsrStub;
      return null;
    },
  };
}

/**
 * @param {{ route: { prerender: boolean } }} context
 */
function disablePrerender(context) {
  if (isStaging) context.route.prerender = false;
}

/** Staging is SSR so unpublished Sanity drafts show up without a rebuild. */
function stagingSsr() {
  return {
    name: 'staging-ssr',
    hooks: {
      'astro:route:setup': disablePrerender,
    },
  };
}

/** Hosted Studio (not embedded). Do not deploy to hiweb-marketing. */
const SANITY_STUDIO_URL = 'https://hiweb-web.sanity.studio';

export default defineConfig({
  site: isStaging
    ? 'https://hiweb-marketing-ui-staging.hiwebapps.workers.dev'
    : PUBLIC_SITE_URL || 'https://hiweb-marketing-ui.hiwebapps.workers.dev',
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
    stagingSsr(),
    sanityRedirects(),
  ],
  adapter: cloudflare({
    imageService: 'compile',
    imagesBindingName: false,
    prerenderEnvironment: 'node',
  }),
  redirects: {
    '/work': '/portafolio',
    '/contact': '/contacto',
    '/en/servicios/google-ads': '/en/servicios/google-ads-management-services',
    '/en/servicios/redes-sociales': '/en/servicios/social-media',
    '/en/servicios/desarrollo-web': '/en/servicios/web-development',
    '/en/servicios/crm-automatizacion': '/en/servicios/crm-automation',
    '/en/servicios/ia-marketing': '/en/servicios/ai-tools-for-marketing',
    '/en/blog': '/en/blogs',
  },
  vite: {
    plugins: [gsapSsrStubPlugin(), tailwindcss()],
    ssr: {
      noExternal: ['gsap'],
    },
  },
});
