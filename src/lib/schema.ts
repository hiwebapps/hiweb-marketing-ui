import { SITE } from '../data/site';
import { faqAnswerText } from './content/faq-answer';
import type { FaqAnswer } from './content/types';
import type { SiteIdentity } from './site-identity';

export function organizationSchema(site: SiteIdentity) {
  const logoUrl = new URL('/images/hiweb-logo.png', SITE.url).href;
  return {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': `${SITE.url}/#organization`,
    name: site.legalName || 'Hiweb Marketing',
    legalName: site.legalName || 'Hiweb Marketing',
    url: SITE.url,
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE.url}/#logo`,
      url: logoUrl,
      caption: site.legalName || 'Hiweb Marketing',
    },
    image: logoUrl,
    description:
      site.tagline ||
      'Partner estratégico de marketing digital, SEO, AEO, GEO, pauta publicitaria y desarrollo web.',
    email: site.email,
    telephone: site.phone,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mérida',
      addressRegion: 'Yucatán',
      addressCountry: 'MX',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 20.96737,
      longitude: -89.592586,
    },
    areaServed: [
      { '@type': 'Country', name: 'México' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'Canada' },
      ...site.locales.map((name) => ({ '@type': 'City', name })),
    ],
    founder: {
      '@type': 'Person',
      name: 'David Gallegos',
      jobTitle: 'Founder & Head of Strategy',
      url: 'https://www.linkedin.com/in/davidgpalma/',
      sameAs: ['https://www.linkedin.com/in/davidgpalma/'],
    },
    sameAs: [
      'https://www.linkedin.com/company/hiweb-marketing/home/',
      'https://www.instagram.com/hiweb.mx/',
      'https://www.facebook.com/HiwebMKT/',
      'https://www.tiktok.com/@hiwebmx',
    ],
    knowsAbout: [
      'Marketing Digital',
      'SEO (Search Engine Optimization)',
      'AEO (Answer Engine Optimization)',
      'GEO (Generative Engine Optimization)',
      'Google Ads',
      'Meta Ads',
      'Gestión de Redes Sociales',
      'Diseño y Desarrollo Web',
      'CRM HubSpot & Automatización',
      'Inbound Marketing',
      'Branding e Identidad Visual',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: site.phone,
      contactType: 'sales',
      areaServed: ['MX', 'US', 'CA'],
      availableLanguage: ['Spanish', 'English'],
    },
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: 'Hiweb Marketing',
    publisher: { '@id': `${SITE.url}/#organization` },
    inLanguage: ['es', 'en'],
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.href, SITE.url).href,
    })),
  };
}

export function faqSchema(items: { question: string; answer: FaqAnswer }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: faqAnswerText(item.answer) },
    })),
  };
}

export function serviceSchema(input: {
  name: string;
  description: string;
  href: string;
  serviceType?: string;
}) {
  const serviceUrl = new URL(input.href, SITE.url).href;
  return {
    '@type': 'Service',
    '@id': `${serviceUrl}#service`,
    name: input.name,
    serviceType: input.serviceType || input.name,
    description: input.description,
    url: serviceUrl,
    provider: { '@id': `${SITE.url}/#organization` },
    areaServed: [
      { '@type': 'Country', name: 'México' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'Canada' },
    ],
    termsOfService: `${SITE.url}/terminos`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'MXN',
      price: '4500',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '4500',
        priceCurrency: 'MXN',
        unitText: 'MONTH',
      },
    },
  };
}

export function caseStudySchema(input: {
  title: string;
  clientName: string;
  description: string;
  href: string;
  cover?: string;
}) {
  const caseUrl = new URL(input.href, SITE.url).href;
  return {
    '@type': 'CreativeWork',
    '@id': `${caseUrl}#casestudy`,
    headline: input.title,
    description: input.description,
    url: caseUrl,
    author: { '@id': `${SITE.url}/#organization` },
    publisher: { '@id': `${SITE.url}/#organization` },
    about: {
      '@type': 'Organization',
      name: input.clientName,
    },
    genre: 'Case Study',
    image: input.cover ? (input.cover.startsWith('http') ? input.cover : new URL(input.cover, SITE.url).href) : undefined,
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  href: string;
  author: string;
  authorProfile?: {
    role?: string;
    company?: string;
    linkedin?: string;
    photo?: string;
  };
  date: Date;
  dateModified?: Date;
  image?: string;
  publisher?: string;
}) {
  const articleUrl = new URL(input.href, SITE.url).href;
  const person: Record<string, unknown> = {
    '@type': 'Person',
    name: input.author,
  };
  if (input.authorProfile?.role) person.jobTitle = input.authorProfile.role;
  if (input.authorProfile?.company) {
    person.worksFor = { '@type': 'Organization', name: input.authorProfile.company };
  }
  if (input.authorProfile?.linkedin) {
    person.url = input.authorProfile.linkedin;
    person.sameAs = [input.authorProfile.linkedin];
  }
  if (input.authorProfile?.photo) person.image = input.authorProfile.photo;

  const imageUrl = input.image
    ? (input.image.startsWith('http') ? input.image : new URL(input.image, SITE.url).href)
    : new URL('/images/hiweb-logo.png', SITE.url).href;

  return {
    '@type': 'BlogPosting',
    '@id': `${articleUrl}#article`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    headline: input.title,
    description: input.description,
    url: articleUrl,
    image: imageUrl,
    datePublished: input.date.toISOString(),
    dateModified: (input.dateModified || input.date).toISOString(),
    author: person,
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE.url}/#organization`,
      name: input.publisher || SITE.legalName,
      logo: {
        '@type': 'ImageObject',
        url: new URL('/images/hiweb-logo.png', SITE.url).href,
      },
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.blog-post__title', '.blog-post__lead', 'h1', 'h2'],
    },
  };
}

export function industrySchema(input: {
  name: string;
  description: string;
  href: string;
  industryName: string;
}) {
  const industryUrl = new URL(input.href, SITE.url).href;
  return {
    '@type': 'WebPage',
    '@id': `${industryUrl}#webpage`,
    name: input.name,
    description: input.description,
    url: industryUrl,
    specialty: input.industryName,
    audience: {
      '@type': 'BusinessAudience',
      audienceType: input.industryName,
    },
    about: { '@id': `${SITE.url}/#organization` },
  };
}

export function aboutPageSchema(site: SiteIdentity) {
  return {
    '@type': 'AboutPage',
    '@id': `${SITE.url}/nosotros#webpage`,
    name: `Nosotros — ${site.legalName || 'Hiweb Marketing'}`,
    description: site.tagline,
    url: `${SITE.url}/nosotros`,
    mainEntity: { '@id': `${SITE.url}/#organization` },
  };
}
