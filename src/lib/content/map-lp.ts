import type { CaseItem } from '../../components/sections/CasePreview';
import type { TeamMember } from '../../components/sections/TeamGrid';
import type { FaqItem, Metric, ProcessPhase } from './types';
import type { LpPage, LpPicker, LpSection, LpTemplate } from './lp-types';

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

function mapSection(raw: Record<string, unknown>): LpSection | null {
  const type = text(raw._type);
  const hidden = raw.hidden === true;
  const headingWidth = text(raw.headingWidth) || undefined;
  const base = { hidden, headingWidth };

  if (type === 'lpHero') {
    return {
      ...base,
      _type: 'lpHero',
      eyebrow: text(raw.eyebrow),
      title: text(raw.title),
      description: text(raw.description),
      trust: text(raw.trust) || undefined,
      avatars: strings(raw.avatars),
      primaryLabel: text(raw.primaryLabel) || 'Agenda tu diagnóstico',
      secondaryLabel: text(raw.secondaryLabel) || 'Escríbenos por WhatsApp',
      whatsappHref: text(raw.whatsappHref),
      landingName: text(raw.landingName) || text(raw.title),
      interests: strings(raw.interests),
    };
  }

  if (type === 'logoMarquee') {
    return {
      ...base,
      _type: 'logoMarquee',
      label: text(raw.label),
      logos: list(raw.logos).map((logo) => ({ src: text(logo.src), alt: text(logo.alt) })).filter((logo) => logo.src),
    };
  }

  if (type === 'roiCalculator') {
    return {
      ...base,
      _type: 'roiCalculator',
      eyebrow: text(raw.eyebrow),
      title: text(raw.title),
      description: text(raw.description),
      ctaLabel: text(raw.ctaLabel),
      preset: text(raw.preset) || undefined,
      industries: list(raw.industries).map((item) => ({
        slug: text(item.slug),
        name: text(item.name),
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
        description: text(item.description),
        services: list(item.services).map((service) => ({
          slug: text(service.slug),
          name: text(service.name),
          short: text(service.short),
          href: text(service.href),
        })),
      })),
      coreLabel: text(raw.coreLabel),
      foot: text(raw.foot),
      ctaLabel: text(raw.ctaLabel),
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
      related: list(raw.related).map((service) => ({
        slug: text(service.slug),
        name: text(service.name),
        short: text(service.short),
        href: text(service.href),
      })),
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
    return {
      ...base,
      _type: 'pillarGrid',
      eyebrow: text(raw.eyebrow) || undefined,
      title: text(raw.title) || undefined,
      description: text(raw.description) || undefined,
      pillars: list(raw.pillars).map((item) => ({ title: text(item.title), description: text(item.description) })),
    };
  }

  if (type === 'lpIndustryCards') {
    return {
      ...base,
      _type: 'industryGrid',
      eyebrow: text(raw.eyebrow) || undefined,
      title: text(raw.title) || undefined,
      description: text(raw.description) || undefined,
      hrefPrefix: text(raw.hrefPrefix) || '/lp/industrias',
      industries: list(raw.industries).map((item) => ({
        slug: text(item.slug),
        nombre: text(item.nombre),
        tagline: text(item.tagline),
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
    };
  }

  if (type === 'metricsBand') {
    const metrics: Metric[] = list(raw.metrics).map((item) => ({
      valor: Number(item.valor) || 0,
      label: text(item.label),
      prefix: text(item.prefix) || undefined,
      suffix: text(item.suffix) || undefined,
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
    const cases: CaseItem[] = list(raw.cases).map((item) => ({
      client: text(item.client),
      industry: text(item.industry),
      outcome: text(item.outcome) || undefined,
      title: text(item.title),
      summary: text(item.summary),
      href: text(item.href) || undefined,
      accent: item.accent === 'orange' || item.accent === 'purple' ? item.accent : 'cyan',
    }));
    return {
      ...base,
      _type: 'casePreview',
      eyebrow: text(raw.eyebrow) || undefined,
      title: text(raw.title) || undefined,
      description: text(raw.description) || undefined,
      cases,
    };
  }

  if (type === 'processPhases') {
    const phases: ProcessPhase[] = list(raw.phases).map((item, index) => ({
      index: text(item.index) || String(index + 1).padStart(2, '0'),
      title: text(item.title),
      description: text(item.description),
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
      photo: text(item.photo),
      category: categoryOf(item.category),
    }));
    const cta = raw.cta && typeof raw.cta === 'object' ? (raw.cta as Record<string, unknown>) : undefined;
    return {
      ...base,
      _type: 'teamGrid',
      eyebrow: text(raw.eyebrow) || undefined,
      title: text(raw.title) || undefined,
      description: text(raw.description) || undefined,
      layout: raw.layout === 'grid' ? 'grid' : 'slider',
      ctaLabel: text(cta?.label) || undefined,
      ctaHref: text(cta?.href) || undefined,
      members,
    };
  }

  if (type === 'faqSection') {
    const items: FaqItem[] = list(raw.items)
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
    const primary = raw.primaryCta && typeof raw.primaryCta === 'object' ? (raw.primaryCta as Record<string, unknown>) : undefined;
    const secondary = raw.secondaryCta && typeof raw.secondaryCta === 'object' ? (raw.secondaryCta as Record<string, unknown>) : undefined;
    return {
      ...base,
      _type: 'finalCta',
      badge: text(raw.badge) || undefined,
      title: text(raw.title) || undefined,
      description: text(raw.description) || undefined,
      primaryLabel: text(primary?.label) || undefined,
      primaryHref: text(primary?.href) || undefined,
      primaryOpensCalendar: raw.primaryOpensCalendar === true,
      secondaryLabel: text(secondary?.label) || undefined,
      secondaryHref: text(secondary?.href) || undefined,
      anchorId: text(raw.anchorId) || undefined,
    };
  }

  return null;
}

export function mapLpDocument(doc: Record<string, unknown> | null): LpPage | null {
  if (!doc) return null;
  const path = text(doc.path);
  if (!path.startsWith('/lp/')) return null;
  const nav = doc.nav && typeof doc.nav === 'object' ? (doc.nav as Record<string, unknown>) : {};
  const pickerRaw = doc.picker && typeof doc.picker === 'object' ? (doc.picker as Record<string, unknown>) : null;
  const picker: LpPicker | undefined = pickerRaw
    ? {
        title: text(pickerRaw.title),
        subtitle: text(pickerRaw.subtitle),
        allLabel: text(pickerRaw.allLabel),
        allHref: text(pickerRaw.allHref),
        barPrefix: text(pickerRaw.barPrefix),
        options: list(pickerRaw.options).map((option) => ({
          slug: text(option.slug),
          title: text(option.title),
          description: text(option.description),
          href: text(option.href),
        })),
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
      ctaLabel: text(nav.ctaLabel) || 'Agenda tu diagnóstico',
      badge: text(nav.badge) || undefined,
      whatsappHref: text(nav.whatsappHref),
      whatsappLabel: text(nav.whatsappLabel) || 'WhatsApp',
    },
    picker,
    watching: text(doc.watching) || undefined,
    interests: strings(doc.interests),
    sections: list(doc.sections).flatMap((section) => {
      const mapped = mapSection(section);
      return mapped ? [mapped] : [];
    }),
  };
}
