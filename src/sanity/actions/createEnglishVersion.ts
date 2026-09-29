import { SplitVerticalIcon } from '@sanity/icons/SplitVertical';
import { TranslateIcon } from '@sanity/icons/Translate';
import { useEffect, useState } from 'react';
import { type DocumentActionComponent, useClient, useWorkspace } from 'sanity';
import { useRouter } from 'sanity/router';
import { useToast } from '@sanity/ui/toast';
import { createEnglishDraft, findPair, splitPath } from '../blog/posts';

export const createEnglishVersion: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: '2026-09-18' });
  const { basePath } = useWorkspace();
  const router = useRouter();
  const toast = useToast();
  const doc = (props.draft ?? props.published) as Record<string, unknown> | null;
  const english = doc?.locale === 'en';
  const slug = (doc?.slug as { current?: string } | undefined)?.current;
  const esSlug = typeof doc?.esSlug === 'string' ? doc.esSlug : undefined;
  const [pairId, setPairId] = useState<string | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPairId(undefined);
    findPair(client, { _id: props.id, locale: english ? 'en' : 'es', slug, esSlug })
      .then((pair) => {
        if (!cancelled) setPairId(pair?.id ?? null);
      })
      .catch(() => {
        if (!cancelled) setPairId(null);
      });
    return () => {
      cancelled = true;
    };
  }, [client, props.id, english, slug, esSlug]);

  if (!doc) return null;

  if (pairId) {
    const esId = english ? pairId : props.id;
    const enId = english ? props.id : pairId;
    return {
      label: english ? 'Abrir con español' : 'Abrir traducción',
      icon: SplitVerticalIcon,
      onHandle: () => {
        router.navigateUrl({ path: splitPath(basePath, esId, enId) });
        props.onComplete();
      },
    };
  }

  if (english) return null;

  return {
    label: busy ? 'Creando…' : 'Crear versión en inglés',
    icon: TranslateIcon,
    disabled: busy || pairId === undefined || !slug,
    title: slug ? undefined : 'Primero define el slug en español.',
    onHandle: () => {
      setBusy(true);
      createEnglishDraft(client, props.id)
        .then((enId) => {
          toast.push({ status: 'success', title: 'Versión en inglés creada como borrador' });
          router.navigateUrl({ path: splitPath(basePath, props.id, enId) });
        })
        .catch((err: unknown) => {
          toast.push({
            status: 'error',
            title: 'No se pudo crear la versión en inglés',
            description: err instanceof Error ? err.message : undefined,
          });
        })
        .finally(() => {
          setBusy(false);
          props.onComplete();
        });
    },
  };
};
