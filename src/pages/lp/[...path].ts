/** Campaign landings moved from /lp to /ads. Ads and links already out keep working, query string included. */
export const prerender = false;

export function GET({ params, url }: { params: { path?: string }; url: URL }) {
  const rest = params.path ? `/${params.path}` : '';
  return new Response(null, {
    status: 301,
    headers: { Location: `/ads${rest}${url.search}` },
  });
}
