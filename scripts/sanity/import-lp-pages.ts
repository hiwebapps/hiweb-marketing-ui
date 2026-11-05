import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';
import { localLpPages } from '../../src/data/lp/pages';
import { lpPageToSanity } from '../../src/data/lp/to-sanity';

function readEnv(key: string): string {
  if (process.env[key]) return process.env[key] ?? '';
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return '';
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(new RegExp(`^${key}=(.*)$`));
    if (match) return match[1].trim().replace(/^["']|["']$/g, '');
  }
  return '';
}

const write = process.argv.includes('--write');
const pages = localLpPages().map(lpPageToSanity);

if (!write) {
  console.log(`Dry run: ${pages.length} landings. Pasa --write para publicarlas en Sanity.`);
  for (const page of pages) console.log(`- ${page.path} (${page.sections.length} secciones)`);
  process.exit(0);
}

const token = readEnv('SANITY_API_WRITE_TOKEN');
if (!token) {
  console.error('Falta SANITY_API_WRITE_TOKEN en el entorno o en .env.');
  process.exit(1);
}

const client = createClient({
  projectId: readEnv('PUBLIC_SANITY_PROJECT_ID') || 'fxardjr1',
  dataset: readEnv('PUBLIC_SANITY_DATASET') || 'web-2026',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

let done = 0;
for (const page of pages) {
  await client.createOrReplace(page);
  done += 1;
  console.log(`Publicada ${page.path}`);
}
console.log(`Listo: ${done} landings.`);
