/**
 * Patch homePage + service taglines in web-2026 from the Webflow homepage copy.
 *
 *   npx tsx scripts/sanity/write-webflow-home.ts
 *   npx tsx scripts/sanity/write-webflow-home.ts --write
 */
import fs from 'node:fs';
import path from 'node:path';
import { createClient, type SanityClient } from '@sanity/client';
import {
  WEBFLOW_HOME,
  WEBFLOW_OG_IMAGE_URL,
  WEBFLOW_SERVICE_TAGLINES,
} from '../../src/data/webflow-home';

const ROOT = process.cwd();
const WRITE = process.argv.includes('--write');
const PROJECT_ID = 'fxardjr1';
const DATASET = 'web-2026';

type Json = Record<string, unknown>;

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
    .replace(/^-|-$/g, '');
}

function intro(value: NonNullable<typeof WEBFLOW_HOME.pillarIntro>, type = 'sectionIntro') {
  return {
    _type: type,
    eyebrow: value.eyebrow,
    title: value.title,
    titleMuted: value.titleMuted,
    description: value.description,
  };
}

async function uploadOgImage(client: SanityClient) {
  try {
    const res = await fetch(WEBFLOW_OG_IMAGE_URL);
    if (res.ok) {
      const buffer = Buffer.from(await res.arrayBuffer());
      const asset = await client.assets.upload('image', buffer, {
        filename: 'hiweb-team-og.avif',
        contentType: res.headers.get('content-type') ?? 'image/avif',
      });
      return {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
        alt: 'Equipo Hiweb',
      };
    }
  } catch (error) {
    console.warn('Webflow OG download failed, using local team photo.', error);
  }

  const local = path.join(ROOT, 'public/images/team/hiweb-team.png');
  if (!fs.existsSync(local)) return undefined;
  const asset = await client.assets.upload('image', fs.createReadStream(local), {
    filename: 'hiweb-team.png',
  });
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
    alt: 'Equipo Hiweb',
  };
}

function homeDocument(ogImage?: Json) {
  const home = WEBFLOW_HOME;
  return {
    heroTitle: home.heroTitle,
    heroLead: home.heroLead,
    primaryCta: { _type: 'cta', ...home.primaryCta },
    secondaryCta: { _type: 'cta', ...home.secondaryCta },
    pillarIntro: intro(home.pillarIntro!),
    pillars: home.pillars!.map((item) => ({
      _type: 'titledBlock',
      _key: key('pillar', item.title),
      ...item,
    })),
    serviceIntro: intro(home.serviceIntro!),
    storiesIntro: intro(home.storiesIntro!),
    testimonials: home.testimonials!.map((item) => ({
      _type: 'homeTestimonial',
      _key: key('quote', item.client),
      ...item,
    })),
    processIntro: intro(home.processIntro!),
    process: home.process!.map((item) => ({
      _type: 'processStep',
      _key: key('step', item.index),
      ...item,
    })),
    metricsIntro: intro(home.metricsIntro!),
    metrics: home.metrics!.map((item) => ({
      _type: 'metric',
      _key: key('metric', item.label),
      ...item,
    })),
    faqIntro: intro(home.faqIntro!),
    faqCategories: home.faqCategories!.map((category) => ({
      _type: 'faqCategory',
      _key: key('faq', category.id),
      id: category.id,
      label: category.label,
      items: category.items.map((item) => ({
        _type: 'faqItem',
        _key: key('q', item.question),
        ...item,
      })),
    })),
    industryIntro: {
      _type: 'sectionIntro',
      eyebrow: 'Industrias',
      title: 'Hablamos el idioma de tu sector',
      description: 'Casos, retos y métricas propias de tu industria — no un playbook genérico.',
    },
    metaTitle: home.seo?.metaTitle,
    metaDescription: home.seo?.metaDescription,
    ...(ogImage ? { ogImage } : {}),
  };
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

  const services = await client.fetch<Array<{ _id: string; slug: string }>>(
    `*[_type == "service" && defined(slug.current)]{ _id, "slug": slug.current }`,
  );

  console.log(`Dataset ${DATASET}. Write=${WRITE}. Services found: ${services.length}`);
  console.log(`homePage fields: hero, pillars, services intro, testimonials, process, metrics, FAQ, SEO`);
  for (const [slug, tagline] of Object.entries(WEBFLOW_SERVICE_TAGLINES)) {
    const doc = services.find((item) => item.slug === slug || item._id === `service-${slug}`);
    console.log(`  ${doc ? doc._id : `MISSING ${slug}`}: ${tagline}`);
  }

  if (!WRITE) {
    console.log('Dry-run only. Re-run with --write to publish.');
    return;
  }

  const ogImage = await uploadOgImage(client);
  const payload = homeDocument(ogImage);

  await client.createIfNotExists({ _id: 'homePage', _type: 'homePage' });
  await client
    .patch('homePage')
    .set(payload)
    .commit({ autoGenerateArrayKeys: true });
  console.log('Patched homePage');

  for (const [slug, tagline] of Object.entries(WEBFLOW_SERVICE_TAGLINES)) {
    const doc = services.find((item) => item.slug === slug || item._id === `service-${slug}`);
    if (!doc) {
      console.warn(`Skip tagline, service not found: ${slug}`);
      continue;
    }
    await client.patch(doc._id).set({ tagline }).commit();
    console.log(`Patched ${doc._id} tagline`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
