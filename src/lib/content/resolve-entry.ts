type SlugPath<T> = {
  params: { slug: string };
  props: { entry: T };
};

/** Prerender passes the entry as a prop. Staging SSR looks it up by slug. */
export async function resolveEntry<T>(
  current: T | undefined,
  slug: string | undefined,
  load: () => Promise<SlugPath<T>[]>,
): Promise<T | undefined> {
  if (current) return current;
  if (!slug) return undefined;
  const paths = await load();
  return paths.find((item) => item.params.slug === slug)?.props.entry;
}

export function notFound() {
  return new Response('Not found', { status: 404, statusText: 'Not Found' });
}
