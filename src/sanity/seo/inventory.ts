import {
  isEnglish,
  pagePath,
  publishedDescription,
  publishedId,
  publishedTitle,
  SHORT_DESCRIPTION,
  type PageMetaDoc,
} from '../../lib/page-meta';

export const SEO_TYPES = [
  'homePage',
  'aboutPage',
  'service',
  'industry',
  'caseStudy',
  'contactPage',
  'landingPage',
  'post',
  'industriesIndex',
  'servicesIndex',
  'blogIndex',
  'casesIndex',
  'legalPage',
] as const;

export const TYPE_LABELS: Record<string, string> = {
  homePage: 'Home',
  aboutPage: 'Nosotros',
  service: 'Servicio',
  industry: 'Industria',
  caseStudy: 'Caso',
  contactPage: 'Contacto',
  landingPage: 'Landing',
  post: 'Blog',
  industriesIndex: 'Índice de industrias',
  servicesIndex: 'Índice de servicios',
  blogIndex: 'Índice del blog',
  casesIndex: 'Índice de casos',
  legalPage: 'Página legal',
};

export const PAIRED_TYPES = new Set([
  'homePage',
  'aboutPage',
  'service',
  'industry',
  'post',
  'industriesIndex',
  'servicesIndex',
  'blogIndex',
]);

export const SINGLE_LOCALE_TYPES = new Set(['contactPage', 'landingPage', 'legalPage']);

export type SeoStatus = 'published' | 'changed' | 'draft';

export type SeoSource = PageMetaDoc & {
  _id: string;
  _type: string;
  hasOg?: boolean;
  ogAlt?: string;
  noindex?: boolean;
  esSlug?: string;
  servicioSlug?: string;
  industriaSlug?: string;
  hrefs?: unknown;
};

export type SeoEntry = {
  id: string;
  type: string;
  locale: 'es' | 'en';
  path: string;
  label: string;
  title: string;
  customTitle: boolean;
  description: string;
  customDescription: boolean;
  hasOg: boolean;
  hasOgAlt: boolean;
  status: SeoStatus;
  paired: boolean;
  pairId?: string;
  esId?: string;
  enId?: string;
  esSlug?: string;
  missingServiceLink: boolean;
  missingIndustryLink: boolean;
};

export const SEO_QUERY = `*[_type in ["homePage","aboutPage","service","industry","caseStudy","contactPage","landingPage","post","industriesIndex","servicesIndex","blogIndex","casesIndex","legalPage"]]{
  _id,
  _type,
  title,
  nombre,
  titulo,
  cliente,
  "slug": slug.current,
  "locale": coalesce(locale, "es"),
  esSlug,
  metaTitle,
  metaDescription,
  description,
  tagline,
  resumen,
  heroDescription,
  "hasOg": defined(ogImage.asset),
  "ogAlt": ogImage.alt,
  noindex,
  "servicioSlug": categoriaServicio->slug.current,
  "industriaSlug": categoriaIndustria->slug.current,
  "hrefs": body[_type == "block"].markDefs[_type == "link"].href
}`;

function flattenHrefs(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const hrefs: string[] = [];
  for (const item of value) {
    if (typeof item === 'string') hrefs.push(item);
    else if (Array.isArray(item)) hrefs.push(...flattenHrefs(item));
  }
  return hrefs;
}

export function normalizeHref(href: string) {
  const trimmed = href.trim();
  if (!trimmed) return '';
  try {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const url = new URL(trimmed);
      const host = url.hostname.replace(/^www\./, '');
      if (host !== 'hiwebmarketing.com' && !host.endsWith('.workers.dev')) return trimmed;
      const path = url.pathname.replace(/\/$/, '');
      return path || '/';
    }
  } catch {
    return trimmed;
  }
  const path = trimmed.split(/[?#]/)[0].replace(/\/$/, '');
  return path || '/';
}

function linksTo(hrefs: string[], path: string) {
  const target = path.replace(/\/$/, '') || '/';
  return hrefs.some((href) => normalizeHref(href) === target);
}

function pairKey(row: SeoSource) {
  const id = publishedId(row._id);
  if (row._type === 'homePage' || row._type === 'aboutPage') return row._type;
  if (row._type === 'industriesIndex' || row._type === 'servicesIndex' || row._type === 'blogIndex') {
    return `${row._type}:${id.endsWith('-en') ? id.slice(0, -3) : id}`;
  }
  if (row._type === 'service' || row._type === 'industry' || row._type === 'caseStudy') {
    return id.endsWith('-en') ? id.slice(0, -3) : id;
  }
  if (row._type === 'casesIndex') return `casesIndex:${id.endsWith('-en') ? id.slice(0, -3) : id}`;
  if (row._type === 'post') {
    if (isEnglish(id, row.locale)) {
      if (row.esSlug) return `post:${row.esSlug}`;
      return id.endsWith('-en') ? `postid:${id.slice(0, -3)}` : '';
    }
    return row.slug ? `post:${slugString(row.slug)}` : '';
  }
  return '';
}

function slugString(slug: PageMetaDoc['slug']) {
  return typeof slug === 'string' ? slug : '';
}

function mergeRows(rows: SeoSource[]) {
  const byId = new Map<string, { draft?: SeoSource; published?: SeoSource }>();
  for (const row of rows) {
    const id = publishedId(row._id);
    const entry = byId.get(id) ?? {};
    if (row._id.startsWith('drafts.')) entry.draft = row;
    else entry.published = row;
    byId.set(id, entry);
  }
  return [...byId.entries()].map(([id, versions]) => {
    const current = versions.draft ?? versions.published!;
    const status: SeoStatus = versions.draft ? (versions.published ? 'changed' : 'draft') : 'published';
    return { id, current, status };
  });
}

export function buildSeoEntries(rows: SeoSource[]): SeoEntry[] {
  const merged = mergeRows(rows);
  const groups = new Map<string, string[]>();
  for (const item of merged) {
    const key = pairKey(item.current);
    if (!key) continue;
    const list = groups.get(key) ?? [];
    list.push(item.id);
    groups.set(key, list);
  }

  return merged
    .map(({ id, current, status }) => {
      const locale: 'es' | 'en' = isEnglish(id, current.locale) ? 'en' : 'es';
      const doc: PageMetaDoc = { ...current, _id: id };
      const path = pagePath(current._type, id, doc);
      const hrefs = flattenHrefs(current.hrefs).map(normalizeHref);
      const servicePath = current.servicioSlug
        ? locale === 'en'
          ? `/en/servicios/${current.servicioSlug}`
          : `/servicios/${current.servicioSlug}`
        : '';
      const industryPath = current.industriaSlug
        ? locale === 'en'
          ? `/en/industrias/${current.industriaSlug}`
          : `/industrias/${current.industriaSlug}`
        : '';
      const key = pairKey(current);
      const members = key ? (groups.get(key) ?? []) : [];
      const esId = members.find((member) => !member.endsWith('-en'));
      const enId = members.find((member) => member.endsWith('-en'));
      const spanish = merged.find((item) => item.id === esId);
      return {
        id,
        type: current._type,
        locale,
        path,
        label: (current.nombre || current.title || current.titulo || current.cliente || path).trim(),
        title: publishedTitle(current._type, doc),
        customTitle: Boolean(current.metaTitle?.trim()),
        description: publishedDescription(current._type, doc),
        customDescription: Boolean(current.metaDescription?.trim()),
        hasOg: Boolean(current.hasOg),
        hasOgAlt: Boolean(current.ogAlt?.trim()),
        status,
        paired: members.length > 1,
        pairId: members.find((member) => member !== id),
        esId,
        enId: members.find((member) => member !== esId) ?? enId,
        esSlug: spanish ? slugString(spanish.current.slug) : locale === 'es' ? slugString(current.slug) : current.esSlug,
        missingServiceLink: Boolean(servicePath) && current._type === 'post' && !linksTo(hrefs, servicePath),
        missingIndustryLink: Boolean(industryPath) && current._type === 'post' && !linksTo(hrefs, industryPath),
      };
    })
    .filter((entry) => entry.path)
    .sort((a, b) => a.path.localeCompare(b.path, 'es'));
}

export function duplicateTitles(entries: SeoEntry[]) {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const key = entry.title.trim().toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

export function isShortDescription(entry: SeoEntry) {
  return entry.description.trim().length < SHORT_DESCRIPTION;
}
