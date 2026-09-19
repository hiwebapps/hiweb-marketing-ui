/**
 * Seed dataset web-2026 from src/content + src/data/site.ts.
 *
 *   npm run sanity:seed          # dry-run
 *   npm run sanity:seed:write    # publish
 */
import fs from 'node:fs';
import path from 'node:path';
import { createClient, type SanityClient } from '@sanity/client';
import {
  HOME_FAQ_CATEGORIES,
  PROCESS_PHASES,
  SITE,
  TEAM_MEMBERS,
} from '../../src/data/site';
import { industryServiceDescription } from '../../src/data/industryServices';

const ROOT = process.cwd();
const WRITE = process.argv.includes('--write');

type JsonDoc = Record<string, unknown>;

function loadDotEnv() {
  for (const file of ['.env.local', '.env']) {
    const abs = path.join(ROOT, file);
    if (!fs.existsSync(abs)) continue;
    for (const line of fs.readFileSync(abs, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq < 1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

loadDotEnv();

const PROJECT_ID = process.env.PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || 'fxardjr1';
const DATASET = process.env.PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'web-2026';
const TOKEN = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

function readJsonDir(dir: string) {
  const abs = path.join(ROOT, dir);
  return fs
    .readdirSync(abs)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const id = file.replace(/\.json$/, '');
      const data = JSON.parse(fs.readFileSync(path.join(abs, file), 'utf8')) as JsonDoc;
      return { id, data };
    });
}

function publicPath(webPath: string | undefined) {
  if (!webPath || !webPath.startsWith('/')) return null;
  const abs = path.join(ROOT, 'public', webPath.replace(/^\//, ''));
  return fs.existsSync(abs) ? abs : null;
}

function slugifyName(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function key(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function mdToBlocks(markdown: string) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: JsonDoc[] = [];
  let para: string[] = [];

  const flush = () => {
    const text = para.join(' ').trim();
    para = [];
    if (!text) return;
    blocks.push(textBlock('normal', text));
  };

  for (const line of lines) {
    if (/^### /.test(line)) {
      flush();
      blocks.push(textBlock('h3', line.replace(/^###\s+/, '')));
    } else if (/^## /.test(line)) {
      flush();
      blocks.push(textBlock('h2', line.replace(/^##\s+/, '')));
    } else if (line.trim() === '') {
      flush();
    } else {
      para.push(line.trim());
    }
  }
  flush();
  return blocks;
}

function textBlock(style: string, raw: string) {
  const text = raw.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  return {
    _type: 'block',
    _key: key('b'),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: key('s'), text, marks: [] }],
  };
}

function parsePost(file: string) {
  const raw = fs.readFileSync(file, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`No frontmatter in ${file}`);
  const fm = match[1];
  const body = match[2].trim();
  const str = (name: string) => {
    const hit = fm.match(new RegExp(`^${name}:\\s*"?([^"\\n]+)"?\\s*$`, 'm'));
    return hit?.[1]?.trim();
  };
  const faqs: { question: string; answer: string }[] = [];
  const faqBlocks = fm.split(/\n\s*-\s+question:/).slice(1);
  for (const block of faqBlocks) {
    const question = block.match(/^\s*"?([^"\n]+)"?/)?.[1]?.trim();
    const answer = block.match(/answer:\s*"?([^"\n]+)"?/)?.[1]?.trim();
    if (question && answer) faqs.push({ question, answer });
  }
  return {
    title: str('title') ?? '',
    description: str('description') ?? '',
    keyword: str('keyword') ?? '',
    autor: str('autor') ?? 'Equipo Hiweb',
    fecha: str('fecha') ?? '2026-01-01',
    featured: /featured:\s*true/.test(fm),
    categoriaServicio: str('categoriaServicio'),
    categoriaIndustria: str('categoriaIndustria'),
    faqs,
    body,
  };
}

async function uploadImage(client: SanityClient, webPath: string | undefined, alt: string) {
  const abs = publicPath(webPath);
  if (!abs) return undefined;
  const stream = fs.createReadStream(abs);
  const asset = await client.assets.upload('image', stream, { filename: path.basename(abs) });
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
    alt,
    hotspot: { _type: 'sanity.imageHotspot', x: 0.5, y: 0.5, height: 1, width: 1 },
  };
}

async function main() {
  const industries = readJsonDir('src/content/industrias');
  const services = readJsonDir('src/content/servicios');
  const cases = readJsonDir('src/content/casos');
  const postFiles = fs
    .readdirSync(path.join(ROOT, 'src/content/posts'))
    .filter((file) => file.endsWith('.md'))
    .map((file) => ({
      id: file.replace(/\.md$/, ''),
      ...parsePost(path.join(ROOT, 'src/content/posts', file)),
    }));

  const planned = [
    `siteSettings`,
    `homePage`,
    `aboutPage`,
    ...services.map((item) => `service-${item.id}`),
    ...industries.map((item) => `industry-${item.id}`),
    ...cases.map((item) => `case-${item.id}`),
    `author-equipo-hiweb`,
    ...postFiles.map((item) => `post-${item.id}`),
    ...TEAM_MEMBERS.map((member, index) => `person-${index + 1}-${slugifyName(member.name)}`),
  ];

  console.log(`${WRITE ? 'WRITE' : 'DRY-RUN'} → ${PROJECT_ID}/${DATASET}`);
  console.log(`Documents: ${planned.length}`);
  for (const id of planned) console.log(`  - ${id}`);

  if (!WRITE) {
    console.log('\nRe-run with --write and SANITY_API_WRITE_TOKEN to publish.');
    return;
  }

  if (!TOKEN) {
    throw new Error('SANITY_API_WRITE_TOKEN is required for --write');
  }

  const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: '2026-09-18',
    token: TOKEN,
    useCdn: false,
  });

  const docs: JsonDoc[] = [];

  const serviceDocs = [];
  for (const item of services) {
    const heroImage = await uploadImage(
      client,
      item.data.heroImage as string | undefined,
      (item.data.heroImageAlt as string) ?? `Imagen de ${item.data.nombre}`,
    );
    serviceDocs.push({
      _id: `service-${item.id}`,
      _type: 'service',
      nombre: item.data.nombre,
      slug: { _type: 'slug', current: item.id },
      orden: item.data.orden,
      tagline: item.data.tagline,
      heroTitle: item.data.heroTitle,
      heroDescription: item.data.heroDescription,
      heroImage,
      heroBadge: item.data.heroBadge,
      cards: (item.data.cards as JsonDoc[]).map((card) => ({ ...card, _type: 'titledBlock', _key: key('c') })),
      proceso: (item.data.proceso as JsonDoc[]).map((step) => ({ ...step, _type: 'titledBlock', _key: key('p') })),
      faqs: (item.data.faqs as JsonDoc[]).map((faq) => ({ ...faq, _type: 'faqItem', _key: key('f') })),
      metaTitle: `${item.data.nombre} — Hiweb Marketing`,
      metaDescription: item.data.tagline,
    });
  }
  docs.push(...serviceDocs);

  for (const item of industries) {
    const heroImage = await uploadImage(
      client,
      item.data.heroImage as string | undefined,
      (item.data.heroImageAlt as string) ?? `Imagen de ${item.data.nombre}`,
    );
    docs.push({
      _id: `industry-${item.id}`,
      _type: 'industry',
      nombre: item.data.nombre,
      slug: { _type: 'slug', current: item.id },
      orden: item.data.orden,
      tagline: item.data.tagline,
      heroTitle: item.data.heroTitle,
      heroDescription: item.data.heroDescription,
      heroImage,
      heroBadge: item.data.heroBadge,
      retos: item.data.retos,
      porQue: (item.data.porQue as JsonDoc[]).map((block) => ({ ...block, _type: 'titledBlock', _key: key('q') })),
      faqs: (item.data.faqs as JsonDoc[]).map((faq) => ({ ...faq, _type: 'faqItem', _key: key('f') })),
      serviceBlurbs: services.map((service) => ({
        _type: 'serviceBlurb',
        _key: service.id,
        service: { _type: 'reference', _ref: `service-${service.id}` },
        description: industryServiceDescription(item.id, service.id, String(item.data.nombre)),
      })),
      metaTitle: `${item.data.nombre} — Hiweb Marketing`,
      metaDescription: item.data.heroDescription,
    });
  }

  for (const item of cases) {
    docs.push({
      _id: `case-${item.id}`,
      _type: 'caseStudy',
      cliente: item.data.cliente,
      slug: { _type: 'slug', current: item.id },
      industria: { _type: 'reference', _ref: `industry-${item.data.industria}` },
      servicios: (item.data.servicios as string[]).map((slug) => ({
        _type: 'reference',
        _key: slug,
        _ref: `service-${slug}`,
      })),
      resultadoFrase: item.data.resultadoFrase,
      titulo: item.data.titulo,
      resumen: item.data.resumen,
      destacado: item.data.destacado ?? false,
      accent: item.data.accent ?? 'cyan',
      metricas: (item.data.metricas as JsonDoc[]).map((metric) => ({ ...metric, _type: 'metric', _key: key('m') })),
      reto: item.data.reto,
      estrategia: item.data.estrategia,
      fases: (item.data.fases as JsonDoc[]).map((fase) => ({ ...fase, _type: 'titledBlock', _key: key('z') })),
      testimonio: item.data.testimonio,
      metaTitle: `${item.data.cliente} — ${item.data.resultadoFrase}`,
      metaDescription: item.data.resumen,
    });
  }

  docs.push({
    _id: 'author-equipo-hiweb',
    _type: 'author',
    name: 'Equipo Hiweb',
    slug: { _type: 'slug', current: 'equipo-hiweb' },
  });

  for (const post of postFiles) {
    docs.push({
      _id: `post-${post.id}`,
      _type: 'post',
      title: post.title,
      slug: { _type: 'slug', current: post.id },
      description: post.description,
      keyword: post.keyword,
      autor: post.autor,
      author: { _type: 'reference', _ref: 'author-equipo-hiweb' },
      fecha: post.fecha,
      featured: post.featured,
      categoriaServicio: post.categoriaServicio
        ? { _type: 'reference', _ref: `service-${post.categoriaServicio}` }
        : undefined,
      categoriaIndustria: post.categoriaIndustria
        ? { _type: 'reference', _ref: `industry-${post.categoriaIndustria}` }
        : undefined,
      faqs: post.faqs.map((faq) => ({ ...faq, _type: 'faqItem', _key: key('f') })),
      body: mdToBlocks(post.body),
      metaTitle: `${post.title} — Hiweb`,
      metaDescription: post.description,
    });
  }

  let personIndex = 0;
  for (const member of TEAM_MEMBERS) {
    personIndex += 1;
    const photo = await uploadImage(client, member.photo, member.name);
    docs.push({
      _id: `person-${personIndex}-${slugifyName(member.name)}`,
      _type: 'person',
      name: member.name,
      role: member.role,
      bio: member.bio,
      photo,
      category: member.category,
      accent: member.accent,
      orden: personIndex,
      socials: member.socials,
    });
  }

  docs.push({
    _id: 'siteSettings',
    _type: 'siteSettings',
    name: SITE.name,
    legalName: SITE.legalName,
    tagline: SITE.tagline,
    email: SITE.email,
    phone: SITE.phone,
    phoneHref: SITE.phoneHref,
    whatsapp: SITE.whatsapp,
    locales: [...SITE.locales],
    socials: SITE.socials.map((item) => ({ ...item, _key: key('n') })),
    metaTitle: 'Hiweb Marketing — Partner estratégico',
    metaDescription: SITE.tagline,
  });

  docs.push({
    _id: 'homePage',
    _type: 'homePage',
    heroTitle: 'Experiencias digitales que sí mueven pipeline.',
    heroLead:
      'Estrategia, diseño y media como un solo sistema. Menos improvisación; más señal, oferta clara y web que cierra.',
    primaryCta: { _type: 'cta', label: 'Agenda tu auditoría gratuita', href: '/contacto' },
    secondaryCta: { _type: 'cta', label: 'Ver Casos de Éxito', href: '/portafolio' },
    process: PROCESS_PHASES.map((phase) => ({ ...phase, _type: 'processStep', _key: phase.index })),
    faqCategories: HOME_FAQ_CATEGORIES.map((category) => ({
      _type: 'faqCategory',
      _key: category.id,
      id: category.id,
      label: category.label,
      items: category.items.map((item) => ({ ...item, _type: 'faqItem', _key: key('f') })),
    })),
    metaTitle: 'Hiweb Marketing — Partner estratégico',
    metaDescription: SITE.tagline,
  });

  const aboutImage = await uploadImage(
    client,
    '/images/team/hiweb-team.png',
    'Equipo Hiweb con playeras de la marca',
  );
  docs.push({
    _id: 'aboutPage',
    _type: 'aboutPage',
    heroTitle: 'Expertise colectivo, tecnología propia, capacidad cross-border.',
    heroDescription: SITE.tagline,
    heroImage: aboutImage,
    historyEyebrow: 'Historia',
    historyTitle: 'De agencia de tácticas a arquitectura por industria',
    historyDescription:
      'Hiweb nace de operar cuentas consolidadas donde el catálogo de servicios no bastaba. El comprador no busca “SEO”: busca un resultado en su sector. Reorganizamos oferta, prueba y equipo alrededor de eso.',
    historyColumns: [
      {
        _key: 'vision',
        title: 'Nuestra visión',
        paragraphs: [
          'Dejar de vender tácticas sueltas. El marketing que importa conecta oferta, media y web en un sistema que el comité entiende y ventas puede usar.',
          'Queremos ser el partner de industria que un director de marketing recomienda sin reservas — evidencia primero, teatro nunca.',
        ],
      },
      {
        _key: 'ops',
        title: 'Cómo operamos',
        paragraphs: [
          'Hiweb nace de cuentas consolidadas donde el catálogo no bastaba. Reorganizamos oferta, prueba y equipo alrededor del resultado por sector.',
          'Un núcleo senior en estrategia, performance, creativo y producto web. La auditoría es el filtro: si no hay fit, lo decimos en la misma llamada.',
        ],
      },
    ],
    metaTitle: 'Nosotros — Hiweb Marketing',
    metaDescription: SITE.tagline,
  });

  const tx = client.transaction();
  for (const doc of docs) tx.createOrReplace(doc as never);
  await tx.commit({ autoGenerateArrayKeys: true });
  console.log(`Published ${docs.length} documents to ${DATASET}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
