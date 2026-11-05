export const LP_TEMPLATE_TYPES = {
  general: [
    'lpHero',
    'logoMarquee',
    'roiCalculator',
    'statement',
    'serviceSystem',
    'lpIndustryCards',
    'pillarGrid',
    'lpPortal',
    'ctaBand',
    'metricsBand',
    'lpCaseCards',
    'processPhases',
    'teamGrid',
    'faqSection',
    'finalCta',
  ],
  servicios: [
    'lpHero',
    'logoMarquee',
    'roiCalculator',
    'serviceSystem',
    'pillarGrid',
    'lpPortal',
    'ctaBand',
    'metricsBand',
    'lpCaseCards',
    'processPhases',
    'teamGrid',
    'faqSection',
    'finalCta',
  ],
  industrias: [
    'lpHero',
    'logoMarquee',
    'roiCalculator',
    'lpIndustryCards',
    'serviceSystem',
    'pillarGrid',
    'lpPortal',
    'ctaBand',
    'metricsBand',
    'lpCaseCards',
    'processPhases',
    'teamGrid',
    'faqSection',
    'finalCta',
  ],
} as const;

export type LpTemplateKind = keyof typeof LP_TEMPLATE_TYPES;

export function makeLpBlock(type: string) {
  return {
    _key: type,
    _type: type,
    title: '',
  };
}

export function lpTemplateSections(kind: LpTemplateKind) {
  return LP_TEMPLATE_TYPES[kind].map((type) => makeLpBlock(type));
}
