import type { LpPage, LpSection } from '../../lib/content/lp-types';

function block(text: string, key: string) {
  return [
    {
      _type: 'block',
      _key: `${key}b`,
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: `${key}s`, text, marks: [] }],
    },
  ];
}

export function lpPageToSanity(page: LpPage) {
  let count = 0;
  const key = () => {
    count += 1;
    return `k${count.toString(36)}`;
  };

  const sections = page.sections.map((section) => toSection(section, key));

  return keyed(
    {
      _id: page.id,
      _type: 'lpPage',
      title: page.title,
      path: page.path,
      slug: page.slug,
      template: page.template,
      role: page.role,
      description: page.description,
      watching: page.watching,
      interests: page.interests,
      noindex: true,
      nav: page.nav,
      picker: page.picker,
      sections,
    },
    key,
  );
}

function keyed(obj: Record<string, unknown>, key: () => string): Record<string, unknown> {
  const next = { ...obj };
  for (const [name, value] of Object.entries(next)) {
    if (Array.isArray(value)) {
      next[name] = value.map((item) => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) return item;
        const record = item as Record<string, unknown>;
        return keyed({ ...record, _key: typeof record._key === 'string' ? record._key : key() }, key);
      });
      continue;
    }
    if (value && typeof value === 'object') next[name] = keyed(value as Record<string, unknown>, key);
  }
  return next;
}

function toSection(section: LpSection, key: () => string): Record<string, unknown> {
  const _key = key();
  if (section._type === 'industryGrid') {
    return { ...section, _type: 'lpIndustryCards', _key };
  }
  if (section._type === 'casePreview') {
    return {
      _type: 'lpCaseCards',
      _key,
      eyebrow: section.eyebrow,
      title: section.title,
      description: section.description,
      cases: section.cases.map((item) => ({ ...item, _key: key() })),
    };
  }
  if (section._type === 'faqSection') {
    return {
      _type: 'faqSection',
      _key,
      eyebrow: section.eyebrow,
      title: section.title,
      description: section.description,
      items: section.items.map((item) => ({
        _type: 'faqItem',
        _key: key(),
        question: item.question,
        answer: typeof item.answer === 'string' ? block(item.answer, key()) : item.answer,
      })),
    };
  }
  if (section._type === 'finalCta') {
    return {
      _type: 'finalCta',
      _key,
      badge: section.badge,
      title: section.title,
      description: section.description,
      primaryOpensCalendar: section.primaryOpensCalendar ?? false,
      anchorId: section.anchorId,
      primaryCta: section.primaryLabel
        ? { _type: 'cta', label: section.primaryLabel, href: section.primaryHref || '#calendario' }
        : undefined,
      secondaryCta:
        section.secondaryLabel && section.secondaryHref
          ? { _type: 'cta', label: section.secondaryLabel, href: section.secondaryHref }
          : undefined,
    };
  }
  if (section._type === 'teamGrid') {
    return {
      _type: 'teamGrid',
      _key,
      source: 'refs',
      layout: section.layout ?? 'slider',
      eyebrow: section.eyebrow,
      title: section.title,
      description: section.description,
      members: section.members.map((member) => ({ ...member, _key: key() })),
      cta:
        section.ctaLabel && section.ctaHref
          ? { _type: 'cta', label: section.ctaLabel, href: section.ctaHref }
          : undefined,
    };
  }
  if (section._type === 'processPhases') {
    return {
      ...section,
      _key,
      phases: section.phases.map((phase) => ({ _type: 'processStep', _key: key(), ...phase })),
    };
  }
  if (section._type === 'metricsBand') {
    return {
      ...section,
      _key,
      metrics: section.metrics.map((metric) => ({ _type: 'metric', _key: key(), ...metric })),
    };
  }
  if (section._type === 'pillarGrid') {
    return {
      ...section,
      _key,
      pillars: section.pillars.map((pillar) => ({ _key: key(), ...pillar })),
    };
  }
  return { ...section, _key };
}
