import type { LpImage, LpPage, LpSection } from '../../lib/content/lp-types';

/** Maps an image URL to a Sanity asset id. Returns null when the image has not been uploaded. */
export type AssetResolver = (src: string) => string | null;

type Key = () => string;

const SANITY_CDN = /^https:\/\/cdn\.sanity\.io\/images\/[^/]+\/[^/]+\/([a-f0-9]+)-(\d+x\d+)\.([a-z]+)/i;

/** Sanity CDN URLs already point at an asset, so they need no upload. */
export function sanityAssetId(src: string): string | null {
  const match = src.match(SANITY_CDN);
  return match ? `image-${match[1]}-${match[2]}-${match[3]}` : null;
}

function image(src: string, resolve: AssetResolver) {
  const ref = sanityAssetId(src) ?? resolve(src);
  return ref ? { _type: 'image', asset: { _type: 'reference', _ref: ref } } : null;
}

function images(items: LpImage[] | undefined, resolve: AssetResolver, key: Key) {
  return (items ?? []).flatMap((item) => {
    const value = image(item.src, resolve);
    return value ? [{ ...value, _key: key(), alt: item.alt }] : [];
  });
}

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

export function lpImageSources(pages: LpPage[]): string[] {
  const sources = new Set<string>();
  for (const page of pages) {
    for (const section of page.sections) {
      if (section._type === 'lpHero') section.avatars?.forEach((item) => sources.add(item.src));
      if (section._type === 'logoMarquee') section.logos.forEach((item) => sources.add(item.src));
      if (section._type === 'teamGrid') section.members.forEach((item) => item.photo && sources.add(item.photo));
    }
  }
  return [...sources].filter((src) => !sanityAssetId(src));
}

export function lpPageToSanity(page: LpPage, resolve: AssetResolver) {
  let count = 0;
  const key = () => {
    count += 1;
    return `k${count.toString(36)}`;
  };

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
      noindex: true,
      nav: page.nav,
      calendar: page.calendar,
      picker: page.picker,
      sections: page.sections.map((section) => toSection(section, key, resolve)),
    },
    key,
  );
}

function keyed(obj: Record<string, unknown>, key: Key): Record<string, unknown> {
  const next = { ...obj };
  for (const [name, value] of Object.entries(next)) {
    if (value === undefined) {
      delete next[name];
      continue;
    }
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

function toSection(section: LpSection, key: Key, resolve: AssetResolver): Record<string, unknown> {
  const _key = key();
  if (section._type === 'lpHero') {
    return { ...section, _key, avatars: images(section.avatars, resolve, key) };
  }
  if (section._type === 'logoMarquee') {
    return { ...section, _key, logos: images(section.logos, resolve, key) };
  }
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
      cardCtaLabel: section.cardCtaLabel,
      portfolioLabel: section.portfolioLabel,
      portfolioHref: section.portfolioHref,
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
      members: section.members.map((member) => {
        const photo = image(member.photo, resolve);
        return {
          _key: key(),
          name: member.name,
          role: member.role,
          bio: member.bio,
          category: member.category,
          ...(photo ? { photoImage: photo } : { photo: member.photo }),
        };
      }),
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
  return { ...section, _key };
}
