/**
 * Internal sitemap for QA. robots.txt does NOT advertise this while
 * PUBLIC_SITE_INDEXABLE is off (see docs/cms/CUTOVER-SEO.md).
 */
import type { APIRoute } from 'astro';
import { getCases, getIndustries, getLandings, getPosts, getServices } from '../lib/content';
import { isReservedSlug } from '../sanity/reservedSlugs';
import { shouldNoIndex } from '../lib/seo';

export const prerender = false;

function loc(origin: string, path: string) {
  return `${origin.replace(/\/$/, '')}${path}`;
}

function urlXml(href: string): string {
  return `  <url>\n    <loc>${href}</loc>\n  </url>`;
}

export const GET: APIRoute = async ({ url, site }) => {
  const origin = site?.origin ?? import.meta.env.PUBLIC_SITE_URL ?? url.origin;
  const [industries, services, cases, posts, landings] = await Promise.all([
    getIndustries(),
    getServices(),
    getCases(),
    getPosts(),
    getLandings(),
  ]);

  const urls = [
    '/',
    '/servicios',
    '/industrias',
    '/portafolio',
    '/blog',
    '/nosotros',
    '/contacto',
    ...services.map((item) => `/servicios/${item.id}`),
    ...industries.map((item) => `/industrias/${item.id}`),
    ...cases.map((item) => `/portafolio/${item.id}`),
    ...posts.map((item) => `/blog/${item.id}`),
    ...landings.filter((item) => !isReservedSlug(item.id)).map((item) => `/${item.id}`),
  ].map((path) => urlXml(loc(origin, path)));

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');

  const headers: Record<string, string> = {
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, max-age=0, must-revalidate',
  };
  if (shouldNoIndex(url.hostname)) {
    headers['X-Robots-Tag'] = 'noindex, nofollow';
  }

  return new Response(body, { status: 200, headers });
};
