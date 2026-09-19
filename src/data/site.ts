export const SITE = {
  name: 'Hiweb',
  legalName: 'Hiweb Marketing',
  tagline:
    'Partner estratégico con la eficiencia de un equipo interno y el alcance de una agencia enterprise.',
  url: 'https://hiweb-marketing-ui.hiwebapps.workers.dev',
  email: 'hola@hiweb.marketing',
  phone: '+52 999 123 4567',
  phoneHref: 'tel:+529991234567',
  whatsapp: 'https://wa.me/529991234567',
  locales: ['Mérida', 'Cancún', 'Monterrey'],
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com' },
    { label: 'Instagram', href: 'https://www.instagram.com' },
  ],
} as const;

export const NAV_INDUSTRIES = [
  { slug: 'manufactura', nombre: 'Manufactura' },
  { slug: 'salud', nombre: 'Sector Salud' },
  { slug: 'inmobiliarias', nombre: 'Inmobiliarias' },
  { slug: 'turismo-hoteleria', nombre: 'Turismo / Hotelería' },
  { slug: 'restaurantes', nombre: 'Restaurantes' },
  { slug: 'saas', nombre: 'Software (SaaS)' },
] as const;

export const NAV_SERVICES = [
  { slug: 'redes-sociales', nombre: 'Redes Sociales' },
  { slug: 'seo', nombre: 'SEO' },
  { slug: 'meta-ads', nombre: 'Meta Ads' },
  { slug: 'google-ads', nombre: 'Google Ads' },
  { slug: 'branding', nombre: 'Branding' },
  { slug: 'crm-automatizacion', nombre: 'CRM & Automatización' },
  { slug: 'community-manager', nombre: 'Community Manager' },
  { slug: 'ia-marketing', nombre: 'IA Marketing' },
  { slug: 'desarrollo-web', nombre: 'Desarrollo Web' },
] as const;

export const NAV_LINKS = [
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/portafolio', label: 'Casos de Éxito' },
  { href: '/blog', label: 'Blog' },
] as const;

export const NAV_INDUSTRY_ITEMS = [
  {
    slug: 'manufactura',
    nombre: 'Manufactura',
    desc: 'Pipeline B2B con criterio industrial',
    icon: 'factory',
  },
  {
    slug: 'salud',
    nombre: 'Sector Salud',
    desc: 'Demanda calificada para clínicas',
    icon: 'heart',
  },
  {
    slug: 'inmobiliarias',
    nombre: 'Inmobiliarias',
    desc: 'Captación de compradores y leads',
    icon: 'building',
  },
  {
    slug: 'turismo-hoteleria',
    nombre: 'Turismo / Hotelería',
    desc: 'Ocupación y reservas directas',
    icon: 'plane',
  },
  {
    slug: 'restaurantes',
    nombre: 'Restaurantes',
    desc: 'Tráfico local y repetición',
    icon: 'utensils',
  },
  {
    slug: 'saas',
    nombre: 'Software (SaaS)',
    desc: 'Pipeline, activación y retención',
    icon: 'app',
  },
] as const;

export const NAV_SERVICE_GROUPS = [
  {
    heading: 'Captación',
    items: [
      {
        slug: 'seo',
        nombre: 'SEO / AEO',
        desc: 'Posicionamiento orgánico local y nacional',
        icon: 'activity',
      },
      {
        slug: 'google-ads',
        nombre: 'Google Ads',
        desc: 'Demanda activa con intención de compra',
        icon: 'target',
      },
      {
        slug: 'meta-ads',
        nombre: 'Meta Ads',
        desc: 'Prospecting, lookalike y retargeting',
        icon: 'users',
      },
    ],
  },
  {
    heading: 'Marca & Contenido',
    items: [
      {
        slug: 'redes-sociales',
        nombre: 'Redes Sociales',
        desc: 'Contenido estratégico que genera confianza',
        icon: 'video',
      },
      {
        slug: 'branding',
        nombre: 'Branding',
        desc: 'Identidad visual clara y memorable',
        icon: 'badge',
      },
      {
        slug: 'community-manager',
        nombre: 'Community Manager',
        desc: 'Gestión de comunidad alineada a objetivos',
        icon: 'focus',
      },
    ],
  },
  {
    heading: 'Tecnología',
    items: [
      {
        slug: 'desarrollo-web',
        nombre: 'Diseño y Desarrollo Web',
        desc: 'Sitios rápidos construidos para convertir',
        icon: 'code',
      },
      {
        slug: 'crm-automatizacion',
        nombre: 'CRM & Automatización',
        desc: 'Leads, nurturing y procesos comerciales',
        icon: 'box',
      },
      {
        slug: 'ia-marketing',
        nombre: 'IA Marketing',
        desc: 'Automatización inteligente y chatbots',
        icon: 'spark',
      },
    ],
  },
] as const;

export const NAV_EXPLORE = [
  {
    href: '/portafolio',
    nombre: 'Casos de Éxito',
    desc: 'Proyectos y resultados de clientes',
    icon: 'grid',
  },
  {
    href: '/blog',
    nombre: 'Blog',
    desc: 'Ideas y guías de marketing digital',
    icon: 'book',
  },
  {
    href: '/contacto',
    nombre: 'Contacto',
    desc: 'Agenda tu auditoría con el equipo',
    icon: 'mail',
  },
] as const;

export const HOME_PILLARS = [
  {
    title: 'Partner, no proveedor',
    description:
      'La eficiencia de un equipo interno con el alcance de una agencia enterprise. Un solo interlocutor, ejecución cross-border.',
    icon: 'users',
    accent: 'purple',
    href: '/nosotros',
  },
  {
    title: 'Idioma de tu industria',
    description:
      'Casos, retos y métricas propias de tu sector. No traducimos un playbook genérico: hablamos como opera tu negocio.',
    icon: 'globe',
    accent: 'cyan',
    href: '/industrias',
  },
  {
    title: 'Servicio atado a resultado',
    description:
      'Cada palanca —paid, SEO, web, CRM— se conecta a un outcome de negocio, no a una táctica aislada.',
    icon: 'target',
    accent: 'orange',
    href: '/servicios',
  },
  {
    title: 'Evidencia verificable',
    description:
      'Trabajamos con empresas consolidadas. Resultados propios, cifras públicas y tecnología que podemos mostrar.',
    icon: 'check',
    accent: 'green',
    href: '/portafolio',
  },
] as const;

export const PROCESS_PHASES = [
  {
    index: '01',
    title: 'Auditoría',
    description:
      'Leemos oferta, canales, tracking y fricción real. Un mapa accionable — sin decks eternos.',
  },
  {
    index: '02',
    title: 'Estrategia',
    description:
      'Priorizamos palancas por impacto. Mensaje, media y superficie digital como un solo sistema.',
  },
  {
    index: '03',
    title: 'Ejecución',
    description:
      'Ciclos cortos, hipótesis en creatividades y web que cierra la misma promesa del anuncio.',
  },
  {
    index: '04',
    title: 'Optimización',
    description:
      'Señal, recorte y escala. El sistema se endurece con evidencia, no con opiniones.',
  },
] as const;

export const HOME_ABOUT = {
  eyebrow: 'Sobre nosotros',
  title: 'Expertise colectivo, tecnología propia, capacidad cross-border.',
  description:
    'Hiweb combina equipo senior, un portal propio y presencia en Mérida, Cancún y Monterrey. Operamos como extensión de tu dirección de marketing — con el músculo de una agencia enterprise.',
} as const;

export type TeamCategory = 'web' | 'redes' | 'diseno';

export const TEAM_CATEGORIES = [
  { id: 'web', label: 'Web' },
  { id: 'redes', label: 'Redes Sociales' },
  { id: 'diseno', label: 'Diseño' },
] as const satisfies ReadonlyArray<{ id: TeamCategory; label: string }>;

export const TEAM_MEMBERS = [
  {
    name: 'Mariana Solís',
    role: 'Dirección de estrategia',
    bio: 'Colecciona cafeteras y discute frameworks antes del primer espresso.',
    photo: '/images/team/mariana.png',
    category: 'redes',
    accent: 'cyan',
    socials: {
      tiktok: 'https://www.tiktok.com',
      instagram: 'https://www.instagram.com',
      linkedin: 'https://www.linkedin.com',
    },
  },
  {
    name: 'Diego Rangel',
    role: 'Head of performance',
    bio: 'Corre 10K los domingos y odia los reportes teatro con pasión atlética.',
    photo: '/images/team/diego.png',
    category: 'redes',
    accent: 'purple',
    socials: {
      tiktok: 'https://www.tiktok.com',
      instagram: 'https://www.instagram.com',
      linkedin: 'https://www.linkedin.com',
    },
  },
  {
    name: 'Valeria Chen',
    role: 'Dirección creativa',
    bio: 'Hace sourdough y recorta anuncios en el mismo cuaderno.',
    photo: '/images/team/valeria.png',
    category: 'diseno',
    accent: 'orange',
    socials: {
      tiktok: 'https://www.tiktok.com',
      instagram: 'https://www.instagram.com',
      linkedin: 'https://www.linkedin.com',
    },
  },
  {
    name: 'Andrés Palomo',
    role: 'Lead producto web',
    bio: 'Arma Lego a las 11pm y discute Core Web Vitals al desayuno.',
    photo: '/images/team/andres.png',
    category: 'web',
    accent: 'lime',
    socials: {
      tiktok: 'https://www.tiktok.com',
      instagram: 'https://www.instagram.com',
      linkedin: 'https://www.linkedin.com',
    },
  },
  {
    name: 'Sofía Méndez',
    role: 'Frontend lead',
    bio: 'Refactoriza a medianoche y colecciona tipografías como si fueran vinilos.',
    photo: '/images/team/andres.png',
    category: 'web',
    accent: 'cyan',
    socials: {
      tiktok: 'https://www.tiktok.com',
      instagram: 'https://www.instagram.com',
      linkedin: 'https://www.linkedin.com',
    },
  },
  {
    name: 'Luis Ortega',
    role: 'Full-stack engineer',
    bio: 'Deploya en viernes (sí) y cocina pasta al dente mientras espera el build.',
    photo: '/images/team/diego.png',
    category: 'web',
    accent: 'purple',
    socials: {
      linkedin: 'https://www.linkedin.com',
    },
  },
  {
    name: 'Camila Ruiz',
    role: 'Social media lead',
    bio: 'Programa reels a las 6am y todavía responde DMs con humor.',
    photo: '/images/team/mariana.png',
    category: 'redes',
    accent: 'orange',
    socials: {
      tiktok: 'https://www.tiktok.com',
      instagram: 'https://www.instagram.com',
    },
  },
  {
    name: 'Héctor Nava',
    role: 'Paid media specialist',
    bio: 'Ajusta pujas entre series y nunca pierde un pixel de tracking.',
    photo: '/images/team/diego.png',
    category: 'redes',
    accent: 'lime',
    socials: {
      linkedin: 'https://www.linkedin.com',
      instagram: 'https://www.instagram.com',
    },
  },
  {
    name: 'Elena Vargas',
    role: 'Brand designer',
    bio: 'Diseña sistemas tipográficos y planta suculentas con la misma precisión.',
    photo: '/images/team/valeria.png',
    category: 'diseno',
    accent: 'cyan',
    socials: {
      instagram: 'https://www.instagram.com',
      linkedin: 'https://www.linkedin.com',
    },
  },
  {
    name: 'Bruno Castillo',
    role: 'Motion designer',
    bio: 'Anima microinteracciones mientras el café se enfría. Otra vez.',
    photo: '/images/team/andres.png',
    category: 'diseno',
    accent: 'purple',
    socials: {
      tiktok: 'https://www.tiktok.com',
      linkedin: 'https://www.linkedin.com',
    },
  },
] as const;

export const HOME_FAQ_CATEGORIES = [
  {
    id: 'general',
    label: 'General',
    items: [
      {
        question: '¿Para qué tipo de empresa es Hiweb?',
        answer:
          'Empresas que ya invierten en marketing y necesitan un partner por industria: mensaje, paid, web y CRM como sistema.',
      },
      {
        question: '¿Cómo es el proceso de trabajo?',
        answer:
          'Auditoría, mapa de palancas y ciclos cortos. El orden lo define el diagnóstico, no un paquete genérico.',
      },
      {
        question: '¿Cuánto tarda ver resultados?',
        answer:
          'Un mapa en días, primeros experimentos en 2–4 semanas y lectura de pipeline en ciclos de 60–90 días.',
      },
      {
        question: '¿Hay un mínimo de inversión?',
        answer:
          'Sí. El mínimo se comparte en la auditoría para proteger foco y calidad, sin pricing teatro en la home.',
      },
    ],
  },
  {
    id: 'seo',
    label: 'SEO',
    items: [
      {
        question: '¿El SEO es técnico, de contenidos o ambos?',
        answer:
          'Cubrimos arquitectura, señal on-page y contenidos atados a la oferta. No publicamos por volumen.',
      },
      {
        question: '¿En cuánto tiempo se mueve el orgánico?',
        answer:
          'Depende de autoridad e índice. Suele haber señal táctica en semanas y movimiento de rankings en trimestres.',
      },
      {
        question: '¿El SEO se conecta con paid y web?',
        answer:
          'Sí. Keywords, landing y mensaje se alinean para no pelear entre canales.',
      },
      {
        question: '¿Trabajan SEO local y nacional?',
        answer:
          'Ambos, según industria y captura de demanda. El mapa sale del diagnóstico.',
      },
    ],
  },
  {
    id: 'redes-sociales',
    label: 'Redes sociales',
    items: [
      {
        question: '¿Gestionan redes o solo la estrategia?',
        answer:
          'Estrategia, contenidos y pauta cuando social es una palanca real del sistema. No community por inercia.',
      },
      {
        question: '¿En qué plataformas publican?',
        answer:
          'Donde está el ICP. No abrimos perfiles de más si no hay hipótesis de demanda.',
      },
      {
        question: '¿Cómo miden el retorno de social?',
        answer:
          'Conversión asistida, leads y costo por resultado. Vanity metrics no entran al tablero.',
      },
      {
        question: '¿Incluyen pauta en Meta u otras redes?',
        answer:
          'Sí, cuando el canal califica. Creatividades y destino se diseñan con el mismo mensaje.',
      },
    ],
  },
  {
    id: 'web',
    label: 'Web',
    items: [
      {
        question: '¿Rediseñan sitios existentes?',
        answer:
          'Sí, si el sitio actual frena conversión. Partimos de oferta, prueba y tracking, no de un restyling cosmética.',
      },
      {
        question: '¿La web queda lista para ads y CRM?',
        answer:
          'Ese es el estándar: landings, eventos y handoff a CRM. La web es superficie del sistema.',
      },
      {
        question: '¿Cuánto tarda un sitio o una landing?',
        answer:
          'Una landing de experimento en semanas. Un sitio completo depende de alcance y contenidos.',
      },
      {
        question: '¿Con qué stack construyen?',
        answer:
          'El que mejor sirva al performance y al mantenimiento. El stack se decide en diagnóstico.',
      },
    ],
  },
  {
    id: 'google-ads',
    label: 'Google Ads',
    items: [
      {
        question: '¿Manejan campañas de Google Ads?',
        answer:
          'Search, Performance Max y demanda cuando hay señal. Sin cuentas “siempre prendidas” sin hipótesis.',
      },
      {
        question: '¿Cuál es el presupuesto mínimo recomendado?',
        answer:
          'El suficiente para leer señal. Lo calibramos en la auditoría según industria y ticket.',
      },
      {
        question: '¿Incluyen creatividades y landing?',
        answer:
          'Sí. Anuncio y destino se diseñan juntos. Un ads sin landing alineada no entra al sistema.',
      },
      {
        question: '¿Con qué frecuencia reportan?',
        answer:
          'Tablero compartido y ciclos cortos. Decisiones con evidencia, no un PDF mensual de teatro.',
      },
    ],
  },
  {
    id: 'branding',
    label: 'Branding',
    items: [
      {
        question: '¿Hacen identidad visual completa?',
        answer:
          'Cuando la marca no sostiene la oferta. Branding al servicio de conversión, no de un book aislado.',
      },
      {
        question: '¿El branding se conecta con performance?',
        answer:
          'Sí. Mensaje, verbal y visual se usan en web, ads y contenidos. Separarlos suele romper la conversión.',
      },
      {
        question: '¿Rediseñan una marca existente?',
        answer:
          'Si el sistema actual no escala o no se entiende. El alcance se define en el diagnóstico.',
      },
      {
        question: '¿Entregan un sistema o solo un logo?',
        answer:
          'Un sistema aplicable: voz, piezas y reglas de uso. El logo solo no es un entregable nuestro.',
      },
    ],
  },
] as const;

export const HOME_FAQS = HOME_FAQ_CATEGORIES.flatMap((category) => category.items);

export const CONTACT_FAQS = [
  {
    question: '¿Qué pasa después de enviar el formulario?',
    answer:
      'Confirmamos recepción el mismo día hábil, agendamos la auditoría y preparamos un brief con lo que necesitamos de tu lado.',
  },
  {
    question: '¿La auditoría tiene costo?',
    answer:
      'La primera sesión de diagnóstico es el filtro. Si hay fit, proponemos el siguiente paso con alcance y ritmo. Sin compromiso de retainer en esa llamada.',
  },
  {
    question: '¿Puedo escribir o llamar directo?',
    answer:
      'Sí. Teléfono, email y WhatsApp están en esta página. El formulario nos ayuda a llegar con contexto.',
  },
] as const;

export const CONTACT_NEXT_STEPS = [
  {
    title: '1. Brief',
    description: 'Nos cuentas industria, objetivo y qué ya está en marcha.',
  },
  {
    title: '2. Auditoría',
    description: 'Revisamos canales, oferta y tracking. Una sesión, un mapa.',
  },
  {
    title: '3. Propuesta',
    description: 'Te devolvemos el siguiente paso del sistema — o un no claro.',
  },
] as const;

export const GLOBAL_METRICS = [
  { valor: 3.2, decimals: 1, suffix: '×', label: 'pipeline calificado promedio a 90 días' },
  { valor: 40, prefix: '−', suffix: '%', label: 'ciclo de venta en cuentas con mensaje alineado' },
  { valor: 6, suffix: '', label: 'industrias con playbook propio' },
  { valor: 9, suffix: '', label: 'servicios conectados a un resultado' },
] as const;

export const LEGAL_LINKS = [
  { href: '/sections', label: 'Sections' },
  { href: '/aviso-de-privacidad', label: 'Aviso de privacidad' },
  { href: '/terminos', label: 'Términos' },
] as const;
