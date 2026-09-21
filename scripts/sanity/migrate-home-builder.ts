/**
 * Fold the flat homePage fields into the sections array.
 *
 *   npx tsx scripts/sanity/migrate-home-builder.ts
 *   npx tsx scripts/sanity/migrate-home-builder.ts --write
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';

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

const FLAT_FIELDS = [
  'heroTitle',
  'heroLead',
  'primaryCta',
  'secondaryCta',
  'heroCases',
  'pillarIntro',
  'pillars',
  'serviceIntro',
  'serviceItems',
  'industryIntro',
  'homeIndustries',
  'storiesIntro',
  'testimonials',
  'processIntro',
  'process',
  'metricsIntro',
  'metrics',
  'faqIntro',
  'faqCategories',
];

function block(type: string, fields: Record<string, unknown>) {
  return { _type: type, _key: type, ...fields };
}

async function main() {
  const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: '2026-09-18',
    token,
    useCdn: false,
    perspective: 'raw',
  });

  const ids = ['homePage', 'drafts.homePage'];
  for (const id of ids) {
    const home = await client.getDocument(id);
    if (!home) {
      console.log(`${id}: not found`);
      continue;
    }
    await migrateDocument(client, home, WRITE);
  }
}

async function migrateDocument(
  client: ReturnType<typeof createClient>,
  home: Record<string, unknown>,
  write: boolean,
) {
  const id = String(home._id);
  const existing = Array.isArray(home.sections) ? home.sections : [];
  const present = FLAT_FIELDS.filter((field) => home[field] != null);
  console.log(`${id}: existing sections ${existing.length}; flat fields ${present.join(', ') || '(none)'}`);
  if (existing.length) {
    console.log(`${id}: sections already set`);
    return;
  }

  const sections = [
    block('homeHero', {
      title: home.heroTitle,
      lead: home.heroLead,
      primaryCta: home.primaryCta,
      secondaryCta: home.secondaryCta,
      cases: home.heroCases,
    }),
    block('homePillars', { intro: home.pillarIntro, items: home.pillars }),
    block('homeServices', { intro: home.serviceIntro, items: home.serviceItems }),
    block('homeIndustries', {
      intro: home.industryIntro ?? {
        _type: 'sectionIntro',
        eyebrow: 'Industrias',
        title: 'Hablamos el idioma de tu sector',
        description: 'Casos, retos y métricas propias de tu industria — no un playbook genérico.',
      },
      items: home.homeIndustries,
    }),
    block('homeStories', { intro: home.storiesIntro, items: home.testimonials }),
    block('homeProcess', { intro: home.processIntro, items: home.process }),
    block('homeMetrics', { intro: home.metricsIntro, items: home.metrics }),
    block('homeTeam', {
      eyebrow: 'Equipo',
      title: 'Conoce al equipo Hiweb',
      description:
        'Un núcleo senior en estrategia, performance, creativo y producto web. Las caras que sí aparecen en la auditoría.',
      ctaLabel: 'Conoce a todo el equipo',
      ctaHref: '/nosotros#nosotros',
    }),
    block('homeFaq', { intro: home.faqIntro, categories: home.faqCategories }),
    block('homeCta', {
      badge: 'Siguiente paso',
      title: 'Listos cuando tú lo estés.',
      description: 'Cuéntanos industria, objetivo e ICP. Te devolvemos un diagnóstico claro y el siguiente paso.',
      primaryCta: { _type: 'cta', label: 'Agenda tu auditoría', href: '/contacto' },
    }),
  ];

  console.log(`${id}: ${sections.map((section) => section._type).join(' → ')}`);
  if (!write) return;

  await client.patch(id).set({ sections }).unset(FLAT_FIELDS).commit({ autoGenerateArrayKeys: true });
  console.log(`${id}: moved into sections`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
