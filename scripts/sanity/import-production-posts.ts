/**
 * Copy Spanish blog posts from Sanity production → web-2026.
 *
 *   npx tsx scripts/sanity/import-production-posts.ts
 *   npx tsx scripts/sanity/import-production-posts.ts --write
 */
import fs from 'node:fs';
import path from 'node:path';
import { createClient, type SanityClient } from '@sanity/client';
import { rebuildFlattenedTables } from './lib/rebuild-tables';

const ROOT = process.cwd();
const WRITE = process.argv.includes('--write');
const PROJECT_ID = 'fxardjr1';

type Json = Record<string, unknown>;

function loadDotEnv() {
  for (const file of ['.env.local', '.env']) {
    const abs = path.join(ROOT, file);
    if (!fs.existsSync(abs)) continue;
    for (const line of fs.readFileSync(abs, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq < 1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

loadDotEnv();

const TOKEN = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;
if (!TOKEN) {
  throw new Error('Missing SANITY_API_WRITE_TOKEN (or SANITY_API_READ_TOKEN)');
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function clientFor(dataset: string, useCdn = false): SanityClient {
  return createClient({
    projectId: PROJECT_ID,
    dataset,
    apiVersion: '2026-09-18',
    token: TOKEN,
    useCdn,
    perspective: 'published',
  });
}

function asDate(value: unknown): string {
  if (typeof value === 'string' && value.length >= 10) return value.slice(0, 10);
  return new Date().toISOString().slice(0, 10);
}

function stripMeta(doc: Json): Json {
  const next = { ...doc };
  delete next._rev;
  delete next._createdAt;
  delete next._updatedAt;
  delete next._updatedBy;
  return next;
}

function collectAssetIds(value: unknown, out = new Set<string>()): Set<string> {
  if (!value || typeof value !== 'object') return out;
  if (Array.isArray(value)) {
    for (const item of value) collectAssetIds(item, out);
    return out;
  }
  const rec = value as Json;
  if (typeof rec._ref === 'string' && /^(image|file)-/.test(rec._ref)) out.add(rec._ref);
  for (const nested of Object.values(rec)) collectAssetIds(nested, out);
  return out;
}

function countByType(value: unknown, types: string[]): number {
  let count = 0;
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    const rec = node as Json;
    if (typeof rec._type === 'string' && types.includes(rec._type)) count += 1;
    Object.values(rec).forEach(walk);
  };
  walk(value);
  return count;
}

function remapAssets(value: unknown, rewrite: Map<string, string>): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => remapAssets(item, rewrite)).filter((item) => item !== undefined);
  }
  if (!value || typeof value !== 'object') return value;
  const rec = value as Json;
  if (typeof rec._ref === 'string' && /^(image|file)-/.test(rec._ref)) {
    const nextId = rewrite.get(rec._ref);
    if (!nextId) return undefined;
    return { ...rec, _ref: nextId };
  }
  const next: Json = {};
  for (const [key, nested] of Object.entries(rec)) {
    const mapped = remapAssets(nested, rewrite);
    if (mapped !== undefined) next[key] = mapped;
  }
  if ((next._type === 'image' || next._type === 'file') && !(next.asset as Json | undefined)?._ref) {
    return undefined;
  }
  return next;
}

async function copyAssets(
  source: SanityClient,
  dest: SanityClient,
  ids: Set<string>,
): Promise<Map<string, string>> {
  const rewrite = new Map<string, string>();
  if (ids.size === 0) return rewrite;

  const existing = await dest.fetch<string[]>(`*[_id in $ids]._id`, { ids: [...ids] });
  const have = new Set(existing ?? []);

  let copied = 0;
  let skipped = 0;
  let missing = 0;

  for (const id of ids) {
    if (have.has(id)) {
      rewrite.set(id, id);
      skipped += 1;
      continue;
    }

    const asset = await source.fetch<{
      _id: string;
      url?: string;
      originalFilename?: string;
      mimeType?: string;
    } | null>(`*[_id == $id][0]{ _id, url, originalFilename, mimeType }`, { id });

    if (!asset?.url) {
      console.warn(`Skipping missing source asset ${id}`);
      missing += 1;
      continue;
    }

    const res = await fetch(asset.url);
    if (!res.ok) {
      console.warn(`Failed to download ${id}: ${res.status}`);
      missing += 1;
      continue;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    const kind = id.startsWith('file-') ? 'file' : 'image';
    const uploaded = await dest.assets.upload(kind, buffer, {
      filename: asset.originalFilename ?? id,
      contentType: asset.mimeType,
    });
    rewrite.set(id, uploaded._id);
    have.add(uploaded._id);
    copied += 1;
    if (copied % 10 === 0) console.log(`Copied ${copied} assets…`);
  }

  console.log(`Assets: copied ${copied}, already in dest ${skipped}, missing ${missing}, total ${ids.size}`);
  return rewrite;
}

type CatalogItem = { _id: string; slug: string; nombre: string; key: string };

function matchCatalog(title: string, items: CatalogItem[]): CatalogItem | undefined {
  const key = slugify(title);
  return items.find(
    (item) =>
      item.key === key ||
      item.slug === key ||
      item.nombre.toLowerCase() === title.toLowerCase() ||
      key.includes(item.slug) ||
      item.slug.includes(key),
  );
}

const POST_QUERY = `*[
  _type == "post" &&
  defined(slug.current) &&
  !(language == "en")
] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  language,
  excerpt,
  mainImage,
  publishedAt,
  author->{_id, name, "slug": slug.current},
  categories[]->{_id, title, "slug": slug.current},
  body,
  metaTitle,
  metaDescription,
  ogImage
}`;

async function main() {
  const production = clientFor('production', false);
  const dest = clientFor('web-2026', false);

  const [posts, services, industries] = await Promise.all([
    production.fetch<Json[]>(POST_QUERY),
    dest.fetch<CatalogItem[]>(
      `*[_type == "service" && defined(slug.current)]{ _id, "slug": slug.current, nombre, "key": slug.current }`,
    ),
    dest.fetch<CatalogItem[]>(
      `*[_type == "industry" && defined(slug.current)]{ _id, "slug": slug.current, nombre, "key": slug.current }`,
    ),
  ]);

  const serviceCatalog = (services ?? []).map((item) => ({ ...item, key: slugify(item.nombre) }));
  const industryCatalog = (industries ?? []).map((item) => ({ ...item, key: slugify(item.nombre) }));

  const authors = new Map<string, Json>();
  const mutations: Json[] = [];
  const summary: Array<{ slug: string; title: string; images: number; tables: number }> = [];

  for (const post of posts) {
    const slug = String(post.slug ?? '').trim();
    if (!slug) continue;

    const rawBody = Array.isArray(post.body) ? (post.body as Json[]) : [];
    const rebuilt = rebuildFlattenedTables(rawBody);
    const body = rebuilt.body;
    const images = countByType(post, ['image']);
    const tables = rebuilt.tables.length || countByType(body, ['table', 'blogTable']);

    const authorName = String((post.author as Json | null)?.name ?? 'Hiweb');
    const authorSlug = slugify(String((post.author as Json | null)?.slug ?? authorName));
    const authorId = `author-${authorSlug || 'hiweb'}`;

    if (!authors.has(authorId)) {
      authors.set(authorId, {
        _id: authorId,
        _type: 'author',
        name: authorName,
        slug: { _type: 'slug', current: authorSlug || 'hiweb' },
      });
    }

    const categoryTitles = Array.isArray(post.categories)
      ? (post.categories as Json[]).map((cat) => String(cat.title ?? '')).filter(Boolean)
      : [];
    const keyword = categoryTitles[0] ?? '';
    const serviceMatch = categoryTitles
      .map((title) => matchCatalog(title, serviceCatalog))
      .find(Boolean);
    const industryMatch = categoryTitles
      .map((title) => matchCatalog(title, industryCatalog))
      .find(Boolean);

    const description =
      String(post.excerpt ?? '').trim() || String(post.title ?? '').trim() || slug;

    const doc: Json = {
      _id: `post-${slug}`,
      _type: 'post',
      title: String(post.title ?? slug),
      slug: { _type: 'slug', current: slug },
      description,
      keyword,
      autor: authorName,
      author: { _type: 'reference', _ref: authorId },
      fecha: asDate(post.publishedAt),
      featured: false,
      body,
    };

    if (post.mainImage) doc.cover = stripMeta(post.mainImage as Json);
    if (post.metaTitle) doc.metaTitle = post.metaTitle;
    if (post.metaDescription) doc.metaDescription = post.metaDescription;
    if (post.ogImage) doc.ogImage = stripMeta(post.ogImage as Json);
    if (serviceMatch) {
      doc.categoriaServicio = { _type: 'reference', _ref: serviceMatch._id };
    }
    if (industryMatch) {
      doc.categoriaIndustria = { _type: 'reference', _ref: industryMatch._id };
    }

    mutations.push(doc);
    summary.push({ slug, title: String(post.title ?? slug), images, tables });
  }

  console.log(
    `${WRITE ? 'WRITE' : 'DRY-RUN'} ${mutations.length} posts from production → web-2026`,
  );
  console.log(`authors: ${authors.size}`);
  for (const row of summary.slice(0, 12)) {
    console.log(`  /blog/${row.slug}  img:${row.images} table:${row.tables}  ${row.title}`);
  }
  if (summary.length > 12) console.log(`  … ${summary.length - 12} more`);

  const assetIds = collectAssetIds(mutations);
  console.log(`image/file refs: ${assetIds.size}`);

  if (!WRITE) {
    console.log('Re-run with --write to publish.');
    return;
  }

  const rewrite = await copyAssets(production, dest, assetIds);
  const docs = mutations.map((doc) => {
    const mapped = remapAssets(doc, rewrite) as Json;
    if (!(mapped.cover as Json | undefined)?.asset) delete mapped.cover;
    if (!(mapped.ogImage as Json | undefined)?.asset) delete mapped.ogImage;
    return mapped;
  });

  const txAuthors = dest.transaction();
  for (const author of authors.values()) {
    txAuthors.createOrReplace(author);
  }
  await txAuthors.commit({ visibility: 'async' });
  console.log(`Committed ${authors.size} authors.`);

  const BATCH = 8;
  for (let i = 0; i < docs.length; i += BATCH) {
    const slice = docs.slice(i, i + BATCH);
    const tx = dest.transaction();
    for (const doc of slice) {
      tx.createOrReplace(doc);
    }
    await tx.commit({ visibility: 'async', autoGenerateArrayKeys: true });
    console.log(`Committed posts ${i + 1}–${i + slice.length} / ${docs.length}`);
  }
  console.log(`Done: ${docs.length} posts.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
