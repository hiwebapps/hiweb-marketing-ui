import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MOTION } from '../../lib/motion';
import './HeroStudioB.css';

gsap.registerPlugin(useGSAP);

type HeroStudioBProps = {
  titleLead?: string;
  titleTail?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  availability?: string;
};

function FigmaChip() {
  return (
    <span className="hero-studio-b__chip hero-studio-b__chip--figma" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M8 3h4v6H8a3 3 0 0 1 0-6Z" fill="#F24E1E" />
        <path d="M12 3h4a3 3 0 1 1 0 6h-4V3Z" fill="#FF7262" />
        <path d="M8 9h4v6H8a3 3 0 0 1 0-6Z" fill="#A259FF" />
        <path d="M12 9h4a3 3 0 1 1 0 6h-4V9Z" fill="#1ABCFE" />
        <path d="M8 15h4a3 3 0 1 1-4 0Z" fill="#0ACF83" />
      </svg>
    </span>
  );
}

function RocketChip() {
  return (
    <span className="hero-studio-b__chip hero-studio-b__chip--rocket" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M14.5 4.5c2.8 1 5.2 3.4 6.2 6.2-2.1.6-4.6.2-6.4-1.6-1.8-1.8-2.2-4.3-1.6-6.4Z"
          fill="#fff"
        />
        <path d="M9 15c-1.8 1.8-3.4 2.2-4.6 2.6.4-1.2.8-2.8 2.6-4.6L9 15Z" fill="#ffe7c2" />
        <circle cx="14.2" cy="9.8" r="1.15" fill="#ff5a36" />
      </svg>
    </span>
  );
}

/**
 * Hero Studio B — split: copy + mockups apilados (browser + phones) con GSAP.
 */
export function HeroStudioB({
  titleLead = 'Sistemas que trabajan más,',
  titleTail = 'piensan más grande.',
  description = 'De la identidad al paid y la web: un sistema que engancha, eleva la oferta y convierte. Menos slides; más evidencia en la superficie.',
  primaryLabel = 'Agenda una llamada',
  primaryHref = '/contacto',
  availability = 'Disponible este mes · 2 cupos libres',
}: HeroStudioBProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: '(prefers-reduced-motion: reduce)',
          canMotion: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const { reduceMotion } = context.conditions;

          if (reduceMotion) {
            gsap.set(['.hero-studio-b__copy > *', '.hero-studio-b__device'], {
              autoAlpha: 1,
              x: 0,
              y: 0,
              rotate: 0,
            });
            return;
          }

          const tl = gsap.timeline({
            defaults: { ease: MOTION.ease, duration: MOTION.duration },
          });

          tl.from('.hero-studio-b__copy > *', {
            y: MOTION.revealY,
            autoAlpha: 0,
            stagger: MOTION.stagger,
          }).from(
            '.hero-studio-b__device',
            {
              y: 48,
              x: (i: number) => (i === 0 ? 28 : i === 1 ? -24 : 24),
              autoAlpha: 0,
              rotate: (i: number) => (i === 0 ? 4 : i === 1 ? -8 : 8),
              stagger: 0.12,
              duration: MOTION.durationSlow,
            },
            '-=0.32',
          );

          gsap.utils.toArray<HTMLElement>('.hero-studio-b__float').forEach((el, i) => {
            gsap.to(el, {
              y: i === 0 ? -12 : i === 1 ? 10 : -14,
              rotation: i === 1 ? -2 : 1.6,
              duration: 2.8 + i * 0.35,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
              delay: i * 0.2,
            });
          });
        },
      );

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="hero-studio-b" aria-label="Hero Studio B">
      <div className="hero-studio-b__inner">
        <div className="hero-studio-b__copy">
          <p className="hero-studio-b__badge">
            <span className="hero-studio-b__dot" />
            {availability}
          </p>
          <h2 className="hero-studio-b__title">
            {titleLead} <FigmaChip /> {titleTail} <RocketChip />
          </h2>
          <p className="hero-studio-b__lead">{description}</p>
          <a href={primaryHref} className="hero-studio-b__cta">
            {primaryLabel}
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <div className="hero-studio-b__stage" aria-label="Mockups de proyectos">
          <a href="/portafolio/pulse" className="hero-studio-b__device hero-studio-b__browser">
            <span className="hero-studio-b__float">
              <span className="hero-studio-b__chrome">
                <span className="hero-studio-b__dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="hero-studio-b__url">hiweb.marketing/pulse</span>
              </span>
              <span className="hero-studio-b__screen">
                <img src="/images/services/ia-marketing.jpg" alt="Caso Pulse en desktop" />
              </span>
            </span>
          </a>

          <a
            href="/portafolio/marina-bay"
            className="hero-studio-b__device hero-studio-b__phone hero-studio-b__phone--left"
          >
            <span className="hero-studio-b__float">
              <img src="/images/services/redes-sociales.jpg" alt="Caso Marina Bay en mobile" />
            </span>
          </a>

          <a
            href="/portafolio/norte-industrial"
            className="hero-studio-b__device hero-studio-b__phone hero-studio-b__phone--right"
          >
            <span className="hero-studio-b__float">
              <img src="/images/services/google-ads.jpg" alt="Caso Norte Industrial en mobile" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
