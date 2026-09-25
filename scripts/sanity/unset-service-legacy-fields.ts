/**
 * Remove service fields that no longer exist in the schema.
 * The page copy lives in `sections`.
 *
 *   npx tsx scripts/sanity/unset-service-legacy-fields.ts
 *   npx tsx scripts/sanity/unset-service-legacy-fields.ts --write
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';

const WRITE = process.argv.includes('--write');
const LEGACY = [
  'heroTitle',
  'heroDescription',
  'heroImage',
  'heroBadge',
  'cards',
  'proceso',
  'faqs',
  'planesEyebrow',
  'planesTitle',
  'planesDescription',
  'planesNote',
  'planesNoteLabel',
  'planesNoteHref',
  'planesCtaLabel',
  'planesCtaHref',
  'planes',
];

function cliToken() {
  const file = path.join(os.homedir(), '.config', 'sanity', 'config.json');
  if (!fs.existsSync(file)) return '';
  const config = JSON.parse(fs.readFileSync(file, 'utf8')) as { authToken?: string };
  return config.authToken ?? '';
}

const token = process.env.SANITY_API_WRITE_TOKEN || cliToken();
if (!token) throw new Error('No Sanity token in env or CLI config');

type Doc = {
  _id: string;
  slug?: string;
  present: string[];
  heroInSection?: boolean;
  cardsInSection?: number;
  faqsInSection?: number;
};

async function main() {
  const client = createClient({
    projectId: 'fxardjr1',
    dataset: 'web-2026',
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  });

  const docs = await client.fetch<Doc[]>(
    `*[_type == "service"]{
      _id,
      "slug": slug.current,
      "present": array::compact([
        ${LEGACY.map((name) => `select(defined(${name}) => "${name}")`).join(',\n        ')}
      ]),
      "heroInSection": defined(sections[_type == "serviceHero"][0].title),
      "cardsInSection": count(sections[_type == "serviceOverview"][0].cards),
      "faqsInSection": count(sections[_type == "serviceFaq"][0].items)
    }`,
  );

  for (const doc of docs) {
    if (!doc.present.length) {
      console.log(`${doc._id}: clean`);
      continue;
    }
    if (!doc.heroInSection || !doc.cardsInSection || !doc.faqsInSection) {
      throw new Error(`${doc._id} still needs legacy fields: hero=${doc.heroInSection} cards=${doc.cardsInSection} faqs=${doc.faqsInSection}`);
    }
    console.log(`${doc._id}: unset ${doc.present.join(', ')}`);
    if (!WRITE) continue;
    await client.patch(doc._id).unset(doc.present).commit();
    console.log(`  patched ${doc._id}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
