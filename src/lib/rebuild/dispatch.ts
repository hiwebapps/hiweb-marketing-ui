export type RebuildBindings = {
  PUBLIC_SITE_ENV?: string;
  CLOUDFLARE_DEPLOY_HOOK_URL?: string;
  GITHUB_DISPATCH_TOKEN?: string;
  GITHUB_DISPATCH_REPO?: string;
};

export function canDispatchRebuild(bindings: RebuildBindings) {
  if (bindings.PUBLIC_SITE_ENV === 'staging') return false;
  return Boolean(bindings.CLOUDFLARE_DEPLOY_HOOK_URL || bindings.GITHUB_DISPATCH_TOKEN);
}

export async function dispatchRebuild(bindings: RebuildBindings) {
  if (!canDispatchRebuild(bindings)) return false;

  const deployHook = bindings.CLOUDFLARE_DEPLOY_HOOK_URL;
  if (deployHook) {
    const redeploy = await fetch(deployHook, { method: 'POST' });
    if (!redeploy.ok) {
      console.error(`Deploy hook failed with status ${redeploy.status}`);
      return false;
    }
    return true;
  }

  const githubToken = bindings.GITHUB_DISPATCH_TOKEN;
  if (!githubToken) return false;
  const githubRepo = bindings.GITHUB_DISPATCH_REPO || 'jahirgosu/hiweb-marketing-ui';
  const dispatch = await fetch(`https://api.github.com/repos/${githubRepo}/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ event_type: 'sanity-rebuild' }),
  });
  if (!dispatch.ok) {
    console.error(`GitHub dispatch failed with status ${dispatch.status}`);
    return false;
  }
  return true;
}
