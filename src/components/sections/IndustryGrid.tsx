import { useCallback, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  IndustryIcon,
  INDUSTRY_ICON_NAMES,
  type IndustryIconName,
} from '../icons/IndustryIcons';
import { Badge, Button } from '../ui';
import { SectionBand } from './primitives/SectionBand';
import './IndustryGrid.css';

gsap.registerPlugin(useGSAP);

export type IndustryCard = {
  slug: string;
  nombre: string;
  tagline: string;
  puntos?: string[];
  icon?: IndustryIconName;
};

type IndustryAccent = 'purple' | 'cyan' | 'orange' | 'green';

type IndustryGridProps = {
  industries: IndustryCard[];
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: 'canvas' | 'surface';
  hrefPrefix?: string;
  ctaLabel?: string;
};

const ACCENT_HEX: Record<IndustryAccent, string> = {
  purple: '#927afe',
  cyan: '#01e7ff',
  orange: '#fe621c',
  green: '#74c465',
};

const ACCENTS: IndustryAccent[] = ['purple', 'cyan', 'orange', 'green'];

const INDUSTRY_VISUALS: Record<string, { icon: IndustryIconName }> = {
  manufactura: { icon: 'factory' },
  salud: { icon: 'heart' },
  inmobiliarias: { icon: 'building' },
  'turismo-hoteleria': { icon: 'plane' },
  restaurantes: { icon: 'utensils' },
  saas: { icon: 'app' },
};

const DRAG_ARM = 8;
const SWIPE_THRESHOLD = 56;

function isDesktop() {
  return typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;
}

function trackGap(track: HTMLElement) {
  const value = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap);
  return Number.isFinite(value) ? value : 27.2;
}

function slideIndexFromPoint(track: HTMLElement, clientX: number, clientY: number) {
  const hit = document.elementFromPoint(clientX, clientY);
  const slide = hit?.closest('.industry-slide');
  if (!slide) return -1;
  return Array.from(track.children).indexOf(slide);
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function IndustryGrid({
  industries,
  eyebrow = 'Industrias',
  title = 'Hablamos el idioma de tu sector',
  description = 'Casos, retos y métricas propias de tu industria — no un playbook genérico.',
  tone = 'canvas',
  hrefPrefix = '/industrias',
  ctaLabel = 'Ver el sector',
}: IndustryGridProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const hydrated = useRef(false);
  const drag = useRef({
    pointerId: -1,
    startX: 0,
    origin: 0,
    delta: 0,
    dragging: false,
  });

  const lastIndex = Math.max(industries.length - 1, 0);
  const goTo = useCallback(
    (next: number) => {
      setActiveIndex(Math.max(0, Math.min(lastIndex, next)));
    },
    [lastIndex],
  );

  const layoutStage = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty('--industry-stage-left', `${stage.getBoundingClientRect().left}px`);
  }, []);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      layoutStage();

      const slide = track.querySelector<HTMLElement>('.industry-slide');
      const slideW = slide?.offsetWidth || 360;
      const gap = trackGap(track);
      const reduced = prefersReducedMotion() || !hydrated.current;
      const peek = isDesktop() && activeIndex > 0 ? 72 : 0;

      gsap.to(track, {
        x: -activeIndex * (slideW + gap) + peek,
        duration: reduced ? 0 : 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      hydrated.current = true;
    },
    { dependencies: [activeIndex, industries.length], scope: rootRef, revertOnUpdate: false },
  );

  useGSAP(
    () => {
      const onResize = () => {
        layoutStage();
        const track = trackRef.current;
        if (!track) return;
        const slide = track.querySelector<HTMLElement>('.industry-slide');
        const slideW = slide?.offsetWidth || 360;
        const peek = isDesktop() && activeIndex > 0 ? 72 : 0;
        gsap.set(track, { x: -activeIndex * (slideW + trackGap(track)) + peek });
      };

      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    },
    { dependencies: [activeIndex], scope: rootRef },
  );

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !trackRef.current) return;
    const target = event.target as HTMLElement;
    if (target.closest('a, button')) return;
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      origin: gsap.getProperty(trackRef.current, 'x') as number,
      delta: 0,
      dragging: true,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.dragging || !trackRef.current) return;
    drag.current.delta = event.clientX - drag.current.startX;
    if (Math.abs(drag.current.delta) < DRAG_ARM) return;
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    gsap.set(trackRef.current, { x: drag.current.origin + drag.current.delta });
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.dragging) return;
    const { delta, pointerId } = drag.current;
    drag.current.dragging = false;
    if (event.currentTarget.hasPointerCapture(pointerId)) {
      event.currentTarget.releasePointerCapture(pointerId);
    }

    if (delta <= -SWIPE_THRESHOLD) {
      goTo(activeIndex + 1);
      return;
    }
    if (delta >= SWIPE_THRESHOLD) {
      goTo(activeIndex - 1);
      return;
    }

    const track = trackRef.current;
    const hitIndex = track ? slideIndexFromPoint(track, event.clientX, event.clientY) : -1;
    goTo(hitIndex >= 0 ? hitIndex : activeIndex);
  };

  return (
    <SectionBand id="industrias" tone={tone} className="industry-slider-band">
      <div
        ref={rootRef}
        className={['industry-slider', tone === 'surface' ? 'industry-slider--surface' : '']
          .filter(Boolean)
          .join(' ')}
      >
        <div className="industry-slider__layout">
          <header className="industry-slider__intro">
            <Badge variant="purple">{eyebrow}</Badge>
            <h2 data-split className="mt-3 max-w-sm !text-3xl !leading-[1.15] tracking-[-0.03em] text-ink md:!text-[2.65rem]">
              {title}
            </h2>
            {description ? <p className="mt-4 max-w-sm !text-sm !leading-relaxed md:!text-base">{description}</p> : null}
          </header>

          <div className="industry-slider__nav">
            <button
              type="button"
              className="industry-slider__arrow industry-slider__arrow--prev"
              aria-label="Industria anterior"
              disabled={activeIndex === 0}
              onClick={() => goTo(activeIndex - 1)}
            >
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M10 3 5 8l5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="industry-slider__arrow industry-slider__arrow--next"
              aria-label="Industria siguiente"
              disabled={activeIndex === lastIndex}
              onClick={() => goTo(activeIndex + 1)}
            >
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M6 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div
            ref={stageRef}
            className="industry-slider__stage"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div className="industry-slider__viewport">
              <ul
                ref={trackRef}
                className="industry-slider__track"
                aria-label="Industrias"
              >
                {industries.map((item, index) => {
                  const icon =
                    item.icon ??
                    INDUSTRY_VISUALS[item.slug]?.icon ??
                    INDUSTRY_ICON_NAMES[index % INDUSTRY_ICON_NAMES.length];
                  const accent = ACCENTS[index % ACCENTS.length];
                  const current = index === activeIndex;
                  const puntos = item.puntos ?? [];

                  return (
                    <li
                      key={item.slug}
                      className={['industry-slide', current ? 'is-current' : ''].filter(Boolean).join(' ')}
                      style={{ '--industry-accent': ACCENT_HEX[accent] } as CSSProperties}
                      onClick={(event) => {
                        if ((event.target as HTMLElement).closest('a')) return;
                        goTo(index);
                      }}
                    >
                      <div className="industry-slide__frame">
                        <span className="industry-slide__wash" aria-hidden="true" />
                        <article
                          className="industry-slide__body"
                          aria-current={current ? 'true' : undefined}
                          onClick={() => goTo(index)}
                          onKeyDown={(event) => {
                            if (current) return;
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              goTo(index);
                            }
                          }}
                          role={current ? undefined : 'button'}
                          tabIndex={current ? undefined : 0}
                          aria-label={current ? undefined : `Mostrar ${item.nombre}`}
                        >
                          <span className="industry-slide__icon">
                            <IndustryIcon name={icon} />
                          </span>
                          <div className="industry-slide__copy">
                            <h3 className="industry-slide__title">{item.nombre}</h3>
                            <div className="industry-slide__details" aria-hidden={!current}>
                              <div className="industry-slide__details-inner" {...(!current ? { inert: true } : {})}>
                                <p className="industry-slide__tagline">{item.tagline}</p>
                                {puntos.length ? (
                                  <ol className="industry-slide__list">
                                    {puntos.map((punto, puntoIndex) => (
                                      <li key={punto}>
                                        <span className="industry-slide__index">
                                          {String(puntoIndex + 1).padStart(2, '0')}
                                        </span>
                                        <span>— {punto}</span>
                                      </li>
                                    ))}
                                  </ol>
                                ) : null}
                                <Button
                                  href={`${hrefPrefix}/${item.slug}`}
                                  variant="secondary"
                                  size="sm"
                                  className="industry-slide__cta no-underline"
                                >
                                  {ctaLabel}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </article>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SectionBand>
  );
}
