import { defineDocuments, defineLocations } from 'sanity/presentation';
import type { PresentationPluginOptions } from 'sanity/presentation';
import { aboutPath, DEFAULT_ABOUT_EN_SLUG } from '../../lib/page-meta';

function publishedId(id: string | undefined) {
  return (id ?? '').replace(/^drafts\./, '');
}

function englishId(id: string | undefined) {
  return publishedId(id).endsWith('-en');
}

function prefix(language: string | undefined) {
  return language === 'en' ? '/en' : '';
}

export const resolve: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    {
      route: '/',
      filter: `_type == "homePage" && _id in ["homePage", "drafts.homePage"]`,
    },
    {
      route: '/en',
      filter: `_type == "homePage" && _id in ["homePage-en", "drafts.homePage-en"]`,
    },
    {
      route: '/nosotros',
      filter: `_type == "aboutPage" && _id in ["aboutPage", "drafts.aboutPage"]`,
    },
    {
      route: '/contacto',
      filter: `_type == "contactPage" && _id in ["contactPage", "drafts.contactPage"]`,
    },
    {
      route: '/portal',
      filter: `_type == "portalPage" && _id in ["portalPage", "drafts.portalPage"]`,
    },
    {
      route: '/en/portal',
      filter: `_type == "portalPage" && _id in ["portalPage-en", "drafts.portalPage-en"]`,
    },
    {
      route: '/calendario',
      filter: `_type == "calendarPage" && _id in ["calendarPage", "drafts.calendarPage"]`,
    },
    {
      route: '/en/calendar',
      filter: `_type == "calendarPage" && _id in ["calendarPage-en", "drafts.calendarPage-en"]`,
    },
    {
      route: '/diagnostico-marketing-digital',
      filter: `_type == "sitePage" && _id in ["page-diagnostico", "drafts.page-diagnostico"]`,
    },
    {
      route: '/terminos',
      filter: `_type == "legalPage" && _id in ["legal-terms", "drafts.legal-terms"]`,
    },
    {
      route: '/en/terms',
      filter: `_type == "legalPage" && _id in ["legal-terms-en", "drafts.legal-terms-en"]`,
    },
    {
      route: '/aviso-de-privacidad',
      filter: `_type == "legalPage" && _id in ["legal-privacy", "drafts.legal-privacy"]`,
    },
    {
      route: '/en/privacy-policy',
      filter: `_type == "legalPage" && _id in ["legal-privacy-en", "drafts.legal-privacy-en"]`,
    },
    {
      route: '/servicios/:slug',
      filter: `_type == "service" && slug.current == $slug && coalesce(locale, "es") == "es"`,
    },
    {
      route: '/en/services/:slug',
      filter: `_type == "service" && slug.current == $slug && locale == "en"`,
    },
    {
      route: '/industrias/:slug',
      filter: `_type == "industry" && slug.current == $slug && coalesce(locale, "es") == "es"`,
    },
    {
      route: '/en/industries/:slug',
      filter: `_type == "industry" && slug.current == $slug && locale == "en"`,
    },
    {
      route: '/en/industries',
      filter: `_type == "industriesIndex" && _id in ["industriesIndex-en", "drafts.industriesIndex-en"]`,
    },
    {
      route: '/portafolio/:slug',
      filter: `_type == "caseStudy" && slug.current == $slug && coalesce(locale, "es") == "es"`,
    },
    {
      route: '/en/success-stories/:slug',
      filter: `_type == "caseStudy" && slug.current == $slug && locale == "en"`,
    },
    {
      route: '/blog/:slug',
      filter: `_type == "post" && slug.current == $slug && coalesce(locale, "es") == "es"`,
    },
    {
      route: '/en/blogs/:slug',
      filter: `_type == "post" && slug.current == $slug && locale == "en"`,
    },
    {
      route: '/en/:slug',
      filter: `_type == "aboutPage" && _id in ["aboutPage-en", "drafts.aboutPage-en"] && coalesce(slug.current, "${DEFAULT_ABOUT_EN_SLUG}") == $slug`,
    },
    {
      route: '/:slug',
      filter: `_type == "landingPage" && slug.current == $slug && coalesce(locale, "es") == "es"`,
    },
  ]),
  locations: {
    homePage: defineLocations({
      select: { id: '_id' },
      resolve: (doc) => {
        const english = englishId(doc?.id);
        return {
          locations: [{ title: english ? 'Home' : 'Inicio', href: english ? '/en' : '/' }],
        };
      },
    }),
    aboutPage: defineLocations({
      select: { id: '_id', locale: 'locale', slug: 'slug.current' },
      resolve: (doc) => {
        const english = doc?.locale === 'en' || englishId(doc?.id);
        return {
          locations: [
            { title: english ? 'About' : 'Nosotros', href: aboutPath(english ? 'en' : 'es', doc?.slug) },
          ],
        };
      },
    }),
    contactPage: defineLocations({
      select: { title: 'title' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Contacto', href: '/contacto' }],
      }),
    }),
    portalPage: defineLocations({
      select: { title: 'title', locale: 'locale', id: '_id' },
      resolve: (doc) => {
        const english = doc?.locale === 'en' || englishId(doc?.id);
        return {
          locations: [{ title: doc?.title || 'Portal', href: english ? '/en/portal' : '/portal' }],
        };
      },
    }),
    calendarPage: defineLocations({
      select: { title: 'title', locale: 'locale', id: '_id' },
      resolve: (doc) => {
        const english = doc?.locale === 'en' || englishId(doc?.id);
        return {
          locations: [{ title: doc?.title || 'Calendario', href: english ? '/en/calendar' : '/calendario' }],
        };
      },
    }),
    sitePage: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Página', href: doc?.slug ? `/${doc.slug}` : '/' }],
      }),
    }),
    service: defineLocations({
      select: { title: 'nombre', slug: 'slug.current', locale: 'locale' },
      resolve: (doc) => {
        const base = prefix(doc?.locale);
        const href = doc?.slug ? `${base}/servicios/${doc.slug}` : `${base}/servicios`;
        return {
          locations: [
            { title: doc?.title || 'Servicio', href },
            { title: 'Inicio', href: base || '/' },
          ],
        };
      },
    }),
    industry: defineLocations({
      select: { title: 'nombre', slug: 'slug.current', locale: 'locale' },
      resolve: (doc) => {
        const base = prefix(doc?.locale);
        const href = doc?.slug ? `${base}/industrias/${doc.slug}` : `${base}/industrias`;
        return {
          locations: [
            { title: doc?.title || 'Industria', href },
            { title: 'Inicio', href: base || '/' },
          ],
        };
      },
    }),
    industriesIndex: defineLocations({
      select: { title: 'title' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Industrias', href: '/en/industries' },
          { title: 'Home', href: '/en' },
        ],
      }),
    }),
    caseStudy: defineLocations({
      select: { title: 'cliente', slug: 'slug.current', locale: 'locale' },
      resolve: (doc) => {
        const index = doc?.locale === 'en' ? '/en/success-stories' : '/portafolio';
        return {
          locations: [
            { title: doc?.title || 'Caso', href: doc?.slug ? `${index}/${doc.slug}` : index },
            { title: doc?.locale === 'en' ? 'Success Stories' : 'Portafolio', href: index },
            { title: doc?.locale === 'en' ? 'Home' : 'Inicio', href: doc?.locale === 'en' ? '/en' : '/' },
          ],
        };
      },
    }),
    post: defineLocations({
      select: { title: 'title', slug: 'slug.current', locale: 'locale' },
      resolve: (doc) => {
        const english = doc?.locale === 'en';
        const href = doc?.slug
          ? english
            ? `/en/blogs/${doc.slug}`
            : `/blog/${doc.slug}`
          : english
            ? '/en/blogs'
            : '/blog';
        return {
          locations: [
            { title: doc?.title || 'Artículo', href },
            { title: english ? 'Blog' : 'Blog', href: english ? '/en/blogs' : '/blog' },
            { title: 'Inicio', href: english ? '/en' : '/' },
          ],
        };
      },
    }),
    landingPage: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Página', href: doc?.slug ? `/${doc.slug}` : '/' },
          { title: 'Inicio', href: '/' },
        ],
      }),
    }),
    siteSettings: defineLocations({
      select: { title: 'siteTitle' },
      resolve: () => ({
        message: 'Esta configuración se usa en todas las páginas.',
        tone: 'caution',
        locations: [
          { title: 'Inicio', href: '/' },
          { title: 'Nosotros', href: '/nosotros' },
          { title: 'Contacto', href: '/contacto' },
        ],
      }),
    }),
    footer: defineLocations({
      select: { locale: 'locale' },
      resolve: (doc) => ({
        message: 'El footer se usa en todas las páginas de este idioma.',
        tone: 'caution',
        locations:
          doc?.locale === 'en'
            ? [
                { title: 'Home', href: '/en' },
                { title: 'Blog', href: '/en/blogs' },
              ]
            : [
                { title: 'Inicio', href: '/' },
                { title: 'Nosotros', href: '/nosotros' },
                { title: 'Contacto', href: '/contacto' },
              ],
      }),
    }),
    navigation: defineLocations({
      select: { locale: 'locale' },
      resolve: (doc) => ({
        message: 'La navbar se usa en todas las páginas de este idioma.',
        tone: 'caution',
        locations:
          doc?.locale === 'en'
            ? [
                { title: 'Home', href: '/en' },
                { title: 'Blog', href: '/en/blogs' },
              ]
            : [
                { title: 'Inicio', href: '/' },
                { title: 'Nosotros', href: '/nosotros' },
                { title: 'Contacto', href: '/contacto' },
              ],
      }),
    }),
    person: defineLocations({
      select: { title: 'name' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Equipo', href: '/nosotros' },
          { title: 'Inicio', href: '/' },
        ],
      }),
    }),
    faq: defineLocations({
      select: { title: 'question' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'FAQ', href: '/' }],
      }),
    }),
  },
};
