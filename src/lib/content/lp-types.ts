import type { FaqItem, Metric, ProcessPhase } from './types';
import type { CaseIndexCard } from '../../components/sections/CasesIndex';
import type { IndustryCard } from '../../components/sections/IndustryGrid';
import type { Pillar } from '../../components/sections/PillarGrid';
import type { TeamMember } from '../../components/sections/TeamGrid';

export type LpTemplate = 'general' | 'servicios' | 'industrias';
export type LpRole = 'hub' | 'detail';

export type LpNav = {
  calendarLabel: string;
  whatsappLabel: string;
  whatsappHref: string;
};

export type LpCalendarCopy = {
  title: string;
  description: string;
};

export type LpPickerOption = {
  slug: string;
  title: string;
  description: string;
  href: string;
  /** Nombre de un icono de la navbar. */
  icon?: string;
};

export type LpPicker = {
  autoOpen: boolean;
  title: string;
  subtitle: string;
  allLabel: string;
  allHref: string;
  options: LpPickerOption[];
};

export type LpImage = { src: string; alt: string };

export type LpServiceLink = {
  slug: string;
  name: string;
  short: string;
  href: string;
};

export type LpServiceCard = LpServiceLink & {
  title?: string;
  icon?: string;
};

export type LpSectionBase = {
  hidden?: boolean;
  headingWidth?: string;
};

export type LpHeroSection = LpSectionBase & {
  _type: 'lpHero';
  title: string;
  description: string;
  trust?: string;
  avatars?: LpImage[];
  primaryLabel: string;
  secondaryLabel: string;
  whatsappHref: string;
  landingName: string;
  interests: string[];
  formMessageTab: string;
  formCallTab: string;
  formTitle: string;
  formSubtitle: string;
  formCountries: string[];
  formSizes: string[];
  formBudgets: string[];
};

export type LpLogo = LpImage;

export type LpLogoMarqueeSection = LpSectionBase & {
  _type: 'logoMarquee';
  label: string;
  logos: LpLogo[];
};

export type LpRoiIndustry = {
  slug: string;
  name: string;
  icon?: string;
  cpl: number;
  close: number;
  ticket: number;
  margin: number;
};

export type LpRoiInvestment = {
  initial: number;
  step: number;
  min: number;
  max: number;
};

export type LpRoiLabels = {
  industryLabel: string;
  investmentLabel: string;
  assumptionsLabel: string;
  assumptionsHint: string;
  resetLabel: string;
  cplLabel: string;
  closeLabel: string;
  ticketLabel: string;
  marginLabel: string;
  resultLabel: string;
  formula: string;
  negativeBadge: string;
  negativeHint: string;
  funnelInvestment: string;
  funnelLeads: string;
  funnelClients: string;
  funnelRevenue: string;
  funnelProfit: string;
  disclaimer: string;
  dockCta: string;
};

export type LpRoiSection = LpSectionBase &
  LpRoiLabels & {
    _type: 'roiCalculator';
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
    preset?: string;
    investment: LpRoiInvestment;
    industries: LpRoiIndustry[];
  };

export type LpStatementSection = LpSectionBase & {
  _type: 'statement';
  eyebrow: string;
  title: string;
  paragraphs: string[];
};

export type LpQuadrant = {
  title: string;
  icon?: string;
  services: LpServiceCard[];
};

export type LpCombo = {
  title: string;
  description: string;
  services: string[];
  ctaLabel: string;
};

export type LpServiceSystemSection = LpSectionBase & {
  _type: 'serviceSystem';
  eyebrow: string;
  title: string;
  description: string;
  quadrants: LpQuadrant[];
  ctaTitle: string;
  ctaText: string;
  combosTitle?: string;
  combos?: LpCombo[];
};

export type LpServiceFocusSection = LpSectionBase & {
  _type: 'lpServiceFocus';
  eyebrow: string;
  title: string;
  description: string;
  challenges?: { title: string; description: string }[];
  stepsTitle?: string;
  steps: string[];
  relatedTitle: string;
  relatedDescription?: string;
  related: LpServiceLink[];
  kpisLabel?: string;
  kpis?: string;
  foot: string;
  bundleLabel: string;
  bundle: string[];
};

export type LpCtaBandSection = LpSectionBase & {
  _type: 'ctaBand';
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  whatsappHref: string;
};

export type LpPillarSection = LpSectionBase & {
  _type: 'pillarGrid';
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: 'canvas' | 'surface';
  pillars: Pillar[];
};

export type LpIndustryGridSection = LpSectionBase & {
  _type: 'industryGrid';
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: 'canvas' | 'surface';
  ctaLabel?: string;
  hrefPrefix: string;
  industries: IndustryCard[];
};

export type LpPortalSection = LpSectionBase & {
  _type: 'lpPortal';
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export type LpMetricsSection = LpSectionBase & {
  _type: 'metricsBand';
  eyebrow?: string;
  title?: string;
  description?: string;
  metrics: Metric[];
};

export type LpCasePreviewSection = LpSectionBase & {
  _type: 'casePreview';
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: 'canvas' | 'surface';
  /** Case study slugs picked in Studio. Empty picks three that match the page. */
  caseSlugs: string[];
  cardCtaLabel?: string;
  portfolioLabel?: string;
  portfolioHref?: string;
  portfolio?: CaseIndexCard[];
};

export type LpProcessSection = LpSectionBase & {
  _type: 'processPhases';
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: 'canvas' | 'surface';
  phases: ProcessPhase[];
};

export type LpTeamSection = LpSectionBase & {
  _type: 'teamGrid';
  eyebrow?: string;
  title?: string;
  description?: string;
  layout?: 'grid' | 'slider';
  ctaLabel?: string;
  ctaHref?: string;
  members: TeamMember[];
};

export type LpFaqSection = LpSectionBase & {
  _type: 'faqSection';
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: 'canvas' | 'surface';
  items: FaqItem[];
};

export type LpFinalCtaSection = LpSectionBase & {
  _type: 'finalCta';
  badge?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  primaryOpensCalendar?: boolean;
  secondaryLabel?: string;
  secondaryHref?: string;
  anchorId?: string;
};

export type LpSection =
  | LpHeroSection
  | LpLogoMarqueeSection
  | LpRoiSection
  | LpStatementSection
  | LpServiceSystemSection
  | LpServiceFocusSection
  | LpCtaBandSection
  | LpPillarSection
  | LpIndustryGridSection
  | LpPortalSection
  | LpMetricsSection
  | LpCasePreviewSection
  | LpProcessSection
  | LpTeamSection
  | LpFaqSection
  | LpFinalCtaSection;

export type LpPage = {
  id: string;
  template: LpTemplate;
  role: LpRole;
  /** Last URL segment. Hubs use agencia, servicios or industrias. */
  slug: string;
  path: string;
  title: string;
  description: string;
  nav: LpNav;
  calendar: LpCalendarCopy;
  picker?: LpPicker;
  sections: LpSection[];
};
