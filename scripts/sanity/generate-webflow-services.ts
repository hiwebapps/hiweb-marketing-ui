/**
 * Generates src/data/webflow-services.ts from live Webflow pages + curated mapping.
 */
import fs from 'node:fs';
import path from 'node:path';
import { WEBFLOW_SERVICE_TAGLINES } from '../../src/data/webflow-home';

const PAGES: Record<string, string> = {
  seo: 'https://www.hiwebmarketing.com/servicios/agencia-posicionamiento-seo',
  'google-ads': 'https://www.hiwebmarketing.com/servicios/promocion-google-ads',
  'meta-ads': 'https://www.hiwebmarketing.com/servicios/meta-ads-publicidad-redes-sociales',
  'redes-sociales': 'https://www.hiwebmarketing.com/servicios/agencia-redes-sociales',
  'desarrollo-web': 'https://www.hiwebmarketing.com/servicios/diseno-desarrollo-web-mexico',
  'crm-automatizacion': 'https://www.hiwebmarketing.com/servicios/crm-automatizacion-empresas',
  branding: 'https://www.hiwebmarketing.com/servicios/branding',
  'ia-marketing': 'https://www.hiwebmarketing.com/servicios/ia-marketing',
  'community-manager': 'https://www.hiwebmarketing.com/servicios/community-manager',
};

type Block = { title: string; description: string };
type Faq = { question: string; answer: string };

const COPY: Record<
  string,
  {
    nombre: string;
    orden: number;
    heroTitle: string;
    heroDescription: string;
    heroBadge: string;
    cards: Block[];
    proceso: Block[];
  }
> = {
  seo: {
    nombre: 'SEO',
    orden: 2,
    heroTitle: 'Agencia de Posicionamiento SEO y AEO: Dominamos la Intención de Búsqueda',
    heroDescription:
      'En Hiweb, no solo posicionamos páginas; construimos autoridad. Combinamos las estrategias tradicionales de una agencia de servicios SEO con la nueva era del AEO (Answer Engine Optimization) para que tu marca no solo aparezca en Google, sino que sea la respuesta elegida por las IAs.',
    heroBadge: 'SEO / AEO',
    cards: [
      {
        title: 'SEO Local para dominar tu ciudad',
        description:
          'Optimizamos tu presencia en Google Maps y búsquedas locales para que los clientes cercanos te encuentren primero. Ideal para negocios físicos y servicios profesionales.',
      },
      {
        title: 'SEO nacional y e-commerce',
        description:
          'Arquitecturas de información escalables para empresas con alcance en todo México. Desde categorías hasta SEO técnico para tiendas en línea.',
      },
      {
        title: 'SEO técnico y AEO',
        description:
          'Corregimos velocidad, datos estructurados y Core Web Vitals, y adaptamos tu contenido para el Zero-Click Search y los motores de respuesta.',
      },
    ],
    proceso: [
      {
        title: 'Auditoría SEO técnica',
        description: 'Analizamos velocidad, estructura, errores de rastreo y oportunidades de mejora en tu sitio actual.',
      },
      {
        title: 'Investigación de keywords',
        description: 'Identificamos las palabras clave con mayor volumen y menor competencia para tu industria y ciudad.',
      },
      {
        title: 'Optimización on-page',
        description: 'Corregimos títulos, meta descripciones, estructura de encabezados, schema y contenido de cada página.',
      },
      {
        title: 'Contenido estratégico',
        description: 'Creamos blogs y páginas de aterrizaje orientadas a captar tráfico orgánico calificado.',
      },
      {
        title: 'Linkbuilding',
        description: 'Generamos enlaces de calidad desde sitios relevantes para aumentar la autoridad de tu dominio.',
      },
      {
        title: 'Reporte mensual',
        description: 'Mostramos el progreso en posiciones, tráfico orgánico y conversiones con datos reales de Search Console y Semrush.',
      },
    ],
  },
  'google-ads': {
    nombre: 'Google Ads',
    orden: 4,
    heroTitle: 'Promoción Google Ads: Captura la Demanda Activa y Escala tus Ventas',
    heroDescription:
      'Transformamos cada clic en una oportunidad de negocio mediante una promoción Google Ads estratégica, diseñada para colocar tu marca frente a quienes ya están listos para comprar.',
    heroBadge: 'Google Ads',
    cards: [
      {
        title: 'Campañas de Búsqueda (Search)',
        description:
          'Dominamos las subastas para que tus anuncios aparezcan cuando los usuarios buscan tus servicios, con un costo competitivo y enfocado en intención de compra.',
      },
      {
        title: 'Red de Display y branding',
        description:
          'Expandimos tu presencia visual en sitios y apps estratégicas para generar reconocimiento y alimentar el funnel de ventas.',
      },
      {
        title: 'Google Shopping y Performance Max',
        description:
          'Ideal para e-commerce. Optimizamos feeds de productos para que las ventas escalen con inteligencia artificial en todo el ecosistema de Google.',
      },
    ],
    proceso: [
      {
        title: 'Auditoría de cuenta',
        description: 'Si ya tienes una cuenta activa, analizamos su estructura, historial y oportunidades de mejora.',
      },
      {
        title: 'Estrategia de campañas',
        description: 'Definimos objetivos, tipos de campaña, palabras clave, audiencias y presupuesto óptimo.',
      },
      {
        title: 'Configuración técnica',
        description: 'Instalamos el seguimiento de conversiones, listas de remarketing y extensiones de anuncio.',
      },
      {
        title: 'Lanzamiento',
        description: 'Activamos las campañas y monitoreamos de cerca durante la fase inicial de aprendizaje del algoritmo.',
      },
      {
        title: 'Optimización continua',
        description: 'Ajustamos pujas, palabras clave negativas, anuncios y audiencias de forma semanal.',
      },
      {
        title: 'Reporte mensual',
        description: 'Entregamos reporte con KPIs de negocio: CPC, CPA, ROAS y recomendaciones para el siguiente mes.',
      },
    ],
  },
  'meta-ads': {
    nombre: 'Meta Ads',
    orden: 3,
    heroTitle: 'Meta Ads: Estrategias de Publicidad en Redes Sociales que Escalan tu Negocio',
    heroDescription:
      'En Hiweb, transformamos la publicidad en redes sociales en un motor de crecimiento. Mediante Meta Ads, conectamos tu propuesta de valor con la audiencia exacta en el momento de mayor atención.',
    heroBadge: 'Meta Ads',
    cards: [
      {
        title: 'Campañas de generación de leads',
        description:
          'Anuncios optimizados para capturar datos de contacto directamente desde las plataformas, sin fricción y con un ciclo de ventas más corto.',
      },
      {
        title: 'Ventas para e-commerce',
        description:
          'Catálogos dinámicos y anuncios de colección para que tus productos lleguen a quienes ya mostraron interés y maximicen el ROAS.',
      },
      {
        title: 'Remarketing y retargeting',
        description:
          'Mantenemos tu marca presente ante quienes visitaron tu web pero no compraron, con un costo por resultado mucho más eficiente.',
      },
    ],
    proceso: [
      {
        title: 'Auditoría de cuenta',
        description: 'Revisamos el Business Manager, el Pixel, las audiencias guardadas y el historial de campañas.',
      },
      {
        title: 'Estrategia de campañas',
        description: 'Definimos objetivos, embudos de conversión, segmentaciones y presupuesto por fase.',
      },
      {
        title: 'Producción de creatividades',
        description: 'Diseñamos imágenes y videos para cada formato: feed, stories y reels patrocinados.',
      },
      {
        title: 'Lanzamiento y aprendizaje',
        description: 'Monitoreamos diariamente durante las primeras 2 semanas para acelerar el aprendizaje del algoritmo.',
      },
      {
        title: 'Optimización continua',
        description: 'Pruebas A/B, ajuste de audiencias, rotación de creatividades y gestión de frecuencia.',
      },
      {
        title: 'Reporte mensual',
        description: 'CPL, ROAS, costo por compra y recomendaciones estratégicas para el siguiente mes.',
      },
    ],
  },
  'redes-sociales': {
    nombre: 'Redes Sociales',
    orden: 1,
    heroTitle: 'Agencia de Redes Sociales en México',
    heroDescription:
      'En Hiweb no solo publicamos contenido: diseñamos estrategias de gestión de redes sociales que conectan tu marca con las personas correctas y generan resultados reales, no solo alcance.',
    heroBadge: 'Redes sociales',
    cards: [
      {
        title: 'Estrategia de contenido y storytelling',
        description: 'Pilares, tono de voz y calendario editorial con impacto comercial.',
      },
      {
        title: 'Producción multimedia y creativa',
        description: 'Piezas gráficas, reels y TikToks que comunican tu propuesta de valor.',
      },
      {
        title: 'Auditoría y consultoría de canales',
        description: 'Detectamos oportunidades de crecimiento en tus perfiles actuales.',
      },
    ],
    proceso: [
      {
        title: 'Diagnóstico gratuito',
        description: 'Analizamos tus perfiles, competencia y audiencia.',
      },
      {
        title: 'Estrategia personalizada',
        description: 'Definimos objetivos, plataformas, tono y calendario editorial.',
      },
      {
        title: 'Producción de contenido',
        description: 'Piezas, reels y videos con tu identidad de marca.',
      },
      {
        title: 'Publicación y seguimiento',
        description: 'Publicamos en los horarios con mejor desempeño histórico de tu audiencia.',
      },
      {
        title: 'Reporte y optimización',
        description: 'Ajustamos la estrategia cada mes con datos reales.',
      },
    ],
  },
  'desarrollo-web': {
    nombre: 'Desarrollo Web',
    orden: 9,
    heroTitle: 'Agencia de Diseño Web: Creamos tu Activo Digital más Rentable',
    heroDescription:
      'En Hiweb, el diseño y desarrollo web va más allá de la estética. Construimos plataformas de alto rendimiento que funcionan como una herramienta de ventas 24/7 para tu negocio.',
    heroBadge: 'Diseño web',
    cards: [
      {
        title: 'Desarrollo web responsive',
        description: 'Sitios corporativos y landing pages que se adaptan a cualquier dispositivo.',
      },
      {
        title: 'E-commerce avanzado',
        description: 'Tiendas online optimizadas para la venta, integradas con tu operación.',
      },
      {
        title: 'Mantenimiento y soporte',
        description: 'Actualizaciones, copias de seguridad y monitoreo para que el sitio siga convirtiendo.',
      },
    ],
    proceso: [
      {
        title: 'Briefing y estrategia',
        description: 'Definimos objetivos, público, estructura del sitio y referencias de diseño.',
      },
      {
        title: 'Arquitectura de información',
        description: 'Diseñamos los flujos de navegación y la jerarquía de contenido antes del diseño visual.',
      },
      {
        title: 'Diseño UI',
        description: 'Creamos el diseño visual completo en Figma para tu aprobación antes del desarrollo.',
      },
      {
        title: 'Desarrollo',
        description: 'Construimos el sitio con código limpio, velocidad optimizada y SEO técnico desde la base.',
      },
      {
        title: 'QA y pruebas',
        description: 'Revisamos el sitio en distintos dispositivos y navegadores antes de publicar.',
      },
      {
        title: 'Lanzamiento y capacitación',
        description: 'Publicamos el sitio y te enseñamos a gestionar el contenido de forma autónoma.',
      },
    ],
  },
  'crm-automatizacion': {
    nombre: 'CRM & Automatización',
    orden: 6,
    heroTitle: 'CRM para empresas: Transforma tus datos en relaciones rentables',
    heroDescription:
      'Impulsa el crecimiento de tu negocio mediante el manejo de CRM inteligente y estrategias de automatización diseñadas para maximizar cada oportunidad de venta.',
    heroBadge: 'CRM',
    cards: [
      {
        title: 'Consultoría e implementación',
        description: 'Seleccionamos e instalamos las herramientas CRM que mejor se adaptan a tus objetivos comerciales.',
      },
      {
        title: 'Flujos de automatización',
        description: 'Diseñamos procesos que eliminan tareas repetitivas y errores humanos en tu embudo.',
      },
      {
        title: 'Capacitación y soporte',
        description: 'Capacitamos a tu equipo para asegurar una adopción tecnológica exitosa y rentable.',
      },
    ],
    proceso: [
      {
        title: 'Diagnóstico de procesos',
        description: 'Mapeamos cómo entran, se nutren y se cierran hoy tus leads.',
      },
      {
        title: 'Selección e implementación',
        description: 'Instalamos el CRM y las integraciones con web, Ads y formularios.',
      },
      {
        title: 'Automatización',
        description: 'Emails, WhatsApp y tareas se disparan según el comportamiento del prospecto.',
      },
      {
        title: 'Capacitación',
        description: 'El equipo comercial opera el sistema con un protocolo claro de seguimiento.',
      },
      {
        title: 'Optimización',
        description: 'Ajustamos flujos y reportes con datos reales del embudo.',
      },
    ],
  },
  branding: {
    nombre: 'Branding',
    orden: 5,
    heroTitle: 'Agencia de Branding: Construimos tu Identidad de Marca',
    heroDescription:
      'En Hiweb, entendemos que la identidad de marca es mucho más que un logotipo; es la esencia que define cómo el mundo percibe y recuerda tu negocio en el entorno digital.',
    heroBadge: 'Branding',
    cards: [
      {
        title: 'Diseño de logotipo y naming',
        description: 'Creamos el nombre y el símbolo central de tu negocio, únicos, escalables y alineados a tus valores.',
      },
      {
        title: 'Manual de identidad de marca',
        description: 'Tipografías, paletas y reglas de uso para que la marca se mantenga impecable en cualquier formato.',
      },
      {
        title: 'Materiales corporativos',
        description: 'Adaptamos la nueva identidad a papelería, kits de redes y activos de operación diaria.',
      },
    ],
    proceso: [
      {
        title: 'Investigación de marca',
        description: 'Analizamos competencia, audiencia y posicionamiento actual.',
      },
      {
        title: 'Estrategia de marca',
        description: 'Definimos propósito, valores, personalidad y promesa de marca antes de diseñar.',
      },
      {
        title: 'Propuesta de concepto',
        description: 'Presentamos direcciones creativas distintas para elegir la que mejor represente tu visión.',
      },
      {
        title: 'Desarrollo visual',
        description: 'Refinamos el concepto elegido hasta el diseño final aprobado.',
      },
      {
        title: 'Manual de identidad visual',
        description: 'Documentamos todos los elementos de la marca y sus reglas de uso.',
      },
      {
        title: 'Entrega de archivos',
        description: 'Logo en PNG, SVG y PDF, con variantes para uso digital e impreso.',
      },
    ],
  },
  'ia-marketing': {
    nombre: 'IA Marketing',
    orden: 8,
    heroTitle: 'IA Marketing: Revoluciona tu Estrategia con Inteligencia Artificial',
    heroDescription:
      'En Hiweb, integramos la IA al marketing para transformar datos en decisiones estratégicas y que tu empresa escale con una eficiencia sin precedentes.',
    heroBadge: 'IA',
    cards: [
      {
        title: 'Chatbots de IA para ventas',
        description: 'Asistentes que entienden lenguaje natural, resuelven dudas y califican prospectos en tiempo real.',
      },
      {
        title: 'Segmentación con machine learning',
        description: 'Agrupamos usuarios por comportamientos predictivos para llegar al cliente correcto antes.',
      },
      {
        title: 'Flujos de trabajo inteligentes',
        description: 'Correos y mensajes que se adaptan según la respuesta y el interés del usuario.',
      },
    ],
    proceso: [
      {
        title: 'Diagnóstico del embudo',
        description: 'Identificamos tareas repetitivas y fugas de seguimiento en marketing y ventas.',
      },
      {
        title: 'Diseño de automatización',
        description: 'Definimos chatbots, flujos y reportes alineados a tus herramientas actuales.',
      },
      {
        title: 'Implementación',
        description: 'Integramos IA con CRM, web y campañas sin interrumpir la operación.',
      },
      {
        title: 'Entrenamiento y QA',
        description: 'Ajustamos tono de marca, calificación de leads y handoff al equipo comercial.',
      },
      {
        title: 'Optimización continua',
        description: 'Medimos conversiones, tiempo de respuesta y ROI de cada flujo automatizado.',
      },
    ],
  },
  'community-manager': {
    nombre: 'Community Manager',
    orden: 7,
    heroTitle: 'Community Manager: Construimos el Corazón de tu Comunidad Digital',
    heroDescription:
      'En Hiweb, ofrecemos un servicio de community manager integral que va más allá de publicar; nos convertimos en la voz de tu marca para generar conexiones reales y duraderas.',
    heroBadge: 'Community',
    cards: [
      {
        title: 'Gestión de interacciones',
        description: 'Atendemos dudas, comentarios y mensajes directos para que ningún prospecto se quede sin respuesta.',
      },
      {
        title: 'Dinamización de comunidad',
        description: 'Creamos conversaciones que convierten seguidores pasivos en embajadores de la marca.',
      },
      {
        title: 'Monitoreo y reporting',
        description: 'Medimos el sentimiento de la audiencia y entregamos reportes mensuales con métricas clave.',
      },
    ],
    proceso: [
      {
        title: 'Diagnóstico de comunidad',
        description: 'Revisamos tono, volumen de interacciones y protocolos actuales.',
      },
      {
        title: 'Guía de voz de marca',
        description: 'Definimos cómo se responde, qué se escala y cómo se modera.',
      },
      {
        title: 'Gestión diaria',
        description: 'Mensajes, comentarios, menciones y moderación con tiempos de respuesta claros.',
      },
      {
        title: 'Escalamiento de crisis',
        description: 'Protocolo para situaciones adversas y reporte al equipo directivo.',
      },
      {
        title: 'Reporte mensual',
        description: 'Interacciones, tiempo de respuesta y sentimiento de la comunidad.',
      },
    ],
  },
};

function decode(html: string) {
  return html
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function strip(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractMeta(html: string) {
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() ?? '';
  const description =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)?.[1] ??
    '';
  const faqs: Faq[] = [];
  const seen = new Set<string>();
  const questions = [...html.matchAll(/class="[^"]*data-faq-question[^"]*"[^>]*>([\s\S]*?)<\//gi)].map((m) =>
    strip(m[1]),
  );
  const answers = [...html.matchAll(/class="[^"]*data-faq-answer[^"]*"[^>]*>([\s\S]*?)<\/div>/gi)].map((m) =>
    strip(m[1]),
  );
  const n = Math.min(questions.length, answers.length);
  for (let i = 0; i < n; i += 1) {
    if (questions[i]?.startsWith('¿') && answers[i].length > 20 && !seen.has(questions[i])) {
      seen.add(questions[i]);
      faqs.push({ question: questions[i], answer: answers[i] });
    }
  }
  const scripts = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const match of scripts) {
    try {
      const data = JSON.parse(decode(match[1].trim())) as {
        '@type'?: string;
        mainEntity?: Array<{ name?: string; acceptedAnswer?: { text?: string } }>;
      };
      if (data['@type'] === 'FAQPage' && Array.isArray(data.mainEntity)) {
        for (const item of data.mainEntity) {
          const question = item.name?.trim();
          const answer = item.acceptedAnswer?.text ? strip(item.acceptedAnswer.text) : '';
          if (question && answer && !seen.has(question)) {
            seen.add(question);
            faqs.push({ question, answer });
          }
        }
      }
    } catch {
      // ignore
    }
  }
  return { title, description, faqs };
}

async function main() {
  const services: Record<string, unknown> = {};
  for (const [slug, url] of Object.entries(PAGES)) {
    const html = await (await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 HiwebBot' } })).text();
    const meta = extractMeta(html);
    const copy = COPY[slug];
    services[slug] = {
      ...copy,
      tagline: WEBFLOW_SERVICE_TAGLINES[slug],
      faqs: meta.faqs,
      seo: {
        metaTitle: meta.title.replace(/\s+\|\s+Hiweb.*$/i, ' | Hiweb'),
        metaDescription: meta.description,
      },
    };
    console.log(`${slug}: ${meta.faqs.length} faqs`);
  }

  const file = `import type { FaqItem, SeoFields, TitledBlock } from '../lib/content/types';
import { WEBFLOW_SERVICE_TAGLINES } from './webflow-home';

export type WebflowServiceCopy = {
  nombre: string;
  orden: number;
  tagline: string;
  heroTitle: string;
  heroDescription: string;
  heroBadge: string;
  cards: TitledBlock[];
  proceso: TitledBlock[];
  faqs: FaqItem[];
  seo: SeoFields;
};

export const WEBFLOW_SERVICES_INDEX = {
  eyebrow: 'Servicios',
  title: 'Servicios de marketing digital en México',
  description:
    'Unificamos estrategia, ejecución y medición para escalar demanda y ventas. Elige un servicio o trabaja un stack completo.',
} as const;

export const WEBFLOW_SERVICES = ${JSON.stringify(services, null, 2)} as const satisfies Record<string, WebflowServiceCopy>;

export { WEBFLOW_SERVICE_TAGLINES };
`;

  const out = path.join(process.cwd(), 'src/data/webflow-services.ts');
  fs.writeFileSync(out, file.replace(/as const satisfies Record<string, WebflowServiceCopy>;/, 'as Record<string, WebflowServiceCopy>;'), 'utf8');
  console.log(`Wrote ${out}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
