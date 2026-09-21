/**
 * Patch the 9 service documents in web-2026 with Webflow heroes, cards, process and FAQ.
 *
 *   npx tsx scripts/sanity/write-webflow-services.ts
 *   npx tsx scripts/sanity/write-webflow-services.ts --write
 */
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';
import { WEBFLOW_SERVICES } from '../../src/data/webflow-services';

const ROOT = process.cwd();
const WRITE = process.argv.includes('--write');
const PROJECT_ID = 'fxardjr1';
const DATASET = 'web-2026';

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

async function main() {
  const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: '2026-09-18',
    token: TOKEN,
    useCdn: false,
    perspective: 'published',
  });

  const docs = await client.fetch<Array<{ _id: string; slug: string }>>(
    `*[_type == "service" && defined(slug.current)]{ _id, "slug": slug.current }`,
  );

  console.log(`Dataset ${DATASET}. Write=${WRITE}. Services: ${docs.length}`);

  for (const [slug, copy] of Object.entries(WEBFLOW_SERVICES)) {
    const doc = docs.find((item) => item.slug === slug || item._id === `service-${slug}`);
    console.log(
      `  ${doc ? doc._id : `MISSING ${slug}`}: ${copy.cards.length} cards, ${copy.proceso.length} steps, ${copy.faqs.length} faqs`,
    );
  }

  if (!WRITE) {
    console.log('Dry-run only. Re-run with --write to publish.');
    return;
  }

  for (const [slug, copy] of Object.entries(WEBFLOW_SERVICES)) {
    const doc = docs.find((item) => item.slug === slug || item._id === `service-${slug}`);
    if (!doc) {
      console.warn(`Skip missing service: ${slug}`);
      continue;
    }

    await client
      .patch(doc._id)
      .set({
        nombre: copy.nombre,
        orden: copy.orden,
        tagline: copy.tagline,
        heroTitle: copy.heroTitle,
        heroDescription: copy.heroDescription,
        heroBadge: copy.heroBadge,
        cards: copy.cards.map((item) => ({
          _type: 'titledBlock',
          _key: key('card', item.title),
          ...item,
        })),
        proceso: copy.proceso.map((item) => ({
          _type: 'titledBlock',
          _key: key('step', item.title),
          ...item,
        })),
        faqs: copy.faqs.map((item) => ({
          _type: 'faqItem',
          _key: key('q', item.question),
          ...item,
        })),
        metaTitle: copy.seo.metaTitle,
        metaDescription: copy.seo.metaDescription,
      })
      .commit({ autoGenerateArrayKeys: true });
    console.log(`Patched ${doc._id}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
