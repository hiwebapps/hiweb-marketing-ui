import { createClient, type SanityClient } from '@sanity/client';
import { isStagingSite } from '../lib/site-env';
import { readBinding } from '../lib/runtime-env';

export const SANITY_PROJECT_ID =
  import.meta.env.PUBLIC_SANITY_PROJECT_ID ||
  import.meta.env.SANITY_STUDIO_PROJECT_ID ||
  'fxardjr1';

export const SANITY_DATASET =
  import.meta.env.PUBLIC_SANITY_DATASET ||
  import.meta.env.SANITY_STUDIO_DATASET ||
  'web-2026';

export const SANITY_API_VERSION = '2026-09-18';

export function isSanityConfigured() {
  return Boolean(
    import.meta.env.PUBLIC_SANITY_PROJECT_ID && import.meta.env.PUBLIC_SANITY_DATASET,
  );
}

export function createSanityClient(options?: { token?: string; useCdn?: boolean }): SanityClient {
  const staging = isStagingSite();
  return createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    useCdn: options?.useCdn ?? false,
    token: options?.token ?? import.meta.env.SANITY_API_READ_TOKEN,
    // Drafts overlay published content. The read token is required.
    perspective: staging ? 'drafts' : 'published',
  });
}

let cached: Promise<SanityClient> | null = null;

export function getSanityClient() {
  cached ??= createRuntimeClient();
  return cached;
}

async function createRuntimeClient() {
  if (!isStagingSite()) return createSanityClient();
  const token = await readBinding('SANITY_API_READ_TOKEN');
  return createSanityClient({ token });
}
