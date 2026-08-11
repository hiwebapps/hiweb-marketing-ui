import { CasePreview } from './CasePreview';
import { FaqSection } from './FaqSection';
import { FinalCta } from './FinalCta';
import { FitSignal } from './FitSignal';
import { HowItWorks } from './HowItWorks';
import { ProblemPov } from './ProblemPov';
import { SocialProof } from './SocialProof';
import { TrustStrip } from './TrustStrip';
import {
  MockMessagePanel,
  MockPerformancePanel,
  MockWebPanel,
  ValueChapter,
} from './ValueChapter';

/**
 * Home body below the hero (SSR-safe — no WebGL).
 */
export function HomeAfterHero() {
  return (
    <>
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
    </>
  );
}
