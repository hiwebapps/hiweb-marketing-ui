/**
 * Clone the Spanish home document and replace copy that exists on
 * https://www.hiwebmarketing.com/en. Unmatched strings stay in Spanish.
 *
 *   npx tsx scripts/sanity/seed-home-en.ts
 *   npx tsx scripts/sanity/seed-home-en.ts --write
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

const SERVICE_COPY: Record<string, { nombre: string; tagline: string }> = {
  seo: {
    nombre: 'SEO/AEO (Local and National)',
    tagline: 'We capture the demand of those who are already looking for what you offer.',
  },
  'google-ads': {
    nombre: 'Google Ads',
    tagline: 'It captures active demand with immediate purchase intent.',
  },
  'meta-ads': {
    nombre: 'Meta Ads',
    tagline: 'Build demand and trust with advanced segmentation.',
  },
  'redes-sociales': {
    nombre: 'Social Networks',
    tagline: 'Strategic content that generates trust and sales.',
  },
  'desarrollo-web': {
    nombre: 'Web Design and Development',
    tagline: 'Fast, clear, and built sites to convert.',
  },
  'crm-automatizacion': {
    nombre: 'CRM & Automation',
    tagline: 'Order your monitoring and improve conversion with processes.',
  },
  branding: {
    nombre: 'Brand Identity & Branding',
    tagline: 'We build clear, strong and memorable brands.',
  },
  'ia-marketing': {
    nombre: 'AI Marketing',
    tagline: 'Intelligent automation that accelerates your results.',
  },
  'community-manager': {
    nombre: 'Community Manager',
    tagline: 'Strategic management that strengthens your brand.',
  },
};

const PILLARS = [
  { title: 'Strategy by Intent', description: 'We attract, nourish and shut down.' },
  { title: 'Technical infrastructure', description: 'Web, SEO and process automation.' },
  { title: 'Real visibility', description: 'Continuous tracking and conversion optimization.' },
  { title: 'Local support', description: 'Strategic consulting based in southeastern Mexico.' },
];

const PROCESS = [
  {
    title: '360 Audit and Diagnosis',
    description:
      "We don't start blindly; we carry out a technical analysis of your website, SEO and current campaigns to detect budget leaks and opportunities for immediate recruitment.",
  },
  {
    title: '360 Strategy',
    description:
      'We design the ecosystem where your communication channels, strategic content and digital guidelines are aligned under a single objective: to generate qualified leads that your sales team can close.',
  },
  {
    title: 'Implementation',
    description:
      'We execute: We create or redesign your website, make your landing pages, optimize your SEO, generate campaigns, content and optimize or implement your CRM with QA and documentation.',
  },
  {
    title: 'ROI-Based Optimization',
    description:
      'We set a pace of continuous optimization based on real data. We meet monthly to review the ROI, adjust conversions and ensure that your investment is always working for you.',
  },
];

const TESTIMONIALS = [
  {
    client: 'Pass your TOEFL',
    name: 'Gaby M.',
    role: 'General Manager',
    quote:
      'We are starting to receive prospects that are more aligned with what we offer. They were no longer just visitors, but people interested in our programs.',
  },
  {
    client: "Paulo's Pizza",
    name: 'Julia T.',
    role: 'Head of Kitchen',
    quote:
      'Showing how pizzas are made changed a lot. Seeing the oven, the dough and the process makes people more eager to come.',
  },
  {
    client: 'Avant',
    name: 'Sebastian S.',
    role: 'CEO',
    quote:
      'Google Ads campaigns were clear, strategic and focused on generating customers with real income intent.',
  },
  {
    client: 'Diazar',
    name: 'David M.',
    role: 'Product Team',
    quote:
      'The digital presence now better communicates what Diazar does and makes it easier for users to understand our value.',
  },
];

const FAQ = [
  {
    id: 'general',
    label: 'General',
    items: [
      {
        question: 'What makes Hiweb different from its competition?',
        answer:
          'Hiweb is a digital marketing agency in Mérida, created to offer the best quality services at an unbeatable price. In addition, Hiweb is a project that was born after years of experimenting, testing and performing in the local, national and international markets, which is why we can ensure results.',
      },
      {
        question: 'How can Hiweb help my business grow?',
        answer:
          'We focus on developing digital strategies as they increase the visibility of your business online, attract quality traffic and convert visits into sales. Whether it\'s optimizing your website or managing paid campaigns, every action is designed to boost your growth.',
      },
      {
        question: 'Which cities does Hiweb operate in?',
        answer: 'All of Mexico, USA, and Canada.',
      },
      {
        question: 'Do they work only with companies in Mérida?',
        answer:
          'No, at Hiweb we work with companies both locally in Mérida and throughout Mexico and internationally. No matter the location of your business, our digital solutions are scalable and adaptable to help you achieve your goals.',
      },
      {
        question: 'How much does it cost to hire Hiweb?',
        answer:
          'The prices of our digital marketing agency vary depending on the service, needs and priority of each project.',
      },
      {
        question: 'What services does Hiweb offer?',
        answer: 'SEO, Google Ads, Meta Ads, social media, web design, and automation.',
      },
      {
        question: 'How do I get started with Hiweb?',
        answer: 'Schedule a free audit using the contact button.',
      },
    ],
  },
  {
    id: 'redes-sociales',
    label: 'Social Networks',
    items: [
      {
        question: 'Does Hiweb manage social media?',
        answer: 'Full management of Instagram, Facebook, TikTok, and LinkedIn.',
      },
    ],
  },
  {
    id: 'seo',
    label: 'SEO',
    items: [
      {
        question: 'How long does it take to see results with SEO?',
        answer: 'Between 3 and 6 months for stable organic results.',
      },
    ],
  },
];

type Section = Record<string, unknown>;

function patch(sections: Section[], slugById: Map<string, string>) {
  for (const section of sections) {
    if (section._type === 'homeHero') {
      section.title = 'Digital Marketing Agency in Mexico: SEO, Ads, Social Media, Web Design and More';
      section.lead =
        'Hiweb is a digital marketing agency in Mexico that helps companies generate leads and sales with SEO, Ads, Social Media and Web Development. We design strategy, execute and measure ROI with clear reporting.';
      const primary = section.primaryCta as Record<string, unknown> | undefined;
      const secondary = section.secondaryCta as Record<string, unknown> | undefined;
      if (primary) primary.label = 'Schedule your Audit';
      if (secondary) secondary.label = 'Success Stories';
    }
    if (section._type === 'homePillars') {
      const intro = section.intro as Record<string, unknown>;
      intro.title = 'The strategic partner to scale your operation in México';
      intro.description =
        'Stop hiring isolated services and start building a digital ecosystem. At Hiweb we unify strategy, pattern and technology to turn your investment into a constant lead engine.';
      const items = section.items as Array<Record<string, unknown>>;
      items.forEach((item, index) => {
        const next = PILLARS[index];
        if (!next) return;
        item.title = next.title;
        item.description = next.description;
      });
    }
    if (section._type === 'homeServices') {
      const intro = section.intro as Record<string, unknown>;
      intro.eyebrow = 'Services';
      intro.title = 'Digital marketing services in México';
      intro.description =
        'We unify strategy, execution and measurement to scale demand and sales. Choose a service or work on a full stack.';
      const items = section.items as Array<Record<string, unknown>> | undefined;
      for (const item of items ?? []) {
        const ref = item.service as { _ref?: string } | undefined;
        const slug = ref?._ref ? slugById.get(ref._ref) : undefined;
        const copy = slug ? SERVICE_COPY[slug] : undefined;
        if (!copy) continue;
        item.nombre = copy.nombre;
        item.tagline = copy.tagline;
      }
    }
    if (section._type === 'homeStories') {
      const intro = section.intro as Record<string, unknown>;
      intro.title = 'See what our customers are saying';
      const items = section.items as Array<Record<string, unknown>>;
      items.forEach((item, index) => {
        const next = TESTIMONIALS[index];
        if (!next) return;
        item.client = next.client;
        item.quote = next.quote;
        item.name = next.name;
        item.role = next.role;
      });
    }
    if (section._type === 'homeProcess') {
      const intro = section.intro as Record<string, unknown>;
      intro.title = 'The Process: From Strategy to Profitability';
      const items = section.items as Array<Record<string, unknown>>;
      items.forEach((item, index) => {
        const next = PROCESS[index];
        if (!next) return;
        item.title = next.title;
        item.description = next.description;
      });
    }
    if (section._type === 'homeMetrics') {
      const intro = section.intro as Record<string, unknown>;
      intro.title = 'Backed by our experience';
      intro.titleMuted = 'Global Presence · Dominio';
      const items = section.items as Array<Record<string, unknown>>;
      if (items[0]) {
        items[0].suffix = ' Years';
        items[0].label = 'Experience consolidating digital strategies for companies seeking scale and authority in their market.';
      }
      if (items[1]) {
        items[1].label = 'In additional revenues generated for our customers by optimizing their digital ecosystems.';
      }
    }
    if (section._type === 'homeFaq') {
      const intro = section.intro as Record<string, unknown>;
      intro.title = 'Do you have doubts? We have answers';
      const categories = section.categories as Array<Record<string, unknown>>;
      for (const category of categories) {
        const next = FAQ.find((item) => item.id === category.id);
        if (!next) continue;
        category.label = next.label;
        const current = category.items as Array<Record<string, unknown>>;
        category.items = next.items.map((item, index) => ({
          _type: 'faqItem',
          _key: current[index]?._key ?? `faq-${category.id}-${index}`,
          question: item.question,
          answer: item.answer,
        }));
      }
    }
    if (section._type === 'homeCta') {
      section.badge = 'Marketing 360';
      section.title = 'Take your business to the next digital level';
      section.description =
        'True scaling happens when your networks, your website and your pattern work under the same objective. In Hiweb, we become your comprehensive marketing department to eliminate operational friction and boost your profitability. If your company is ready to stop hiring tasks and start investing in a system, let\'s talk.';
      const primary = section.primaryCta as Record<string, unknown> | undefined;
      if (primary) primary.label = 'Schedule your Audit';
    }
  }
}

function spanishLeftovers(value: unknown, trail: string, found: string[]) {
  if (typeof value === 'string' && /[áéíóúñ¿¡]|Agencia|Nuestro|experiencia|equipo|Preguntas/i.test(value)) {
    found.push(`${trail}: ${value.slice(0, 140)}`);
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => spanishLeftovers(item, `${trail}[${index}]`, found));
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      if (key.startsWith('_') || key === 'asset' || key === 'href') continue;
      spanishLeftovers(child, trail ? `${trail}.${key}` : key, found);
    }
  }
}

async function main() {
  const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: '2026-09-18',
    token,
    useCdn: false,
  });

  const services = await client.fetch<Array<{ _id: string; slug: string }>>(
    `*[_type == "service"]{ _id, "slug": slug.current }`,
  );
  const slugById = new Map(services.map((item) => [item._id, item.slug]));

  const home = await client.getDocument('homePage');
  if (!home?.sections) throw new Error('Spanish homePage has no sections');

  const sections = structuredClone(home.sections) as Section[];
  patch(sections, slugById);

  const doc = {
    _id: 'homePage-en',
    _type: 'homePage',
    sections,
    metaTitle: 'Digital Marketing Agency in Mexico | SEO, SEM, and Web',
    metaDescription:
      'Hiweb is a digital marketing agency in Mexico that helps companies generate leads and sales with SEO, Ads, Social Media and Web Development. We design strategy, execute and measure ROI with clear reporting.',
    ogImage: home.ogImage,
  };

  const leftovers: string[] = [];
  spanishLeftovers(doc.sections, 'sections', leftovers);
  console.log('Spanish strings left on Home (EN):');
  for (const line of leftovers) console.log(`- ${line}`);

  if (!WRITE) {
    console.log('\nDry run. Re-run with --write to publish homePage-en.');
    return;
  }

  await client.createOrReplace(doc);
  console.log('Published homePage-en');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
