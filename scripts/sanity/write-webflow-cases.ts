/**
 * Replace fictional case studies with Webflow portfolio cases in web-2026.
 *
 *   npx tsx scripts/sanity/write-webflow-cases.ts
 *   npx tsx scripts/sanity/write-webflow-cases.ts --write
 */
import fs from 'node:fs';
import path from 'node:path';
import { createClient, type SanityClient } from '@sanity/client';
import { WEBFLOW_CASES } from '../../src/data/webflow-cases';

const ROOT = process.cwd();
const WRITE = process.argv.includes('--write');
const PROJECT_ID = 'fxardjr1';
const DATASET = 'web-2026';
const FICTIONAL = ['pulse', 'norte-industrial', 'marina-bay', 'clinica-aurora'];

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

function key(prefix: string, seed: string) {
  return `${prefix}-${seed}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

async function uploadCover(client: SanityClient, url: string, filename: string, alt: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Cover ${url} ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload('image', buffer, {
    filename,
    contentType: res.headers.get('content-type') ?? 'image/jpeg',
  });
  return {
    _type: 'image' as const,
    asset: { _type: 'reference' as const, _ref: asset._id },
    alt,
  };
}

async function main() {
  const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: '2026-09-18',
    token: TOKEN,
    useCdn: false,
    perspective: 'published',
  });

  const existing = await client.fetch<Array<{ _id: string; slug: string }>>(
    `*[_type == "caseStudy"]{ _id, "slug": slug.current }`,
  );

  console.log(`Dataset ${DATASET}. Write=${WRITE}. Incoming: ${Object.keys(WEBFLOW_CASES).length}`);
  for (const [slug, copy] of Object.entries(WEBFLOW_CASES)) {
    console.log(
      `  ${slug}: ${copy.cliente} / ${copy.industria.id || 'sin industria'} / ${copy.metricas.length} métricas / ${copy.fases.length} fases`,
    );
  }
  const stale = existing.filter((doc) => FICTIONAL.includes(doc.slug) || FICTIONAL.some((id) => doc._id === `case-${id}`));
  for (const doc of stale) console.log(`  delete ${doc._id}`);

  if (!WRITE) {
    console.log('Dry-run only. Re-run with --write to publish.');
    return;
  }

  for (const [slug, copy] of Object.entries(WEBFLOW_CASES)) {
    const ogImage = copy.cover
      ? await uploadCover(client, copy.cover, `${slug}.jpg`, `Caso ${copy.cliente}`)
      : undefined;
    const doc = {
      _id: `case-${slug}`,
      _type: 'caseStudy',
      cliente: copy.cliente,
      slug: { _type: 'slug', current: slug },
      ...(copy.industria.id
        ? { industria: { _type: 'reference', _ref: `industry-${copy.industria.id}` } }
        : { industria: undefined }),
      servicios: copy.servicios.map((item) => ({
        _type: 'reference',
        _key: item.id,
        _ref: `service-${item.id}`,
      })),
      resultadoFrase: copy.resultadoFrase,
      titulo: copy.titulo,
      resumen: copy.resumen,
      destacado: copy.destacado,
      accent: copy.accent,
      metricas: copy.metricas.map((item) => ({
        _type: 'metric',
        _key: key('m', item.label),
        ...item,
      })),
      reto: copy.reto,
      estrategia: copy.estrategia,
      fases: copy.fases.map((item) => ({
        _type: 'titledBlock',
        _key: key('z', item.title),
        ...item,
      })),
      testimonio: copy.testimonio,
      metaTitle: copy.seo?.metaTitle,
      metaDescription: copy.seo?.metaDescription,
      ogImage,
    };
    if (!copy.industria.id) {
      delete (doc as { industria?: unknown }).industria;
    }
    await client.createOrReplace(doc);
    console.log(`Wrote case-${slug}`);
  }

  for (const doc of stale) {
    await client.delete(doc._id);
    console.log(`Deleted ${doc._id}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
