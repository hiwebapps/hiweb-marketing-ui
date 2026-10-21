export type BlogArticle = {
  id: string;
  slug: string;
  title: string;
  category: 'ia-paid' | 'seo' | 'b2b' | 'estrategia';
  categoryLabel: string;
  excerpt: string;
  readingMinutes: number;
  image: string;
  publishedAt: string;
  author: string;
  featured?: boolean;
  takeaways: string[];
};

export const BLOG_SHOWCASE_DATA: BlogArticle[] = [
  {
    id: 'art-chatgpt-ads',
    slug: 'anuncios-en-chatgpt',
    title: 'ChatGPT Ads: Cómo funciona la plataforma publicitaria de OpenAI y quién debería usarla',
    category: 'ia-paid',
    categoryLabel: 'IA & Paid Media',
    excerpt: 'OpenAI comenzó el despliegue de formatos patrocinados en ChatGPT. Analizamos su formato de intención conversacional y cómo complementará tus campañas de Meta y Google Ads.',
    readingMinutes: 6,
    image: 'https://cdn.sanity.io/images/fxardjr1/web-2026/5b89dee44d48b69ef3c362d7ac7a5f402f0e8be9-1620x1080.jpg?w=1200&auto=format',
    publishedAt: 'Oct 2026',
    author: 'Equipo Hiweb',
    featured: true,
    takeaways: [
      'La publicidad en LLMs no es por palabra clave, sino por contexto de consulta y resolución de intención inmediata.',
      'SaaS, educación técnica y servicios B2B son los sectores con mayor potencial de conversión en la primera fase.',
      'Requiere un mix equilibrado: Meta para demanda latente y ChatGPT para demanda de alta deliberación.'
    ]
  },
  {
    id: 'art-nearshoring',
    slug: 'nearshoring-marketing-industrial-mexico',
    title: 'Nearshoring en México: qué industrias crecen y cómo capturar esa demanda con marketing B2B',
    category: 'b2b',
    categoryLabel: 'B2B & Nearshoring',
    excerpt: 'La relocalización de cadenas de suministro está trayendo miles de millones en inversión industrial. Descubre cómo posicionar plantas, parques industriales y maquila ante compradores extranjeros.',
    readingMinutes: 8,
    image: 'https://cdn.sanity.io/images/fxardjr1/web-2026/33c697db22332164b320668b835881d44bf1123a-1920x1080.jpg?w=1200&auto=format',
    publishedAt: 'Sep 2026',
    author: 'Equipo Hiweb',
    takeaways: [
      'El comprador internacional no usa redes sociales de entretenimiento: busca en Google con términos técnicos en inglés y LinkedIn Ads.',
      'Un sitio web con fichas técnicas descargables, certificaciones ISO y tour virtual genera 3x más solicitudes de cotización (RFQs).',
      'La velocidad de respuesta comercial por WhatsApp Business y CRM define quién cierra el contrato.'
    ]
  },
  {
    id: 'art-seo-inmobiliario',
    slug: 'seo-inmobiliario-posicionamiento-google',
    title: 'SEO inmobiliario: cómo posicionar tus desarrollos en Google sin pagar $200 por clic',
    category: 'seo',
    categoryLabel: 'SEO & Posicionamiento',
    excerpt: 'El costo por lead en portales inmobiliarios tradicionales sigue subiendo. Aprende cómo construir un canal orgánico que atraiga inversionistas directos mes a mes.',
    readingMinutes: 7,
    image: 'https://cdn.sanity.io/images/fxardjr1/web-2026/fe49a77d54b8c48bc47f4f42cb4e0cd332cfa0cd-1920x1280.jpg?w=1200&auto=format',
    publishedAt: 'Ago 2026',
    author: 'Equipo Hiweb',
    takeaways: [
      'La estructura de URLs por zona, tipo de propiedad y amenidad capta búsquedas transaccionales de alto valor.',
      'La optimización de Google Business Profile y fichas de mapa aporta hasta un 40% de visitas al showroom.',
      'El contenido sobre plusvalía, rendimiento de renta y comparativas de ciudad supera en conversión a las fichas vacías.'
    ]
  },
  {
    id: 'art-gastronomico',
    slug: 'marketing-gastronomico-restaurantes',
    title: 'Marketing gastronómico: Cómo llenar mesas y sostener el 90%+ de ocupación con estrategia digital',
    category: 'estrategia',
    categoryLabel: 'Estrategia & Growth',
    excerpt: 'Más allá de fotos de platillos bonitos: la fórmula de embudo local que combina Meta Ads geolocalizados, Reels de alto antojo y menús digitales sin fricción.',
    readingMinutes: 5,
    image: 'https://cdn.sanity.io/images/fxardjr1/web-2026/3ef0757131601d7596f8719a50b02987aed64722-5616x3744.jpg?w=1200&auto=format',
    publishedAt: 'Jul 2026',
    author: 'Equipo Hiweb',
    takeaways: [
      'Las campañas con radio de 5km y optimización por horarios específicos (jueves a domingo) reducen el costo por reserva a menos de $20 MXN.',
      'Los videos con sonido ambiente y preparación artesanal tienen 2.8x mayor retención que fotos estáticas.',
      'El enlace directo a reserva por WhatsApp con mensaje predeterminado duplica la tasa de asistencia.'
    ]
  },
  {
    id: 'art-agencia-eleccion',
    slug: 'como-elegir-una-agencia-de-publicidad',
    title: 'Cómo elegir una agencia de publicidad en México: preguntas que debes hacer antes de firmar',
    category: 'estrategia',
    categoryLabel: 'Estrategia & Growth',
    excerpt: 'Métricas de vanidad vs métricas de negocio. Una guía transparente para directores generales y gerentes de marketing para auditar propuestas y evitar promesas vacías.',
    readingMinutes: 6,
    image: 'https://cdn.sanity.io/images/fxardjr1/web-2026/208319568e7232fb62848bfb85b31e5cdc964122-1919x970.jpg?w=1200&auto=format',
    publishedAt: 'Jun 2026',
    author: 'Equipo Hiweb',
    takeaways: [
      'Exige que las cuentas publicitarias y de analítica siempre sean propiedad legal de tu empresa.',
      'Evalúa si la propuesta incluye integración con tu equipo de ventas o solo entrega prospectos sin calificar.',
      'Revisa reportes en tiempo real (Looker Studio) en lugar de PDFs mensuales estáticos.'
    ]
  },
  {
    id: 'art-ai-overviews',
    slug: 'trafico-web-ai-overviews-google',
    title: 'AI Overviews de Google y AEO: cómo adaptar el contenido de tu web a la era generativa',
    category: 'seo',
    categoryLabel: 'SEO & Posicionamiento',
    excerpt: 'Las respuestas directas con IA en Google cambiaron el CTR orgánico. Conoce cómo optimizar la arquitectura de tu sitio web para ser citado como fuente preferente.',
    readingMinutes: 7,
    image: 'https://cdn.sanity.io/images/fxardjr1/web-2026/6d2e254e2352a0c7031eff578fb3c8b1aef1502f-1620x1080.jpg?w=1200&auto=format',
    publishedAt: 'May 2026',
    author: 'Equipo Hiweb',
    takeaways: [
      'El marcado Schema profundo (FAQPage, Organization, ItemList) es obligatorio para que los modelos sinteticen tus datos.',
      'Las tablas comparativas, listas estructuradas y datos duros tienen 4x más probabilidad de ser citados en el panel de IA.',
      'El SEO moderno ya no es rankear un enlace azul, sino posicionar el conocimiento de tu marca como la respuesta de referencia.'
    ]
  }
];
