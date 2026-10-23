/** Sanity project that owns the Studio. Tokens from other projects are rejected. */
export const SANITY_PROJECT_ID = 'fxardjr1';

/** Project roles allowed to write through the Worker (sync Instagram, trigger a deploy). */
const WRITER_ROLES = new Set(['administrator', 'editor']);

/** Bearer token from an Authorization header, or '' when there is none. */
export function bearerToken(request: Request) {
  const auth = request.headers.get('authorization') ?? '';
  return auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
}

type SanityMe = {
  provider?: string;
  roles?: { name?: string }[];
};

/**
 * True when the token belongs to a person logged into Studio with an
 * administrator or editor role on this project. API tokens (provider
 * "sanity-token") are rejected even with the editor role: the read token
 * the Worker and CI use has that role.
 */
export async function tokenIsProjectEditor(token: string) {
  if (!token) return false;
  const response = await fetch(`https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return false;
  const me = (await response.json().catch(() => null)) as SanityMe | null;
  if (!me || me.provider === 'sanity-token') return false;
  return (me.roles ?? []).some((role) => role.name && WRITER_ROLES.has(role.name));
}
