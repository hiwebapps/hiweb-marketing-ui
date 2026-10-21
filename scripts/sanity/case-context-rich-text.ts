/**
 * Turn the Markdown strings in each case's Contexto section (reto, estrategia)
 * into Portable Text blocks. Covers published documents and drafts.
 *
 *   npx tsx scripts/sanity/case-context-rich-text.ts --write
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';
import { markdownToPortableText, richTextToMarkdown } from '../../src/lib/content/rich-text';

const WRITE = process.argv.includes('--write');
const PROJECT_ID = 'fxardjr1';
const DATASET = 'web-2026';
const FIELDS = ['reto', 'estrategia'] as const;

function cliToken() {
  const file = path.join(os.homedir(), '.config', 'sanity', 'config.json');
  if (!fs.existsSync(file)) return '';
  const config = JSON.parse(fs.readFileSync(file, 'utf8')) as { authToken?: string };
  return config.authToken ?? '';
}

const token = process.env.SANITY_API_WRITE_TOKEN || cliToken();
if (!token) throw new Error('No Sanity token in env or CLI config');

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
  perspective: 'raw',
});

type Section = { _key?: string; _type?: string; [key: string]: unknown };
type CaseDoc = { _id: string; _rev: string; sections?: Section[] };

const docs = await client.fetch<CaseDoc[]>(`*[_type == "caseStudy"]{ _id, _rev, sections }`);

let updated = 0;
for (const doc of docs) {
  const set: Record<string, unknown> = {};
  for (const section of doc.sections ?? []) {
    if (section._type !== 'caseContext' || !section._key) continue;
    for (const field of FIELDS) {
      const value = section[field];
      if (typeof value !== 'string') continue;
      const blocks = value.trim() ? markdownToPortableText(value) : [];
      const roundTrip = richTextToMarkdown(blocks);
      if (roundTrip.replace(/\s+/g, ' ').trim() !== value.replace(/\s+/g, ' ').trim()) {
        console.warn(`  ! ${doc._id} ${field}: round trip differs\n    before: ${JSON.stringify(value)}\n    after:  ${JSON.stringify(roundTrip)}`);
      }
      set[`sections[_key=="${section._key}"].${field}`] = blocks;
    }
  }
  const count = Object.keys(set).length;
  if (!count) continue;
  console.log(`${WRITE ? 'write' : 'dry'} ${doc._id} · ${count} campo(s)`);
  if (!WRITE) continue;
  await client.patch(doc._id).ifRevisionId(doc._rev).set(set).commit({ autoGenerateArrayKeys: false });
  updated += 1;
}

console.log(WRITE ? `Updated ${updated} documents.` : `Dry run. ${docs.length} documents. Pass --write to apply.`);
