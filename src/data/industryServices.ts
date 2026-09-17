/** Industry-adapted service blurbs for /industrias/[slug] service cards. */

type ServiceSlug =
  | 'redes-sociales'
  | 'seo'
  | 'meta-ads'
  | 'google-ads'
  | 'branding'
  | 'crm-automatizacion'
  | 'community-manager'
  | 'ia-marketing'
  | 'desarrollo-web';

type IndustryId =
  | 'manufactura'
  | 'salud'
  | 'inmobiliarias'
  | 'turismo-hoteleria'
  | 'restaurantes'
  | 'saas';

const COPY: Record<IndustryId, Record<ServiceSlug, string>> = {
  manufactura: {
    'redes-sociales':
      'Contenido que habla de planta, specs y prueba — no de engagement vacío. LinkedIn y web como sistema hacia RFQs.',
    seo: 'Captura búsquedas de buyers y ingenieros cuando ya buscan proveedor. Hubs técnicos que califican antes de ventas.',
    'meta-ads':
      'Apoyo de marca cuando cabe. El core de manufactura suele ser search y LinkedIn; Meta no improvisa el pipeline.',
    'google-ads':
      'Campañas ancladas a cotización e intención industrial. Menos CPC teatro; más leads que el comité puede cerrar.',
    branding:
      'Mensaje y sistema visual que sobreviven un pitch técnico. La marca deja de sonar a feria genérica.',
    'crm-automatizacion':
      'Eventos de RFQ, scoring de cuenta y handoff limpio a ventas. Tracking que el ciclo B2B sí necesita.',
    'community-manager':
      'Presencia operativa en los canales donde tu buyer aparece — con criterio de planta, no de calendario vacío.',
    'ia-marketing':
      'IA para acelerar briefs técnicos, variantes y reportes — siempre con humano senior que valida el claim.',
    'desarrollo-web':
      'Web que traduce specs a oferta clara: landing, catálogo y paths de cotización que el comité entiende.',
  },
  salud: {
    'redes-sociales':
      'Contenido clínico-credencial que genera confianza y agenda — sin claims que pongan en riesgo cumplimiento.',
    seo: 'Intención de pacientes y referentes: síntomas, tratamientos y ubicación. Páginas que llenan agenda calificada.',
    'meta-ads':
      'Alcance local y remarketing con creativos que respetan tono clínico. Objetivo: citas, no vanity.',
    'google-ads':
      'Search para especialidades y urgencias reales. Landing + tracking hacia cita confirmada.',
    branding:
      'Identidad que transmite cuidado y autoridad. Un solo lenguaje entre consultorio, ads y recepción.',
    'crm-automatizacion':
      'Recordatorios, lead scoring y CRM alineado a agenda — menos no-shows, más pacientes que llegan.',
    'community-manager':
      'Comunidad y respuestas con protocolo: educación, referidos y tono que protege la marca clínica.',
    'ia-marketing':
      'IA para guiones, FAQs y variantes — revisadas por criterio médico-marketing antes de publicar.',
    'desarrollo-web':
      'Sitio con rutas claras a agenda: especialidades, médicos y prueba social que reduce fricción.',
  },
  inmobiliarias: {
    'redes-sociales':
      'Inventario y lifestyle con narrativa de proyecto. Contenido que empuja visitas reales, no solo saves.',
    seo: 'SEO de desarrollos, zonas y tipologías. Captura demanda cuando el comprador ya busca en tu plaza.',
    'meta-ads':
      'Prospecting y retargeting de desarrollos con creativos de producto. KPI: visitas y leads calificados.',
    'google-ads':
      'Search + Performance Max anclados a unidades y ubicaciones. Menos leads fríos; más tours agendados.',
    branding:
      'Marca de desarrollo coherente en render, sala de ventas y digital. El claim sobrevive el tour.',
    'crm-automatizacion':
      'Pipeline de prospectos, seguimiento de visitas y automatismos que el closer sí usa.',
    'community-manager':
      'Presencia que responde leads y muestra progreso de obra — con ritmo de lanzamiento, no de relleno.',
    'ia-marketing':
      'IA para fichas, variantes de anuncio y copy por tipología — con humano validando precio y oferta.',
    'desarrollo-web':
      'Web de proyecto con fichas, amenities y CTA a visita. Velocidad y claridad para cerrar el tour.',
  },
  'turismo-hoteleria': {
    'redes-sociales':
      'Contenido de experiencia y disponibilidad que empuja reserva directa — menos dependencia de OTAs.',
    seo: 'SEO de destino, tipologías y seasons. Páginas que capturan intención de viaje antes del OTA.',
    'meta-ads':
      'Prospecting y retargeting de estancias con creativos de propiedad. Objetivo: noches directas.',
    'google-ads':
      'Hotel Ads / search hacia booking propio. Mensaje y landing alineados a ocupación y ADR.',
    branding:
      'Marca hotelera coherente en property, paid y web. Una promesa que la recepción puede cumplir.',
    'crm-automatizacion':
      'CRM de huésped, upsell y remarketing post-estancia. Señal que alimenta ocupación recurrente.',
    'community-manager':
      'Comunidad y UGC con ritmo de temporada. Respuestas que protegen review score y marca.',
    'ia-marketing':
      'IA para variantes de campaña y copy por segmento — con revenue validando oferta y fechas.',
    'desarrollo-web':
      'Booking path rápido: habitaciones, packages y checkout sin fricción que se coma la conversión.',
  },
  restaurantes: {
    'redes-sociales':
      'Contenido de platillo, ambiente y prueba social que mueve mesas — no solo likes de food porn.',
    seo: 'SEO local y de menú: “cerca de mí”, especialidades y eventos. Demanda que llena servicio.',
    'meta-ads':
      'Campañas locales a reserva y delivery propio. Creativos de oferta con KPI de mesas/ticket.',
    'google-ads':
      'Search + Local que captura hambre con intención. Landing a reserva o pedido sin rodeos.',
    branding:
      'Identidad de marca que se siente en salón, empaque y ads. Un solo tono de experiencia.',
    'crm-automatizacion':
      'CRM de comensales, reservas y campañas de recurrencia. Menos no-shows; más ticket repetido.',
    'community-manager':
      'Community con ritmo de menú y eventos. Respuestas que convierten DMs en mesas.',
    'ia-marketing':
      'IA para creativos de platillo y variantes diarias — con chef/marketing validando claim.',
    'desarrollo-web':
      'Web/menú digital con reserva y pedido. Rápida en mobile, clara en horarios y ubicación.',
  },
  saas: {
    'redes-sociales':
      'Narrativa de producto y proof que alimenta demos — LinkedIn/X con ICP, no vanity de startup.',
    seo: 'SEO de categorías, use cases y comparativas. Captura intent cuando el buyer evalúa stack.',
    'meta-ads':
      'Retargeting y awareness selectivo. El core SaaS suele ser search + LinkedIn; Meta apoya, no improvisa.',
    'google-ads':
      'Search y remarketing hacia demo/trial. Mensaje anclado a outcome, no a features sueltas.',
    branding:
      'Positioning y sistema visual que sobreviven un deck de ventas enterprise. Claim + proof alineados.',
    'crm-automatizacion':
      'Lifecycle, scoring MQL→SQL y handoff a AE. Eventos que el pipeline SaaS sí lee.',
    'community-manager':
      'Comunidad de usuarios y advocates con ritmo de release — soporte de marca, no spam.',
    'ia-marketing':
      'IA para copy de landing, ads y nurture — con PMM validando claim y compliance.',
    'desarrollo-web':
      'Web/product marketing site: use cases, pricing claro y path a demo sin fricción.',
  },
};

const FALLBACK: Record<ServiceSlug, (industry: string) => string> = {
  'redes-sociales': (industry) =>
    `Presencia y contenido leídos para ${industry}: empuja un resultado de demanda, no un calendario vacío.`,
  seo: (industry) =>
    `SEO con intención de ${industry}. Captura búsquedas cuando el comprador ya está evaluando.`,
  'meta-ads': (industry) =>
    `Paid social con creativos y audiencias de ${industry}. Objetivo de negocio, no de vanity.`,
  'google-ads': (industry) =>
    `Search y paid anclados al outcome de ${industry}. Menos CPC teatro; más leads accionables.`,
  branding: (industry) =>
    `Marca y mensaje para ${industry}: un solo lenguaje entre ads, web y el pitch de ventas.`,
  'crm-automatizacion': (industry) =>
    `CRM y automatización para el ciclo de ${industry}. Señal limpia hacia el equipo comercial.`,
  'community-manager': (industry) =>
    `Community con protocolo de ${industry}: responde, nutre y protege la marca en canal.`,
  'ia-marketing': (industry) =>
    `IA aplicada al marketing de ${industry} — velocidad con oficio senior que valida cada claim.`,
  'desarrollo-web': (industry) =>
    `Web y producto digital pensados para el comprador de ${industry}: claros, rápidos, medibles.`,
};

const SERVICE_SLUGS = Object.keys(FALLBACK) as ServiceSlug[];

function isServiceSlug(value: string): value is ServiceSlug {
  return SERVICE_SLUGS.includes(value as ServiceSlug);
}

function isIndustryId(value: string): value is IndustryId {
  return value in COPY;
}

export function industryServiceDescription(
  industryId: string,
  serviceSlug: string,
  industryName: string,
): string {
  if (isIndustryId(industryId) && isServiceSlug(serviceSlug)) {
    return COPY[industryId][serviceSlug];
  }
  if (isServiceSlug(serviceSlug)) {
    return FALLBACK[serviceSlug](industryName.toLowerCase());
  }
  return `Cómo Hiweb adapta este servicio al contexto de ${industryName}.`;
}
