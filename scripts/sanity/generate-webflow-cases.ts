/**
 * Build src/data/webflow-cases.ts and src/content/casos/*.json from the scrape dump.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const RAW = path.join(ROOT, 'scripts/sanity/webflow-cases-raw.json');

type RawPage = {
  slug: string;
  title: string;
  desc: string;
  h1: string;
  cover: string;
  metrics: { value: string; label: string; detail: string }[];
  fases: { title: string; description: string }[];
  textSample: string;
};

type Accent = 'cyan' | 'orange' | 'purple';

const MAP: Record<
  string,
  {
    industria?: string;
    servicios: string[];
    accent: Accent;
    destacado: boolean;
    testimonio?: { quote: string; name: string; role: string };
  }
> = {
  'avant-rent-a-car': {
    industria: 'turismo-hoteleria',
    servicios: ['seo', 'google-ads', 'desarrollo-web'],
    accent: 'cyan',
    destacado: true,
    testimonio: {
      quote:
        'Las campañas de Google Ads fueron claras, estratégicas y enfocadas en generar clientes con intención real de renta.',
      name: 'Sebastian S.',
      role: 'Área de Marketing, Avant Rent a Car',
    },
  },
  diazar: {
    industria: 'saas',
    servicios: ['seo', 'desarrollo-web', 'redes-sociales', 'google-ads'],
    accent: 'orange',
    destacado: true,
    testimonio: {
      quote:
        'El nuevo sitio y la estrategia digital nos han ayudado a recibir prospectos más interesados en conocer la plataforma.',
      name: 'Carolina M.',
      role: 'Área Comercial, Diazar',
    },
  },
  'happy-store': {
    servicios: ['redes-sociales', 'meta-ads'],
    accent: 'purple',
    destacado: true,
    testimonio: {
      quote:
        'Con el apoyo de Hiweb logramos que la marca se viera más profesional y cercana. Hoy sentimos una conexión más real con quienes nos compran.',
      name: 'Amanda D.',
      role: 'Fundadora, Happy Store',
    },
  },
  'peninsula-project': {
    industria: 'turismo-hoteleria',
    servicios: ['redes-sociales', 'meta-ads'],
    accent: 'cyan',
    destacado: true,
    testimonio: {
      quote:
        'Ahora las personas entienden mejor lo que hacemos. Las redes nos ayudaron a contar la experiencia de viajar con Península Project, no solo a mostrar destinos.',
      name: 'Lydia R.',
      role: 'Área de Experiencias, Península Project',
    },
  },
  'el-secreto': {
    servicios: ['redes-sociales', 'meta-ads'],
    accent: 'orange',
    destacado: false,
  },
  restaura: {
    industria: 'salud',
    servicios: ['redes-sociales', 'meta-ads'],
    accent: 'purple',
    destacado: false,
  },
  'eagle-superabrasives': {
    industria: 'manufactura',
    servicios: ['desarrollo-web', 'seo'],
    accent: 'cyan',
    destacado: false,
  },
  gaios: {
    industria: 'restaurantes',
    servicios: ['redes-sociales', 'meta-ads'],
    accent: 'orange',
    destacado: false,
  },
  'zapateria-la-peninsula': {
    servicios: ['redes-sociales', 'meta-ads'],
    accent: 'purple',
    destacado: false,
  },
  'enfoque-21': {
    servicios: ['seo', 'redes-sociales'],
    accent: 'cyan',
    destacado: false,
  },
  'pass-your-toefl': {
    servicios: ['seo', 'desarrollo-web', 'google-ads'],
    accent: 'orange',
    destacado: false,
    testimonio: {
      quote:
        'Contratamos a Hiweb para que nos ayudara a tener más alumnos, y realmente ha funcionado muy bien. Desde que empezamos a trabajar con ellos, hemos notado un aumento claro en las inscripciones. El equipo es profesional, atento y siempre está pendiente de lo que necesitamos. Nos sienten como parte de su equipo y eso se nota en los resultados.',
      name: 'Gaby M.',
      role: 'Coordinadora de Marketing, Pass your TOEFL',
    },
  },
  'residenciales-merida': {
    industria: 'inmobiliarias',
    servicios: ['redes-sociales', 'meta-ads'],
    accent: 'purple',
    destacado: false,
  },
  'paulos-pizza': {
    industria: 'restaurantes',
    servicios: ['redes-sociales', 'meta-ads'],
    accent: 'cyan',
    destacado: false,
    testimonio: {
      quote:
        'Desde que empezamos a trabajar con Hiweb, hemos notado un cambio muy positivo en nuestras ventas. Antes dependíamos mucho de las sucursales físicas, pero ahora, gracias a su estrategia digital, hemos logrado atraer más clientes y aumentar nuestros ingresos. El equipo es profesional, creativo y siempre está pendiente de nuestros resultados. Sin duda, una gran inversión para nuestro negocio.',
      name: 'Julia T.',
      role: 'Gerente de Marketing, Paulo’s Pizza',
    },
  },
  'industrial-basanlo': {
    industria: 'manufactura',
    servicios: ['seo', 'desarrollo-web'],
    accent: 'orange',
    destacado: false,
  },
};

function parseMetric(raw: string, label: string, detail: string) {
  const cleaned = raw.replace(/\u200d/g, '').trim();
  const negative = cleaned.startsWith('-') || cleaned.startsWith('−');
  const hasPct = cleaned.includes('%');
  const core = cleaned.replace(/[+\-−,%\s]/g, '').replace(/,/g, '');
  return {
    valor: Number(core),
    label: label.replace(/\u200d/g, '').trim(),
    prefix: negative ? '−' : '+',
    suffix: hasPct ? '%' : undefined,
    decimals: core.includes('.') ? 1 : undefined,
    despues: detail || undefined,
  };
}

function firstSentenceAfter(haystack: string, marker: string) {
  const index = haystack.indexOf(marker);
  if (index < 0) return '';
  return haystack.slice(index + marker.length).replace(/\s+/g, ' ').trim();
}

function taglineOf(page: RawPage) {
  const after = firstSentenceAfter(page.textSample, `Ver sitio web ${page.h1}`);
  const cut = after.split('¿Qué buscaba')[0]?.trim() ?? '';
  return cut.replace(/\s+/g, ' ').trim();
}

function retoOf(page: RawPage) {
  const after = firstSentenceAfter(page.textSample, 'Marketing digital que sí genera resultados');
  const cut = after.split('Nuestros resultados')[0]?.trim() ?? '';
  return cut.replace(/\s+/g, ' ').trim();
}

function resultadoFrase(metrics: ReturnType<typeof parseMetric>[]) {
  const top = metrics[0];
  if (!top) return '';
  const number = `${top.prefix ?? ''}${
    top.decimals != null ? top.valor.toFixed(top.decimals) : top.valor.toLocaleString('en-US')
  }${top.suffix ?? ''}`;
  return `${number} ${top.label.toLowerCase()}`;
}

function toTsString(value: string) {
  return JSON.stringify(value);
}

function main() {
  const raw = JSON.parse(fs.readFileSync(RAW, 'utf8')) as {
    indexTitle: string;
    indexDesc: string;
    pages: RawPage[];
  };

  const cases = raw.pages.map((page) => {
    const meta = MAP[page.slug];
    if (!meta) throw new Error(`Missing map for ${page.slug}`);
    const metrics = page.metrics.map((item) => parseMetric(item.value, item.label, item.detail));
    const titulo = taglineOf(page) || page.h1;
    const reto = retoOf(page);
    const resumen = page.desc;
    return {
      id: page.slug,
      cliente: page.h1.replace(/^Paulos pizza$/i, 'Paulo’s Pizza').replace(/^Residenciales Merida$/i, 'Residenciales Mérida'),
      industria: meta.industria,
      servicios: meta.servicios,
      resultadoFrase: resultadoFrase(metrics),
      titulo,
      resumen,
      destacado: meta.destacado,
      accent: meta.accent,
      metricas: metrics,
      reto,
      estrategia: page.fases.map((fase) => `${fase.title}: ${fase.description}`).join(' '),
      fases: page.fases,
      testimonio: meta.testimonio,
      cover: page.cover,
      seo: {
        metaTitle: page.title,
        metaDescription: page.desc,
      },
    };
  });

  const ts = `import type { CaseRecord, SeoFields } from '../lib/content/types';

export const WEBFLOW_CASES_INDEX = {
  eyebrow: 'Portafolio / Casos',
  title: 'Casos de Éxito',
  description: 'Descubre nuestros logros y lo que podemos hacer por tu marca.',
  seo: {
    metaTitle: ${toTsString(raw.indexTitle)},
    metaDescription: ${toTsString(raw.indexDesc)},
  } satisfies SeoFields,
} as const;

export type WebflowCaseCopy = CaseRecord['data'] & {
  cover: string;
};

export const WEBFLOW_CASES: Record<string, WebflowCaseCopy> = ${JSON.stringify(
    Object.fromEntries(
      cases.map((item) => {
        const { id, cover, seo, ...data } = item;
        return [
          id,
          {
            ...data,
            industria: { id: data.industria ?? '' },
            servicios: data.servicios.map((serviceId) => ({ id: serviceId })),
            cover,
            seo,
          },
        ];
      }),
    ),
    null,
    2,
  )};
`;

  fs.writeFileSync(path.join(ROOT, 'src/data/webflow-cases.ts'), ts, 'utf8');

  const casosDir = path.join(ROOT, 'src/content/casos');
  for (const file of fs.readdirSync(casosDir)) {
    if (file.endsWith('.json')) fs.unlinkSync(path.join(casosDir, file));
  }
  for (const item of cases) {
    const json = {
      cliente: item.cliente,
      ...(item.industria ? { industria: item.industria } : {}),
      servicios: item.servicios,
      resultadoFrase: item.resultadoFrase,
      titulo: item.titulo,
      resumen: item.resumen,
      destacado: item.destacado,
      accent: item.accent,
      metricas: item.metricas.map(({ despues, ...metric }) => ({
        ...metric,
        ...(despues ? { despues } : {}),
      })),
      reto: item.reto,
      estrategia: item.estrategia,
      fases: item.fases,
      ...(item.testimonio ? { testimonio: item.testimonio } : {}),
    };
    fs.writeFileSync(path.join(casosDir, `${item.id}.json`), `${JSON.stringify(json, null, 2)}\n`, 'utf8');
  }

  console.log(`Wrote ${cases.length} cases`);
}

main();
