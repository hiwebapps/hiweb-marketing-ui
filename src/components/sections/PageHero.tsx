import type { ReactNode } from 'react';
import { HeroAtmosphere, type AtmosphereVariant } from './primitives/HeroAtmosphere';
import { Eyebrow } from './primitives/Eyebrow';
import { HeadingText, headingProps } from './primitives/heading';

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  atmosphere?: AtmosphereVariant;
  /** Usa el ancho de la navbar (1300px) en lugar del bloque estrecho. */
  fullWidth?: boolean;
  headingWidth?: string;
};

/**
 * Hero claro para páginas interiores. El hero oscuro con DriftWall es solo de Home.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  atmosphere = 'spotlight',
  fullWidth = false,
  headingWidth,
}: PageHeroProps) {
  const width = headingProps(headingWidth);
  return (
    <section className="relative overflow-hidden">
      <HeroAtmosphere variant={atmosphere} />
      <div className="relative mx-auto w-full max-w-[var(--section-max)] px-6 pt-32 pb-14 md:pt-36 md:pb-20">
        <div
          className={[width.className || (fullWidth ? 'w-full' : 'max-w-3xl')].join(' ')}
          style={width.style}
          data-heading-width={width['data-heading-width']}
        >
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h1 data-split className="mt-3 !text-4xl md:!text-6xl">
            <HeadingText text={title} />
          </h1>
          {description ? (
            <p className={width.className || fullWidth ? 'mt-5' : 'mt-5 max-w-2xl'}>{description}</p>
          ) : null}
          {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}
