import type { LpNav, LpPage, LpPicker, LpSection, LpServiceCard } from '../../lib/content/lp-types';
import { PILLAR_ICON_NAMES } from '../../components/icons/PillarIcons';
import { LP_PICKER_ICONS } from './picker-icons';
import {
  LP_BENEFITS,
  LP_COMBOS,
  LP_FAQ,
  LP_HERO_MARKS,
  LP_INDUSTRIES,
  LP_LOGOS,
  LP_METRICS,
  LP_PROCESS,
  LP_QUADRANTS,
  LP_SERVICES,
  LP_TEAM,
  LP_WHATSAPP,
  lpFaq,
  lpRoiIndustries,
  lpServiceLink,
} from './catalog';
import {
  LP_CALENDAR_DEFAULTS,
  LP_CASES_DEFAULTS,
  LP_FORM_DEFAULTS,
  LP_NAV_DEFAULTS,
  LP_ROI_INVESTMENT,
  LP_ROI_LABELS,
  LP_SYSTEM_CTA_DEFAULTS,
} from './defaults';

const NAV_CTA = 'Agenda tu diagnóstico';

const QUADRANT_ICONS: Record<string, string> = {
  'Atraer demanda': 'target',
  'Ser la respuesta': 'search',
  'Construir marca': 'brush',
  'Convertir y escalar': 'box',
};

function nav(): LpNav {
  return { ...LP_NAV_DEFAULTS, whatsappHref: LP_WHATSAPP };
}

function serviceCard(slug: string): LpServiceCard | null {
  const link = lpServiceLink(slug);
  const full = LP_SERVICES.find((item) => item.slug === slug);
  if (!link) return null;
  return { ...link, title: full?.h1 || link.name, icon: LP_PICKER_ICONS[slug] };
}

function servicePicker(autoOpen: boolean): LpPicker {
  return {
    autoOpen,
    title: '¿Qué servicio estás buscando?',
    subtitle: 'Elige uno y te mostramos cómo lo trabajamos.',
    allLabel: 'Ver todos los servicios',
    allHref: '/ads/servicios',
    options: LP_SERVICES.map((item) => ({
      slug: item.slug,
      title: item.name,
      description: item.short,
      href: `/ads/servicios/${item.slug}`,
      icon: LP_PICKER_ICONS[item.slug],
    })),
  };
}

function industryPicker(autoOpen: boolean): LpPicker {
  return {
    autoOpen,
    title: '¿En qué industria está tu empresa?',
    subtitle: 'Elige una y te mostramos cómo compra tu cliente.',
    allLabel: 'Ver todas las industrias',
    allHref: '/ads/industrias',
    options: LP_INDUSTRIES.map((item) => ({
      slug: item.slug,
      title: item.name,
      description: item.line,
      href: `/ads/industrias/${item.slug}`,
      icon: LP_PICKER_ICONS[item.slug],
    })),
  };
}

function logos(): LpSection {
  return { _type: 'logoMarquee', label: 'Marcas que trabajan con nosotros', logos: LP_LOGOS };
}

function roi(preset?: string): LpSection {
  return {
    _type: 'roiCalculator',
    eyebrow: 'Calculadora de ROI',
    title: '¿Cuánto podría rendir tu inversión en marketing?',
    description: 'Elige tu industria, ajusta tu inversión y ve una proyección con referencias del sector.',
    ctaLabel: 'Revisa estos números con un especialista',
    preset,
    investment: LP_ROI_INVESTMENT,
    ...LP_ROI_LABELS,
    industries: lpRoiIndustries().map((item) => ({ ...item, icon: LP_PICKER_ICONS[item.slug] })),
  };
}

function pillars(): LpSection {
  return {
    _type: 'pillarGrid',
    eyebrow: 'Por qué Hiweb',
    title: 'La eficiencia de un equipo interno. El alcance de una agencia grande.',
    pillars: LP_BENEFITS.map((item, index) => ({ ...item, icon: PILLAR_ICON_NAMES[index % PILLAR_ICON_NAMES.length] })),
  };
}

function portal(): LpSection {
  return {
    _type: 'lpPortal',
    eyebrow: 'Cómo operamos',
    title: 'Tecnología propia y un proceso que no se pierde.',
    description: 'Tu proyecto vive en un portal, no en cadenas de correos. Así todo queda en orden y a la vista.',
    primaryLabel: 'Ver el portal',
    primaryHref: '/portal',
    secondaryLabel: 'Agenda tu diagnóstico',
    secondaryHref: '#contacto',
  };
}

function tail(faq = LP_FAQ): LpSection[] {
  return [
    {
      _type: 'metricsBand',
      eyebrow: 'Hiweb en números',
      title: 'Experiencia que ya se nota en otras marcas.',
      description: 'Desde 2020 medimos cada estrategia en contactos y ventas.',
      metrics: LP_METRICS,
    },
    {
      _type: 'casePreview',
      eyebrow: 'Casos de éxito',
      title: 'Resultados que se ven.',
      description: 'Datos reales de las plataformas de nuestros clientes.',
      caseSlugs: [],
      ...LP_CASES_DEFAULTS,
    },
    {
      _type: 'processPhases',
      eyebrow: 'Cómo trabajamos',
      title: 'Un proceso claro, de principio a fin.',
      phases: LP_PROCESS,
    },
    {
      _type: 'teamGrid',
      eyebrow: 'Nosotros',
      title: 'Las personas detrás de tus resultados.',
      description: 'Un equipo multidisciplinario que piensa en tu negocio antes que en el formato.',
      layout: 'slider',
      ctaLabel: 'Conoce a todo el equipo',
      ctaHref: '/nosotros',
      members: LP_TEAM,
    },
    {
      _type: 'faqSection',
      eyebrow: 'Preguntas frecuentes',
      title: 'Respuestas claras antes de empezar.',
      items: faq,
    },
    {
      _type: 'finalCta',
      badge: 'Siguiente paso',
      title: 'Hablemos de lo que tu negocio necesita.',
      description: 'Te decimos qué funcionaría, qué no y por dónde empezar.',
      primaryLabel: NAV_CTA,
      primaryOpensCalendar: true,
      secondaryLabel: 'Escríbenos por WhatsApp',
      secondaryHref: LP_WHATSAPP,
      anchorId: 'cierre',
    },
  ];
}

function system(withCombos: boolean): LpSection {
  return {
    _type: 'serviceSystem',
    eyebrow: 'Servicios',
    title: 'Todo tu marketing, en un mismo plan.',
    description: 'Doce servicios y un solo equipo trabajando hacia el mismo objetivo. Elige uno o conéctalos.',
    quadrants: LP_QUADRANTS.map((item) => ({
      title: item.title,
      icon: QUADRANT_ICONS[item.title],
      services: item.slugs.flatMap((slug) => {
        const card = serviceCard(slug);
        return card ? [card] : [];
      }),
    })),
    ...LP_SYSTEM_CTA_DEFAULTS,
    combosTitle: withCombos ? 'Empieza por tu objetivo. Nosotros armamos la combinación.' : undefined,
    combos: withCombos ? LP_COMBOS : undefined,
  };
}

function industries(): LpSection {
  return {
    _type: 'industryGrid',
    eyebrow: 'Industrias',
    title: 'Entendemos cómo compra tu cliente.',
    description: 'Cada sector decide distinto. Por eso no usamos la misma fórmula para todos.',
    ctaLabel: 'Ver el sector',
    hrefPrefix: '/ads/industrias',
    industries: LP_INDUSTRIES.map((item) => ({
      slug: item.slug,
      nombre: item.name,
      tagline: item.line,
      icon: LP_PICKER_ICONS[item.slug],
    })),
  };
}

function hero(input: { title: string; description: string; landingName: string; interests?: string[] }): LpSection {
  return {
    _type: 'lpHero',
    title: input.title,
    description: input.description,
    trust: '+20 marcas en México y el extranjero confían en Hiweb.',
    avatars: LP_HERO_MARKS,
    primaryLabel: NAV_CTA,
    secondaryLabel: 'Escríbenos por WhatsApp',
    whatsappHref: LP_WHATSAPP,
    landingName: input.landingName,
    interests: input.interests ?? [],
    ...LP_FORM_DEFAULTS,
  };
}

export function localLpPages(): LpPage[] {
  const pages: LpPage[] = [
    {
      id: 'lp-agencia',
      template: 'general',
      role: 'hub',
      slug: 'agencia',
      path: '/ads/agencia',
      title: 'Agencia de marketing digital en México — Hiweb',
      description: 'Combinamos SEO, campañas, contenido y tecnología en un plan claro para hacer crecer tu empresa.',
      nav: nav(),
      calendar: LP_CALENDAR_DEFAULTS,
      sections: [
        hero({
          title: 'Marketing con estrategia. Resultados que se ven.',
          description: 'Combinamos SEO, campañas, contenido y tecnología en un plan claro para hacer crecer tu empresa.',
          landingName: 'Landing general',
        }),
        logos(),
        roi(),
        {
          _type: 'statement',
          eyebrow: 'Nuestro enfoque',
          title: 'Más canales no siempre significan más clientes.',
          paragraphs: [
            'Muchas empresas tienen un proveedor para SEO, otro para anuncios y otro para redes. Cada uno mide algo distinto y nadie ve el negocio completo.',
            'En Hiweb unimos estrategia, pauta y tecnología alrededor de un mismo objetivo: que tu empresa venda más.',
          ],
        },
        system(false),
        industries(),
        pillars(),
        portal(),
        ...tail(),
      ],
    },
    {
      id: 'lp-servicios',
      template: 'servicios',
      role: 'hub',
      slug: 'servicios',
      path: '/ads/servicios',
      title: 'Servicios de marketing digital — Hiweb',
      description: 'Doce servicios, un solo equipo y una estrategia que los hace trabajar juntos.',
      nav: nav(),
      calendar: LP_CALENDAR_DEFAULTS,
      picker: servicePicker(true),
      sections: [
        hero({
          title: 'Todo tu marketing, conectado a un mismo objetivo.',
          description: 'Doce servicios, un solo equipo y una estrategia que los hace trabajar juntos.',
          landingName: 'Landing servicios',
        }),
        logos(),
        roi(),
        system(true),
        pillars(),
        portal(),
        ...tail(),
      ],
    },
    {
      id: 'lp-industrias',
      template: 'industrias',
      role: 'hub',
      slug: 'industrias',
      path: '/ads/industrias',
      title: 'Marketing digital por industria — Hiweb',
      description: 'Diseñamos la estrategia según cómo decide tu cliente, cuánto tarda en comprar y dónde busca.',
      nav: nav(),
      calendar: LP_CALENDAR_DEFAULTS,
      picker: industryPicker(true),
      sections: [
        hero({
          title: 'Cada industria compra distinto. Tu marketing también debería.',
          description: 'Diseñamos la estrategia según cómo decide tu cliente, cuánto tarda en comprar y dónde busca.',
          landingName: 'Landing industrias',
        }),
        logos(),
        roi(),
        industries(),
        system(false),
        pillars(),
        portal(),
        ...tail(),
      ],
    },
  ];

  for (const service of LP_SERVICES) {
    const related = service.pairs.flatMap((slug) => {
      const link = lpServiceLink(slug);
      return link ? [link] : [];
    });
    pages.push({
      id: `lp-servicio-${service.slug}`,
      template: 'servicios',
      role: 'detail',
      slug: service.slug,
      path: `/ads/servicios/${service.slug}`,
      title: `${service.name} | Hiweb`,
      description: service.text,
      nav: nav(),
      calendar: LP_CALENDAR_DEFAULTS,
      picker: servicePicker(false),
      sections: [
        hero({
          title: service.h1,
          description: service.text,
          landingName: `Servicio: ${service.name}`,
          interests: [service.slug],
        }),
        logos(),
        roi(),
        {
          _type: 'lpServiceFocus',
          eyebrow: 'Cómo lo trabajamos',
          title: `${service.name}, de principio a fin.`,
          description: service.short,
          steps: service.how,
          relatedTitle: 'Este servicio rinde más cuando no trabaja solo.',
          relatedDescription: 'Estos son los servicios que nuestros clientes suelen sumar.',
          related,
          foot: 'Con varios servicios tienes un solo estratega, un solo reporte y una sola meta.',
          bundleLabel: 'Cotízalos juntos',
          bundle: [service.slug, ...service.pairs],
        },
        pillars(),
        portal(),
        ...tail(lpFaq(service.faq)),
      ],
    });
  }

  for (const industry of LP_INDUSTRIES) {
    const related = industry.combo.flatMap((slug) => {
      const link = lpServiceLink(slug);
      return link ? [link] : [];
    });
    pages.push({
      id: `lp-industria-${industry.slug}`,
      template: 'industrias',
      role: 'detail',
      slug: industry.slug,
      path: `/ads/industrias/${industry.slug}`,
      title: `Marketing para ${industry.name.toLowerCase()} | Hiweb`,
      description: industry.text,
      nav: nav(),
      calendar: LP_CALENDAR_DEFAULTS,
      picker: industryPicker(false),
      sections: [
        hero({
          title: industry.h1,
          description: industry.text,
          landingName: `Industria: ${industry.name}`,
          interests: industry.combo,
        }),
        logos(),
        roi(industry.slug),
        {
          _type: 'lpServiceFocus',
          eyebrow: 'Retos de tu industria',
          title: 'Conocemos cómo compra tu cliente.',
          description: `${industry.line} Estos son los retos que más vemos en el sector.`,
          challenges: industry.retos.map(([title, description]) => ({ title, description })),
          stepsTitle: 'Cómo lo trabajamos',
          steps: industry.how,
          relatedTitle: 'La combinación que mejor funciona en tu industria.',
          relatedDescription: 'Cada servicio cubre una etapa distinta de la decisión de tu cliente.',
          related,
          kpisLabel: 'Lo que medimos:',
          kpis: industry.kpis,
          foot: 'Una sola estrategia para toda la combinación, con un mismo equipo.',
          bundleLabel: 'Cotiza la combinación completa',
          bundle: industry.combo,
        },
        pillars(),
        portal(),
        ...tail(lpFaq(industry.faq)),
      ],
    });
  }

  return pages;
}

export function localLpPage(path: string): LpPage | null {
  return localLpPages().find((page) => page.path === path) ?? null;
}
