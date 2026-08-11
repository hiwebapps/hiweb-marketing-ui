import { CasePreview } from './CasePreview';
import { FinalCta } from './FinalCta';
import { SiteNav } from './SiteNav';
import { TrustStrip } from './TrustStrip';

/**
 * /work — case studies como página de evidencia.
 */
export function WorkPage() {
  return (
    <div className="min-h-dvh bg-canvas">
      <SiteNav />
      <main>
        <div className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <p className="font-display text-xs font-medium tracking-[0.2em] text-muted uppercase">
              Work
            </p>
            <h1 className="mt-4 !text-4xl !leading-[1.15] md:!text-6xl">
              Casos con outcome, no solo craft.
            </h1>
            <p className="mt-5 max-w-2xl !text-lg text-ink-soft">
              Cada caso: cliente, desafío y resultado medible. Es el contenido que más
              convierte en una agencia — por eso vive en la home y aquí.
            </p>
          </div>
        </div>
        <TrustStrip metricLabel="señal promedio reportada en engagements activos" />
        <CasePreview />
        <FinalCta
          title="¿Quieres un resultado parecido?"
          description="Agendamos un diagnóstico. Si no hay fit, te lo decimos en la misma llamada."
        />
      </main>
    </div>
  );
}
