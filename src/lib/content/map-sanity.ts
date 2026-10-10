import { asHeadingWidth } from '../heading';
import { urlForWidth } from '../../sanity/image';
import type {
  AboutCopy,
  BeforeAfterBlock,
  CaseRecord,
  CasePageSection,
  CmsImage,
  FaqAnswer,
  FaqItem,
  HomeCopy,
  IndustryRecord,
  LandingCta,
  LandingPage,
  LandingSection,
  PersonRecord,
  PortalPage,
  PortalSection,
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
  noindex?: boolean | null;
  canonicalPath?: string | null;
}): SeoFields | undefined {
  const ogImage = urlForWidth(doc.ogImage, 1200);
  const canonicalPath =
    typeof doc.canonicalPath === 'string' && doc.canonicalPath.startsWith('/') && !doc.canonicalPath.startsWith('//')
      ? doc.canonicalPath
      : undefined;
  const noindex = doc.noindex === true;
  if (!doc.metaTitle && !doc.metaDescription && !ogImage && !noindex && !canonicalPath) return undefined;
  return {
    metaTitle: doc.metaTitle ?? undefined,
    metaDescription: doc.metaDescription ?? undefined,
    ogImage,
    noindex: noindex || undefined,
    canonicalPath,
  };
}

function alternateSlugOf(doc: Record<string, unknown>) {
  return typeof doc.alternateSlug === 'string' && doc.alternateSlug ? doc.alternateSlug : undefined;
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

function uploadedImage(image: unknown): { src: string; alt: string } | undefined {
  const src = imageUrl(image as CmsImage | null | undefined);
  if (!src) return undefined;
  return { src, alt: imageAlt(image as CmsImage) ?? '' };
}

/** A front image is either a gallery asset or an older public path. */
function iconValue(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value.trim();
  return imageUrl(value as CmsImage);
}

function focusPicture(image: unknown, legacyAlt: unknown, title: string) {
  if (typeof image === 'string' && image.trim()) {
    const alt = typeof legacyAlt === 'string' && legacyAlt.trim() ? legacyAlt : title;
    return { image, imageAlt: alt };
  }
  const asset = image && typeof image === 'object' ? (image as { asset?: { _ref?: string; _id?: string } }).asset : undefined;
  if (!asset?._ref && !asset?._id) return undefined;
  const uploaded = uploadedImage(image);
  if (!uploaded?.src) return undefined;
  const alt = uploaded.alt || (typeof legacyAlt === 'string' && legacyAlt.trim() ? legacyAlt : title);
  return { image: uploaded.src, imageAlt: alt };
}

export function mapIndustry(doc: Record<string, unknown>): IndustryRecord {
  const image = doc.heroImage as CmsImage | undefined;
  return {
    id: String(doc.id),
    alternateSlug: alternateSlugOf(doc),
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
      heroCtaLabel: doc.heroCtaLabel ? String(doc.heroCtaLabel) : undefined,
      whyEyebrow: doc.whyEyebrow ? String(doc.whyEyebrow) : undefined,
      whyTitle: doc.whyTitle ? String(doc.whyTitle) : undefined,
      whyDescription: doc.whyDescription ? String(doc.whyDescription) : undefined,
      servicesTitle: doc.servicesTitle ? String(doc.servicesTitle) : undefined,
      servicesDescription: doc.servicesDescription ? String(doc.servicesDescription) : undefined,
      servicesCtaLabel: doc.servicesCtaLabel ? String(doc.servicesCtaLabel) : undefined,
      servicesTag: doc.servicesTag ? String(doc.servicesTag) : undefined,
      casesEyebrow: doc.casesEyebrow ? String(doc.casesEyebrow) : undefined,
      casesTitle: doc.casesTitle ? String(doc.casesTitle) : undefined,
      casesDescription: doc.casesDescription ? String(doc.casesDescription) : undefined,
      casesEmpty: doc.casesEmpty ? String(doc.casesEmpty) : undefined,
      faqTitle: doc.faqTitle ? String(doc.faqTitle) : undefined,
      closingTitle: doc.closingTitle ? String(doc.closingTitle) : undefined,
      sections: mapIndustrySections(doc),
      seo: seoOf(doc),
    },
  };
}

function mapIndustrySections(doc: Record<string, unknown>): IndustryRecord['data']['sections'] {
  if (!Array.isArray(doc.sections)) return undefined;
  const sections = doc.sections.flatMap((item) => {
    const section = item as Record<string, unknown>;
    const type = String(section._type ?? '');
    const text = (value: unknown) => (value ? String(value) : undefined);
    const mapped = ((): NonNullable<IndustryRecord['data']['sections']> => {
    if (type === 'industryHero') {
      const image = section.image as CmsImage | undefined;
      return [{
        _type: 'industryHero' as const,
        badge: text(section.badge),
        title: text(section.title),
        description: text(section.description),
        image: imageUrl(image) ?? undefined,
        imageAlt: imageAlt(image),
        ctaLabel: text(section.ctaLabel),
        ctaHref: text(section.ctaHref),
      }];
    }
    if (type === 'industryWhy') {
      return [{
        _type: 'industryWhy' as const,
        eyebrow: text(section.eyebrow),
        title: text(section.title),
        description: text(section.description),
        pillars: Array.isArray(section.pillars)
          ? (section.pillars as { title?: string; description?: string; icon?: string }[])
              .filter((pillar) => pillar.title && pillar.description)
              .map((pillar) => ({
                title: String(pillar.title),
                description: String(pillar.description),
                icon: typeof pillar.icon === 'string' ? pillar.icon : undefined,
              }))
          : [],
        retos: Array.isArray(section.retos) ? section.retos.map(String) : [],
      }];
    }
    if (type === 'industryServices') {
      const items = Array.isArray(section.blurbs)
        ? (section.blurbs as { slug?: string; nombre?: string; description?: string; icon?: string }[])
            .filter((item) => item.slug)
            .map((item) => ({
              slug: String(item.slug),
              nombre: item.nombre ? String(item.nombre) : undefined,
              description: item.description ? String(item.description) : undefined,
              icon: item.icon ? String(item.icon) : undefined,
            }))
        : [];
      return [{
        _type: 'industryServices' as const,
        eyebrow: text(section.eyebrow),
        title: text(section.title),
        description: text(section.description),
        catalogLabel: text(section.catalogLabel),
        catalogHref: text(section.catalogHref),
        ctaLabel: text(section.ctaLabel),
        tagLabel: text(section.tagLabel),
        items,
      }];
    }
    if (type === 'industryCases') {
      return [{
        _type: 'industryCases' as const,
        eyebrow: text(section.eyebrow),
        title: text(section.title),
        description: text(section.description),
        emptyText: text(section.emptyText),
      }];
    }
    if (type === 'industryFaq') {
      const items = Array.isArray(section.items)
        ? (section.items as { question?: string; answer?: FaqAnswer }[])
            .filter((item) => item.question && item.answer)
            .map((item) => ({ question: String(item.question), answer: item.answer }))
        : [];
      return [{
        _type: 'industryFaq' as const,
        eyebrow: text(section.eyebrow),
        title: text(section.title),
        items,
      }];
    }
    if (type === 'industryCta') {
      return [{ _type: 'industryCta' as const, title: text(section.title) }];
    }
    if (type === 'beforeAfter') return [mapBeforeAfter(section)];
    return [];
    })();
    return mapped.map((entry) => withHeading(section, entry));
  });
  return sections.length ? sections : undefined;
}

function mapServicePlans(doc: Record<string, unknown>): ServiceRecord['data']['planes'] {
  const raw = Array.isArray(doc.planes) ? doc.planes : [];
  const plans = raw
    .map((item) => {
      const plan = item as {
        name?: string;
        badge?: string;
        price?: string;
        period?: string;
        featured?: boolean;
        includes?: string[];
      };
      const includes = Array.isArray(plan.includes) ? plan.includes.map(String).filter(Boolean) : [];
      if (!plan.price || !includes.length) return null;
      const badge = plan.badge?.trim();
      return {
        name: plan.name?.trim() || undefined,
        badge: badge || undefined,
        price: String(plan.price),
        period: plan.period ? String(plan.period) : undefined,
        featured: Boolean(plan.featured),
        includes,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

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
      const mapped = ((): ServiceSection | null => {
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
                icon: iconValue(step.icon),
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
          ? (section.items as { title?: string; summary?: string; detailTitle?: string; detail?: string; icon?: string; image?: unknown; imageAlt?: string }[])
              .flatMap((item) => {
                if (!item.title) return [];
                const picture = focusPicture(item.image, item.imageAlt, String(item.title));
                if (!picture) return [];
                return [
                  {
                    title: String(item.title),
                    summary: String(item.summary ?? ''),
                    detailTitle: String(item.detailTitle ?? item.title),
                    detail: String(item.detail ?? ''),
                    icon: iconValue(item.icon) ?? 'layers',
                    image: picture.image,
                    imageAlt: picture.imageAlt,
                  },
                ];
              })
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
                icon: iconValue(card.icon) ?? 'spark',
                accent: String(card.accent ?? 'purple'),
              }))
          : [];
        const stats = Array.isArray(section.stats)
          ? (section.stats as { valor?: number; prefix?: string; suffix?: string; label?: string }[])
              .filter((stat) => stat.label && typeof stat.valor === 'number')
              .map((stat) => ({
                valor: stat.valor as number,
                prefix: stat.prefix ? String(stat.prefix) : undefined,
                suffix: stat.suffix ? String(stat.suffix) : undefined,
                label: String(stat.label),
              }))
          : undefined;
        return {
          _type: 'serviceWhy' as const,
          title: section.title ? String(section.title) : undefined,
          description: section.description ? String(section.description) : undefined,
          ctaLabel: section.ctaLabel ? String(section.ctaLabel) : undefined,
          ctaHref: section.ctaHref ? String(section.ctaHref) : undefined,
          stats,
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
                icon: iconValue(item.icon),
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
          ? section.items.flatMap((item) => {
              const quote = asTestimonial(item);
              if (!quote?.client) return [];
              return [{ client: quote.client, quote: quote.quote, name: quote.name, role: quote.role, photo: quote.photo, cover: quote.cover, href: quote.href, stats: quote.stats }];
            })
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
      if (type === 'beforeAfter') return mapBeforeAfter(section);
      if (type === 'servicePitch') {
        const picture = focusPicture(section.image, section.imageAlt, String(section.title ?? ''));
        return {
          _type: 'servicePitch' as const,
          badge: section.badge ? String(section.badge) : undefined,
          title: section.title ? String(section.title) : undefined,
          description: section.description ? String(section.description) : undefined,
          image: picture?.image,
          imageAlt: picture?.imageAlt,
          ctaLabel: section.ctaLabel ? String(section.ctaLabel) : undefined,
          ctaHref: section.ctaHref ? String(section.ctaHref) : undefined,
        };
      }
      return null;
      })();
      if (!mapped) return null;
      return withHeading(section, mapped);
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
    alternateSlug: alternateSlugOf(doc),
    data: {
      nombre: String(doc.nombre ?? ''),
      orden: Number(doc.orden ?? 0),
      tagline: String(doc.tagline ?? ''),
      cardImage: typeof doc.cardImage === 'string' ? doc.cardImage : undefined,
      cardIcon: typeof doc.cardIcon === 'string' ? doc.cardIcon : undefined,
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

function asText(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function asStoryStats(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .flatMap((item) => {
      if (!item || typeof item !== 'object') return [];
      const row = item as { value?: unknown; label?: unknown };
      const statValue = asText(row.value);
      const label = asText(row.label);
      if (!statValue || !label) return [];
      return [{ value: statValue, label }];
    })
    .slice(0, 2);
}

function asTestimonial(value: unknown) {
  if (!value || typeof value !== 'object') return undefined;
  const row = value as {
    quote?: unknown;
    name?: unknown;
    role?: unknown;
    client?: unknown;
    photo?: CmsImage | string;
    stats?: unknown;
    project?: { slug?: unknown; cover?: CmsImage };
  };
  const quote = asText(row.quote);
  if (!quote) return undefined;
  const photo =
    typeof row.photo === 'string' && row.photo.startsWith('http') ? row.photo : imageUrl(row.photo as CmsImage, 900);
  const stats = asStoryStats(row.stats);
  const cover = imageUrl(row.project?.cover, 1400);
  const slug = asText(row.project?.slug);
  return {
    quote,
    name: asText(row.name) ?? '',
    role: asText(row.role) ?? '',
    client: asText(row.client),
    photo,
    cover,
    href: slug ? `/portafolio/${slug}` : undefined,
    stats: stats.length ? stats : undefined,
  };
}

function asBlocks(value: unknown): { title: string; description: string }[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === 'object' && 'title' in item)
    .map((item) => {
      const block = item as { title?: string; description?: string };
      return { title: String(block.title ?? ''), description: String(block.description ?? '') };
    });
}

function asMetrics(value: unknown): CaseRecord['data']['metricas'] {
  if (!Array.isArray(value)) return [];
  return value as CaseRecord['data']['metricas'];
}

function mapCaseSections(raw: Array<Record<string, unknown>>): CasePageSection[] {
  return raw.flatMap((section): CasePageSection[] => {
    const type = String(section._type ?? '');
    const mapped = ((): CasePageSection[] => {
    if (type === 'caseHero') {
      return [
        {
          _type: 'caseHero',
          anio: asText(section.anio),
          imagenesProyecto: Array.isArray(section.imagenesProyecto)
            ? section.imagenesProyecto
                .map((image) => imageUrl(image as CmsImage, 800))
                .filter((src): src is string => Boolean(src))
            : [],
        },
      ];
    }
    if (type === 'caseContext') {
      return [
        {
          _type: 'caseContext',
          retoEyebrow: asText(section.retoEyebrow),
          retoTitle: asText(section.retoTitle),
          reto: asText(section.reto),
          estrategiaEyebrow: asText(section.estrategiaEyebrow),
          estrategiaTitle: asText(section.estrategiaTitle),
          estrategia: asText(section.estrategia),
        },
      ];
    }
    if (type === 'caseProcess') {
      return [
        {
          _type: 'caseProcess',
          eyebrow: asText(section.eyebrow),
          title: asText(section.title),
          description: asText(section.description),
          fases: asBlocks(section.fases),
        },
      ];
    }
    if (type === 'caseMetrics') {
      const primary = asCta(section.primaryCta);
      const secondary = asCta(section.secondaryCta);
      return [
        {
          _type: 'caseMetrics',
          eyebrow: asText(section.eyebrow),
          title: asText(section.title),
          description: asText(section.description),
          metricas: asMetrics(section.items),
          primaryLabel: primary?.label,
          primaryHref: primary?.href,
          secondaryLabel: secondary?.label,
          secondaryHref: secondary?.href,
        },
      ];
    }
    if (type === 'caseTestimonial') {
      const quote = asTestimonial(section);
      return [
        {
          _type: 'caseTestimonial',
          eyebrow: asText(section.eyebrow),
          title: asText(section.title),
          description: asText(section.description),
          quote: quote?.quote,
          name: quote?.name,
          role: quote?.role,
          client: quote?.client,
          photo: quote?.photo,
          stats: quote?.stats,
        },
      ];
    }
    if (type === 'caseRelated') {
      return [
        {
          _type: 'caseRelated',
          eyebrow: asText(section.eyebrow),
          title: asText(section.title),
          description: asText(section.description),
        },
      ];
    }
    if (type === 'beforeAfter') return [mapBeforeAfter(section)];
    if (type === 'caseCta') {
      const primary = asCta(section.primaryCta);
      return [
        {
          _type: 'caseCta',
          badge: asText(section.badge),
          title: asText(section.title),
          description: asText(section.description),
          primaryLabel: primary?.label,
          primaryHref: primary?.href,
        },
      ];
    }
    return [];
    })();
    return mapped.map((entry) => withHeading(section, entry));
  });
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
  const sections = Array.isArray(doc.sections)
    ? mapCaseSections(doc.sections as Array<Record<string, unknown>>)
    : [];
  const hero = sections.find((section) => section._type === 'caseHero');
  const context = sections.find((section) => section._type === 'caseContext');
  const process = sections.find((section) => section._type === 'caseProcess');
  const metrics = sections.find((section) => section._type === 'caseMetrics');
  const testimonial = sections.find((section) => section._type === 'caseTestimonial');
  const legacyQuote = doc.testimonio as CaseRecord['data']['testimonio'];

  return {
    id: String(doc.id),
    data: {
      cliente: String(doc.cliente ?? ''),
      industria: { id: String(industria?.id ?? '') },
      servicios,
      resultadoFrase: asText(doc.resultadoFrase) ?? '',
      titulo: String(doc.titulo ?? ''),
      resumen: String(doc.resumen ?? ''),
      destacado: Boolean(doc.destacado),
      accent,
      metricas: metrics?._type === 'caseMetrics' ? metrics.metricas : asMetrics(doc.metricas),
      reto: context?._type === 'caseContext' ? (context.reto ?? '') : String(doc.reto ?? ''),
      estrategia:
        context?._type === 'caseContext' ? (context.estrategia ?? '') : String(doc.estrategia ?? ''),
      fases: process?._type === 'caseProcess' ? process.fases : asBlocks(doc.fases),
      testimonio:
        testimonial?._type === 'caseTestimonial' && testimonial.quote
          ? {
              quote: testimonial.quote,
              name: testimonial.name ?? '',
              role: testimonial.role ?? '',
              client: testimonial.client,
              photo: testimonial.photo,
              stats: asStoryStats(testimonial.stats),
            }
          : asTestimonial(legacyQuote) ?? legacyQuote,
      anio: hero?._type === 'caseHero' ? hero.anio : asText(doc.anio),
      imagenesProyecto:
        hero?._type === 'caseHero'
          ? (hero.imagenesProyecto ?? [])
          : Array.isArray(doc.imagenesProyecto)
            ? doc.imagenesProyecto
                .map((image) => imageUrl(image as CmsImage, 800))
                .filter((src): src is string => Boolean(src))
            : [],
      sections,
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

  const card = doc.authorCard as {
    name?: string;
    role?: string;
    company?: string;
    linkedin?: string;
    photo?: CmsImage;
  } | null;
  const authorName = card?.name ? String(card.name) : String(doc.authorName ?? doc.autor ?? '');
  const author = authorName
    ? {
        name: authorName,
        role: card?.role ? String(card.role) : undefined,
        company: card?.company ? String(card.company) : undefined,
        linkedin: card?.linkedin ? String(card.linkedin) : undefined,
        photo: card?.photo ? urlForWidth(card.photo, 240) : undefined,
      }
    : undefined;

  return {
    id: String(doc.id),
    alternateSlug: alternateSlugOf(doc),
    data: {
      title: String(doc.title ?? ''),
      description: String(doc.description ?? ''),
      keyword: String(doc.keyword ?? ''),
      autor: authorName || 'Hiweb',
      author,
      fecha,
      featured: Boolean(doc.featured),
      readingMinutes: postReadingMinutes(doc),
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

function asPeople(value: unknown): PersonRecord[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === 'object' && (item as { name?: string }).name)
    .map((item) => mapPerson(item as Record<string, unknown>));
}

function asTeamFilters(value: unknown): AboutCopy['teamFilters'] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const row = item as { id?: string; label?: string; members?: unknown };
    const label = text(row.label);
    if (!label) return [];
    const id = row.id === 'all' || row.id === 'web' || row.id === 'redes' || row.id === 'diseno' ? row.id : undefined;
    const members = Array.isArray(row.members) ? asPeople(row.members) : undefined;
    return [{ id, label, members }];
  });
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
    description: item.description ? String(item.description) : undefined,
    headingWidth: asHeadingWidth(item.headingWidth),
  };
}

function withHeading<T extends object>(section: Record<string, unknown>, entry: T): T {
  const headingWidth = asHeadingWidth(section.headingWidth);
  return {
    ...entry,
    ...(headingWidth ? { headingWidth } : {}),
    ...(section.hidden === true ? { hidden: true } : {}),
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
      image: typeof item.image === 'string' ? item.image : undefined,
      icon: typeof item.icon === 'string' ? item.icon : undefined,
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
      icon: typeof item.icon === 'string' ? item.icon : undefined,
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
      copy.heroHeadingWidth = asHeadingWidth(section.headingWidth);
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
        ? section.items.flatMap((item) => {
            const quote = asTestimonial(item);
            if (!quote?.client) return [];
            return [{ client: quote.client, quote: quote.quote, name: quote.name, role: quote.role, photo: quote.photo, cover: quote.cover, href: quote.href, stats: quote.stats }];
          })
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
        memberLocale: section.memberLocale === 'en' ? 'en' : section.memberLocale === 'es' ? 'es' : undefined,
        leaders: asPeople(section.leaders),
        ctaLabel: section.ctaLabel ? String(section.ctaLabel) : undefined,
        ctaHref: section.ctaHref ? String(section.ctaHref) : undefined,
        headingWidth: asHeadingWidth(section.headingWidth),
      };
    } else if (type === 'homeFaq') {
      copy.faqIntro = asIntro(section.intro);
      copy.faqCategories = Array.isArray(section.categories)
        ? (section.categories as HomeCopy['faqCategories'])
        : undefined;
    } else if (type === 'beforeAfter' && section.hidden !== true) {
      copy.beforeAfter = [...(copy.beforeAfter ?? []), withHeading(section, mapBeforeAfter(section))];
    } else if (type === 'homeCta') {
      copy.closing = {
        badge: section.badge ? String(section.badge) : undefined,
        title: section.title ? String(section.title) : undefined,
        description: section.description ? String(section.description) : undefined,
        primaryCta: section.primaryCta as HomeCopy['primaryCta'],
        headingWidth: asHeadingWidth(section.headingWidth),
      };
    }
  }

  if (sections.length) {
    copy.hasSections = true;
    copy.sectionOrder = sections
      .filter((section) => section.hidden !== true)
      .map((section) => String(section._type));
  }
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
    historyImages: [doc.historyImageLarge, doc.historyImageTop, doc.historyImageBottom].map(
      (image) => uploadedImage(image),
    ),
    heroBadge: text(doc.heroBadge),
    heroCtaLabel: text(doc.heroCtaLabel),
    heroCtaHref: text(doc.heroCtaHref),
    pillarsEyebrow: text(doc.pillarsEyebrow),
    pillarsTitle: text(doc.pillarsTitle),
    pillars: Array.isArray(doc.pillars) ? (doc.pillars as AboutCopy['pillars']) : undefined,
    processEyebrow: text(doc.processEyebrow),
    processTitle: text(doc.processTitle),
    processDescription: text(doc.processDescription),
    teamEyebrow: text(doc.teamEyebrow),
    teamTitle: text(doc.teamTitle),
    teamDescription: text(doc.teamDescription),
    teamCtaLabel: text(doc.teamCtaLabel),
    teamCtaHref: text(doc.teamCtaHref),
    teamFilters: Array.isArray(doc.teamFilters) ? (doc.teamFilters as AboutCopy['teamFilters']) : undefined,
    mapEyebrow: text(doc.mapEyebrow),
    mapTitle: text(doc.mapTitle),
    mapDescription: text(doc.mapDescription),
    closingBadge: text(doc.closingBadge),
    closingTitle: text(doc.closingTitle),
    closingDescription: text(doc.closingDescription),
    closingCtaLabel: text(doc.closingCtaLabel),
    sections: mapAboutSections(doc),
    seo: seoOf(doc),
  };
}

function mapAboutSections(doc: Record<string, unknown>): AboutCopy['sections'] {
  if (!Array.isArray(doc.sections)) return undefined;
  const sections = doc.sections.flatMap((item) => {
    const section = item as Record<string, unknown>;
    const type = String(section._type ?? '');
    const mapped = ((): NonNullable<AboutCopy['sections']> => {
    if (type === 'aboutHero') {
      const image = section.image as CmsImage | undefined;
      const badges = Array.isArray(section.badges)
        ? (section.badges as { label?: string; variant?: string }[])
            .filter((badge) => badge.label)
            .map((badge) => ({ label: String(badge.label), variant: badge.variant ? String(badge.variant) : undefined }))
        : [];
      return [{
        _type: 'aboutHero' as const,
        badges,
        title: text(section.title),
        description: text(section.description),
        image: imageUrl(image) ?? undefined,
        imageAlt: imageAlt(image),
        imagePosition: text(section.imagePosition),
        ctaLabel: text(section.ctaLabel),
        ctaHref: text(section.ctaHref),
      }];
    }
    if (type === 'aboutHistory') {
      return [{
        _type: 'aboutHistory' as const,
        eyebrow: text(section.eyebrow),
        title: text(section.title),
        description: text(section.description),
        images: [section.imageLarge, section.imageTop, section.imageBottom].map((image) =>
          uploadedImage(image),
        ),
        columns: Array.isArray(section.columns)
          ? (section.columns as { title?: string; paragraphs?: string[] }[])
              .filter((column) => column.title)
              .map((column) => ({
                title: String(column.title),
                paragraphs: Array.isArray(column.paragraphs) ? column.paragraphs.map(String) : [],
              }))
          : undefined,
      }];
    }
    if (type === 'aboutPillars') {
      return [{
        _type: 'aboutPillars' as const,
        eyebrow: text(section.eyebrow),
        title: text(section.title),
        description: text(section.description),
        pillars: Array.isArray(section.pillars) ? (section.pillars as AboutCopy['pillars']) : [],
      }];
    }
    if (type === 'aboutProcess') {
      const phases = Array.isArray(section.phases)
        ? (section.phases as { index?: string; title?: string; description?: string }[])
            .filter((phase) => phase.title)
            .map((phase, index) => ({
              index: phase.index || String(index + 1).padStart(2, '0'),
              title: String(phase.title),
              description: String(phase.description ?? ''),
            }))
        : [];
      return [{
        _type: 'aboutProcess' as const,
        eyebrow: text(section.eyebrow),
        title: text(section.title),
        description: text(section.description),
        phases,
      }];
    }
    if (type === 'aboutTeam') {
      return [{
        _type: 'aboutTeam' as const,
        eyebrow: text(section.eyebrow),
        title: text(section.title),
        description: text(section.description),
        ctaLabel: text(section.ctaLabel),
        ctaHref: text(section.ctaHref),
        memberLocale: section.memberLocale === 'en' ? 'en' : section.memberLocale === 'es' ? 'es' : undefined,
        filterLabel: text(section.filterLabel),
        filters: asTeamFilters(section.filters),
      }];
    }
    if (type === 'aboutMap') {
      return [{
        _type: 'aboutMap' as const,
        eyebrow: text(section.eyebrow),
        title: text(section.title),
        description: text(section.description),
        sectionLabel: text(section.sectionLabel),
        globeLabel: text(section.globeLabel),
        ctaLabel: text(section.ctaLabel),
        ctaHref: text(section.ctaHref),
      }];
    }
    if (type === 'aboutPortal') {
      return [{
        _type: 'aboutPortal' as const,
        eyebrow: text(section.eyebrow),
        title: text(section.title),
        description: text(section.description),
        clientName: text(section.clientName),
        badgeVariant: text(section.badgeVariant),
        primaryLabel: text(section.primaryLabel),
        primaryHref: text(section.primaryHref),
        secondaryLabel: text(section.secondaryLabel),
        secondaryHref: text(section.secondaryHref),
      }];
    }
    if (type === 'beforeAfter') return [mapBeforeAfter(section)];
    if (type === 'aboutCta') {
      return [{
        _type: 'aboutCta' as const,
        badge: text(section.badge),
        title: text(section.title),
        description: text(section.description),
        ctaLabel: text(section.ctaLabel),
        ctaHref: text(section.ctaHref),
      }];
    }
    return [];
    })();
    return mapped.map((entry) => withHeading(section, entry));
  });
  return sections.length ? sections : undefined;
}

function text(value: unknown) {
  return typeof value === 'string' && value ? value : undefined;
}

function mapBeforeAfter(section: Record<string, unknown>): BeforeAfterBlock {
  const pairs = Array.isArray(section.pairs)
    ? section.pairs.flatMap((item) => {
        if (!item || typeof item !== 'object') return [];
        const pair = item as Record<string, unknown>;
        const beforeImage = imageUrl(pair.beforeImage as CmsImage) ?? undefined;
        const afterImage = imageUrl(pair.afterImage as CmsImage) ?? undefined;
        const beforeVideo = typeof pair.beforeVideo === 'string' ? pair.beforeVideo : undefined;
        const afterVideo = typeof pair.afterVideo === 'string' ? pair.afterVideo : undefined;
        if (!beforeImage && !beforeVideo && !afterImage && !afterVideo) return [];
        return [{
          title: text(pair.title),
          beforeLabel: text(pair.beforeLabel) || 'Antes',
          afterLabel: text(pair.afterLabel) || 'Después',
          beforeImage,
          beforeVideo,
          afterImage,
          afterVideo,
        }];
      })
    : [];
  return {
    _type: 'beforeAfter',
    eyebrow: text(section.eyebrow),
    title: text(section.title),
    description: text(section.description),
    badge: text(section.badge),
    badgeVariant: text(section.badgeVariant),
    pairs,
  };
}

function postReadingMinutes(doc: Record<string, unknown>) {
  const override = Number(doc.readingMinutes);
  if (Number.isFinite(override) && override > 0) return Math.round(override);
  const words = String(doc.bodyText ?? '')
    .split(/\s+/)
    .filter(Boolean).length;
  if (!words) return 1;
  return Math.max(1, Math.round(words / 200));
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
    case 'industryGrid': {
      const cards = Array.isArray(doc.cards) && doc.cards.length ? doc.cards : doc.industries;
      return {
        _type: 'industryGrid',
        source: asSource(doc.source),
        eyebrow: doc.eyebrow ? String(doc.eyebrow) : undefined,
        title: doc.title ? String(doc.title) : undefined,
        description: doc.description ? String(doc.description) : undefined,
        tone: asTone(doc.tone),
        industries: Array.isArray(cards)
          ? (cards as Array<{ id?: string; nombre?: string; tagline?: string; icon?: string; puntos?: string[]; porQue?: { title?: string }[] }>)
              .filter((item) => item.id)
              .map((item) => ({
                id: String(item.id),
                nombre: String(item.nombre ?? ''),
                tagline: String(item.tagline ?? ''),
                icon: typeof item.icon === 'string' ? item.icon : undefined,
                puntos: Array.isArray(item.puntos)
                  ? item.puntos.map((punto) => String(punto)).filter(Boolean)
                  : Array.isArray(item.porQue)
                    ? item.porQue.map((punto) => String(punto.title ?? '')).filter(Boolean)
                    : undefined,
              }))
          : [],
      };
    }
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
    case 'beforeAfter':
      return mapBeforeAfter(doc);
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

const PORTAL_MODULES = ['rrss', 'web', 'seo', 'docs', 'hilinks'] as const;

export function mapPortal(doc: Record<string, unknown> | null): PortalPage | null {
  if (!doc) return null;
  const sections = Array.isArray(doc.sections)
    ? doc.sections.flatMap((item): PortalSection[] => {
        const section = item as Record<string, unknown>;
        if (section.hidden === true) return [];
        const type = String(section._type ?? '');
        if (type === 'beforeAfter') return [withHeading(section, mapBeforeAfter(section))];
        if (type === 'portalHero') {
          const samples = Array.isArray(section.samples)
            ? section.samples.flatMap((row) => {
                const sample = row as { module?: string; title?: string; detail?: string };
                if (!sample.title || !sample.module) return [];
                if (!PORTAL_MODULES.includes(sample.module as (typeof PORTAL_MODULES)[number])) return [];
                return [{
                  module: sample.module as (typeof PORTAL_MODULES)[number],
                  title: String(sample.title),
                  detail: sample.detail ? String(sample.detail) : undefined,
                }];
              })
            : undefined;
          return [withHeading(section, {
            _type: 'portalHero' as const,
            badge: text(section.badge),
            badgeNote: text(section.badgeNote),
            title: text(section.title),
            description: text(section.description),
            clientName: text(section.clientName),
            windowTitle: text(section.windowTitle),
            proofTitle: text(section.proofTitle),
            proofText: text(section.proofText),
            tourLabel: text(section.tourLabel),
            viewerLabel: text(section.viewerLabel),
            coachLabel: text(section.coachLabel),
            coachText: text(section.coachText),
            samples,
          })];
        }
        if (type === 'portalStrip') {
          const badges = Array.isArray(section.badges)
            ? (section.badges as { label?: string; variant?: string }[])
                .filter((badge) => badge.label)
                .map((badge) => ({ label: String(badge.label), variant: badge.variant }))
            : [];
          return [withHeading(section, { _type: 'portalStrip' as const, text: text(section.text), badges })];
        }
        if (type === 'portalJourney') {
          const steps = Array.isArray(section.steps)
            ? (section.steps as Record<string, unknown>[]).filter((step) => step.title).map((step) => ({
                index: text(step.index),
                title: text(step.title),
                description: text(step.description),
                panelTitle: text(step.panelTitle),
                panelText: text(step.panelText),
                badge: text(step.badge),
                badgeVariant: text(step.badgeVariant),
              }))
            : [];
          return [withHeading(section, {
            _type: 'portalJourney' as const,
            eyebrow: text(section.eyebrow),
            title: text(section.title),
            description: text(section.description),
            steps,
          })];
        }
        if (type === 'portalBento') {
          const cards = Array.isArray(section.cards)
            ? (section.cards as Record<string, unknown>[]).filter((card) => card.title).map((card) => ({
                eyebrow: text(card.eyebrow),
                title: text(card.title),
                description: text(card.description),
                module: text(card.module),
              }))
            : [];
          return [withHeading(section, {
            _type: 'portalBento' as const,
            eyebrow: text(section.eyebrow),
            title: text(section.title),
            description: text(section.description),
            cards,
          })];
        }
        if (type === 'portalFaq') {
          const items = Array.isArray(section.items)
            ? (section.items as Record<string, unknown>[]).flatMap((row) => {
                if (!row.question || !row.answer) return [];
                return [{
                  question: String(row.question),
                  answer: String(row.answer),
                  badge: text(row.badge),
                  category: text(row.category),
                }];
              })
            : [];
          return [withHeading(section, {
            _type: 'portalFaq' as const,
            eyebrow: text(section.eyebrow),
            title: text(section.title),
            description: text(section.description),
            searchPlaceholder: text(section.searchPlaceholder),
            items,
          })];
        }
        if (type === 'portalCloser') {
          return [withHeading(section, {
            _type: 'portalCloser' as const,
            lead: text(section.lead),
            title: text(section.title),
            description: text(section.description),
            primaryLabel: text(section.primaryLabel),
            secondaryLabel: text(section.secondaryLabel),
            trust: Array.isArray(section.trust) ? section.trust.map(String) : [],
          })];
        }
        return [];
      })
    : [];
  return { title: String(doc.title ?? ''), sections, seo: seoOf(doc) };
}

export function mapLanding(doc: Record<string, unknown>): LandingPage {
  const sections = Array.isArray(doc.sections)
    ? doc.sections
        .map((section) => {
          const raw = section as Record<string, unknown>;
          const mapped = mapLandingSection(raw);
          if (!mapped) return null;
          return withHeading(raw, mapped);
        })
        .filter((section): section is LandingSection => Boolean(section))
    : [];

  return {
    id: String(doc.id),
    title: String(doc.title ?? ''),
    sections,
    seo: seoOf(doc),
  };
}
