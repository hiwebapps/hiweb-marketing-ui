import { HOME_FAQS, HOME_PILLARS, PROCESS_PHASES } from '../../data/site';
import { AboutTeaser } from './AboutTeaser';
import { CasePreview, type CaseItem } from './CasePreview';
import { FaqSection } from './FaqSection';
import { IndustryGrid } from './IndustryGrid';
import { MetricsBand, type MetricItem } from './MetricsBand';
import { PillarGrid } from './PillarGrid';
import { ProcessPhases } from './ProcessPhases';
import { ServiceGrid, type GridCard } from './ServiceGrid';
import { SocialProof } from './SocialProof';

type HomeAfterHeroProps = {
  services: GridCard[];
  industries: GridCard[];
  cases: CaseItem[];
  metrics: MetricItem[];
};

/**
 * Home body below the hero — HTML estático, motion via data-* attributes.
 */
export function HomeAfterHero({
  services,
  industries,
  cases,
  metrics,
}: HomeAfterHeroProps) {
  return (
    <>
      <PillarGrid pillars={[...HOME_PILLARS]} />
      <ServiceGrid services={services} />
      <IndustryGrid industries={industries} tone="surface" />
      <CasePreview cases={cases} />
      <MetricsBand metrics={metrics} tone="surface" />
      <SocialProof />
      <ProcessPhases phases={[...PROCESS_PHASES]} tone="canvas" />
      <AboutTeaser />
      <FaqSection items={[...HOME_FAQS]} />
    </>
  );
}
