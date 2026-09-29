import { perspectiveCookieName } from '@sanity/preview-url-secret/constants';
import type { APIRoute } from 'astro';
import { PREVIEW_ACCESS_COOKIE } from '../../../lib/preview-auth';
import { isStagingSite } from '../../../lib/site-env';

export const prerender = false;

function clearCookie(
  cookies: Parameters<APIRoute>[0]['cookies'],
  name: string,
  secure: boolean,
) {
  const options = {
    httpOnly: name !== perspectiveCookieName,
    sameSite: secure ? ('none' as const) : ('lax' as const),
    secure,
    path: '/',
    maxAge: 0,
  };
  cookies.set(name, '', options);
  cookies.delete(name, { path: '/' });
}

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  if (!isStagingSite()) return new Response('Not found', { status: 404 });

  const url = new URL(request.url);
  const secure = url.protocol === 'https:';
  clearCookie(cookies, perspectiveCookieName, secure);
  clearCookie(cookies, PREVIEW_ACCESS_COOKIE, secure);

  if (url.searchParams.get('silent') === '1') {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }

  const redirectTo = url.searchParams.get('redirect') || '/';
  return redirect(redirectTo, 307);
};
