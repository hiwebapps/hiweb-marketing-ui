import { loadQuery } from '../../sanity/lib/load-query';
import {
  aboutPageQuery,
  caseBySlugQuery,
  casesQuery,
  homePageQuery,
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

export async function sanityIndustries(): Promise<IndustryRecord[]> {
  return fetchList(industriesQuery, mapIndustry);
}

export async function sanityIndustry(slug: string): Promise<IndustryRecord | null> {
  return fetchOne(industryBySlugQuery, { slug }, mapIndustry);
}

export async function sanityServices(): Promise<ServiceRecord[]> {
  return fetchList(servicesQuery, mapService);
}

export async function sanityService(slug: string): Promise<ServiceRecord | null> {
  return fetchOne(serviceBySlugQuery, { slug }, mapService);
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

export async function sanityHome(): Promise<HomeCopy | null> {
  const { data } = await loadQuery<Record<string, unknown> | null>({ query: homePageQuery });
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
