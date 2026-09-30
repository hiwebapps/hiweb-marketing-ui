import { SITE } from '../data/site';
import type { SiteIdentity } from './site-identity';

export function organizationSchema(site: SiteIdentity) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.legalName,
    url: SITE.url,
    email: site.email,
    telephone: site.phone,
    areaServed: site.locales.map((name) => ({ '@type': 'City', name })),
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.href, SITE.url).href,
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
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
  };
  date: Date;
  publisher?: string;
}) {
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

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    url: new URL(input.href, SITE.url).href,
    datePublished: input.date.toISOString(),
    author: person,
    publisher: { '@type': 'Organization', name: input.publisher || SITE.legalName },
  };
}
