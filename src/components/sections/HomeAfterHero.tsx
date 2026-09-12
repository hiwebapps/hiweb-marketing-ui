import { HOME_FAQS, HOME_PILLARS, PROCESS_PHASES } from '../../data/site';
import { AboutTeaser } from './AboutTeaser';
import { FaqSection } from './FaqSection';
import { PillarGrid } from './PillarGrid';
import { ProcessPhases } from './ProcessPhases';
import { ServiceGrid, type GridCard } from './ServiceGrid';

type HomeAfterHeroProps = {
  services: GridCard[];
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

export function HomeBelowFold() {
  return (
    <>
      <ProcessPhases phases={[...PROCESS_PHASES]} tone="canvas" />
      <AboutTeaser />
      <FaqSection items={[...HOME_FAQS]} />
    </>
  );
}
