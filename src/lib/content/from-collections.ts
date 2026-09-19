import { getCollection } from 'astro:content';
import { industryServiceDescription } from '../../data/industryServices';
import {
  HOME_FAQ_CATEGORIES,
  PROCESS_PHASES,
  SITE,
  TEAM_MEMBERS,
} from '../../data/site';
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
    .map((entry) => ({
      id: entry.id,
      data: {
        ...entry.data,
        cards: [...entry.data.cards],
        seo: {
          metaTitle: `${entry.data.nombre} — Hiweb Marketing`,
          metaDescription: entry.data.tagline,
        },
      },
    }))
    .sort((a, b) => a.data.orden - b.data.orden);
}

export async function collectionsCases(): Promise<CaseRecord[]> {
  const entries = await getCollection('casos');
  const services = await getCollection('servicios');
  const serviceName = Object.fromEntries(services.map((item) => [item.id, item.data.nombre]));
  const serviceImage = Object.fromEntries(
    services.map((item) => [item.id, item.data.heroImage]),
  );

  return entries.map((entry) => ({
    id: entry.id,
    data: {
      ...entry.data,
      industria: { id: entry.data.industria.id },
      servicios: entry.data.servicios.map((ref) => ({
        id: ref.id,
        nombre: serviceName[ref.id],
        heroImage: serviceImage[ref.id],
      })),
      seo: {
        metaTitle: `${entry.data.cliente} — ${entry.data.resultadoFrase}`,
        metaDescription: entry.data.resumen,
      },
    },
  }));
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
  return {
    heroTitle: 'Experiencias digitales que sí mueven pipeline.',
    heroLead:
      'Estrategia, diseño y media como un solo sistema. Menos improvisación; más señal, oferta clara y web que cierra.',
    primaryCta: { label: 'Agenda tu auditoría gratuita', href: '/contacto' },
    secondaryCta: { label: 'Ver Casos de Éxito', href: '/portafolio' },
    process: PROCESS_PHASES.map((phase) => ({ ...phase })),
    faqCategories: HOME_FAQ_CATEGORIES.map((category) => ({
      id: category.id,
      label: category.label,
      items: category.items.map((item) => ({ ...item })),
    })),
    seo: {
      metaTitle: 'Hiweb Marketing — Partner estratégico',
      metaDescription: SITE.tagline,
    },
  };
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
