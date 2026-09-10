import { Button } from '../ui';
import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';

type Model = {
  name: string;
  fit: string;
  description: string;
  cta: string;
  href: string;
  featured?: boolean;
};

const DEFAULT_MODELS: Model[] = [
  {
    name: 'Sprint de sistema',
    fit: 'Mejor para validar en 4–6 semanas',
    description:
      'Diagnóstico + mensaje + una superficie (landing o campaña). Ideal antes de un retainer.',
    cta: 'Agendar llamada',
    href: '/contacto',
  },
  {
    name: 'Retainer de growth',
    fit: 'Mejor para equipos con pipeline activo',
    description:
      'Mensaje, paid y web en ciclos cortos. Board compartido y métricas acordadas.',
    cta: 'Agendar llamada',
    href: '/contacto',
    featured: true,
  },
  {
    name: 'Proyectos desde',
    fit: 'Señal de fit · sin pricing teatro',
    description:
      'Engagements desde un mínimo claro para calificar conversaciones. Te lo compartimos en la llamada.',
    cta: 'Hablar de scope',
    href: '/contacto',
  },
];

type FitSignalProps = {
  models?: Model[];
};

/**
 * 05b · Fit / engagement — califica leads sin página de pricing completa.
 */
export function FitSignal({ models = DEFAULT_MODELS }: FitSignalProps) {
  return (
    <SectionBand id="engagement" tone="canvas">
      <SectionHeader
        eyebrow="Engagement"
        title="Elige el nivel de soporte que necesitas ahora"
        description="Mismo sistema Hiweb — distinta profundidad. El CTA es uno: agendar y decidir juntos."
      />

      <ul className="mt-12 grid gap-4 md:grid-cols-3">
        {models.map((model) => (
          <li
            key={model.name}
            className={[
              'flex flex-col rounded-2xl border p-6',
              model.featured
                ? 'border-ink bg-ink text-canvas'
                : 'border-border bg-surface text-ink',
            ].join(' ')}
          >
            <p
              className={[
                'font-display text-[11px] font-medium tracking-[0.14em] uppercase',
                model.featured ? 'text-canvas/50' : 'text-muted',
              ].join(' ')}
            >
              {model.fit}
            </p>
            <h3
              className={[
                'mt-3 font-display text-xl font-semibold tracking-tight',
                model.featured ? 'text-canvas' : 'text-ink',
              ].join(' ')}
            >
              {model.name}
            </h3>
            <p
              className={[
                'mt-3 flex-1 !text-sm !leading-relaxed',
                model.featured ? 'text-canvas/65' : 'text-ink-soft',
              ].join(' ')}
            >
              {model.description}
            </p>
            <div className="mt-6">
              <a href={model.href} className="no-underline">
                <Button
                  variant={model.featured ? 'secondary' : 'primary'}
                  className={
                    model.featured
                      ? 'border-canvas/20 bg-canvas text-ink hover:bg-canvas/90'
                      : undefined
                  }
                >
                  {model.cta}
                </Button>
              </a>
            </div>
          </li>
        ))}
      </ul>
    </SectionBand>
  );
}
