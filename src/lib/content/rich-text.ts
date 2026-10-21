type RichSpan = { _type?: string; _key?: string; text?: string; marks?: string[] };
type RichMarkDef = { _type?: string; _key?: string; href?: string };
type RichBlock = {
  _type?: string;
  _key?: string;
  style?: string;
  listItem?: string;
  level?: number;
  children?: RichSpan[];
  markDefs?: RichMarkDef[];
};

function wrapLines(text: string, open: string, close: string) {
  return text
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return line;
      const lead = line.slice(0, line.indexOf(trimmed));
      const trail = line.slice(line.indexOf(trimmed) + trimmed.length);
      return `${lead}${open}${trimmed}${close}${trail}`;
    })
    .join('\n');
}

function spanToMarkdown(span: RichSpan, markDefs: RichMarkDef[]) {
  let text = typeof span.text === 'string' ? span.text : '';
  if (!text) return '';
  const marks = span.marks ?? [];
  // FormattedText does not parse nested marks: a link wins over bold, and bold wins over italic.
  const link = markDefs.find((def) => def._type === 'link' && def._key && marks.includes(def._key));
  if (link?.href) return wrapLines(text, '[', `](${link.href})`);
  if (marks.includes('strong')) return wrapLines(text, '**', '**');
  if (marks.includes('em')) return wrapLines(text, '*', '*');
  return text;
}

/** Portable Text (or a legacy Markdown string) to the Markdown subset `FormattedText` renders. */
export function richTextToMarkdown(value: unknown): string {
  if (typeof value === 'string') return value;
  if (!Array.isArray(value)) return '';
  const blocks = (value as RichBlock[]).filter((block) => block?._type === 'block');
  let output = '';
  let previousList: string | undefined;
  let number = 0;
  for (const block of blocks) {
    const inline = (block.children ?? []).map((span) => spanToMarkdown(span, block.markDefs ?? [])).join('').trim();
    if (!inline) continue;
    const list = block.listItem === 'bullet' || block.listItem === 'number' ? block.listItem : undefined;
    number = list === 'number' && previousList === 'number' ? number + 1 : 1;
    const line = list === 'bullet' ? `- ${inline}` : list === 'number' ? `${number}. ${inline}` : inline;
    const separator = !output ? '' : list && list === previousList ? '\n' : '\n\n';
    output += separator + line;
    previousList = list;
  }
  return output;
}

let keyCounter = 0;
function key() {
  keyCounter += 1;
  return `${Date.now().toString(36)}${keyCounter.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function inlineToSpans(text: string) {
  const regex = /(\*\*[^*]+\*\*|__[^_]+__|(?<!\*)\*[^*]+?\*(?!\*)|(?<!_)_[^_]+?_(?!_)|\[[^\]]+\]\([^)]+\))/g;
  const children: RichSpan[] = [];
  const markDefs: RichMarkDef[] = [];
  const push = (content: string, marks: string[]) => {
    if (content) children.push({ _type: 'span', _key: key(), text: content, marks });
  };
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    push(text.slice(lastIndex, match.index), []);
    const token = match[0];
    if (token.startsWith('**') || token.startsWith('__')) {
      push(token.slice(2, -2), ['strong']);
    } else if (token.startsWith('[')) {
      const link = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (link) {
        const markKey = key();
        markDefs.push({ _type: 'link', _key: markKey, href: link[2] });
        push(link[1], [markKey]);
      } else {
        push(token, []);
      }
    } else {
      push(token.slice(1, -1), ['em']);
    }
    lastIndex = regex.lastIndex;
  }
  push(text.slice(lastIndex), []);
  if (!children.length) push(' ', []);
  return { children, markDefs };
}

/** Markdown (paragraphs, `- ` bullets, `1. ` lists, bold, italic, links) to Portable Text blocks. */
export function markdownToPortableText(markdown: string): RichBlock[] {
  const blocks: RichBlock[] = [];
  let paragraph: string[] = [];
  const flush = () => {
    if (!paragraph.length) return;
    blocks.push({ _type: 'block', _key: key(), style: 'normal', ...inlineToSpans(paragraph.join('\n')) });
    paragraph = [];
  };
  for (const raw of markdown.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      flush();
      blocks.push({
        _type: 'block',
        _key: key(),
        style: 'normal',
        listItem: bullet ? 'bullet' : 'number',
        level: 1,
        ...inlineToSpans((bullet ?? numbered)![1]),
      });
      continue;
    }
    paragraph.push(line);
  }
  flush();
  return blocks;
}
