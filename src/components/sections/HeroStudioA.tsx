import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MOTION } from '../../lib/motion';
import { Button } from '../ui';
import './HeroStudioA.css';

gsap.registerPlugin(useGSAP);

const SLIDES = [
  { image: 'https://picsum.photos/id/1015/900/600', title: 'Pulse · SaaS' },
  { image: 'https://picsum.photos/id/180/900/600', title: 'Campo · Retail' },
  { image: 'https://picsum.photos/id/201/900/600', title: 'Vertex · Servicios' },
  { image: 'https://picsum.photos/id/3/900/600', title: 'Orbit · Fintech' },
  { image: 'https://picsum.photos/id/60/900/600', title: 'Northstar · EdTech' },
  { image: 'https://picsum.photos/id/119/900/600', title: 'Marina Bay · Turismo' },
  { image: 'https://picsum.photos/id/160/900/600', title: 'Helios · Health' },
] as const;

const AUTO_MS = 3500;
const PROJECT_HREF = '/portafolio';

type HeroStudioAProps = {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

function wrap(index: number, length: number) {
  return ((index % length) + length) % length;
}

function shortest(delta: number, length: number) {
  let value = delta;
  if (value > length / 2) value -= length;
  if (value < -length / 2) value += length;
  return value;
}

function metrics() {
  const width = typeof window === 'undefined' ? 1200 : window.innerWidth;
  if (width < 700) {
    return { spacing: 168, scaleStep: 0.2, rotate: 9, visible: 1.65 };
  }
  if (width < 1024) {
    return { spacing: 228, scaleStep: 0.17, rotate: 10, visible: 2.15 };
  }
  return { spacing: 286, scaleStep: 0.15, rotate: 11, visible: 2.35 };
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Hero Studio A — coverflow 3D infinito: autoplay ~3.5s, click al portafolio.
 */
export function HeroStudioA({
  title = 'Experiencias digitales que sí mueven pipeline.',
  description = 'Estrategia, diseño y media como un solo sistema. Menos improvisación; más señal, oferta clara y web que cierra.',
  primaryLabel = 'Agenda tu auditoría gratuita',
  primaryHref = '/contacto',
  secondaryLabel = 'Ver Casos de Éxito',
  secondaryHref = '/portafolio',
}: HeroStudioAProps) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);
  const indexRef = useRef(0);
  const pausedRef = useRef(false);

  useGSAP(
    (context, contextSafe) => {
      const stage = stageRef.current;
      const cards = gsap.utils.toArray<HTMLElement>('.hero-studio-a__card');
      if (!stage || cards.length === 0) return;

      const announce = () => {
        const live = liveRef.current;
        if (!live) return;
        live.textContent = SLIDES[indexRef.current]?.title ?? '';
      };

      const layout = (animate: boolean) => {
        const { spacing, scaleStep, rotate, visible } = metrics();
        const reduced = prefersReducedMotion();
        const duration = !animate || reduced ? 0 : 0.85;

        cards.forEach((card, i) => {
          const x = shortest(i - indexRef.current, cards.length);
          const abs = Math.abs(x);
          const current = Math.round(x) === 0;

          const vars = {
            x: x * spacing,
            y: abs * 8,
            z: 90 - abs * 38,
            scale: gsap.utils.clamp(0.64, 1, 1 - abs * scaleStep),
            rotateY: x * -rotate,
            autoAlpha: abs > visible ? 0 : 1,
            zIndex: Math.round(40 - abs * 8),
            duration,
            ease: 'power2.inOut',
            overwrite: 'auto',
            force3D: true,
          };

          if (duration === 0) gsap.set(card, vars);
          else gsap.to(card, vars);

          card.classList.toggle('is-current', current);
        });

        announce();
      };

      gsap.set(cards, { xPercent: -50, yPercent: -50, transformPerspective: 1400 });
      gsap.set('.hero-studio-a__card img', { clearProps: 'filter' });
      gsap.set('.hero-studio-a__card-label, .hero-studio-a__card-cta-wrap', {
        clearProps: 'opacity,visibility,transform',
      });
      layout(false);

      if (!prefersReducedMotion()) {
        gsap.from('.hero-studio-a__copy > *', {
          y: MOTION.revealY,
          autoAlpha: 0,
          stagger: MOTION.stagger,
          duration: MOTION.duration,
          ease: MOTION.ease,
        });
        gsap.from('.hero-studio-a__actions', {
          y: 16,
          autoAlpha: 0,
          duration: MOTION.durationFast,
          delay: 0.35,
          ease: MOTION.ease,
        });
      }

      const step = contextSafe((dir: number) => {
        indexRef.current = wrap(indexRef.current + dir, cards.length);
        layout(true);
      });

      const timer = window.setInterval(() => {
        if (pausedRef.current || prefersReducedMotion()) return;
        step(1);
      }, AUTO_MS);

      const pause = () => {
        pausedRef.current = true;
      };
      const resume = () => {
        pausedRef.current = false;
      };

      const onKey = contextSafe((event: KeyboardEvent) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          step(1);
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          step(-1);
        }
      });

      const onResize = contextSafe(() => layout(false));

      stage.addEventListener('pointerenter', pause);
      stage.addEventListener('pointerleave', resume);
      stage.addEventListener('keydown', onKey);
      window.addEventListener('resize', onResize);

      return () => {
        window.clearInterval(timer);
        stage.removeEventListener('pointerenter', pause);
        stage.removeEventListener('pointerleave', resume);
        stage.removeEventListener('keydown', onKey);
        window.removeEventListener('resize', onResize);
      };
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="inicio"
      data-scroll-section="inicio"
      className="hero-studio-a"
      aria-label="Hero Studio A"
    >
      <div className="hero-studio-a__wash" aria-hidden="true">
        <span className="hero-studio-a__blob hero-studio-a__blob--tl" />
        <span className="hero-studio-a__blob hero-studio-a__blob--tr" />
        <span className="hero-studio-a__blob hero-studio-a__blob--bl" />
        <span className="hero-studio-a__blob hero-studio-a__blob--br" />
        <span className="hero-studio-a__blob hero-studio-a__blob--bc" />
      </div>

      <div className="hero-studio-a__inner">
        <div className="hero-studio-a__copy">
          <h2 className="hero-studio-a__title">{title}</h2>
          <p className="hero-studio-a__lead">{description}</p>
          <div className="hero-studio-a__actions">
            <Button href={primaryHref} variant="primary" size="md" className="no-underline">
              {primaryLabel}
            </Button>
            <Button href={secondaryHref} variant="secondary" size="md" className="no-underline">
              {secondaryLabel}
            </Button>
          </div>
        </div>
      </div>

      <div className="hero-studio-a__carousel">
        <div
          ref={stageRef}
          className="hero-studio-a__stage"
          role="region"
          aria-roledescription="carrusel"
          aria-label="Proyectos recientes"
          tabIndex={0}
        >
          <p ref={liveRef} className="sr-only" aria-live="polite" />
          <div className="hero-studio-a__track">
            {SLIDES.map((slide) => (
              <div key={slide.title} className="hero-studio-a__card">
                <a href={PROJECT_HREF} className="hero-studio-a__card-media" aria-label={slide.title}>
                  <img src={slide.image} alt="" draggable={false} />
                </a>
                <span className="hero-studio-a__card-label">{slide.title}</span>
                <div className="hero-studio-a__card-cta-wrap">
                  <Button
                    href={PROJECT_HREF}
                    variant="secondary"
                    size="sm"
                    className="hero-studio-a__card-cta no-underline !h-8 !px-3 !text-xs"
                  >
                    ver proyecto
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-studio-a__edges" aria-hidden="true">
          <span className="hero-studio-a__edge hero-studio-a__edge--left" />
          <span className="hero-studio-a__edge hero-studio-a__edge--right" />
        </div>
      </div>

    </section>
  );
}
