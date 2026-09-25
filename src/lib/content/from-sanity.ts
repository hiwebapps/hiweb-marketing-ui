import { loadQuery } from '../../sanity/lib/load-query';
import {
  aboutPageQuery,
  caseBySlugQuery,
  casesQuery,
  homePageEnQuery,
  homePageQuery,
  industriesIndexQuery,
  industriesQuery,
  industryBySlugQuery,
  landingBySlugQuery,
  landingsQuery,
  peopleQuery,
  postBySlugQuery,
  postsQuery,
  serviceBySlugQuery,
  servicesQuery,
} from '../../sanity/queries';
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

export async function sanityPosts(): Promise<PostRecord[]> {
  return fetchList(postsQuery, mapPost);
}

export async function sanityPost(slug: string): Promise<PostRecord | null> {
  return fetchOne(postBySlugQuery, { slug }, mapPost);
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

export async function sanityAbout(): Promise<AboutCopy | null> {
  const { data } = await loadQuery<Record<string, unknown> | null>({ query: aboutPageQuery });
  return mapAbout(data);
}

export async function sanityLandings(): Promise<LandingPage[]> {
  return fetchList(landingsQuery, mapLanding);
}

export async function sanityLanding(slug: string): Promise<LandingPage | null> {
  return fetchOne(landingBySlugQuery, { slug }, mapLanding);
}
