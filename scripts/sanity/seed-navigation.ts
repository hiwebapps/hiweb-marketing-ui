/**
 * Navbar documents for Spanish and English, matching the menu that
 * was previously hardcoded in SiteNav.
 *
 *   npx tsx scripts/sanity/seed-navigation.ts
 *   npx tsx scripts/sanity/seed-navigation.ts --write
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';
import { NAV_EXPLORE, NAV_SERVICE_GROUPS } from '../../src/data/site';
import { CHROME, EN_NAV_SERVICES, localePath, type Locale } from '../../src/lib/locale';

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

const INDUSTRY_ICONS: Record<string, string> = {
  manufactura: 'factory',
  salud: 'heart',
  inmobiliarias: 'building',
  'turismo-hoteleria': 'plane',
  restaurantes: 'utensils',
  saas: 'app',
};

let keyIndex = 0;
function key() {
  keyIndex += 1;
  return `nav${keyIndex}`;
}

function navLink(title: string, description: string, href: string, icon: string) {
  return { _type: 'navLink', _key: key(), title, description, href, icon };
}

async function industryLinks(locale: Locale) {
  const rows = await client.fetch<
    { nombre: string; tagline?: string; slug: string }[]
  >(
    `*[_type == "industry" && coalesce(locale, "es") == $locale && defined(slug.current)] | order(orden asc) {
      nombre,
      tagline,
      "slug": slug.current
    }`,
    { locale },
  );
  const prefix = locale === 'en' ? '/en' : '';
  return rows.map((row) =>
    navLink(row.nombre, row.tagline ?? '', `${prefix}/industrias/${row.slug}`, INDUSTRY_ICONS[row.slug] ?? 'grid'),
  );
}

function serviceGroups(locale: Locale) {
  const prefix = locale === 'en' ? '/en' : '';
  return NAV_SERVICE_GROUPS.map((group) => ({
    _type: 'navGroup',
    _key: key(),
    heading: group.heading,
    links: group.items.map((item) => {
      const translated = locale === 'en' ? EN_NAV_SERVICES[item.slug] : undefined;
      return navLink(
        translated?.nombre ?? item.nombre,
        translated?.desc ?? item.desc,
        `${prefix}/servicios/${item.slug}`,
        item.icon,
      );
    }),
  }));
}

async function documentFor(locale: Locale) {
  const copy = CHROME[locale];
  const id = locale === 'en' ? 'navigation-en' : 'navigation';
  return {
    _id: id,
    _type: 'navigation',
    locale,
    bar: [
      { _type: 'navBarItem', _key: key(), label: copy.about, kind: 'link', href: localePath('/nosotros', locale) },
      { _type: 'navBarItem', _key: key(), label: copy.industries, kind: 'industries' },
      { _type: 'navBarItem', _key: key(), label: copy.services, kind: 'services' },
      { _type: 'navBarItem', _key: key(), label: copy.cases, kind: 'link', href: localePath('/portafolio', locale) },
      { _type: 'navBarItem', _key: key(), label: copy.blog, kind: 'link', href: localePath('/blog', locale) },
    ],
    industryLinks: await industryLinks(locale),
    serviceGroups: serviceGroups(locale),
    exploreHeading: 'Explorar',
    exploreLinks: NAV_EXPLORE.map((item) => navLink(item.nombre, item.desc, item.href, item.icon)),
    ctaLabel: copy.audit,
    ctaHref: localePath('/contacto', locale),
    allIndustriesLabel: copy.allIndustries,
    industriesIndexHref: localePath('/industrias', locale),
    allServicesLabel: locale === 'en' ? 'Services' : 'Todos los servicios',
    servicesIndexHref: localePath('/servicios', locale),
  };
}

const LOOSE_FIELDS = [
  'industryLinks',
  'serviceGroups',
  'exploreHeading',
  'exploreLinks',
  'allIndustriesLabel',
  'industriesIndexHref',
  'allServicesLabel',
  'servicesIndexHref',
];

function pairColumns(links: unknown[], heading: string) {
  const columns = [];
  for (let index = 0; index < links.length; index += 2) {
    columns.push({
      _type: 'navGroup',
      _key: `col-${columns.length}`,
      heading: columns.length === 0 ? heading : '',
      links: links.slice(index, index + 2),
    });
  }
  return columns;
}

function nestBar(doc: Record<string, unknown>) {
  const bar = Array.isArray(doc.bar) ? (doc.bar as Record<string, unknown>[]) : [];
  return bar.map((item) => {
    if (item.kind === 'link') return item;
    if (item.kind === 'dropdown' && Array.isArray(item.columns) && item.columns.length) return item;

    let columns: unknown[] = [];
    let indexLabel = item.indexLabel;
    let indexHref = item.indexHref;
    if (item.kind === 'industries' || (Array.isArray(item.links) && item.links.length && item.kind !== 'services')) {
      const links = Array.isArray(item.links) && item.links.length ? item.links : ((doc.industryLinks as unknown[]) ?? []);
      columns = pairColumns(links, String(item.label ?? ''));
      indexLabel = indexLabel || doc.allIndustriesLabel;
      indexHref = indexHref || doc.industriesIndexHref;
    } else {
      const groups = Array.isArray(item.groups) && item.groups.length ? item.groups : ((doc.serviceGroups as unknown[]) ?? []);
      const explore = Array.isArray(item.exploreLinks) && item.exploreLinks.length ? item.exploreLinks : ((doc.exploreLinks as unknown[]) ?? []);
      columns = [...groups];
      if (explore.length) {
        columns.push({
          _type: 'navGroup',
          _key: 'col-explore',
          heading: item.exploreHeading || doc.exploreHeading || 'Explorar',
          links: explore,
        });
      }
      indexLabel = indexLabel || doc.allServicesLabel;
      indexHref = indexHref || doc.servicesIndexHref;
    }

    return {
      _key: item._key,
      _type: 'navBarItem',
      label: item.label,
      kind: 'dropdown',
      columns,
      indexLabel,
      indexHref,
    };
  });
}

async function nestDocument(id: string) {
  const doc = await client.getDocument(id);
  if (!doc) throw new Error(`Missing ${id}`);
  const bar = nestBar(doc);
  const summary = bar.map((item) => ({
    label: item.label,
    kind: item.kind,
    columns: Array.isArray(item.columns) ? item.columns.length : 0,
  }));
  console.log(id, JSON.stringify(summary));
  if (!WRITE) return;
  await client.patch(id).set({ bar }).unset(LOOSE_FIELDS).commit();
  const draft = await client.getDocument(`drafts.${id}`);
  if (draft) {
    await client.patch(`drafts.${id}`).set({ bar: nestBar(draft) }).unset(LOOSE_FIELDS).commit();
  }
}

await nestDocument('navigation');
await nestDocument('navigation-en');

if (!WRITE) {
  console.log('Dry run. Pass --write to turn menus into dropdowns with columns.');
  process.exit(0);
}

console.log('Menus are now dropdowns with columns.');
