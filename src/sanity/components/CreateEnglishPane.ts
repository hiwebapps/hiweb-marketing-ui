import { useEffect, useState } from 'react';
import { createElement } from 'react';
import { useClient } from 'sanity';
import { Button, Flex, Spinner, Text } from '@sanity/ui';
import { ensureServiceOrIndustryEnglish } from '../englishDraft';

type Options = {
  schemaType?: unknown;
  esId?: unknown;
};

function readOptions(
  options: Record<string, unknown> | undefined,
): { schemaType: 'service' | 'industry'; esId: string } | null {
  const value = (options ?? {}) as Options;
  const schemaType = value.schemaType === 'service' || value.schemaType === 'industry' ? value.schemaType : null;
  const esId = typeof value.esId === 'string' && value.esId.trim() ? value.esId : '';
  return schemaType && esId ? { schemaType, esId } : null;
}

/** Structure pane that creates the missing English draft and then lets the folder open it. */
export function CreateEnglishPane(props: { options?: Record<string, unknown> }) {
  const client = useClient({ apiVersion: '2026-09-18' });
  const target = readOptions(props.options);
  const schemaType = target?.schemaType;
  const esId = target?.esId ?? '';
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!schemaType || !esId) return;
    let active = true;
    setError('');
    ensureServiceOrIndustryEnglish(client, schemaType, esId).catch((err: unknown) => {
      if (!active) return;
      setError(err instanceof Error ? err.message : 'No se pudo crear la versión en inglés.');
    });
    return () => {
      active = false;
    };
  }, [attempt, client, esId, schemaType]);

  if (!target) {
    return createElement(
      Flex,
      { padding: 4 },
      createElement(Text, { size: 1 }, 'Esta página no tiene documento en español para copiar.'),
    );
  }

  if (error) {
    return createElement(
      Flex,
      { direction: 'column', gap: 3, padding: 4 },
      createElement(Text, { size: 1 }, 'No se pudo crear la versión en inglés.'),
      createElement(Text, { muted: true, size: 1 }, error),
      createElement(Button, { text: 'Reintentar', onClick: () => setAttempt((value) => value + 1) }),
    );
  }

  return createElement(
    Flex,
    { align: 'center', gap: 3, padding: 4 },
    createElement(Spinner, { muted: true }),
    createElement(Text, { size: 1 }, 'Creando la versión en inglés…'),
  );
}
