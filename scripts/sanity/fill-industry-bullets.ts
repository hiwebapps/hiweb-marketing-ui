/**
 * Copy each industry card's current bullets onto the service section.
 *
 *   npx tsx scripts/sanity/fill-industry-bullets.ts --write
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';

const WRITE = process.argv.includes('--write');

function cliToken() {
  const file = path.join(os.homedir(), '.config', 'sanity', 'config.json');
  if (!fs.existsSync(file)) return '';
  const config = JSON.parse(fs.readFileSync(file, 'utf8')) as { authToken?: string };
  return config.authToken ?? '';
}

const token = process.env.SANITY_API_WRITE_TOKEN || cliToken();
if (!token) throw new Error('No Sanity token in env or CLI config');

type Item = { industry?: { _ref?: string }; puntos?: string[] };
type Section = { _type?: string; items?: Item[] };

async function main() {
  const client = createClient({
    projectId: 'fxardjr1',
    dataset: 'web-2026',
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  });

  const industries = await client.fetch<{ _id: string; puntos: string[] }[]>(
    `*[_type == "industry" && !(_id in path("drafts.**"))]{ _id, "puntos": porQue[].title }`,
  );
  const byId = new Map(industries.map((item) => [item._id, item.puntos ?? []]));
  const docs = await client.fetch<{ _id: string; sections: Section[] }[]>(
    `*[_type == "service" && !(_id in path("drafts.**"))]{ _id, sections }`,
  );

  for (const doc of docs) {
    let changed = false;
    const sections = (doc.sections ?? []).map((section) => {
      if (section._type !== 'serviceIndustries' || !Array.isArray(section.items)) return section;
      return {
        ...section,
        items: section.items.map((item) => {
          if (Array.isArray(item.puntos)) return item;
          changed = true;
          return { ...item, puntos: byId.get(item.industry?._ref ?? '') ?? [] };
        }),
      };
    });
    console.log(`${doc._id}: ${changed ? 'set bullets' : 'already set'}`);
    if (!WRITE || !changed) continue;
    await client.patch(doc._id).set({ sections }).commit();
    console.log(`  patched ${doc._id}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
