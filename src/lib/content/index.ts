import { isSanityConfigured } from '../../sanity/client';
import { fallbackSite } from '../site-identity';
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
  sanityCalendarPage,
  sanityContactPage,
  sanitySitePage,
  sanityCase,
  sanityCases,
  sanityCatalogIndex,
  sanityFavicon,
  sanityCtaBackdrop,
  sanityFooter,
  sanityLegalPage,
  sanitySiteIdentity,
  sanityHome,
  sanityIndustries,
  sanityIndustriesIndex,
  sanityIndustry,
  sanityLanding,
  sanityLandings,
  sanityNavigation,
  sanityPeople,
  sanityPortal,
  sanityPost,
  sanityPosts,
  sanityService,
  sanityServices,
} from './from-sanity';
import { hydrateLanding, landingNeedsCatalogs } from './hydrate-landing';
import { DEFAULT_CALENDAR, type CalendarPageCopy } from './calendar-page';
import { DEFAULT_CONTACT, type ContactPageCopy } from './contact';
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

export async function getSiteSettings() {
  return withFallback(
    () => sanitySiteIdentity(),
    () => fallbackSite(),
  );
}

export async function getCatalogIndex(id: string) {
  return withFallback(
    () => sanityCatalogIndex(id),
    () => null,
    (value) => !value,
  );
}

export async function getLegalPage(id: string) {
  return withFallback(
    () => sanityLegalPage(id),
    () => null,
    (value) => !value,
  );
}

export async function getFavicon() {
  return withFallback(
    () => sanityFavicon(),
    () => null,
    (value) => !value,
  );
}

export async function getCtaBackdrop() {
  return withFallback(
    () => sanityCtaBackdrop(),
    () => [] as string[],
    (value) => value.length === 0,
  );
}

export async function getFooter(locale: 'es' | 'en' = 'es') {
  return withFallback(
    () => sanityFooter(locale),
    () => null,
    (value) => !value,
  );
}

export async function getNavigation(locale: 'es' | 'en' = 'es') {
  return withFallback(
    () => sanityNavigation(locale),
    () => null,
    (value) => !value,
  );
}

export async function getIndustriesIndex(id = 'industriesIndex-en') {
  return withFallback(
    () => sanityIndustriesIndex(id),
    () => null,
    (value) => !value,
  );
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

export async function getPosts(
  locale: 'es' | 'en' = 'es',
  options?: { stega?: boolean },
): Promise<PostRecord[]> {
  if (locale === 'en') return sanityPosts('en', options);
  return withFallback(() => sanityPosts('es', options), collectionsPosts, (items) => items.length === 0);
}

export async function getPost(slug: string, locale: 'es' | 'en' = 'es'): Promise<PostRecord | undefined> {
  if (locale === 'en') return (await sanityPost(slug, 'en')) ?? undefined;
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

export async function getPeople(locale: 'es' | 'en' = 'es'): Promise<PersonRecord[]> {
  if (locale === 'en') {
    const english = await sanityPeople('en');
    if (english.length > 0) return english;
  }
  return withFallback(() => sanityPeople('es'), collectionsPeople, (items) => items.length === 0);
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

const SITE_PAGES = {
  'page-calendario': {
    title: 'Agenda una cita',
    eyebrow: '',
    description: 'Elige servicio, día y horario. Lunes a viernes, de 9:00 a 17:00, hora de Ciudad de México.',
    metaTitle: 'Agenda una cita — Hiweb Marketing',
    metaDescription: 'Elige servicio, día y horario. Lunes a viernes, de 9:00 a 17:00, hora de Ciudad de México.',
  },
  'page-diagnostico': {
    title: 'Diagnóstico de marketing digital',
    eyebrow: 'Diagnóstico',
    description: 'Ocho preguntas para ver en qué punto está tu marketing y qué servicios conviene trabajar primero.',
    metaTitle: 'Diagnóstico de marketing digital — Hiweb Marketing',
    metaDescription: 'Ocho preguntas para ver en qué punto está tu marketing y qué servicios conviene trabajar primero.',
  },
} as const;

export async function getSitePage(id: keyof typeof SITE_PAGES) {
  const fallback = SITE_PAGES[id];
  if (!isSanityConfigured()) return fallback;
  try {
    return (await sanitySitePage(id)) ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getCalendarPage(locale: 'es' | 'en' = 'es'): Promise<CalendarPageCopy> {
  const fallback = DEFAULT_CALENDAR[locale];
  if (!isSanityConfigured()) return fallback;
  try {
    return (await sanityCalendarPage(locale)) ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getContactPage(): Promise<ContactPageCopy> {
  if (!isSanityConfigured()) return DEFAULT_CONTACT;
  try {
    return (await sanityContactPage()) ?? DEFAULT_CONTACT;
  } catch {
    return DEFAULT_CONTACT;
  }
}

export async function getPortal(locale: 'es' | 'en' = 'es') {
  if (!isSanityConfigured()) return null;
  try {
    return await sanityPortal(locale);
  } catch {
    return null;
  }
}

export async function getAboutCopy(locale: 'es' | 'en' = 'es'): Promise<AboutCopy> {
  if (locale === 'en') return (await sanityAbout('en')) ?? {};
  const copy = await withFallback(() => sanityAbout('es'), collectionsAbout, (item) => !item);
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

export async function postStaticPaths(locale: 'es' | 'en' = 'es') {
  const posts = await getPosts(locale);
  const full = await Promise.all(posts.map((post) => getPost(post.id, locale)));
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
