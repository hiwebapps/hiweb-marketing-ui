/**
 * Rebuild flattened Webflow tables (one paragraph per cell) into Sanity `table` blocks.
 *
 *   npx tsx scripts/sanity/rebuild-post-tables.ts
 *   npx tsx scripts/sanity/rebuild-post-tables.ts --write
 */
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';
import { rebuildFlattenedTables, type PtBlock } from './lib/rebuild-tables';

const ROOT = process.cwd();
const WRITE = process.argv.includes('--write');

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
if (!TOKEN) throw new Error('Missing SANITY_API_WRITE_TOKEN (or SANITY_API_READ_TOKEN)');

const client = createClient({
  projectId: 'fxardjr1',
  dataset: 'web-2026',
  apiVersion: '2026-09-18',
  token: TOKEN,
  useCdn: false,
  perspective: 'published',
});

async function main() {
  const posts = await client.fetch<Array<{ _id: string; title: string; slug: string; body: PtBlock[] }>>(
    `*[_type == "post" && defined(body)]{ _id, title, "slug": slug.current, body }`,
  );

  let converted = 0;
  let tableCount = 0;

  for (const post of posts) {
    const { body, tables } = rebuildFlattenedTables(post.body ?? []);
    if (!tables.length) continue;
    converted += 1;
    tableCount += tables.length;
    console.log(`${post.slug}`);
    for (const table of tables) {
      const corner = table.emptyCorner ? '  empty-corner' : '';
      console.log(
        `  ${table.rows}x${table.cols}${corner}  ${JSON.stringify(table.header.filter(Boolean).join(' | '))}`,
      );
    }
    if (!WRITE) continue;
    await client.patch(post._id).set({ body }).commit({ autoGenerateArrayKeys: true });
  }

  console.log(
    `\n${WRITE ? 'WRITE' : 'DRY-RUN'} ${converted} posts, ${tableCount} tables` +
      (WRITE ? '.' : '. Re-run with --write to persist.'),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
