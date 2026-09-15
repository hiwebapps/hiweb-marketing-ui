import { HOME_PILLARS } from '../../data/site';
import { PillarGrid } from './PillarGrid';
import { ServiceGrid, type GridCard } from './ServiceGrid';
import { TeamGrid } from './TeamGrid';

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
      <PillarGrid pillars={[...HOME_PILLARS]} tone="canvas" />
      <ServiceGrid services={services} />
    </>
  );
}

export function HomeBelowFold() {
  return <TeamGrid />;
}
