import { createClient } from '@sanity/client';
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import { perspectiveCookieName } from '@sanity/preview-url-secret/constants';
import type { APIRoute } from 'astro';
import { PREVIEW_ACCESS_COOKIE, PREVIEW_ACCESS_MAX_AGE, signPreviewAccess } from '../../../lib/preview-auth';
import { readBinding } from '../../../lib/runtime-env';
import { isStagingSite } from '../../../lib/site-env';
import { SANITY_API_VERSION, SANITY_DATASET, SANITY_PROJECT_ID } from '../../../sanity/client';

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  if (!isStagingSite()) return new Response('Not found', { status: 404 });

  const token = await readBinding('SANITY_API_READ_TOKEN');
  const password = await readBinding('STAGING_PASSWORD');
  if (!token || !password) {
    return new Response('Staging no tiene credenciales de preview.', { status: 500 });
  }

  const client = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    token,
    useCdn: false,
    perspective: 'published',
  });
  const { isValid, redirectTo = '/', studioPreviewPerspective } = await validatePreviewUrl(client, request.url);
  if (!isValid) return new Response('Invalid secret', { status: 401 });

  const secure = new URL(request.url).protocol === 'https:';
  const cookie = {
    sameSite: secure ? ('none' as const) : ('lax' as const),
    secure,
    path: '/',
  };
  cookies.set(perspectiveCookieName, studioPreviewPerspective ?? 'drafts', {
    ...cookie,
    httpOnly: false,
  });
  cookies.set(PREVIEW_ACCESS_COOKIE, await signPreviewAccess(password), {
    ...cookie,
    httpOnly: true,
    maxAge: PREVIEW_ACCESS_MAX_AGE,
  });

  return redirect(redirectTo, 307);
};
