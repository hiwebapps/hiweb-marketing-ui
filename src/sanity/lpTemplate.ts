const TAIL = ['pillarGrid', 'lpPortal', 'metricsBand', 'lpCaseCards', 'processPhases', 'teamGrid', 'faqSection', 'finalCta'] as const;

export const LP_TEMPLATE_TYPES = {
  general: ['lpHero', 'logoMarquee', 'roiCalculator', 'statement', 'serviceSystem', 'lpIndustryCards', ...TAIL],
  servicios: ['lpHero', 'logoMarquee', 'roiCalculator', 'serviceSystem', ...TAIL],
  industrias: ['lpHero', 'logoMarquee', 'roiCalculator', 'lpIndustryCards', 'serviceSystem', ...TAIL],
} as const;

export type LpTemplateKind = keyof typeof LP_TEMPLATE_TYPES;

const LP_DETAIL_TYPES = ['lpHero', 'logoMarquee', 'roiCalculator', 'lpServiceFocus', ...TAIL] as const;

export function lpTemplateTypes(kind: LpTemplateKind, role?: string): readonly string[] {
  return role === 'detail' ? LP_DETAIL_TYPES : LP_TEMPLATE_TYPES[kind];
}

export function makeLpBlock(type: string) {
  return {
    _key: type,
    _type: type,
    title: '',
  };
}

export function lpTemplateSections(kind: LpTemplateKind, role?: string) {
  return lpTemplateTypes(kind, role).map((type) => makeLpBlock(type));
}
