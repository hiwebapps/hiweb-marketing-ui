/**
 * Sanity publish → one Cloudflare deploy, a minute after the last publish.
 * Auth: Authorization: Bearer <SANITY_REVALIDATE_SECRET>
 * The cron in wrangler.jsonc calls the deploy hook. Staging never dispatches.
 */
import { env } from 'cloudflare:workers';
import { getD1 } from '../../lib/growth/db/d1';
import { canDispatchRebuild, type RebuildBindings } from '../../lib/rebuild/dispatch';
import { markRebuildRequested } from '../../lib/rebuild/queue';

export const prerender = false;

function workerEnv(): RebuildBindings & { SANITY_REVALIDATE_SECRET?: string } {
  const runtime = env as RebuildBindings & { SANITY_REVALIDATE_SECRET?: string };
  return {
    SANITY_REVALIDATE_SECRET: runtime.SANITY_REVALIDATE_SECRET || import.meta.env.SANITY_REVALIDATE_SECRET,
    PUBLIC_SITE_ENV: runtime.PUBLIC_SITE_ENV || import.meta.env.PUBLIC_SITE_ENV,
    CLOUDFLARE_DEPLOY_HOOK_URL: runtime.CLOUDFLARE_DEPLOY_HOOK_URL || import.meta.env.CLOUDFLARE_DEPLOY_HOOK_URL,
    GITHUB_DISPATCH_TOKEN: runtime.GITHUB_DISPATCH_TOKEN || import.meta.env.GITHUB_DISPATCH_TOKEN,
    GITHUB_DISPATCH_REPO: runtime.GITHUB_DISPATCH_REPO || import.meta.env.GITHUB_DISPATCH_REPO,
  };
}

export async function POST({ request }: { request: Request }) {
  const bindings = workerEnv();
  const expected = bindings.SANITY_REVALIDATE_SECRET;

  if (!expected) {
    return json({ ok: false, error: 'Missing SANITY_REVALIDATE_SECRET' }, 500);
  }

  const auth = request.headers.get('authorization') ?? '';
  const provided = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
  if (provided !== expected) {
    return json({ ok: false, error: 'Unauthorized' }, 401);
  }

  if (!canDispatchRebuild(bindings)) {
    return json({
      ok: true,
      skipped: true,
      message: 'No deploy hook on this worker — nothing was queued.',
    });
  }

  const database = getD1();
  if (!database) {
    return json({ ok: false, error: 'Missing D1 database' }, 500);
  }

  try {
    await markRebuildRequested(database);
    return json({ ok: true, queued: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return json({ ok: false, error: message }, 500);
  }
}

export function GET() {
  return json({ ok: true, service: 'sanity-rebuild-webhook' });
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
