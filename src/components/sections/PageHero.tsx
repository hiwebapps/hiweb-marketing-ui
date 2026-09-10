import type { ReactNode } from 'react';
import { HeroAtmosphere, type AtmosphereVariant } from './primitives/HeroAtmosphere';
import { Eyebrow } from './primitives/Eyebrow';

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  atmosphere?: AtmosphereVariant;
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
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <HeroAtmosphere variant={atmosphere} />
      <div className="relative mx-auto max-w-6xl px-6 pt-32 pb-14 md:pt-36 md:pb-20">
        <div className="max-w-3xl">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h1 data-reveal className="mt-3 !text-4xl md:!text-6xl">
            {title}
          </h1>
          {description ? <p className="mt-5 max-w-2xl">{description}</p> : null}
          {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}
