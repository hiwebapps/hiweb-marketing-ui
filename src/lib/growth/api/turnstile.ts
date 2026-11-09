import { env } from 'cloudflare:workers';
import { AppError } from '../shared/errors';

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Rejects the request unless Cloudflare confirms the Turnstile token.
 * Without TURNSTILE_SECRET_KEY (astro dev) it lets the request through.
 */
export async function verifyTurnstile(request: Request, token: unknown) {
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
    throw new AppError('No pudimos confirmar que eres una persona. Recarga la página e inténtalo de nuevo.', {
      statusCode: 400,
      code: 'TURNSTILE_FAILED',
    });
  }
}
