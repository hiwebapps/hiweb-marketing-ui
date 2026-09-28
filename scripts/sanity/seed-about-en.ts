/**
 * English About page. There is no About page on hiwebmarketing.com/en,
 * so this translates the current Spanish page and stores it in Studio.
 *
 *   npx tsx scripts/sanity/seed-about-en.ts
 *   npx tsx scripts/sanity/seed-about-en.ts --write
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';

const WRITE = process.argv.includes('--write');
const token = process.env.SANITY_API_WRITE_TOKEN || cliToken();
if (!token) throw new Error('No Sanity token in env or CLI config');

function cliToken() {
  const file = path.join(os.homedir(), '.config', 'sanity', 'config.json');
  if (!fs.existsSync(file)) return '';
  const config = JSON.parse(fs.readFileSync(file, 'utf8')) as { authToken?: string };
  return config.authToken ?? '';
}

const client = createClient({
  projectId: 'fxardjr1',
  dataset: 'web-2026',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const spanish = await client.getDocument('aboutPage');
if (!spanish) throw new Error('Missing aboutPage');

const doc = {
  _id: 'aboutPage-en',
  _type: 'aboutPage',
  locale: 'en',
  heroTitle: 'Collective expertise, our own technology, cross-border reach.',
  heroDescription:
    'A strategic partner with the efficiency of an in-house team and the reach of an enterprise agency.',
  heroBadge: 'About',
  heroCtaLabel: 'Schedule your audit',
  heroCtaHref: '/contacto',
  heroImage: spanish.heroImage,
  historyEyebrow: 'History',
  historyTitle: 'From a tactics agency to an architecture by industry',
  historyDescription:
    'Hiweb started by running established accounts where a service catalog was not enough. The buyer is not looking for “SEO”: they are looking for a result in their sector. We reorganized the offer, the proof, and the team around that.',
  historyColumns: [
    {
      _key: 'vision',
      _type: 'object',
      title: 'Our vision',
      paragraphs: [
        'Stop selling loose tactics. The marketing that matters connects offer, media, and web in a system the committee understands and sales can use.',
        'We want to be the industry partner a marketing director recommends without reservations — evidence first, theater never.',
      ],
    },
    {
      _key: 'ops',
      _type: 'object',
      title: 'How we operate',
      paragraphs: [
        'Hiweb started from established accounts where the catalog was not enough. We reorganized the offer, the proof, and the team around the result by sector.',
        'A senior core in strategy, performance, creative, and web product. The audit is the filter: if there is no fit, we say so on the same call.',
      ],
    },
  ],
  pillarsEyebrow: 'Differentiators',
  pillarsTitle: 'Differentiators',
  pillars: [
    {
      _key: 'partner',
      title: 'Partner, not a vendor',
      description:
        'The efficiency of an in-house team with the reach of an enterprise agency. One counterpart, cross-border execution.',
      icon: 'users',
      accent: 'purple',
      href: '/nosotros',
    },
    {
      _key: 'industry',
      title: "Your industry's language",
      description:
        'Cases, challenges, and metrics from your sector. We do not translate a generic playbook: we speak the way your business operates.',
      icon: 'globe',
      accent: 'cyan',
      href: '/industrias',
    },
    {
      _key: 'outcome',
      title: 'Service tied to an outcome',
      description:
        'Each lever — paid, SEO, web, CRM — connects to a business outcome, not an isolated tactic.',
      icon: 'target',
      accent: 'orange',
      href: '/servicios',
    },
    {
      _key: 'evidence',
      title: 'Verifiable evidence',
      description:
        'We work with established companies. Our own results, public figures, and technology we can show.',
      icon: 'check',
      accent: 'green',
      href: '/portafolio',
    },
  ],
  processEyebrow: 'Our own technology',
  processTitle: 'Our portal is part of the delivery',
  processDescription: 'Dashboard, assets, and signal in one place. Fewer orphan PDFs; more operation.',
  teamEyebrow: 'Team',
  teamTitle: 'A senior core, not a bench of invisible juniors',
  teamDescription:
    'Account leadership, strategy, media, content, and web product. The faces that actually show up in the audit.',
  teamCtaLabel: 'Schedule your audit',
  teamCtaHref: '/contacto',
  teamFilters: [
    { _key: 'all', id: 'all', label: 'All' },
    { _key: 'web', id: 'web', label: 'Web' },
    { _key: 'redes', id: 'redes', label: 'Social' },
    { _key: 'diseno', id: 'diseno', label: 'Design' },
  ],
  mapEyebrow: 'Global map',
  mapTitle: 'Presence with clients in North America',
  mapDescription:
    'Bases in Mérida, Cancún, and Monterrey. Clients in Mexico, the United States, and Canada — the audit can be remote.',
  closingBadge: 'Next step',
  closingTitle: "Let's talk about your industry",
  closingDescription:
    'Tell us the industry, the goal, and the ICP. We come back with a clear diagnosis and the next step.',
  closingCtaLabel: 'Schedule your audit',
  metaTitle: 'About — Hiweb Marketing',
  metaDescription:
    'A strategic partner with the efficiency of an in-house team and the reach of an enterprise agency.',
};

console.log(doc.heroTitle);
if (!WRITE) {
  console.log('Dry run. Pass --write to publish aboutPage-en.');
  process.exit(0);
}

await client.createOrReplace(doc);
if (!spanish.locale) await client.patch('aboutPage').set({ locale: 'es' }).commit();
console.log('Published aboutPage-en.');
