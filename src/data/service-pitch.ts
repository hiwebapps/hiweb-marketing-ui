export type ServicePitch = {
  badge: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  ctaLabel: string;
  ctaHref: string;
};

const cta = {
  ctaLabel: 'Agenda un diagnóstico',
  ctaHref: '/contacto',
} as const;

export const SERVICE_PITCH: Record<string, ServicePitch> = {
  seo: {
    badge: 'SEO',
    title: 'Aparece cuando ya te están buscando',
    description:
      'Posicionamiento orgánico con datos: técnica, intención y páginas que pueden convertir. El tráfico deja de depender solo de la pauta.',
    image: '/images/services/seo.jpg',
    imageAlt: 'Medición de visibilidad orgánica',
    ...cta,
  },
  'google-ads': {
    badge: 'Google Ads',
    title: 'El clic que sí puede ser un cliente',
    description:
      'Campañas de búsqueda, Shopping y Performance Max con medición de verdad. El presupuesto se queda en la consulta, no en el clic barato.',
    image: '/images/services/google-ads.jpg',
    imageAlt: 'Gestión de campañas en Google Ads',
    ...cta,
  },
  'meta-ads': {
    badge: 'Meta Ads',
    title: 'Demanda fuera del buscador',
    description:
      'Leads, catálogo y remarketing en Facebook e Instagram. Cada anuncio persigue una acción, no alcance vacío.',
    image: '/images/services/meta-ads.jpg',
    imageAlt: 'Campañas de Meta Ads',
    ...cta,
  },
  'redes-sociales': {
    badge: 'Redes sociales',
    title: 'Contenido con un trabajo, no con relleno',
    description:
      'Estrategia, producción y lectura de lo que sí mueve la conversación. Publicar todos los días no es el plan.',
    image: '/images/services/redes-sociales.jpg',
    imageAlt: 'Producción de contenido para redes',
    ...cta,
  },
  'desarrollo-web': {
    badge: 'Desarrollo web',
    title: 'Un sitio que se puede usar y convertir',
    description:
      'Arquitectura, diseño y desarrollo para que la página cargue, se entienda en el teléfono y cierre la acción que importa.',
    image: '/images/services/desarrollo-web.jpg',
    imageAlt: 'Diseño y desarrollo de un sitio web',
    ...cta,
  },
  'crm-automatizacion': {
    badge: 'CRM',
    title: 'El lead no se queda en la bandeja',
    description:
      'Pipelines y flujos que avisan, asignan y dan el siguiente paso. El equipo ve la cola, no una lista que nadie abre.',
    image: '/images/services/crm-automatizacion.jpg',
    imageAlt: 'Automatización del seguimiento comercial',
    ...cta,
  },
  branding: {
    badge: 'Branding',
    title: 'Una marca que el equipo puede repetir',
    description:
      'Investigación, identidad y un sistema visual que se usa en web, redes y el material que ya imprimes.',
    image: '/images/services/branding.jpg',
    imageAlt: 'Sistema de identidad de marca',
    ...cta,
  },
  'ia-marketing': {
    badge: 'IA',
    title: 'Automatiza el tramo repetido',
    description:
      'Chatbots y flujos que califican y pasan el lead cuando ya hay intención. Si no saben la respuesta, escalan a una persona.',
    image: '/images/services/ia-marketing.jpg',
    imageAlt: 'Flujos de marketing con inteligencia artificial',
    ...cta,
  },
  'community-manager': {
    badge: 'Community',
    title: 'La comunidad también es el canal',
    description:
      'Respuesta, voz de marca y un reporte de lo que la gente pidió. El mes se lee en conversaciones, no en likes.',
    image: '/images/services/community-manager.jpg',
    imageAlt: 'Gestión de comunidad y mensajes',
    ...cta,
  },
};

export function servicePitch(slug: string): ServicePitch | undefined {
  return SERVICE_PITCH[slug];
}
