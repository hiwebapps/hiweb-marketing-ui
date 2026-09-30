import { createElement } from 'react';
import { useFormValue, type StringInputProps } from 'sanity';
import { Badge, Card, Flex, Text } from '@sanity/ui';
import {
  pagePath,
  PUBLIC_ORIGIN,
  publishedDescription,
  publishedTitle,
  type PageMetaDoc,
} from '../../lib/page-meta';

function asDoc(value: unknown): PageMetaDoc {
  if (!value || typeof value !== 'object') return {};
  return value as PageMetaDoc;
}

/** Google result preview above the SEO title field, plus the 60/70 character count. */
export function serpTitleInput(props: StringInputProps) {
  const raw = asDoc(useFormValue([]));
  const type = raw._type ?? '';
  const path = pagePath(type, raw._id ?? '', raw);
  const title = publishedTitle(type, raw);
  const description = publishedDescription(type, raw);
  const fallback = !raw.metaTitle?.trim();
  const length = typeof props.value === 'string' ? props.value.length : 0;
  const tone = length > 70 ? 'critical' : length > 60 ? 'caution' : 'default';
  const url = `${PUBLIC_ORIGIN.replace(/\/$/, '')}${path}`;

  return createElement(
    Flex,
    { direction: 'column', gap: 3 },
    createElement(
      Card,
      { padding: 3, radius: 2, border: true, tone: 'transparent' },
      createElement(
        Flex,
        { direction: 'column', gap: 2 },
        createElement(Text, { size: 0, muted: true }, 'Así se vería en Google'),
        createElement(Text, { size: 1, style: { color: '#1a0dab' } }, title || 'Sin título'),
        createElement(Text, { size: 0, style: { color: '#006621' } }, url),
        createElement(Text, { size: 1, muted: true }, description || 'Sin descripción'),
        fallback ? createElement(Text, { size: 0, muted: true }, 'El título SEO está vacío: se muestra el fallback del sitio.') : null,
      ),
    ),
    props.renderDefault(props),
    createElement(
      Flex,
      { justify: 'flex-end' },
      createElement(Badge, { tone, fontSize: 0 }, `${length} / 60`),
    ),
  );
}
