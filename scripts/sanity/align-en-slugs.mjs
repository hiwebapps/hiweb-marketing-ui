/**
 * Point English service documents at the public slugs on hiwebmarketing.com/en.
 *   node scripts/sanity/align-en-slugs.mjs
 *   node scripts/sanity/align-en-slugs.mjs --write
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';

const WRITE = process.argv.includes('--write');
const SLUGS = {
  'google-ads': 'google-ads-management-services',
  'redes-sociales': 'social-media',
  'desarrollo-web': 'web-development',
  'crm-automatizacion': 'crm-automation',
  'ia-marketing': 'ai-tools-for-marketing',
};

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

function rewriteString(value) {
  const translated = value.replace(
    /\/(?:en\/)?servicios\/(google-ads|redes-sociales|desarrollo-web|crm-automatizacion|ia-marketing)(?=$|[/?#])/g,
    (match, slug) => match.slice(0, match.length - slug.length) + SLUGS[slug],
  );
  return translated.replace(/(?<!\/en)\/servicios\/([a-z0-9-]+)/g, (_match, slug) => `/en/servicios/${SLUGS[slug] ?? slug}`);
}

function walk(value, enIds) {
  if (typeof value === 'string') return rewriteString(value);
  if (Array.isArray(value)) return value.map((item) => walk(item, enIds));
  if (!value || typeof value !== 'object') return value;
  const next = { ...value };
  if (typeof next._ref === 'string' && !next._ref.endsWith('-en') && enIds.has(`${next._ref}-en`)) {
    next._ref = `${next._ref}-en`;
  }
  for (const key of Object.keys(next)) {
    if (key === '_ref') continue;
    next[key] = walk(next[key], enIds);
  }
  return next;
}

function changedStrings(before, after, path = '') {
  if (typeof before === 'string' && typeof after === 'string' && before !== after) {
    console.log('  text', path, before, '→', after);
    return;
  }
  if (Array.isArray(before) && Array.isArray(after)) {
    before.forEach((item, index) => changedStrings(item, after[index], `${path}[${index}]`));
    return;
  }
  if (before && after && typeof before === 'object' && typeof after === 'object') {
    for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
      if (key.startsWith('_') && key !== '_ref') continue;
      changedStrings(before[key], after[key], path ? `${path}.${key}` : key);
    }
  }
}

function comparable(doc) {
  const copy = { ...doc };
  delete copy._rev;
  delete copy._updatedAt;
  delete copy._createdAt;
  return JSON.stringify(copy);
}

const enIds = new Set(
  (
    await client.fetch(`*[_type == "service" && locale == "en"]._id`)
  ).map((id) => id.replace(/^drafts\./, '')),
);

const docs = await client.fetch(`*[
  _id in ["navigation-en", "drafts.navigation-en", "homePage-en", "drafts.homePage-en", "aboutPage-en", "drafts.aboutPage-en"]
  || (locale == "en" && _type in ["service", "industry"])
]`);

for (const doc of docs) {
  const next = walk(doc, enIds);
  if (next._type === 'service' && SLUGS[next.slug?.current]) {
    next.slug = { _type: 'slug', current: SLUGS[next.slug.current] };
    console.log('slug', doc._id, doc.slug?.current, '→', next.slug.current);
  }
  delete next._rev;
  delete next._updatedAt;
  delete next._createdAt;
  if (comparable(doc) === comparable(next)) continue;
  if (next._type !== 'service' || !SLUGS[doc.slug?.current]) console.log('rewrite', doc._id);
  if (!WRITE) changedStrings(doc, next);
  if (WRITE) {
    await client.createOrReplace(next);
    console.log('  wrote', next._id);
  }
}

if (!WRITE) console.log('Dry run. Pass --write to publish.');
