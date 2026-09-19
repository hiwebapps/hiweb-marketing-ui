import type { APIRoute } from 'astro';
import { shouldNoIndex } from '../lib/seo';

export const prerender = false;

export const GET: APIRoute = ({ url }) => {
  const body = shouldNoIndex(url.hostname)
    ? ['User-agent: *', 'Disallow: /', ''].join('\n')
    : [
        'User-agent: *',
        'Allow: /',
        'Sitemap: https://www.hiwebmarketing.com/sitemap.xml',
        '',
      ].join('\n');

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
};
