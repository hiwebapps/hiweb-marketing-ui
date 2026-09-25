/**
 * Add the SEO-only sections (Por qué and Planes) to the other services,
 * in the same position. Prices stay "A cotizar".
 *
 *   npx tsx scripts/sanity/add-missing-service-sections.ts --write
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

type Section = { _type?: string; _key?: string; cards?: { title?: string }[]; [key: string]: unknown };

function whySection(nombre: string): Section {
  return {
    _key: 'why',
    _type: 'serviceWhy',
    title: `¿Por qué elegir a Hiweb para ${nombre}?`,
    description: 'No somos solo proveedores; somos tu partner estratégico en el crecimiento digital.',
    ctaLabel: 'Agenda un diagnóstico',
    ctaHref: '/contacto',
    cards: [
      {
        _key: 'why-datos',
        _type: 'serviceWhyCard',
        icon: 'activity',
        accent: 'cyan',
        title: 'Enfoque en datos, no en suposiciones',
        description:
          'Utilizamos herramientas de vanguardia para analizar el comportamiento real de tus competidores y usuarios.',
      },
      {
        _key: 'why-transparencia',
        _type: 'serviceWhyCard',
        icon: 'badge',
        accent: 'orange',
        title: 'Transparencia total',
        description: 'Recibirás informes claros sobre el avance del trabajo y el impacto real en tus resultados.',
      },
      {
        _key: 'why-adaptacion',
        _type: 'serviceWhyCard',
        icon: 'spark',
        accent: 'purple',
        title: 'Adaptación constante',
        description: 'El plan se ajusta cuando cambia el mercado, la plataforma o el objetivo del negocio.',
      },
    ],
  };
}

function plansSection(slug: string, nombre: string, bullets: string[]): Section {
  const note =
    slug === 'desarrollo-web'
      ? 'El alcance del sitio se cotiza junto con el resto del plan de marketing, si lo necesitas.'
      : 'Se puede combinar con nuestro servicio de diseño y desarrollo web para una base técnica sólida desde el inicio.';
  const shared = bullets.slice(0, 4);
  const tiers = [
    { key: 'local', name: 'Local', extra: 'Alcance en tu ciudad' },
    { key: 'nacional', name: 'Nacional', extra: 'Alcance en todo México', featured: true },
    { key: 'internacional', name: 'Internacional', extra: 'Varios países' },
  ];
  return {
    _key: 'plans',
    _type: 'servicePlans',
    eyebrow: 'Planes',
    title: `Planes de ${nombre}`,
    description:
      'El alcance se define contigo: local, nacional o internacional. El precio se cotiza según el mercado y el objetivo.',
    note,
    ...(slug === 'desarrollo-web'
      ? {}
      : { noteLabel: 'servicio de diseño y desarrollo web', noteHref: '/servicios/desarrollo-web' }),
    ctaLabel: 'Cotiza ahora con nosotros',
    ctaHref: '/contacto',
    plans: tiers.map((tier) => ({
      _key: tier.key,
      _type: 'servicePlan',
      name: tier.name,
      price: 'A cotizar',
      featured: Boolean(tier.featured),
      includes: [...shared, tier.extra].filter(Boolean),
    })),
  };
}

function insertAfter(sections: Section[], afterType: string, additions: Section[]) {
  const index = sections.findIndex((section) => section._type === afterType);
  const at = index === -1 ? sections.length : index + 1;
  return [...sections.slice(0, at), ...additions, ...sections.slice(at)];
}

async function main() {
  const client = createClient({
    projectId: 'fxardjr1',
    dataset: 'web-2026',
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  });

  const docs = await client.fetch<{ _id: string; slug: string; nombre: string; sections: Section[] }[]>(
    `*[_type == "service" && !(_id in path("drafts.**"))]{ _id, "slug": slug.current, nombre, sections }`,
  );

  for (const doc of docs) {
    const types = new Set((doc.sections ?? []).map((section) => section._type));
    const missing: Section[] = [];
    if (!types.has('serviceWhy')) missing.push(whySection(doc.nombre));
    if (!types.has('servicePlans')) {
      const overview = (doc.sections ?? []).find((section) => section._type === 'serviceOverview');
      const bullets = (overview?.cards ?? []).map((card) => card.title).filter((title): title is string => Boolean(title));
      missing.push(plansSection(doc.slug, doc.nombre, bullets));
    }
    if (!missing.length) {
      console.log(`${doc._id}: already has why and plans`);
      continue;
    }
    const next = insertAfter(doc.sections ?? [], 'servicePitch', missing);
    console.log(`${doc._id}: add ${missing.map((section) => section._type).join(', ')}`);
    if (!WRITE) continue;
    await client.patch(doc._id).set({ sections: next }).commit();
    console.log(`  patched ${doc._id}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
