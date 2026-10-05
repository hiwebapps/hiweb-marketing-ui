import type { ReactNode } from 'react';
import { createElement } from 'react';
import type { FaqAnswer, FaqTextBlock, FaqTextSpan } from './types';

function safeHref(href: string) {
  const value = href.trim();
  if (
    value.startsWith('/') ||
    value.startsWith('#') ||
    value.startsWith('mailto:') ||
    value.startsWith('tel:')
  ) {
    return value;
  }
  try {
    const url = new URL(value);
    if (url.protocol === 'http:' || url.protocol === 'https:') return value;
  } catch {
    return undefined;
  }
  return undefined;
}

function spanText(span: FaqTextSpan) {
  return typeof span.text === 'string' ? span.text : '';
}

export function faqAnswerText(answer: FaqAnswer | undefined): string {
  if (!answer) return '';
  if (typeof answer === 'string') return answer;
  if (!Array.isArray(answer)) return '';
  return answer
    .map((block) => (block.children ?? []).map(spanText).join(''))
    .filter(Boolean)
    .join('\n');
}

function renderSpan(span: FaqTextSpan, block: FaqTextBlock, index: number): ReactNode {
  const marks = span.marks ?? [];
  let node: ReactNode = spanText(span);
  marks.forEach((mark) => {
    if (mark === 'strong') {
      node = createElement('strong', { key: `${span._key ?? index}-strong` }, node);
      return;
    }
    if (mark === 'em') {
      node = createElement('em', { key: `${span._key ?? index}-em` }, node);
      return;
    }
    const definition = (block.markDefs ?? []).find((item) => item._key === mark && item._type === 'link');
    const href = definition?.href ? safeHref(definition.href) : undefined;
    if (!href) return;
    const external = href.startsWith('http://') || href.startsWith('https://');
    node = createElement(
      'a',
      {
        key: `${span._key ?? index}-${mark}`,
        href,
        ...(external ? { target: '_blank', rel: 'noreferrer' } : {}),
      },
      node,
    );
  });
  return createElement('span', { key: span._key ?? index }, node);
}

export function renderFaqAnswer(answer: FaqAnswer): ReactNode {
  if (typeof answer === 'string' || !Array.isArray(answer)) {
    return answer || null;
  }
  return answer.map((block, index) =>
    createElement(
      'p',
      { key: block._key ?? index },
      (block.children ?? []).map((span, spanIndex) => renderSpan(span, block, spanIndex)),
    ),
  );
}
