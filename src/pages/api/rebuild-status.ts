/**
 * Live-site deploy queue.
 * GET is public and returns only { queued, deployAt }.
 * POST starts the deploy now. It accepts a Sanity session token for project fxardjr1.
 * Staging never dispatches.
 */
import { env } from 'cloudflare:workers';
import { getD1 } from '../../lib/growth/db/d1';
import { canDispatchRebuild, dispatchRebuild, type RebuildBindings } from '../../lib/rebuild/dispatch';
import { clearPendingRebuild, readRebuildStatus, restorePendingRebuild } from '../../lib/rebuild/queue';

export const prerender = false;

const PROJECT_ID = 'fxardjr1';
const ALLOWED_ORIGINS = new Set([
  'https://hiweb-web.sanity.studio',
  'http://localhost:3333',
  'http://127.0.0.1:3333',
]);

function workerEnv(): RebuildBindings {
  const runtime = env as RebuildBindings;
  return {
    PUBLIC_SITE_ENV: runtime.PUBLIC_SITE_ENV || import.meta.env.PUBLIC_SITE_ENV,
    CLOUDFLARE_DEPLOY_HOOK_URL: runtime.CLOUDFLARE_DEPLOY_HOOK_URL || import.meta.env.CLOUDFLARE_DEPLOY_HOOK_URL,
    GITHUB_DISPATCH_TOKEN: runtime.GITHUB_DISPATCH_TOKEN || import.meta.env.GITHUB_DISPATCH_TOKEN,
    GITHUB_DISPATCH_REPO: runtime.GITHUB_DISPATCH_REPO || import.meta.env.GITHUB_DISPATCH_REPO,
  };
}

function corsHeaders(request: Request) {
  const origin = request.headers.get('origin') ?? '';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Vary: 'Origin',
  };
  if (ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
    headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
  }
  return headers;
}

function json(request: Request, payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: corsHeaders(request) });
}

export function OPTIONS({ request }: { request: Request }) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function GET({ request }: { request: Request }) {
  const database = getD1();
  if (!database) return json(request, { queued: false, deployAt: null });
  try {
    return json(request, await readRebuildStatus(database));
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Rebuild status failed');
    return json(request, { queued: false, deployAt: null }, 500);
  }
}

export async function POST({ request }: { request: Request }) {
  const bindings = workerEnv();
  if (!canDispatchRebuild(bindings)) {
    return json(request, { ok: false, error: 'This worker does not deploy the live site.' }, 409);
  }

  const auth = request.headers.get('authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token || !(await tokenCanAccessProject(token))) {
    return json(request, { ok: false, error: 'Unauthorized' }, 401);
  }

  const database = getD1();
  const previous = database ? await clearPendingRebuild(database) : null;
  let fired = false;
  try {
    fired = await dispatchRebuild(bindings);
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Rebuild dispatch failed');
    fired = false;
  }
  if (!fired) {
    if (database && previous) await restorePendingRebuild(database, previous);
    return json(request, { ok: false, error: 'Deploy hook failed' }, 502);
  }
  return json(request, { ok: true, fired: true });
}

async function tokenCanAccessProject(token: string) {
  const response = await fetch(`https://api.sanity.io/v2021-06-07/projects/${PROJECT_ID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.ok;
}
