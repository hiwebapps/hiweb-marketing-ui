import type { SanityClient } from 'sanity';

export const STALE_MS = 10 * 60 * 1000;
export const WORDS_PER_MINUTE = 200;

export type PostStatus = 'published' | 'changed' | 'draft';
export type TranslationStatus = 'missingEn' | 'missingEs' | 'stale' | 'ok';

export type PostRow = {
  _id: string;
  _updatedAt: string;
  title?: string;
  slug?: string;
  locale: 'es' | 'en';
  esSlug?: string;
  fecha?: string;
  author?: string;
  servicio?: string;
  industria?: string;
  text?: string;
  missingAlt?: number;
};

export type PostVersion = PostRow & {
  id: string;
  status: PostStatus;
  updatedAt: number;
  words: number;
};

export type PostPair = {
  key: string;
  es?: PostVersion;
  en?: PostVersion;
  translation: TranslationStatus;
};

export const POSTS_QUERY = `*[_type == "post"]{
  _id,
  _updatedAt,
  title,
  "slug": slug.current,
  "locale": coalesce(locale, "es"),
  esSlug,
  fecha,
  "author": coalesce(author->name, autor),
  "servicio": categoriaServicio->nombre,
  "industria": categoriaIndustria->nombre,
  "text": pt::text(body),
  "missingAlt": count(body[_type == "image" && coalesce(alt, "") == ""])
    + select(defined(cover.asset) && coalesce(cover.alt, "") == "" => 1, 0)
}`;

export function publishedId(id: string) {
  return id.replace(/^drafts\./, '');
}

export function countWords(text: string | undefined) {
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

export function readingMinutes(words: number) {
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function formatWords(words: number) {
  return `${words.toLocaleString('es-MX')} palabras · ${readingMinutes(words)} min`;
}

type Block = { _type?: string; children?: { text?: string }[] };

export function bodyText(body: unknown) {
  if (!Array.isArray(body)) return '';
  return (body as Block[])
    .filter((block) => block?._type === 'block')
    .map((block) => (block.children ?? []).map((child) => child.text ?? '').join(''))
    .join('\n');
}

export function translationStatus(es?: { updatedAt: number }, en?: { updatedAt: number }): TranslationStatus {
  if (!es) return 'missingEs';
  if (!en) return 'missingEn';
  return es.updatedAt - en.updatedAt > STALE_MS ? 'stale' : 'ok';
}

export const TRANSLATION_LABELS: Record<TranslationStatus, string> = {
  missingEn: 'Falta EN',
  missingEs: 'Falta ES',
  stale: 'Revisar traducción',
  ok: 'Al día',
};

export const STATUS_LABELS: Record<PostStatus, string> = {
  published: 'Publicado',
  changed: 'Cambios sin publicar',
  draft: 'Borrador',
};

/** Merges drafts over published rows, one version per document id. */
function mergeVersions(rows: PostRow[]) {
  const byId = new Map<string, { draft?: PostRow; published?: PostRow }>();
  for (const row of rows) {
    const id = publishedId(row._id);
    const entry = byId.get(id) ?? {};
    if (row._id.startsWith('drafts.')) entry.draft = row;
    else entry.published = row;
    byId.set(id, entry);
  }
  const versions: PostVersion[] = [];
  for (const [id, { draft, published }] of byId) {
    const current = (draft ?? published)!;
    const status: PostStatus = draft ? (published ? 'changed' : 'draft') : 'published';
    const updatedAt = Math.max(
      draft ? Date.parse(draft._updatedAt) : 0,
      published ? Date.parse(published._updatedAt) : 0,
    );
    versions.push({ ...current, id, status, updatedAt, words: countWords(current.text) });
  }
  return versions;
}

export function buildPairs(rows: PostRow[]): PostPair[] {
  const versions = mergeVersions(rows);
  const spanish = versions.filter((version) => version.locale !== 'en');
  const english = versions.filter((version) => version.locale === 'en');
  const esBySlug = new Map<string, PostVersion>();
  const esById = new Map<string, PostVersion>();
  for (const es of spanish) {
    esById.set(es.id, es);
    if (es.slug) esBySlug.set(es.slug, es);
  }

  const pairs = new Map<string, PostPair>();
  for (const es of spanish) pairs.set(es.id, { key: es.id, es, translation: 'missingEn' });

  for (const en of english) {
    const match =
      (en.esSlug ? esBySlug.get(en.esSlug) : undefined) ??
      (en.id.endsWith('-en') ? esById.get(en.id.slice(0, -3)) : undefined);
    const pair = match ? pairs.get(match.id) : undefined;
    if (pair && !pair.en) pair.en = en;
    else pairs.set(en.id, { key: en.id, en, translation: 'missingEs' });
  }

  return [...pairs.values()]
    .map((pair) => ({ ...pair, translation: translationStatus(pair.es, pair.en) }))
    .sort((a, b) => (b.es?.fecha ?? b.en?.fecha ?? '').localeCompare(a.es?.fecha ?? a.en?.fecha ?? ''));
}

function joinBase(basePath: string, path: string) {
  return `${basePath.replace(/\/$/, '')}${path}`;
}

/** Opens Spanish on the left and English on the right as sibling panes. */
export function splitPath(basePath: string, esId?: string, enId?: string) {
  if (esId && enId) return joinBase(basePath, `/structure/blog;posts-es;${esId}|${enId}`);
  if (esId) return joinBase(basePath, `/structure/blog;posts-es;${esId}`);
  if (enId) return joinBase(basePath, `/structure/blog;posts-en;${enId}`);
  return joinBase(basePath, '/structure/blog');
}

export function sitePath(locale: 'es' | 'en', slug: string) {
  return locale === 'en' ? `/en/blogs/${slug}` : `/blog/${slug}`;
}

export function presentationPath(basePath: string, locale: 'es' | 'en', slug: string) {
  return joinBase(basePath, `/presentation?preview=${encodeURIComponent(sitePath(locale, slug))}`);
}

/** Finds the paired document ids for a post, drafts included. */
export async function findPair(
  client: SanityClient,
  doc: { _id: string; locale?: string; slug?: string; esSlug?: string },
) {
  const id = publishedId(doc._id);
  const raw = client.withConfig({ perspective: 'raw' });
  if (doc.locale === 'en') {
    const fallback = id.endsWith('-en') ? id.slice(0, -3) : '';
    const rows = await raw.fetch<{ _id: string; _updatedAt: string }[]>(
      `*[_type == "post" && coalesce(locale, "es") == "es" && (
        (defined($esSlug) && slug.current == $esSlug) || _id in [$fallback, "drafts." + $fallback]
      )]{_id, _updatedAt}`,
      { esSlug: doc.esSlug ?? null, fallback },
    );
    return summarize(rows);
  }
  const rows = await raw.fetch<{ _id: string; _updatedAt: string }[]>(
    `*[_type == "post" && locale == "en" && (
      (defined($slug) && esSlug == $slug) || _id in [$enId, "drafts." + $enId]
    )]{_id, _updatedAt}`,
    { slug: doc.slug ?? null, enId: `${id}-en` },
  );
  return summarize(rows);
}

function summarize(rows: { _id: string; _updatedAt: string }[]) {
  if (rows.length === 0) return null;
  const id = publishedId(rows[0]._id);
  const updatedAt = Math.max(
    ...rows.filter((row) => publishedId(row._id) === id).map((row) => Date.parse(row._updatedAt)),
  );
  return { id, updatedAt };
}

const COPY_FIELDS = [
  'description',
  'keyword',
  'author',
  'autor',
  'fecha',
  'featured',
  'cover',
  'body',
  'faqs',
  'ogImage',
] as const;

/** Creates the English draft for a Spanish post and returns its id. Returns the existing one if already paired. */
export async function createEnglishDraft(client: SanityClient, esId: string) {
  const id = publishedId(esId);
  const raw = client.withConfig({ perspective: 'raw' });
  const es = await raw.fetch<Record<string, unknown> | null>(
    `coalesce(*[_id == $draftId][0], *[_id == $id][0])`,
    { id, draftId: `drafts.${id}` },
  );
  if (!es) throw new Error('No se encontró el artículo en español.');
  const slug = (es.slug as { current?: string } | undefined)?.current;
  if (!slug) throw new Error('Primero define el slug en español.');

  const existing = await findPair(client, { _id: id, locale: 'es', slug });
  if (existing) return existing.id;

  const refs = ['categoriaServicio', 'categoriaIndustria']
    .map((field) => ({ field, ref: (es[field] as { _ref?: string } | undefined)?._ref }))
    .filter((item): item is { field: string; ref: string } => Boolean(item.ref));
  const englishRefs = await raw.fetch<string[]>(`*[_id in $ids]._id`, {
    ids: refs.map((item) => `${item.ref}-en`),
  });

  let enId = `${id}-en`;
  const taken = await raw.fetch<number>(`count(*[_id in [$enId, "drafts." + $enId]])`, { enId });
  if (taken > 0) enId = `${id}-en-${Date.now().toString(36)}`;

  const draft: Record<string, unknown> = {
    _id: `drafts.${enId}`,
    _type: 'post',
    locale: 'en',
    esSlug: slug,
    title: `[EN] ${typeof es.title === 'string' ? es.title : ''}`.trim(),
  };
  for (const field of COPY_FIELDS) {
    if (es[field] !== undefined) draft[field] = es[field];
  }
  for (const { field, ref } of refs) {
    if (englishRefs.includes(`${ref}-en`)) draft[field] = { _type: 'reference', _ref: `${ref}-en` };
  }

  await client.createIfNotExists(draft as { _id: string; _type: string });
  return enId;
}
