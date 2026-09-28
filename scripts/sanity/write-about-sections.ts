/**
 * Copy each Nosotros document into sections[].
 *
 *   npx tsx scripts/sanity/write-about-sections.ts
 *   npx tsx scripts/sanity/write-about-sections.ts --write
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';
import { HOME_PILLARS } from '../../src/data/site';

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
  asset?: { _ref?: string };
  alt?: string;
  hotspot?: unknown;
  crop?: unknown;
};

type Column = { _key?: string; _type?: string; title?: string; paragraphs?: string[] };
type Pillar = { _key?: string; _type?: string; title?: string; description?: string; icon?: string; accent?: string; href?: string };
type Filter = { _key?: string; _type?: string; id?: string; label?: string };
type Phase = { _key?: string; _type?: string; index?: string; title?: string; description?: string };

type AboutDoc = {
  _id: string;
  locale?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroBadge?: string;
  heroCtaLabel?: string;
  heroCtaHref?: string;
  heroImage?: ImageField;
  historyEyebrow?: string;
  historyTitle?: string;
  historyDescription?: string;
  historyColumns?: Column[];
  pillarsEyebrow?: string;
  pillarsTitle?: string;
  pillarsDescription?: string;
  pillars?: Pillar[];
  processEyebrow?: string;
  processTitle?: string;
  processDescription?: string;
  teamEyebrow?: string;
  teamTitle?: string;
  teamDescription?: string;
  teamCtaLabel?: string;
  teamCtaHref?: string;
  teamFilters?: Filter[];
  mapEyebrow?: string;
  mapTitle?: string;
  mapDescription?: string;
  closingBadge?: string;
  closingTitle?: string;
  closingDescription?: string;
  closingCtaLabel?: string;
  sections?: { _type?: string }[];
};

const ROOT_FIELDS = [
  'heroTitle',
  'heroDescription',
  'heroBadge',
  'heroCtaLabel',
  'heroCtaHref',
  'heroImage',
  'historyEyebrow',
  'historyTitle',
  'historyDescription',
  'historyColumns',
  'pillarsEyebrow',
  'pillarsTitle',
  'pillars',
  'processEyebrow',
  'processTitle',
  'processDescription',
  'teamEyebrow',
  'teamTitle',
  'teamDescription',
  'teamCtaLabel',
  'teamCtaHref',
  'teamFilters',
  'mapEyebrow',
  'mapTitle',
  'mapDescription',
  'closingBadge',
  'closingTitle',
  'closingDescription',
  'closingCtaLabel',
];

const ES_FILTERS: Filter[] = [
  { _key: 'all', _type: 'object', id: 'all', label: 'Todos' },
  { _key: 'web', _type: 'object', id: 'web', label: 'Web' },
  { _key: 'redes', _type: 'object', id: 'redes', label: 'Redes Sociales' },
  { _key: 'diseno', _type: 'object', id: 'diseno', label: 'Diseño' },
];

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

function spanishPillars(): Pillar[] {
  return HOME_PILLARS.map((pillar, index) => ({
    _key: `pillar-${index}`,
    _type: 'object',
    title: pillar.title,
    description: pillar.description,
    icon: pillar.icon,
    accent: pillar.accent,
    href: pillar.href,
  }));
}

function sectionsFor(doc: AboutDoc, phases: Phase[]) {
  const en = doc.locale === 'en';
  const cities = 'Mérida · Cancún · Monterrey';
  return [
    {
      _type: 'aboutHero',
      _key: 'aboutHero',
      badges: [
        {
          _key: 'badge-name',
          _type: 'object',
          label: doc.heroBadge || (en ? 'About' : 'Nosotros'),
          variant: 'lime',
        },
        { _key: 'badge-cities', _type: 'object', label: cities, variant: 'cyan' },
      ],
      title: doc.heroTitle || (en ? 'Collective expertise, our own technology, cross-border reach.' : 'Expertise colectivo, tecnología propia, capacidad cross-border.'),
      description: doc.heroDescription || '',
      image: imageOf(doc.heroImage),
      imagePosition: 'center 28%',
      ctaLabel: doc.heroCtaLabel || (en ? 'Schedule your audit' : 'Agenda tu auditoría'),
      ctaHref: doc.heroCtaHref || '/contacto',
    },
    {
      _type: 'aboutHistory',
      _key: 'aboutHistory',
      eyebrow: doc.historyEyebrow || (en ? 'History' : 'Historia'),
      title: doc.historyTitle || (en ? 'From a tactics agency to an architecture by industry' : 'De agencia de tácticas a arquitectura por industria'),
      description:
        doc.historyDescription ||
        (en
          ? 'Hiweb started by operating established accounts where a service catalog was not enough.'
          : 'Hiweb nace de operar cuentas consolidadas donde el catálogo de servicios no bastaba. El comprador no busca “SEO”: busca un resultado en su sector. Reorganizamos oferta, prueba y equipo alrededor de eso.'),
      columns: doc.historyColumns ?? [],
    },
    {
      _type: 'aboutPillars',
      _key: 'aboutPillars',
      eyebrow: doc.pillarsEyebrow || (en ? 'Differentiators' : 'Diferenciadores'),
      title: doc.pillarsTitle || (en ? 'Differentiators' : 'Diferenciadores'),
      description: 'Partner interno, idioma de industria, servicios atados a resultado y evidencia verificable.',
      pillars: doc.pillars?.length ? doc.pillars : en ? [] : spanishPillars(),
    },
    {
      _type: 'aboutProcess',
      _key: 'aboutProcess',
      eyebrow: doc.processEyebrow || (en ? 'Our own technology' : 'Tecnología propia'),
      title: doc.processTitle || (en ? 'Our portal is part of the delivery' : 'Nuestro portal es parte del delivery'),
      description:
        doc.processDescription ||
        (en
          ? 'Dashboard, assets, and signal in one place. Fewer orphan PDFs; more operation.'
          : 'Tablero, assets y señal en un solo lugar. Menos PDFs huérfanos; más operación.'),
      phases,
    },
    {
      _type: 'aboutTeam',
      _key: 'aboutTeam',
      eyebrow: doc.teamEyebrow || (en ? 'Team' : 'Equipo'),
      title: doc.teamTitle || (en ? 'A senior core, not a bench of invisible juniors' : 'Un núcleo senior, no una bancada de juniors invisibles'),
      description:
        doc.teamDescription ||
        (en
          ? 'Account direction, strategy, media, content, and web product. The faces that actually show up in the audit.'
          : 'Dirección de cuenta, estrategia, media, contenido y producto web. Las caras que sí aparecen en la auditoría.'),
      ctaLabel: doc.teamCtaLabel || (en ? 'Schedule your audit' : 'Agenda tu auditoría'),
      ctaHref: doc.teamCtaHref || '/contacto',
      filterLabel: en ? 'Filter by category' : 'Filtrar por categoría',
      filters: doc.teamFilters?.length ? doc.teamFilters : ES_FILTERS,
    },
    {
      _type: 'aboutMap',
      _key: 'aboutMap',
      eyebrow: doc.mapEyebrow || (en ? 'Global map' : 'Mapa global'),
      title: doc.mapTitle || (en ? 'Presence with clients in North America' : 'Presencia con clientes en Norteamérica'),
      description:
        doc.mapDescription ||
        (en
          ? 'Bases in Mérida, Cancún, and Monterrey. Clients in Mexico, the United States, and Canada — the audit can be remote.'
          : 'Bases en Mérida, Cancún, Monterrey. Clientes en México, Estados Unidos y Canadá — la auditoría puede ser remota.'),
      sectionLabel: en ? 'Global presence' : 'Presencia global',
      globeLabel: en
        ? 'Interactive globe with Mexico, the United States, and Canada'
        : 'Globo interactivo con México, Estados Unidos y Canadá',
      ctaLabel: 'Agenda tu auditoría',
      ctaHref: '/contacto',
    },
    {
      _type: 'aboutCta',
      _key: 'aboutCta',
      badge: doc.closingBadge || (en ? 'Next step' : 'Siguiente paso'),
      title: doc.closingTitle || (en ? "Let's talk about your industry" : 'Hablemos de tu industria'),
      description:
        doc.closingDescription ||
        (en
          ? 'Tell us the industry, the goal, and the ICP. We send back a clear diagnosis and the next step.'
          : 'Cuéntanos industria, objetivo e ICP. Te devolvemos un diagnóstico claro y el siguiente paso.'),
      ctaLabel: doc.closingCtaLabel || (en ? 'Schedule your audit' : 'Agenda tu auditoría'),
      ctaHref: '/contacto',
    },
  ];
}

const docs = await client.fetch<AboutDoc[]>(
  `*[_type == "aboutPage"]{
    _id, locale, heroTitle, heroDescription, heroBadge, heroCtaLabel, heroCtaHref, heroImage,
    historyEyebrow, historyTitle, historyDescription, historyColumns,
    pillarsEyebrow, pillarsTitle, pillars,
    processEyebrow, processTitle, processDescription,
    teamEyebrow, teamTitle, teamDescription, teamCtaLabel, teamCtaHref, teamFilters,
    mapEyebrow, mapTitle, mapDescription,
    closingBadge, closingTitle, closingDescription, closingCtaLabel,
    sections
  }`,
);

const phases = await client.fetch<{ es: Phase[]; en: Phase[] }>(
  `{
    "es": *[_id == "homePage"][0].sections[_type == "homeProcess"][0].items,
    "en": *[_id == "homePage-en"][0].sections[_type == "homeProcess"][0].items
  }`,
);

let updated = 0;
for (const doc of docs) {
  const already = (doc.sections ?? []).some((section) => section._type === 'aboutHero');
  const homePhases = doc.locale === 'en' ? phases.en ?? [] : phases.es ?? [];
  console.log(`${WRITE ? 'write' : 'dry'} ${doc._id} · phases ${homePhases.length}${already ? ' · skip' : ''}`);
  if (!WRITE || already) continue;
  await client.patch(doc._id).set({ sections: sectionsFor(doc, homePhases) }).unset(ROOT_FIELDS).commit();
  updated += 1;
}

console.log(WRITE ? `Updated ${updated} about pages.` : `Dry run. ${docs.length} documents. Pass --write to apply.`);
