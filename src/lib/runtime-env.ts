import { isStagingSite } from './site-env';

type WorkerBindings = Record<string, string | undefined>;

/** Worker secrets at runtime, with the build-time env as fallback. */
export async function readBinding(name: string): Promise<string | undefined> {
  const fromBuild = import.meta.env[name];
  if (typeof fromBuild === 'string' && fromBuild) return fromBuild;
  if (!isStagingSite()) return undefined;
  try {
    const { env } = await import('cloudflare:workers');
    const value = (env as WorkerBindings)[name];
    return typeof value === 'string' && value ? value : undefined;
  } catch {
    return undefined;
  }
}
