import type { TeamMember } from '../../components/sections/TeamGrid';
import type { Pillar, PillarAccent } from '../../components/sections/PillarGrid';
import {
  LP_CALENDAR_DEFAULTS,
  LP_CASES_DEFAULTS,
  LP_FORM_DEFAULTS,
  LP_NAV_DEFAULTS,
  LP_ROI_INVESTMENT,
  LP_ROI_LABELS,
  LP_SYSTEM_CTA_DEFAULTS,
} from '../../data/lp/defaults';
import { LP_HERO_MARKS, LP_LOGOS, LP_MARQUEE_EXTRAS } from '../../data/lp/catalog';
import { urlForWidth } from '../../sanity/image';
import type { FaqItem, Metric, ProcessPhase } from './types';
import type { LpImage, LpPage, LpPicker, LpRoiLabels, LpSection, LpServiceCard, LpServiceLink, LpTemplate } from './lp-types';

function text(value: unknown): string {
  return typeof value === 'string' ? value.replace(/[\u200B-\u200D\uFEFF]/g, '') : '';
}

function list(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object') : [];
}

function strings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => text(item)).filter(Boolean);
}

function stringsOr(value: unknown, fallback: string[]): string[] {
  const items = strings(value);
  return items.length ? items : fallback;
}

function numberOr(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

/** Studio images resolve through the CDN. Older documents stored a plain URL. */
function imageUrl(value: unknown, width: number): string {
  if (typeof value === 'string') return value;
  const item = record(value);
  if (typeof item.src === 'string' && item.src) return item.src;
  if (!item.asset) return '';
  return urlForWidth(item as never, width) ?? '';
}

function images(value: unknown, width: number): LpImage[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => ({ src: imageUrl(item, width), alt: text(record(item).alt) }))
    .filter((item) => item.src);
}

/** Sanity stores the original strip. These two marks are appended on every landing. */
function marqueeLogos(value: unknown): LpImage[] {
  const remote = images(value, 320);
  const base = remote.length ? remote : LP_LOGOS;
  const present = new Set(base.map((logo) => logo.src));
  return [...base, ...LP_MARQUEE_EXTRAS.filter((logo) => !present.has(logo.src))];
}

function templateOf(value: unknown): LpTemplate {
  return value === 'servicios' || value === 'industrias' ? value : 'general';
}

function answerOf(value: unknown): FaqItem['answer'] {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value as FaqItem['answer'];
  return '';
}

function categoryOf(value: unknown): TeamMember['category'] {
  return value === 'redes' || value === 'diseno' ? value : 'web';
}

function accentOf(value: unknown): PillarAccent | undefined {
  return value === 'purple' || value === 'cyan' || value === 'orange' || value === 'green' ? value : undefined;
}

function serviceLink(item: Record<string, unknown>): LpServiceLink {
  return { slug: text(item.slug), name: text(item.name), short: text(item.short), href: text(item.href) };
}

function serviceCard(item: Record<string, unknown>): LpServiceCard {
  return { ...serviceLink(item), title: text(item.title) || undefined, icon: text(item.icon) || undefined };
}

function roiLabels(raw: Record<string, unknown>): LpRoiLabels {
  const labels = { ...LP_ROI_LABELS };
  for (const key of Object.keys(labels) as (keyof LpRoiLabels)[]) {
    labels[key] = text(raw[key]) || LP_ROI_LABELS[key];
  }
  return labels;
}

function mapSection(raw: Record<string, unknown>): LpSection | null {
  const type = text(raw._type);
  const hidden = raw.hidden === true;
  const headingWidth = text(raw.headingWidth) || undefined;
  const base = { hidden, headingWidth };

  if (type === 'lpHero') {
    return {
      ...base,
      _type: 'lpHero',
      title: text(raw.title),
      description: text(raw.description),
      trust: text(raw.trust) || undefined,
      avatars: LP_HERO_MARKS,
      primaryLabel: text(raw.primaryLabel) || 'Agenda tu diagnóstico',
      secondaryLabel: text(raw.secondaryLabel) || 'Escríbenos por WhatsApp',
      whatsappHref: text(raw.whatsappHref),
      landingName: text(raw.landingName) || text(raw.title),
      interests: strings(raw.interests),
      formMessageTab: text(raw.formMessageTab) || LP_FORM_DEFAULTS.formMessageTab,
      formCallTab: text(raw.formCallTab) || LP_FORM_DEFAULTS.formCallTab,
      formTitle: text(raw.formTitle) || LP_FORM_DEFAULTS.formTitle,
      formSubtitle:
        text(raw.formSubtitle) === 'Cuatro pasos. Sin compromiso.'
          ? LP_FORM_DEFAULTS.formSubtitle
          : text(raw.formSubtitle) || LP_FORM_DEFAULTS.formSubtitle,
      formCountries: stringsOr(raw.formCountries, LP_FORM_DEFAULTS.formCountries),
      formSizes: stringsOr(raw.formSizes, LP_FORM_DEFAULTS.formSizes),
      formBudgets: stringsOr(raw.formBudgets, LP_FORM_DEFAULTS.formBudgets),
    };
  }

  if (type === 'logoMarquee') {
    return { ...base, _type: 'logoMarquee', label: text(raw.label), logos: marqueeLogos(raw.logos) };
  }

  if (type === 'roiCalculator') {
    const investment = record(raw.investment);
    return {
      ...base,
      ...roiLabels(raw),
      _type: 'roiCalculator',
      eyebrow: text(raw.eyebrow),
      title: text(raw.title),
      description: text(raw.description),
      ctaLabel: text(raw.ctaLabel),
      preset: text(raw.preset) || undefined,
      investment: {
        initial: numberOr(investment.initial, LP_ROI_INVESTMENT.initial),
        step: numberOr(investment.step, LP_ROI_INVESTMENT.step),
        min: numberOr(investment.min, LP_ROI_INVESTMENT.min),
        max: numberOr(investment.max, LP_ROI_INVESTMENT.max),
      },
      industries: list(raw.industries).map((item) => ({
        slug: text(item.slug),
        name: text(item.name),
        icon: text(item.icon) || undefined,
        cpl: Number(item.cpl) || 0,
        close: Number(item.close) || 0,
        ticket: Number(item.ticket) || 0,
        margin: Number(item.margin) || 0,
      })),
    };
  }

  if (type === 'statement') {
    return { ...base, _type: 'statement', eyebrow: text(raw.eyebrow), title: text(raw.title), paragraphs: strings(raw.paragraphs) };
  }

  if (type === 'serviceSystem') {
    return {
      ...base,
      _type: 'serviceSystem',
      eyebrow: text(raw.eyebrow),
      title: text(raw.title),
      description: text(raw.description),
      quadrants: list(raw.quadrants).map((item) => ({
        title: text(item.title),
        icon: text(item.icon) || undefined,
        services: list(item.services).map(serviceCard),
      })),
      ctaTitle: text(raw.ctaTitle) || LP_SYSTEM_CTA_DEFAULTS.ctaTitle,
      ctaText: text(raw.ctaText) || LP_SYSTEM_CTA_DEFAULTS.ctaText,
      combosTitle: text(raw.combosTitle) || undefined,
      combos: list(raw.combos).map((item) => ({
        title: text(item.title),
        description: text(item.description),
        services: strings(item.services),
        ctaLabel: text(item.ctaLabel),
      })),
    };
  }

  if (type === 'lpServiceFocus' || type === 'serviceFocus') {
    return {
      ...base,
      _type: 'lpServiceFocus',
      eyebrow: text(raw.eyebrow),
      title: text(raw.title),
      description: text(raw.description),
      challenges: list(raw.challenges).map((item) => ({ title: text(item.title), description: text(item.description) })),
      stepsTitle: text(raw.stepsTitle) || undefined,
      steps: strings(raw.steps),
      relatedTitle: text(raw.relatedTitle),
      relatedDescription: text(raw.relatedDescription) || undefined,
      related: list(raw.related).map(serviceLink),
      kpisLabel: text(raw.kpisLabel) || undefined,
      kpis: text(raw.kpis) || undefined,
      foot: text(raw.foot),
      bundleLabel: text(raw.bundleLabel),
      bundle: strings(raw.bundle),
    };
  }

  if (type === 'ctaBand') {
    return {
      ...base,
      _type: 'ctaBand',
      title: text(raw.title),
      description: text(raw.description),
      primaryLabel: text(raw.primaryLabel),
      secondaryLabel: text(raw.secondaryLabel),
      whatsappHref: text(raw.whatsappHref),
    };
  }

  if (type === 'pillarGrid') {
    const pillars: Pillar[] = list(raw.pillars).map((item) => ({
      title: text(item.title),
      description: text(item.description),
      icon: text(item.icon) || undefined,
      accent: accentOf(item.accent),
      href: text(item.href) || undefined,
    }));
    return {
      ...base,
      _type: 'pillarGrid',
      eyebrow: text(raw.eyebrow) || undefined,
      title: text(raw.title) || undefined,
      description: text(raw.description) || undefined,
      tone: raw.tone === 'surface' ? 'surface' : undefined,
      pillars,
    };
  }

  if (type === 'lpIndustryCards') {
    return {
      ...base,
      _type: 'industryGrid',
      eyebrow: text(raw.eyebrow) || undefined,
      title: text(raw.title) || undefined,
      description: text(raw.description) || undefined,
      ctaLabel: text(raw.ctaLabel) || undefined,
      hrefPrefix: text(raw.hrefPrefix) || '/ads/industrias',
      industries: list(raw.industries).map((item) => ({
        slug: text(item.slug),
        nombre: text(item.nombre),
        tagline: text(item.tagline),
        icon: text(item.icon) || undefined,
      })),
    };
  }

  if (type === 'lpPortal') {
    return {
      ...base,
      _type: 'lpPortal',
      eyebrow: text(raw.eyebrow) || undefined,
      title: text(raw.title) || undefined,
      description: text(raw.description) || undefined,
      primaryLabel: text(raw.primaryLabel) || undefined,
      primaryHref: text(raw.primaryHref) || undefined,
      secondaryLabel: text(raw.secondaryLabel) || undefined,
      secondaryHref: text(raw.secondaryHref) || undefined,
    };
  }

  if (type === 'metricsBand') {
    const metrics: Metric[] = list(raw.metrics).map((item) => ({
      valor: Number(item.valor) || 0,
      label: text(item.label),
      prefix: text(item.prefix) || undefined,
      suffix: text(item.suffix) || undefined,
      decimals: typeof item.decimals === 'number' ? item.decimals : undefined,
    }));
    return {
      ...base,
      _type: 'metricsBand',
      eyebrow: text(raw.eyebrow) || undefined,
      title: text(raw.title) || undefined,
      description: text(raw.description) || undefined,
      metrics,
    };
  }

  if (type === 'lpCaseCards') {
    return {
      ...base,
      _type: 'casePreview',
      eyebrow: text(raw.eyebrow) || undefined,
      title: text(raw.title) || undefined,
      description: text(raw.description) || undefined,
      caseSlugs: strings(raw.caseSlugs),
      cardCtaLabel: text(raw.cardCtaLabel) || LP_CASES_DEFAULTS.cardCtaLabel,
      portfolioLabel: text(raw.portfolioLabel) || LP_CASES_DEFAULTS.portfolioLabel,
      portfolioHref: text(raw.portfolioHref) || LP_CASES_DEFAULTS.portfolioHref,
    };
  }

  if (type === 'processPhases') {
    const phases: ProcessPhase[] = list(raw.phases).map((item, index) => ({
      index: text(item.index) || String(index + 1).padStart(2, '0'),
      title: text(item.title),
      description: text(item.description),
      ...(text(item.icon) ? { icon: text(item.icon) } : {}),
    }));
    return {
      ...base,
      _type: 'processPhases',
      eyebrow: text(raw.eyebrow) || undefined,
      title: text(raw.title) || undefined,
      description: text(raw.description) || undefined,
      phases,
    };
  }

  if (type === 'teamGrid') {
    const members: TeamMember[] = list(raw.members).map((item) => ({
      name: text(item.name),
      role: text(item.role),
      bio: text(item.bio),
      photo: imageUrl(item.photoImage, 500) || text(item.photo),
      category: categoryOf(item.category),
    }));
    const cta = record(raw.cta);
    return {
      ...base,
      _type: 'teamGrid',
      eyebrow: text(raw.eyebrow) || undefined,
      title: text(raw.title) || undefined,
      description: text(raw.description) || undefined,
      layout: raw.layout === 'grid' ? 'grid' : 'slider',
      ctaLabel: text(cta.label) || undefined,
      ctaHref: text(cta.href) || undefined,
      members,
    };
  }

  if (type === 'faqSection') {
    const items: FaqItem[] = [...list(raw.items), ...list(raw.faqRefs)]
      .map((item) => ({ question: text(item.question), answer: answerOf(item.answer) }))
      .filter((item) => item.question);
    return {
      ...base,
      _type: 'faqSection',
      eyebrow: text(raw.eyebrow) || undefined,
      title: text(raw.title) || undefined,
      description: text(raw.description) || undefined,
      items,
    };
  }

  if (type === 'finalCta') {
    const primary = record(raw.primaryCta);
    const secondary = record(raw.secondaryCta);
    return {
      ...base,
      _type: 'finalCta',
      badge: text(raw.badge) || undefined,
      title: text(raw.title) || undefined,
      description: text(raw.description) || undefined,
      primaryLabel: text(primary.label) || undefined,
      primaryHref: text(primary.href) || undefined,
      primaryOpensCalendar: raw.primaryOpensCalendar === true,
      secondaryLabel: text(secondary.label) || undefined,
      secondaryHref: text(secondary.href) || undefined,
      anchorId: text(raw.anchorId) || undefined,
    };
  }

  return null;
}

export function mapLpDocument(doc: Record<string, unknown> | null): LpPage | null {
  if (!doc) return null;
  const path = text(doc.path);
  if (!path.startsWith('/ads/')) return null;
  const nav = record(doc.nav);
  const calendar = record(doc.calendar);
  const pickerRaw = record(doc.picker);
  const options = list(pickerRaw.options).map((option) => ({
    slug: text(option.slug),
    title: text(option.title),
    description: text(option.description),
    href: text(option.href),
    icon: text(option.icon) || undefined,
  }));
  const picker: LpPicker | undefined = options.length
    ? {
        autoOpen: pickerRaw.autoOpen === true,
        title: text(pickerRaw.title),
        subtitle: text(pickerRaw.subtitle),
        allLabel: text(pickerRaw.allLabel),
        allHref: text(pickerRaw.allHref),
        options,
      }
    : undefined;

  return {
    id: text(doc._id).replace(/^drafts\./, '') || path,
    template: templateOf(doc.template),
    role: doc.role === 'detail' ? 'detail' : 'hub',
    slug: text(doc.slug) || path.split('/').filter(Boolean).at(-1) || '',
    path,
    title: text(doc.metaTitle) || text(doc.title),
    description: text(doc.metaDescription) || text(doc.description),
    nav: {
      calendarLabel: text(nav.calendarLabel) || LP_NAV_DEFAULTS.calendarLabel,
      whatsappLabel: text(nav.whatsappLabel) || LP_NAV_DEFAULTS.whatsappLabel,
      whatsappHref: text(nav.whatsappHref),
    },
    calendar: {
      title: text(calendar.title) || LP_CALENDAR_DEFAULTS.title,
      description: text(calendar.description) || LP_CALENDAR_DEFAULTS.description,
    },
    picker,
    sections: list(doc.sections).flatMap((section) => {
      const mapped = mapSection(section);
      return mapped ? [mapped] : [];
    }),
  };
}
