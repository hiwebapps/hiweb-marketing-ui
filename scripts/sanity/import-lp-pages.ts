import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';
import { localLpPages } from '../../src/data/lp/pages';
import { lpImageSources, lpPageToSanity } from '../../src/data/lp/to-sanity';

function readEnv(key: string): string {
  if (process.env[key]) return process.env[key] ?? '';
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return '';
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(new RegExp(`^${key}=(.*)$`));
    if (match) return match[1].trim().replace(/^["']|["']$/g, '');
  }
  return '';
}

const write = process.argv.includes('--write');
/** Pages edited in Studio after this moment are skipped unless --force is passed. */
const editedAfter = process.argv.find((arg) => arg.startsWith('--since='))?.slice('--since='.length);
const force = process.argv.includes('--force');
const local = localLpPages();
const sources = lpImageSources(local);

if (!write) {
  console.log(`Dry run: ${local.length} landings, ${sources.length} imágenes por subir. Pasa --write para publicarlas en Sanity.`);
  for (const page of local) console.log(`- ${page.path} (${page.sections.length} secciones)`);
  process.exit(0);
}

const token = readEnv('SANITY_API_WRITE_TOKEN');

/** Without a write token, `sanity exec … --with-user-token` lends the signed-in CLI session. */
async function writeClient() {
  if (token) {
    return createClient({
      projectId: readEnv('PUBLIC_SANITY_PROJECT_ID') || 'fxardjr1',
      dataset: readEnv('PUBLIC_SANITY_DATASET') || 'web-2026',
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    });
  }
  try {
    const { getCliClient } = await import('sanity/cli');
    return getCliClient({ apiVersion: '2024-01-01', useCdn: false });
  } catch {
    console.error(
      'Falta SANITY_API_WRITE_TOKEN. Ponlo en .env o corre: npx sanity exec scripts/sanity/import-lp-pages.ts --with-user-token -- --write',
    );
    process.exit(1);
  }
}

const client = await writeClient();

const existing = await client.fetch<{ _id: string; _updatedAt: string }[]>(
  '*[_type == "lpPage"]{ _id, _updatedAt }',
  {},
  { perspective: 'raw' },
);
const drafts = existing.filter((doc) => doc._id.startsWith('drafts.'));
const edited = editedAfter ? existing.filter((doc) => doc._updatedAt > editedAfter) : [];
if (!force && (drafts.length || edited.length)) {
  console.error('Hay landings con cambios en Studio. No se sobrescribe nada. Usa --force para continuar.');
  for (const doc of [...drafts, ...edited]) console.error(`- ${doc._id} (${doc._updatedAt})`);
  process.exit(1);
}

const assets = new Map<string, string>();
for (const src of sources) {
  const response = await fetch(src);
  if (!response.ok) {
    console.error(`No se pudo descargar ${src} (${response.status}).`);
    continue;
  }
  const filename = decodeURIComponent(new URL(src).pathname.split('/').at(-1) || 'imagen');
  const asset = await client.assets.upload('image', Buffer.from(await response.arrayBuffer()), { filename });
  assets.set(src, asset._id);
  console.log(`Imagen ${filename} → ${asset._id}`);
}

let done = 0;
for (const page of local) {
  const doc = lpPageToSanity(page, (src) => assets.get(src) ?? null);
  await client.createOrReplace(doc as { _id: string; _type: string });
  done += 1;
  console.log(`Publicada ${page.path}`);
}
console.log(`Listo: ${done} landings.`);
