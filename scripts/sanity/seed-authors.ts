/**
 * Create the Hiweb blog authors.
 *
 *   npx tsx scripts/sanity/seed-authors.ts
 *   npx tsx scripts/sanity/seed-authors.ts --write
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

const AUTHORS = [
  {
    _id: 'author-michelle-brindis',
    name: 'Michelle Brindis',
    role: 'SEO Specialist',
    linkedin: 'https://www.linkedin.com/in/miichellerb/',
  },
  {
    _id: 'author-cindy-gorocica',
    name: 'Cindy Gorocica',
    role: 'SEO Lead & SEM Specialist',
    linkedin: 'https://www.linkedin.com/in/cindy-gorocica-c%C3%A1rdenas-b3617113a/',
  },
  {
    _id: 'author-dyanne-castro',
    name: 'Dyanne Castro',
    role: 'SEO Jr.',
    linkedin: 'https://www.linkedin.com/in/dyanne-azul-castro-estrada-36433427a/',
  },
  {
    _id: 'author-david-gallegos',
    name: 'David Gallegos',
    role: 'SEO Manager & Webmaster',
    linkedin: 'https://www.linkedin.com/in/davidgpalma/',
  },
  {
    _id: 'author-jahir-gonzalez',
    name: 'Jahir González',
    role: 'Web Manager',
    linkedin: 'https://www.linkedin.com/in/jahir-gonzalez-zuniga/',
  },
  {
    _id: 'author-valeria-demonte',
    name: 'Valeria Demonte',
    role: 'Social Media Manager & Meta Ads Specialist',
    linkedin: 'https://www.linkedin.com/in/valeria-demonte-gonz%C3%A1lez-55064b246/',
  },
  {
    _id: 'author-melanie-rejon',
    name: 'Melanie Rejón',
    role: 'Branding & Graphic Design',
    linkedin: 'https://www.linkedin.com/in/melanie-rej%C3%B3n-867b42389/',
  },
] as const;

async function main() {
  const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  });
  const raw = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: '2026-09-18',
    token,
    useCdn: false,
    perspective: 'raw',
  });

  const existing = await client.fetch<Array<{ _id: string; name: string }>>(
    `*[_type == "author"]{ _id, name }`,
  );
  console.log(`Dataset ${DATASET}. Write=${WRITE}. Existing authors: ${existing.length}`);
  for (const author of AUTHORS) {
    console.log(`${author._id}: ${author.name} · ${author.role}`);
  }
  if (!WRITE) {
    console.log('Dry-run only. Re-run with --write to publish.');
    return;
  }

  await raw.delete({
    query: `*[_id in [
      "author.michelle-brindis",
      "author.cindy-gorocica",
      "author.dyanne-castro",
      "author.david-gallegos",
      "author.jahir-gonzalez",
      "author.valeria-demonte",
      "author.melanie-rejon"
    ]]`,
  });

  const tx = client.transaction();
  for (const author of AUTHORS) {
    tx.createOrReplace({
      _id: author._id,
      _type: 'author',
      name: author.name,
      role: author.role,
      company: 'Hiweb',
      linkedin: author.linkedin,
      slug: { _type: 'slug', current: author._id.replace('author-', '') },
    });
  }
  await tx.commit();
  console.log(`Published ${AUTHORS.length} authors`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
