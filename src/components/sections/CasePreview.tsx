import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';

export type CaseItem = {
  client: string;
  industry: string;
  outcome: string;
  title: string;
  summary: string;
  href?: string;
  /** Color accent for mock visual */
  accent?: 'cyan' | 'orange' | 'purple';
};

const DEFAULT_CASES: CaseItem[] = [
  {
    client: 'Pulse',
    industry: 'SaaS B2B',
    outcome: '+184% demos calificadas',
    title: 'Cómo Pulse alineó oferta y paid para llenar el calendario de ventas',
    summary:
      'Reescribimos mensaje, landing y campañas LinkedIn. El equipo dejó de perseguir MQLs vacíos.',
    href: '/work',
    accent: 'cyan',
  },
  {
    client: 'Campo',
    industry: 'Retail / marca',
    outcome: '2.4× ROAS en 60 días',
    title: 'Performance con criterio de marca para Campo',
    summary:
      'Creatividades con hipótesis, tracking limpio y una web que cierra la misma promesa del anuncio.',
    href: '/work',
    accent: 'orange',
  },
  {
    client: 'Vertex',
    industry: 'Servicios profesionales',
    outcome: '−40% ciclo de venta',
    title: 'De brochure a sistema de decisión para Vertex',
    summary:
      'Posicionamiento, prueba social y CTA único. Menos reuniones exploratorias; más propuestas.',
    href: '/work',
    accent: 'purple',
  },
];

const accentBar: Record<NonNullable<CaseItem['accent']>, string> = {
  cyan: 'bg-accent-cyan/25',
  orange: 'bg-accent-orange/25',
  purple: 'bg-accent-purple/25',
};

type CasePreviewProps = {
  cases?: CaseItem[];
};

/**
 * 04 · Case preview — 2–3 featured con outcome en el título (contenido que más convierte).
 */
export function CasePreview({ cases = DEFAULT_CASES }: CasePreviewProps) {
  return (
    <SectionBand id="casos" tone="canvas">
      <SectionHeader
        eyebrow="Casos"
        title="Resultados que se pueden leer en una línea"
        description="Cliente, desafío y outcome. Sin portfolio ornamental — evidencia comercial."
      />

      <ul className="mt-12 grid gap-6 lg:grid-cols-3">
        {cases.map((item) => (
          <li key={item.client}>
            <a
              href={item.href ?? '/work'}
              className="group flex h-full flex-col no-underline"
            >
              <div className="overflow-hidden rounded-2xl border border-border bg-canvas">
                <div
                  className={[
                    'relative flex h-36 items-end p-4',
                    accentBar[item.accent ?? 'cyan'],
                  ].join(' ')}
                >
                  <span className="font-display text-[11px] font-semibold tracking-[0.14em] text-ink/70 uppercase">
                    {item.industry}
                  </span>
                </div>
                <div className="border-t border-border p-5">
                  <p className="font-display text-xs font-semibold tracking-wide text-ink">
                    {item.client}
                    <span className="text-muted"> · {item.outcome}</span>
                  </p>
                  <h3 className="mt-3 font-display text-lg font-semibold tracking-tight text-ink transition-colors group-hover:text-ink-soft">
                    {item.title}
                  </h3>
                  <p className="mt-2 !text-sm !leading-relaxed text-ink-soft">
                    {item.summary}
                  </p>
                  <p className="mt-4 font-display text-xs font-medium tracking-wide text-ink">
                    Ver caso →
                  </p>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </SectionBand>
  );
}
