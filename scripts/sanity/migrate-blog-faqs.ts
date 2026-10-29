/**
 * Migrates hardcoded FAQ text blocks inside Sanity blog post bodies into
 * structured `faqs: [faqItem]` fields.
 *
 * Usage:
 *   npx tsx scripts/sanity/migrate-blog-faqs.ts                   # Dry run on all posts
 *   npx tsx scripts/sanity/migrate-blog-faqs.ts --slug=anuncios-en-chatgpt  # Dry run single post
 *   npx tsx scripts/sanity/migrate-blog-faqs.ts --write          # Apply to Sanity
 */
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';

const ROOT = process.cwd();
const WRITE = process.argv.includes('--write');
const SLUG_ARG = process.argv.find((a) => a.startsWith('--slug='))?.split('=')[1];

function loadDotEnv() {
  for (const file of ['.env.local', '.env']) {
    const abs = path.join(ROOT, file);
    if (!fs.existsSync(abs)) continue;
    for (const line of fs.readFileSync(abs, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq < 1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

loadDotEnv();

const TOKEN = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;
if (!TOKEN) throw new Error('Missing SANITY_API_WRITE_TOKEN or SANITY_API_READ_TOKEN in .env');

const client = createClient({
  projectId: 'fxardjr1',
  dataset: 'web-2026',
  apiVersion: '2026-09-18',
  token: TOKEN,
  useCdn: false,
  perspective: 'published',
});

function randomKey(length = 12) {
  return Math.random().toString(36).substring(2, 2 + length);
}

const FAQ_HEADING_REGEX = /^(faq\b|preguntas?\s+frecuentes?|dudas?\s+frecuentes?|frequently\s+asked)/i;
const QUESTION_START_REGEX = /^(¿|what\b|how\b|can\b|why\b|is\b|are\b|do\b|does\b|when\b|where\b|which\b|who\b|podr|cu[aá]l|cu[aá]ndo|c[oó]mo|d[oó]nde|por\s+qu[eé]|qu[eé]\b)/i;
const CTA_TEXT_REGEX = /(cont[aá]ctanos|escr[ií]benos|diagn[oó]stico|whatsapp|agenda|get in touch|contact us|talk to us|schedule|book a call|ready to|\blist[oa]s?\b)/i;

interface BlockChild {
  _key?: string;
  _type?: string;
  text?: string;
  marks?: string[];
}

interface PtBlock {
  _key?: string;
  _type?: string;
  style?: string;
  children?: BlockChild[];
  [key: string]: unknown;
}

function getBlockText(block: PtBlock): string {
  if (!block || !Array.isArray(block.children)) return '';
  return block.children.map((c) => c.text || '').join('').trim();
}

export type ExtractedFaq = {
  question: string;
  answerText: string;
  answerBlock?: PtBlock;
};

export function extractFaqsFromBody(body: PtBlock[]): {
  faqs: ExtractedFaq[];
  newBody: PtBlock[];
  startIndex: number;
  endIndex: number;
} | null {
  if (!Array.isArray(body) || body.length === 0) return null;

  let faqHeadingIndex = -1;
  for (let i = 0; i < body.length; i++) {
    const b = body[i];
    if (b._type === 'block' && (b.style === 'h2' || b.style === 'h3')) {
      const text = getBlockText(b);
      if (FAQ_HEADING_REGEX.test(text)) {
        faqHeadingIndex = i;
        break;
      }
    }
  }

  if (faqHeadingIndex === -1) return null;

  const faqs: ExtractedFaq[] = [];
  let currentIndex = faqHeadingIndex + 1;
  let endIndex = body.length;

  while (currentIndex < body.length) {
    const block = body[currentIndex];
    const text = getBlockText(block);

    // Stop if next section heading is reached
    if (block._type === 'block' && (block.style === 'h2' || block.style === 'h3' || block.style === 'h4')) {
      if (CTA_TEXT_REGEX.test(text)) {
        endIndex = currentIndex;
        break;
      }
      // If it is another question heading (e.g. h3: Question?)
      if (text.includes('?') && QUESTION_START_REGEX.test(text)) {
        // Continue to parse as question
      } else {
        endIndex = currentIndex;
        break;
      }
    }

    if (!text || text === '‍') {
      currentIndex++;
      continue;
    }

    // Pattern A: Single block containing Question? Answer...
    const qMarkIndex = text.indexOf('?');
    if (qMarkIndex > 0 && QUESTION_START_REGEX.test(text)) {
      const qPart = text.slice(0, qMarkIndex + 1).trim();
      const aPart = text.slice(qMarkIndex + 1).trim();

      if (aPart.length > 0) {
        faqs.push({
          question: qPart,
          answerText: aPart,
        });
        currentIndex++;
        continue;
      }
    }

    // Pattern B: Block is the question, next block is the answer
    if (text.includes('?') && QUESTION_START_REGEX.test(text)) {
      const question = text;
      let nextIndex = currentIndex + 1;
      while (nextIndex < body.length && !getBlockText(body[nextIndex])) {
        nextIndex++;
      }

      if (nextIndex < body.length) {
        const nextBlock = body[nextIndex];
        const nextText = getBlockText(nextBlock);
        if (nextBlock._type === 'block' && !FAQ_HEADING_REGEX.test(nextText) && (!nextBlock.style || nextBlock.style === 'normal')) {
          if (CTA_TEXT_REGEX.test(question) || CTA_TEXT_REGEX.test(nextText)) {
            endIndex = currentIndex;
            break;
          }
          faqs.push({
            question,
            answerText: nextText,
            answerBlock: nextBlock,
          });
          currentIndex = nextIndex + 1;
          continue;
        }
      }
    }

    currentIndex++;
  }

  if (faqs.length === 0) return null;

  // New body strips out from faqHeadingIndex to endIndex
  const newBody = [...body.slice(0, faqHeadingIndex), ...body.slice(endIndex)];

  return {
    faqs,
    newBody,
    startIndex: faqHeadingIndex,
    endIndex,
  };
}

function toSanityFaqItems(faqs: ExtractedFaq[]) {
  return faqs.map((faq) => ({
    _key: randomKey(),
    _type: 'faqItem',
    question: faq.question,
    answer: faq.answerBlock?.children
      ? [
          {
            _key: randomKey(),
            _type: 'block',
            style: 'normal',
            children: faq.answerBlock.children.map((c) => ({
              _key: randomKey(),
              _type: 'span',
              text: c.text,
              marks: c.marks ?? [],
            })),
          },
        ]
      : [
          {
            _key: randomKey(),
            _type: 'block',
            style: 'normal',
            children: [
              {
                _key: randomKey(),
                _type: 'span',
                text: faq.answerText,
                marks: [],
              },
            ],
          },
        ],
  }));
}

async function run() {
  console.log(`\n🔍 Buscando artículos para migrar FAQs (Modo: ${WRITE ? '⚡ ESCRITURA' : '👀 DRY RUN'})...\n`);

  const query = SLUG_ARG
    ? `*[_type == "post" && slug.current == "${SLUG_ARG}"]{ _id, title, "slug": slug.current, locale, faqs, body }`
    : `*[_type == "post" && defined(body)]{ _id, title, "slug": slug.current, locale, faqs, body }`;

  const posts = await client.fetch<Array<{
    _id: string;
    title: string;
    slug: string;
    locale: string;
    faqs?: unknown[];
    body: PtBlock[];
  }>>(query);

  let eligible = 0;
  let updated = 0;

  for (const post of posts) {
    const result = extractFaqsFromBody(post.body);
    if (!result || result.faqs.length === 0) continue;

    eligible++;
    console.log(`\n📄 [${post.slug}] "${post.title}" (${post.locale || 'es'})`);
    console.log(`   Extraídas ${result.faqs.length} preguntas:`);
    result.faqs.forEach((f, idx) => {
      console.log(`     ${idx + 1}. ${f.question}`);
      console.log(`        👉 ${f.answerText.slice(0, 80)}...`);
    });

    if (WRITE) {
      const sanityFaqItems = toSanityFaqItems(result.faqs);
      await client
        .patch(post._id)
        .set({
          faqs: sanityFaqItems,
          body: result.newBody,
        })
        .commit();
      console.log(`   ✅ Guardado en Sanity (${post._id})`);
      updated++;
    }
  }

  console.log(`\n───────────────────────────────────────────────`);
  console.log(`Total artículos candidatos: ${eligible}`);
  if (WRITE) {
    console.log(`Total artículos actualizados en Sanity: ${updated}`);
  } else {
    console.log(`ℹ️ Para aplicar los cambios a Sanity, corre:`);
    console.log(`   npx tsx scripts/sanity/migrate-blog-faqs.ts --write`);
  }
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
