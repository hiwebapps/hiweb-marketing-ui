import type { HomeCopy, TitledBlock } from '../lib/content/types';

const PILLAR_ICONS = [
  { icon: 'target', accent: 'purple', href: '/servicios' },
  { icon: 'globe', accent: 'cyan', href: '/servicios' },
  { icon: 'check', accent: 'green', href: '/servicios' },
  { icon: 'users', accent: 'orange', href: '/nosotros' },
] as const;

export const WEBFLOW_HOME_PILLAR_COPY: TitledBlock[] = [
  {
    title: 'Estrategia basada en intención, no en ocurrencias',
    description:
      'No adivinamos qué quiere tu cliente. Analizamos el comportamiento real de búsqueda para construir una estrategia que atienda sus necesidades específicas y lo lleve a convertirse.',
  },
  {
    title: 'Infraestructura técnica para convertir',
    description:
      'El diseño no es decoración: es ingeniería. Desarrollamos sitios web y sistemas de automatización que funcionan como una máquina de ventas, guiando al usuario desde el clic hasta el cierre.',
  },
  {
    title: 'Visibilidad real (no vanidad)',
    description:
      'Olvídate de los "likes" vacíos. Ejecutamos campañas de SEO y Ads diseñadas para aparecer justo cuando tu cliente está listo para comprar, generando leads de alta calidad.',
  },
  {
    title: 'Soporte local, estándares globales',
    description:
      'Tienes la cercanía y el soporte de un equipo local en México, pero con la rigurosidad técnica y los procesos de una agencia de primer nivel internacional.',
  },
];

export const WEBFLOW_SERVICE_TAGLINES: Record<string, string> = {
  seo: 'Posicionamiento orgánico basado en datos para captar demanda existente.',
  'google-ads': 'Campañas de búsqueda y display que convierten clics en clientes.',
  'meta-ads': 'Publicidad en Facebook e Instagram para generar leads y ventas.',
  'redes-sociales': 'Gestión estratégica de contenido para construir autoridad de marca.',
  'desarrollo-web': 'Sitios web de alto rendimiento diseñados para convertir visitantes.',
  'crm-automatizacion': 'Sistemas que nutren leads y cierran ventas mientras duermes.',
  branding: 'Identidad visual y verbal que diferencia a tu marca en el mercado.',
  'ia-marketing': 'Implementación de inteligencia artificial para optimizar procesos.',
  'community-manager': 'Gestión activa de comunidad y atención para fidelizar clientes.',
};

export const WEBFLOW_HOME: HomeCopy = {
  heroTitle: 'Agencia de Marketing Digital en México: SEO, Ads, Redes Sociales, Diseño Web y Más',
  heroLead:
    'Creamos ecosistemas digitales que generan leads, aumentan ventas y mejoran el ROI de tu negocio.',
  primaryCta: { label: 'Cotiza tu proyecto', href: '/contacto' },
  secondaryCta: { label: 'Ver casos de éxito', href: '/portafolio' },
  pillarIntro: {
    eyebrow: 'Nuestro enfoque',
    title: 'Más que una agencia, tu socio estratégico',
    description:
      'No vendemos servicios sueltos. Integramos estrategia, tecnología y ejecución para construir un activo digital que genere resultados medibles.',
  },
  pillars: WEBFLOW_HOME_PILLAR_COPY,
  serviceIntro: {
    eyebrow: 'Servicios',
    title: 'Servicios de marketing digital',
    description:
      'Marketing 360. Integramos SEO, publicidad, redes sociales y automatización en una sola estrategia. Así evitas que tus esfuerzos se diluyan y construyes un sistema que trabaja para ti 24/7.',
  },
  storiesIntro: {
    eyebrow: 'Clientes',
    title: 'Lo que dicen nuestros clientes',
    description: 'Resultados reales de empresas que ya operan con Hiweb.',
  },
  testimonials: [
    {
      client: "Pass your TOEFL",
      quote:
        'Contratamos a Hiweb para que nos ayudara a tener más alumnos, y realmente ha funcionado muy bien. Desde que empezamos a trabajar con ellos, hemos notado un aumento claro en las inscripciones. El equipo es profesional, atento y siempre está pendiente de lo que necesitamos. Nos sienten como parte de su equipo y eso se nota en los resultados.',
      name: 'Gaby M.',
      role: 'Coordinadora de Marketing',
    },
    {
      client: "Paulo's Pizza",
      quote:
        'Desde que empezamos a trabajar con Hiweb, hemos notado un cambio muy positivo en nuestras ventas. Antes dependíamos mucho de las sucursales físicas, pero ahora, gracias a su estrategia digital, hemos logrado atraer más clientes y aumentar nuestros ingresos. El equipo es profesional, creativo y siempre está pendiente de nuestros resultados. Sin duda, una gran inversión para nuestro negocio.',
      name: 'Julia T.',
      role: 'Gerente de Marketing',
    },
    {
      client: 'Avant',
      quote:
        'Desde que empezamos a trabajar con Hiweb, hemos notado un aumento significativo en nuestras ventas en línea. Su equipo no solo entiende de marketing digital, sino que realmente se toma el tiempo para comprender nuestro negocio y nuestras necesidades. La estrategia que implementaron nos ha permitido llegar a más clientes y mejorar nuestra presencia en el mercado. Estamos muy satisfechos con los resultados y definitivamente los recomendamos.',
      name: 'Sebastián S.',
      role: 'Director de Marketing',
    },
    {
      client: 'Diazar',
      quote:
        'Trabajar con Hiweb ha sido una experiencia transformadora para nuestra empresa. Su enfoque estratégico y su profundo conocimiento del marketing digital nos han permitido no solo aumentar nuestras ventas, sino también fortalecer nuestra marca en el mercado. El equipo es altamente profesional, creativo y siempre está disponible para resolver cualquier duda. Estamos muy contentos con los resultados y esperamos seguir creciendo juntos.',
      name: 'David M.',
      role: 'Director General',
    },
  ],
  processIntro: {
    eyebrow: 'Cómo trabajamos',
    title: 'Un proceso claro, de principio a fin',
    description: 'Cuatro fases para pasar de diagnóstico a crecimiento medible.',
  },
  process: [
    {
      index: '01',
      title: 'Auditoría y Diagnóstico 360',
      description:
        'Analizamos tu sitio web, competencia y mercado para identificar oportunidades reales de crecimiento.',
    },
    {
      index: '02',
      title: 'Estrategia 360',
      description:
        'Diseñamos un plan integral que conecta SEO, Ads, redes sociales y automatización hacia un mismo objetivo.',
    },
    {
      index: '03',
      title: 'Implementación',
      description:
        'Ejecutamos las campañas, el sitio y los sistemas con un estándar técnico de nivel internacional.',
    },
    {
      index: '04',
      title: 'Optimización Basada en ROI',
      description:
        'Medimos, ajustamos y escalamos lo que funciona para mejorar continuamente el retorno de inversión.',
    },
  ],
  metricsIntro: {
    eyebrow: 'Cifras',
    title: 'Nuestra experiencia nos respalda',
    titleMuted: 'Presencia Global · Dominio',
    description:
      'Más de una década construyendo marcas en México, Estados Unidos y Canadá, con un historial de inversión publicitaria que se traduce en resultados.',
  },
  metrics: [
    { valor: 10, prefix: '+', suffix: ' años', label: 'de experiencia' },
    { valor: 1, prefix: '+$', suffix: 'M USD', label: 'invertidos en ads' },
  ],
  faqIntro: {
    eyebrow: 'FAQ',
    title: 'Preguntas frecuentes',
    description: 'Respuestas claras sobre cómo trabajamos y qué puedes esperar.',
  },
  faqCategories: [
    {
      id: 'general',
      label: 'General',
      items: [
        {
          question: '¿Qué hace una agencia de marketing digital?',
          answer:
            'Una agencia de marketing digital diseña y ejecuta estrategias para atraer, convertir y fidelizar clientes a través de canales digitales como SEO, publicidad pagada, redes sociales, sitios web y automatización.',
        },
        {
          question: '¿Cuánto cuesta contratar una agencia de marketing?',
          answer:
            'Depende del alcance, los canales y los objetivos. En Hiweb cotizamos cada proyecto de forma personalizada después de entender tu negocio, tu mercado y el resultado que buscas.',
        },
        {
          question: '¿En cuánto tiempo se ven resultados?',
          answer:
            'Los anuncios pagados pueden generar leads en semanas. El SEO y el posicionamiento de marca suelen tomar de 3 a 6 meses para mostrar tracción sostenida. Te damos un pronóstico realista en la auditoría inicial.',
        },
        {
          question: '¿Trabajan con empresas de otros países?',
          answer:
            'Sí. Atendemos clientes en México, Estados Unidos y Canadá, con un equipo local y estándares de ejecución internacionales.',
        },
        {
          question: '¿Qué incluye el servicio de marketing 360?',
          answer:
            'Integramos SEO, Ads, redes sociales, diseño web y automatización en una sola estrategia para que cada canal refuerce al resto y el presupuesto no se diluya.',
        },
      ],
    },
    {
      id: 'redes-sociales',
      label: 'Redes sociales',
      items: [
        {
          question: '¿Qué incluye la gestión de redes sociales?',
          answer:
            'Estrategia de contenido, calendario editorial, diseño, publicación, community management y reportes de desempeño alineados a objetivos de negocio.',
        },
        {
          question: '¿También manejan la publicidad en redes?',
          answer:
            'Sí. Operamos campañas en Meta Ads (Facebook e Instagram) y las conectamos con el resto de tu embudo digital.',
        },
        {
          question: '¿Con qué frecuencia publican?',
          answer:
            'Definimos la cadencia según el canal, el tipo de negocio y el presupuesto creativo. Lo importante no es publicar más, sino publicar con intención.',
        },
      ],
    },
    {
      id: 'seo',
      label: 'SEO',
      items: [
        {
          question: '¿Qué es el SEO y por qué lo necesito?',
          answer:
            'El SEO (Search Engine Optimization) es el conjunto de técnicas para que tu sitio aparezca en Google cuando tus clientes buscan lo que ofreces. Te da tráfico constante y de alta intención sin pagar por cada clic.',
        },
        {
          question: '¿Cuánto tarda en funcionar el SEO?',
          answer:
            'Normalmente verás movimientos relevantes entre 3 y 6 meses, dependiendo de la competencia, la autoridad del sitio y el estado técnico inicial.',
        },
        {
          question: '¿El SEO garantiza el primer lugar en Google?',
          answer:
            'Nadie puede garantizar posiciones fijas. Lo que sí hacemos es un trabajo técnico y de contenidos orientado a ganar visibilidad sostenible en las búsquedas que importan para tu negocio.',
        },
      ],
    },
  ],
  seo: {
    metaTitle: 'Agencia de Marketing Digital en México | Hiweb',
    metaDescription:
      'Agencia de marketing digital con clientes en México, EE. UU. y Canadá. SEO, Ads, redes sociales y diseño web con resultados medibles. ¡Cotiza gratis!',
  },
};

export const WEBFLOW_OG_IMAGE_URL =
  'https://cdn.prod.website-files.com/65bdb53f22fa5cd7079bc4c1/6997d42a795b869f3635a1d6_Hiweb%20Team.avif';

export function homePillarsWithIcons(pillars: TitledBlock[] = WEBFLOW_HOME_PILLAR_COPY) {
  return pillars.map((pillar, index) => ({
    ...pillar,
    ...PILLAR_ICONS[index % PILLAR_ICONS.length],
  }));
}
