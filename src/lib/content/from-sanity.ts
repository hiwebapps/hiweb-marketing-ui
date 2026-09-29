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
  navigationQuery,
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
  closingTitle?: string;
  cardCtaLabel?: string;
  pillars?: { title: string; description: string }[];
  seo?: { metaTitle?: string; metaDescription?: string };
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
    description: data.description ? String(data.description) : undefined,
    whyEyebrow: data.whyEyebrow ? String(data.whyEyebrow) : undefined,
    whyTitle: data.whyTitle ? String(data.whyTitle) : undefined,
    closingTitle: data.closingTitle ? String(data.closingTitle) : undefined,
    cardCtaLabel: data.cardCtaLabel ? String(data.cardCtaLabel) : undefined,
    pillars: Array.isArray(data.pillars)
      ? (data.pillars as { title?: string; description?: string }[])
          .filter((item) => item.title)
          .map((item) => ({ title: String(item.title), description: String(item.description ?? '') }))
      : [],
    seo: {
      metaTitle: data.metaTitle ? String(data.metaTitle) : undefined,
      metaDescription: data.metaDescription ? String(data.metaDescription) : undefined,
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

export async function sanityPeople(): Promise<PersonRecord[]> {
  return fetchList(peopleQuery, mapPerson);
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
