import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MOTION } from '../../lib/motion';
import { Button } from '../ui';
import './HeroStudioA.css';

gsap.registerPlugin(useGSAP);

export type HeroStudioSlide = {
  image: string;
  title: string;
  href: string;
};

const AUTO_MS = 3500;
const DRAG_ARM = 14;
const SWIPE_THRESHOLD = 46;

type HeroStudioAProps = {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  slides?: HeroStudioSlide[];
  cardCta?: string;
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
  slides = [],
  cardCta = 'ver proyecto',
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
        live.textContent = slides[indexRef.current]?.title ?? '';
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

      const root = rootRef.current;
      const copyBits = gsap.utils.toArray<HTMLElement>(
        '.hero-studio-a__title, .hero-studio-a__lead',
      );
      const actions = root?.querySelector('.hero-studio-a__actions');
      const carousel = root?.querySelector('.hero-studio-a__carousel');

      if (!prefersReducedMotion()) {
        // Set hidden state before unlocking CSS so there is no visible → hidden flash.
        gsap.set(copyBits, { y: MOTION.revealY, autoAlpha: 0 });
        if (actions) gsap.set(actions, { y: 16, autoAlpha: 0 });
        if (carousel) {
          gsap.set(carousel, {
            y: 26,
            autoAlpha: 0,
            scale: 0.982,
            transformOrigin: '50% 55%',
          });
        }
        root?.classList.add('is-ready');

        gsap.to(copyBits, {
          y: 0,
          autoAlpha: 1,
          stagger: MOTION.stagger,
          duration: MOTION.duration,
          ease: MOTION.ease,
        });
        if (actions) {
          gsap.to(actions, {
            y: 0,
            autoAlpha: 1,
            duration: MOTION.durationFast,
            delay: 0.28,
            ease: MOTION.ease,
          });
        }
        if (carousel) {
          gsap.to(carousel, {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: MOTION.durationSlow,
            delay: 0.4,
            ease: MOTION.ease,
          });
        }
      } else {
        root?.classList.add('is-ready');
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
      const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

      const drag = {
        pointerId: -1,
        startX: 0,
        delta: 0,
        dragging: false,
      };
      let suppressClick = false;
      let resumeTimer = 0;

      const hold = () => {
        pausedRef.current = true;
        window.clearTimeout(resumeTimer);
      };
      const release = () => {
        window.clearTimeout(resumeTimer);
        resumeTimer = window.setTimeout(() => {
          pausedRef.current = false;
        }, AUTO_MS);
      };

      const onPointerDown = (event: PointerEvent) => {
        if (event.button !== 0) return;
        hold();
        drag.pointerId = event.pointerId;
        drag.startX = event.clientX;
        drag.delta = 0;
        drag.dragging = false;
      };

      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerId !== drag.pointerId) return;
        drag.delta = event.clientX - drag.startX;
        if (!drag.dragging && Math.abs(drag.delta) < DRAG_ARM) return;
        if (!drag.dragging) {
          drag.dragging = true;
          stage.classList.add('is-dragging');
          try {
            stage.setPointerCapture(event.pointerId);
          } catch {
            /* Safari can throw if the node is gone */
          }
        }
      };

      const onPointerUp = contextSafe((event: PointerEvent) => {
        if (event.pointerId !== drag.pointerId) return;
        if (stage.hasPointerCapture(event.pointerId)) {
          stage.releasePointerCapture(event.pointerId);
        }
        stage.classList.remove('is-dragging');
        const { delta, dragging } = drag;
        drag.pointerId = -1;
        drag.dragging = false;

        if (dragging) {
          suppressClick = true;
          if (delta <= -SWIPE_THRESHOLD) step(1);
          else if (delta >= SWIPE_THRESHOLD) step(-1);
          window.setTimeout(() => {
            suppressClick = false;
          }, 400);
        }
        release();
      });

      const onClickCapture = (event: Event) => {
        if (!suppressClick) return;
        event.preventDefault();
        event.stopPropagation();
        suppressClick = false;
      };

      const onCardClick = contextSafe((event: Event) => {
        if (suppressClick) return;
        const card = event.currentTarget as HTMLElement;
        const i = cards.indexOf(card);
        if (i < 0) return;
        if (Math.round(shortest(i - indexRef.current, cards.length)) === 0) return;
        event.preventDefault();
        event.stopPropagation();
        indexRef.current = i;
        layout(true);
        hold();
        release();
      });

      if (canHover) {
        stage.addEventListener('pointerenter', pause);
        stage.addEventListener('pointerleave', resume);
      }
      stage.addEventListener('pointerdown', onPointerDown);
      stage.addEventListener('pointermove', onPointerMove);
      stage.addEventListener('pointerup', onPointerUp);
      stage.addEventListener('pointercancel', onPointerUp);
      stage.addEventListener('click', onClickCapture, true);
      cards.forEach((card) => card.addEventListener('click', onCardClick));
      stage.addEventListener('keydown', onKey);
      window.addEventListener('resize', onResize);

      return () => {
        window.clearInterval(timer);
        window.clearTimeout(resumeTimer);
        if (canHover) {
          stage.removeEventListener('pointerenter', pause);
          stage.removeEventListener('pointerleave', resume);
        }
        stage.removeEventListener('pointerdown', onPointerDown);
        stage.removeEventListener('pointermove', onPointerMove);
        stage.removeEventListener('pointerup', onPointerUp);
        stage.removeEventListener('pointercancel', onPointerUp);
        stage.removeEventListener('click', onClickCapture, true);
        cards.forEach((card) => card.removeEventListener('click', onCardClick));
        stage.removeEventListener('keydown', onKey);
        window.removeEventListener('resize', onResize);
      };
    },
    { scope: rootRef, dependencies: [slides] },
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
            {slides.map((slide) => (
              <div key={slide.href} className="hero-studio-a__card">
                <a href={slide.href} className="hero-studio-a__card-media" aria-label={slide.title}>
                  <img src={slide.image} alt="" draggable={false} />
                </a>
                <span className="hero-studio-a__card-label">{slide.title}</span>
                <div className="hero-studio-a__card-cta-wrap">
                  <Button
                    href={slide.href}
                    variant="secondary"
                    size="sm"
                    className="hero-studio-a__card-cta no-underline !h-8 !px-3 !text-xs"
                  >
                    {cardCta}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
