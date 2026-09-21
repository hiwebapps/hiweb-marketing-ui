import { getCollection } from 'astro:content';
import { industryServiceDescription } from '../../data/industryServices';
import { SITE, TEAM_MEMBERS } from '../../data/site';
import { WEBFLOW_HOME, WEBFLOW_SERVICE_TAGLINES } from '../../data/webflow-home';
import { WEBFLOW_SERVICES } from '../../data/webflow-services';
import { WEBFLOW_CASES } from '../../data/webflow-cases';
import type {
  AboutCopy,
  CaseRecord,
  HomeCopy,
  IndustryRecord,
  PersonRecord,
  PostRecord,
  ServiceRecord,
} from './types';

export async function collectionsIndustries(): Promise<IndustryRecord[]> {
  const entries = await getCollection('industrias');
  const services = await getCollection('servicios');
  return entries
    .map((entry) => ({
      id: entry.id,
      data: {
        ...entry.data,
        serviceBlurbs: services.map((service) => ({
          serviceSlug: service.id,
          description: industryServiceDescription(entry.id, service.id, entry.data.nombre),
        })),
        seo: {
          metaTitle: `${entry.data.nombre} — Hiweb Marketing`,
          metaDescription: entry.data.heroDescription,
        },
      },
    }))
    .sort((a, b) => a.data.orden - b.data.orden);
}

export async function collectionsServices(): Promise<ServiceRecord[]> {
  const entries = await getCollection('servicios');
  return entries
    .map((entry) => {
      const webflow = WEBFLOW_SERVICES[entry.id];
      return {
        id: entry.id,
        data: {
          ...entry.data,
          ...(webflow
            ? {
                nombre: webflow.nombre,
                orden: webflow.orden,
                tagline: webflow.tagline,
                heroTitle: webflow.heroTitle,
                heroDescription: webflow.heroDescription,
                heroBadge: webflow.heroBadge,
                cards: webflow.cards.map((item) => ({ ...item })),
                proceso: webflow.proceso.map((item) => ({ ...item })),
                faqs: webflow.faqs.map((item) => ({ ...item })),
                seo: {
                  metaTitle: webflow.seo.metaTitle,
                  metaDescription: webflow.seo.metaDescription,
                },
              }
            : {
                tagline: WEBFLOW_SERVICE_TAGLINES[entry.id] ?? entry.data.tagline,
              }),
        },
      };
    })
    .sort((a, b) => a.data.orden - b.data.orden);
}

export async function collectionsCases(): Promise<CaseRecord[]> {
  const entries = await getCollection('casos');
  const services = await getCollection('servicios');
  const serviceName = Object.fromEntries(services.map((item) => [item.id, item.data.nombre]));
  const serviceImage = Object.fromEntries(
    services.map((item) => [item.id, item.data.heroImage]),
  );

  return entries.map((entry) => {
    const webflow = WEBFLOW_CASES[entry.id];
    return {
      id: entry.id,
      data: {
        ...entry.data,
        ...(webflow
          ? {
              cliente: webflow.cliente,
              industria: { id: webflow.industria.id },
              resultadoFrase: webflow.resultadoFrase,
              titulo: webflow.titulo,
              resumen: webflow.resumen,
              destacado: webflow.destacado,
              accent: webflow.accent,
              metricas: webflow.metricas.map((item) => ({ ...item })),
              reto: webflow.reto,
              estrategia: webflow.estrategia,
              fases: webflow.fases.map((item) => ({ ...item })),
              testimonio: webflow.testimonio ? { ...webflow.testimonio } : undefined,
              seo: {
                metaTitle: webflow.seo?.metaTitle,
                metaDescription: webflow.seo?.metaDescription,
                ogImage: webflow.cover,
              },
            }
          : {
              industria: { id: entry.data.industria?.id ?? '' },
              seo: {
                metaTitle: `${entry.data.cliente} — ${entry.data.resultadoFrase}`,
                metaDescription: entry.data.resumen,
              },
            }),
        servicios: (webflow?.servicios ?? entry.data.servicios).map((ref) => ({
          id: ref.id,
          nombre: serviceName[ref.id],
          heroImage: serviceImage[ref.id],
        })),
      },
    };
  });
}

export async function collectionsPosts(): Promise<PostRecord[]> {
  const entries = await getCollection('posts');
  return entries
    .map((entry) => ({
      id: entry.id,
      data: {
        ...entry.data,
        categoriaServicio: entry.data.categoriaServicio
          ? { id: entry.data.categoriaServicio.id }
          : undefined,
        categoriaIndustria: entry.data.categoriaIndustria
          ? { id: entry.data.categoriaIndustria.id }
          : undefined,
        seo: {
          metaTitle: `${entry.data.title} — Hiweb`,
          metaDescription: entry.data.description,
        },
      },
      markdownBody: entry.body,
    }))
    .sort((a, b) => b.data.fecha.valueOf() - a.data.fecha.valueOf());
}

export function collectionsPeople(): PersonRecord[] {
  return TEAM_MEMBERS.map((member) => ({
    name: member.name,
    role: member.role,
    bio: member.bio,
    photo: member.photo,
    category: member.category,
    accent: member.accent,
    socials: { ...member.socials },
  }));
}

export function collectionsHome(): HomeCopy {
  return structuredClone(WEBFLOW_HOME);
}

export function collectionsAbout(): AboutCopy {
  return {
    heroTitle: 'Expertise colectivo, tecnología propia, capacidad cross-border.',
    heroDescription: SITE.tagline,
    heroImage: '/images/team/hiweb-team.png',
    heroImageAlt: 'Equipo Hiweb con playeras de la marca',
    historyEyebrow: 'Historia',
    historyTitle: 'De agencia de tácticas a arquitectura por industria',
    historyDescription:
      'Hiweb nace de operar cuentas consolidadas donde el catálogo de servicios no bastaba. El comprador no busca “SEO”: busca un resultado en su sector. Reorganizamos oferta, prueba y equipo alrededor de eso.',
    seo: {
      metaTitle: 'Nosotros — Hiweb Marketing',
      metaDescription: SITE.tagline,
    },
  };
}
