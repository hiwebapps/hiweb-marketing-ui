import { HeroSection } from './HeroSection';
import { HomeAfterHero } from './HomeAfterHero';
import { SiteNav } from './SiteNav';

/**
 * Home ensamblada (para demos / client:only).
 * En index.astro preferimos HeroSection client:only + HomeAfterHero SSR.
 */
export function HomePage() {
  return (
    <div className="min-h-dvh bg-canvas">
      <SiteNav />
      <main>
        <HeroSection />
        <HomeAfterHero />
      </main>

      <footer className="border-t border-border bg-canvas">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-8">
          <p className="font-display text-sm font-semibold text-ink">Hiweb Marketing</p>
          <nav className="flex flex-wrap gap-4">
            <a href="/work" className="!text-xs font-medium text-ink-soft no-underline hover:text-ink">
              Work
            </a>
            <a href="/contact" className="!text-xs font-medium text-ink-soft no-underline hover:text-ink">
              Contact
            </a>
            <a href="/sections" className="!text-xs font-medium text-ink-soft no-underline hover:text-ink">
              Kit de secciones
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
