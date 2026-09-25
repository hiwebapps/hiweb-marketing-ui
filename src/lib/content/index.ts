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
  sanityIndustriesIndex,
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

export async function getIndustries(locale: 'es' | 'en' = 'es'): Promise<IndustryRecord[]> {
  if (locale === 'en') return sanityIndustries('en');
  return withFallback(
    () => sanityIndustries(locale),
    collectionsIndustries,
    (items) => items.length === 0,
  );
}

export async function getIndustriesIndex() {
  return sanityIndustriesIndex('industriesIndex-en');
}

export async function getIndustry(slug: string, locale: 'es' | 'en' = 'es'): Promise<IndustryRecord | undefined> {
  if (locale === 'en') return (await sanityIndustry(slug, 'en')) ?? undefined;
  const fromSanity = await withFallback(
    () => sanityIndustry(slug, locale),
    async () => {
      const items = await collectionsIndustries();
      return items.find((item) => item.id === slug) ?? null;
    },
    (item) => !item,
  );
  return fromSanity ?? undefined;
}

export async function getServices(locale: 'es' | 'en' = 'es'): Promise<ServiceRecord[]> {
  if (locale === 'en') return sanityServices('en');
  return withFallback(
    () => sanityServices(locale),
    collectionsServices,
    (items) => items.length === 0,
  );
}

export async function getService(slug: string, locale: 'es' | 'en' = 'es'): Promise<ServiceRecord | undefined> {
  if (locale === 'en') return (await sanityService(slug, 'en')) ?? undefined;
  const fromSanity = await withFallback(
    () => sanityService(slug, locale),
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

export async function getHomeCopy(locale: 'es' | 'en' = 'es'): Promise<HomeCopy> {
  const copy = await withFallback(() => sanityHome(locale), collectionsHome, (item) => !item);
  const fallback = collectionsHome();
  const next = copy ?? fallback;
  return {
    ...fallback,
    ...next,
    pillarIntro: next.pillarIntro ?? fallback.pillarIntro,
    pillars: next.pillars?.length ? next.pillars : fallback.pillars,
    serviceIntro: next.serviceIntro ?? fallback.serviceIntro,
    storiesIntro: next.storiesIntro ?? fallback.storiesIntro,
    testimonials: next.testimonials?.length ? next.testimonials : fallback.testimonials,
    processIntro: next.processIntro ?? fallback.processIntro,
    process: next.process?.length ? next.process : fallback.process,
    metricsIntro: next.metricsIntro ?? fallback.metricsIntro,
    metrics: next.metrics?.length ? next.metrics : fallback.metrics,
    faqIntro: next.faqIntro ?? fallback.faqIntro,
    faqCategories: next.faqCategories?.length ? next.faqCategories : fallback.faqCategories,
    seo: { ...fallback.seo, ...next.seo },
  };
}

export async function getAboutCopy(): Promise<AboutCopy> {
  const copy = await withFallback(sanityAbout, collectionsAbout, (item) => !item);
  return copy ?? collectionsAbout();
}

export async function industryStaticPaths(locale: 'es' | 'en' = 'es') {
  const industries = await getIndustries(locale);
  return industries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

export async function serviceStaticPaths(locale: 'es' | 'en' = 'es') {
  const services = await getServices(locale);
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
