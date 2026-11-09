import { env } from 'cloudflare:workers';
import { AppError } from '../shared/errors';

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Rejects the request unless Cloudflare confirms the Turnstile token.
 * Without TURNSTILE_SECRET_KEY (astro dev) it lets the request through.
 */
export async function verifyTurnstile(request: Request, token: unknown, locale: 'es' | 'en' = 'es') {
  const secret = (env as { TURNSTILE_SECRET_KEY?: string }).TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return;

  const response = typeof token === 'string' ? token.trim() : '';
  let success = false;
  if (response) {
    const body = new FormData();
    body.append('secret', secret);
    body.append('response', response);
    const ip = request.headers.get('cf-connecting-ip');
    if (ip) body.append('remoteip', ip);
    try {
      const result = await fetch(VERIFY_URL, { method: 'POST', body });
      const data = (await result.json()) as { success?: boolean };
      success = data.success === true;
    } catch {
      success = false;
    }
  }

  if (!success) {
    const message =
      locale === 'en'
        ? 'We could not confirm you are a person. Reload the page and try again.'
        : 'No pudimos confirmar que eres una persona. Recarga la página e inténtalo de nuevo.';
    throw new AppError(message, {
      statusCode: 400,
      code: 'TURNSTILE_FAILED',
    });
  }
}
