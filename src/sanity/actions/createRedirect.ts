import { LaunchIcon } from '@sanity/icons/Launch';
import { useState } from 'react';
import { type DocumentActionComponent, useClient } from 'sanity';
import { useToast } from '@sanity/ui/toast';
import { pagePath } from '../../lib/page-meta';

const SLUG_TYPES = new Set(['post', 'service', 'industry', 'caseStudy', 'landingPage']);

function redirectId(from: string) {
  const slug = from
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `redirect-${slug || 'ruta'}`;
}

export const createRedirect: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: '2026-09-18' });
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  if (!SLUG_TYPES.has(props.type)) return null;

  const published = props.published as Record<string, unknown> | null;
  const draft = props.draft as Record<string, unknown> | null;
  if (!published || !draft) return null;

  const from = pagePath(props.type, props.id, {
    locale: typeof published.locale === 'string' ? published.locale : undefined,
    slug: published.slug as { current?: string } | undefined,
  });
  const to = pagePath(props.type, props.id, {
    locale: typeof draft.locale === 'string' ? draft.locale : undefined,
    slug: draft.slug as { current?: string } | undefined,
  });
  if (!from || !to || from === to) return null;

  return {
    label: busy ? 'Creando…' : 'Crear redirección',
    icon: LaunchIcon,
    title: `${from} → ${to}. Entra al sitio en el próximo deploy.`,
    disabled: busy,
    onHandle: () => {
      setBusy(true);
      client
        .createOrReplace({ _id: redirectId(from), _type: 'redirect', from, to })
        .then(() => {
          toast.push({
            status: 'success',
            title: `Redirección publicada: ${from} → ${to}`,
            description: 'Se aplica en el próximo deploy del sitio.',
          });
        })
        .catch((err: unknown) => {
          toast.push({
            status: 'error',
            title: 'No se pudo crear la redirección',
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
