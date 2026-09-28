/**
 * Copy each industry page's fields into sections[].
 *
 *   npx tsx scripts/sanity/write-industry-sections.ts
 *   npx tsx scripts/sanity/write-industry-sections.ts --write
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

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

type ImageField = {
  asset?: { _ref?: string; _type?: string };
  alt?: string;
  hotspot?: unknown;
  crop?: unknown;
};

type IndustryDoc = {
  _id: string;
  nombre?: string;
  locale?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: ImageField;
  heroCtaLabel?: string;
  retos?: string[];
  porQue?: { _key?: string; _type?: string; title?: string; description?: string }[];
  whyEyebrow?: string;
  whyTitle?: string;
  servicesTitle?: string;
  servicesDescription?: string;
  servicesCtaLabel?: string;
  servicesTag?: string;
  serviceBlurbs?: { _key?: string; _type?: string; service?: unknown; description?: string }[];
  casesEyebrow?: string;
  casesTitle?: string;
  casesDescription?: string;
  casesEmpty?: string;
  faqTitle?: string;
  faqs?: { _key?: string; _type?: string; question?: string; answer?: string }[];
  closingTitle?: string;
  sections?: { _type?: string }[];
};

const ROOT_FIELDS = [
  'heroTitle',
  'heroDescription',
  'heroImage',
  'heroBadge',
  'heroCtaLabel',
  'retos',
  'porQue',
  'whyEyebrow',
  'whyTitle',
  'servicesTitle',
  'servicesDescription',
  'servicesCtaLabel',
  'servicesTag',
  'casesEyebrow',
  'casesTitle',
  'casesDescription',
  'casesEmpty',
  'faqTitle',
  'faqs',
  'closingTitle',
  'serviceBlurbs',
];

function labels(doc: IndustryDoc) {
  const en = doc.locale === 'en';
  const nombre = doc.nombre || '';
  const lower = nombre.toLowerCase();
  return {
    badge: nombre,
    ctaLabel: doc.heroCtaLabel || (en ? 'See success stories' : 'Ver casos de éxito'),
    whyEyebrow: doc.whyEyebrow || (en ? 'Why Hiweb' : 'Por qué Hiweb'),
    whyTitle: doc.whyTitle || (en ? `Why Hiweb in ${lower}` : `Por qué Hiweb en ${lower}`),
    servicesTitle: doc.servicesTitle || (en ? `Nine services, read as ${nombre}` : `Nueve servicios, leídos como ${nombre}`),
    servicesDescription:
      doc.servicesDescription ||
      (en ? 'Pick the lever. The diagnosis sets the order.' : 'Elige la palanca. El diagnóstico define el orden.'),
    servicesCta: doc.servicesCtaLabel || (en ? 'See more' : 'Ver más'),
    servicesTag: doc.servicesTag || (en ? 'Service' : 'Servicio'),
    casesEyebrow: doc.casesEyebrow || (en ? 'Cases' : 'Casos'),
    casesTitle: doc.casesTitle || (en ? `Cases in ${lower}` : `Casos en ${lower}`),
    casesDescription:
      doc.casesDescription ||
      (en
        ? 'Results from established companies in this sector.'
        : 'Resultados de empresas consolidadas en este sector.'),
    casesEmpty:
      doc.casesEmpty ||
      (en
        ? 'We are documenting more cases in this sector. The diagnosis is still open.'
        : 'Estamos documentando más casos de este sector. El diagnóstico sigue abierto.'),
    faqTitle: doc.faqTitle || (en ? `${nombre} questions` : `Preguntas de ${lower}`),
    closingTitle: doc.closingTitle || (en ? `Schedule a diagnosis for ${lower}` : `Agenda un diagnóstico para ${lower}`),
  };
}

function imageOf(image?: ImageField) {
  const ref = image?.asset?._ref;
  if (!ref) return undefined;
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: ref },
    alt: image?.alt,
    hotspot: image?.hotspot,
    crop: image?.crop,
  };
}

function sectionsFor(doc: IndustryDoc) {
  const text = labels(doc);
  return [
    {
      _type: 'industryHero',
      _key: 'industryHero',
      badge: text.badge,
      title: doc.heroTitle || doc.nombre,
      description: doc.heroDescription || '',
      image: imageOf(doc.heroImage),
      ctaLabel: text.ctaLabel,
      ctaHref: '#casos',
    },
    {
      _type: 'industryWhy',
      _key: 'industryWhy',
      eyebrow: text.whyEyebrow,
      title: text.whyTitle,
      pillars: doc.porQue ?? [],
      retos: doc.retos ?? [],
    },
    {
      _type: 'industryServices',
      _key: 'industryServices',
      eyebrow: 'Servicios',
      title: text.servicesTitle,
      description: text.servicesDescription,
      catalogLabel: 'Ver todos los servicios',
      catalogHref: '/servicios',
      ctaLabel: text.servicesCta,
      tagLabel: text.servicesTag,
      blurbs: doc.serviceBlurbs ?? [],
    },
    {
      _type: 'industryCases',
      _key: 'industryCases',
      eyebrow: text.casesEyebrow,
      title: text.casesTitle,
      description: text.casesDescription,
      emptyText: text.casesEmpty,
    },
    {
      _type: 'industryFaq',
      _key: 'industryFaq',
      eyebrow: 'FAQ',
      title: text.faqTitle,
      items: doc.faqs ?? [],
    },
    {
      _type: 'industryCta',
      _key: 'industryCta',
      title: text.closingTitle,
    },
  ];
}

const docs = await client.fetch<IndustryDoc[]>(
  `*[_type == "industry"]{
    _id, nombre, locale, heroTitle, heroDescription, heroImage, heroCtaLabel,
    retos, porQue, whyEyebrow, whyTitle,
    servicesTitle, servicesDescription, servicesCtaLabel, servicesTag, serviceBlurbs,
    casesEyebrow, casesTitle, casesDescription, casesEmpty,
    faqTitle, faqs, closingTitle, sections
  }`,
);

let updated = 0;
for (const doc of docs) {
  const already = (doc.sections ?? []).some((section) => section._type === 'industryHero');
  console.log(`${WRITE ? 'write' : 'dry'} ${doc._id}${already ? ' · skip' : ''}`);
  if (!WRITE || already) continue;
  await client.patch(doc._id).set({ sections: sectionsFor(doc) }).unset(ROOT_FIELDS).commit();
  updated += 1;
}

console.log(WRITE ? `Updated ${updated} industries.` : `Dry run. ${docs.length} documents. Pass --write to apply.`);
