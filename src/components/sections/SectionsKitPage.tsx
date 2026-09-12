import { Badge, Button } from '../ui';
import { BackgroundMesh } from '../BackgroundMesh';
import {
  CaseStories,
  Eyebrow,
  FaqSection,
  FinalCta,
  FitSignal,
  HeroSection,
  HeroStudioA,
  HeroStudioB,
  HowItWorks,
  ProblemPov,
  ProductFrame,
  SectionBand,
  SectionHeader,
  SocialProof,
  TrustStrip,
  ValueChapter,
  MockMessagePanel,
} from './index';

const KIT = [
  { id: 'hero-studio-a', name: 'Hero Studio A', source: 'Coverflow 3D', role: 'Carrusel infinito, saturación y autoplay 3.5s' },
  { id: 'hero-studio-b', name: 'Hero Studio B', source: 'Split / mockups', role: 'Copy + browser/phones apilados con GSAP' },
  { id: 'hero', name: 'HeroSection', source: 'Laravel / Arcade', role: 'Shader + ICP + marquee 3D' },
  { id: 'trust', name: 'TrustStrip', source: 'Cal / Kalungi', role: 'Logos + métrica' },
  { id: 'pov', name: 'ProblemPov', source: 'B2B agency', role: 'Espejo del buyer' },
  { id: 'steps', name: 'HowItWorks', source: 'Sistema Hiweb', role: 'Framework nombrado 01–03' },
  { id: 'chapter', name: 'ValueChapter', source: 'Linear', role: '1 outcome + 1 evidencia UI' },
  { id: 'cases', name: 'CaseStories', source: 'Agencia', role: 'Slider de casos con foto, quote y métrica' },
  { id: 'proof', name: 'SocialProof', source: 'Raycast / Cal', role: 'Quotes con outcome' },
  { id: 'fit', name: 'FitSignal', source: 'Kalungi', role: 'Engagement / fit' },
  { id: 'faq', name: 'FaqSection', source: 'Cal', role: 'Objeciones ICP' },
  { id: 'cta', name: 'FinalCta', source: 'Cal + Linear', role: 'Cierre ink, una decisión' },
] as const;

/**
 * Catálogo del kit — primitives + secciones ensambladas.
 */
export function SectionsKitPage() {
  return (
    <div className="min-h-dvh bg-canvas">
      <BackgroundMesh />

      <main className="relative z-10 pt-28">
        <SectionBand>
          <div className="mb-4">
            <Badge>Sections Kit</Badge>
          </div>
          <Eyebrow index="00">Kit de secciones</Eyebrow>
          <h1 className="mt-3 !text-4xl md:!text-6xl">
            Funnel de agencia, UI de producto
          </h1>
          <p className="mt-4 max-w-2xl !text-lg">
            Primitives + bloques listos. Una sección = un trabajo mental. Evidencia =
            UI y cases con outcome — no ornamento.
          </p>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {KIT.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-border bg-surface p-4"
              >
                <a href={`#demo-${item.id}`} className="no-underline">
                  <p className="font-display text-sm font-semibold text-ink">{item.name}</p>
                  <p className="mt-1 !text-xs text-muted">{item.source}</p>
                  <p className="mt-2 !text-sm text-ink-soft">{item.role}</p>
                </a>
              </li>
            ))}
          </ul>
        </SectionBand>

        <SectionBand tone="surface" id="primitives">
          <SectionHeader
            eyebrow="Primitives"
            title="Piezas compartidas"
            description="SectionBand, Eyebrow, SectionHeader y ProductFrame — la gramática del kit."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-canvas p-6">
              <Eyebrow index="01">Ejemplo eyebrow</Eyebrow>
              <p className="mt-3 !text-sm">Taxonomía muted + tracking positivo.</p>
            </div>
            <ProductFrame caption="Fig · ProductFrame">
              <div className="bg-surface p-6 !text-sm text-ink-soft">
                Marco hairline para evidencia de producto.
              </div>
            </ProductFrame>
          </div>
        </SectionBand>

        <div id="demo-hero-studio-a" className="scroll-mt-28">
          <div className="border-y border-border bg-surface px-6 py-3">
            <p className="mx-auto max-w-6xl font-display text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
              Hero Studio A · Coverflow 3D
            </p>
          </div>
          <HeroStudioA />
        </div>

        <div id="demo-hero-studio-b" className="scroll-mt-28">
          <div className="border-y border-border bg-surface px-6 py-3">
            <p className="mx-auto max-w-6xl font-display text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
              Hero Studio B · Stack
            </p>
          </div>
          <HeroStudioB />
        </div>

        <div id="demo-hero">
          <HeroSection
            secondaryHref="/"
            secondaryLabel="Ir al home"
          />
        </div>

        <div id="demo-trust">
          <TrustStrip label="Trust strip demo" />
        </div>

        <div id="demo-pov">
          <ProblemPov />
        </div>

        <div id="demo-steps">
          <HowItWorks />
        </div>

        <div id="demo-chapter">
          <ValueChapter
            index="01"
            eyebrow="Value chapter"
            title="Un outcome. Una evidencia."
            description="Patrón Linear: el H2 es el resultado; el frame muestra el sistema."
            caption="Fig · Chapter"
            tone="surface"
          >
            <MockMessagePanel />
          </ValueChapter>
        </div>

        <div id="demo-cases">
          <CaseStories />
        </div>

        <div id="demo-proof">
          <SocialProof />
        </div>

        <div id="demo-fit">
          <FitSignal />
        </div>

        <div id="demo-faq">
          <FaqSection />
        </div>

        <div id="demo-cta">
          <FinalCta
            title="El kit está listo para componer páginas."
            description="Usa HomePage o monta secciones sueltas. Mismo verbo de CTA en todo el sitio."
            primaryLabel="Ver home"
            primaryHref="/"
            secondaryLabel="Contact"
            secondaryHref="/contacto"
          />
        </div>

        <SectionBand>
          <div className="flex flex-wrap gap-3">
            <a href="/" className="no-underline">
              <Button variant="primary">Abrir home ensamblada</Button>
            </a>
            <a href="/portafolio" className="no-underline">
              <Button variant="secondary">Portafolio</Button>
            </a>
            <a href="/design-system" className="no-underline">
              <Button variant="secondary">Design system</Button>
            </a>
          </div>
        </SectionBand>
      </main>
    </div>
  );
}
