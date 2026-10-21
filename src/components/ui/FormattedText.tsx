import { type ReactNode, createElement, Fragment } from 'react';

export type FormattedTextProps = {
  children?: ReactNode;
  tone?: 'default' | 'on-ink';
  className?: string;
  paragraphClassName?: string;
  listClassName?: string;
  itemClassName?: string;
};

type InlineToken =
  | { type: 'text'; content: string }
  | { type: 'strong'; content: string }
  | { type: 'em'; content: string }
  | { type: 'link'; text: string; href: string };

type Block =
  | { type: 'p'; lines: string[] }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] };

function parseInlineTokens(text: string): InlineToken[] {
  const regex = /(\*\*[^*]+\*\*|__[^_]+__|(?<!\*)\*[^*]+?\*(?!\*)|(?<!_)_[^_]+?_(?!_)|\[[^\]]+\]\([^)]+\))/g;
  const parts: InlineToken[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    const token = match[0];
    if ((token.startsWith('**') && token.endsWith('**')) || (token.startsWith('__') && token.endsWith('__'))) {
      parts.push({ type: 'strong', content: token.slice(2, -2) });
    } else if ((token.startsWith('*') && token.endsWith('*')) || (token.startsWith('_') && token.endsWith('_'))) {
      parts.push({ type: 'em', content: token.slice(1, -1) });
    } else if (token.startsWith('[') && token.includes('](')) {
      const linkMatch = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        parts.push({ type: 'link', text: linkMatch[1], href: linkMatch[2] });
      } else {
        parts.push({ type: 'text', content: token });
      }
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }
  return parts;
}

function renderInline(text: string, tone: 'default' | 'on-ink'): ReactNode[] {
  const tokens = parseInlineTokens(text);
  const strongClass = tone === 'on-ink' ? 'font-semibold text-white' : 'font-semibold text-ink';
  const linkClass = tone === 'on-ink'
    ? 'text-[#bdff01] underline underline-offset-3 hover:text-white transition-colors'
    : 'text-primary underline underline-offset-3 hover:text-ink transition-colors';

  return tokens.map((token, idx) => {
    switch (token.type) {
      case 'strong':
        return createElement('strong', { key: idx, className: strongClass }, token.content);
      case 'em':
        return createElement('em', { key: idx, className: 'italic' }, token.content);
      case 'link': {
        const isExternal = token.href.startsWith('http://') || token.href.startsWith('https://');
        return createElement(
          'a',
          {
            key: idx,
            href: token.href,
            className: linkClass,
            ...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {}),
          },
          token.text,
        );
      }
      default:
        return token.content;
    }
  });
}

function parseBlocks(rawText: string): Block[] {
  const lines = rawText.split(/\r?\n/);
  const blocks: Block[] = [];
  let currentParagraph: string[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  function flushParagraph() {
    if (currentParagraph.length > 0) {
      blocks.push({ type: 'p', lines: currentParagraph });
      currentParagraph = [];
    }
  }

  function flushList() {
    if (currentList) {
      blocks.push(currentList);
      currentList = null;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      continue;
    }

    const bulletMatch = trimmed.match(/^[-*•]\s+(.*)$/);
    const numberMatch = trimmed.match(/^(\d+)[\.)]\s+(.*)$/);

    if (bulletMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(bulletMatch[1]);
    } else if (numberMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(numberMatch[2]);
    } else {
      flushList();
      currentParagraph.push(trimmed);
    }
  }

  flushParagraph();
  flushList();
  return blocks;
}

export function FormattedText({
  children,
  tone = 'default',
  className = '',
  paragraphClassName = '',
  listClassName = '',
  itemClassName = '',
}: FormattedTextProps) {
  if (children === null || children === undefined || children === '') {
    return null;
  }

  // If already a React element or component (not string)
  if (typeof children !== 'string') {
    // If it's an array of PortableText blocks from Sanity
    if (Array.isArray(children) && children.length > 0 && typeof children[0] === 'object' && children[0]?._type === 'block') {
      return (
        <div className={className}>
          {children.map((block: any, blockIdx: number) => {
            const blockChildren = block.children || [];
            const textContent = blockChildren.map((span: any) => span.text || '').join('');
            if (block.listItem === 'bullet') {
              return (
                <ul key={blockIdx} className={`list-disc pl-5 space-y-1.5 my-2.5 ${listClassName}`}>
                  <li className={`leading-relaxed ${itemClassName}`}>{renderInline(textContent, tone)}</li>
                </ul>
              );
            }
            if (block.listItem === 'number') {
              return (
                <ol key={blockIdx} className={`list-decimal pl-5 space-y-1.5 my-2.5 ${listClassName}`}>
                  <li className={`leading-relaxed ${itemClassName}`}>{renderInline(textContent, tone)}</li>
                </ol>
              );
            }
            return (
              <p key={blockIdx} className={`my-3 leading-relaxed first:mt-0 last:mb-0 ${paragraphClassName}`}>
                {renderInline(textContent, tone)}
              </p>
            );
          })}
        </div>
      );
    }
    return <div className={className}>{children}</div>;
  }

  const rawText = children.trim();
  const blocks = parseBlocks(rawText);

  if (blocks.length === 0) {
    return null;
  }

  // If it's just a single one-line paragraph with no inline formatting needed
  if (blocks.length === 1 && blocks[0].type === 'p' && blocks[0].lines.length === 1 && !rawText.includes('**') && !rawText.includes('*') && !rawText.includes('[')) {
    return (
      <p className={`${className} ${paragraphClassName}`.trim()}>
        {rawText}
      </p>
    );
  }

  return (
    <div className={`space-y-3.5 ${className}`.trim()}>
      {blocks.map((block, idx) => {
        if (block.type === 'ul') {
          return (
            <ul
              key={idx}
              className={`list-disc pl-5 space-y-2 my-3 marker:text-primary ${listClassName}`.trim()}
            >
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className={`leading-relaxed ${itemClassName}`.trim()}>
                  {renderInline(item, tone)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'ol') {
          return (
            <ol
              key={idx}
              className={`list-decimal pl-5 space-y-2 my-3 marker:font-semibold ${listClassName}`.trim()}
            >
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className={`leading-relaxed ${itemClassName}`.trim()}>
                  {renderInline(item, tone)}
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={idx} className={['leading-relaxed', paragraphClassName].filter(Boolean).join(' ')}>
            {block.lines.map((line, lineIdx) => (
              <Fragment key={lineIdx}>
                {lineIdx > 0 && <br />}
                {renderInline(line, tone)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
