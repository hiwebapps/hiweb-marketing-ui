/**
 * Sanity → Cloudflare Deploy Hook.
 * Auth: Authorization: Bearer <SANITY_REVALIDATE_SECRET>
 * Requires env: SANITY_REVALIDATE_SECRET, CLOUDFLARE_DEPLOY_HOOK_URL
 */
import { env } from 'cloudflare:workers';

export const prerender = false;

type WorkerEnv = {
  SANITY_REVALIDATE_SECRET?: string;
  CLOUDFLARE_DEPLOY_HOOK_URL?: string;
  GITHUB_DISPATCH_TOKEN?: string;
  GITHUB_DISPATCH_REPO?: string;
};

function workerEnv(): WorkerEnv {
  const runtime = env as WorkerEnv;
  return {
    SANITY_REVALIDATE_SECRET:
      runtime.SANITY_REVALIDATE_SECRET || import.meta.env.SANITY_REVALIDATE_SECRET,
    CLOUDFLARE_DEPLOY_HOOK_URL:
      runtime.CLOUDFLARE_DEPLOY_HOOK_URL || import.meta.env.CLOUDFLARE_DEPLOY_HOOK_URL,
    GITHUB_DISPATCH_TOKEN:
      runtime.GITHUB_DISPATCH_TOKEN || import.meta.env.GITHUB_DISPATCH_TOKEN,
    GITHUB_DISPATCH_REPO: runtime.GITHUB_DISPATCH_REPO || import.meta.env.GITHUB_DISPATCH_REPO,
  };
}

export async function POST({ request }: { request: Request }) {
  const bindings = workerEnv();
  const expected = bindings.SANITY_REVALIDATE_SECRET;
  const deployHook = bindings.CLOUDFLARE_DEPLOY_HOOK_URL;
  const githubToken = bindings.GITHUB_DISPATCH_TOKEN;
  const githubRepo = bindings.GITHUB_DISPATCH_REPO || 'jahirgosu/hiweb-marketing-ui';

  if (!expected) {
    return json({ ok: false, error: 'Missing SANITY_REVALIDATE_SECRET' }, 500);
  }

  const auth = request.headers.get('authorization') ?? '';
  const provided = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
  if (provided !== expected) {
    return json({ ok: false, error: 'Unauthorized' }, 401);
  }

  try {
    if (deployHook) {
      const redeploy = await fetch(deployHook, { method: 'POST' });
      const detail = await redeploy.text();
      if (!redeploy.ok) {
        return json({ ok: false, error: 'Deploy hook failed', detail }, 502);
      }
      return json({ ok: true, via: 'cloudflare-hook', status: redeploy.status, detail: detail || null });
    }

    if (githubToken) {
      const dispatch = await fetch(`https://api.github.com/repos/${githubRepo}/dispatches`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({ event_type: 'sanity-rebuild' }),
      });
      const detail = await dispatch.text();
      if (!dispatch.ok) {
        return json({ ok: false, error: 'GitHub dispatch failed', detail }, 502);
      }
      return json({ ok: true, via: 'github-dispatch', status: dispatch.status });
    }

    return json({
      ok: true,
      skipped: true,
      message: 'No CLOUDFLARE_DEPLOY_HOOK_URL or GITHUB_DISPATCH_TOKEN — Worker was not rebuilt.',
    });
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
