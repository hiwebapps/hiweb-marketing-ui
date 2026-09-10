import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';

export type MetricItem = {
  valor: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

type MetricsBandProps = {
  metrics: MetricItem[];
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: 'canvas' | 'surface' | 'ink';
};

export function MetricsBand({
  metrics,
  eyebrow = 'Cifras',
  title = 'Resultados consolidados, no recortes de Ads Manager',
  description = 'Métricas de negocio de cuentas consolidadas. Cada cifra tiene baseline.',
  tone = 'canvas',
}: MetricsBandProps) {
  const onInk = tone === 'ink';

  return (
    <SectionBand id="cifras" tone={tone}>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        tone={onInk ? 'on-ink' : 'default'}
      />
      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <li key={metric.label} data-reveal>
            <p
              className={[
                'font-display text-4xl font-semibold tracking-tight tabular-nums md:text-5xl',
                onInk ? 'text-canvas' : 'text-ink',
              ].join(' ')}
              data-counter={metric.valor}
              data-counter-prefix={metric.prefix ?? ''}
              data-counter-suffix={metric.suffix ?? ''}
              data-counter-decimals={String(metric.decimals ?? 0)}
            >
              {metric.prefix ?? ''}
              {metric.valor.toFixed(metric.decimals ?? 0)}
              {metric.suffix ?? ''}
            </p>
            <p className={['mt-2 !text-sm', onInk ? 'text-canvas/65' : 'text-muted'].join(' ')}>
              {metric.label}
            </p>
          </li>
        ))}
      </ul>
    </SectionBand>
  );
}
