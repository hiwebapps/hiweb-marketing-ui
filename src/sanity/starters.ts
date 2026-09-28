type Locale = 'es' | 'en';

const copy = {
  es: {
    nombre: 'Nuevo servicio',
    heroTitle: 'Nuevo servicio',
    heroCta: 'Cotiza tu proyecto',
    overviewEyebrow: 'El servicio',
    ctaBadge: 'Siguiente paso',
    industryName: 'Nueva industria',
    industryHero: 'Nueva industria',
    industryCta: 'Ver casos de éxito',
    whyEyebrow: 'Por qué Hiweb',
    whyTitle: 'Por qué Hiweb',
    servicesTitle: 'Nueve servicios',
    servicesDescription: 'Elige la palanca. El diagnóstico define el orden.',
    servicesCta: 'Ver más',
    servicesTag: 'Servicio',
    casesEyebrow: 'Casos',
    casesTitle: 'Casos',
    casesDescription: 'Resultados de empresas consolidadas en este sector.',
    casesEmpty: 'Estamos documentando más casos de este sector. El diagnóstico sigue abierto.',
    faqTitle: 'Preguntas',
    closingTitle: 'Agenda un diagnóstico',
  },
  en: {
    nombre: 'New service',
    heroTitle: 'New service',
    heroCta: 'Get a quote',
    overviewEyebrow: 'The service',
    ctaBadge: 'Next step',
    industryName: 'New industry',
    industryHero: 'New industry',
    industryCta: 'See success stories',
    whyEyebrow: 'Why Hiweb',
    whyTitle: 'Why Hiweb',
    servicesTitle: 'Nine services',
    servicesDescription: 'Pick the lever. The diagnosis sets the order.',
    servicesCta: 'See more',
    servicesTag: 'Service',
    casesEyebrow: 'Cases',
    casesTitle: 'Cases',
    casesDescription: 'Results from established companies in this sector.',
    casesEmpty: 'We are documenting more cases in this sector. The diagnosis is still open.',
    faqTitle: 'Questions',
    closingTitle: 'Schedule a diagnosis',
  },
} as const;

function section(type: string, fields: Record<string, unknown> = {}) {
  return { _type: type, _key: type, ...fields };
}

/** The same section order every service page already uses. */
export function serviceStarter(locale: Locale) {
  const text = copy[locale];
  return {
    locale,
    nombre: text.nombre,
    orden: 0,
    tagline: '',
    sections: [
      section('serviceHero', { title: text.heroTitle, ctaLabel: text.heroCta, ctaHref: '/contacto' }),
      section('serviceOverview', { eyebrow: text.overviewEyebrow, cards: [] }),
      section('serviceFocus', { items: [] }),
      section('servicePitch', { ctaHref: '/contacto' }),
      section('serviceWhy', { cards: [] }),
      section('servicePlans', { plans: [] }),
      section('serviceIndustries', { items: [] }),
      section('serviceProcess', { steps: [] }),
      section('serviceCases', { items: [] }),
      section('serviceFaq', { columns: 2, items: [] }),
      section('serviceCta', { badge: text.ctaBadge }),
    ],
  };
}

/** Shared page labels the industry template already renders. */
export function industryStarter(locale: Locale) {
  const text = copy[locale];
  return {
    locale,
    nombre: text.industryName,
    orden: 0,
    tagline: '',
    sections: [
      section('industryHero', {
        badge: text.industryName,
        title: text.industryHero,
        ctaLabel: text.industryCta,
        ctaHref: '#casos',
      }),
      section('industryWhy', {
        eyebrow: text.whyEyebrow,
        title: text.whyTitle,
        pillars: [1, 2, 3].map((index) => ({
          _type: 'titledBlock',
          _key: `why-${index}`,
          title: locale === 'en' ? `Point ${index}` : `Punto ${index}`,
          description: locale === 'en' ? 'Replace this text.' : 'Reemplaza este texto.',
        })),
      }),
      section('industryServices', {
        eyebrow: 'Servicios',
        title: text.servicesTitle,
        description: text.servicesDescription,
        ctaLabel: text.servicesCta,
        tagLabel: text.servicesTag,
        catalogLabel: 'Ver todos los servicios',
        catalogHref: '/servicios',
        blurbs: [],
      }),
      section('industryCases', {
        eyebrow: text.casesEyebrow,
        title: text.casesTitle,
        description: text.casesDescription,
        emptyText: text.casesEmpty,
      }),
      section('industryFaq', { eyebrow: 'FAQ', title: text.faqTitle, items: [] }),
      section('industryCta', { title: text.closingTitle }),
    ],
  };
}
