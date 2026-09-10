import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';

export type ProcessPhase = {
  index: string;
  title: string;
  description: string;
};

type ProcessPhasesProps = {
  phases: ProcessPhase[];
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: 'canvas' | 'surface';
};

export function ProcessPhases({
  phases,
  eyebrow = 'Proceso',
  title = 'De la auditoría a la optimización',
  description = 'Cuatro fases. Un sistema. El mismo criterio de evidencia en cada ciclo.',
  tone = 'surface',
}: ProcessPhasesProps) {
  return (
    <SectionBand id="proceso" tone={tone}>
      <div data-chapters>
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {phases.map((phase) => (
            <li
              key={phase.index}
              data-chapter
              data-reveal
              className="rounded-2xl border border-border bg-canvas p-6"
            >
              <span className="font-display text-xs font-semibold tracking-[0.16em] text-muted tabular-nums">
                {phase.index}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink">
                {phase.title}
              </h3>
              <p className="mt-3 !text-sm !leading-relaxed">{phase.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </SectionBand>
  );
}
