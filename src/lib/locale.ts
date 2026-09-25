export type Locale = 'es' | 'en';

export function localeFromPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es';
}

/** English pages that exist. Anything else under /en redirects to /en. */
export function localePath(pathname: string, locale: Locale): string {
  const bare = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  if (locale === 'es') return bare;
  return bare === '/' ? '/en' : `/en${bare}`;
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
    about: 'Nosotros',
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
