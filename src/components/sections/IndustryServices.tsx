import type { CSSProperties } from 'react';
import { ServiceIcon, SERVICE_ICON_NAMES, type ServiceIconName } from '../icons/ServiceIcons';
import { Badge, Button } from '../ui';
import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';
import './IndustryServices.css';

export type IndustryServiceCard = {
  slug: string;
  nombre: string;
  description: string;
};

type ServiceAccent = 'purple' | 'cyan' | 'orange' | 'lime';

type IndustryServicesProps = {
  industryName: string;
  services: IndustryServiceCard[];
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: 'canvas' | 'surface';
};

const ACCENT_HEX: Record<ServiceAccent, string> = {
  purple: '#927afe',
  cyan: '#01e7ff',
  orange: '#fe621c',
  lime: '#74c465',
};

const ACCENTS: ServiceAccent[] = ['cyan', 'orange', 'purple', 'lime'];

const SERVICE_ICONS: Record<string, ServiceIconName> = {
  'redes-sociales': 'video',
  seo: 'activity',
  'meta-ads': 'users',
  'google-ads': 'target',
  branding: 'badge',
  'crm-automatizacion': 'box',
  'community-manager': 'focus',
  'ia-marketing': 'spark',
  'desarrollo-web': 'code',
};

/**
 * Industry page services — interactive cards with industry-adapted copy.
 * Visual language: DS surfaces + accent orb + watermark icon (refs blended).
 */
export function IndustryServices({
  industryName,
  services,
  eyebrow = 'Servicios',
  title = `Servicios leídos como ${industryName}`,
  description = 'Cada palanca adaptada a tu sector. El diagnóstico define el orden.',
  tone = 'canvas',
}: IndustryServicesProps) {
  return (
    <SectionBand id="servicios" tone={tone}>
      <div className="industry-services">
        <div className="industry-services__intro">
          <div className="flex justify-center md:justify-start">
            <Badge variant="cyan">{eyebrow}</Badge>
          </div>
          <div className="industry-services__header">
            <SectionHeader title={title} description={description} className="mt-4" />
            <div className="industry-services__header-cta">
              <Button href="/servicios" variant="primary" size="sm" className="no-underline">
                Ver todos los servicios
              </Button>
            </div>
          </div>
        </div>

        <ul className="industry-services__grid">
          {services.map((item, index) => {
            const icon = SERVICE_ICONS[item.slug] ?? SERVICE_ICON_NAMES[index % SERVICE_ICON_NAMES.length];
            const accent = ACCENTS[index % ACCENTS.length];

            return (
              <li key={item.slug} data-reveal>
                <article
                  className={`industry-service-card industry-service-card--${accent}`}
                  style={{ '--service-accent': ACCENT_HEX[accent] } as CSSProperties}
                >
                  <div className="industry-service-card__top">
                    <h3 className="industry-service-card__title">{item.nombre}</h3>
                    <span className="industry-service-card__tag">Servicio</span>
                  </div>

                  <p className="industry-service-card__desc">{item.description}</p>

                  <div className="industry-service-card__foot">
                    <Button
                      href={`/servicios/${item.slug}`}
                      variant="primary"
                      size="sm"
                      className="no-underline"
                    >
                      Ver más
                    </Button>
                    <span className="industry-service-card__orb" aria-hidden="true">
                      <ServiceIcon name={icon} />
                    </span>
                  </div>

                  <span className="industry-service-card__mark" aria-hidden="true">
                    <ServiceIcon name={icon} />
                  </span>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </SectionBand>
  );
}
