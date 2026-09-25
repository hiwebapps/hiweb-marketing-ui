/**
 * Clone each Spanish service into an English document (same slug, locale "en").
 * Only strings published on hiwebmarketing.com/en are replaced.
 *
 *   npx tsx scripts/sanity/seed-services-en.ts
 *   npx tsx scripts/sanity/seed-services-en.ts --write
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';

const WRITE = process.argv.includes('--write');
const PROJECT_ID = 'fxardjr1';
const DATASET = 'web-2026';

const COPY: Record<string, { nombre: string; tagline: string; source: string }> = {
  seo: {
    nombre: 'SEO/AEO (Local and National)',
    tagline: 'We capture the demand of those who are already looking for what you offer.',
    source: 'https://www.hiwebmarketing.com/en/servicios/seo',
  },
  'google-ads': {
    nombre: 'Google Ads',
    tagline: 'It captures active demand with immediate purchase intent.',
    source: 'https://www.hiwebmarketing.com/en/servicios/google-ads-management-services',
  },
  'meta-ads': {
    nombre: 'Meta Ads',
    tagline: 'Build demand and trust with advanced segmentation.',
    source: 'https://www.hiwebmarketing.com/en/servicios/meta-ads',
  },
  'redes-sociales': {
    nombre: 'Social Networks',
    tagline: 'Strategic content that generates trust and sales.',
    source: 'https://www.hiwebmarketing.com/en/servicios/social-media',
  },
  'desarrollo-web': {
    nombre: 'Web Design and Development',
    tagline: 'Fast, clear, and built sites to convert.',
    source: 'https://www.hiwebmarketing.com/en/servicios/web-development',
  },
  'crm-automatizacion': {
    nombre: 'CRM & Automation',
    tagline: 'Order your monitoring and improve conversion with processes.',
    source: 'https://www.hiwebmarketing.com/en/servicios/crm-automatizacion-empresas',
  },
  branding: {
    nombre: 'Brand Identity & Branding',
    tagline: 'We build clear, strong and memorable brands.',
    source: 'https://www.hiwebmarketing.com/en/servicios/branding',
  },
  'ia-marketing': {
    nombre: 'AI Marketing',
    tagline: 'Intelligent automation that accelerates your results.',
    source: 'https://www.hiwebmarketing.com/en/servicios/ai-tools-for-marketing',
  },
  'community-manager': {
    nombre: 'Community Manager',
    tagline: 'Strategic management that strengthens your brand.',
    source: 'https://www.hiwebmarketing.com/en/servicios/community-manager',
  },
};

function cliToken() {
  const file = path.join(os.homedir(), '.config', 'sanity', 'config.json');
  if (!fs.existsSync(file)) return '';
  const config = JSON.parse(fs.readFileSync(file, 'utf8')) as { authToken?: string };
  return config.authToken ?? '';
}

function decode(value: string) {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;|&apos;/gi, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function field(html: string, pattern: RegExp) {
  const match = html.match(pattern);
  return match ? decode(match[1]) : '';
}

async function pageCopy(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} ${response.status}`);
  const html = await response.text();
  const title = field(html, /<title>([^<]+)<\/title>/i).replace(/\s*\|\s*Hiweb Marketing\s*$/i, '').trim();
  const description = field(html, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i)
    || field(html, /<meta[^>]+content="([^"]*)"[^>]+name="description"/i);
  const h1 = field(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const borrowed = /Agencia de Marketing Digital en México/i.test(`${h1} ${description} ${title}`);
  const generic = /digital marketing agency in mexico/i.test(description) && description.length < 180;
  return {
    metaTitle: borrowed ? '' : title,
    metaDescription: borrowed || generic ? '' : description,
    h1: borrowed ? '' : h1,
  };
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

type ServiceDoc = {
  _id: string;
  _rev?: string;
  slug?: { current?: string };
  sections?: Array<Record<string, unknown> & { _type?: string }>;
  locale?: string;
};

const docs = await client.fetch<ServiceDoc[]>(
  `*[_type == "service" && coalesce(locale, "es") == "es"]{ ... }`,
);

for (const doc of docs) {
  const slug = doc.slug?.current ?? '';
  const copy = COPY[slug];
  if (!copy) {
    console.log('skip', slug);
    continue;
  }
  const live = await pageCopy(copy.source);
  const sections = (doc.sections ?? []).map((section) => {
    if (section._type !== 'serviceHero') return section;
    return {
      ...section,
      ...(live.h1 ? { title: live.h1 } : {}),
      ...(live.metaDescription ? { description: live.metaDescription } : {}),
    };
  });
  const next = {
    ...doc,
    _id: `${doc._id.replace(/^drafts\./, '')}-en`,
    _type: 'service',
    locale: 'en',
    nombre: copy.nombre,
    tagline: copy.tagline,
    sections,
    ...(live.metaTitle ? { metaTitle: live.metaTitle } : {}),
    ...(live.metaDescription ? { metaDescription: live.metaDescription } : {}),
  };
  delete next._rev;
  console.log('\n', slug);
  console.log('  nombre:', copy.nombre);
  console.log('  h1:', live.h1 || '(unchanged)');
  console.log('  meta:', live.metaDescription || '(unchanged)');
  if (WRITE) {
    await client.createOrReplace(next);
    if (!doc.locale) await client.patch(doc._id).set({ locale: 'es' }).commit();
    console.log('  wrote', next._id);
  }
}

if (!WRITE) console.log('\nDry run. Pass --write to publish.');
