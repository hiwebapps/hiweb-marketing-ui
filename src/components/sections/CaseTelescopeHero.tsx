import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './CaseTelescopeHero.css';

gsap.registerPlugin(useGSAP);

const FRONT_LAYERS = 6;

type CaseTelescopeHeroProps = {
  titleLeft: string;
  titleRight?: string;
  image: string;
  imageAlt?: string;
  floatImages?: ReadonlyArray<string>;
  eyebrow?: string;
};

/**
 * Case study hero — telescope zoom on load (Codrops / joffreysp), GSAP autoplay.
 */
export function CaseTelescopeHero({
  titleLeft,
  titleRight,
  image,
  imageAlt = '',
  floatImages = [],
  eyebrow,
}: CaseTelescopeHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const floats = floatImages.slice(0, 10);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const fronts = gsap.utils.toArray<HTMLElement>('.case-telescope__front', root);
      const smalls = gsap.utils.toArray<HTMLElement>('.case-telescope__float img', root);
      const progress = { value: 0 };

      const setProgress = (value: number) => {
        const eased = gsap.parseEase('power1.inOut')(value);
        root.style.setProperty('--progress', String(eased));
      };

      if (reduced) {
        progress.value = 1;
        setProgress(1);
        gsap.set(fronts, { scale: 1, filter: 'blur(0px)' });
        gsap.set(smalls, { opacity: 0 });
        return;
      }

      setProgress(0);

      gsap.set(smalls, {
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        force3D: true,
      });

      const timeline = gsap.timeline({
        defaults: { ease: 'power1.inOut' },
        delay: 0.15,
      });

      timeline.to(
        progress,
        {
          value: 1,
          duration: 1.55,
          ease: 'none',
          onUpdate: () => setProgress(progress.value),
        },
        0,
      );

      timeline.to(
        smalls,
        {
          z: '100vh',
          duration: 1.2,
          stagger: { amount: 0.2, from: 'center' },
        },
        0,
      );

      timeline.to(
        fronts,
        {
          scale: 1,
          duration: 1.15,
        },
        0.45,
      );

      timeline.to(
        fronts,
        {
          filter: 'blur(0px)',
          duration: 1.05,
          stagger: { amount: 0.18, from: 'end' },
        },
        0.55,
      );
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="case-telescope"
      aria-label="Hero del caso"
      style={{ ['--progress' as string]: 0 }}
    >
      {eyebrow ? <p className="case-telescope__eyebrow">{eyebrow}</p> : null}

      <h1 className="case-telescope__title">
        <span className="case-telescope__title-left">{titleLeft}</span>
        {titleRight ? (
          <span className="case-telescope__title-right">{titleRight}</span>
        ) : null}
      </h1>

      <div className="case-telescope__media" aria-hidden="true">
        <div className="case-telescope__back">
          <img src={image} alt="" width={1600} height={1000} decoding="async" />
        </div>
        {Array.from({ length: FRONT_LAYERS }, (_, index) => (
          <div
            key={index}
            className={`case-telescope__front case-telescope__front--${index + 1}`}
          >
            <img
              src={image}
              alt=""
              width={1600}
              height={1000}
              decoding="async"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {floats.length ? (
        <div className="case-telescope__float" aria-hidden="true">
          {floats.map((src, index) => (
            <img
              key={`${src}-${index}`}
              src={src}
              alt=""
              width={320}
              height={400}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      ) : null}

      <span className="case-telescope__sr-only">{imageAlt}</span>
    </section>
  );
}
