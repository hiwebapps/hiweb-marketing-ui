import { Button } from '../ui';
import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';

type Step = {
  index: string;
  title: string;
  description: string;
};

const DEFAULT_STEPS: Step[] = [
  {
    index: '01',
    title: 'Diagnóstico',
    description:
      'Alineamos ICP, oferta y fricción actual. Un mapa accionable — sin decks eternos.',
  },
  {
    index: '02',
    title: 'Sistema',
    description:
      'Definimos mensaje, superficie digital y reglas de conversión. Un lenguaje coherente.',
  },
  {
    index: '03',
    title: 'Ejecución',
    description:
      'Lanzamos, medimos e iteramos en ciclos cortos. Performance con criterio de producto.',
  },
];

type HowItWorksProps = {
  steps?: Step[];
};

/**
 * 03 · Sistema Hiweb — proceso nombrado (baja ansiedad, 3 pasos).
 */
export function HowItWorks({ steps = DEFAULT_STEPS }: HowItWorksProps) {
  return (
    <SectionBand id="como-trabajamos" tone="surface">
      <SectionHeader
        eyebrow="Sistema Hiweb"
        title="De la duda al pipeline en tres pasos"
        description="Un framework con nombre: diagnóstico → sistema → ejecución. Mismo verbo de CTA en toda la página."
        actions={
          <>
            <a href="/contacto" className="no-underline">
              <Button variant="primary">Agendar llamada</Button>
            </a>
            <a href="#casos" className="no-underline">
              <Button variant="secondary">Ver casos</Button>
            </a>
          </>
        }
      />

      <ol className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <li
            key={step.index}
            className="rounded-2xl border border-border bg-canvas p-6"
          >
            <span className="font-display text-xs font-semibold tracking-[0.16em] text-muted tabular-nums">
              {step.index}
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink">
              {step.title}
            </h3>
            <p className="mt-3 !text-sm !leading-relaxed">{step.description}</p>
          </li>
        ))}
      </ol>
    </SectionBand>
  );
}
