import { Badge, Button } from '../ui';
import { BackgroundMesh } from '../BackgroundMesh';
import { homePillarsWithIcons, WEBFLOW_HOME, WEBFLOW_SERVICE_TAGLINES } from '../../data/webflow-home';
import { serviceFocusItems } from '../../data/service-focus';
import { servicePitch } from '../../data/service-pitch';
import { servicePlans } from '../../data/service-plans';
import {
  CasePreview,
  CaseStories,
  Eyebrow,
  FaqSection,
  FinalCta,
  FitSignal,
  HeroSection,
  HeroStudioA,
  HeroStudioB,
  HowItWorks,
  IndustryGrid,
  MetricsBand,
  PageHero,
  PillarGrid,
  ProblemPov,
  ProcessPhases,
  ProductFrame,
  SectionBand,
  SectionHeader,
  ServiceGrid,
  ServiceFocus,
  ServicePitch,
  ServiceWhy,
  ServicePlans,
  SocialProof,
  TeamGrid,
  TrustStrip,
  ValueChapter,
  MockMessagePanel,
} from './index';

const KIT = [
  { id: 'page-hero', name: 'Page hero', source: 'Interiores', role: 'Hero claro: eyebrow, H1 y lead' },
  { id: 'pillars', name: 'Pilares', source: 'Home', role: 'Grid de razones con icono y acento' },
  { id: 'services', name: 'Servicios', source: 'Home', role: 'Cards con foto, orden y tagline' },
  { id: 'service-focus', name: 'Frentes de servicio', source: 'Servicios', role: 'Tabs en escritorio y acordeón en móvil' },
  { id: 'service-pitch', name: 'Propuesta de servicio', source: 'Servicios', role: 'Imagen, badge, título, párrafo y CTA' },
  { id: 'service-why', name: 'Por qué Hiweb', source: 'SEO', role: 'Título, CTA, contadores y cards en loop' },
  { id: 'service-plans', name: 'Planes de servicio', source: 'SEO', role: 'Tres planes, precio y lista de incluye' },
  { id: 'industries', name: 'Industrias', source: 'Home', role: 'Grid arrastrable por sector' },
  { id: 'process', name: 'Proceso', source: 'Home', role: 'Fases 01–04 sobre una línea' },
  { id: 'metrics', name: 'Métricas', source: 'Home', role: 'Banda ink, numeral y dos CTAs' },
  { id: 'team', name: 'Equipo', source: 'Home', role: 'Cuatro caras y enlace a /nosotros' },
  { id: 'cases-real', name: 'Cards de caso', source: 'Portafolio', role: 'Cliente, industria y outcome real' },
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

const DEMO_SERVICES = ['seo', 'google-ads', 'meta-ads', 'desarrollo-web'].map((slug) => ({
  slug,
  nombre:
    slug === 'seo'
      ? 'SEO'
      : slug === 'google-ads'
        ? 'Google Ads'
        : slug === 'meta-ads'
          ? 'Meta Ads'
          : 'Desarrollo web',
  tagline: WEBFLOW_SERVICE_TAGLINES[slug],
}));

const DEMO_INDUSTRIES = [
  { slug: 'inmobiliarias', nombre: 'Inmobiliarias', tagline: 'Leads de inventario real, no de formularios vacíos.', puntos: ['Inventario', 'Leads'] },
  { slug: 'salud', nombre: 'Sector Salud', tagline: 'Demanda ética para clínicas y grupos médicos que cuidan reputación.', puntos: ['Reputación', 'Demanda'] },
  { slug: 'saas', nombre: 'Software (SaaS)', tagline: 'Demos calificadas para productos que ya no pueden improvisar el pipeline.', puntos: ['Demos', 'Pipeline'] },
  { slug: 'manufactura', nombre: 'Manufactura', tagline: 'Demanda calificada para plantas que ya no pueden depender del referido.', puntos: ['RFQs', 'Specs'] },
];

const DEMO_CASES = [
  {
    client: 'Avant Rent a Car',
    industry: 'Turismo',
    outcome: '+37,000 nuevos usuarios orgánicos',
    title: 'Más demanda orgánica sin depender solo de OTAs',
    summary: 'SEO y una web que convierte búsqueda en reserva.',
    href: '/portafolio/avant-rent-a-car',
    accent: 'cyan' as const,
  },
  {
    client: 'Diazar',
    industry: 'SaaS',
    outcome: '+2,100 usuarios únicos nuevos',
    title: 'Pipeline para un producto que ya no improvisa adquisición',
    summary: 'Mensaje, canales y medición alineados al mismo resultado.',
    href: '/portafolio/diazar',
    accent: 'purple' as const,
  },
  {
    client: 'Happy Store',
    industry: 'Retail',
    outcome: '+76,300 visualizaciones',
    title: 'Visibilidad que llega a tienda, no solo a alcance',
    summary: 'Contenido y pauta con un destino de conversión claro.',
    href: '/portafolio/happy-store',
    accent: 'orange' as const,
  },
];

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
          <h1 data-split className="mt-3 !text-4xl md:!text-6xl">
            Lo que ya arma el sitio
          </h1>
          <p className="mt-4 max-w-2xl !text-lg">
            Primero las secciones en producción: pilares, servicios, industrias, proceso,
            métricas y equipo. Debajo queda el kit anterior de funnel.
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

        <div id="demo-page-hero" className="scroll-mt-28">
          <PageHero
            eyebrow="Página interior"
            title="Hero claro para servicios, industrias y legal."
            description="Eyebrow, H1 y un lead. El hero oscuro con carrusel se queda en Home."
          />
        </div>

        <div id="demo-pillars" className="scroll-mt-28">
          <PillarGrid
            pillars={homePillarsWithIcons()}
            eyebrow={WEBFLOW_HOME.pillarIntro?.eyebrow}
            title={WEBFLOW_HOME.pillarIntro?.title}
            description={WEBFLOW_HOME.pillarIntro?.description}
          />
        </div>

        <div id="demo-services" className="scroll-mt-28">
          <ServiceGrid
            services={DEMO_SERVICES}
            eyebrow={WEBFLOW_HOME.serviceIntro?.eyebrow}
            title={WEBFLOW_HOME.serviceIntro?.title}
            description={WEBFLOW_HOME.serviceIntro?.description}
            tone="surface"
          />
        </div>

        <div id="demo-service-focus" className="scroll-mt-28">
          <ServiceFocus items={serviceFocusItems('seo')} tone="surface" />
        </div>

        <div id="demo-service-pitch" className="scroll-mt-28">
          {servicePitch('seo') ? <ServicePitch {...servicePitch('seo')!} tone="canvas" /> : null}
        </div>

        <div id="demo-service-why" className="scroll-mt-28">
          <ServiceWhy client:visible tone="canvas" />
        </div>

        <div id="demo-service-plans" className="scroll-mt-28">
          {servicePlans('seo') ? <ServicePlans {...servicePlans('seo')!} tone="canvas" /> : null}
        </div>

        <div id="demo-industries" className="scroll-mt-28">
          <IndustryGrid
            industries={DEMO_INDUSTRIES}
            eyebrow="Industrias"
            title="Hablamos el idioma de tu sector"
            description="Casos, retos y métricas propias de tu industria — no un playbook genérico."
          />
        </div>

        <div id="demo-process" className="scroll-mt-28">
          <ProcessPhases
            phases={WEBFLOW_HOME.process ?? []}
            eyebrow={WEBFLOW_HOME.processIntro?.eyebrow}
            title={WEBFLOW_HOME.processIntro?.title}
            description={WEBFLOW_HOME.processIntro?.description}
            tone="surface"
          />
        </div>

        <div id="demo-metrics" className="scroll-mt-28">
          <MetricsBand
            metrics={(WEBFLOW_HOME.metrics ?? []).map((item) => ({
              valor: item.valor,
              label: item.label,
              prefix: item.prefix,
              suffix: item.suffix,
              decimals: item.decimals,
            }))}
            eyebrow={WEBFLOW_HOME.metricsIntro?.eyebrow}
            title={WEBFLOW_HOME.metricsIntro?.title}
            titleMuted={WEBFLOW_HOME.metricsIntro?.titleMuted}
            description={WEBFLOW_HOME.metricsIntro?.description}
          />
        </div>

        <div id="demo-team" className="scroll-mt-28">
          <TeamGrid limit={4} ctaHref="/nosotros#nosotros" />
        </div>

        <div id="demo-cases-real" className="scroll-mt-28">
          <CasePreview
            cases={DEMO_CASES}
            eyebrow="Portafolio"
            title="Casos reales, con outcome"
            description="Las cards de índice apuntan a Avant, Diazar y Happy Store."
            tone="surface"
          />
        </div>

        <div id="demo-hero-studio-a" className="scroll-mt-28">
          <div className="border-y border-border bg-surface px-6 py-3">
            <p className="mx-auto max-w-[var(--section-max)] font-display text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
              Hero Studio A · Coverflow 3D
            </p>
          </div>
          <HeroStudioA />
        </div>

        <div id="demo-hero-studio-b" className="scroll-mt-28">
          <div className="border-y border-border bg-surface px-6 py-3">
            <p className="mx-auto max-w-[var(--section-max)] font-display text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
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
