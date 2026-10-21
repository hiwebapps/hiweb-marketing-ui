import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

type Locale = 'es' | 'en';

type TourStep = {
  id: string;
  target?: string;
  title: string;
  body: string;
};

const TOUR: Record<Locale, TourStep[]> = {
  es: [
    {
      id: 'welcome',
      title: 'Así apruebas como cliente',
      body: 'Cinco puntos dentro de esta ventana. Avanza cuando quieras, o deja que la guía siga sola.',
    },
    {
      id: 'pending',
      target: 'pending',
      title: 'Tus pendientes en un número',
      body: 'Aquí ves todas tus redes, páginas y artículos que esperan tu visto bueno.',
    },
    {
      id: 'band',
      target: 'band',
      title: 'Tu mes, de un vistazo',
      body: 'Tus piezas, páginas y reportes organizados con fechas claras de publicación.',
    },
    {
      id: 'social',
      target: 'social',
      title: 'Cada entrega, con contexto',
      body: 'Formato, fecha de salida y ronda de revisión en la misma fila.',
    },
    {
      id: 'approve',
      target: 'approve',
      title: 'Aprobación en un clic',
      body: 'Dejas una nota puntual o das tu visto bueno. Tu equipo en Hiweb lo recibe de inmediato.',
    },
    {
      id: 'web',
      target: 'web',
      title: 'Sitio web y blog, todo centralizado',
      body: 'Tus páginas y artículos SEO listos para revisión junto a tus redes sociales.',
    },
    {
      id: 'end',
      title: 'Transparencia y agilidad',
      body: 'Tú tienes el control en un clic. Nosotros nos encargamos de que tu marketing nunca se detenga.',
    },
  ],
  en: [
    {
      id: 'welcome',
      title: 'How you approve as a client',
      body: 'Five key features inside this window. Move ahead when you want, or let the guide continue on its own.',
    },
    {
      id: 'pending',
      target: 'pending',
      title: 'Your pending items at a glance',
      body: 'See all your social posts, web pages, and articles waiting for your sign-off.',
    },
    {
      id: 'band',
      target: 'band',
      title: 'Your month, organized',
      body: 'Posts, pages, and reports scheduled with clear publish dates.',
    },
    {
      id: 'social',
      target: 'social',
      title: 'Every deliverable, with context',
      body: 'Format, publish date, and review round all in one place.',
    },
    {
      id: 'approve',
      target: 'approve',
      title: 'Approval in one click',
      body: 'Leave a pinpoint comment or give your sign-off. Your Hiweb team receives it instantly.',
    },
    {
      id: 'web',
      target: 'web',
      title: 'Website and blog, all in one queue',
      body: 'Your web pages and SEO articles ready for review alongside your social media.',
    },
    {
      id: 'end',
      title: 'Transparency and speed',
      body: 'You stay in control with one click. We ensure your marketing keeps moving forward.',
    },
  ],
};

const UI = {
  es: { start: 'Empezar', next: 'Siguiente', back: 'Atrás', done: 'Listo', close: 'Cerrar' },
  en: { start: 'Start', next: 'Next', back: 'Back', done: 'Done', close: 'Close' },
} as const;

type Rect = { x: number; y: number; width: number; height: number };
type Side = 'right' | 'left' | 'bottom';

type Layout = {
  centered: boolean;
  sheet: boolean;
  rect: Rect | null;
  left: number;
  top: number;
  side: Side;
};

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function PortalTour({
  open,
  step,
  session,
  locale,
  frameRef,
  onStep,
  onClose,
}: {
  open: boolean;
  step: number;
  session: number;
  locale: Locale;
  frameRef: RefObject<HTMLElement | null>;
  onStep: (next: number) => void;
  onClose: () => void;
}) {
  const steps = TOUR[locale];
  const ui = UI[locale];
  const current = steps[step];
  const featureSteps = steps.filter((item) => item.target);
  const featureIndex = current?.target ? featureSteps.findIndex((item) => item.id === current.id) : -1;
  const [auto, setAuto] = useState(true);
  const [layout, setLayout] = useState<Layout | null>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAuto(true);
  }, [session]);

  const measure = () => {
    const frame = frameRef.current;
    const card = cardRef.current;
    if (!open || !frame || !current) return;
    const narrow = frame.clientWidth < 720;
    if (!current.target) {
      frame.scrollIntoView({ block: 'center', behavior: 'auto' });
      setLayout({ centered: true, sheet: false, rect: null, left: 0, top: 0, side: 'bottom' });
      return;
    }
    const el = frame.querySelector<HTMLElement>(`[data-tour="${current.target}"]`);
    if (!el) {
      frame.scrollIntoView({ block: 'center', behavior: 'auto' });
      setLayout({ centered: true, sheet: false, rect: null, left: 0, top: 0, side: 'bottom' });
      return;
    }
    const scroller = frame.querySelector<HTMLElement>('.mw-window-body');
    if (scroller) {
      const before = el.getBoundingClientRect();
      const view = scroller.getBoundingClientRect();
      if (before.top < view.top + 12 || before.bottom > view.bottom - 12) {
        scroller.scrollTop += before.top - view.top - (view.height - before.height) / 2;
      }
    }
    const placed = el.getBoundingClientRect();
    const mid = placed.top + placed.height / 2;
    if (placed.top < 96 || placed.bottom > window.innerHeight - 96) {
      window.scrollBy({ top: mid - window.innerHeight / 2, behavior: 'auto' });
    }

    // Punto 05 / 05: Forzar scroll del viewport hacia abajo para que el card del tour y la fila objetivo queden totalmente visibles
    if (current.id === 'web' || featureIndex === 4) {
      setTimeout(() => {
        const targetRect = el.getBoundingClientRect();
        const cardEl = cardRef.current;
        const cardRect = cardEl?.getBoundingClientRect();
        const bottomEdge = Math.max(targetRect.bottom, cardRect?.bottom ?? 0);
        const desiredLimit = window.innerHeight - 60;
        if (bottomEdge > desiredLimit) {
          window.scrollBy({ top: bottomEdge - desiredLimit + 80, behavior: 'smooth' });
        } else if (targetRect.top > window.innerHeight * 0.45) {
          window.scrollBy({ top: targetRect.top - window.innerHeight * 0.4, behavior: 'smooth' });
        }
      }, 50);
    }
    const frameBox = frame.getBoundingClientRect();
    const target = el.getBoundingClientRect();
    const pad = 8;
    const rect = {
      x: target.left - frameBox.left - pad,
      y: target.top - frameBox.top - pad,
      width: target.width + pad * 2,
      height: target.height + pad * 2,
    };
    if (narrow || !card) {
      setLayout({ centered: false, sheet: true, rect, left: 0, top: 0, side: 'bottom' });
      return;
    }
    const gap = 16;
    const cardW = card.offsetWidth || 300;
    const cardH = card.offsetHeight || 180;
    let left = rect.x + rect.width + gap;
    let top = rect.y;
    let side: Side = 'right';
    if (left + cardW > frameBox.width - 12) {
      left = rect.x - gap - cardW;
      side = 'left';
    }
    if (left < 12) {
      left = Math.max(12, Math.min(rect.x, frameBox.width - cardW - 12));
      top = rect.y + rect.height + gap;
      side = 'bottom';
    }
    top = Math.min(Math.max(12, top), frameBox.height - cardH - 12);
    left = Math.min(Math.max(12, left), frameBox.width - cardW - 12);
    setLayout({ centered: false, sheet: false, rect, left, top, side });
  };

  useLayoutEffect(() => {
    measure();
  }, [open, step, session, locale]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!open || !frame) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(frame);
    return () => observer.disconnect();
  }, [open, step, session, locale]);

  useGSAP(() => {
    const spot = spotRef.current;
    const card = cardRef.current;
    if (!open || !spot || !card || !layout) return;
    const still = reducedMotion();
    if (layout.centered || !layout.rect) {
      gsap.set(card, { clearProps: 'left,top,transform' });
      gsap.to(spot, { autoAlpha: 0, duration: still ? 0 : 0.25 });
      gsap.fromTo(card, { autoAlpha: 0 }, { autoAlpha: 1, duration: still ? 0 : 0.4, ease: 'power3.out' });
      return;
    }
    gsap.to(spot, {
      x: layout.rect.x,
      y: layout.rect.y,
      width: layout.rect.width,
      height: layout.rect.height,
      autoAlpha: 1,
      duration: still ? 0 : 0.55,
      ease: 'power3.out',
    });
    if (layout.sheet) {
      gsap.set(card, { clearProps: 'left,top,transform' });
      gsap.fromTo(card, { autoAlpha: 0 }, { autoAlpha: 1, duration: still ? 0 : 0.4, ease: 'power3.out' });
      return;
    }
    gsap.fromTo(
      card,
      { autoAlpha: 0, y: still ? 0 : 8 },
      { autoAlpha: 1, y: 0, left: layout.left, top: layout.top, duration: still ? 0 : 0.45, ease: 'power3.out' },
    );
  }, { dependencies: [layout, open], scope: rootRef });

  const last = step >= steps.length - 1;
  const first = step <= 0;

  const goNext = () => {
    if (last) onClose();
    else onStep(step + 1);
  };

  const goBack = () => {
    if (!first) onStep(step - 1);
  };

  useEffect(() => {
    if (!open || !auto) return;
    const id = window.setTimeout(goNext, 5000);
    return () => window.clearTimeout(id);
  }, [open, auto, step]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAuto(false);
        onClose();
      } else if (event.key === 'ArrowRight') {
        setAuto(false);
        goNext();
      } else if (event.key === 'ArrowLeft') {
        setAuto(false);
        goBack();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, step]);

  if (!open || !current) return null;

  const centered = !current.target || layout?.centered;
  const primary = current.id === 'welcome' ? ui.start : last ? ui.done : ui.next;

  return (
    <div
      ref={rootRef}
      className={['portal-tour', centered ? 'is-center' : '', layout?.sheet ? 'is-sheet' : ''].filter(Boolean).join(' ')}
      onClick={() => {
        setAuto(false);
        goNext();
      }}
    >
      <div ref={spotRef} className="portal-tour__spot" aria-hidden="true">
        <span className="portal-tour__ring" />
      </div>
      <div
        ref={cardRef}
        className={['portal-tour__card', centered ? 'is-center' : '', layout?.sheet ? 'is-sheet' : ''].filter(Boolean).join(' ')}
        style={layout && !layout.centered && !layout.sheet ? { left: layout.left, top: layout.top } : undefined}
        role="dialog"
        aria-modal="true"
        aria-labelledby="portal-tour-title"
        data-side={layout?.side || 'bottom'}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="portal-tour__card-top">
          {featureIndex >= 0 ? (
            <span className="portal-tour__count">{String(featureIndex + 1).padStart(2, '0')} / {String(featureSteps.length).padStart(2, '0')}</span>
          ) : <span />}
          <button
            type="button"
            className="portal-tour__close"
            onClick={() => {
              setAuto(false);
              onClose();
            }}
          >
            {ui.close}
          </button>
        </div>
        <h3 id="portal-tour-title">{current.title}</h3>
        <p>{current.body}</p>
        <div className="portal-tour__actions">
          {current.target ? (
            <button
              type="button"
              onClick={() => {
                setAuto(false);
                goBack();
              }}
            >
              {ui.back}
            </button>
          ) : null}
          <button
            type="button"
            className="is-primary"
            onClick={() => {
              setAuto(false);
              goNext();
            }}
          >
            {primary}
          </button>
        </div>
      </div>
    </div>
  );
}
