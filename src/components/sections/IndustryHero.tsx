import { headingPlain } from '../../lib/heading';
import { Badge, Button, type BadgeVariant } from '../ui';
import { HeadingText, headingProps } from './primitives/heading';
import './IndustryHero.css';

export type IndustryHeroBadge = {
  label: string;
  variant?: BadgeVariant;
};

type IndustryHeroProps = {
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  /** CSS object-position for the background photo */
  imagePosition?: string;
  badges?: IndustryHeroBadge[];
  ctaLabel?: string;
  ctaHref?: string;
  headingWidth?: string;
};

/**
 * Hero de industria — misma gramática que Home (tipo, badges, CTA, blobs DS)
 * con foto de fondo en lugar del carrusel.
 */
export function IndustryHero({
  title,
  description,
  image,
  imageAlt = '',
  imagePosition = 'center 42%',
  badges = [{ label: 'Industria', variant: 'lime' }],
  ctaLabel = 'Ver casos de éxito',
  ctaHref = '#casos',
  headingWidth,
}: IndustryHeroProps) {
  const width = headingProps(headingWidth);
  return (
    <section
      id="inicio"
      data-scroll-section="inicio"
      className="industry-hero"
      aria-label={headingPlain(title)}
    >
      <div className="industry-hero__media" aria-hidden={imageAlt ? undefined : true}>
        <img
          src={image}
          alt={imageAlt}
          width={2400}
          height={1600}
          decoding="async"
          fetchPriority="high"
          style={{ objectPosition: imagePosition }}
        />
      </div>

      <div className="industry-hero__overlay" aria-hidden="true" />

      <div className="industry-hero__wash" aria-hidden="true">
        <span className="industry-hero__blob industry-hero__blob--tl" />
        <span className="industry-hero__blob industry-hero__blob--tr" />
        <span className="industry-hero__blob industry-hero__blob--bl" />
        <span className="industry-hero__blob industry-hero__blob--br" />
        <span className="industry-hero__blob industry-hero__blob--bc" />
      </div>

      <div className="industry-hero__inner">
        <div
        className={['industry-hero__copy', width.className].filter(Boolean).join(' ')}
        style={width.style}
        data-heading-width={width['data-heading-width']}
      >
          {badges.length > 0 ? (
            <div className="industry-hero__badges">
              {badges.map((badge) => (
                <Badge key={badge.label} variant={badge.variant ?? 'lime'} tone="on-ink">
                  {badge.label}
                </Badge>
              ))}
            </div>
          ) : null}
          <h1 data-split className="industry-hero__title">
            <HeadingText text={title} />
          </h1>
          <p className="industry-hero__lead">{description}</p>
          <div className="industry-hero__actions">
            <Button href={ctaHref} variant="primary" size="md" className="no-underline">
              {ctaLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
