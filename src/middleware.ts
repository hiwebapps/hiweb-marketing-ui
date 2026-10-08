import { perspectiveCookieName } from '@sanity/preview-url-secret/constants';
import { defineMiddleware } from 'astro:middleware';
import { PREVIEW_ACCESS_COOKIE, verifyPreviewAccess } from './lib/preview-auth';
import { runWithPreview } from './lib/preview-context';
import { readBinding } from './lib/runtime-env';
import { ROBOTS_NOINDEX, shouldNoIndex } from './lib/seo';
import { isStagingSite } from './lib/site-env';

const STUDIO_FRAME_ANCESTORS = [
  "'self'",
  'https://hiweb-web.sanity.studio',
  'https://*.sanity.studio',
  'http://localhost:3333',
  'http://localhost:4321',
].join(' ');

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
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const englishSection =
    path.startsWith('/en/servicios/') ||
    path.startsWith('/en/industrias/') ||
    path === '/en/nosotros' ||
    path.startsWith('/en/nosotros/') ||
    path === '/en/blogs' ||
    path.startsWith('/en/blogs/') ||
    path === '/en/terminos' ||
    path === '/en/aviso-de-privacidad' ||
    path === '/en/calendario';
  if (path.startsWith('/en/') && path !== '/en' && !englishSection) {
    return context.redirect('/en');
  }

  let previewPerspective: string | undefined;
  if (isStagingSite()) {
    const user = await readBinding('STAGING_USER');
    const password = await readBinding('STAGING_PASSWORD');
    if (!user || !password) {
      return new Response('Staging no tiene credenciales configuradas.', {
        status: 500,
        headers: { 'Cache-Control': 'no-store' },
      });
    }
    const draftModeRoute = pathname === '/api/draft-mode/enable' || pathname === '/api/draft-mode/disable';
    const previewCookie = context.cookies.get(PREVIEW_ACCESS_COOKIE)?.value;
    const presentation = await verifyPreviewAccess(password, previewCookie);
    if (!draftModeRoute && !presentation && !credentialsMatch(context.request.headers.get('authorization'), user, password)) {
      return unauthorized();
    }
    if (presentation) previewPerspective = context.cookies.get(perspectiveCookieName)?.value;
  }

  const response = await runWithPreview(
    previewPerspective ? { perspective: previewPerspective, stega: true } : undefined,
    () => next(),
  );

  const headers = new Headers(response.headers);
  if (isStagingSite()) {
    headers.set('Cache-Control', 'no-store');
    headers.set('Content-Security-Policy', `frame-ancestors ${STUDIO_FRAME_ANCESTORS}`);
    headers.delete('X-Frame-Options');
  }
  if (shouldNoIndex(context.url.hostname)) headers.set('X-Robots-Tag', ROBOTS_NOINDEX);
  if (!isStagingSite() && !shouldNoIndex(context.url.hostname)) return response;

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
