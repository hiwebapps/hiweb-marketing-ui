import { useEffect } from 'react';
import { type DocumentActionComponent, useClient } from 'sanity';
import { useToast } from '@sanity/ui/toast';
import { ensureServiceOrIndustryEnglish } from '../englishDraft';

const PLACEHOLDER_NAMES = new Set(['', 'Nueva industria', 'New industry', 'Nuevo servicio', 'New service']);

type PairDoc = {
  _id: string;
  nombre?: string;
  cliente?: string;
  slug?: string;
  sections?: number;
};

function publishedId(id: string) {
  return id.replace(/^drafts\./, '');
}

function slugOf(doc: Record<string, unknown> | null) {
  const slug = doc?.slug as { current?: string } | undefined;
  return typeof slug?.current === 'string' ? slug.current.trim() : '';
}

function spanishName(doc: Record<string, unknown> | null, fallback: string) {
  return typeof doc?.nombre === 'string' && doc.nombre.trim() ? doc.nombre.trim() : fallback;
}

export const ensureEnglishPair: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: '2026-09-18' });
  const toast = useToast();
  const doc = (props.draft ?? props.published) as Record<string, unknown> | null;
  const baseId = publishedId(props.id);
  const nombre = spanishName(doc, '');
  const cliente = typeof doc?.cliente === 'string' ? doc.cliente.trim() : '';
  const title = typeof doc?.title === 'string' ? doc.title.trim() : '';
  const personName = typeof doc?.name === 'string' ? doc.name.trim() : '';
  const clientName = typeof doc?.client === 'string' ? doc.client.trim() : '';
  const slug = slugOf(doc);
  const locale = typeof doc?.locale === 'string' ? doc.locale : '';
  const hasDoc = Boolean(doc);

  useEffect(() => {
    const schemaType = props.type;
    const paired =
      schemaType === 'service' ||
      schemaType === 'industry' ||
      schemaType === 'caseStudy' ||
      schemaType === 'landingPage' ||
      schemaType === 'testimonial' ||
      schemaType === 'person' ||
      schemaType === 'contactPage' ||
      schemaType === 'calendarPage' ||
      schemaType === 'legalPage';
    if (!hasDoc || !paired) return;
    if (baseId.endsWith('-en') || locale === 'en') return;
    const handle = window.setTimeout(() => {
      const enId = `${baseId}-en`;
      client
        .fetch<PairDoc | null>(
          `*[_id in [$id, "drafts." + $id]][0]{ _id, nombre, cliente, "slug": slug.current, "sections": count(sections) }`,
          { id: enId },
        )
        .then(async (existing) => {
          const copyType =
            schemaType === 'caseStudy' ||
            schemaType === 'landingPage' ||
            schemaType === 'testimonial' ||
            schemaType === 'person' ||
            schemaType === 'contactPage' ||
            schemaType === 'calendarPage' ||
            schemaType === 'legalPage';
          if (!existing && copyType) {
            const ready =
              schemaType === 'contactPage' ||
              schemaType === 'calendarPage' ||
              (schemaType === 'caseStudy' && Boolean(slug || cliente)) ||
              (schemaType === 'landingPage' && Boolean(slug || title)) ||
              (schemaType === 'testimonial' && Boolean(clientName || personName)) ||
              (schemaType === 'person' && Boolean(personName)) ||
              (schemaType === 'legalPage' && Boolean(title));
            if (!ready) return;
            const source = await client.fetch<Record<string, unknown> | null>(
              `coalesce(*[_id == "drafts." + $id][0], *[_id == $id][0])`,
              { id: baseId },
            );
            if (!source) return;
            const rest = Object.fromEntries(
              Object.entries(source).filter(([key]) => !key.startsWith('_')),
            );
            await client.createIfNotExists({
              ...rest,
              _id: `drafts.${enId}`,
              _type: schemaType,
              locale: 'en',
              ...(slug ? { slug: { _type: 'slug', current: slug } } : {}),
            });
            return;
          }
          if (!existing && (schemaType === 'service' || schemaType === 'industry')) {
            await ensureServiceOrIndustryEnglish(client, schemaType, baseId);
            return;
          }
          if (!existing) return;
          const patch: Record<string, unknown> = {};
          if (!existing.slug && slug) patch.slug = { _type: 'slug', current: slug };
          if (PLACEHOLDER_NAMES.has(existing.nombre ?? '') && nombre && !PLACEHOLDER_NAMES.has(nombre)) {
            patch.nombre = nombre;
          }
          if (Object.keys(patch).length === 0) return;
          const target = existing._id.startsWith('drafts.') ? existing._id : `drafts.${publishedId(existing._id)}`;
          await client.patch(target).set(patch).commit();
        })
        .catch((error: unknown) => {
          toast.push({
            status: 'error',
            title: 'No se pudo crear la versión en inglés',
            description: error instanceof Error ? error.message : undefined,
          });
        })
    }, 400);

    return () => window.clearTimeout(handle);
  }, [baseId, client, clientName, cliente, hasDoc, locale, nombre, personName, props.type, slug, title, toast]);

  return null;
};
