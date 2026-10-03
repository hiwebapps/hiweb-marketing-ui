import { industryStarter, serviceStarter } from './starters';

const PLACEHOLDER_NAMES = new Set(['', 'Nueva industria', 'New industry', 'Nuevo servicio', 'New service']);

type EnglishDraftClient = {
  fetch<T>(query: string, params?: Record<string, unknown>): Promise<T>;
  createIfNotExists(doc: { _id: string; _type: string; [key: string]: unknown }): Promise<unknown>;
  patch(id: string): {
    set(value: Record<string, unknown>): { commit(): Promise<unknown> };
  };
};

type SpanishDoc = {
  nombre?: string;
  orden?: number;
  slug?: string;
  locale?: string;
};

type EnglishDoc = {
  _id: string;
  nombre?: string;
  slug?: string;
};

function publishedId(id: string) {
  return id.replace(/^drafts\./, '');
}

/** Creates the English draft for a Spanish service or industry, without replacing one that already exists. */
export async function ensureServiceOrIndustryEnglish(
  client: EnglishDraftClient,
  schemaType: 'service' | 'industry',
  spanishId: string,
) {
  const baseId = publishedId(spanishId);
  const enId = `${baseId}-en`;
  const [spanish, existing] = await Promise.all([
    client.fetch<SpanishDoc | null>(
      `coalesce(*[_id == "drafts." + $id][0], *[_id == $id][0]){ nombre, orden, "slug": slug.current, locale }`,
      { id: baseId },
    ),
    client.fetch<EnglishDoc | null>(
      `*[_id in [$id, "drafts." + $id]][0]{ _id, nombre, "slug": slug.current }`,
      { id: enId },
    ),
  ]);
  if (spanish?.locale === 'en') return enId;

  const starter = schemaType === 'service' ? serviceStarter('en') : industryStarter('en');
  const nombre = typeof spanish?.nombre === 'string' ? spanish.nombre.trim() : '';
  const slug = typeof spanish?.slug === 'string' ? spanish.slug.trim() : '';
  const englishName = nombre && !PLACEHOLDER_NAMES.has(nombre) ? nombre : starter.nombre;

  if (!existing) {
    await client.createIfNotExists({
      ...starter,
      _id: `drafts.${enId}`,
      _type: schemaType,
      nombre: englishName,
      orden: typeof spanish?.orden === 'number' ? spanish.orden : starter.orden,
      ...(slug ? { slug: { _type: 'slug', current: slug } } : {}),
    });
    return enId;
  }

  const patch: Record<string, unknown> = {};
  if (!existing.slug && slug) patch.slug = { _type: 'slug', current: slug };
  if (PLACEHOLDER_NAMES.has(existing.nombre ?? '') && nombre && !PLACEHOLDER_NAMES.has(nombre)) {
    patch.nombre = nombre;
  }
  if (Object.keys(patch).length > 0) {
    const target = existing._id.startsWith('drafts.') ? existing._id : `drafts.${publishedId(existing._id)}`;
    await client.patch(target).set(patch).commit();
  }
  return enId;
}
