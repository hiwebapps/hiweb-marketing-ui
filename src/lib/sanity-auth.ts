/** Sanity project that owns the Studio. Tokens from other projects are rejected. */
export const SANITY_PROJECT_ID = 'fxardjr1';

/** Bearer token from an Authorization header, or '' when there is none. */
export function bearerToken(request: Request) {
  const auth = request.headers.get('authorization') ?? '';
  return auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
}

/** True when Sanity accepts the token for this project (a logged-in Studio user). */
export async function tokenCanAccessProject(token: string) {
  if (!token) return false;
  const response = await fetch(`https://api.sanity.io/v2021-06-07/projects/${SANITY_PROJECT_ID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.ok;
}
