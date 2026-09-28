/**
 * Import English blog posts from the published Webflow site.
 *   node scripts/sanity/import-en-blogs.mjs
 *   node scripts/sanity/import-en-blogs.mjs --write
 *   node scripts/sanity/import-en-blogs.mjs --limit 2
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';

const WRITE = process.argv.includes('--write');
const limitArg = process.argv.find((arg) => arg.startsWith('--limit'));
const LIMIT = limitArg ? Number(process.argv[process.argv.indexOf(limitArg) + 1] ?? limitArg.split('=')[1]) : 0;

const SERVICE_CATEGORY = [
  [/google\s*ads/i, 'google-ads'],
  [/meta\s*ads/i, 'meta-ads'],
  [/social/i, 'redes-sociales'],
  [/community/i, 'community-manager'],
  [/crm|automation/i, 'crm-automatizacion'],
  [/brand/i, 'branding'],
  [/\bai\b|artificial/i, 'ia-marketing'],
  [/web|design|development/i, 'desarrollo-web'],
  [/seo/i, 'seo'],
];

function cliToken() {
  const file = path.join(os.homedir(), '.config', 'sanity', 'config.json');
  const config = JSON.parse(fs.readFileSync(file, 'utf8'));
  return config.authToken ?? '';
}

const token = process.env.SANITY_API_WRITE_TOKEN || cliToken();
if (!token) throw new Error('No Sanity token');

const client = createClient({
  projectId: 'fxardjr1',
  dataset: 'web-2026',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

let keyCount = 0;
function key() {
  keyCount += 1;
  return `k${keyCount.toString(36)}`;
}

function decode(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function parseAttrs(open) {
  const attrs = {};
  for (const match of open.matchAll(/([\w:-]+)="([^"]*)"/g)) attrs[match[1]] = decode(match[2]);
  return attrs;
}

function parseNodes(html, start = 0, untilClose = null) {
  const nodes = [];
  let i = start;
  while (i < html.length) {
    if (html.startsWith('</', i)) {
      const name = html.slice(i + 2, html.indexOf('>', i)).trim().toLowerCase();
      const end = html.indexOf('>', i) + 1;
      if (untilClose && name === untilClose) return { nodes, i: end };
      i = end;
      continue;
    }
    if (html[i] !== '<') {
      const next = html.indexOf('<', i);
      const end = next === -1 ? html.length : next;
      const text = decode(html.slice(i, end));
      if (text.trim()) nodes.push({ kind: 'text', text });
      i = end;
      continue;
    }
    if (html.startsWith('<!--', i)) {
      const end = html.indexOf('-->', i);
      i = end === -1 ? html.length : end + 3;
      continue;
    }
    const gt = html.indexOf('>', i);
    if (gt === -1) break;
    const open = html.slice(i, gt + 1);
    const name = open.match(/^<([a-z0-9]+)/i)?.[1]?.toLowerCase();
    if (!name) {
      i = gt + 1;
      continue;
    }
    const attrs = parseAttrs(open);
    const self = open.endsWith('/>') || ['br', 'img', 'hr', 'wbr'].includes(name);
    if (self) {
      nodes.push({ kind: 'el', name, attrs, children: [] });
      i = gt + 1;
      continue;
    }
    const inner = parseNodes(html, gt + 1, name);
    nodes.push({ kind: 'el', name, attrs, children: inner.nodes });
    i = inner.i;
  }
  return { nodes, i };
}

function rewriteHref(href) {
  if (!href) return '';
  try {
    const url = new URL(href, 'https://www.hiwebmarketing.com');
    if (!url.hostname.endsWith('hiwebmarketing.com')) return href;
    const pathname = url.pathname.replace(/\/$/, '') || '/';
    if (pathname === '/en/contacto') return '/contacto';
    if (pathname.startsWith('/blogs/')) return `/blog/${pathname.slice('/blogs/'.length)}`;
    return pathname;
  } catch {
    return href;
  }
}

function span(text, marks) {
  return { _type: 'span', _key: key(), text, marks };
}

function inline(children, marks, markDefs) {
  const spans = [];
  for (const child of children) {
    if (child.kind === 'text') {
      if (child.text) spans.push(span(child.text, marks));
      continue;
    }
    if (child.name === 'br') {
      spans.push(span('\n', marks));
      continue;
    }
    if (child.name === 'a') {
      const mark = key();
      markDefs.push({ _key: mark, _type: 'link', href: rewriteHref(child.attrs.href || '') });
      spans.push(...inline(child.children, [...marks, mark], markDefs));
      continue;
    }
    const nextMarks =
      child.name === 'strong' || child.name === 'b'
        ? [...marks, 'strong']
        : child.name === 'em' || child.name === 'i'
          ? [...marks, 'em']
          : marks;
    spans.push(...inline(child.children ?? [], nextMarks, markDefs));
  }
  return spans;
}

function textBlock(style, children, extra = {}) {
  const markDefs = [];
  const spans = inline(children, [], markDefs);
  if (!spans.length) return null;
  return { _type: 'block', _key: key(), style, markDefs, children: spans, ...extra };
}

function plainText(node) {
  if (!node) return '';
  if (node.kind === 'text') return node.text;
  return (node.children ?? []).map(plainText).join('');
}

function findImg(node) {
  if (!node || node.kind !== 'el') return null;
  if (node.name === 'img') return node;
  for (const child of node.children) {
    const found = findImg(child);
    if (found) return found;
  }
  return null;
}

function listBlocks(el, listItem, level) {
  const blocks = [];
  for (const li of el.children.filter((child) => child.kind === 'el' && child.name === 'li')) {
    const nested = li.children.filter((child) => child.kind === 'el' && (child.name === 'ul' || child.name === 'ol'));
    const rest = li.children.filter((child) => !nested.includes(child));
    const item = textBlock('normal', rest, { listItem, level });
    if (item) blocks.push(item);
    for (const list of nested) {
      blocks.push(...listBlocks(list, list.name === 'ol' ? 'number' : 'bullet', level + 1));
    }
  }
  return blocks;
}

function tableBlock(el) {
  const rows = [];
  const walk = (node) => {
    if (node.kind !== 'el') return;
    if (node.name === 'tr') {
      const cells = node.children
        .filter((child) => child.kind === 'el' && (child.name === 'td' || child.name === 'th'))
        .map((cell) => plainText(cell).replace(/\s+/g, ' ').trim());
      if (cells.length) rows.push({ _key: key(), _type: 'tableRow', cells });
      return;
    }
    node.children.forEach(walk);
  };
  walk(el);
  if (!rows.length) return null;
  return { _type: 'blogTable', _key: key(), hasHeaderRow: true, rows };
}

function blocksFrom(nodes, images) {
  const blocks = [];
  for (const node of nodes) {
    if (node.kind !== 'el') continue;
    if (['p', 'h1', 'h2', 'h3', 'h4', 'blockquote'].includes(node.name)) {
      const style = node.name === 'p' ? 'normal' : node.name === 'h1' ? 'h2' : node.name === 'blockquote' ? 'blockquote' : node.name;
      const block = textBlock(style, node.children);
      if (block) blocks.push(block);
      continue;
    }
    if (node.name === 'ul' || node.name === 'ol') {
      blocks.push(...listBlocks(node, node.name === 'ol' ? 'number' : 'bullet', 1));
      continue;
    }
    if (node.name === 'table') {
      const table = tableBlock(node);
      if (table) blocks.push(table);
      continue;
    }
    if (node.name === 'figure' || node.name === 'img') {
      const img = node.name === 'img' ? node : findImg(node);
      if (img?.attrs.src) images.push({ src: img.attrs.src, alt: img.attrs.alt || '' });
      blocks.push({ _type: 'image', _key: key(), pendingSrc: img?.attrs.src, alt: img?.attrs.alt || '' });
      continue;
    }
    blocks.push(...blocksFrom(node.children ?? [], images));
  }
  return blocks.filter((block) => block._type !== 'image' || block.pendingSrc);
}

function richText(html) {
  const marker = 'class="rich-text blog w-richtext"';
  const at = html.indexOf(marker);
  if (at === -1) return '';
  const openEnd = html.indexOf('>', at) + 1;
  const tagStart = html.lastIndexOf('<', at);
  const tag = html.slice(tagStart + 1).match(/^([a-z0-9]+)/i)?.[1]?.toLowerCase() ?? 'div';
  return parseNodes(html, openEnd, tag).nodes;
}

function jsonLd(html) {
  const docs = [];
  for (const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      docs.push(JSON.parse(decode(match[1])));
    } catch {
      // ignore
    }
  }
  return docs;
}

function categoryService(label) {
  for (const [pattern, slug] of SERVICE_CATEGORY) {
    if (pattern.test(label)) return slug;
  }
  return '';
}

const MONTHS = {
  january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
  july: '07', august: '08', september: '09', october: '10', november: '11', december: '12',
  jan: '01', feb: '02', mar: '03', apr: '04', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
};

function headerBits(html) {
  const marker = 'class="article-header-details"';
  const at = html.indexOf(marker);
  if (at === -1) return { category: '', fecha: '' };
  const openEnd = html.indexOf('>', at) + 1;
  const text = parseNodes(html, openEnd, 'div').nodes.map(plainText).join(' ').replace(/\s+/g, ' ').trim();
  const dated = text.match(/([A-Z][a-z]+) (\d{1,2}), (\d{4})/);
  const month = dated ? MONTHS[dated[1].toLowerCase()] : '';
  const fecha = dated && month ? `${dated[3]}-${month}-${dated[2].padStart(2, '0')}` : '';
  const category = dated ? text.slice(text.indexOf(dated[0]) + dated[0].length).trim() : '';
  return { category, fecha };
}

async function withRetry(label, fn) {
  let last;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      last = error;
      console.warn('retry', attempt, label, error.message ?? error);
      await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
    }
  }
  throw last;
}

async function uploadImage(src, alt, cache) {
  if (cache.has(src)) return { ...cache.get(src), alt };
  const response = await fetch(src);
  if (!response.ok) throw new Error(`${response.status} ${src}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const filename = new URL(src).pathname.split('/').pop() || 'image.jpg';
  const asset = await withRetry(filename, () =>
    client.assets.upload('image', buffer, {
      filename,
      contentType: response.headers.get('content-type') ?? 'image/jpeg',
    }),
  );
  const image = { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, alt };
  cache.set(src, image);
  return { ...image, alt };
}

async function loadPost(url, serviceIds) {
  const response = await fetch(url);
  if (!response.ok) {
    console.warn('skip', response.status, url);
    return null;
  }
  const html = await response.text();
  const slug = new URL(url).pathname.replace(/\/$/, '').split('/').pop();
  const ld = jsonLd(html);
  const posting = ld.find((item) => item['@type'] === 'BlogPosting') ?? {};
  const faqPage = ld.find((item) => item['@type'] === 'FAQPage');
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const metaTitle = (html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? '').replace(/\s*\|\s*Hiweb.*$/i, '').trim();
  const metaDescription =
    html.match(/name="description" content="([^"]*)"/i)?.[1] ??
    html.match(/content="([^"]*)" name="description"/i)?.[1] ??
    '';
  const esHref = [...html.matchAll(/hreflang="es-MX"[^>]*href="([^"]+)"|href="([^"]+)"[^>]*hreflang="es-MX"/g)]
    .map((match) => match[1] || match[2])
    .find(Boolean);
  const esSlug = esHref ? new URL(esHref, url).pathname.replace(/\/$/, '').split('/').pop() : '';
  const coverMatch = html.match(/class="article-header-image"[\s\S]*?<img[^>]+src="([^"]+)"[^>]*>/i);
  const coverAlt = html.match(/class="article-header-image"[\s\S]*?<img[^>]*alt="([^"]*)"/i)?.[1] ?? '';
  const images = [];
  const body = blocksFrom(richText(html), images).filter((block) => block.pendingSrc !== coverMatch?.[1]);
  const header = headerBits(html);
  const category = header.category;
  const serviceKey = categoryService(category);
  const serviceId = serviceKey && serviceIds.has(`service-${serviceKey}-en`) ? `service-${serviceKey}-en` : '';
  const published = String(posting.datePublished || '');
  const fecha = /^\d{4}-\d{2}-\d{2}/.test(published) ? published.slice(0, 10) : header.fecha;
  const faqs = Array.isArray(faqPage?.mainEntity)
    ? faqPage.mainEntity
        .map((item) => ({
          question: String(item.name ?? '').trim(),
          answer: String(item.acceptedAnswer?.text ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
        }))
        .filter((item) => item.question && item.answer)
    : [];
  return {
    slug,
    esSlug,
    title: h1 || posting.headline || metaTitle,
    description: decode(posting.description || metaDescription || ''),
    metaTitle: metaTitle || h1,
    metaDescription: decode(metaDescription || posting.description || ''),
    fecha,
    category,
    serviceId,
    cover: coverMatch ? { src: coverMatch[1], alt: decode(coverAlt) } : null,
    body,
    faqs,
    imageCount: images.length + (coverMatch ? 1 : 0),
  };
}

function pairsFile(posts) {
  const english = {};
  const spanish = {};
  for (const post of posts) {
    if (!post.esSlug) continue;
    english[post.esSlug] = post.slug;
    spanish[post.slug] = post.esSlug;
  }
  const source = `/** Spanish blog slug → English slug on hiwebmarketing.com/en/blogs. */\nexport const EN_BLOG_SLUG: Record<string, string> = ${JSON.stringify(english, null, 2)};\n\n/** English blog slug → Spanish slug. */\nexport const ES_BLOG_SLUG: Record<string, string> = ${JSON.stringify(spanish, null, 2)};\n`;
  fs.writeFileSync(path.join(process.cwd(), 'src/lib/blog-pairs.ts'), source);
}

const sitemap = await (await fetch('https://www.hiwebmarketing.com/sitemap.xml')).text();
let urls = [...new Set([...sitemap.matchAll(/<loc>([^<]*\/en\/blogs\/[^<]+)<\/loc>/g)].map((match) => match[1]))];
if (LIMIT) urls = urls.slice(0, LIMIT);
const serviceIds = new Set(
  await client.fetch(`*[_type == "service" && locale == "en"]._id`),
);
console.log(`English blog URLs: ${urls.length}`);

const posts = [];
for (const url of urls) {
  const post = await loadPost(url, serviceIds);
  if (!post) continue;
  posts.push(post);
  console.log(`${post.slug}  es:${post.esSlug || '—'}  ${post.fecha || 'no-date'}  blocks:${post.body.length}  img:${post.imageCount}  ${post.category || ''}`);
}

if (!WRITE) {
  console.log('Dry run. Pass --write to publish.');
  process.exit(0);
}

const cache = new Map();
const existing = new Set(await client.fetch(`*[_type == "post" && locale == "en"]._id`));
const newest = posts.filter((post) => post.fecha).sort((a, b) => b.fecha.localeCompare(a.fecha))[0]?.slug;
for (const post of posts) {
  if (existing.has(`post-${post.slug}-en`)) {
    console.log('exists', post.slug);
    continue;
  }
  const body = [];
  for (const block of post.body) {
    if (block._type !== 'image') {
      body.push(block);
      continue;
    }
    try {
      const image = await uploadImage(block.pendingSrc, block.alt, cache);
      body.push({ _type: 'image', _key: block._key, alt: image.alt, asset: image.asset });
    } catch (error) {
      console.warn('image skipped', block.pendingSrc, error.message);
    }
  }
  let cover;
  if (post.cover) {
    try {
      cover = await uploadImage(post.cover.src, post.cover.alt, cache);
    } catch (error) {
      console.warn('cover skipped', post.slug, error.message);
    }
  }
  const doc = {
    _id: `post-${post.slug}-en`,
    _type: 'post',
    locale: 'en',
    title: post.title,
    slug: { _type: 'slug', current: post.slug },
    description: post.description || post.title,
    autor: 'Hiweb Marketing',
    fecha: post.fecha || new Date().toISOString().slice(0, 10),
    featured: post.slug === newest,
    body,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
  };
  if (post.esSlug) doc.esSlug = post.esSlug;
  if (post.category) doc.keyword = post.category;
  if (post.serviceId) doc.categoriaServicio = { _type: 'reference', _ref: post.serviceId };
  if (cover) doc.cover = cover;
  if (post.faqs.length) {
    doc.faqs = post.faqs.map((item) => ({ _key: key(), _type: 'faqItem', ...item }));
  }
  await withRetry(doc._id, () => client.createOrReplace(doc));
  console.log('wrote', doc._id);
}

const missingLocale = await client.fetch(`*[_type == "post" && !defined(locale)]._id`);
for (const id of missingLocale) {
  await client.patch(id).set({ locale: 'es' }).commit();
}
if (missingLocale.length) console.log('marked Spanish', missingLocale.length);

const nav = await client.getDocument('navigation-en');
if (nav) {
  const next = JSON.parse(JSON.stringify(nav), (_key, value) =>
    value === '/en/blog' || value === '/en/blog/' ? '/en/blogs' : value,
  );
  delete next._rev;
  delete next._updatedAt;
  delete next._createdAt;
  if (JSON.stringify(nav.bar) !== JSON.stringify(next.bar)) {
    await client.createOrReplace(next);
    console.log('nav blog href → /en/blogs');
  }
}

if (!LIMIT) pairsFile(posts);
console.log(`Done: ${posts.length} English posts.`);
