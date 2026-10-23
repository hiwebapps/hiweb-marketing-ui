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

/** Markdown pasted into Studio: `[label](url)` links and backslash escapes such as `\$`. */
const MARKDOWN_LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const MARKDOWN_ESCAPE = /\\([\\`*_{}[\]()#+\-.!$])/g;

function unescapeMarkdown(text: string) {
  return text.replace(MARKDOWN_ESCAPE, '$1');
}

function spanText(span: FaqTextSpan) {
  return typeof span.text === 'string' ? unescapeMarkdown(span.text) : '';
}

/** Plain text for JSON-LD: Markdown links keep only their label. */
export function faqAnswerText(answer: FaqAnswer | undefined): string {
  if (!answer) return '';
  if (typeof answer === 'string') return unescapeMarkdown(answer.replace(MARKDOWN_LINK, '$1'));
  if (!Array.isArray(answer)) return '';
  return answer
    .map((block) => (block.children ?? []).map(spanText).join('').replace(MARKDOWN_LINK, '$1'))
    .filter(Boolean)
    .join('\n');
}

function linkNode(label: ReactNode, href: string, key: string) {
  const external = href.startsWith('http://') || href.startsWith('https://');
  return createElement('a', { key, href, ...(external ? { target: '_blank', rel: 'noreferrer' } : {}) }, label);
}

/** Splits a plain span on Markdown links so they render as real anchors. */
function withMarkdownLinks(text: string, key: string): ReactNode {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(MARKDOWN_LINK)) {
    const start = match.index ?? 0;
    const href = safeHref(match[2]);
    parts.push(text.slice(last, start));
    parts.push(href ? linkNode(match[1], href, `${key}-md-${start}`) : match[1]);
    last = start + match[0].length;
  }
  if (parts.length === 0) return text;
  parts.push(text.slice(last));
  return parts;
}

function renderSpan(span: FaqTextSpan, block: FaqTextBlock, index: number): ReactNode {
  const marks = span.marks ?? [];
  const hasLinkMark = marks.some((mark) => mark !== 'strong' && mark !== 'em');
  let node: ReactNode = hasLinkMark ? spanText(span) : withMarkdownLinks(spanText(span), String(span._key ?? index));
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
    node = linkNode(node, href, `${span._key ?? index}-${mark}`);
  });
  return createElement('span', { key: span._key ?? index }, node);
}

export function renderFaqAnswer(answer: FaqAnswer): ReactNode {
  if (typeof answer === 'string') {
    return answer ? withMarkdownLinks(unescapeMarkdown(answer), 'answer') : null;
  }
  if (!Array.isArray(answer)) return null;
  return answer.map((block, index) =>
    createElement(
      'p',
      { key: block._key ?? index },
      (block.children ?? []).map((span, spanIndex) => renderSpan(span, block, spanIndex)),
    ),
  );
}
