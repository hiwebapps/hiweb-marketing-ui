import { HOME_FAQS, HOME_PILLARS, PROCESS_PHASES } from '../../data/site';
import { AboutTeaser } from './AboutTeaser';
import { CasePreview, type CaseItem } from './CasePreview';
import { FaqSection } from './FaqSection';
import { MetricsBand, type MetricItem } from './MetricsBand';
import { PillarGrid } from './PillarGrid';
import { ProcessPhases } from './ProcessPhases';
import { ServiceGrid, type GridCard } from './ServiceGrid';
import { SocialProof } from './SocialProof';

type HomeAfterHeroProps = {
  services: GridCard[];
};

type HomeBelowFoldProps = {
  cases: CaseItem[];
  metrics: MetricItem[];
};

/**
 * Home body below the hero — HTML estático, motion via data-* attributes.
 * IndustryGrid is a client island in index.astro so the slider can hydrate.
 */
export function HomeAfterHero({ services }: HomeAfterHeroProps) {
  return (
    <>
      <PillarGrid pillars={[...HOME_PILLARS]} tone="wash" />
      <ServiceGrid services={services} />
    </>
  );
}

export function HomeBelowFold({ cases, metrics }: HomeBelowFoldProps) {
  return (
    <>
      <CasePreview cases={cases} />
      <MetricsBand metrics={metrics} tone="surface" />
      <SocialProof />
      <ProcessPhases phases={[...PROCESS_PHASES]} tone="canvas" />
      <AboutTeaser />
      <FaqSection items={[...HOME_FAQS]} />
    </>
  );
}
