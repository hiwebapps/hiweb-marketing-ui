import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';

export type GridCard = {
  slug: string;
  nombre: string;
  tagline: string;
};

type ServiceGridProps = {
  services: GridCard[];
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: 'canvas' | 'surface';
};

export function ServiceGrid({
  services,
  eyebrow = 'Servicios',
  title = 'Nueve palancas, un solo sistema',
  description = 'Cada servicio se conecta a un resultado de negocio — no a una táctica aislada.',
  tone = 'surface',
}: ServiceGridProps) {
  return (
    <SectionBand id="servicios" tone={tone}>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <a
            href="/servicios"
            className="font-display text-sm font-semibold tracking-wide text-ink no-underline"
          >
            Ver catálogo →
          </a>
        }
      />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((item) => (
          <li key={item.slug} data-reveal>
            <a
              href={`/servicios/${item.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-border bg-canvas p-5 no-underline transition-colors hover:border-border-strong"
            >
              <h3 className="font-display text-lg font-semibold tracking-tight text-ink group-hover:text-ink-soft">
                {item.nombre}
              </h3>
              <p className="mt-2 flex-1 !text-sm !leading-relaxed">{item.tagline}</p>
              <p className="mt-4 font-display text-xs font-medium tracking-wide text-ink">
                Ver servicio →
              </p>
            </a>
          </li>
        ))}
      </ul>
    </SectionBand>
  );
}
