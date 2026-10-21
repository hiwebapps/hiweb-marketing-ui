import { useRef, type CSSProperties } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION } from '../../lib/motion';
import { Button } from '../ui';
import { ServiceIcon } from '../icons/ServiceIcons';
import { SectionBand } from './primitives/SectionBand';
import { HeadingText, headingProps } from './primitives/heading';
import './ServiceWhy.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type WhyCard = {
  icon: string;
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

export function resolveWhyIcon(icon?: string, title?: string): string {
  if (
    icon &&
    [
      'chart',
      'report',
      'timer',
      'network',
      'globe',
      'video',
      'code',
      'palette',
      'chat',
      'cart',
      'shield',
      'search',
      'target',
      'users',
      'spark',
      'datosReales',
      'transparenciaReporte',
      'ajustesTiempo',
      'equipoIntegrado',
      'espanolIngles',
      'videoVertical',
      'codigoTecnico',
      'disenoIdentidad',
      'mensajesChat',
      'tiendaEcommerce',
      'seguridadEscudo',
      'busquedaIntencion',
      'objetivoConversion',
      'comunidadUsuarios',
      'inteligenciaArtificial',
    ].includes(icon)
  ) {
    return icon;
  }
  const cleanTitle = (title ?? '').toLowerCase().trim();
  if (cleanTitle.includes('video') || cleanTitle.includes('reels') || cleanTitle.includes('tiktok')) return 'video';
  if (cleanTitle.includes('código') || cleanTitle.includes('codigo') || cleanTitle.includes('code') || cleanTitle.includes('técnic') || cleanTitle.includes('tecnic') || cleanTitle.includes('desarrollo') || cleanTitle.includes('arquitectura')) return 'code';
  if (cleanTitle.includes('diseño') || cleanTitle.includes('diseno') || cleanTitle.includes('design') || cleanTitle.includes('brand') || cleanTitle.includes('visual')) return 'palette';
  if (cleanTitle.includes('mensaje') || cleanTitle.includes('chat') || cleanTitle.includes('whatsapp') || cleanTitle.includes('conversaci')) return 'chat';
  if (cleanTitle.includes('tienda') || cleanTitle.includes('store') || cleanTitle.includes('carrito') || cleanTitle.includes('cart') || cleanTitle.includes('compra') || cleanTitle.includes('checkout') || cleanTitle.includes('ecommerce')) return 'cart';
  if (cleanTitle.includes('seguridad') || cleanTitle.includes('security') || cleanTitle.includes('respaldo') || cleanTitle.includes('backup') || cleanTitle.includes('protocolo')) return 'shield';
  if (cleanTitle.includes('búsqueda') || cleanTitle.includes('busqueda') || cleanTitle.includes('search') || cleanTitle.includes('palabra') || cleanTitle.includes('keyword')) return 'search';
  if (cleanTitle.includes('objetivo') || cleanTitle.includes('target') || cleanTitle.includes('retorno') || cleanTitle.includes('roi') || cleanTitle.includes('adquisición') || cleanTitle.includes('adquisicion') || cleanTitle.includes('costo')) return 'target';
  if (cleanTitle.includes('comunidad') || cleanTitle.includes('community') || cleanTitle.includes('usuario') || cleanTitle.includes('equipo') || cleanTitle.includes('team') || cleanTitle.includes('vendedor')) return 'users';
  if (cleanTitle.includes('ia') || cleanTitle.includes('inteligencia') || cleanTitle.includes('ai') || cleanTitle.includes('spark')) return 'spark';
  if (cleanTitle.includes('dato') || cleanTitle.includes('data') || cleanTitle.includes('métrica') || cleanTitle.includes('metrica')) return 'chart';
  if (cleanTitle.includes('transparencia') || cleanTitle.includes('report') || cleanTitle.includes('informe')) return 'report';
  if (cleanTitle.includes('ajuste') || cleanTitle.includes('tiempo') || cleanTitle.includes('time') || cleanTitle.includes('velocidad') || cleanTitle.includes('horario')) return 'timer';
  if (cleanTitle.includes('inglés') || cleanTitle.includes('ingles') || cleanTitle.includes('español') || cleanTitle.includes('english') || cleanTitle.includes('bilingual') || cleanTitle.includes('binacional') || cleanTitle.includes('internacional')) return 'globe';
  return icon || 'chart';
}

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
  stats?: WhyStat[];
  headingWidth?: string;
};

export function ServiceWhy({
  tone = 'canvas',
  title = '¿Por qué elegir a Hiweb como tu Agencia de SEO en México?',
  description = 'No somos solo proveedores; somos tu partner estratégico en el crecimiento digital.',
  ctaLabel = 'Agenda un diagnóstico',
  ctaHref = '/contacto',
  cards,
  stats,
  headingWidth,
}: ServiceWhyProps) {
  const width = headingProps(headingWidth);
  const rootRef = useRef<HTMLDivElement>(null);
  const source = (cards?.length ? cards : CARDS).map((card) => ({
    ...card,
    accent: ACCENT_HEX[card.accent] ?? card.accent,
  }));

  // Distribute cards into two independent columns with offset ordering
  // so that adjacent cards in the same row are NEVER identical.
  const colLeft = source.filter((_, i) => i % 2 === 0);
  const rawRight = source.filter((_, i) => i % 2 === 1);
  const colRight = rawRight.length > 1 ? [...rawRight.slice(1), rawRight[0]] : rawRight;

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
        <div
          className={['service-why__copy', width.className].filter(Boolean).join(' ')}
          style={width.style}
          data-heading-width={width['data-heading-width']}
        >
          <h2 className="service-why__title">
            <HeadingText text={title} />
          </h2>
          <p className="service-why__lead">{description}</p>
          <Button href={ctaHref} variant="primary" size="md">
            {ctaLabel}
          </Button>
          <ul className="service-why__stats">
            {(stats ?? STATS).map((stat) => (
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
            <div className="service-why__grid">
              {/* Left Column */}
              <div className="service-why__col service-why__col--left">
                <div className="service-why__group">
                  {colLeft.map((card, index) => (
                    <div
                      key={`left-a-${card.title}-${index}`}
                      className="service-why__card"
                      style={{ '--why-accent': card.accent } as CSSProperties}
                    >
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                      <span className="service-why__mark" aria-hidden="true">
                        <ServiceIcon name={resolveWhyIcon(card.icon, card.title)} />
                      </span>
                    </div>
                  ))}
                </div>
                <div className="service-why__group" aria-hidden="true">
                  {colLeft.map((card, index) => (
                    <div
                      key={`left-b-${card.title}-${index}`}
                      className="service-why__card"
                      style={{ '--why-accent': card.accent } as CSSProperties}
                    >
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                      <span className="service-why__mark" aria-hidden="true">
                        <ServiceIcon name={resolveWhyIcon(card.icon, card.title)} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column */}
              <div className="service-why__col service-why__col--right">
                <div className="service-why__group">
                  {colRight.map((card, index) => (
                    <div
                      key={`right-a-${card.title}-${index}`}
                      className="service-why__card"
                      style={{ '--why-accent': card.accent } as CSSProperties}
                    >
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                      <span className="service-why__mark" aria-hidden="true">
                        <ServiceIcon name={resolveWhyIcon(card.icon, card.title)} />
                      </span>
                    </div>
                  ))}
                </div>
                <div className="service-why__group" aria-hidden="true">
                  {colRight.map((card, index) => (
                    <div
                      key={`right-b-${card.title}-${index}`}
                      className="service-why__card"
                      style={{ '--why-accent': card.accent } as CSSProperties}
                    >
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                      <span className="service-why__mark" aria-hidden="true">
                        <ServiceIcon name={resolveWhyIcon(card.icon, card.title)} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionBand>
  );
}
