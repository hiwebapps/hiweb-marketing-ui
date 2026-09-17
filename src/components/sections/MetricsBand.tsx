import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION } from '../../lib/motion';
import { Badge, Button } from '../ui';
import { SectionBand } from './primitives/SectionBand';
import './MetricsBand.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type MetricItem = {
  valor: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  detail?: string;
};

type MetricsBandProps = {
  metrics: MetricItem[];
  eyebrow?: string;
  title?: string;
  titleMuted?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function formatMetric(value: number, decimals: number, prefix: string, suffix: string) {
  return `${prefix}${value.toFixed(decimals)}${suffix}`;
}

/**
 * Ink metrics band — design-system Badge/Button + GSAP counter-up on enter.
 */
export function MetricsBand({
  metrics,
  eyebrow = 'Cifras',
  title = 'Antes y después',
  titleMuted = 'en cifras verificables',
  description = 'Métricas de negocio de cuentas consolidadas. Cada cifra tiene baseline.',
  primaryLabel = 'Agenda tu auditoría',
  primaryHref = '/contacto',
  secondaryLabel = 'Ver más casos',
  secondaryHref = '/portafolio',
}: MetricsBandProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const values = gsap.utils.toArray<HTMLElement>('[data-metric-value]', root);
      if (!values.length) return;

      const reduced = prefersReducedMotion();

      values.forEach((el) => {
        const target = Number.parseFloat(el.dataset.metricTarget || '0');
        const prefix = el.dataset.metricPrefix ?? '';
        const suffix = el.dataset.metricSuffix ?? '';
        const decimals = Number.parseInt(el.dataset.metricDecimals || '0', 10);

        if (reduced) {
          el.textContent = formatMetric(target, decimals, prefix, suffix);
          return;
        }

        el.textContent = formatMetric(0, decimals, prefix, suffix);
        const state = { val: 0 };

        gsap.to(state, {
          val: target,
          duration: MOTION.durationSlow + 0.35,
          ease: MOTION.ease,
          overwrite: true,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
          onUpdate: () => {
            el.textContent = formatMetric(state.val, decimals, prefix, suffix);
          },
        });
      });

      const items = gsap.utils.toArray<HTMLElement>('.metrics-band__item', root);
      if (reduced) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }

      gsap.from(items, {
        opacity: 0,
        y: MOTION.revealY,
        duration: MOTION.duration,
        ease: MOTION.ease,
        stagger: MOTION.stagger,
        scrollTrigger: {
          trigger: root.querySelector('.metrics-band__grid'),
          start: 'top 85%',
          once: true,
        },
      });
    },
    { scope: rootRef, dependencies: [metrics] },
  );

  return (
    <SectionBand id="cifras" tone="ink" className="metrics-band">
      <div ref={rootRef} className="metrics-band__inner">
        <div className="metrics-band__intro">
          <Badge variant="cyan" tone="on-ink">
            {eyebrow}
          </Badge>

          <h2 className="metrics-band__title">
            <span className="metrics-band__title-main">{title}</span>
            {titleMuted ? (
              <span className="metrics-band__title-muted">{titleMuted}</span>
            ) : null}
          </h2>

          {description ? <p className="metrics-band__lead">{description}</p> : null}

          <div className="metrics-band__actions">
            <Button href={primaryHref} variant="secondary" size="md" glow={false} className="no-underline">
              {primaryLabel}
            </Button>
            <Button
              href={secondaryHref}
              variant="outline"
              size="md"
              glow={false}
              className="metrics-band__btn-outline no-underline"
            >
              {secondaryLabel}
            </Button>
          </div>
        </div>

        <ul className="metrics-band__grid">
          {metrics.map((metric) => {
            const decimals = metric.decimals ?? 0;
            const prefix = metric.prefix ?? '';
            const suffix = metric.suffix ?? '';
            return (
              <li key={metric.label} className="metrics-band__item">
                <p className="metrics-band__label">{metric.label}</p>
                <p
                  className="metrics-band__value"
                  data-metric-value
                  data-metric-target={metric.valor}
                  data-metric-prefix={prefix}
                  data-metric-suffix={suffix}
                  data-metric-decimals={String(decimals)}
                >
                  {formatMetric(metric.valor, decimals, prefix, suffix)}
                </p>
                {metric.detail ? <p className="metrics-band__detail">{metric.detail}</p> : null}
              </li>
            );
          })}
        </ul>
      </div>
    </SectionBand>
  );
}
