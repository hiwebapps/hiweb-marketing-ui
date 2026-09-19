/** Hostnames allowed to be indexed once the site is launch-ready. */
const INDEXABLE_HOSTS = new Set(['www.hiwebmarketing.com', 'hiwebmarketing.com']);

export const ROBOTS_NOINDEX =
  'noindex, nofollow, noarchive, nosnippet, noimageindex';

export const DEFAULT_OG_IMAGE = '/images/services/branding-hero.jpg';

/**
 * Keep crawlers off until cutover.
 *
 * Indexing requires BOTH:
 * 1. `PUBLIC_SITE_INDEXABLE=true` (explicit go-live switch)
 * 2. Request host is the live domain (not workers.dev / localhost / preview / Vercel)
 *
 * Until then: robots Disallow, meta robots noindex, X-Robots-Tag.
 */
export function shouldNoIndex(hostname: string): boolean {
  const indexableFlag = String(import.meta.env.PUBLIC_SITE_INDEXABLE ?? '')
    .trim()
    .toLowerCase();
  if (indexableFlag !== 'true' && indexableFlag !== '1') {
    return true;
  }

  const host = hostname.toLowerCase().replace(/\.$/, '');
  return !INDEXABLE_HOSTS.has(host);
}

export function absoluteUrl(pathOrUrl: string, site?: URL | string | undefined) {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  const origin =
    typeof site === 'string'
      ? site
      : site?.href ?? import.meta.env.PUBLIC_SITE_URL ?? 'https://hiweb-marketing-ui.hiwebapps.workers.dev';
  return new URL(pathOrUrl, origin).href;
}
