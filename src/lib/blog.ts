/** Shared blog helpers — cover URLs + heading extraction for TOC. */

export function postCoverUrl(id: string, width = 1200, height = 720) {
  return `https://picsum.photos/seed/${encodeURIComponent(id)}/${width}/${height}`;
}

export function slugifyHeading(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export type PostHeading = {
  depth: 2 | 3;
  text: string;
  id: string;
};

/** Pull ## / ### headings from raw markdown body for the TOC. */
export function extractPostHeadings(body: string): PostHeading[] {
  const headings: PostHeading[] = [];
  const used = new Map<string, number>();

  for (const rawLine of body.split('\n')) {
    const line = rawLine.trim();
    const match = /^(#{2,3})\s+(.+)$/.exec(line);
    if (!match) continue;

    const depth = match[1].length as 2 | 3;
    const text = match[2]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_`~]/g, '')
      .trim();
    if (!text) continue;

    let id = slugifyHeading(text) || 'seccion';
    const count = used.get(id) ?? 0;
    used.set(id, count + 1);
    if (count > 0) id = `${id}-${count + 1}`;

    headings.push({ depth, text, id });
  }

  return headings;
}
