/** Public key of the invisible Turnstile widget "Hiweb sitio - formularios". */
export const TURNSTILE_SITE_KEY = '0x4AAAAAAF6gcVoOn-EkbiN-';

/** Name of the hidden field bots fill and people never see. */
export const HONEYPOT_FIELD = 'hw_company_url';

/** Off-screen instead of display:none, which many bots skip. */
export const HONEYPOT_STYLE = {
  position: 'absolute',
  left: '-10000px',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
} as const;

type TurnstileApi = {
  render(element: HTMLElement, options: Record<string, unknown>): string;
  remove(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const TOKEN_TIMEOUT_MS = 10_000;

let loading: Promise<TurnstileApi | null> | null = null;

function loadTurnstile(): Promise<TurnstileApi | null> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loading ??= new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(window.turnstile ?? null);
    script.onerror = () => {
      loading = null;
      resolve(null);
    };
    document.head.append(script);
  });
  return loading;
}

/** Starts loading the script early so the token is ready sooner at submit. */
export function preloadTurnstile() {
  if (typeof window !== 'undefined') void loadTurnstile();
}

/**
 * A fresh token for one submit. Tokens expire after five minutes, so this runs at submit time.
 * Resolves to an empty string when Turnstile cannot run. The server decides what that means.
 */
export async function getTurnstileToken(): Promise<string> {
  const api = await loadTurnstile();
  if (!api) return '';
  return new Promise((resolve) => {
    const host = document.createElement('div');
    host.style.cssText = 'position:fixed;width:0;height:0;overflow:hidden;';
    document.body.append(host);
    let widgetId = '';
    const finish = (token: string) => {
      window.clearTimeout(timer);
      if (widgetId) api.remove(widgetId);
      host.remove();
      resolve(token);
    };
    const timer = window.setTimeout(() => finish(''), TOKEN_TIMEOUT_MS);
    try {
      widgetId = api.render(host, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => finish(token),
        'error-callback': () => finish(''),
        'timeout-callback': () => finish(''),
      });
    } catch {
      finish('');
    }
  });
}
