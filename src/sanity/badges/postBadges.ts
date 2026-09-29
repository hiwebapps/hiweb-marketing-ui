import { useEffect, useState } from 'react';
import { type DocumentBadgeComponent, useClient } from 'sanity';
import { bodyText, countWords, findPair, formatWords, STALE_MS } from '../blog/posts';

type Pair = { id: string; updatedAt: number } | null;

function updatedAt(props: Parameters<DocumentBadgeComponent>[0]) {
  return Math.max(
    props.draft?._updatedAt ? Date.parse(props.draft._updatedAt) : 0,
    props.published?._updatedAt ? Date.parse(props.published._updatedAt) : 0,
  );
}

export const translationBadge: DocumentBadgeComponent = (props) => {
  const client = useClient({ apiVersion: '2026-09-18' });
  const doc = (props.draft ?? props.published) as Record<string, unknown> | null;
  const english = doc?.locale === 'en';
  const slug = (doc?.slug as { current?: string } | undefined)?.current;
  const esSlug = typeof doc?.esSlug === 'string' ? doc.esSlug : undefined;
  const [pair, setPair] = useState<Pair | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    findPair(client, { _id: props.id, locale: english ? 'en' : 'es', slug, esSlug })
      .then((result) => {
        if (!cancelled) setPair(result);
      })
      .catch(() => {
        if (!cancelled) setPair(undefined);
      });
    return () => {
      cancelled = true;
    };
  }, [client, props.id, english, slug, esSlug, props.draft?._updatedAt, props.published?._updatedAt]);

  if (!doc || pair === undefined) return null;
  if (!pair) {
    return english
      ? { label: 'Falta ES', title: 'No hay versión en español emparejada.', color: 'danger' }
      : { label: 'Falta EN', title: 'Todavía no hay versión en inglés.', color: 'danger' };
  }
  const own = updatedAt(props);
  const esTime = english ? pair.updatedAt : own;
  const enTime = english ? own : pair.updatedAt;
  if (esTime - enTime > STALE_MS) {
    return {
      label: 'Revisar traducción',
      title: 'El español cambió después de la última edición en inglés.',
      color: 'warning',
    };
  }
  return { label: 'Traducción al día', color: 'success' };
};

export const wordsBadge: DocumentBadgeComponent = (props) => {
  const doc = (props.draft ?? props.published) as Record<string, unknown> | null;
  if (!doc) return null;
  const words = countWords(bodyText(doc.body));
  if (!words) return null;
  return { label: formatWords(words), title: 'Palabras del cuerpo y tiempo de lectura a 200 palabras por minuto.' };
};
