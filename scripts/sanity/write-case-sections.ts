/**
 * Copy each case study's page fields into sections[].
 *
 *   npx tsx scripts/sanity/write-case-sections.ts
 *   npx tsx scripts/sanity/write-case-sections.ts --write
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

type Block = { _key?: string; title?: string; description?: string };
type Metric = {
  _key?: string;
  valor?: number;
  label?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  antes?: string;
  despues?: string;
};
type ImageItem = {
  _key?: string;
  _type?: string;
  asset?: { _ref?: string };
  alt?: string;
  hotspot?: unknown;
  crop?: unknown;
};

type CaseDoc = {
  _id: string;
  cliente?: string;
  anio?: string;
  imagenesProyecto?: ImageItem[];
  reto?: string;
  estrategia?: string;
  fases?: Block[];
  metricas?: Metric[];
  testimonio?: { quote?: string; name?: string; role?: string };
  sections?: unknown[];
};

function sectionsFor(doc: CaseDoc) {
  const cliente = doc.cliente || 'el cliente';
  const images = (doc.imagenesProyecto ?? [])
    .filter((image) => image?.asset?._ref)
    .map((image, index) => ({
      _key: image._key || `img-${index}`,
      _type: 'image',
      asset: image.asset,
      alt: image.alt,
      hotspot: image.hotspot,
      crop: image.crop,
    }));

  const sections: Record<string, unknown>[] = [
    {
      _key: 'hero',
      _type: 'caseHero',
      ...(doc.anio ? { anio: doc.anio } : {}),
      ...(images.length ? { imagenesProyecto: images } : {}),
    },
    {
      _key: 'context',
      _type: 'caseContext',
      retoEyebrow: 'Reto',
      retoTitle: 'Contexto inicial',
      reto: doc.reto ?? '',
      estrategiaEyebrow: 'Estrategia',
      estrategiaTitle: 'Servicios aplicados',
      estrategia: doc.estrategia ?? '',
    },
    {
      _key: 'process',
      _type: 'caseProcess',
      eyebrow: 'Ejecución',
      title: 'Cómo se hizo el trabajo',
      fases: (doc.fases ?? [])
        .filter((item) => item.title)
        .map((item, index) => ({
          _key: item._key || `fase-${index}`,
          _type: 'titledBlock',
          title: item.title,
          description: item.description ?? '',
        })),
    },
    {
      _key: 'metrics',
      _type: 'caseMetrics',
      eyebrow: 'Cifras',
      title: 'Antes y después',
      titleMuted: 'en cifras verificables',
      description: 'Baseline incluido cuando aplica. Números de negocio, no recortes de Ads Manager.',
      items: (doc.metricas ?? [])
        .filter((item) => item.label)
        .map((item, index) => ({
          _key: item._key || `metric-${index}`,
          _type: 'metric',
          valor: item.valor,
          label: item.label,
          prefix: item.prefix,
          suffix: item.suffix,
          decimals: item.decimals,
          antes: item.antes,
          despues: item.despues,
        })),
      primaryCta: { _type: 'cta', label: 'Agenda tu auditoría', href: '/contacto' },
      secondaryCta: { _type: 'cta', label: 'Ver más casos', href: '/portafolio' },
    },
  ];

  if (doc.testimonio?.quote) {
    sections.push({
      _key: 'testimonial',
      _type: 'caseTestimonial',
      eyebrow: 'Testimonio',
      title: `Lo que dice ${cliente}`,
      description: 'Voz del cliente. Sin quotes inventadas ni outcomes ornamentales.',
      quote: doc.testimonio.quote,
      name: doc.testimonio.name ?? '',
      role: doc.testimonio.role ?? '',
    });
  }

  sections.push(
    {
      _key: 'related',
      _type: 'caseRelated',
      eyebrow: 'Casos',
      title: 'Más casos de esta industria',
      description: 'Cliente, industria y outcome. Sin portfolio ornamental.',
    },
    {
      _key: 'cta',
      _type: 'caseCta',
      badge: 'Siguiente paso',
      title: 'Agenda un diagnóstico similar',
      description: 'Cuéntanos industria, objetivo e ICP. Te devolvemos un diagnóstico claro y el siguiente paso.',
      primaryCta: { _type: 'cta', label: 'Agenda tu auditoría', href: '/contacto' },
    },
  );

  return sections;
}

const docs = await client.fetch<CaseDoc[]>(
  `*[_type == "caseStudy" && !(_id in path("drafts.**"))]{
    _id, cliente, anio, imagenesProyecto, reto, estrategia, fases, metricas, testimonio, sections
  }`,
);

let updated = 0;
for (const doc of docs) {
  if (Array.isArray(doc.sections) && doc.sections.length) {
    console.log(`skip ${doc._id} (already has sections)`);
    continue;
  }
  const sections = sectionsFor(doc);
  console.log(`${WRITE ? 'write' : 'dry'} ${doc._id} · ${sections.map((item) => item._type).join(', ')}`);
  if (!WRITE) continue;
  await client.patch(doc._id).set({ sections }).commit();
  updated += 1;
}

console.log(WRITE ? `Updated ${updated} cases.` : `Dry run. ${docs.length} cases. Pass --write to publish the sections.`);
