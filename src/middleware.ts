import { defineMiddleware } from 'astro:middleware';
import { ROBOTS_NOINDEX, shouldNoIndex } from './lib/seo';

/** Belt-and-suspenders: X-Robots-Tag while PUBLIC_SITE_INDEXABLE is off (and always on non-live hosts). */
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  if (pathname.startsWith('/en/') && pathname !== '/en/') {
    return context.redirect('/en');
  }

  const response = await next();

  if (!shouldNoIndex(context.url.hostname)) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set('X-Robots-Tag', ROBOTS_NOINDEX);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
