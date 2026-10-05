import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Button } from '../ui';
import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';
import './CaseStories.css';

gsap.registerPlugin(useGSAP);

export type CaseStoryStat = {
  value: string;
  label: string;
};

export type CaseStory = {
  client: string;
  quote: string;
  name: string;
  role: string;
  stats?: CaseStoryStat[];
  photo?: string;
  cover?: string;
  href?: string;
};

type CaseStoriesProps = {
  stories?: CaseStory[];
  eyebrow?: string;
  title?: string;
  description?: string;
  id?: string;
  headingWidth?: string;
  locale?: 'es' | 'en';
};

const PHOTO_FALLBACKS: Record<string, string> = {
  Pulse: 'https://i.pravatar.cc/900?img=47',
  'Norte Industrial': 'https://i.pravatar.cc/900?img=12',
  'Marina Bay': 'https://i.pravatar.cc/900?img=32',
  'Clínica Aurora': 'https://i.pravatar.cc/900?img=49',
};

const DEFAULT_STORIES: CaseStory[] = [
  {
    client: 'Pulse',
    quote:
      'Nos ayudaron a aclarar una oferta compleja y convertirla en campañas que ventas sí podía usar. El pipeline dejó de depender de impulsos.',
    name: 'María López',
    role: 'CMO',
    stats: [
      { value: '+184%', label: 'demos calificadas' },
      { value: '2.1×', label: 'tasa de show-up a demo' },
    ],
  },
  {
    client: 'Norte Industrial',
    quote:
      'Por primera vez el comité de compras llega habiendo entendido qué vendemos. Eso no lo lograba una feria.',
    name: 'Héctor Salinas',
    role: 'Director comercial',
  },
  {
    client: 'Marina Bay',
    quote:
      'No apagamos Booking. Aprendimos a no pagarle las noches que el huésped ya nos buscaba por nombre.',
    name: 'Laura Chen',
    role: 'Revenue manager',
  },
];

const DRAG_ARM = 8;
const SWIPE_THRESHOLD = 56;

function visibleCount() {
  return 1;
}

function trackGap(track: HTMLElement) {
  const value = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap);
  return Number.isFinite(value) ? value : 20;
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function imageFor(story: CaseStory, index: number) {
  return story.photo ?? PHOTO_FALLBACKS[story.client] ?? `https://i.pravatar.cc/900?img=${5 + index * 7}`;
}

function coverFor(story: CaseStory, index: number) {
  return story.cover || imageFor(story, index);
}

/**
 * Testimonios — título a la izquierda, slider de cards a la derecha.
 */
export function CaseStories({
  stories = DEFAULT_STORIES,
  eyebrow = 'Casos',
  title = 'Resultados propios, solo con empresas consolidadas',
  description = 'Cliente, industria y outcome. Sin portfolio ornamental.',
  id = 'casos',
  headingWidth,
  locale = 'es',
}: CaseStoriesProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [perView, setPerView] = useState(1);
  const drag = useRef({
    pointerId: -1,
    startX: 0,
    origin: 0,
    delta: 0,
    dragging: false,
  });

  const lastIndex = Math.max(stories.length - perView, 0);
  const canSlide = lastIndex > 0;
  const ctaLabel = locale === 'en' ? 'View project' : 'Ver proyecto';
  const portfolioHref = '/portafolio';
  const goTo = useCallback(
    (next: number) => {
      setActiveIndex(Math.max(0, Math.min(lastIndex, next)));
    },
    [lastIndex],
  );

  const syncPerView = useCallback(() => {
    setPerView(visibleCount());
  }, []);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      syncPerView();
      const slide = track.querySelector<HTMLElement>('.case-stories__slide');
      const slideW = slide?.offsetWidth || 320;
      const gap = trackGap(track);

      gsap.to(track, {
        x: -activeIndex * (slideW + gap),
        duration: prefersReducedMotion() ? 0 : 0.55,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    },
    { scope: rootRef, dependencies: [activeIndex, perView, stories.length] },
  );

  useGSAP(
    () => {
      const onResize = () => {
        syncPerView();
        setActiveIndex((current) => Math.min(current, Math.max(stories.length - visibleCount(), 0)));
      };
      window.addEventListener('resize', onResize);
      syncPerView();
      return () => window.removeEventListener('resize', onResize);
    },
    { scope: rootRef, dependencies: [stories.length] },
  );

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!canSlide || event.button !== 0) return;
    if ((event.target as HTMLElement).closest('a, button')) return;
    const track = trackRef.current;
    if (!track) return;
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      origin: Number(gsap.getProperty(track, 'x')) || 0,
      delta: 0,
      dragging: false,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!canSlide) return;
    const state = drag.current;
    const track = trackRef.current;
    if (state.pointerId !== event.pointerId || !track) return;
    const delta = event.clientX - state.startX;
    if (!state.dragging && Math.abs(delta) < DRAG_ARM) return;
    if (!state.dragging) {
      state.dragging = true;
      event.currentTarget.classList.add('is-dragging');
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    state.delta = delta;
    gsap.set(track, { x: state.origin + delta });
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!canSlide) return;
    const state = drag.current;
    if (state.pointerId !== event.pointerId) return;
    event.currentTarget.classList.remove('is-dragging');
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const delta = state.delta;
    state.pointerId = -1;
    state.dragging = false;
    if (delta <= -SWIPE_THRESHOLD) {
      goTo(activeIndex + 1);
      return;
    }
    if (delta >= SWIPE_THRESHOLD) {
      goTo(activeIndex - 1);
      return;
    }
    goTo(activeIndex);
  };

  const nav = canSlide ? (
    <div className="case-stories__nav">
      <button
        type="button"
        className="case-stories__arrow"
        aria-label={locale === 'en' ? 'Previous testimonials' : 'Testimonios anteriores'}
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
        className="case-stories__arrow"
        aria-label={locale === 'en' ? 'Next testimonials' : 'Testimonios siguientes'}
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
  ) : null;

  return (
    <SectionBand id={id} tone="ink" className="case-stories-band">
      <div className="case-stories__wash" aria-hidden="true">
        <span className="case-stories__blob case-stories__blob--a" />
        <span className="case-stories__blob case-stories__blob--b" />
        <span className="case-stories__blob case-stories__blob--c" />
        <span className="case-stories__blob case-stories__blob--d" />
        <span className="case-stories__blob case-stories__blob--e" />
      </div>

      <div ref={rootRef} className="case-stories">
        <div className="case-stories__layout">
          <div className="case-stories__intro">
            <SectionHeader
              eyebrow={eyebrow}
              title={title}
              description={description}
              align="left"
              constrained={false}
              tone="on-ink"
              badgeVariant="lime"
              headingWidth={headingWidth}
            />
            {nav}
          </div>

          <div
            className={['case-stories__stage', canSlide ? 'is-slider' : 'is-static'].join(' ')}
            onPointerDown={canSlide ? onPointerDown : undefined}
            onPointerMove={canSlide ? onPointerMove : undefined}
            onPointerUp={canSlide ? onPointerUp : undefined}
            onPointerCancel={canSlide ? onPointerUp : undefined}
          >
            <ul
              ref={trackRef}
              className="case-stories__track"
              aria-label={locale === 'en' ? 'Testimonials' : 'Testimonios'}
            >
              {stories.map((story, index) => {
                const portrait = imageFor(story, index);
                return (
                  <li key={`${story.client}-${story.name}`} className="case-stories__slide">
                    <article className="case-story">
                      <div className="case-story__cover">
                        <img
                          src={coverFor(story, index)}
                          alt={story.cover ? story.client : ''}
                          draggable={false}
                        />
                      </div>
                      <div className="case-story__body">
                        <div className="case-story__person">
                          <img className="case-story__avatar" src={portrait} alt="" draggable={false} />
                          <div className="case-story__identity">
                            <p className="case-story__name">{story.name}</p>
                            {story.client ? <p className="case-story__client">{story.client}</p> : null}
                            {story.role ? <p className="case-story__role">{story.role}</p> : null}
                          </div>
                        </div>
                        <p className="case-story__quote">{story.quote}</p>
                        <Button
                          href={story.href ?? portfolioHref}
                          variant="secondary"
                          size="sm"
                          glow={false}
                          className="case-story__cta no-underline"
                        >
                          {ctaLabel}
                        </Button>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </SectionBand>
  );
}
