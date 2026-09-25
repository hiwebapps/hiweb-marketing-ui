/**
 * English industry documents. Copy is a translation of the Spanish pages.
 *   npx tsx scripts/sanity/seed-industries-en.ts
 *   npx tsx scripts/sanity/seed-industries-en.ts --write
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';

const WRITE = process.argv.includes('--write');

function cliToken() {
  const file = path.join(os.homedir(), '.config', 'sanity', 'config.json');
  const config = JSON.parse(fs.readFileSync(file, 'utf8')) as { authToken?: string };
  return config.authToken ?? '';
}

const token = process.env.SANITY_API_WRITE_TOKEN || cliToken();
if (!token) throw new Error('No Sanity token');

const client = createClient({
  projectId: 'fxardjr1',
  dataset: 'web-2026',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

type Block = { title: string; description: string };
type Faq = { question: string; answer: string };
type Copy = {
  nombre: string;
  lower: string;
  tagline: string;
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  metaTitle: string;
  metaDescription: string;
  retos: string[];
  porQue: Block[];
  faqs: Faq[];
  blurbs: Record<string, string>;
};

function chrome(name: string, lower: string) {
  return {
    heroCtaLabel: 'See success stories',
    whyEyebrow: 'Why Hiweb',
    whyTitle: `Why Hiweb in ${lower}`,
    servicesTitle: `Nine services, read as ${name}`,
    servicesDescription: 'Pick the lever. The diagnosis sets the order.',
    servicesCtaLabel: 'See more',
    servicesTag: 'Service',
    casesEyebrow: 'Cases',
    casesTitle: `Cases in ${lower}`,
    casesDescription: 'Results from established companies in this sector.',
    casesEmpty: 'We are documenting more cases in this sector. The diagnosis is still open.',
    faqTitle: `${name} questions`,
    closingTitle: `Schedule a diagnosis for ${lower}`,
  };
}

const COPY: Record<string, Copy> = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'scripts/sanity/industry-en-copy.json'), 'utf8'),
);

const indexDoc = {
  _id: 'industriesIndex-en',
  _type: 'industriesIndex',
  eyebrow: 'Industries',
  title: 'From a service list to an architecture by industry',
  description: 'Cases, challenges, and levers specific to your sector. The catalog exists; the playbook changes.',
  whyEyebrow: 'Why Hiweb',
  whyTitle: 'A partner that has already worked at your decision-making table',
  closingTitle: 'Schedule a diagnosis by industry',
  cardCtaLabel: 'See the sector',
  metaTitle: 'Industries — Hiweb Marketing',
  metaDescription: 'We speak your sector’s language: manufacturing, healthcare, real estate, tourism, restaurants, and SaaS.',
  pillars: [
    {
      _key: 'pillar-0',
      _type: 'titledBlock',
      title: 'Partner, not a vendor',
      description:
        'The efficiency of an in-house team with the reach of an enterprise agency. One point of contact, cross-border execution.',
    },
    {
      _key: 'pillar-1',
      _type: 'titledBlock',
      title: 'Your industry’s language',
      description:
        'Cases, challenges, and metrics specific to your sector. We don’t translate a generic playbook: we speak the way your business operates.',
    },
    {
      _key: 'pillar-2',
      _type: 'titledBlock',
      title: 'Service tied to an outcome',
      description: 'Each lever — paid, SEO, web, CRM — connects to a business outcome, not an isolated tactic.',
    },
    {
      _key: 'pillar-3',
      _type: 'titledBlock',
      title: 'Verifiable evidence',
      description: 'We work with established companies. Our own results, public figures, and technology we can show.',
    },
  ],
};

type Doc = {
  _id: string;
  _rev?: string;
  slug?: { current?: string };
  serviceBlurbs?: { service?: { _ref?: string }; description?: string; _key?: string; _type?: string }[];
  locale?: string;
};

const serviceRows = await client.fetch<{ _id: string; slug: string }[]>(
  `*[_type == "service" && coalesce(locale, "es") == "es"]{ _id, "slug": slug.current }`,
);
const slugById = new Map(serviceRows.map((row) => [row._id, row.slug]));
const docs = await client.fetch<Doc[]>(`*[_type == "industry" && coalesce(locale, "es") == "es"]`);

for (const doc of docs) {
  const slug = doc.slug?.current ?? '';
  const copy = COPY[slug];
  if (!copy) {
    console.log('skip', slug);
    continue;
  }
  const blurbs = (doc.serviceBlurbs ?? []).map((item) => {
    const ref = item.service?._ref ?? '';
    const serviceSlug = slugById.get(ref);
    return serviceSlug && copy.blurbs[serviceSlug] ? { ...item, description: copy.blurbs[serviceSlug] } : item;
  });
  const next = {
    ...doc,
    _id: `${doc._id.replace(/^drafts\./, '')}-en`,
    _type: 'industry',
    locale: 'en',
    nombre: copy.nombre,
    tagline: copy.tagline,
    heroBadge: copy.heroBadge,
    heroTitle: copy.heroTitle,
    heroDescription: copy.heroDescription,
    metaTitle: copy.metaTitle,
    metaDescription: copy.metaDescription,
    retos: copy.retos,
    porQue: copy.porQue.map((item, index) => ({ _key: `why-${index}`, _type: 'titledBlock', ...item })),
    faqs: copy.faqs.map((item, index) => ({ _key: `faq-${index}`, _type: 'faqItem', ...item })),
    serviceBlurbs: blurbs,
    ...chrome(copy.nombre, copy.lower),
  };
  delete next._rev;
  console.log(slug, '→', copy.nombre);
  if (WRITE) {
    await client.createOrReplace(next);
    if (!doc.locale) await client.patch(doc._id).set({ locale: 'es' }).commit();
  }
}

console.log('index');
if (WRITE) await client.createOrReplace(indexDoc);
if (!WRITE) console.log('Dry run. Pass --write to publish.');
