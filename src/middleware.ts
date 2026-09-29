import { defineMiddleware } from 'astro:middleware';
import { readBinding } from './lib/runtime-env';
import { ROBOTS_NOINDEX, shouldNoIndex } from './lib/seo';
import { isStagingSite } from './lib/site-env';

function unauthorized() {
  return new Response('Staging requiere usuario y contraseña.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Hiweb staging", charset="UTF-8"',
      'Cache-Control': 'no-store',
    },
  });
}

function credentialsMatch(header: string | null, user: string, password: string) {
  if (!header?.startsWith('Basic ')) return false;
  let decoded = '';
  try {
    decoded = atob(header.slice(6));
  } catch {
    return false;
  }
  const separator = decoded.indexOf(':');
  if (separator < 0) return false;
  return decoded.slice(0, separator) === user && decoded.slice(separator + 1) === password;
}

/** Belt-and-suspenders: X-Robots-Tag while PUBLIC_SITE_INDEXABLE is off (and always on non-live hosts). */
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const englishSection =
    pathname === '/en/servicios' ||
    pathname.startsWith('/en/servicios/') ||
    pathname === '/en/industrias' ||
    pathname.startsWith('/en/industrias/') ||
    pathname === '/en/nosotros' ||
    pathname.startsWith('/en/nosotros/') ||
    pathname === '/en/blogs' ||
    pathname.startsWith('/en/blogs/');
  if (pathname.startsWith('/en/') && pathname !== '/en/' && !englishSection) {
    return context.redirect('/en');
  }

  if (isStagingSite()) {
    const user = await readBinding('STAGING_USER');
    const password = await readBinding('STAGING_PASSWORD');
    if (!user || !password) {
      return new Response('Staging no tiene credenciales configuradas.', {
        status: 500,
        headers: { 'Cache-Control': 'no-store' },
      });
    }
    if (!credentialsMatch(context.request.headers.get('authorization'), user, password)) {
      return unauthorized();
    }
  }

  const response = await next();

  const headers = new Headers(response.headers);
  if (isStagingSite()) headers.set('Cache-Control', 'no-store');
  if (shouldNoIndex(context.url.hostname)) headers.set('X-Robots-Tag', ROBOTS_NOINDEX);
  if (!isStagingSite() && !shouldNoIndex(context.url.hostname)) return response;

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
