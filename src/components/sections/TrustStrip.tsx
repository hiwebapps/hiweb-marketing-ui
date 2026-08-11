import { SectionBand } from './primitives/SectionBand';

const DEFAULT_LOGOS = [
  'Anáhuac',
  'Northstar',
  'Pulse',
  'Vertex',
  'Campo',
  'Orbit',
];

type TrustStripProps = {
  label?: string;
  logos?: string[];
  /** Métrica dura opcional bajo logos (patrón Kalungi/1212) */
  metric?: string;
  metricLabel?: string;
};

/**
 * 02 · Trust strip — logos + señal de outcome opcional.
 */
export function TrustStrip({
  label = 'Equipos que confían en Hiweb',
  logos = DEFAULT_LOGOS,
  metric = '3.2×',
  metricLabel = 'pipeline calificado promedio en los primeros 90 días',
}: TrustStripProps) {
  return (
    <SectionBand tone="canvas" dense>
      <div className="border-y border-border py-10">
        <p className="text-center font-display text-[11px] font-medium tracking-[0.18em] text-muted uppercase">
          {label}
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {logos.map((name) => (
            <li
              key={name}
              className="font-display text-lg font-semibold tracking-tight text-ink/35 md:text-xl"
            >
              {name}
            </li>
          ))}
        </ul>
        {metric && metricLabel ? (
          <p className="mx-auto mt-8 max-w-xl text-center !text-sm text-ink-soft">
            <span className="font-display font-semibold text-ink">{metric}</span>
            <span className="text-muted"> · {metricLabel}</span>
          </p>
        ) : null}
      </div>
    </SectionBand>
  );
}
