export type PtBlock = Record<string, unknown>;

export type TableHit = {
  start: number;
  cols: number;
  rows: number;
  header: string[];
  emptyCorner: boolean;
};

function nid(prefix: string) {
  return `${prefix}${Math.random().toString(36).slice(2, 10)}`;
}

export function blockText(block: PtBlock | null | undefined): string {
  if (!block) return '';
  const children = Array.isArray(block.children) ? block.children : [];
  return children
    .map((child) =>
      typeof (child as { text?: string }).text === 'string' ? (child as { text: string }).text : '',
    )
    .join('')
    .replace(/\u200d/g, '')
    .trim();
}

function isHeading(block: PtBlock) {
  return block._type === 'block' && /^h[1-6]$/.test(String(block.style ?? ''));
}

export function isHeaderish(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (t.length > 52) return false;
  if (t.split(/\s+/).length > 8) return false;
  if (/^\$/.test(t)) return false;
  if (/^[✅❌✓☐]/.test(t)) return false;
  if (/[✓☐]/.test(t)) return false;
  if (t.includes(': ') && t.length > 28) return false;
  if (/\?/.test(t) && t.length > 16) return false;
  if (/[.]$/.test(t) && t.split(/\s+/).length >= 4) return false;
  return true;
}

function isProse(text: string): boolean {
  if (/contáctanos|escríbenos|en hiweb|conoce nuestro/i.test(text) && text.length > 70) {
    return true;
  }
  if (text.includes('?') && text.length > 70) return true;
  if (text.length > 130) return true;
  const words = text.split(/\s+/).filter(Boolean).length;
  return words >= 28;
}

function isCellish(block: PtBlock): boolean {
  if (block._type !== 'block') return false;
  if (block.listItem) return false;
  if (isHeading(block)) return false;
  const style = String(block.style ?? 'normal');
  if (style !== 'normal') return false;
  const text = blockText(block);
  if (!text) return false;
  if (text.length > 140) return false;
  return true;
}

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function scoreTable(rows: string[][]): number {
  if (rows.length < 3) return -100;
  const header = rows[0];
  const cols = header.length;
  if (cols < 2 || cols > 6) return -100;

  let score = 0;
  const filledHeader = header.filter((cell) => cell !== '');
  for (const cell of header) {
    if (cell === '' || isHeaderish(cell)) score += 4;
    else score -= 8;
    if (/^\$|\bMXN\b|\bUSD\b/.test(cell)) score -= 6;
    if (/[✅❌✓☐]/.test(cell)) score -= 10;
  }

  if (header[0] === '') score += filledHeader.length;
  const unique = new Set(filledHeader.map((c) => c.toLowerCase()));
  if (unique.size >= Math.max(2, filledHeader.length - 1)) score += 3;
  score += cols;

  const data = rows.slice(1);
  score += Math.min(data.length, 8) * 4;

  const firstCol = data.map((row) => row[0] ?? '');
  const firstMedian = median(firstCol.map((c) => c.length));
  if (firstMedian <= 36) score += 8;
  else if (firstMedian <= 56) score += 2;
  else score -= 6;

  const identicalFirst = firstCol.length > 1 && firstCol.every((cell) => cell === firstCol[0]);
  if (identicalFirst) score -= 20;
  const pricedFirst = firstCol.filter((cell) => /^\$/.test(cell)).length;
  if (pricedFirst > 0) score -= pricedFirst * 8;

  const headerishFirst = firstCol.filter(isHeaderish).length;
  if (headerishFirst >= Math.ceil(data.length * 0.6)) score += 4;

  const headerAvg = header.reduce((sum, cell) => sum + cell.length, 0) / cols;
  const firstDataAvg = rows[1].reduce((sum, cell) => sum + cell.length, 0) / cols;
  if (headerAvg + 6 <= firstDataAvg) score += 5;
  if (headerAvg > firstDataAvg + 4) score -= 5;

  if (cols >= 4 && data.length < 3) score -= 18;
  if (cols >= 5 && data.length < 4) score -= 10;
  if (header.some((cell) => /^\d+$/.test(cell))) score -= 16;
  if (header.some((cell) => cell.includes('?'))) score -= 14;
  if (header.some((cell) => /sí\s*no/i.test(cell) || /no lo conozco/i.test(cell))) score -= 30;
  if (cols === 2) {
    score -= 12;
    const questions = [...header, ...firstCol].filter((cell) => cell.includes('?')).length;
    if (questions > 0) score -= 20;
    if (data.length < 4) score -= 8;
    if (header.some((cell) => /[☐✓]/.test(cell) || /sí\s+no/i.test(cell))) score -= 30;
  }

  return score;
}

type Candidate = {
  start: number;
  end: number;
  cols: number;
  emptyCorner: boolean;
  score: number;
  header: string[];
};

function bestCandidate(blocks: PtBlock[], start: number, end: number): Candidate | null {
  while (end > start && isProse(blockText(blocks[end - 1]))) end -= 1;
  const slice = blocks.slice(start, end);
  const texts = slice.map(blockText);
  const n = texts.length;
  let best: Candidate | null = null;

  const consider = (cols: number, emptyCorner: boolean, cells: string[]) => {
    if (cells.length < cols * 3) return;
    if (cells.length % cols !== 0) return;
    const rows = chunk(cells, cols);
    const score = scoreTable(rows);
    if (score < 12) return;
    if (!best || score > best.score) {
      best = {
        start,
        end: start + (emptyCorner ? cells.length - 1 : cells.length),
        cols,
        emptyCorner,
        score,
        header: rows[0],
      };
    }
  };

  for (let cols = 2; cols <= 6; cols += 1) {
    consider(cols, false, texts);
  }

  if (best) return best;

  const headerLen = (() => {
    let count = 0;
    while (count < 6 && count < n && isHeaderish(texts[count])) count += 1;
    return count;
  })();

  for (let headerCols = 2; headerCols <= Math.min(5, headerLen); headerCols += 1) {
    const rest = texts.slice(headerCols);
    const cols = headerCols + 1;
    if (rest.length < cols * 2) continue;
    if (rest.length % cols !== 0) continue;
    consider(cols, true, ['', ...texts.slice(0, headerCols), ...rest]);
  }

  return best;
}

function toCell(block: PtBlock | null): PtBlock {
  const inner: PtBlock = block
    ? { ...block, _key: typeof block._key === 'string' ? block._key : nid('b') }
    : {
        _type: 'block',
        _key: nid('b'),
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: nid('s'), text: '', marks: [] }],
      };
  return {
    _type: 'cell',
    _key: nid('c'),
    value: [inner],
  };
}

function toTable(blocks: PtBlock[], cols: number, emptyCorner: boolean): PtBlock {
  const cells = emptyCorner ? [null, ...blocks] : blocks;
  const rows = chunk(cells, cols).map((row) => ({
    _type: 'row',
    _key: nid('r'),
    cells: row.map((cell) => toCell(cell)),
  }));
  return {
    _type: 'table',
    _key: nid('t'),
    headerRows: 1,
    rows,
  };
}

export function rebuildFlattenedTables(body: PtBlock[]): { body: PtBlock[]; tables: TableHit[] } {
  const out: PtBlock[] = [];
  const tables: TableHit[] = [];
  let i = 0;

  while (i < body.length) {
    const block = body[i];
    if (!isCellish(block) || !isHeaderish(blockText(block))) {
      out.push(block);
      i += 1;
      continue;
    }

    let end = i;
    while (end < body.length && isCellish(body[end])) end += 1;
    const candidate = bestCandidate(body, i, end);
    if (!candidate) {
      out.push(block);
      i += 1;
      continue;
    }

    const source = body.slice(candidate.start, candidate.end);
    out.push(toTable(source, candidate.cols, candidate.emptyCorner));
    tables.push({
      start: candidate.start,
      cols: candidate.cols,
      rows: Math.floor((source.length + (candidate.emptyCorner ? 1 : 0)) / candidate.cols),
      header: candidate.header,
      emptyCorner: candidate.emptyCorner,
    });
    i = candidate.end;
  }

  return { body: out, tables };
}
