import { env } from 'cloudflare:workers';
import { AppError } from '../shared/errors';

type RateLimiter = {
  limit(options: { key: string }): Promise<{ success: boolean }>;
};

/**
 * Bindings in wrangler.jsonc (`ratelimits`).
 * FORM_RATE_LIMITER (2/min): writes a person makes once (book, cancel, quiz submit).
 * API_RATE_LIMITER (20/min): reads and quiz steps, many per visit.
 */
export type RateLimitBinding = 'FORM_RATE_LIMITER' | 'API_RATE_LIMITER';

/**
 * Throws a 429 AppError when the caller's IP is over the limit for this route.
 * Without the binding (astro dev, preview) it lets the request through.
 */
export async function enforceRateLimit(request: Request, binding: RateLimitBinding, route: string) {
  const limiter = (env as Partial<Record<RateLimitBinding, RateLimiter>>)[binding];
  if (!limiter) return;

  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  const { success } = await limiter.limit({ key: `${route}:${ip}` });
  if (!success) {
    throw new AppError('Demasiadas solicitudes. Espera un minuto e inténtalo de nuevo.', {
      statusCode: 429,
      code: 'RATE_LIMITED',
    });
  }
}
