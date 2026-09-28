/**
 * Move each case's service references into the Contexto section
 * and drop the index phrase from the document.
 *
 *   npx tsx scripts/sanity/move-case-services.ts --write
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';

const WRITE = process.argv.includes('--write');
const PROJECT_ID = 'fxardjr1';
const DATASET = 'web-2026';

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
});

type Ref = { _key?: string; _type?: string; _ref?: string };
type Section = { _key?: string; _type?: string; servicios?: Ref[]; [key: string]: unknown };
type CaseDoc = {
  _id: string;
  servicios?: Ref[];
  sections?: Section[];
};

const docs = await client.fetch<CaseDoc[]>(
  `*[_type == "caseStudy"]{ _id, servicios, sections }`,
);

let updated = 0;
for (const doc of docs) {
  const sections = (doc.sections ?? []).map((section) => {
    if (section._type === 'caseRelated' && section.description === 'Cliente, industria y outcome. Sin portfolio ornamental.') {
      return { ...section, description: 'Cliente, industria y el trabajo realizado.' };
    }
    if (section._type !== 'caseContext') return section;
    if (Array.isArray(section.servicios) && section.servicios.length) return section;
    return { ...section, servicios: doc.servicios ?? [] };
  });
  const hasContext = sections.some((section) => section._type === 'caseContext');
  console.log(
    `${WRITE ? 'write' : 'dry'} ${doc._id} · services ${(doc.servicios ?? []).length} · context ${hasContext}`,
  );
  if (!WRITE || !hasContext) continue;
  await client.patch(doc._id).set({ sections }).unset(['servicios', 'resultadoFrase']).commit();
  updated += 1;
}

console.log(WRITE ? `Updated ${updated} cases.` : `Dry run. ${docs.length} documents. Pass --write to apply.`);
