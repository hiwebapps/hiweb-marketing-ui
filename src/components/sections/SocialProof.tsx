import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';

type Quote = {
  quote: string;
  name: string;
  role: string;
  result?: string;
};

const DEFAULT_QUOTES: Quote[] = [
  {
    quote:
      'Nos ayudaron a aclarar una oferta compleja y convertirla en campañas que ventas sí podía usar. El pipeline dejó de depender de impulsos.',
    name: 'María López',
    role: 'CMO, Pulse',
    result: '+184% demos calificadas',
  },
  {
    quote:
      'La claridad del mensaje y de la web nos acortó las conversaciones exploratorias. Llegamos a propuesta más rápido.',
    name: 'Diego Rivas',
    role: 'Founder, Vertex',
    result: '−40% ciclo de venta',
  },
  {
    quote:
      'Ejecutan con ritmo de sprint y criterio de marca. El paid y la landing dicen lo mismo — raro encontrar ambas cosas juntas.',
    name: 'Ana Torres',
    role: 'Head of Growth, Campo',
    result: '2.4× ROAS en 60 días',
  },
];

type SocialProofProps = {
  quotes?: Quote[];
};

/**
 * 05 · Social proof — quotes con patrón problema → resultado.
 */
export function SocialProof({ quotes = DEFAULT_QUOTES }: SocialProofProps) {
  return (
    <SectionBand id="prueba" tone="surface">
      <SectionHeader
        eyebrow="Prueba social"
        title="Lo que dicen cuando el resultado es el tema"
        description="Quotes ancladas a un outcome — no a “gran equipo”."
        badgeVariant="lime"
      />

      <ul className="mt-12 grid gap-4 md:grid-cols-3">
        {quotes.map((item) => (
          <li
            key={item.name}
            className="flex flex-col rounded-2xl border border-border bg-canvas p-6"
          >
            {item.result ? (
              <p className="font-display text-xs font-semibold tracking-wide text-ink">
                {item.result}
              </p>
            ) : null}
            <p className="mt-3 !text-base !leading-relaxed text-ink-soft">
              “{item.quote}”
            </p>
            <div className="mt-auto pt-6">
              <p className="font-display text-sm font-semibold text-ink">{item.name}</p>
              <p className="mt-0.5 !text-xs text-muted">{item.role}</p>
            </div>
          </li>
        ))}
      </ul>
    </SectionBand>
  );
}
