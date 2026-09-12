import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
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
  stats: CaseStoryStat[];
  photo?: string;
};

type CaseStoriesProps = {
  stories?: CaseStory[];
  eyebrow?: string;
  title?: string;
  description?: string;
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
    role: 'CMO, Pulse',
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
    role: 'Director comercial, Norte Industrial',
    stats: [
      { value: '3.4×', label: 'RFQs calificadas' },
      { value: '−28%', label: 'CAC de search' },
    ],
  },
  {
    client: 'Marina Bay',
    quote:
      'No apagamos Booking. Aprendimos a no pagarle las noches que el huésped ya nos buscaba por nombre.',
    name: 'Laura Chen',
    role: 'Revenue manager, Marina Bay',
    stats: [
      { value: '+22%', label: 'reserva directa' },
      { value: '−9 pts', label: 'comisión OTA sobre occupancy' },
    ],
  },
  {
    client: 'Clínica Aurora',
    quote:
      'Dejamos de llenar la sala de espera para verse ocupados. Ahora la agenda es más corta y más valiosa.',
    name: 'Dra. Elena Ruiz',
    role: 'Directora, Clínica Aurora',
    stats: [
      { value: '−35%', label: 'no-show' },
      { value: '+41%', label: 'citas de especialidad objetivo' },
    ],
  },
];

const DRAG_ARM = 8;
const SWIPE_THRESHOLD = 56;
const PORTFOLIO_HREF = '/portafolio';

function visibleCount() {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth < 700) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

function trackGap(track: HTMLElement) {
  const value = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap);
  return Number.isFinite(value) ? value : 20;
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function photoFor(story: CaseStory, index: number) {
  return story.photo ?? PHOTO_FALLBACKS[story.client] ?? `https://i.pravatar.cc/900?img=${5 + index * 7}`;
}

/**
 * Casos como slider de cards — foto, quote, métricas, persona.
 */
export function CaseStories({
  stories = DEFAULT_STORIES,
  eyebrow = 'Casos',
  title = 'Resultados propios, solo con empresas consolidadas',
  description = 'Cliente, industria y outcome. Sin portfolio ornamental.',
}: CaseStoriesProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [perView, setPerView] = useState(3);
  const drag = useRef({
    pointerId: -1,
    startX: 0,
    origin: 0,
    delta: 0,
    dragging: false,
  });

  const lastIndex = Math.max(stories.length - perView, 0);
  const goTo = useCallback(
    (next: number) => {
      setActiveIndex(Math.max(0, Math.min(lastIndex, next)));
    },
    [lastIndex],
  );

  const layoutSlides = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const nextView = visibleCount();
    setPerView(nextView);
    const gap = trackGap(track);
    const width = (track.parentElement?.clientWidth ?? track.clientWidth) + 0;
    const slideW = (width - gap * (nextView - 1)) / nextView;
    track.style.setProperty('--case-slide-w', `${slideW}px`);
    track.style.setProperty('--case-gap', `${gap}px`);
  }, []);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      layoutSlides();
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
        layoutSlides();
        setActiveIndex((current) => Math.min(current, Math.max(stories.length - visibleCount(), 0)));
      };
      window.addEventListener('resize', onResize);
      layoutSlides();
      return () => window.removeEventListener('resize', onResize);
    },
    { scope: rootRef, dependencies: [stories.length] },
  );

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
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

  return (
    <SectionBand id="casos" tone="ink" className="case-stories-band">
      <div className="case-stories__wash" aria-hidden="true">
        <span className="case-stories__blob case-stories__blob--a" />
        <span className="case-stories__blob case-stories__blob--b" />
        <span className="case-stories__blob case-stories__blob--c" />
      </div>

      <div ref={rootRef} className="case-stories">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          align="center"
          tone="on-ink"
        />

        <div
          className="case-stories__stage"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <ul ref={trackRef} className="case-stories__track" aria-label="Casos de éxito">
            {stories.map((story, index) => (
              <li key={`${story.client}-${story.name}`} className="case-stories__slide">
                <article className="case-story">
                  <div className="case-story__photo">
                    <img src={photoFor(story, index)} alt="" draggable={false} />
                    <span className="case-story__mark">{story.client}</span>
                  </div>
                  <div className="case-story__body">
                    <p className="case-story__quote">“{story.quote}”</p>
                    {story.stats.length ? (
                      <dl className="case-story__stats">
                        {story.stats.slice(0, 2).map((stat) => (
                          <div key={`${stat.value}-${stat.label}`} className="case-story__stat">
                            <dt className="sr-only">{stat.label}</dt>
                            <dd>
                              <span className="case-story__stat-value">{stat.value}</span>
                              {` ${stat.label}`}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}
                    <div className="case-story__footer">
                      <div className="case-story__person">
                        <p className="case-story__name">{story.name}</p>
                        <p className="case-story__role">{story.role}</p>
                      </div>
                      <a href={PORTFOLIO_HREF} className="case-story__cta">
                        Ver caso →
                      </a>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>

        {lastIndex > 0 ? (
          <div className="case-stories__nav">
            <button
              type="button"
              className="case-stories__arrow"
              aria-label="Casos anteriores"
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
              aria-label="Casos siguientes"
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
        ) : null}
      </div>
    </SectionBand>
  );
}
