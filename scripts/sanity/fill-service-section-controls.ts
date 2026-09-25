/**
 * Fill editable focus, why, industry, process, case and CTA fields.
 *
 *   npx tsx scripts/sanity/fill-service-section-controls.ts --write
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';
import { SERVICE_FOCUS } from '../../src/data/service-focus';

const WRITE = process.argv.includes('--write');
const PROCESS_ICONS = ['search', 'spark', 'play', 'trend'];
const PROCESS_ACCENTS = ['purple', 'cyan', 'orange', 'lime'];
const INDUSTRY_ICONS: Record<string, string> = {
  manufactura: 'factory',
  salud: 'heart',
  inmobiliarias: 'building',
  'turismo-hoteleria': 'plane',
  restaurantes: 'utensils',
  saas: 'app',
};
const WHY_CARDS = [
  {
    _key: 'why-datos',
    _type: 'serviceWhyCard',
    icon: 'activity',
    accent: 'cyan',
    title: 'Enfoque en datos, no en suposiciones',
    description:
      'Utilizamos herramientas de vanguardia para analizar el comportamiento real de tus competidores y usuarios.',
  },
  {
    _key: 'why-transparencia',
    _type: 'serviceWhyCard',
    icon: 'badge',
    accent: 'orange',
    title: 'Transparencia total',
    description:
      'Recibirás informes claros sobre el progreso de tus keywords principales y el impacto real en tus conversiones.',
  },
  {
    _key: 'why-adaptacion',
    _type: 'serviceWhyCard',
    icon: 'spark',
    accent: 'purple',
    title: 'Adaptación constante',
    description:
      'En un mundo donde los algoritmos cambian semanalmente, nuestra agencia de SEO se mantiene a la vanguardia de las tendencias de 2026.',
  },
];

function cliToken() {
  const file = path.join(os.homedir(), '.config', 'sanity', 'config.json');
  if (!fs.existsSync(file)) return '';
  const config = JSON.parse(fs.readFileSync(file, 'utf8')) as { authToken?: string };
  return config.authToken ?? '';
}

const token = process.env.SANITY_API_WRITE_TOKEN || cliToken();
if (!token) throw new Error('No Sanity token in env or CLI config');

type Section = Record<string, unknown> & { _type?: string; _key?: string };

async function main() {
  const client = createClient({
    projectId: 'fxardjr1',
    dataset: 'web-2026',
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  });

  const industries = await client.fetch<{ _id: string; slug: string; nombre: string; tagline: string }[]>(
    `*[_type == "industry" && !(_id in path("drafts.**"))] | order(orden asc) { _id, "slug": slug.current, nombre, tagline }`,
  );
  const cases = await client.fetch<{ _id: string; services: string[] }[]>(
    `*[_type == "caseStudy" && !(_id in path("drafts.**"))]{ _id, "services": servicios[]->slug.current }`,
  );
  const docs = await client.fetch<{ _id: string; slug: string; sections: Section[] }[]>(
    `*[_type == "service" && !(_id in path("drafts.**"))]{ _id, "slug": slug.current, sections }`,
  );

  for (const doc of docs) {
    const focus = SERVICE_FOCUS[doc.slug] ?? [];
    const linked = cases.filter((item) => item.services?.includes(doc.slug));
    const next = (doc.sections ?? []).map((section) => {
      if (section._type === 'serviceFocus' && !Array.isArray(section.items)) {
        return {
          ...section,
          items: focus.map((item) => ({
            _key: item.id,
            _type: 'serviceFocusItem',
            title: item.title,
            summary: item.summary,
            detailTitle: item.detailTitle,
            detail: item.detail,
            icon: item.icon,
            image: item.image,
            imageAlt: item.imageAlt,
          })),
        };
      }
      if (section._type === 'serviceWhy' && !Array.isArray(section.cards)) {
        return { ...section, cards: WHY_CARDS };
      }
      if (section._type === 'serviceIndustries' && !Array.isArray(section.items)) {
        return {
          ...section,
          items: industries.map((industry) => ({
            _key: industry.slug,
            _type: 'serviceIndustryItem',
            industry: { _type: 'reference', _ref: industry._id },
            title: industry.nombre,
            tagline: industry.tagline,
            icon: INDUSTRY_ICONS[industry.slug] ?? 'factory',
          })),
        };
      }
      if (section._type === 'serviceProcess' && Array.isArray(section.steps)) {
        return {
          ...section,
          steps: (section.steps as { _key?: string; title?: string; description?: string; icon?: string; accent?: string }[]).map(
            (step, index) => ({
              _key: step._key || `step-${index}`,
              _type: 'serviceProcessStep',
              title: step.title,
              description: step.description,
              icon: step.icon || PROCESS_ICONS[index % PROCESS_ICONS.length],
              accent: step.accent || PROCESS_ACCENTS[index % PROCESS_ACCENTS.length],
            }),
          ),
        };
      }
      if (section._type === 'serviceCases' && !Array.isArray(section.items)) {
        return {
          ...section,
          items: linked.map((item) => ({
            _key: item._id,
            _type: 'reference',
            _ref: item._id,
          })),
        };
      }
      if (section._type === 'serviceCta') {
        return {
          ...section,
          badge: section.badge || 'Siguiente paso',
          description:
            section.description ||
            'Cuéntanos industria, objetivo e ICP. Te devolvemos un diagnóstico claro y el siguiente paso.',
        };
      }
      return section;
    });

    const changed = JSON.stringify(next) !== JSON.stringify(doc.sections);
    console.log(`${doc._id}: ${changed ? 'update' : 'already complete'}`);
    if (!WRITE || !changed) continue;
    await client.patch(doc._id).set({ sections: next }).commit();
    console.log(`  patched ${doc._id}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
