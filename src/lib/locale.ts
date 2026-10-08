import { EN_BLOG_SLUG, ES_BLOG_SLUG } from './blog-pairs';
import { englishServiceSlug, serviceContentKey } from './en-slugs';

export type Locale = 'es' | 'en';

export function localeFromPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es';
}

function translateServicePath(bare: string, locale: Locale) {
  const match = bare.match(/^\/servicios\/([^/]+)\/?$/);
  if (!match) return bare;
  const slug = locale === 'en' ? englishServiceSlug(match[1]) : serviceContentKey(match[1]);
  return `/servicios/${slug}`;
}

function translateBlogPath(bare: string, locale: Locale) {
  if (bare === '/blog' || bare === '/blog/') return locale === 'en' ? '/blogs' : '/blog';
  if (bare === '/blogs' || bare === '/blogs/') return locale === 'es' ? '/blog' : '/blogs';
  const english = bare.match(/^\/blogs\/([^/]+)\/?$/);
  if (english) return locale === 'es' ? `/blog/${ES_BLOG_SLUG[english[1]] ?? english[1]}` : `/blogs/${english[1]}`;
  const spanish = bare.match(/^\/blog\/([^/]+)\/?$/);
  if (spanish) return locale === 'en' ? `/blogs/${EN_BLOG_SLUG[spanish[1]] ?? spanish[1]}` : `/blog/${spanish[1]}`;
  return bare;
}

/** English pages that exist. Anything else under /en redirects to /en. */
export function localePath(pathname: string, locale: Locale): string {
  const stripped = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  const bare = translateBlogPath(translateServicePath(stripped, locale), locale);
  if (locale === 'es') return bare;
  return bare === '/' ? '/en' : `/en${bare}`;
}

const RETIRED_CATALOG_PATHS = new Set(['/industrias', '/servicios', '/en/industrias', '/en/servicios']);

/** Index pages for industries and services are gone. Individual pages stay. */
export function isRetiredCatalogPath(href: string) {
  const path = href.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  return RETIRED_CATALOG_PATHS.has(path);
}

export const CHROME = {
  es: {
    about: 'Nosotros',
    industries: 'Industrias',
    allIndustries: 'Todas las industrias',
    services: 'Servicios',
    cases: 'Casos de Éxito',
    blog: 'Blog',
    audit: 'Agenda tu auditoría',
    menu: 'Menú',
    contact: 'Contacto',
    workEmail: 'Email de trabajo',
    toContact: 'Ir a contacto',
    backToTop: 'Volver arriba ↑',
    footerTitle: 'Agenda una auditoría. Llegamos con mapa, no con deck.',
    language: 'Idioma',
    languageCurrent: 'Idioma: español',
  },
  en: {
    about: 'About',
    industries: 'Industries',
    allIndustries: 'All industries',
    services: 'Services',
    cases: 'Success Stories',
    blog: 'Blog',
    audit: 'Schedule your Audit',
    menu: 'Menú',
    contact: 'Contact us',
    workEmail: 'Email de trabajo',
    toContact: 'Contact us',
    backToTop: 'Volver arriba ↑',
    footerTitle: 'Take your business to the next digital level',
    language: 'Language',
    languageCurrent: 'Language: English',
  },
} as const;

/** Service names and blurbs from the live English nav. Group headings stay Spanish. */
export const EN_NAV_SERVICES: Record<string, { nombre: string; desc: string }> = {
  seo: { nombre: 'SEO Positioning', desc: 'Position your brand on Google and in AI chats.' },
  'google-ads': { nombre: 'Google Advertising', desc: 'Generate instant results.' },
  'meta-ads': { nombre: 'Social Media Advertising', desc: 'Achieve your social media goals without the long wait.' },
  'redes-sociales': { nombre: 'Social Media', desc: 'Strategic social media growth.' },
  branding: { nombre: 'Brand Identity & Branding', desc: 'Give your brand an identity.' },
  'community-manager': {
    nombre: 'Community Manager',
    desc: 'Boost your community with strategy and active management.',
  },
  'desarrollo-web': {
    nombre: 'Web Design and Development',
    desc: 'Every line of code is geared towards your business objectives.',
  },
  'crm-automatizacion': {
    nombre: 'CRM & Automation',
    desc: 'Manage clients and convert more opportunities.',
  },
  'ia-marketing': { nombre: 'AI Marketing', desc: 'Smart automation that accelerates your results.' },
};
