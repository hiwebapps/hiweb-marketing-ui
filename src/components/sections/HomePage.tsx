import { PROCESS_PHASES } from '../../data/site';
import { HeroStudioA } from './HeroStudioA';
import { HomeAfterHero, HomeBelowFold } from './HomeAfterHero';
import { ProcessPhases } from './ProcessPhases';

/**
 * Home ensamblada (para demos / client:only).
 * En index.astro preferimos HeroStudioA client:only + HomeAfterHero SSR.
 */
export function HomePage() {
  return (
    <div className="min-h-dvh bg-canvas">
      <main>
        <HeroStudioA />
        <HomeAfterHero services={[]} />
        <ProcessPhases phases={[...PROCESS_PHASES]} tone="canvas" />
        <HomeBelowFold />
      </main>
    </div>
  );
}
