import type { CSSProperties } from 'react';
import { ServiceIcon, SERVICE_ICON_NAMES, type ServiceIconName } from '../icons/ServiceIcons';
import { Badge } from '../ui';
import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';
import './ServiceGrid.css';

export type GridCard = {
  slug: string;
  nombre: string;
  tagline: string;
};

type ServiceAccent = 'purple' | 'cyan' | 'orange' | 'green';

type ServiceGridProps = {
  services: GridCard[];
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: 'canvas' | 'surface';
  hrefPrefix?: string;
};

const ACCENT_HEX: Record<ServiceAccent, string> = {
  purple: '#927afe',
  cyan: '#01e7ff',
  orange: '#fe621c',
  green: '#74c465',
};

const ACCENTS: ServiceAccent[] = ['purple', 'cyan', 'orange', 'green'];

const SERVICE_VISUALS: Record<
  string,
  { image: string; icon: ServiceIconName }
> = {
  'redes-sociales': { image: '/images/services/redes-sociales.jpg', icon: 'video' },
  seo: { image: '/images/services/seo.jpg', icon: 'activity' },
  'meta-ads': { image: '/images/services/meta-ads.jpg', icon: 'users' },
  'google-ads': { image: '/images/services/google-ads.jpg', icon: 'target' },
  branding: { image: '/images/services/branding.jpg', icon: 'badge' },
  'crm-automatizacion': { image: '/images/services/crm-automatizacion.jpg', icon: 'box' },
  'community-manager': { image: '/images/services/community-manager.jpg', icon: 'focus' },
  'ia-marketing': { image: '/images/services/ia-marketing.jpg', icon: 'spark' },
  'desarrollo-web': { image: '/images/services/desarrollo-web.jpg', icon: 'code' },
};

function spanClass(index: number, total: number) {
  if (total === 1) return 'col-span-full';
  if (index === total - 1 && total % 2 === 1) return 'sm:col-span-2 lg:col-span-3';
  const pair = Math.floor(index / 2);
  const wideOnLeft = pair % 2 === 0;
  const isFirstOfPair = index % 2 === 0;
  const wide = wideOnLeft ? isFirstOfPair : !isFirstOfPair;
  return wide ? 'sm:col-span-2 lg:col-span-2' : 'sm:col-span-1';
}

export function ServiceGrid({
  services,
  eyebrow = 'Servicios',
  title = 'Nueve palancas, un solo sistema',
  description = 'Cada servicio se conecta a un resultado de negocio — no a una táctica aislada.',
  tone = 'canvas',
  hrefPrefix = '/servicios',
}: ServiceGridProps) {
  return (
    <SectionBand id="servicios" tone={tone}>
      <div className="flex justify-center">
        <Badge variant="cyan">{eyebrow}</Badge>
      </div>
      <SectionHeader title={title} description={description} align="center" className="mt-5" />

      <ul className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((item, index) => {
          const visual = SERVICE_VISUALS[item.slug];
          const icon = visual?.icon ?? SERVICE_ICON_NAMES[index % SERVICE_ICON_NAMES.length];
          const image = visual?.image ?? '/images/services/desarrollo-web.jpg';
          const accent = ACCENTS[index % ACCENTS.length];

          return (
            <li key={item.slug} data-reveal className={spanClass(index, services.length)}>
              <article
                className="service-card group"
                style={{ '--service-accent': ACCENT_HEX[accent] } as CSSProperties}
              >
                <a href={`${hrefPrefix}/${item.slug}`} className="service-card__link no-underline">
                  <img
                    src={image}
                    alt=""
                    className="service-card__image"
                    loading={index < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                  <span className="service-card__scrim" aria-hidden="true" />
                  <span className="service-card__wash" aria-hidden="true" />
                  <span className="service-card__icon">
                    <ServiceIcon name={icon} />
                  </span>
                  <div className="service-card__copy">
                    <h3 className="font-display text-lg font-semibold tracking-tight">{item.nombre}</h3>
                    <p className="mt-1.5 !text-sm !leading-relaxed">{item.tagline}</p>
                  </div>
                </a>
              </article>
            </li>
          );
        })}
      </ul>
    </SectionBand>
  );
}
