import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';
import type { GridCard } from './ServiceGrid';

type IndustryGridProps = {
  industries: GridCard[];
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: 'canvas' | 'surface';
};

export function IndustryGrid({
  industries,
  eyebrow = 'Industrias',
  title = 'Hablamos el idioma de tu sector',
  description = 'Casos, retos y métricas propias de tu industria — no un playbook genérico.',
  tone = 'canvas',
}: IndustryGridProps) {
  return (
    <SectionBand id="industrias" tone={tone}>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <a
            href="/industrias"
            className="font-display text-sm font-semibold tracking-wide text-ink no-underline"
          >
            Ver industrias →
          </a>
        }
      />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((item) => (
          <li key={item.slug} data-reveal>
            <a
              href={`/industrias/${item.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 no-underline transition-colors hover:border-border-strong"
            >
              <h3 className="font-display text-xl font-semibold tracking-tight text-ink group-hover:text-ink-soft">
                {item.nombre}
              </h3>
              <p className="mt-2 flex-1 !text-sm !leading-relaxed">{item.tagline}</p>
              <p className="mt-4 font-display text-xs font-medium tracking-wide text-ink">
                Ver playbook →
              </p>
            </a>
          </li>
        ))}
      </ul>
    </SectionBand>
  );
}
