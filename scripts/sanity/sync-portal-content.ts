import { createClient } from '@sanity/client';
import defaults from '../../src/lib/content/portal-defaults.json';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || 'fxardjr1';
const dataset = process.env.PUBLIC_SANITY_DATASET || 'web-2026';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.error('No SANITY_API_WRITE_TOKEN provided');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

async function run() {
  console.log('Syncing portalPage in Sanity...');

  // 1. ES
  const esDoc = {
    _id: 'portalPage',
    _type: 'portalPage',
    title: defaults.es.title,
    sections: defaults.es.sections,
  };
  await client.createOrReplace(esDoc);
  console.log('✓ portalPage (ES) updated successfully');

  // 2. EN
  const enDoc = {
    _id: 'portalPage-en',
    _type: 'portalPage',
    title: defaults.en.title,
    sections: defaults.en.sections,
  };
  await client.createOrReplace(enDoc);
  console.log('✓ portalPage-en (EN) updated successfully');
}

run().catch((err) => {
  console.error('Error syncing portal docs to Sanity:', err);
  process.exit(1);
});
