import { perspectiveCookieName } from '@sanity/preview-url-secret/constants';
import { defineMiddleware } from 'astro:middleware';
import { PREVIEW_ACCESS_COOKIE, verifyPreviewAccess } from './lib/preview-auth';
import { runWithPreview } from './lib/preview-context';
import { legacyEnglishPath } from './lib/legacy-en-paths';
import { legacySpanishPath } from './lib/legacy-es-paths';
import { readBinding, safeEqual } from './lib/runtime-env';
import { ROBOTS_NOINDEX, shouldNoIndex } from './lib/seo';
import { isStagingSite } from './lib/site-env';

const STUDIO_FRAME_ANCESTORS = [
  "'self'",
  'https://hiweb-web.sanity.studio',
  'https://*.sanity.studio',
  'http://localhost:3333',
  'http://localhost:4321',
].join(' ');

const SECURITY_HEADERS: [string, string][] = [
  ['Strict-Transport-Security', 'max-age=31536000'],
  ['X-Content-Type-Options', 'nosniff'],
  ['X-Frame-Options', 'SAMEORIGIN'],
  ['Referrer-Policy', 'strict-origin-when-cross-origin'],
  ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()'],
];

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
  const userOk = safeEqual(decoded.slice(0, separator), user);
  const passwordOk = safeEqual(decoded.slice(separator + 1), password);
  return userOk && passwordOk;
}

/** Belt-and-suspenders: X-Robots-Tag while PUBLIC_SITE_INDEXABLE is off (and always on non-live hosts). */
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const visiblePath = pathname.replace(/[\u200B\u200C\u200D\uFEFF]/g, '');
  if (visiblePath !== pathname) {
    return context.redirect(`${visiblePath}${context.url.search}`);
  }
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (!isStagingSite() && isInternalPage(path)) {
    const rendered = await context.rewrite('/404');
    return withSiteHeaders(rendered, context.url.hostname, 404);
  }
  const legacy = path.startsWith('/en/') ? legacyEnglishPath(path) : legacySpanishPath(path);
  if (legacy) {
    return context.redirect(`${legacy}${context.url.search}`, 301);
  }
  const englishSection =
    path === '/en/success-stories' ||
    path.startsWith('/en/success-stories/') ||
    path.startsWith('/en/services/') ||
    path.startsWith('/en/industries/') ||
    path === '/en/blogs' ||
    path.startsWith('/en/blogs/') ||
    path === '/en/terms' ||
    path === '/en/privacy-policy' ||
    path === '/en/calendar' ||
    path === '/en/contact' ||
    path === '/en/portal' ||
    path === '/en/404';
  // The English About page lives at /en/<slug>, and Studio owns the slug.
  const englishPageCandidate = !englishSection && /^\/en\/[^/]+$/.test(path);
  if (path.startsWith('/en/') && path !== '/en' && !englishSection && !englishPageCandidate) {
    return context.redirect('/en');
  }

  let previewPerspective: string | undefined;
  if (isStagingSite() && !context.isPrerendered) {
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

  if (englishPageCandidate && response.status === 404) {
    return context.redirect('/en');
  }

  if (isMissingDocument(context.request, response, path)) {
    const rendered = await context.rewrite(path.startsWith('/en') ? '/en/404' : '/404');
    return withSiteHeaders(rendered, context.url.hostname, 404);
  }

  return withSiteHeaders(response, context.url.hostname);
});

/** Component kits and demos for the team. Staging only (behind its password). */
function isInternalPage(path: string) {
  return path === '/design-system' || path === '/sections' || path === '/demo' || path.startsWith('/demo/');
}

function isMissingDocument(request: Request, response: Response, path: string) {
  if (response.status !== 404) return false;
  if (path === '/404' || path === '/en/404') return false;
  if (path.startsWith('/api/')) return false;
  const type = response.headers.get('content-type') ?? '';
  if (type.includes('application/json')) return false;
  const accept = request.headers.get('accept') ?? '';
  return accept.includes('text/html');
}

function withSiteHeaders(response: Response, hostname: string, status?: number) {
  const nextStatus = status ?? response.status;
  const headers = new Headers(response.headers);
  const staging = isStagingSite();
  const noindex = shouldNoIndex(hostname);
  if (staging) {
    headers.set('Cache-Control', 'no-store');
    headers.set('Content-Security-Policy', `frame-ancestors ${STUDIO_FRAME_ANCESTORS}`);
    headers.delete('X-Frame-Options');
  }
  if (noindex) headers.set('X-Robots-Tag', ROBOTS_NOINDEX);
  if (!staging) {
    // Same set as public/_headers, which only reaches static assets and prerendered pages.
    for (const [name, value] of SECURITY_HEADERS) headers.set(name, value);
  }

  return new Response(response.body, {
    status: nextStatus,
    statusText: nextStatus === 404 ? 'Not Found' : response.statusText,
    headers,
  });
}
