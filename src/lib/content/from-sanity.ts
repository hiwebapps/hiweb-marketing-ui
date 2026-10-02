import { asHeadingWidth } from '../heading';
import { loadQuery } from '../../sanity/lib/load-query';
import {
  aboutPageQuery,
  contactPageQuery,
  caseBySlugQuery,
  casesQuery,
  homePageEnQuery,
  homePageQuery,
  industriesIndexQuery,
  industriesQuery,
  catalogIndexQuery,
  footerQuery,
  legalPageQuery,
  navigationQuery,
  siteFaviconQuery,
  siteIdentityQuery,
  industryBySlugQuery,
  landingBySlugQuery,
  landingsQuery,
  peopleQuery,
  postBySlugQuery,
  postsQuery,
  serviceBySlugQuery,
  servicesQuery,
} from '../../sanity/queries';
import { mapContactPage, type ContactPageCopy } from './contact';
import {
  mapAbout,
  mapCase,
  mapHome,
  mapIndustry,
  mapLanding,
  mapPerson,
  mapPost,
  mapService,
} from './map-sanity';
import type { FooterLink, SiteFooterContent } from '../footer';
import { fallbackSite, type SiteIdentity } from '../site-identity';
import type { SeoFields } from './types';
import type { NavGroup, NavLink, SiteNavContent } from '../nav';
import type {
  AboutCopy,
  CaseRecord,
  HomeCopy,
  IndustryRecord,
  LandingPage,
  PersonRecord,
  PostRecord,
  ServiceRecord,
} from './types';

async function fetchList<T>(query: string, map: (doc: Record<string, unknown>) => T): Promise<T[]> {
  const { data } = await loadQuery<Record<string, unknown>[]>({ query });
  if (!Array.isArray(data) || data.length === 0) return [];
  return data.filter((item) => item?.id || item?.name).map(map);
}

async function fetchOne<T>(
  query: string,
  params: Record<string, string>,
  map: (doc: Record<string, unknown>) => T,
): Promise<T | null> {
  const { data } = await loadQuery<Record<string, unknown> | null>({ query, params });
  if (!data) return null;
  return map(data);
}

export async function sanityIndustries(locale: 'es' | 'en' = 'es'): Promise<IndustryRecord[]> {
  const { data } = await loadQuery<Record<string, unknown>[]>({ query: industriesQuery, params: { locale } });
  if (!Array.isArray(data) || data.length === 0) return [];
  return data.filter((item) => item?.id).map(mapIndustry);
}

export async function sanityIndustry(slug: string, locale: 'es' | 'en' = 'es'): Promise<IndustryRecord | null> {
  return fetchOne(industryBySlugQuery, { slug, locale }, mapIndustry);
}

export type IndustriesIndexCopy = {
  eyebrow?: string;
  title?: string;
  description?: string;
  whyEyebrow?: string;
  whyTitle?: string;
  headingWidth?: ReturnType<typeof asHeadingWidth>;
  whyHeadingWidth?: ReturnType<typeof asHeadingWidth>;
  closingTitle?: string;
  closingHeadingWidth?: ReturnType<typeof asHeadingWidth>;
  cardCtaLabel?: string;
  pillars?: { title: string; description: string }[];
  seo?: SeoFields;
};

export async function sanityIndustriesIndex(id = 'industriesIndex-en'): Promise<IndustriesIndexCopy | null> {
  const { data } = await loadQuery<Record<string, unknown> | null>({
    query: industriesIndexQuery,
    params: { id },
  });
  if (!data) return null;
  return {
    eyebrow: data.eyebrow ? String(data.eyebrow) : undefined,
    title: data.title ? String(data.title) : undefined,
    headingWidth: asHeadingWidth(data.headingWidth),
    description: data.description ? String(data.description) : undefined,
    whyEyebrow: data.whyEyebrow ? String(data.whyEyebrow) : undefined,
    whyTitle: data.whyTitle ? String(data.whyTitle) : undefined,
    whyHeadingWidth: asHeadingWidth(data.whyHeadingWidth),
    closingTitle: data.closingTitle ? String(data.closingTitle) : undefined,
    closingHeadingWidth: asHeadingWidth(data.closingHeadingWidth),
    cardCtaLabel: data.cardCtaLabel ? String(data.cardCtaLabel) : undefined,
    pillars: Array.isArray(data.pillars)
      ? (data.pillars as { title?: string; description?: string }[])
          .filter((item) => item.title)
          .map((item) => ({ title: String(item.title), description: String(item.description ?? '') }))
      : [],
    seo: {
      metaTitle: optionalText(data.metaTitle),
      metaDescription: optionalText(data.metaDescription),
      noindex: data.noindex === true || undefined,
      canonicalPath: optionalText(data.canonicalPath),
    },
  };
}

export async function sanityServices(locale: 'es' | 'en' = 'es'): Promise<ServiceRecord[]> {
  const { data } = await loadQuery<Record<string, unknown>[]>({ query: servicesQuery, params: { locale } });
  if (!Array.isArray(data) || data.length === 0) return [];
  return data.filter((item) => item?.id).map(mapService);
}

export async function sanityService(slug: string, locale: 'es' | 'en' = 'es'): Promise<ServiceRecord | null> {
  return fetchOne(serviceBySlugQuery, { slug, locale }, mapService);
}

export async function sanityCases(): Promise<CaseRecord[]> {
  return fetchList(casesQuery, mapCase);
}

export async function sanityCase(slug: string): Promise<CaseRecord | null> {
  return fetchOne(caseBySlugQuery, { slug }, mapCase);
}

export async function sanityPosts(
  locale: 'es' | 'en' = 'es',
  options?: { stega?: boolean },
): Promise<PostRecord[]> {
  const { data } = await loadQuery<Record<string, unknown>[]>({
    query: postsQuery,
    params: { locale },
    stega: options?.stega,
  });
  if (!Array.isArray(data) || data.length === 0) return [];
  return data.filter((item) => item?.id).map(mapPost);
}

export async function sanityPost(slug: string, locale: 'es' | 'en' = 'es'): Promise<PostRecord | null> {
  return fetchOne(postBySlugQuery, { slug, locale }, mapPost);
}

export async function sanityPeople(locale: 'es' | 'en' = 'es'): Promise<PersonRecord[]> {
  const { data } = await loadQuery<Record<string, unknown>[]>({
    query: peopleQuery,
    params: { locale },
  });
  if (!Array.isArray(data) || data.length === 0) return [];
  return data.filter((item) => item?.name).map(mapPerson);
}

export async function sanityHome(locale: 'es' | 'en' = 'es'): Promise<HomeCopy | null> {
  const { data } = await loadQuery<Record<string, unknown> | null>({
    query: locale === 'en' ? homePageEnQuery : homePageQuery,
  });
  return mapHome(data);
}

export async function sanityContactPage(): Promise<ContactPageCopy | null> {
  const { data } = await loadQuery<Record<string, unknown> | null>({ query: contactPageQuery });
  return mapContactPage(data);
}

export async function sanityAbout(locale: 'es' | 'en' = 'es'): Promise<AboutCopy | null> {
  const { data } = await loadQuery<Record<string, unknown> | null>({
    query: aboutPageQuery,
    params: { id: locale === 'en' ? 'aboutPage-en' : 'aboutPage' },
  });
  return mapAbout(data);
}

function asLinks(value: unknown): NavLink[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const row = item as Record<string, unknown>;
    if (typeof row.title !== 'string' || typeof row.href !== 'string') return [];
    return [
      {
        title: row.title,
        description: typeof row.description === 'string' ? row.description : '',
        href: row.href,
        icon: typeof row.icon === 'string' ? row.icon : 'grid',
      },
    ];
  });
}

function asGroups(value: unknown): NavGroup[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((group) => {
    if (!group || typeof group !== 'object') return [];
    const row = group as Record<string, unknown>;
    if (typeof row.heading !== 'string') return [];
    return [{ heading: row.heading, links: asLinks(row.links) }];
  });
}

function text(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function pairColumns(links: NavLink[], firstHeading: string): NavGroup[] {
  const columns: NavGroup[] = [];
  for (let index = 0; index < links.length; index += 2) {
    columns.push({
      heading: columns.length === 0 ? firstHeading : '',
      links: links.slice(index, index + 2),
    });
  }
  return columns;
}

function asBar(value: unknown, doc: Record<string, unknown>): SiteNavContent['bar'] {
  if (!Array.isArray(value)) return [];
  const looseIndustries = asLinks(doc.industryLinks);
  const looseGroups = asGroups(doc.serviceGroups);
  const looseExplore = asLinks(doc.exploreLinks);
  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const row = item as Record<string, unknown>;
    if (typeof row.label !== 'string') return [];
    if (row.kind === 'link' && typeof row.href === 'string') {
      return [{ label: row.label, kind: 'link' as const, href: row.href }];
    }
    if (row.kind !== 'dropdown' && row.kind !== 'industries' && row.kind !== 'services') return [];

    let columns = asGroups(row.columns);
    if (!columns.length && (row.kind === 'industries' || asLinks(row.links).length)) {
      const links = asLinks(row.links);
      columns = pairColumns(links.length ? links : looseIndustries, row.label);
    }
    if (!columns.length && row.kind === 'services') {
      const groups = asGroups(row.groups);
      const explore = asLinks(row.exploreLinks);
      columns = [
        ...(groups.length ? groups : looseGroups),
        ...((explore.length ? explore : looseExplore).length
          ? [
              {
                heading: text(row.exploreHeading) || text(doc.exploreHeading) || 'Explorar',
                links: explore.length ? explore : looseExplore,
              },
            ]
          : []),
      ];
    }
    const indexFromIndustries = row.kind === 'industries';
    return [
      {
        label: row.label,
        kind: 'dropdown' as const,
        columns,
        indexLabel: text(row.indexLabel) || text(indexFromIndustries ? doc.allIndustriesLabel : doc.allServicesLabel),
        indexHref: text(row.indexHref) || text(indexFromIndustries ? doc.industriesIndexHref : doc.servicesIndexHref),
      },
    ];
  });
}

function asFooterLinks(value: unknown): FooterLink[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const row = item as { label?: unknown; href?: unknown };
    const label = text(row.label);
    const href = text(row.href);
    if (!label || !href) return [];
    return [{ label, href }];
  });
}

export type SiteFavicon = {
  href: string;
  type: string;
};

export async function sanityFavicon(): Promise<SiteFavicon | null> {
  const { data } = await loadQuery<{
    favicon?: { asset?: { url?: string; mimeType?: string } | null } | null;
  } | null>({
    query: siteFaviconQuery,
    stega: false,
  });
  const asset = data?.favicon?.asset;
  const href = asset?.url?.trim();
  if (!href) return null;
  const mime = asset?.mimeType?.trim() || '';
  const svg = mime.includes('svg') || href.endsWith('.svg');
  return { href, type: mime || (svg ? 'image/svg+xml' : 'image/png') };
}

function textList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => text(item)).filter(Boolean);
}

function socialsOf(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const row = item as { label?: unknown; href?: unknown };
    const label = text(row.label);
    const href = text(row.href);
    if (!label || !href) return [];
    return [{ label, href }];
  });
}

export async function sanitySiteIdentity(): Promise<SiteIdentity> {
  const fallback = fallbackSite();
  const { data } = await loadQuery<Record<string, unknown> | null>({
    query: siteIdentityQuery,
    stega: false,
  });
  if (!data) return fallback;
  const socials = socialsOf(data.socials);
  const locales = textList(data.locales);
  return {
    name: text(data.name) || fallback.name,
    legalName: text(data.legalName) || fallback.legalName,
    tagline: text(data.tagline) || fallback.tagline,
    email: text(data.email) || fallback.email,
    phone: text(data.phone) || fallback.phone,
    phoneHref: text(data.phoneHref) || fallback.phoneHref,
    whatsapp: text(data.whatsapp) || fallback.whatsapp,
    locales: locales.length ? locales : fallback.locales,
    socials: socials.length ? socials : fallback.socials,
  };
}

export type CatalogIndexCopy = {
  eyebrow?: string;
  title?: string;
  headingWidth?: ReturnType<typeof asHeadingWidth>;
  description?: string;
  label?: string;
  sectionTitle?: string;
  sectionHeadingWidth?: ReturnType<typeof asHeadingWidth>;
  listTitle?: string;
  listHeadingWidth?: ReturnType<typeof asHeadingWidth>;
  listDescription?: string;
  allLabel?: string;
  filterLabel?: string;
  featuredCta?: string;
  readingSuffix?: string;
  closingTitle?: string;
  closingHeadingWidth?: ReturnType<typeof asHeadingWidth>;
  seo?: SeoFields;
};

function optionalText(value: unknown) {
  const next = text(value);
  return next || undefined;
}

export async function sanityCatalogIndex(id: string): Promise<CatalogIndexCopy | null> {
  const { data } = await loadQuery<Record<string, unknown> | null>({
    query: catalogIndexQuery,
    params: { id },
  });
  if (!data || (!data.title && !data.description)) return null;
  return {
    eyebrow: optionalText(data.eyebrow),
    title: optionalText(data.title),
    headingWidth: asHeadingWidth(data.headingWidth),
    description: optionalText(data.description),
    label: optionalText(data.label),
    sectionTitle: optionalText(data.sectionTitle),
    sectionHeadingWidth: asHeadingWidth(data.sectionHeadingWidth),
    listTitle: optionalText(data.listTitle),
    listHeadingWidth: asHeadingWidth(data.listHeadingWidth),
    listDescription: optionalText(data.listDescription),
    allLabel: optionalText(data.allLabel),
    filterLabel: optionalText(data.filterLabel),
    featuredCta: optionalText(data.featuredCta),
    readingSuffix: optionalText(data.readingSuffix),
    closingTitle: optionalText(data.closingTitle),
    closingHeadingWidth: asHeadingWidth(data.closingHeadingWidth),
    seo: {
      metaTitle: optionalText(data.metaTitle),
      metaDescription: optionalText(data.metaDescription),
      noindex: data.noindex === true || undefined,
      canonicalPath: optionalText(data.canonicalPath),
    },
  };
}

export type LegalBlock =
  | { _type: 'legalParagraph'; text: string }
  | { _type: 'legalBullets'; items: string[] }
  | { _type: 'legalTerms'; items: { term: string; text: string }[] }
  | { _type: 'legalLines'; items: { label: string; value: string }[] }
  | { _type: 'legalSubsection'; title: string; blocks: LegalBlock[] };

export type LegalSection = {
  title: string;
  blocks: LegalBlock[];
};

export type LegalCopy = {
  eyebrow?: string;
  title?: string;
  headingWidth?: ReturnType<typeof asHeadingWidth>;
  updatedLabel?: string;
  updatedOn?: string;
  intro?: string;
  sections?: LegalSection[];
  seo?: SeoFields;
};

function asLegalBlocks(value: unknown): LegalBlock[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const block = item as Record<string, unknown>;
    const type = String(block._type ?? '');
    if (type === 'legalParagraph') {
      const text = optionalText(block.text);
      return text ? [{ _type: 'legalParagraph' as const, text }] : [];
    }
    if (type === 'legalBullets') {
      const items = Array.isArray(block.items) ? block.items.map(String).map((entry) => entry.trim()).filter(Boolean) : [];
      return items.length ? [{ _type: 'legalBullets' as const, items }] : [];
    }
    if (type === 'legalTerms') {
      const items = Array.isArray(block.items)
        ? block.items.flatMap((entry) => {
            const row = entry as { term?: unknown; text?: unknown };
            const term = optionalText(row.term);
            const text = optionalText(row.text);
            return term && text ? [{ term, text }] : [];
          })
        : [];
      return items.length ? [{ _type: 'legalTerms' as const, items }] : [];
    }
    if (type === 'legalLines') {
      const items = Array.isArray(block.items)
        ? block.items.flatMap((entry) => {
            const row = entry as { label?: unknown; value?: unknown };
            const label = optionalText(row.label);
            const value = optionalText(row.value);
            return label && value ? [{ label, value }] : [];
          })
        : [];
      return items.length ? [{ _type: 'legalLines' as const, items }] : [];
    }
    if (type === 'legalSubsection') {
      const title = optionalText(block.title);
      const blocks = asLegalBlocks(block.blocks).filter((entry) => entry._type !== 'legalSubsection');
      return title ? [{ _type: 'legalSubsection' as const, title, blocks }] : [];
    }
    return [];
  });
}

export async function sanityLegalPage(id: string): Promise<LegalCopy | null> {
  const { data } = await loadQuery<Record<string, unknown> | null>({
    query: legalPageQuery,
    params: { id },
  });
  if (!data?.title) return null;
  const sections = Array.isArray(data.sections)
    ? data.sections.flatMap((item) => {
        const section = item as { title?: unknown; blocks?: unknown };
        const title = optionalText(section.title);
        if (!title) return [];
        return [{ title, blocks: asLegalBlocks(section.blocks) }];
      })
    : [];
  return {
    eyebrow: optionalText(data.eyebrow),
    title: optionalText(data.title),
    headingWidth: asHeadingWidth(data.headingWidth),
    updatedLabel: optionalText(data.updatedLabel),
    updatedOn: optionalText(data.updatedOn),
    intro: optionalText(data.intro),
    sections,
    seo: {
      metaTitle: optionalText(data.metaTitle),
      metaDescription: optionalText(data.metaDescription),
      noindex: data.noindex === true || undefined,
      canonicalPath: optionalText(data.canonicalPath),
    },
  };
}

export async function sanityFooter(locale: 'es' | 'en'): Promise<SiteFooterContent | null> {
  const { data } = await loadQuery<Record<string, unknown> | null>({
    query: footerQuery,
    params: { id: locale === 'en' ? 'footer-en' : 'footer' },
  });
  if (!data) return null;
  return {
    brand: text(data.brand),
    title: text(data.title),
    emailPlaceholder: text(data.emailPlaceholder),
    menuHeading: text(data.menuHeading),
    menuLinks: asFooterLinks(data.menuLinks),
    contactHeading: text(data.contactHeading),
    contactLinks: asFooterLinks(data.contactLinks),
    locations: text(data.locations),
    legalName: text(data.legalName),
    legalLinks: asFooterLinks(data.legalLinks),
    backToTop: text(data.backToTop),
  };
}

export async function sanityNavigation(locale: 'es' | 'en'): Promise<SiteNavContent | null> {
  const { data } = await loadQuery<Record<string, unknown> | null>({
    query: navigationQuery,
    params: { id: locale === 'en' ? 'navigation-en' : 'navigation' },
  });
  if (!data) return null;
  const bar = asBar(data.bar, data);
  if (bar.length === 0) return null;
  return {
    bar,
    ctaLabel: text(data.ctaLabel),
    ctaHref: text(data.ctaHref),
  };
}

export async function sanityLandings(): Promise<LandingPage[]> {
  return fetchList(landingsQuery, mapLanding);
}

export async function sanityLanding(slug: string): Promise<LandingPage | null> {
  return fetchOne(landingBySlugQuery, { slug }, mapLanding);
}
