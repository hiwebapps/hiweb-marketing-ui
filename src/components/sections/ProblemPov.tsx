import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';

type Pain = {
  title: string;
  description: string;
};

const DEFAULT_PAINS: Pain[] = [
  {
    title: 'Presupuesto sin señal',
    description: 'Se gasta en canales, pero nadie puede explicar qué mueve pipeline de verdad.',
  },
  {
    title: 'Oferta que no cierra',
    description: 'La web habla de features; el comprador busca un outcome y una siguiente acción.',
  },
  {
    title: 'Marca y performance desconectados',
    description: 'Creatividad por un lado, ads por otro: el mensaje se rompe en el click.',
  },
];

type ProblemPovProps = {
  title?: string;
  description?: string;
  pains?: Pain[];
};

/**
 * 02b · Problem / POV — espejo del monólogo del buyer (entre Trust y Steps).
 */
export function ProblemPov({
  title = 'El problema no es “más marketing”. Es falta de sistema.',
  description = 'Cuando el mensaje, la superficie digital y el paid no comparten la misma lógica, el equipo improvisa — y el pipeline se vuelve ruido.',
  pains = DEFAULT_PAINS,
}: ProblemPovProps) {
  return (
    <SectionBand id="problema" tone="canvas">
      <SectionHeader
        eyebrow="Punto de vista"
        title={title}
        description={description}
      />
      <ul className="mt-12 grid gap-8 md:grid-cols-3">
        {pains.map((pain) => (
          <li key={pain.title}>
            <h3 className="font-display text-base font-semibold tracking-tight text-ink">
              {pain.title}
            </h3>
            <p className="mt-2 !text-sm !leading-relaxed text-ink-soft">{pain.description}</p>
          </li>
        ))}
      </ul>
    </SectionBand>
  );
}
