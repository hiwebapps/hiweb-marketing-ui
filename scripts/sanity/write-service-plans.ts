/**
 * Write the SEO pricing section onto the published service document.
 *
 *   npx tsx scripts/sanity/write-service-plans.ts
 *   npx tsx scripts/sanity/write-service-plans.ts --write
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';
import { SERVICE_PLANS } from '../../src/data/service-plans';

const WRITE = process.argv.includes('--write');
const PROJECT_ID = 'fxardjr1';
const DATASET = 'web-2026';

function cliToken() {
  const file = path.join(os.homedir(), '.config', 'sanity', 'config.json');
  if (!fs.existsSync(file)) return '';
  const config = JSON.parse(fs.readFileSync(file, 'utf8')) as { authToken?: string };
  return config.authToken ?? '';
}

const token = process.env.SANITY_API_WRITE_TOKEN || cliToken();
if (!token) throw new Error('No Sanity token in env or CLI config');

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
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  });

  const copy = SERVICE_PLANS.seo;
  const docs = await client.fetch<Array<{ _id: string; slug: string }>>(
    `*[_type == "service" && slug.current == "seo"]{ _id, "slug": slug.current }`,
  );
  const doc = docs.find((item) => !item._id.startsWith('drafts.')) ?? docs[0];
  if (!doc) throw new Error('Missing published service seo');

  const patch = {
    planesEyebrow: copy.eyebrow,
    planesTitle: copy.title,
    planesDescription: copy.description,
    planesNote: copy.note,
    planesNoteLabel: copy.noteLabel,
    planesNoteHref: copy.noteHref,
    planesCtaLabel: copy.ctaLabel,
    planesCtaHref: copy.ctaHref,
    planes: copy.plans.map((plan) => ({
      _type: 'servicePlan',
      _key: key('plan', plan.name),
      name: plan.name,
      price: plan.price,
      period: plan.period,
      featured: Boolean(plan.featured),
      includes: plan.includes,
    })),
  };

  console.log(`${doc._id}: ${patch.planes.length} plans. Write=${WRITE}`);
  if (!WRITE) return;

  await client.patch(doc._id).set(patch).commit({ autoGenerateArrayKeys: true });
  console.log(`Patched ${doc._id}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'write failed');
  process.exit(1);
});
