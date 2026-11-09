/**
 * Campaign parameters carried from the ad click to the lead.
 * Kept per tab in sessionStorage as `hw_<key>`, so they survive moving between pages.
 */
export const ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'fbclid',
] as const;

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];
export type Attribution = Partial<Record<AttributionKey | 'referrer', string>>;

const PREFIX = 'hw_';
const ADS_PATH = /^\/ads(\/|$)/;

function storage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function save(store: Storage, key: string, value: string | null) {
  try {
    if (value) store.setItem(PREFIX + key, value);
    else store.removeItem(PREFIX + key);
  } catch {
    /* private mode or full storage */
  }
}

/**
 * A URL with campaign parameters replaces the stored set, so the last ad clicked wins.
 * The referrer is the first external host seen in this tab: later pages only see our own domain.
 */
export function captureAttribution() {
  if (typeof window === 'undefined') return;
  const store = storage();
  if (!store) return;

  const params = new URLSearchParams(window.location.search);
  if (ATTRIBUTION_KEYS.some((key) => params.get(key))) {
    for (const key of ATTRIBUTION_KEYS) save(store, key, params.get(key)?.trim() || null);
  }

  if (!store.getItem(`${PREFIX}referrer`) && document.referrer) {
    try {
      const host = new URL(document.referrer).hostname;
      if (host && host !== window.location.hostname) save(store, 'referrer', host);
    } catch {
      /* malformed referrer */
    }
  }
}

export function readAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  captureAttribution();
  const store = storage();
  if (!store) return {};
  const result: Attribution = {};
  for (const key of [...ATTRIBUTION_KEYS, 'referrer'] as const) {
    const value = store.getItem(PREFIX + key);
    if (value) result[key] = value;
  }
  return result;
}

/** Adds the stored campaign parameters to links that stay inside /ads/. Other links come back unchanged. */
export function withAttribution(href: string): string {
  if (typeof window === 'undefined') return href;
  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return href;
  }
  if (url.origin !== window.location.origin || !ADS_PATH.test(url.pathname)) return href;

  const current = readAttribution();
  let changed = false;
  for (const key of ATTRIBUTION_KEYS) {
    const value = current[key];
    if (value && !url.searchParams.has(key)) {
      url.searchParams.set(key, value);
      changed = true;
    }
  }
  return changed ? url.toString() : href;
}
