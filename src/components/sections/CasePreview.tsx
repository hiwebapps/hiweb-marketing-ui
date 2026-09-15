import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';

export type CaseItem = {
  client: string;
  industry: string;
  outcome: string;
  title: string;
  summary: string;
  href?: string;
  accent?: 'cyan' | 'orange' | 'purple';
};

const DEFAULT_CASES: CaseItem[] = [
  {
    client: 'Pulse',
    industry: 'Software (SaaS)',
    outcome: '+184% demos calificadas',
    title: 'Cómo Pulse alineó oferta y paid para llenar el calendario de ventas',
    summary:
      'Reescribimos mensaje, landing y campañas. El equipo dejó de perseguir MQLs vacíos.',
    href: '/portafolio/pulse',
    accent: 'cyan',
  },
  {
    client: 'Norte Industrial',
    industry: 'Manufactura',
    outcome: '3.4× RFQs calificadas',
    title: 'De feria anual a pipeline continuo para Norte Industrial',
    summary: 'SEO técnico, search y una web que traduce specs a una oferta que el comité entiende.',
    href: '/portafolio/norte-industrial',
    accent: 'orange',
  },
  {
    client: 'Marina Bay',
    industry: 'Turismo / Hotelería',
    outcome: '+22% reserva directa',
    title: 'Marina Bay bajó dependencia de OTAs sin apagar ocupación',
    summary: 'SEO + paid hacia un booking path más rápido.',
    href: '/portafolio/marina-bay',
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
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: 'canvas' | 'surface';
};

export function CaseCard({ item }: { item: CaseItem }) {
  return (
    <a href={item.href ?? '/portafolio'} className="group flex h-full flex-col no-underline">
      <div className="overflow-hidden rounded-2xl border border-border bg-canvas">
        <div
          className={['relative flex h-36 items-end p-4', accentBar[item.accent ?? 'cyan']].join(
            ' ',
          )}
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
          <p className="mt-2 !text-sm !leading-relaxed text-ink-soft">{item.summary}</p>
          <p className="mt-4 font-display text-xs font-medium tracking-wide text-ink">
            Ver caso →
          </p>
        </div>
      </div>
    </a>
  );
}

export function CasePreview({
  cases = DEFAULT_CASES,
  eyebrow = 'Casos',
  title = 'Resultados propios, solo con empresas consolidadas',
  description = 'Cliente, industria y outcome. Sin portfolio ornamental.',
  tone = 'canvas',
}: CasePreviewProps) {
  return (
    <SectionBand id="casos" tone={tone}>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        badgeVariant="lime"
        actions={
          <a
            href="/portafolio"
            className="font-display text-sm font-semibold tracking-wide text-ink no-underline"
          >
            Ver portafolio →
          </a>
        }
      />
      <ul className="mt-12 grid gap-6 lg:grid-cols-3">
        {cases.map((item) => (
          <li key={item.client} data-reveal>
            <CaseCard item={item} />
          </li>
        ))}
      </ul>
    </SectionBand>
  );
}
