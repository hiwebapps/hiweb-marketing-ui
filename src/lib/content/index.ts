import { isSanityConfigured } from '../../sanity/client';
import {
  collectionsAbout,
  collectionsCases,
  collectionsHome,
  collectionsIndustries,
  collectionsPeople,
  collectionsPosts,
  collectionsServices,
} from './from-collections';
import {
  sanityAbout,
  sanityCase,
  sanityCases,
  sanityHome,
  sanityIndustries,
  sanityIndustry,
  sanityLanding,
  sanityLandings,
  sanityPeople,
  sanityPost,
  sanityPosts,
  sanityService,
  sanityServices,
} from './from-sanity';
import { hydrateLanding, landingNeedsCatalogs } from './hydrate-landing';
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

async function withFallback<T>(
  load: () => Promise<T>,
  fallback: () => Promise<T> | T,
  isEmpty?: (value: T) => boolean,
): Promise<T> {
  if (!isSanityConfigured()) {
    return fallback();
  }
  try {
    const value = await load();
    if (isEmpty?.(value)) return fallback();
    return value;
  } catch (error) {
    warnSanityFallback(error);
    return fallback();
  }
}

let sanityFallbackWarned = false;
function warnSanityFallback(error: unknown) {
  if (sanityFallbackWarned) return;
  sanityFallbackWarned = true;
  const message = error instanceof Error ? error.message.split('\n')[0] : String(error);
  console.warn(`[cms] Sanity unavailable (${message}). Using src/content fallback.`);
}

export async function getIndustries(): Promise<IndustryRecord[]> {
  return withFallback(sanityIndustries, collectionsIndustries, (items) => items.length === 0);
}

export async function getIndustry(slug: string): Promise<IndustryRecord | undefined> {
  const fromSanity = await withFallback(
    () => sanityIndustry(slug),
    async () => {
      const items = await collectionsIndustries();
      return items.find((item) => item.id === slug) ?? null;
    },
    (item) => !item,
  );
  return fromSanity ?? undefined;
}

export async function getServices(): Promise<ServiceRecord[]> {
  return withFallback(sanityServices, collectionsServices, (items) => items.length === 0);
}

export async function getService(slug: string): Promise<ServiceRecord | undefined> {
  const fromSanity = await withFallback(
    () => sanityService(slug),
    async () => {
      const items = await collectionsServices();
      return items.find((item) => item.id === slug) ?? null;
    },
    (item) => !item,
  );
  return fromSanity ?? undefined;
}

export async function getCases(): Promise<CaseRecord[]> {
  return withFallback(sanityCases, collectionsCases, (items) => items.length === 0);
}

export async function getCase(slug: string): Promise<CaseRecord | undefined> {
  const fromSanity = await withFallback(
    () => sanityCase(slug),
    async () => {
      const items = await collectionsCases();
      return items.find((item) => item.id === slug) ?? null;
    },
    (item) => !item,
  );
  return fromSanity ?? undefined;
}

export async function getPosts(): Promise<PostRecord[]> {
  return withFallback(sanityPosts, collectionsPosts, (items) => items.length === 0);
}

export async function getPost(slug: string): Promise<PostRecord | undefined> {
  const fromSanity = await withFallback(
    () => sanityPost(slug),
    async () => {
      const items = await collectionsPosts();
      return items.find((item) => item.id === slug) ?? null;
    },
    (item) => !item,
  );
  return fromSanity ?? undefined;
}

export async function getPeople(): Promise<PersonRecord[]> {
  return withFallback(sanityPeople, collectionsPeople, (items) => items.length === 0);
}

export async function getHomeCopy(): Promise<HomeCopy> {
  const copy = await withFallback(sanityHome, collectionsHome, (item) => !item);
  return copy ?? collectionsHome();
}

export async function getAboutCopy(): Promise<AboutCopy> {
  const copy = await withFallback(sanityAbout, collectionsAbout, (item) => !item);
  return copy ?? collectionsAbout();
}

export async function industryStaticPaths() {
  const industries = await getIndustries();
  return industries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

export async function serviceStaticPaths() {
  const services = await getServices();
  return services.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

export async function caseStaticPaths() {
  const cases = await getCases();
  return cases.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

export async function postStaticPaths() {
  const posts = await getPosts();
  const full = await Promise.all(posts.map((post) => getPost(post.id)));
  return full
    .filter((entry): entry is PostRecord => Boolean(entry))
    .map((entry) => ({
      params: { slug: entry.id },
      props: { entry },
    }));
}

export async function getLandings(): Promise<LandingPage[]> {
  return withFallback(sanityLandings, async () => [], (items) => items.length === 0);
}

async function withLandingCatalogs(page: LandingPage): Promise<LandingPage> {
  const needs = landingNeedsCatalogs(page);
  const [services, industries, cases, people] = await Promise.all([
    needs.services ? getServices() : Promise.resolve([]),
    needs.industries ? getIndustries() : Promise.resolve([]),
    needs.cases ? getCases() : Promise.resolve([]),
    needs.people ? getPeople() : Promise.resolve([]),
  ]);
  return hydrateLanding(page, { services, industries, cases, people });
}

export async function getLanding(slug: string): Promise<LandingPage | undefined> {
  const fromSanity = await withFallback(
    async () => {
      const page = await sanityLanding(slug);
      return page ? withLandingCatalogs(page) : null;
    },
    async () => null,
    (item) => !item,
  );
  return fromSanity ?? undefined;
}

export async function landingStaticPaths() {
  const pages = await getLandings();
  const hydrated = await Promise.all(pages.map((page) => getLanding(page.id)));
  return hydrated
    .filter((entry): entry is LandingPage => Boolean(entry))
    .map((entry) => ({
      params: { slug: entry.id },
      props: { entry },
    }));
}
