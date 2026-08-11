import { CasePreview } from './CasePreview';
import { FaqSection } from './FaqSection';
import { FinalCta } from './FinalCta';
import { FitSignal } from './FitSignal';
import { HeroSection } from './HeroSection';
import { HowItWorks } from './HowItWorks';
import { ProblemPov } from './ProblemPov';
import { SiteNav } from './SiteNav';
import { SocialProof } from './SocialProof';
import { TrustStrip } from './TrustStrip';
import {
  MockMessagePanel,
  MockPerformancePanel,
  MockWebPanel,
  ValueChapter,
} from './ValueChapter';

/**
 * Home — funnel de agencia + ritmo product-tool.
 * Hero → Trust → POV → Sistema Hiweb → Chapters → Cases → Proof → Fit → FAQ → CTA
 */
export function HomePage() {
  return (
    <div className="min-h-dvh bg-canvas">
      <SiteNav />
      <main>
        <HeroSection />
        <TrustStrip />
        <ProblemPov />
        <HowItWorks />

        <ValueChapter
          id="brand"
          index="01"
          eyebrow="Mensaje"
          title="Una oferta que se entiende en segundos"
          description="Posicionamiento, narrativa y prueba social alineados. Menos slides; más decisión."
          caption="Fig 01 · Mensaje"
          tone="canvas"
        >
          <MockMessagePanel />
        </ValueChapter>

        <ValueChapter
          id="performance"
          index="02"
          eyebrow="Performance"
          title="Paid con criterio de producto"
          description="Ciclos cortos, creatividades con hipótesis y lectura de señal — no presupuesto a ciegas."
          caption="Fig 02 · Performance"
          tone="surface"
          reverse
        >
          <MockPerformancePanel />
        </ValueChapter>

        <ValueChapter
          id="web"
          index="03"
          eyebrow="Producto web"
          title="La superficie donde convierte el sistema"
          description="Web y landing como extensión del mensaje: jerarquía clara, CTA negro, cero ornamento vacío."
          caption="Fig 03 · Web"
          tone="canvas"
        >
          <MockWebPanel />
        </ValueChapter>

        <CasePreview />
        <SocialProof />
        <FitSignal />
        <FaqSection />
        <FinalCta />
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
