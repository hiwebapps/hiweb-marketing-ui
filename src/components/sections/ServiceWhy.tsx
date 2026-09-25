import { useRef, type CSSProperties } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION } from '../../lib/motion';
import { Button } from '../ui';
import { ServiceIcon, type ServiceIconName } from '../icons/ServiceIcons';
import { SectionBand } from './primitives/SectionBand';
import './ServiceWhy.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type WhyCard = {
  icon: ServiceIconName;
  accent: string;
  title: string;
  description: string;
};

type WhyStat = {
  valor: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

const CARDS: WhyCard[] = [
  {
    icon: 'activity',
    accent: '#01e7ff',
    title: 'Enfoque en datos, no en suposiciones',
    description:
      'Utilizamos herramientas de vanguardia para analizar el comportamiento real de tus competidores y usuarios.',
  },
  {
    icon: 'badge',
    accent: '#fe621c',
    title: 'Transparencia total',
    description:
      'Recibirás informes claros sobre el progreso de tus keywords principales y el impacto real en tus conversiones.',
  },
  {
    icon: 'spark',
    accent: '#927afe',
    title: 'Adaptación constante',
    description:
      'En un mundo donde los algoritmos cambian semanalmente, nuestra agencia de SEO se mantiene a la vanguardia de las tendencias de 2026.',
  },
];

const STATS: WhyStat[] = [
  { valor: 10, prefix: '+', suffix: ' años', label: 'de experiencia' },
  { valor: 1, prefix: '+$', suffix: 'M USD', label: 'invertidos en ads' },
];

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function formatMetric(value: number, prefix: string, suffix: string) {
  return `${prefix}${Math.round(value)}${suffix}`;
}

const ACCENT_HEX: Record<string, string> = {
  purple: '#927afe',
  cyan: '#01e7ff',
  orange: '#fe621c',
  lime: '#dbe64c',
  green: '#74c465',
};

type ServiceWhyProps = {
  tone?: 'canvas' | 'surface';
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  cards?: WhyCard[];
};

export function ServiceWhy({
  tone = 'canvas',
  title = '¿Por qué elegir a Hiweb como tu Agencia de SEO en México?',
  description = 'No somos solo proveedores; somos tu partner estratégico en el crecimiento digital.',
  ctaLabel = 'Agenda un diagnóstico',
  ctaHref = '/contacto',
  cards,
}: ServiceWhyProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const source = (cards?.length ? cards : CARDS).map((card) => ({
    ...card,
    accent: ACCENT_HEX[card.accent] ?? card.accent,
  }));
  const half = [...source, source[0]];
  const loop = [...half, ...half];

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const values = gsap.utils.toArray<HTMLElement>('[data-why-value]', root);
      const reduced = prefersReducedMotion();

      values.forEach((el) => {
        const target = Number.parseFloat(el.dataset.whyTarget || '0');
        const prefix = el.dataset.whyPrefix ?? '';
        const suffix = el.dataset.whySuffix ?? '';

        if (reduced) {
          el.textContent = formatMetric(target, prefix, suffix);
          return;
        }

        el.textContent = formatMetric(0, prefix, suffix);
        const state = { val: 0 };
        gsap.to(state, {
          val: target,
          duration: MOTION.durationSlow + 0.35,
          ease: MOTION.ease,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
          onUpdate: () => {
            el.textContent = formatMetric(state.val, prefix, suffix);
          },
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <SectionBand id="por-que" tone={tone}>
      <div ref={rootRef} className="service-why">
        <div className="service-why__copy">
          <h2 className="service-why__title">{title}</h2>
          <p className="service-why__lead">{description}</p>
          <Button href={ctaHref} variant="primary" size="md">
            {ctaLabel}
          </Button>
          <ul className="service-why__stats">
            {STATS.map((stat) => (
              <li key={stat.label}>
                <p
                  className="service-why__stat-value"
                  data-why-value
                  data-why-target={stat.valor}
                  data-why-prefix={stat.prefix ?? ''}
                  data-why-suffix={stat.suffix ?? ''}
                >
                  {formatMetric(stat.valor, stat.prefix ?? '', stat.suffix ?? '')}
                </p>
                <p className="service-why__stat-label">{stat.label}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="service-why__stage" aria-hidden="false">
          <div className="service-why__viewport">
            <ul className="service-why__track">
              {loop.map((card, index) => (
                <li
                  key={`${card.title}-${index}`}
                  className="service-why__card"
                  style={{ '--why-accent': card.accent } as CSSProperties}
                  aria-hidden={index >= half.length}
                >
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <span className="service-why__mark" aria-hidden="true">
                    <ServiceIcon name={card.icon} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionBand>
  );
}
