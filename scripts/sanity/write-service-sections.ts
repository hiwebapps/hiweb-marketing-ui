/**
 * Copy each service's current page into the sections array.
 *
 *   npx tsx scripts/sanity/write-service-sections.ts
 *   npx tsx scripts/sanity/write-service-sections.ts --write
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';
import { SERVICE_PITCH } from '../../src/data/service-pitch';

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

function key(prefix: string) {
  return prefix;
}

type Block = { title?: string; description?: string; _key?: string };
type Plan = {
  name?: string;
  price?: string;
  period?: string;
  featured?: boolean;
  includes?: string[];
  _key?: string;
};

type ServiceDoc = {
  _id: string;
  slug: string;
  nombre: string;
  tagline?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroBadge?: string;
  heroImage?: { _type?: string; asset?: { _ref?: string }; alt?: string };
  cards?: Block[];
  proceso?: Block[];
  faqs?: { question?: string; answer?: string; _key?: string }[];
  planesEyebrow?: string;
  planesTitle?: string;
  planesDescription?: string;
  planesNote?: string;
  planesNoteLabel?: string;
  planesNoteHref?: string;
  planesCtaLabel?: string;
  planesCtaHref?: string;
  planes?: Plan[];
  sections?: unknown[];
};

function titled(items: Block[] | undefined, prefix: string) {
  return (items ?? [])
    .filter((item) => item.title)
    .map((item, index) => ({
      _key: item._key || key(`${prefix}-${index}`),
      _type: 'titledBlock',
      title: item.title,
      description: item.description ?? '',
    }));
}

function sectionsFor(doc: ServiceDoc) {
  const nombre = doc.nombre;
  const sections: Record<string, unknown>[] = [
    {
      _key: key('hero'),
      _type: 'serviceHero',
      title: doc.heroTitle || nombre,
      description: doc.heroDescription || doc.tagline || '',
      badge: doc.heroBadge || nombre,
      ...(doc.heroImage?.asset?._ref
        ? { image: { _type: 'image', asset: { _type: 'reference', _ref: doc.heroImage.asset._ref }, alt: doc.heroImage.alt || nombre } }
        : {}),
      ctaLabel: 'Cotiza tu proyecto',
      ctaHref: '/contacto',
    },
    {
      _key: key('overview'),
      _type: 'serviceOverview',
      eyebrow: 'El servicio',
      title: `Cómo se entiende ${nombre}`,
      description: doc.tagline || '',
      cards: titled(doc.cards, 'card'),
    },
    {
      _key: key('focus'),
      _type: 'serviceFocus',
      eyebrow: 'Cómo se ejecuta',
      title: 'Cuatro frentes del mismo servicio',
      description: 'Elige un frente. A la derecha está lo que hacemos en concreto, no el nombre del paquete.',
    },
    {
      _key: key('pitch'),
      _type: 'servicePitch',
      ...(SERVICE_PITCH[doc.slug] ?? {}),
    },
  ];

  if (doc.slug === 'seo') {
    sections.push({
      _key: key('why'),
      _type: 'serviceWhy',
      title: '¿Por qué elegir a Hiweb como tu Agencia de SEO en México?',
      description: 'No somos solo proveedores; somos tu partner estratégico en el crecimiento digital.',
      ctaLabel: 'Agenda un diagnóstico',
      ctaHref: '/contacto',
    });
  }

  if (doc.planesTitle && doc.planes?.length) {
    sections.push({
      _key: key('plans'),
      _type: 'servicePlans',
      eyebrow: doc.planesEyebrow || 'Planes',
      title: doc.planesTitle,
      description: doc.planesDescription || '',
      note: doc.planesNote || '',
      noteLabel: doc.planesNoteLabel,
      noteHref: doc.planesNoteHref,
      ctaLabel: doc.planesCtaLabel || 'Cotiza ahora con nosotros',
      ctaHref: doc.planesCtaHref || '/contacto',
      plans: doc.planes.map((plan, index) => ({
        _key: plan._key || key(`plan-${index}`),
        _type: 'servicePlan',
        name: plan.name,
        price: plan.price,
        period: plan.period,
        featured: Boolean(plan.featured),
        includes: plan.includes ?? [],
      })),
    });
  }

  sections.push(
    {
      _key: key('industries'),
      _type: 'serviceIndustries',
      title: 'Cómo se lee este servicio en cada industria',
    },
    {
      _key: key('process'),
      _type: 'serviceProcess',
      eyebrow: 'Cómo trabajamos',
      title: `Proceso de ${nombre}`,
      description: 'De la auditoría al reporte. Un sistema medible, no un paquete suelto de tácticas.',
      steps: titled(doc.proceso, 'step'),
    },
    {
      _key: key('cases'),
      _type: 'serviceCases',
      eyebrow: 'Casos',
      title: `Casos de ${nombre}`,
    },
    {
      _key: key('faq'),
      _type: 'serviceFaq',
      eyebrow: 'FAQ',
      title: '¿Quieres saber más?',
      columns: 2,
      items: (doc.faqs ?? [])
        .filter((item) => item.question)
        .map((item, index) => ({
          _key: item._key || key(`faq-${index}`),
          _type: 'faqItem',
          question: item.question,
          answer: item.answer ?? '',
        })),
    },
    {
      _key: key('cta'),
      _type: 'serviceCta',
      title: `Agenda un diagnóstico de ${nombre}`,
    },
  );

  return sections;
}

async function main() {
  const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  });

  const docs = await client.fetch<ServiceDoc[]>(`*[_type == "service" && !(_id in path("drafts.**"))]{
    _id,
    "slug": slug.current,
    nombre,
    tagline,
    heroTitle,
    heroDescription,
    heroBadge,
    heroImage,
    cards,
    proceso,
    faqs,
    planesEyebrow,
    planesTitle,
    planesDescription,
    planesNote,
    planesNoteLabel,
    planesNoteHref,
    planesCtaLabel,
    planesCtaHref,
    planes,
    sections
  }`);

  for (const doc of docs) {
    if (doc.sections?.length) {
      const pitch = SERVICE_PITCH[doc.slug];
      const next = (doc.sections as Record<string, unknown>[]).map((section) => {
        if (section._type === 'serviceFocus' && !section.title) {
          return {
            ...section,
            eyebrow: 'Cómo se ejecuta',
            title: 'Cuatro frentes del mismo servicio',
            description: 'Elige un frente. A la derecha está lo que hacemos en concreto, no el nombre del paquete.',
          };
        }
        if (section._type === 'servicePitch' && !section.title && pitch) return { ...section, ...pitch };
        if (section._type === 'serviceFaq' && !section.title) {
          return { ...section, eyebrow: section.eyebrow || 'FAQ', title: '¿Quieres saber más?' };
        }
        return section;
      });
      const changed = JSON.stringify(next) !== JSON.stringify(doc.sections);
      console.log(`${doc._id}: ${changed ? 'fill missing section copy' : 'already complete'}`);
      if (!WRITE || !changed) continue;
      await client.patch(doc._id).set({ sections: next }).commit();
      console.log(`  patched ${doc._id}`);
      continue;
    }
    const sections = sectionsFor(doc);
    const types = sections.map((section) => section._type).join(', ');
    console.log(`${doc._id}: ${sections.length} sections (${types})`);
    if (!WRITE) continue;
    await client.patch(doc._id).set({ sections }).commit();
    console.log(`  patched ${doc._id}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
