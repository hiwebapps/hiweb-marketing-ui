/** Shared title, description and path rules for the site and the Studio SEO tools. */

export const PUBLIC_ORIGIN = 'https://www.hiwebmarketing.com';

const DEFAULT_DESCRIPTION =
  'Partner estratégico con la eficiencia de un equipo interno y el alcance de una agencia enterprise.';

export const SHORT_DESCRIPTION = 70;

type SlugValue = string | { current?: string } | null | undefined;

export type PageMetaDoc = {
  _id?: string;
  _type?: string;
  title?: string;
  nombre?: string;
  titulo?: string;
  cliente?: string;
  slug?: SlugValue;
  locale?: string;
  metaTitle?: string;
  metaDescription?: string;
  description?: string;
  tagline?: string;
  resumen?: string;
  heroDescription?: string;
};

export function publishedId(id: string) {
  return id.replace(/^drafts\./, '');
}

export function slugOf(slug: SlugValue) {
  if (!slug) return '';
  if (typeof slug === 'string') return slug;
  return slug.current ?? '';
}

export function isEnglish(id: string, locale?: string) {
  return locale === 'en' || publishedId(id).endsWith('-en');
}

export function pagePath(type: string, id: string, doc: { locale?: string; slug?: SlugValue }) {
  const published = publishedId(id);
  const english = isEnglish(published, doc.locale);
  const slug = slugOf(doc.slug);
  if (type === 'homePage') return english ? '/en' : '/';
  if (type === 'aboutPage') return english ? '/en/nosotros' : '/nosotros';
  if (type === 'contactPage') return '/contacto';
  if (type === 'calendarPage') return english ? '/en/calendario' : '/calendario';
  if (type === 'sitePage' && slug) return `/${slug}`;
  if (type === 'service' && slug) return english ? `/en/servicios/${slug}` : `/servicios/${slug}`;
  if (type === 'industry' && slug) return english ? `/en/industrias/${slug}` : `/industrias/${slug}`;
  if (type === 'caseStudy' && slug) return `/portafolio/${slug}`;
  if (type === 'post' && slug) return english ? `/en/blogs/${slug}` : `/blog/${slug}`;
  if (type === 'landingPage' && slug) return `/${slug}`;
  if (type === 'industriesIndex') return english ? '/en/industrias' : '/industrias';
  if (type === 'servicesIndex') return english ? '/en/servicios' : '/servicios';
  if (type === 'blogIndex') return english ? '/en/blogs' : '/blog';
  if (type === 'casesIndex') return '/portafolio';
  if (type === 'legalPage') {
    const terms = published === 'legal-terms' || published === 'legal-terms-en';
    const path = terms ? '/terminos' : '/aviso-de-privacidad';
    return english ? `/en${path}` : path;
  }
  return '';
}

export function fallbackTitle(type: string, doc: PageMetaDoc) {
  const english = isEnglish(doc._id ?? '', doc.locale);
  const name = (doc.nombre || doc.title || doc.titulo || doc.cliente || '').trim();
  if (type === 'homePage') return 'Hiweb Marketing — Partner estratégico';
  if (type === 'aboutPage') return english ? 'About — Hiweb Marketing' : 'Nosotros — Hiweb Marketing';
  if (type === 'service' || type === 'industry') return name ? `${name} — Hiweb Marketing` : 'Hiweb Marketing';
  if (type === 'caseStudy') return (doc.titulo || doc.cliente || 'Hiweb Marketing').trim();
  if (type === 'contactPage') return 'Contacto — Hiweb Marketing';
  if (type === 'calendarPage') return english ? 'Schedule a meeting — Hiweb Marketing' : 'Agenda una cita — Hiweb Marketing';
  if (type === 'landingPage') return name ? `${name} — Hiweb Marketing` : 'Hiweb Marketing';
  if (type === 'post') return name ? `${name} — Hiweb` : 'Hiweb';
  if (type === 'industriesIndex') return name || (english ? 'Industries — Hiweb Marketing' : 'Industrias — Hiweb Marketing');
  if (type === 'servicesIndex') return name || (english ? 'Services — Hiweb Marketing' : 'Servicios — Hiweb Marketing');
  if (type === 'blogIndex') return name || 'Blog — Hiweb Marketing';
  if (type === 'casesIndex') return name || 'Casos de Éxito — Hiweb Marketing';
  if (type === 'legalPage') return name || 'Hiweb Marketing';
  return name || 'Hiweb Marketing';
}

export function publishedTitle(type: string, doc: PageMetaDoc) {
  return doc.metaTitle?.trim() || fallbackTitle(type, doc);
}

export function publishedDescription(type: string, doc: PageMetaDoc) {
  const custom = doc.metaDescription?.trim();
  if (custom) return custom;
  if (type === 'post') return doc.description?.trim() || '';
  if (type === 'service') return doc.tagline?.trim() || '';
  if (type === 'industry') return doc.heroDescription?.trim() || doc.tagline?.trim() || '';
  if (type === 'caseStudy') return doc.resumen?.trim() || '';
  if (type === 'landingPage') return doc.title?.trim() || '';
  if (type === 'contactPage' || type === 'sitePage' || type === 'calendarPage') return doc.description?.trim() || '';
  if (type === 'homePage') return DEFAULT_DESCRIPTION;
  if (type === 'aboutPage') return doc.heroDescription?.trim() || DEFAULT_DESCRIPTION;
  if (type === 'industriesIndex' || type === 'servicesIndex' || type === 'blogIndex' || type === 'casesIndex' || type === 'legalPage') {
    return doc.description?.trim() || '';
  }
  return '';
}

export function languageAlternates(
  locale: 'es' | 'en',
  path: string,
  alternatePath?: string,
): { es: string; en: string } | undefined {
  if (!alternatePath) return undefined;
  return locale === 'en' ? { es: alternatePath, en: path } : { es: path, en: alternatePath };
}

/** Opens the Spanish document on the left and the English one on the right. */
export function splitStudioPath(
  basePath: string,
  type: string,
  esId?: string,
  enId?: string,
  esSlug?: string,
) {
  const base = basePath.replace(/\/$/, '');
  if (!esId || !enId) return '';
  if (type === 'post') return `${base}/structure/blog;posts-es;${esId}|${enId}`;
  if (type === 'service' && esSlug) {
    return `${base}/structure/servicios;service-${esSlug};service-${esId}-es|service-${enId}-en`;
  }
  if (type === 'industry' && esSlug) {
    return `${base}/structure/industrias;industry-${esSlug};industry-${esId}-es|industry-${enId}-en`;
  }
  if (type === 'homePage') return `${base}/structure/home;home-es|home-en`;
  if (type === 'aboutPage') return `${base}/structure/nosotros;nosotros-es|nosotros-en`;
  if (type === 'industriesIndex') return `${base}/structure/industrias;industries-index;industries-index-es|industries-index-en`;
  if (type === 'servicesIndex') return `${base}/structure/servicios;services-index;services-index-es|services-index-en`;
  if (type === 'blogIndex') return `${base}/structure/blog;blog-index;blog-index-es|blog-index-en`;
  return '';
}

export function presentationUrl(basePath: string, path: string) {
  return `${basePath.replace(/\/$/, '')}/presentation?preview=${encodeURIComponent(path)}`;
}
