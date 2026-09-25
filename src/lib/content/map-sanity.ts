import { urlForWidth } from '../../sanity/image';
import type {
  AboutCopy,
  CaseRecord,
  CmsImage,
  FaqItem,
  HomeCopy,
  IndustryRecord,
  LandingCta,
  LandingPage,
  LandingSection,
  PersonRecord,
  PostRecord,
  ProcessPhase,
  SeoFields,
  ServiceRecord,
  ServiceSection,
  TitledBlock,
} from './types';

function seoOf(doc: {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: CmsImage | null;
}): SeoFields | undefined {
  const ogImage = urlForWidth(doc.ogImage, 1200);
  if (!doc.metaTitle && !doc.metaDescription && !ogImage) return undefined;
  return {
    metaTitle: doc.metaTitle ?? undefined,
    metaDescription: doc.metaDescription ?? undefined,
    ogImage,
  };
}

function imageUrl(image: CmsImage | null | undefined, width = 1600) {
  return urlForWidth(image, width);
}

function imageAlt(image: CmsImage | null | undefined, fallback?: string) {
  if (image && typeof image === 'object' && 'alt' in image && typeof image.alt === 'string') {
    return image.alt;
  }
  return fallback;
}

export function mapIndustry(doc: Record<string, unknown>): IndustryRecord {
  const image = doc.heroImage as CmsImage | undefined;
  return {
    id: String(doc.id),
    data: {
      nombre: String(doc.nombre ?? ''),
      orden: Number(doc.orden ?? 0),
      tagline: String(doc.tagline ?? ''),
      heroTitle: String(doc.heroTitle ?? ''),
      heroDescription: String(doc.heroDescription ?? ''),
      heroImage: imageUrl(image) ?? undefined,
      heroImageAlt: imageAlt(image),
      heroBadge: doc.heroBadge ? String(doc.heroBadge) : undefined,
      retos: Array.isArray(doc.retos) ? doc.retos.map(String) : [],
      porQue: Array.isArray(doc.porQue) ? (doc.porQue as IndustryRecord['data']['porQue']) : [],
      faqs: Array.isArray(doc.faqs) ? (doc.faqs as IndustryRecord['data']['faqs']) : [],
      serviceBlurbs: Array.isArray(doc.serviceBlurbs)
        ? (doc.serviceBlurbs as IndustryRecord['data']['serviceBlurbs']).filter(
            (item) => item.serviceSlug,
          )
        : [],
      seo: seoOf(doc),
    },
  };
}

function mapServicePlans(doc: Record<string, unknown>): ServiceRecord['data']['planes'] {
  const raw = Array.isArray(doc.planes) ? doc.planes : [];
  const plans = raw
    .map((item) => {
      const plan = item as { name?: string; price?: string; period?: string; featured?: boolean; includes?: string[] };
      const includes = Array.isArray(plan.includes) ? plan.includes.map(String).filter(Boolean) : [];
      if (!plan.name || !plan.price || !includes.length) return null;
      return {
        name: String(plan.name),
        price: String(plan.price),
        period: plan.period ? String(plan.period) : undefined,
        featured: Boolean(plan.featured),
        includes,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .slice(0, 3);

  if (!plans.length || !doc.planesTitle) return undefined;

  return {
    eyebrow: String(doc.planesEyebrow ?? 'Planes'),
    title: String(doc.planesTitle),
    description: String(doc.planesDescription ?? ''),
    note: String(doc.planesNote ?? ''),
    noteHref: doc.planesNoteHref ? String(doc.planesNoteHref) : undefined,
    noteLabel: doc.planesNoteLabel ? String(doc.planesNoteLabel) : undefined,
    ctaLabel: String(doc.planesCtaLabel ?? 'Cotiza ahora con nosotros'),
    ctaHref: String(doc.planesCtaHref ?? '/contacto'),
    plans,
  };
}

function mapServiceSections(doc: Record<string, unknown>): ServiceRecord['data']['sections'] {
  if (!Array.isArray(doc.sections)) return undefined;
  const sections = doc.sections
    .map((item) => {
      const section = item as Record<string, unknown>;
      const type = String(section._type ?? '');
      if (type === 'serviceHero') {
        const image = section.image as CmsImage | undefined;
        return {
          _type: 'serviceHero' as const,
          title: section.title ? String(section.title) : undefined,
          description: section.description ? String(section.description) : undefined,
          badge: section.badge ? String(section.badge) : undefined,
          image: imageUrl(image) ?? undefined,
          imageAlt: imageAlt(image),
          ctaLabel: section.ctaLabel ? String(section.ctaLabel) : undefined,
          ctaHref: section.ctaHref ? String(section.ctaHref) : undefined,
        };
      }
      if (type === 'servicePlans') {
        const plans = mapServicePlans({
          planesTitle: section.title,
          planesEyebrow: section.eyebrow,
          planesDescription: section.description,
          planesNote: section.note,
          planesNoteLabel: section.noteLabel,
          planesNoteHref: section.noteHref,
          planesCtaLabel: section.ctaLabel,
          planesCtaHref: section.ctaHref,
          planes: section.plans,
        });
        return {
          _type: 'servicePlans' as const,
          eyebrow: section.eyebrow ? String(section.eyebrow) : undefined,
          title: section.title ? String(section.title) : undefined,
          description: section.description ? String(section.description) : undefined,
          note: section.note ? String(section.note) : undefined,
          noteLabel: section.noteLabel ? String(section.noteLabel) : undefined,
          noteHref: section.noteHref ? String(section.noteHref) : undefined,
          ctaLabel: section.ctaLabel ? String(section.ctaLabel) : undefined,
          ctaHref: section.ctaHref ? String(section.ctaHref) : undefined,
          plans: plans?.plans,
        };
      }
      if (type === 'serviceOverview') {
        const list = Array.isArray(section.cards) ? (section.cards as TitledBlock[]) : [];
        return {
          _type: 'serviceOverview' as const,
          eyebrow: section.eyebrow ? String(section.eyebrow) : undefined,
          title: section.title ? String(section.title) : undefined,
          description: section.description ? String(section.description) : undefined,
          cards: list,
        };
      }
      if (type === 'serviceProcess') {
        const steps = Array.isArray(section.steps)
          ? (section.steps as { title?: string; description?: string; icon?: string; accent?: string }[])
              .filter((step) => step.title)
              .map((step) => ({
                title: String(step.title),
                description: String(step.description ?? ''),
                icon: step.icon ? String(step.icon) : undefined,
                accent: step.accent ? String(step.accent) : undefined,
              }))
          : [];
        return {
          _type: 'serviceProcess' as const,
          eyebrow: section.eyebrow ? String(section.eyebrow) : undefined,
          title: section.title ? String(section.title) : undefined,
          description: section.description ? String(section.description) : undefined,
          steps,
        };
      }
      if (type === 'serviceFocus') {
        const items = Array.isArray(section.items)
          ? (section.items as { title?: string; summary?: string; detailTitle?: string; detail?: string; icon?: string; image?: string; imageAlt?: string }[])
              .filter((item) => item.title && item.image)
              .map((item) => ({
                title: String(item.title),
                summary: String(item.summary ?? ''),
                detailTitle: String(item.detailTitle ?? item.title),
                detail: String(item.detail ?? ''),
                icon: String(item.icon ?? 'layers'),
                image: String(item.image),
                imageAlt: String(item.imageAlt ?? item.title),
              }))
          : [];
        return {
          _type: 'serviceFocus' as const,
          eyebrow: section.eyebrow ? String(section.eyebrow) : undefined,
          title: section.title ? String(section.title) : undefined,
          description: section.description ? String(section.description) : undefined,
          items,
        };
      }
      if (type === 'serviceWhy') {
        const cards = Array.isArray(section.cards)
          ? (section.cards as { title?: string; description?: string; icon?: string; accent?: string }[])
              .filter((card) => card.title)
              .map((card) => ({
                title: String(card.title),
                description: String(card.description ?? ''),
                icon: String(card.icon ?? 'spark'),
                accent: String(card.accent ?? 'purple'),
              }))
          : [];
        return {
          _type: 'serviceWhy' as const,
          title: section.title ? String(section.title) : undefined,
          description: section.description ? String(section.description) : undefined,
          ctaLabel: section.ctaLabel ? String(section.ctaLabel) : undefined,
          ctaHref: section.ctaHref ? String(section.ctaHref) : undefined,
          cards,
        };
      }
      if (type === 'serviceIndustries') {
        const items = Array.isArray(section.items)
          ? (section.items as { slug?: string; nombre?: string; taglineResolved?: string; tagline?: string; icon?: string; puntos?: string[] }[])
              .filter((item) => item.slug)
              .map((item) => ({
                slug: String(item.slug),
                nombre: String(item.nombre ?? item.slug),
                tagline: String(item.taglineResolved ?? item.tagline ?? ''),
                icon: item.icon ? String(item.icon) : undefined,
                puntos: Array.isArray(item.puntos) ? item.puntos.map(String) : [],
              }))
          : [];
        return {
          _type: 'serviceIndustries' as const,
          title: section.title ? String(section.title) : undefined,
          description: section.description ? String(section.description) : undefined,
          items,
        };
      }
      if (type === 'serviceCases') {
        const items = Array.isArray(section.items)
          ? (section.items as { id?: string; cliente?: string; resumen?: string; industria?: string; testimonio?: { quote?: string; name?: string; role?: string }; metricas?: { valor: number; label: string; prefix?: string; suffix?: string; decimals?: number }[] }[])
              .filter((item) => item?.id)
              .map((item) => ({
                id: String(item.id),
                cliente: String(item.cliente ?? ''),
                resumen: String(item.resumen ?? ''),
                industria: item.industria ? String(item.industria) : undefined,
                testimonio: item.testimonio,
                metricas: item.metricas,
              }))
          : [];
        return {
          _type: 'serviceCases' as const,
          eyebrow: section.eyebrow ? String(section.eyebrow) : undefined,
          title: section.title ? String(section.title) : undefined,
          description: section.description ? String(section.description) : undefined,
          items,
        };
      }
      if (type === 'serviceCta') {
        return {
          _type: 'serviceCta' as const,
          badge: section.badge ? String(section.badge) : undefined,
          title: section.title ? String(section.title) : undefined,
          description: section.description ? String(section.description) : undefined,
        };
      }
      if (type === 'serviceFaq') {
        return {
          _type: 'serviceFaq' as const,
          eyebrow: section.eyebrow ? String(section.eyebrow) : undefined,
          title: section.title ? String(section.title) : undefined,
          columns: section.columns === 1 ? 1 : 2,
          items: Array.isArray(section.items) ? (section.items as FaqItem[]) : [],
        };
      }
      if (type === 'servicePitch') {
        return section as ServiceSection;
      }
      return null;
    })
    .filter((item): item is ServiceSection => item !== null);

  return sections.length ? sections : undefined;
}

export function mapService(doc: Record<string, unknown>): ServiceRecord {
  const image = doc.heroImage as CmsImage | undefined;
  const sections = mapServiceSections(doc);
  const hero = sections?.find((section) => section._type === 'serviceHero');
  const overview = sections?.find((section) => section._type === 'serviceOverview');
  const process = sections?.find((section) => section._type === 'serviceProcess');
  const faq = sections?.find((section) => section._type === 'serviceFaq');
  const plansSection = sections?.find((section) => section._type === 'servicePlans');
  const cards = Array.isArray(doc.cards) ? (doc.cards as ServiceRecord['data']['cards']) : [];
  const proceso = Array.isArray(doc.proceso) ? (doc.proceso as ServiceRecord['data']['proceso']) : [];
  const faqs = Array.isArray(doc.faqs) ? (doc.faqs as ServiceRecord['data']['faqs']) : [];
  const planesFromSection =
    plansSection?._type === 'servicePlans' && plansSection.title && plansSection.plans?.length
      ? {
          eyebrow: plansSection.eyebrow || 'Planes',
          title: plansSection.title,
          description: plansSection.description || '',
          note: plansSection.note || '',
          noteHref: plansSection.noteHref,
          noteLabel: plansSection.noteLabel,
          ctaLabel: plansSection.ctaLabel || 'Cotiza ahora con nosotros',
          ctaHref: plansSection.ctaHref || '/contacto',
          plans: plansSection.plans,
        }
      : undefined;

  return {
    id: String(doc.id),
    data: {
      nombre: String(doc.nombre ?? ''),
      orden: Number(doc.orden ?? 0),
      tagline: String(doc.tagline ?? ''),
      heroTitle: String(doc.heroTitle || (hero?._type === 'serviceHero' ? hero.title : '') || ''),
      heroDescription:
        (doc.heroDescription ? String(doc.heroDescription) : undefined) ||
        (hero?._type === 'serviceHero' ? hero.description : undefined),
      heroImage: imageUrl(image) ?? (hero?._type === 'serviceHero' ? hero.image : undefined),
      heroImageAlt: imageAlt(image) || (hero?._type === 'serviceHero' ? hero.imageAlt : undefined),
      heroBadge:
        (doc.heroBadge ? String(doc.heroBadge) : undefined) ||
        (hero?._type === 'serviceHero' ? hero.badge : undefined),
      cards: cards.length ? cards : overview?._type === 'serviceOverview' ? overview.cards ?? [] : [],
      proceso: proceso.length ? proceso : process?._type === 'serviceProcess' ? process.steps ?? [] : [],
      faqs: faqs.length ? faqs : faq?._type === 'serviceFaq' ? faq.items ?? [] : [],
      sections,
      planes: mapServicePlans(doc) ?? planesFromSection,
      seo: seoOf(doc),
    },
  };
}

export function mapCase(doc: Record<string, unknown>): CaseRecord {
  const servicios = Array.isArray(doc.servicios)
    ? (doc.servicios as Array<{ id?: string; nombre?: string; heroImage?: CmsImage }>)
        .filter((item) => item?.id)
        .map((item) => ({
          id: String(item.id),
          nombre: item.nombre,
          heroImage: imageUrl(item.heroImage, 800),
        }))
    : [];

  const industria = doc.industria as { id?: string } | undefined;
  const accent = doc.accent === 'orange' || doc.accent === 'purple' ? doc.accent : 'cyan';

  return {
    id: String(doc.id),
    data: {
      cliente: String(doc.cliente ?? ''),
      industria: { id: String(industria?.id ?? '') },
      servicios,
      resultadoFrase: String(doc.resultadoFrase ?? ''),
      titulo: String(doc.titulo ?? ''),
      resumen: String(doc.resumen ?? ''),
      destacado: Boolean(doc.destacado),
      accent,
      metricas: Array.isArray(doc.metricas) ? (doc.metricas as CaseRecord['data']['metricas']) : [],
      reto: String(doc.reto ?? ''),
      estrategia: String(doc.estrategia ?? ''),
      fases: Array.isArray(doc.fases) ? (doc.fases as CaseRecord['data']['fases']) : [],
      testimonio: doc.testimonio as CaseRecord['data']['testimonio'],
      seo: seoOf(doc),
    },
  };
}

export function mapPost(doc: Record<string, unknown>): PostRecord {
  const cover = doc.cover as CmsImage | undefined;
  const fechaRaw = doc.fecha;
  const fecha =
    fechaRaw instanceof Date
      ? fechaRaw
      : new Date(typeof fechaRaw === 'string' ? fechaRaw : Date.now());

  const card = doc.authorCard as { name?: string; role?: string; company?: string; linkedin?: string } | null;
  const author =
    card?.name && (card.role || card.linkedin)
      ? {
          name: String(card.name),
          role: card.role ? String(card.role) : undefined,
          company: card.company ? String(card.company) : undefined,
          linkedin: card.linkedin ? String(card.linkedin) : undefined,
        }
      : undefined;

  return {
    id: String(doc.id),
    data: {
      title: String(doc.title ?? ''),
      description: String(doc.description ?? ''),
      keyword: String(doc.keyword ?? ''),
      autor: String(doc.authorName ?? doc.autor ?? author?.name ?? 'Hiweb'),
      author,
      fecha,
      featured: Boolean(doc.featured),
      categoriaServicio: (doc.categoriaServicio as { id?: string; nombre?: string } | undefined)?.id
        ? {
            id: String((doc.categoriaServicio as { id: string }).id),
            nombre: (doc.categoriaServicio as { nombre?: string }).nombre
              ? String((doc.categoriaServicio as { nombre: string }).nombre)
              : undefined,
          }
        : undefined,
      categoriaIndustria: (doc.categoriaIndustria as { id?: string } | undefined)?.id
        ? { id: String((doc.categoriaIndustria as { id: string }).id) }
        : undefined,
      faqs: Array.isArray(doc.faqs) ? (doc.faqs as PostRecord['data']['faqs']) : [],
      seo: seoOf(doc),
    },
    coverUrl: imageUrl(cover, 1200),
    portableText: Array.isArray(doc.body) ? doc.body : undefined,
  };
}

export function mapPerson(doc: Record<string, unknown>): PersonRecord {
  const photo = doc.photo as CmsImage | undefined;
  const category = doc.category === 'web' || doc.category === 'diseno' ? doc.category : 'redes';
  return {
    name: String(doc.name ?? ''),
    role: String(doc.role ?? ''),
    bio: String(doc.bio ?? ''),
    photo: imageUrl(photo, 800) ?? '/images/team/andres.png',
    category,
    accent: doc.accent ? String(doc.accent) : undefined,
    socials: (doc.socials as PersonRecord['socials']) ?? undefined,
  };
}

function asIntro(value: unknown): HomeCopy['pillarIntro'] {
  if (!value || typeof value !== 'object') return undefined;
  const item = value as Record<string, unknown>;
  return {
    eyebrow: item.eyebrow ? String(item.eyebrow) : undefined,
    title: item.title ? String(item.title) : undefined,
    titleMuted: item.titleMuted ? String(item.titleMuted) : undefined,
    description: item.description ? String(item.description) : undefined,
  };
}

function asProcess(value: unknown): HomeCopy['process'] {
  if (!Array.isArray(value)) return undefined;
  return (value as Array<{ index?: string; title: string; description: string }>).map((step, index) => ({
    index: step.index || String(index + 1).padStart(2, '0'),
    title: step.title,
    description: step.description,
  }));
}

function asHeroCases(value: unknown): HomeCopy['heroCases'] {
  if (!Array.isArray(value)) return undefined;
  return (value as Array<Record<string, unknown>>)
    .filter((item) => item?.id)
    .map((item) => ({
      id: String(item.id),
      cliente: String(item.cliente ?? ''),
      industriaId: item.industriaId ? String(item.industriaId) : undefined,
      image: urlForWidth(item.ogImage as CmsImage | undefined, 1200),
    }));
}

function asServiceCards(value: unknown): HomeCopy['serviceCards'] {
  if (!Array.isArray(value)) return undefined;
  return (value as Array<Record<string, unknown>>)
    .filter((item) => item?.id)
    .map((item) => ({
      id: String(item.id),
      nombre: String(item.nombre ?? ''),
      tagline: String(item.tagline ?? ''),
    }));
}

function asIndustryCards(value: unknown): HomeCopy['industryCards'] {
  if (!Array.isArray(value)) return undefined;
  return (value as Array<Record<string, unknown>>)
    .filter((item) => item?.id)
    .map((item) => ({
      id: String(item.id),
      nombre: String(item.nombre ?? ''),
      tagline: String(item.tagline ?? ''),
      puntos: Array.isArray(item.puntos) ? item.puntos.map((punto) => String(punto)) : [],
    }));
}

export function mapHome(doc: Record<string, unknown> | null): HomeCopy | null {
  if (!doc) return null;
  const copy: HomeCopy = { seo: seoOf(doc) };
  const sections = Array.isArray(doc.sections) ? (doc.sections as Array<Record<string, unknown>>) : [];

  for (const section of sections) {
    const type = String(section._type ?? '');
    if (type === 'homeHero') {
      copy.heroTitle = section.title ? String(section.title) : undefined;
      copy.heroLead = section.lead ? String(section.lead) : undefined;
      copy.primaryCta = section.primaryCta as HomeCopy['primaryCta'];
      copy.secondaryCta = section.secondaryCta as HomeCopy['secondaryCta'];
      copy.heroCases = asHeroCases(section.cases);
    } else if (type === 'homePillars') {
      copy.pillarIntro = asIntro(section.intro);
      copy.pillarCtaLabel = section.ctaLabel ? String(section.ctaLabel) : undefined;
      copy.pillars = Array.isArray(section.items) ? (section.items as HomeCopy['pillars']) : undefined;
    } else if (type === 'homeServices') {
      copy.serviceIntro = asIntro(section.intro);
      copy.serviceCards = asServiceCards(section.items);
    } else if (type === 'homeIndustries') {
      copy.industryIntro = asIntro(section.intro);
      copy.industryCards = asIndustryCards(section.items);
    } else if (type === 'homeStories') {
      copy.storiesIntro = asIntro(section.intro);
      copy.testimonials = Array.isArray(section.items)
        ? (section.items as HomeCopy['testimonials'])
        : undefined;
    } else if (type === 'homeProcess') {
      copy.processIntro = asIntro(section.intro);
      copy.process = asProcess(section.items);
    } else if (type === 'homeMetrics') {
      copy.metricsIntro = asIntro(section.intro);
      copy.metrics = Array.isArray(section.items) ? (section.items as HomeCopy['metrics']) : undefined;
    } else if (type === 'homeTeam') {
      copy.team = {
        eyebrow: section.eyebrow ? String(section.eyebrow) : undefined,
        title: section.title ? String(section.title) : undefined,
        description: section.description ? String(section.description) : undefined,
        ctaLabel: section.ctaLabel ? String(section.ctaLabel) : undefined,
        ctaHref: section.ctaHref ? String(section.ctaHref) : undefined,
      };
    } else if (type === 'homeFaq') {
      copy.faqIntro = asIntro(section.intro);
      copy.faqCategories = Array.isArray(section.categories)
        ? (section.categories as HomeCopy['faqCategories'])
        : undefined;
    } else if (type === 'homeCta') {
      copy.closing = {
        badge: section.badge ? String(section.badge) : undefined,
        title: section.title ? String(section.title) : undefined,
        description: section.description ? String(section.description) : undefined,
        primaryCta: section.primaryCta as HomeCopy['primaryCta'],
      };
    }
  }

  if (sections.length) copy.sectionOrder = sections.map((section) => String(section._type));
  return copy;
}

export function mapAbout(doc: Record<string, unknown> | null): AboutCopy | null {
  if (!doc) return null;
  const image = doc.heroImage as CmsImage | undefined;
  return {
    heroTitle: doc.heroTitle ? String(doc.heroTitle) : undefined,
    heroDescription: doc.heroDescription ? String(doc.heroDescription) : undefined,
    heroImage: imageUrl(image) ?? undefined,
    heroImageAlt: imageAlt(image),
    historyEyebrow: doc.historyEyebrow ? String(doc.historyEyebrow) : undefined,
    historyTitle: doc.historyTitle ? String(doc.historyTitle) : undefined,
    historyDescription: doc.historyDescription ? String(doc.historyDescription) : undefined,
    historyColumns: Array.isArray(doc.historyColumns)
      ? (doc.historyColumns as AboutCopy['historyColumns'])
      : undefined,
    seo: seoOf(doc),
  };
}

function asCta(value: unknown): LandingCta | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const cta = value as { label?: string; href?: string };
  if (!cta.label || !cta.href) return undefined;
  return { label: String(cta.label), href: String(cta.href) };
}

function asTone(value: unknown): 'canvas' | 'surface' {
  return value === 'surface' ? 'surface' : 'canvas';
}

function asSource(value: unknown): 'all' | 'refs' {
  return value === 'refs' ? 'refs' : 'all';
}

function mapLandingCases(value: unknown): CaseRecord[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === 'object' && (item as { id?: string }).id)
    .map((item) => mapCase(item as Record<string, unknown>));
}

export function mapLandingSection(doc: Record<string, unknown>): LandingSection | null {
  const type = String(doc._type ?? '');

  switch (type) {
    case 'pageHero': {
      const variant = doc.variant === 'photo' ? 'photo' : 'plain';
      const image = doc.image as CmsImage | undefined;
      const atmosphere =
        doc.atmosphere === 'mesh' || doc.atmosphere === 'wash' || doc.atmosphere === 'none'
          ? doc.atmosphere
          : 'spotlight';
      return {
        _type: 'pageHero',
        variant,
        eyebrow: doc.eyebrow ? String(doc.eyebrow) : undefined,
        title: String(doc.title ?? ''),
        description: doc.description ? String(doc.description) : undefined,
        image: imageUrl(image) ?? undefined,
        imageAlt: imageAlt(image),
        imagePosition: doc.imagePosition ? String(doc.imagePosition) : undefined,
        badges: Array.isArray(doc.badges)
          ? (doc.badges as Array<{ label?: string; variant?: string }>)
              .filter((badge) => badge.label)
              .map((badge) => ({ label: String(badge.label), variant: badge.variant }))
          : undefined,
        cta: asCta(doc.cta),
        atmosphere,
      };
    }
    case 'pillarGrid':
      return {
        _type: 'pillarGrid',
        eyebrow: doc.eyebrow ? String(doc.eyebrow) : undefined,
        title: doc.title ? String(doc.title) : undefined,
        description: doc.description ? String(doc.description) : undefined,
        tone: asTone(doc.tone),
        pillars: Array.isArray(doc.pillars)
          ? (doc.pillars as Array<{ title?: string; description?: string; icon?: string; accent?: string; href?: string }>)
              .filter((item) => item.title)
              .map((item) => ({
                title: String(item.title),
                description: String(item.description ?? ''),
                icon: item.icon,
                accent: item.accent,
                href: item.href,
              }))
          : [],
        ctaLabel: doc.ctaLabel ? String(doc.ctaLabel) : undefined,
      };
    case 'serviceGrid':
      return {
        _type: 'serviceGrid',
        variant: doc.variant === 'industry' ? 'industry' : 'catalog',
        source: asSource(doc.source),
        eyebrow: doc.eyebrow ? String(doc.eyebrow) : undefined,
        title: doc.title ? String(doc.title) : undefined,
        description: doc.description ? String(doc.description) : undefined,
        tone: asTone(doc.tone),
        industryName: doc.industryName ? String(doc.industryName) : undefined,
        services: Array.isArray(doc.services)
          ? (doc.services as Array<{ id?: string; nombre?: string; tagline?: string }>)
              .filter((item) => item.id)
              .map((item) => ({
                id: String(item.id),
                nombre: String(item.nombre ?? ''),
                tagline: String(item.tagline ?? ''),
              }))
          : [],
      };
    case 'industryGrid':
      return {
        _type: 'industryGrid',
        source: asSource(doc.source),
        eyebrow: doc.eyebrow ? String(doc.eyebrow) : undefined,
        title: doc.title ? String(doc.title) : undefined,
        description: doc.description ? String(doc.description) : undefined,
        tone: asTone(doc.tone),
        industries: Array.isArray(doc.industries)
          ? (doc.industries as Array<{ id?: string; nombre?: string; tagline?: string; porQue?: { title?: string }[] }>)
              .filter((item) => item.id)
              .map((item) => ({
                id: String(item.id),
                nombre: String(item.nombre ?? ''),
                tagline: String(item.tagline ?? ''),
                puntos: Array.isArray(item.porQue)
                  ? item.porQue.map((punto) => String(punto.title ?? '')).filter(Boolean)
                  : undefined,
              }))
          : [],
      };
    case 'processPhases': {
      const phases: ProcessPhase[] = Array.isArray(doc.phases)
        ? (doc.phases as Array<{ index?: string; title?: string; description?: string }>).map(
            (step, index) => ({
              index: step.index || String(index + 1).padStart(2, '0'),
              title: String(step.title ?? ''),
              description: String(step.description ?? ''),
            }),
          )
        : [];
      return {
        _type: 'processPhases',
        eyebrow: doc.eyebrow ? String(doc.eyebrow) : undefined,
        title: doc.title ? String(doc.title) : undefined,
        description: doc.description ? String(doc.description) : undefined,
        tone: asTone(doc.tone),
        phases,
      };
    }
    case 'caseStories':
      return {
        _type: 'caseStories',
        source: asSource(doc.source),
        eyebrow: doc.eyebrow ? String(doc.eyebrow) : undefined,
        title: doc.title ? String(doc.title) : undefined,
        description: doc.description ? String(doc.description) : undefined,
        cases: mapLandingCases(doc.cases),
      };
    case 'casePreview':
      return {
        _type: 'casePreview',
        source: asSource(doc.source),
        eyebrow: doc.eyebrow ? String(doc.eyebrow) : undefined,
        title: doc.title ? String(doc.title) : undefined,
        description: doc.description ? String(doc.description) : undefined,
        tone: asTone(doc.tone),
        cases: mapLandingCases(doc.cases),
      };
    case 'faqSection': {
      const inline = Array.isArray(doc.items) ? (doc.items as FaqItem[]) : [];
      const fromLibrary = Array.isArray(doc.faqFromLibrary) ? (doc.faqFromLibrary as FaqItem[]) : [];
      return {
        _type: 'faqSection',
        eyebrow: doc.eyebrow ? String(doc.eyebrow) : undefined,
        title: doc.title ? String(doc.title) : undefined,
        description: doc.description ? String(doc.description) : undefined,
        tone: asTone(doc.tone),
        items: [...fromLibrary, ...inline].filter((item) => item?.question && item?.answer),
      };
    }
    case 'finalCta':
      return {
        _type: 'finalCta',
        badge: doc.badge ? String(doc.badge) : undefined,
        title: doc.title ? String(doc.title) : undefined,
        description: doc.description ? String(doc.description) : undefined,
        primaryCta: asCta(doc.primaryCta),
        secondaryCta: asCta(doc.secondaryCta),
      };
    case 'teamGrid':
      return {
        _type: 'teamGrid',
        source: asSource(doc.source),
        eyebrow: doc.eyebrow ? String(doc.eyebrow) : undefined,
        title: doc.title ? String(doc.title) : undefined,
        description: doc.description ? String(doc.description) : undefined,
        limit: typeof doc.limit === 'number' ? doc.limit : undefined,
        showFilters: Boolean(doc.showFilters),
        cta: asCta(doc.cta),
        people: Array.isArray(doc.people)
          ? (doc.people as Record<string, unknown>[]).filter((item) => item?.name).map(mapPerson)
          : [],
      };
    case 'metricsBand':
      return {
        _type: 'metricsBand',
        eyebrow: doc.eyebrow ? String(doc.eyebrow) : undefined,
        title: doc.title ? String(doc.title) : undefined,
        titleMuted: doc.titleMuted ? String(doc.titleMuted) : undefined,
        description: doc.description ? String(doc.description) : undefined,
        metrics: Array.isArray(doc.metrics)
          ? (doc.metrics as Array<{
              valor?: number;
              label?: string;
              prefix?: string;
              suffix?: string;
              decimals?: number;
              antes?: string;
              despues?: string;
            }>)
              .filter((item) => item.label)
              .map((item) => ({
                valor: Number(item.valor ?? 0),
                label: String(item.label),
                prefix: item.prefix,
                suffix: item.suffix,
                decimals: item.decimals,
                antes: item.antes,
                despues: item.despues,
              }))
          : [],
        primaryCta: asCta(doc.primaryCta),
        secondaryCta: asCta(doc.secondaryCta),
      };
    case 'presenceMap':
      return {
        _type: 'presenceMap',
        eyebrow: doc.eyebrow ? String(doc.eyebrow) : undefined,
        title: doc.title ? String(doc.title) : undefined,
        description: doc.description ? String(doc.description) : undefined,
        cta: asCta(doc.cta),
      };
    default:
      return null;
  }
}

export function mapLanding(doc: Record<string, unknown>): LandingPage {
  const sections = Array.isArray(doc.sections)
    ? doc.sections
        .map((section) => mapLandingSection(section as Record<string, unknown>))
        .filter((section): section is LandingSection => Boolean(section))
    : [];

  return {
    id: String(doc.id),
    title: String(doc.title ?? ''),
    sections,
    seo: seoOf(doc),
  };
}
