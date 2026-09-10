export const SITE = {
  name: 'Hiweb',
  legalName: 'Hiweb Marketing',
  tagline:
    'Partner estratégico con la eficiencia de un equipo interno y el alcance de una agencia enterprise.',
  url: 'https://hiweb-marketing-ui.vercel.app',
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
  { href: '/portafolio', label: 'Casos de Éxito' },
  { href: '/nosotros', label: 'Nosotros' },
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
  },
  {
    title: 'Idioma de tu industria',
    description:
      'Casos, retos y métricas propias de tu sector. No traducimos un playbook genérico: hablamos como opera tu negocio.',
  },
  {
    title: 'Servicio atado a resultado',
    description:
      'Cada palanca —paid, SEO, web, CRM— se conecta a un outcome de negocio, no a una táctica aislada.',
  },
  {
    title: 'Evidencia verificable',
    description:
      'Trabajamos con empresas consolidadas. Resultados propios, cifras públicas y tecnología que podemos mostrar.',
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

export const HOME_FAQS = [
  {
    question: '¿Para qué tipo de empresa es Hiweb?',
    answer:
      'Empresas consolidadas que ya invierten en marketing y necesitan un partner por industria: mensaje, paid, web y CRM como sistema. Si buscas una agencia genérica de tácticas sueltas, no somos el fit.',
  },
  {
    question: '¿Trabajan por industria o por servicio?',
    answer:
      'Por industria. Cada servicio se conecta a un resultado de negocio de tu sector. El catálogo existe para que elijas la palanca; el diagnóstico define el orden.',
  },
  {
    question: '¿Cuánto tarda ver resultados?',
    answer:
      'La auditoría cierra un mapa en días. Los primeros experimentos salen en 2–4 semanas. Los outcomes de pipeline se leen en ciclos de 60–90 días.',
  },
  {
    question: '¿Solo hacen ads?',
    answer:
      'No. Integramos branding, SEO, paid, web, CRM e IA. Separar marca de performance es lo que suele romper la conversión.',
  },
  {
    question: '¿Cómo se ve el día a día?',
    answer:
      'Ciclos cortos, tablero compartido y métricas acordadas. Sin reportes teatro: decisiones con evidencia.',
  },
] as const;

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
  { href: '/aviso-de-privacidad', label: 'Aviso de privacidad' },
  { href: '/terminos', label: 'Términos' },
] as const;
