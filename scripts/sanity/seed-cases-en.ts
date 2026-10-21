import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';
import { CASES_EN } from '../../src/data/cases-en';
import { markdownToPortableText } from '../../src/lib/content/rich-text';

const WRITE = process.argv.includes('--write');
const PROJECT_ID = process.env.PUBLIC_SANITY_PROJECT_ID || 'fxardjr1';
const DATASET = process.env.PUBLIC_SANITY_DATASET || 'web-2026';

function getSanityToken() {
  if (process.env.SANITY_API_WRITE_TOKEN) return process.env.SANITY_API_WRITE_TOKEN;
  const file = path.join(os.homedir(), '.config', 'sanity', 'config.json');
  if (fs.existsSync(file)) {
    const config = JSON.parse(fs.readFileSync(file, 'utf8')) as { authToken?: string };
    if (config.authToken) return config.authToken;
  }
  return '';
}

const token = getSanityToken();
if (!token) throw new Error('No Sanity write token available in env or CLI config.');

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

function slugifyKey(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
}

async function main() {
  console.log(`Starting sync of ${Object.keys(CASES_EN).length} English cases to Sanity (${PROJECT_ID}/${DATASET})...`);
  console.log(`Mode: ${WRITE ? 'WRITE (Live commit)' : 'DRY-RUN (Pass --write to commit)'}\n`);

  for (const [slug, en] of Object.entries(CASES_EN)) {
    const id = `case-${slug}-en`;
    const doc = await client.fetch<any>(`*[_id == $id][0]`, { id });

    if (!doc) {
      console.warn(`[SKIP] Document ${id} not found in Sanity.`);
      continue;
    }

    const fases = en.fases.map((f, i) => ({
      _key: `phase-${i + 1}-${slugifyKey(f.title)}`,
      _type: 'titledBlock',
      title: f.title,
      description: f.description,
    }));

    const metricas = en.metricas.map((m, i) => ({
      _key: `metric-${i + 1}-${slugifyKey(m.label)}`,
      _type: 'metric',
      label: m.label,
      valor: m.valor,
      prefix: m.prefix,
      suffix: m.suffix,
      despues: m.despues,
      antes: m.antes,
    }));

    // Update sections
    const existingSections = Array.isArray(doc.sections) ? doc.sections : [];
    const updatedSections = existingSections.map((sec: any) => {
      switch (sec._type) {
        case 'caseContext':
          return {
            ...sec,
            retoEyebrow: 'Challenge',
            retoTitle: 'Initial Context',
            reto: markdownToPortableText(en.reto),
            estrategiaEyebrow: 'Strategy',
            estrategiaTitle: 'Applied Services',
            estrategia: markdownToPortableText(en.estrategia),
          };
        case 'caseProcess':
          return {
            ...sec,
            eyebrow: 'Execution',
            title: 'How the Work Was Delivered',
            fases,
          };
        case 'caseMetrics':
          return {
            ...sec,
            eyebrow: 'Metrics',
            title: 'Before and After',
            titleMuted: 'in verifiable numbers',
            description: 'Baseline included where applicable. True business impact, not vanity metrics.',
            items: metricas,
            primaryCta: {
              _type: 'cta',
              href: '/contact',
              label: 'Schedule your audit',
            },
            secondaryCta: {
              _type: 'cta',
              href: '/en/portfolio',
              label: 'View more cases',
            },
          };
        case 'caseTestimonial':
          return {
            ...sec,
            eyebrow: 'Testimonial',
            title: `What ${en.cliente} says`,
            description: 'Client voice. Verified feedback from project stakeholders.',
          };
        case 'caseRelated':
          return {
            ...sec,
            eyebrow: 'Case Studies',
            title: 'More cases from this industry',
            description: 'Client, industry, and the work delivered.',
          };
        case 'caseCta':
          return {
            ...sec,
            badge: 'Next Step',
            title: 'Schedule a similar diagnosis',
            description: 'Tell us your industry, goal, and ICP. We will give you a clear diagnosis and the next step.',
            primaryCta: {
              _type: 'cta',
              href: '/contact',
              label: 'Schedule your audit',
            },
          };
        default:
          return sec;
      }
    });

    const patch: Record<string, any> = {
      titulo: en.cliente,
      resumen: en.resumen,
      reto: en.reto,
      estrategia: en.estrategia,
      fases,
      metricas,
      metaTitle: en.seo.metaTitle,
      metaDescription: en.seo.metaDescription,
      sections: updatedSections,
    };

    if (en.testimonio) {
      patch.testimonio = {
        name: en.testimonio.name,
        role: en.testimonio.role,
        quote: en.testimonio.quote,
      };
    }

    console.log(`[${WRITE ? 'UPDATING' : 'READY'}] ${id} (${en.cliente})`);
    if (WRITE) {
      await client.patch(id).set(patch).commit();
      // If a draft exists, patch it as well so Studio reflects immediately
      const draftId = `drafts.${id}`;
      const draft = await client.fetch<any>(`*[_id == $draftId][0]`, { draftId });
      if (draft) {
        await client.patch(draftId).set(patch).commit();
      }
    }
  }

  console.log(`\n${WRITE ? 'Successfully synced all cases to Sanity!' : 'Dry run complete. Run with --write to apply changes.'}`);
}

main().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
