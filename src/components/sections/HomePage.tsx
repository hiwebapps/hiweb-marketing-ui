import { HeroStudioA } from './HeroStudioA';
import { HomeAfterHero, HomeBelowFold } from './HomeAfterHero';

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
        <HomeBelowFold />
      </main>
    </div>
  );
}
