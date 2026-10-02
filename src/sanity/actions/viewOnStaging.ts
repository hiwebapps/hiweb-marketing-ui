import type { DocumentActionComponent, DocumentActionProps } from 'sanity';

const STAGING_ORIGIN = 'https://staging.hiweb.com.mx';

type SlugValue = { current?: string };

function publishedId(id: string) {
  return id.replace(/^drafts\./, '');
}

function slugOf(doc: Record<string, unknown> | null) {
  const slug = doc?.slug as SlugValue | string | undefined;
  if (typeof slug === 'string') return slug;
  return slug?.current ?? '';
}

function isEnglish(id: string, doc: Record<string, unknown> | null) {
  return doc?.locale === 'en' || publishedId(id).endsWith('-en');
}

export function stagingPath(type: string, id: string, doc: Record<string, unknown> | null) {
  const published = publishedId(id);
  const english = isEnglish(published, doc);
  const slug = slugOf(doc);

  if (type === 'homePage') return english ? '/en' : '/';
  if (type === 'aboutPage') return english ? '/en/nosotros' : '/nosotros';
  if (type === 'contactPage') return '/contacto';
  if (type === 'service' && slug) return english ? `/en/servicios/${slug}` : `/servicios/${slug}`;
  if (type === 'industry' && slug) return english ? `/en/industrias/${slug}` : `/industrias/${slug}`;
  if (type === 'caseStudy' && slug) return `/portafolio/${slug}`;
  if (type === 'post' && slug) return english ? `/en/blogs/${slug}` : `/blog/${slug}`;
  if (type === 'landingPage' && slug) return `/${slug}`;
  if (type === 'legalPage') {
    const terms = published === 'legal-terms' || published === 'legal-terms-en';
    const path = terms ? '/terminos' : '/aviso-de-privacidad';
    return english ? `/en${path}` : path;
  }
  return '';
}

export const viewOnStaging: DocumentActionComponent = (props: DocumentActionProps) => {
  const doc = (props.draft ?? props.published) as Record<string, unknown> | null;
  const path = stagingPath(props.type, props.id, doc);
  if (!path) return null;

  return {
    label: 'Ver en staging',
    onHandle: () => {
      window.open(`${STAGING_ORIGIN}${path}`, '_blank', 'noopener,noreferrer');
      props.onComplete();
    },
  };
};
