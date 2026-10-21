import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';

const WRITE = process.argv.includes('--write');
const PROJECT_ID = 'fxardjr1';
const DATASET = 'web-2026';

function getSanityToken() {
  if (process.env.SANITY_API_WRITE_TOKEN) return process.env.SANITY_API_WRITE_TOKEN;
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/SANITY_API_WRITE_TOKEN=["']?([^"'\r\n]+)["']?/);
    if (match?.[1]) return match[1].trim();
  }
  const file = path.join(os.homedir(), '.config', 'sanity', 'config.json');
  if (fs.existsSync(file)) {
    const config = JSON.parse(fs.readFileSync(file, 'utf8')) as { authToken?: string };
    if (config.authToken) return config.authToken;
  }
  return '';
}

const token = getSanityToken();
if (!token) throw new Error('No Sanity token in env or CLI config');

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

type Card = {
  _key: string;
  _type: 'serviceWhyCard';
  icon: string;
  accent: string;
  title: string;
  description: string;
};

type ServiceData = {
  es: Card[];
  en: Card[];
};

const SERVICE_CARDS: Record<string, ServiceData> = {
  'agencia-seo': {
    es: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'cyan',
        title: 'SEO y AEO en una sola estrategia.',
        description: 'Optimizamos cada página para que tu marca se posicione en los resultados de Google y sea citada en respuestas de Inteligencia Artificial.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'orange',
        title: 'Reportes con datos verificables.',
        description: 'Cada mes te presentamos un informe con el avance en posiciones, tráfico orgánico y conversiones con métricas directas de Search Console y Semrush.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'purple',
        title: 'Resolución técnica directa.',
        description: 'Si el sitio web presenta problemas de velocidad o indexación, nuestro equipo de desarrollo los atiende directamente en el código.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'lime',
        title: 'Estrategia enfocada en retorno de inversión.',
        description: 'Priorizamos términos de búsqueda con intención comercial para que el crecimiento de tráfico orgánico se traduzca en prospectos calificados y ventas.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'green',
        title: 'Arquitectura técnica limpia.',
        description: 'Diseñamos la estructura de URLs, el enlazado interno y los Core Web Vitals para que los motores de búsqueda rastreen el sitio sin fricción.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'globe',
        accent: 'cyan',
        title: 'Contenido enfocado en intención comercial.',
        description: 'Redactamos y estructuramos páginas pensadas para responder las consultas de prospectos listos para contratar tus servicios.',
      },
    ],
    en: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'cyan',
        title: 'SEO and AEO in one strategy.',
        description: 'We structure and optimize every page so your brand ranks in Google search results and earns citations across AI engines.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'orange',
        title: 'Reports with verified data.',
        description: 'Each month we deliver a verified report showing keyword rankings, organic traffic, and conversion progress from Search Console and Semrush.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'purple',
        title: 'Direct technical resolution.',
        description: 'If your site experiences speed or indexing bottlenecks, our development team resolves them directly in the codebase.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'lime',
        title: 'Revenue-focused keyword strategy.',
        description: 'We prioritize commercial-intent search terms so organic visibility translates directly into qualified inquiries and measurable revenue.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'green',
        title: 'Clean technical architecture.',
        description: 'We engineer URL hierarchy, internal links, and Core Web Vitals so search engines can crawl and index your site efficiently.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'globe',
        accent: 'cyan',
        title: 'Commercial-intent content.',
        description: 'We research, write, and structure pages designed to capture queries from high-intent prospects seeking your services.',
      },
    ],
  },
  'agencia-de-google-ads': {
    es: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'cyan',
        title: 'Ajustes de puja basados en conversiones.',
        description: 'Calibramos el presupuesto y las ofertas a partir de las conversiones generadas y los movimientos de la subasta.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'orange',
        title: 'Inversión publicitaria transparente.',
        description: 'La inversión se liquida directamente a Google. Cada mes te presentamos un desglose exacto de lo invertido, los prospectos generados y las optimizaciones realizadas.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'purple',
        title: 'Alineación entre anuncio, web y CRM.',
        description: 'Mantenemos sincronizado el mensaje del anuncio, la página de destino y el seguimiento comercial para facilitar el cierre de prospectos.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'globe',
        accent: 'lime',
        title: 'Campañas en español e inglés.',
        description: 'Gestionamos y redactamos campañas para México, Estados Unidos y Canadá adaptadas al contexto y lenguaje de cada mercado.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'green',
        title: 'Control de términos de búsqueda.',
        description: 'Monitoreamos las consultas de forma continua e incorporamos palabras clave negativas para concentrar la inversión en tráfico calificado.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'orange',
        title: 'Páginas de destino especializadas.',
        description: 'Desarrollamos landing pages específicas para cada grupo de anuncios con el objetivo de elevar la tasa de contacto y calificación.',
      },
    ],
    en: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'cyan',
        title: 'Conversion-based bid adjustments.',
        description: 'We calibrate bids and budget allocations using conversion data and real-time auction trends.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'orange',
        title: 'Transparent ad spend.',
        description: 'Ad spend is billed directly to Google. Each month we provide a transparent breakdown of spend, leads generated, and active optimizations.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'purple',
        title: 'Alignment across ads, landing pages, and CRM.',
        description: 'We keep ad copy, landing pages, and CRM routing coordinated so prospects encounter a seamless conversion path.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'globe',
        accent: 'lime',
        title: 'Campaigns in English and Spanish.',
        description: 'We build and manage bilingual accounts across the US, Canada, and Mexico, with native copy developed for each target market.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'green',
        title: 'Active search term monitoring.',
        description: 'We actively audit search queries and add negative keywords to ensure ad spend stays focused on qualified commercial searches.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'orange',
        title: 'Dedicated landing pages.',
        description: 'We build dedicated landing pages for each campaign segment to lift conversion rates and lead quality.',
      },
    ],
  },
  'agencia-de-facebook-ads': {
    es: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'cyan',
        title: 'Enfoque en costo de adquisición.',
        description: 'Calibramos la segmentación y el presupuesto diario para conseguir prospectos calificados y ventas al menor costo posible.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'orange',
        title: 'Facturación directa en la plataforma.',
        description: 'Configuramos la inversión para que se facture directamente a tu cuenta comercial de Meta, garantizando total propiedad y visibilidad de tus fondos.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'purple',
        title: 'Estrategia coordinada de canales.',
        description: 'Conectamos las campañas sociales con los esfuerzos de búsqueda en Google y los flujos de seguimiento en CRM.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'lime',
        title: 'Diseño y análisis en el mismo equipo.',
        description: 'Nuestro equipo creativo evalúa semanalmente las métricas de respuesta para actualizar imágenes, videos y textos según el rendimiento real.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'green',
        title: 'Evaluación continua de formatos creativos.',
        description: 'Desarrollamos y comparamos diferentes propuestas visuales y mensajes para identificar las piezas que generan mejor retorno publicitario.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'cyan',
        title: 'Estructura de prospección y remarketing.',
        description: 'Diseñamos secuencias de anuncios para presentar tu marca a nuevas audiencias y reconectar con usuarios que ya interactuaron con tu empresa.',
      },
    ],
    en: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'cyan',
        title: 'Focus on acquisition cost.',
        description: 'We calibrate daily audience targeting and budgets to generate qualified leads and sales at the lowest possible cost.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'orange',
        title: 'Direct platform billing.',
        description: 'We configure media billing directly within your Meta business account, ensuring full client ownership and visibility over ad spend.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'purple',
        title: 'Coordinated channel strategy.',
        description: 'We align paid social campaigns with search advertising and CRM follow-up to support the entire buyer journey.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'lime',
        title: 'Integrated design and analytics.',
        description: 'Our creative team reviews campaign data weekly to produce and iterate visuals, video formats, and copy based on conversion performance.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'green',
        title: 'Iterative creative testing.',
        description: 'We produce and test multiple creative angles and visual formats to discover top performers and maintain sustained ad engagement.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'cyan',
        title: 'Prospecting and remarketing structure.',
        description: 'We architect structured funnels that introduce your brand to new prospects and re-engage users who previously visited your site.',
      },
    ],
  },
  'gestion-de-redes-sociales': {
    es: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'cyan',
        title: 'Planificación guiada por métricas.',
        description: 'Diseñamos los pilares y temas de contenido analizando cuáles publicaciones generan mayor interacción y consultas comerciales para tu negocio.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'orange',
        title: 'Reportes periódicos claros.',
        description: 'Te presentamos un balance mensual con el desempeño de las publicaciones, el crecimiento de la comunidad y las acciones acordadas para el siguiente ciclo.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'purple',
        title: 'Producción de contenido integral.',
        description: 'Nos encargamos de la conceptualización, el diseño gráfico, la fotografía y la edición de video para cuidar la coherencia de tu marca.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'lime',
        title: 'Adaptación a formatos actuales.',
        description: 'Calibramos el calendario de publicaciones según los tipos de contenido con mayor visibilidad orgánica en Instagram, TikTok y LinkedIn.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'green',
        title: 'Contenido en video vertical.',
        description: 'Diseñamos y editamos videos para Reels y TikTok pensados para captar atención y explicar tus servicios de forma clara y atractiva.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'globe',
        accent: 'orange',
        title: 'Tono de comunicación definido.',
        description: 'Redactamos los textos de cada publicación siguiendo la personalidad y el tono institucional de tu empresa en todas las plataformas.',
      },
    ],
    en: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'cyan',
        title: 'Data-guided content planning.',
        description: 'We design content pillars and editorial calendars by analyzing which post formats drive the most qualified engagement for your brand.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'orange',
        title: 'Clear periodic reporting.',
        description: 'We provide a monthly review outlining content reach, community growth, and strategic next steps agreed upon for the upcoming period.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'purple',
        title: 'End-to-end content production.',
        description: 'We manage the full creative pipeline—concept development, graphic design, photography, and video editing—to ensure brand consistency.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'lime',
        title: 'Adaptation to current platform formats.',
        description: 'We calibrate your content calendar around the specific post formats currently earning the highest reach across Instagram, TikTok, and LinkedIn.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'green',
        title: 'Short-form vertical video.',
        description: 'We script and edit videos for Reels and TikTok designed to grab attention and explain your services clearly.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'globe',
        accent: 'orange',
        title: 'Defined brand voice.',
        description: 'We write captions and responses tailored to your company\'s tone and brand guidelines across every digital touchpoint.',
      },
    ],
  },
  'agencia-de-desarrollo-web': {
    es: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'cyan',
        title: 'Buenas prácticas de SEO en el código.',
        description: 'Configuramos la estructura semántica, los metadatos, los esquemas de datos y el mapa del sitio desde el lanzamiento para facilitar el posicionamiento.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'orange',
        title: 'Estructura orientada a la interacción.',
        description: 'Diseñamos cada sección para resolver inquietudes frecuentes de los visitantes y canalizarlos de forma directa hacia llamadas a la acción claras.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'purple',
        title: 'Integración con analítica y CRM.',
        description: 'Entregamos el sitio enlazado con Google Analytics, etiquetas de conversión y formularios conectados directamente a tu sistema comercial.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'lime',
        title: 'Capacitación para autogestión de contenidos.',
        description: 'Capacitamos y entregamos guías a tu equipo para que puedan actualizar textos, publicar artículos y administrar páginas con total independencia.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'green',
        title: 'Velocidad de carga optimizada.',
        description: 'Construimos sitios ligeros con compresión de recursos y código limpio para garantizar tiempos de respuesta rápidos en cualquier dispositivo.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'globe',
        accent: 'purple',
        title: 'Diseño responsivo para móviles.',
        description: 'Adaptamos la navegación, los formularios y la jerarquía visual para que la experiencia de consulta sea fluida tanto en teléfonos como en computadoras.',
      },
    ],
    en: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'cyan',
        title: 'SEO best practices in code.',
        description: 'We implement semantic HTML, metadata, structured schema, and sitemaps directly in the codebase before launch to support search rankings.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'orange',
        title: 'Interaction-focused structure.',
        description: 'We architect each page section to answer common prospect questions and guide visitors smoothly toward direct points of contact.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'purple',
        title: 'Integration with analytics and CRM.',
        description: 'We deliver your site fully integrated with Google Analytics, conversion tracking tags, and forms routed straight to your sales pipeline.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'lime',
        title: 'Self-managed content enablement.',
        description: 'We train your staff and provide documentation so your team can edit copy, publish articles, and manage pages independently.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'green',
        title: 'Optimized loading speed.',
        description: 'We build lightweight sites with compressed assets and clean code to ensure fast loading speeds on any network and device.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'globe',
        accent: 'purple',
        title: 'Responsive mobile design.',
        description: 'We calibrate navigation, form elements, and visual hierarchy for effortless reading and interaction across smartphones and desktops.',
      },
    ],
  },
  'desarrollo-de-ecommerce': {
    es: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'cyan',
        title: 'Experiencia de compra optimizada para móviles.',
        description: 'Diseñamos la navegación del catálogo, los filtros y la pantalla de pago pensando en la comodidad del usuario al comprar desde un smartphone.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'orange',
        title: 'Configuración técnica completa.',
        description: 'Dejamos probadas y listas las pasarelas de pago, los métodos de envío, los impuestos y las herramientas de analítica antes de abrir la tienda.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'purple',
        title: 'Coordinación entre tienda y campañas.',
        description: 'Nuestro equipo sincroniza el catálogo y las etiquetas de seguimiento con las campañas de Google y Meta Ads para potenciar las ventas.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'globe',
        accent: 'lime',
        title: 'Capacitación para administración de pedidos.',
        description: 'Preparamos a tu personal con sesiones prácticas para dar de alta productos, ajustar inventarios y procesar pedidos de manera autónoma.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'green',
        title: 'Proceso de pago simplificado.',
        description: 'Configuramos flujos de compra breves, métodos de pago locales y secuencias automatizadas para recuperar carritos que quedaron inconclusos.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'orange',
        title: 'Estabilidad en periodos de alta demanda.',
        description: 'Preparamos la arquitectura del servidor para procesar grandes volúmenes de visitas y transacciones simultáneas sin degradar la velocidad.',
      },
    ],
    en: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'cyan',
        title: 'Mobile-optimized shopping experience.',
        description: 'We design catalog browsing, product filtering, and payment screens specifically for a seamless thumb-first mobile shopping experience.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'orange',
        title: 'Complete technical setup.',
        description: 'We test and verify payment gateways, shipping rules, tax calculations, and transaction tracking before launching your store.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'purple',
        title: 'Alignment between store and ad campaigns.',
        description: 'Our team syncs product catalogs and conversion pixels directly with Google and Meta Ads campaigns to maximize sales velocity.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'globe',
        accent: 'lime',
        title: 'Order management training.',
        description: 'We provide hands-on training for your staff to manage product listings, inventory levels, and order fulfillment independently.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'green',
        title: 'Streamlined checkout process.',
        description: 'We implement streamlined checkout flows, trusted payment options, and automated abandoned cart recovery sequences out of the box.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'orange',
        title: 'High-demand stability.',
        description: 'We engineer server architecture to handle heavy traffic spikes and concurrent checkouts reliably during peak sales events.',
      },
    ],
  },
  'agencia-de-inbound-marketing-mexico': {
    es: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'cyan',
        title: 'Contenido y ventas conectados.',
        description: 'Creamos piezas informativas pensadas para acompañar cada fase de decisión y dirigir a los prospectos calificados hacia tu equipo de ventas.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'orange',
        title: 'Artículos estructurados para búsqueda y consulta.',
        description: 'Redactamos y estructuramos contenidos exhaustivos para responder dudas clave del sector y facilitar su citación en Google y plataformas de IA.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'purple',
        title: 'Metodología adaptada a ventas B2B.',
        description: 'Elaboramos materiales comparativos y técnicos pensados para respaldar procesos comerciales que involucran a múltiples tomadores de decisión.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'lime',
        title: 'Seguimiento del origen de prospectos.',
        description: 'Te presentamos informes que demuestran qué publicaciones y recursos atraen contactos calificados y cómo aportan al cierre de negocios.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'green',
        title: 'Recursos descargables especializados.',
        description: 'Desarrollamos guías técnicas, calculadoras y casos de estudio con valor práctico para directivos y responsables de compra.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'cyan',
        title: 'Clasificación y seguimiento de prospectos.',
        description: 'Configuramos secuencias automatizadas de correo para nutrir y calificar a los prospectos según su sector e interés antes del contacto comercial.',
      },
    ],
    en: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'cyan',
        title: 'Connected content and sales.',
        description: 'We develop informative content tailored to each buying stage, guiding qualified prospects directly toward your sales representatives.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'orange',
        title: 'Search-structured articles.',
        description: 'We write and structure in-depth resources to answer industry questions and facilitate visibility across Google and AI search engines.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'purple',
        title: 'B2B-focused methodology.',
        description: 'We develop technical documentation and comparative guides designed to support complex B2B sales cycles with multiple stakeholders.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'lime',
        title: 'Lead attribution tracking.',
        description: 'We provide reports identifying which content assets generate qualified leads and how they contribute to pipeline revenue.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'green',
        title: 'Specialized downloadable resources.',
        description: 'We develop practical technical whitepapers, calculators, and verified case studies tailored to the needs of business decision-makers.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'cyan',
        title: 'Lead scoring and automated follow-up.',
        description: 'We configure automated email workflows to nurture and score leads based on industry and interest level prior to sales engagement.',
      },
    ],
  },
  'agencia-de-branding': {
    es: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'cyan',
        title: 'Estrategia previa al diseño.',
        description: 'Investigamos y definimos el posicionamiento comercial, la propuesta de valor y los atributos de la marca antes de comenzar la etapa visual.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'orange',
        title: 'Sistemas visuales para entornos digitales.',
        description: 'Creamos logotipos, tipografías y paletas cromáticas diseñados para mantener nitidez y legibilidad tanto en pantallas como en soportes físicos.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'purple',
        title: 'Plantillas para uso diario.',
        description: 'Entregamos formatos listos para presentaciones corporativas, documentos y redes sociales para que tu equipo aplique la marca con consistencia.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'lime',
        title: 'Proceso de selección colaborativo.',
        description: 'Presentamos rutas visuales diferenciadas y sustentadas en objetivos de negocio para evaluar y definir juntos la identidad definitiva.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'globe',
        accent: 'green',
        title: 'Guía de tono y redacción.',
        description: 'Establecemos lineamientos de lenguaje, vocabulario y ejemplos prácticos para que las comunicaciones escritas reflejen siempre la misma voz.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'cyan',
        title: 'Manual de identidad accesible.',
        description: 'Ponemos a tu disposición un repositorio digital con normativas de uso y enlaces de descarga de todos los recursos gráficos de la marca.',
      },
    ],
    en: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'cyan',
        title: 'Strategy before visual design.',
        description: 'We analyze and define your commercial positioning, value proposition, and brand attributes before commencing visual identity work.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'orange',
        title: 'Visual systems for digital environments.',
        description: 'We craft logos, typography, and color palettes engineered for clear legibility across digital screens and physical touchpoints.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'purple',
        title: 'Practical day-to-day templates.',
        description: 'We deliver ready-to-use presentation decks, document templates, and social media formats so your team can deploy the brand consistently.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'lime',
        title: 'Collaborative selection process.',
        description: 'We present distinct creative directions grounded in strategic business goals to review, test, and refine together.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'globe',
        accent: 'green',
        title: 'Voice and writing guidelines.',
        description: 'We establish verbal guidelines, vocabulary principles, and practical copy examples to ensure consistent messaging across all communications.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'cyan',
        title: 'Accessible brand guidelines.',
        description: 'We host accessible cloud documentation with clear usage rules and download links for all your brand\'s visual assets.',
      },
    ],
  },
  'servicio-de-community-manager': {
    es: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'cyan',
        title: 'Atención profesional con criterios claros.',
        description: 'Gestionamos las respuestas siguiendo el protocolo institucional de tu empresa y canalizamos oportunamente las dudas técnicas o complejas.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'orange',
        title: 'Registro de consultas y comentarios.',
        description: 'Clasificamos y documentamos las solicitudes recurrentes, dudas y aportes de los usuarios para informar a tus áreas de producto y servicio.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'purple',
        title: 'Coordinación con el calendario editorial.',
        description: 'Integramos las inquietudes habituales de los usuarios como punto de partida para planear nuevos contenidos y respuestas frecuentes.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'lime',
        title: 'Protocolo para atención de incidentes.',
        description: 'Aplicamos lineamientos aprobados para responder a quejas o inconformidades con objetividad, rapidez y respeto por la imagen de tu empresa.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'green',
        title: 'Canalización directa de prospectos.',
        description: 'Turnamos las solicitudes de cotización o disponibilidad directamente a tu equipo de ventas a través de WhatsApp o tu sistema CRM.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'purple',
        title: 'Horarios de atención establecidos.',
        description: 'Mantenemos cobertura en los horarios de mayor actividad de tu comunidad para proporcionar información en el momento oportuno.',
      },
    ],
    en: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'cyan',
        title: 'Professional moderation with clear protocols.',
        description: 'We manage audience interactions according to your company\'s guidelines and route technical or specialized inquiries promptly.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'orange',
        title: 'Inquiry and feedback documentation.',
        description: 'We document and categorize recurring questions, feedback, and customer objections to provide insights for your operations and service teams.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'purple',
        title: 'Coordination with content planning.',
        description: 'We integrate frequent community questions into upcoming content planning and educational post topics.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'lime',
        title: 'Incident response protocol.',
        description: 'We apply pre-approved guidelines to address customer complaints or sensitive feedback promptly, objectively, and professionally.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'green',
        title: 'Direct sales inquiry routing.',
        description: 'We route pricing and sales inquiries straight to your sales representatives via WhatsApp or your CRM.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'purple',
        title: 'Dedicated coverage hours.',
        description: 'We maintain active inbox coverage during your audience\'s peak activity hours to ensure timely customer responses.',
      },
    ],
  },
  'crm-para-empresas': {
    es: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'cyan',
        title: 'Integración entre captación y ventas.',
        description: 'Conectamos tus campañas de marketing para que cada contacto ingrese automáticamente al CRM con el registro de su canal de origen.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'orange',
        title: 'Desarrollo de integraciones a la medida.',
        description: 'Desarrollamos enlaces entre tu CRM, formularios web, canales de chat y bases de datos según las necesidades operativas de tu empresa.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'purple',
        title: 'Acompañamiento en la adopción.',
        description: 'Brindamos capacitación práctica y soporte continuo a tu equipo comercial para asegurar que el sistema se integre a su rutina de trabajo.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'lime',
        title: 'Visibilidad del ciclo comercial.',
        description: 'Configuramos paneles para dar seguimiento a los prospectos recibidos, los tiempos de atención, las cotizaciones y las ventas concluidas.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'green',
        title: 'Alertas automáticas para vendedores.',
        description: 'Programamos notificaciones automáticas vía WhatsApp o correo electrónico para avisar a tu equipo comercial en cuanto entra una solicitud prioritaria.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'cyan',
        title: 'Mantenimiento y depuración de contactos.',
        description: 'Aplicamos rutinas para detectar registros duplicados, verificar datos de contacto y organizar la base de clientes por segmento o sector.',
      },
    ],
    en: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'cyan',
        title: 'Integration between lead capture and sales.',
        description: 'We connect your marketing campaigns so inbound leads enter your CRM automatically with full source attribution.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'orange',
        title: 'Custom workflow integrations.',
        description: 'We build custom integrations connecting your CRM, web forms, messaging platforms, and internal databases to match your workflow.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'purple',
        title: 'User onboarding and adoption support.',
        description: 'We provide practical user training and ongoing support to ensure your sales team adopts and leverages the system seamlessly.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'lime',
        title: 'Pipeline and conversion visibility.',
        description: 'We build custom dashboards tracking incoming leads, response times, deal stages, and closed sales across your organization.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'green',
        title: 'Automated sales alerts.',
        description: 'We program automated WhatsApp or email alerts to notify your sales reps the moment a high-priority prospect submits an inquiry.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'cyan',
        title: 'Database hygiene and organization.',
        description: 'We maintain automated rules to identify duplicate contacts, validate emails, and segment your database cleanly by industry or account tier.',
      },
    ],
  },
  'marketing-con-inteligencia-artificial': {
    es: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'cyan',
        title: 'Herramientas evaluadas previamente.',
        description: 'Implementamos tecnologías de inteligencia artificial que han demostrado utilidad comprobada en entornos reales de mercadotecnia y ventas.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'orange',
        title: 'Integración con tus sistemas existentes.',
        description: 'Vinculamos los asistentes y flujos automatizados con tu sitio web, canales de mensajería y CRM para complementar tu infraestructura actual.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'purple',
        title: 'Supervisión humana en procesos clave.',
        description: 'Configuramos la tecnología para atender consultas iniciales y transferir de inmediato los casos de asesoría comercial al equipo correspondiente.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'lime',
        title: 'Monitoreo de rendimiento operativo.',
        description: 'Te presentamos métricas de tiempos de respuesta, nivel de resolución de dudas y prospectos calificados por cada automatización activa.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'green',
        title: 'Respuestas basadas en información de tu empresa.',
        description: 'Entrenamos los modelos con tus catálogos, listas de precios y manuales de servicio para garantizar respuestas fieles a tus políticas.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'cyan',
        title: 'Automatización de tareas repetitivas.',
        description: 'Automatizamos la captura de prospectos, la extracción de datos y la generación de notas para liberar tiempo operativo en tu equipo.',
      },
    ],
    en: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'cyan',
        title: 'Pre-tested AI solutions.',
        description: 'We deploy AI technologies vetted for measurable utility and stability in real-world marketing and sales workflows.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'orange',
        title: 'Integration with existing software.',
        description: 'We connect automated flows and conversational agents with your website, messaging platforms, and CRM to fit within your current stack.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'purple',
        title: 'Human oversight in key processes.',
        description: 'We configure assistants to resolve preliminary inquiries and escalate consultative or complex matters directly to your team.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'lime',
        title: 'Operational performance monitoring.',
        description: 'We track and report response times, resolution rates, and qualified leads generated across each active automated workflow.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'green',
        title: 'Answers grounded in your company data.',
        description: 'We train models using your actual catalogs, pricing policies, and service manuals to ensure accurate, on-brand responses.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'cyan',
        title: 'Automation of repetitive tasks.',
        description: 'We automate lead logging, data extraction, and call summaries to free up valuable time for your commercial team.',
      },
    ],
  },
  'agencia-de-chatgpt-ads': {
    es: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'cyan',
        title: 'Fundamento en intención de búsqueda.',
        description: 'Aprovechamos nuestra experiencia en campañas de Google y Meta para estructurar mensajes dirigidos a usuarios con necesidades puntuales.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'orange',
        title: 'Criterio objetivo sobre el canal.',
        description: 'Te orientamos con claridad sobre los formatos publicitarios confirmados por la plataforma y su viabilidad para tu sector de negocio.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'purple',
        title: 'Coordinación con otros medios pagados.',
        description: 'Integramos la presencia en este canal con tus campañas activas en motores de búsqueda y redes para generar un mensaje unificado.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'lime',
        title: 'Medición y configuración técnica inicial.',
        description: 'Verificamos parámetros de seguimiento, páginas de destino y captura en CRM antes de poner en marcha la difusión de anuncios.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'globe',
        accent: 'green',
        title: 'Redacción adaptada a formatos de consulta.',
        description: 'Redactamos contenidos claros e informativos pensados para integrarse de forma natural en entornos donde los usuarios buscan respuestas concretas.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'cyan',
        title: 'Alcance en mercados binacionales.',
        description: 'Gestionamos campañas segmentadas para audiencias en México, Estados Unidos y Canadá que utilizan plataformas de IA para investigar compras.',
      },
    ],
    en: [
      {
        _key: 'why-1',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'cyan',
        title: 'Grounded in search intent.',
        description: 'We leverage our experience managing search and social campaigns to craft messaging directed at users seeking specific solutions.',
      },
      {
        _key: 'why-2',
        _type: 'serviceWhyCard',
        icon: 'report',
        accent: 'orange',
        title: 'Objective assessment of the channel.',
        description: 'We provide clear, objective guidance on the platform\'s confirmed ad formats and their commercial suitability for your industry.',
      },
      {
        _key: 'why-3',
        _type: 'serviceWhyCard',
        icon: 'network',
        accent: 'purple',
        title: 'Coordination with existing paid media.',
        description: 'We coordinate this emerging channel with your active search and social campaigns to maintain unified brand visibility.',
      },
      {
        _key: 'why-4',
        _type: 'serviceWhyCard',
        icon: 'timer',
        accent: 'lime',
        title: 'Technical setup and measurement.',
        description: 'We test and verify tracking parameters, destination pages, and CRM capture workflows prior to launching ad campaigns.',
      },
      {
        _key: 'why-5',
        _type: 'serviceWhyCard',
        icon: 'globe',
        accent: 'green',
        title: 'Copy adapted for conversational formats.',
        description: 'We craft informative, consultative copy designed to integrate seamlessly into environments where users seek direct answers.',
      },
      {
        _key: 'why-6',
        _type: 'serviceWhyCard',
        icon: 'chart',
        accent: 'cyan',
        title: 'Bilingual cross-border reach.',
        description: 'We manage targeted campaigns for audiences across Mexico, the US, and Canada who utilize AI platforms to research purchasing decisions.',
      },
    ],
  },
};

// Mapping from ES slug to EN slug
const ES_TO_EN_SLUGS: Record<string, string> = {
  'agencia-seo': 'seo-and-aeo-agency-rank-on-google-and-ai-search',
  'agencia-de-google-ads': 'google-ads-agency-and-management-company',
  'agencia-de-facebook-ads': 'meta-ads-agency-for-facebook-and-instagram-ads',
  'gestion-de-redes-sociales': 'social-media-management-agency',
  'agencia-de-desarrollo-web': 'web-design-and-development',
  'desarrollo-de-ecommerce': 'custom-ecommerce-development',
  'agencia-de-inbound-marketing-mexico': 'inbound-marketing-agency-for-b2b-companies',
  'agencia-de-branding': 'branding-agency-for-brand-identity-and-strategy',
  'servicio-de-community-manager': 'community-management-services-for-brands',
  'crm-para-empresas': 'crm-implementation-and-automation-services',
  'marketing-con-inteligencia-artificial': 'ai-marketing-automation-and-chatbots-for-business',
  'agencia-de-chatgpt-ads': 'chatgpt-ads-agency',
};

async function run() {
  console.log(`Starting update of serviceWhy cards in Sanity (${WRITE ? 'LIVE WRITE' : 'DRY RUN'})...`);

  const services = await client.fetch<
    { _id: string; nombre: string; locale: string; slug: { current: string }; sections?: Record<string, unknown>[] }[]
  >(`*[_type == "service"]{ _id, nombre, locale, slug, sections }`);

  console.log(`Found ${services.length} total service documents in Sanity.`);

  let updatedCount = 0;

  for (const [esSlug, enSlug] of Object.entries(ES_TO_EN_SLUGS)) {
    const data = SERVICE_CARDS[esSlug];
    if (!data) {
      console.warn(`No cards data for slug: ${esSlug}`);
      continue;
    }

    // Process Spanish documents (published + draft)
    const esDocs = services.filter((s) => s.locale === 'es' && s.slug?.current === esSlug);
    if (esDocs.length > 0) {
      for (const doc of esDocs) {
        await updateServiceDoc(doc, data.es, 'es', esSlug);
        updatedCount++;
      }
    } else {
      console.warn(`[WARN] ES document not found for slug: ${esSlug}`);
    }

    // Process English documents (published + draft)
    const enDocs = services.filter((s) => s.locale === 'en' && s.slug?.current === enSlug);
    if (enDocs.length > 0) {
      for (const doc of enDocs) {
        await updateServiceDoc(doc, data.en, 'en', enSlug);
        updatedCount++;
      }
    } else {
      console.warn(`[WARN] EN document not found for slug: ${enSlug}`);
    }
  }

  console.log(`\nFinished processing! Processed ${updatedCount} service documents.`);
}

async function updateServiceDoc(
  doc: { _id: string; nombre: string; locale: string; sections?: Record<string, unknown>[] },
  newCards: Card[],
  locale: string,
  slug: string
) {
  const sections = [...(doc.sections ?? [])];
  const whyIndex = sections.findIndex((s) => s._type === 'serviceWhy');

  if (whyIndex === -1) {
    console.log(`[${locale.toUpperCase()}] Creating new serviceWhy section for: ${doc.nombre} (${slug})`);
    sections.push({
      _key: 'why',
      _type: 'serviceWhy',
      title: locale === 'es' ? `¿Por qué elegir a Hiweb para ${doc.nombre}?` : `Why choose Hiweb for ${doc.nombre}?`,
      description:
        locale === 'es'
          ? 'Un partner estratégico que piensa en tu negocio, no solo en el servicio que contratas.'
          : 'A strategic partner invested in your business growth, not just delivering deliverables.',
      ctaLabel: locale === 'es' ? 'Agenda un diagnóstico' : 'Book a consultation',
      ctaHref: '/contacto',
      cards: newCards,
    });
  } else {
    console.log(`[${locale.toUpperCase()}] Updating ${newCards.length} cards in serviceWhy for: ${doc.nombre} (${slug})`);
    const currentWhy = sections[whyIndex];
    sections[whyIndex] = {
      ...currentWhy,
      cards: newCards,
    };
  }

  if (WRITE) {
    await client.patch(doc._id).set({ sections }).commit();
    console.log(`  ✓ Committed to Sanity: ${doc._id}`);
  } else {
    console.log(`  [DRY RUN] Would set ${newCards.length} cards on: ${doc._id}`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
