import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';

type Pillar = {
  title: string;
  description: string;
};

type PillarGridProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  pillars: Pillar[];
  tone?: 'canvas' | 'surface';
};

export function PillarGrid({
  eyebrow = 'Diferenciadores',
  title = 'Cuatro razones para no contratar una agencia genérica',
  description = 'Partner interno, idioma de industria, servicios atados a resultado y evidencia verificable.',
  pillars,
  tone = 'canvas',
}: PillarGridProps) {
  return (
    <SectionBand id="diferenciadores" tone={tone}>
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {pillars.map((pillar, index) => (
          <li
            key={pillar.title}
            data-reveal
            className="rounded-2xl border border-border bg-canvas p-6"
          >
            <span className="font-display text-[11px] font-semibold tracking-[0.16em] text-muted tabular-nums">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-ink">
              {pillar.title}
            </h3>
            <p className="mt-2 !text-sm !leading-relaxed">{pillar.description}</p>
          </li>
        ))}
      </ul>
    </SectionBand>
  );
}
