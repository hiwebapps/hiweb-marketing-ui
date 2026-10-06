import { useEffect, useState } from 'react';
import { type DocumentBadgeComponent, useClient } from 'sanity';
import { slugifyHeading } from '../../lib/blog';
import { publishedId } from '../../lib/page-meta';
import { bodyText, findPair } from '../blog/posts';
import { PAIRED_TYPES } from '../seo/inventory';

const CHECKLIST_TYPES = new Set([
  'homePage',
  'aboutPage',
  'service',
  'industry',
  'caseStudy',
  'contactPage',
  'calendarPage',
  'landingPage',
  'post',
  'industriesIndex',
  'servicesIndex',
  'blogIndex',
  'casesIndex',
  'legalPage',
]);

function docOf(props: Parameters<DocumentBadgeComponent>[0]) {
  return (props.draft ?? props.published) as Record<string, unknown> | null;
}

function otherId(id: string) {
  const published = publishedId(id);
  return published.endsWith('-en') ? published.slice(0, -3) : `${published}-en`;
}

function useHasPair(props: Parameters<DocumentBadgeComponent>[0], type: string) {
  const client = useClient({ apiVersion: '2026-09-18' });
  const doc = docOf(props);
  const [has, setHas] = useState<boolean | null>(PAIRED_TYPES.has(type) ? null : true);
  const slug = (doc?.slug as { current?: string } | undefined)?.current;
  const esSlug = typeof doc?.esSlug === 'string' ? doc.esSlug : undefined;
  const english = doc?.locale === 'en' || publishedId(props.id).endsWith('-en');

  useEffect(() => {
    if (!PAIRED_TYPES.has(type)) {
      setHas(true);
      return;
    }
    let cancelled = false;
    const request =
      type === 'post'
        ? findPair(client, { _id: props.id, locale: english ? 'en' : 'es', slug, esSlug }).then((pair) => Boolean(pair))
        : client
            .withConfig({ perspective: 'raw' })
            .fetch<number>(`count(*[_id in [$id, "drafts." + $id]])`, { id: otherId(props.id) })
            .then((count) => count > 0);
    request
      .then((value) => {
        if (!cancelled) setHas(value);
      })
      .catch(() => {
        if (!cancelled) setHas(null);
      });
    return () => {
      cancelled = true;
    };
  }, [client, english, esSlug, props.id, slug, type]);

  return has;
}

export const seoChecklistBadge: DocumentBadgeComponent = (props) => {
  const doc = docOf(props);
  const type = String(doc?._type ?? '');
  const pair = useHasPair(props, type);
  if (!doc || !CHECKLIST_TYPES.has(type)) return null;

  const missing: string[] = [];
  if (!String(doc.metaTitle ?? '').trim()) missing.push('título');
  if (!String(doc.metaDescription ?? '').trim()) missing.push('descripción');
  const og = doc.ogImage as { asset?: unknown; alt?: string } | undefined;
  if (!og?.asset) missing.push('Open Graph');
  else if (!String(og.alt ?? '').trim()) missing.push('alt');
  if (pair === false) missing.push('pareja');
  if (missing.length === 0 && pair === null) return null;
  if (missing.length === 0) return { label: 'SEO listo', color: 'success' };
  return {
    label: `Falta ${missing.join(', ')}`,
    title: 'Checklist SEO: título, descripción, Open Graph, alt y pareja de idioma.',
    color: 'warning',
  };
};

export const keywordBadge: DocumentBadgeComponent = (props) => {
  const doc = docOf(props);
  if (!doc || doc._type !== 'post') return null;
  const keyword = typeof doc.keyword === 'string' ? doc.keyword.trim() : '';
  if (!keyword) return { label: 'Sin keyword', color: 'warning' };

  const needle = keyword.toLowerCase();
  const slugNeedle = slugifyHeading(keyword);
  const title = `${doc.title ?? ''} ${doc.metaTitle ?? ''}`.toLowerCase();
  const slug = ((doc.slug as { current?: string } | undefined)?.current ?? '').toLowerCase();
  const opening = bodyText(doc.body).split(/\s+/).slice(0, 100).join(' ').toLowerCase();
  const missing: string[] = [];
  if (!title.includes(needle)) missing.push('título');
  if (slugNeedle && !slug.includes(slugNeedle)) missing.push('slug');
  if (!opening.includes(needle)) missing.push('primeras 100 palabras');
  if (missing.length === 0) return { label: 'Keyword cubierta', color: 'success' };
  return {
    label: `Keyword fuera de ${missing.join(', ')}`,
    title: `“${keyword}” no aparece en: ${missing.join(', ')}.`,
    color: 'warning',
  };
};
