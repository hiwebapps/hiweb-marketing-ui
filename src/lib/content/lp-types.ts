import type { FaqItem, Metric, ProcessPhase } from './types';
import type { CaseItem } from '../../components/sections/CasePreview';
import type { IndustryCard } from '../../components/sections/IndustryGrid';
import type { Pillar } from '../../components/sections/PillarGrid';
import type { TeamMember } from '../../components/sections/TeamGrid';

export type LpTemplate = 'general' | 'servicios' | 'industrias';
export type LpRole = 'hub' | 'detail';

export type LpNav = {
  ctaLabel: string;
  badge?: string;
  whatsappHref: string;
  whatsappLabel: string;
};

export type LpPickerOption = {
  slug: string;
  title: string;
  description: string;
  href: string;
};

export type LpPicker = {
  title: string;
  subtitle: string;
  allLabel: string;
  allHref: string;
  barPrefix: string;
  options: LpPickerOption[];
};

export type LpServiceLink = {
  slug: string;
  name: string;
  short: string;
  href: string;
};

export type LpSectionBase = {
  hidden?: boolean;
  headingWidth?: string;
};

export type LpHeroSection = LpSectionBase & {
  _type: 'lpHero';
  eyebrow: string;
  title: string;
  description: string;
  trust?: string;
  avatars?: string[];
  primaryLabel: string;
  secondaryLabel: string;
  whatsappHref: string;
  landingName: string;
  interests: string[];
};

export type LpLogo = { src: string; alt: string };

export type LpLogoMarqueeSection = LpSectionBase & {
  _type: 'logoMarquee';
  label: string;
  logos: LpLogo[];
};

export type LpRoiIndustry = {
  slug: string;
  name: string;
  cpl: number;
  close: number;
  ticket: number;
  margin: number;
};

export type LpRoiSection = LpSectionBase & {
  _type: 'roiCalculator';
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  preset?: string;
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
  description: string;
  services: LpServiceLink[];
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
  coreLabel: string;
  foot: string;
  ctaLabel: string;
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
  cases: CaseItem[];
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
  picker?: LpPicker;
  /** Label in the “Estás viendo” bar. */
  watching?: string;
  interests: string[];
  sections: LpSection[];
};
