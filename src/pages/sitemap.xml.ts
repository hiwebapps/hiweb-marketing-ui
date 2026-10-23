/**
 * robots.txt advertises this only when shouldNoIndex() is false
 * (PUBLIC_SITE_INDEXABLE on and the request comes from hiwebmarketing.com).
 */
import type { APIRoute } from 'astro';
import { getAboutCopy, getCases, getIndustries, getLandings, getPosts, getServices } from '../lib/content';
import { aboutPath } from '../lib/page-meta';
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
  const [
    industries,
    englishIndustries,
    services,
    englishServices,
    cases,
    englishCases,
    posts,
    englishPosts,
    landings,
    englishAbout,
  ] = await Promise.all([
    getIndustries(),
    getIndustries('en'),
    getServices(),
    getServices('en'),
    getCases(),
    getCases('en'),
    getPosts(),
    getPosts('en'),
    getLandings(),
    getAboutCopy('en'),
  ]);

  const urls = [
    '/',
    '/en',
    '/portafolio',
    '/en/success-stories',
    '/blog',
    aboutPath('es'),
    aboutPath('en', englishAbout.slug),
    '/en/blogs',
    '/contacto',
    '/diagnostico-marketing-digital',
    '/calendario',
    '/en/calendar',
    '/portal',
    '/en/portal',
    ...services.map((item) => `/servicios/${item.id}`),
    ...englishServices.map((item) => `/en/services/${item.id}`),
    ...industries.map((item) => `/industrias/${item.id}`),
    ...englishIndustries.map((item) => `/en/industries/${item.id}`),
    ...cases.map((item) => `/portafolio/${item.id}`),
    ...englishCases.map((item) => `/en/success-stories/${item.id}`),
    ...posts.map((item) => `/blog/${item.id}`),
    ...englishPosts.map((item) => `/en/blogs/${item.id}`),
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
    'Cache-Control': 'public, max-age=3600',
  };
  if (shouldNoIndex(url.hostname)) {
    headers['X-Robots-Tag'] = 'noindex, nofollow';
  }

  return new Response(body, { status: 200, headers });
};
