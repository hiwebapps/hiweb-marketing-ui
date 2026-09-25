import { Badge, Button } from '../ui';
import type { ServicePitch as ServicePitchContent } from '../../data/service-pitch';
import { SectionBand } from './primitives/SectionBand';
import './ServicePitch.css';

type ServicePitchProps = ServicePitchContent & {
  tone?: 'canvas' | 'surface';
};

export function ServicePitch({
  badge,
  title,
  description,
  image,
  imageAlt,
  ctaLabel,
  ctaHref,
  tone = 'canvas',
}: ServicePitchProps) {
  return (
    <SectionBand id="propuesta" tone={tone}>
      <div className="service-pitch">
        <figure className="service-pitch__media">
          <img src={image} alt={imageAlt} width={960} height={1200} loading="lazy" />
        </figure>
        <div className="service-pitch__copy">
          <Badge variant="purple">{badge}</Badge>
          <h2 className="service-pitch__title">{title}</h2>
          <p className="service-pitch__lead">{description}</p>
          <Button href={ctaHref} variant="primary" size="md">
            {ctaLabel}
          </Button>
        </div>
      </div>
    </SectionBand>
  );
}
