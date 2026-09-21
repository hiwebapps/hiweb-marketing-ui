/**
 * Seed Home selection lists: hero carousel, services grid, industries.
 *
 *   npx tsx scripts/sanity/migrate-home-sections.ts
 *   npx tsx scripts/sanity/migrate-home-sections.ts --write
 */
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';

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

function ref(id: string) {
  return { _type: 'reference', _ref: id, _key: id.replace(/[^a-z0-9-]/gi, '') };
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

  const home = await client.getDocument('homePage');
  if (!home) {
    throw new Error('homePage document not found');
  }

  const cases = await client.fetch<
    Array<{ _id: string; slug: string; cliente: string; destacado?: boolean }>
  >(`*[_type == "caseStudy" && defined(slug.current)]{
    _id, "slug": slug.current, cliente, destacado
  }`);
  const services = await client.fetch<Array<{ _id: string; slug: string; orden: number }>>(
    `*[_type == "service" && defined(slug.current)] | order(orden asc){ _id, "slug": slug.current, orden }`,
  );
  const industries = await client.fetch<Array<{ _id: string; slug: string }>>(
    `*[_type == "industry" && defined(slug.current)] | order(orden asc){ _id, "slug": slug.current }`,
  );

  const orderedCases = [...cases].sort((a, b) => {
    if (Boolean(a.destacado) !== Boolean(b.destacado)) return a.destacado ? -1 : 1;
    return a.cliente.localeCompare(b.cliente, 'es');
  });

  const payload = {
    heroCases: orderedCases.map((item) => ref(item._id)),
    serviceItems: services.map((item) => ({
      _type: 'homeServiceItem',
      _key: item.slug,
      service: { _type: 'reference', _ref: item._id },
    })),
    homeIndustries: industries.map((item) => ref(item._id)),
    industryIntro: home.industryIntro ?? {
      _type: 'sectionIntro',
      eyebrow: 'Industrias',
      title: 'Hablamos el idioma de tu sector',
      description: 'Casos, retos y métricas propias de tu industria — no un playbook genérico.',
    },
  };

  console.log(`Dataset ${DATASET}. Write=${WRITE}`);
  console.log(`heroCases: ${orderedCases.map((item) => item.slug).join(', ')}`);
  console.log(`serviceItems: ${services.map((item) => item.slug).join(', ')}`);
  console.log(`homeIndustries: ${industries.map((item) => item.slug).join(', ')}`);

  if (!WRITE) {
    console.log('Dry-run only. Re-run with --write to publish.');
    return;
  }

  await client.patch('homePage').setIfMissing(payload).commit({ autoGenerateArrayKeys: true });
  console.log('Seeded home selection lists (setIfMissing)');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
