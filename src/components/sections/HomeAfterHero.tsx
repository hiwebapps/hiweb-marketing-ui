import { homePillarsWithIcons } from '../../data/webflow-home';
import type { SectionIntro, TitledBlock } from '../../lib/content/types';
import { PillarGrid } from './PillarGrid';
import { ServiceGrid, type GridCard } from './ServiceGrid';
import { TeamGrid } from './TeamGrid';

type HomeAfterHeroProps = {
  services: GridCard[];
  pillars?: TitledBlock[];
  pillarIntro?: SectionIntro;
  serviceIntro?: SectionIntro;
};

/**
 * Home body below the hero — HTML estático, motion via data-* attributes.
 * IndustryGrid is a client island in index.astro so the slider can hydrate.
 */
export function HomeAfterHero({
  services,
  pillars,
  pillarIntro,
  serviceIntro,
}: HomeAfterHeroProps) {
  return (
    <>
      <PillarGrid
        pillars={homePillarsWithIcons(pillars)}
        tone="canvas"
        eyebrow={pillarIntro?.eyebrow}
        title={pillarIntro?.title}
        description={pillarIntro?.description}
      />
      <ServiceGrid
        services={services}
        eyebrow={serviceIntro?.eyebrow}
        title={serviceIntro?.title}
        description={serviceIntro?.description}
      />
    </>
  );
}

export function HomeBelowFold() {
  return (
    <TeamGrid
      limit={4}
      ctaLabel="Conoce a todo el equipo"
      ctaHref="/nosotros#nosotros"
    />
  );
}
