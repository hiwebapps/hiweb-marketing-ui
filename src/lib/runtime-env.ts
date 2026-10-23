/**
 * Secrets: Worker bindings at runtime, then process.env during the build and
 * prerender. Never read secrets through import.meta.env: Vite copies those
 * values into the deployed Worker script.
 */
type WorkerBindings = Record<string, string | undefined>;

export function buildSecret(name: string): string | undefined {
  const value = typeof process === 'undefined' ? undefined : process.env?.[name];
  return typeof value === 'string' && value ? value : undefined;
}

export async function readBinding(name: string): Promise<string | undefined> {
  try {
    const { env } = await import('cloudflare:workers');
    const value = (env as WorkerBindings)[name];
    if (typeof value === 'string' && value) return value;
  } catch {
    // Not running in a Worker (astro build, node prerender).
  }
  return buildSecret(name);
}

/** String comparison whose time does not depend on where the inputs differ. */
export function safeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}
