export type ServicePlan = {
  name: string;
  price: string;
  period?: string;
  featured?: boolean;
  includes: string[];
};

export type ServicePlans = {
  eyebrow: string;
  title: string;
  description: string;
  note: string;
  noteHref?: string;
  noteLabel?: string;
  ctaLabel: string;
  ctaHref: string;
  plans: ServicePlan[];
};

export const SERVICE_PLANS: Record<string, ServicePlans> = {
  seo: {
    eyebrow: 'Planes',
    title: 'Planes y precios de posicionamiento SEO en México',
    description:
      'Nuestros planes de posicionamiento SEO inician desde $8,000 MXN/mes. Como agencia SEO en México, ofrecemos el servicio de forma remota para empresas en Mérida, todo México, Estados Unidos y Canadá.',
    note: 'Se puede combinar con nuestro servicio de diseño y desarrollo web para una base técnica sólida desde el inicio.',
    noteHref: '/servicios/desarrollo-web',
    noteLabel: 'servicio de diseño y desarrollo web',
    ctaLabel: 'Cotiza ahora con nosotros',
    ctaHref: '/contacto',
    plans: [
      {
        name: 'Local',
        price: '$8,000',
        period: '/mes',
        includes: [
          'Auditoría inicial',
          'Optimización técnica',
          'Estrategia de contenido',
          'Reporte mensual de posiciones en Google',
          'Google Maps y búsquedas de tu ciudad',
        ],
      },
      {
        name: 'Nacional',
        price: 'A cotizar',
        featured: true,
        includes: [
          'Auditoría inicial',
          'Optimización técnica',
          'Estrategia de contenido',
          'Reporte mensual de posiciones en Google',
          'Alcance en todo México',
        ],
      },
      {
        name: 'Internacional',
        price: 'A cotizar',
        includes: [
          'Auditoría inicial',
          'Optimización técnica',
          'Estrategia de contenido',
          'Reporte mensual de posiciones en Google',
          'Varios países',
        ],
      },
    ],
  },
};

export function servicePlans(slug: string): ServicePlans | undefined {
  return SERVICE_PLANS[slug];
}
