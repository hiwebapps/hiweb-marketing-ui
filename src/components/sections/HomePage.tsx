import { HeroSection } from './HeroSection';
import { HomeAfterHero, HomeBelowFold } from './HomeAfterHero';

/**
 * Home ensamblada (para demos / client:only).
 * En index.astro preferimos HeroSection client:only + HomeAfterHero SSR.
 */
export function HomePage() {
  return (
    <div className="min-h-dvh bg-canvas">
      <main>
        <HeroSection />
        <HomeAfterHero services={[]} />
        <HomeBelowFold cases={[]} metrics={[]} />
      </main>
    </div>
  );
}
