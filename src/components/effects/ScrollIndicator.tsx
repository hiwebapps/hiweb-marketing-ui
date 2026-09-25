import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './ScrollIndicator.css';

type ScrollIndicatorProps = {
  className?: string;
  /** Track a parent `[data-scroll-demo]` instead of the document. */
  contained?: boolean;
};

type Mark = {
  key: string;
  label: string;
  t: number;
  offset: number;
  targetId?: string;
};

const SECTION_LABELS: Record<string, string> = {
  inicio: 'Inicio',
  diferenciadores: 'Pilares',
  servicios: 'Servicios',
  industrias: 'Industrias',
  casos: 'Casos',
  proceso: 'Proceso',
  'como-trabajamos': 'Método',
  nosotros: 'Nosotros',
  faq: 'FAQ',
  ejecucion: 'Ejecución',
  propuesta: 'Propuesta',
  'por-que': 'Por qué',
  precios: 'Precios',
  contacto: 'Contacto',
  problema: 'Problema',
  engagement: 'Fit',
  directo: 'Directo',
  despues: 'Después',
  ubicacion: 'Ubicación',
  primitives: 'Base',
};

function scrollMax(scroller: HTMLElement | Window) {
  if (scroller instanceof Window) {
    return document.documentElement.scrollHeight - window.innerHeight;
  }
  return scroller.scrollHeight - scroller.clientHeight;
}

function docHeight(scroller: HTMLElement | Window) {
  return scroller instanceof Window ? document.documentElement.scrollHeight : scroller.scrollHeight;
}

function viewport(scroller: HTMLElement | Window) {
  return scroller instanceof Window ? window.innerHeight : scroller.clientHeight;
}

function scrollTop(scroller: HTMLElement | Window) {
  return scroller instanceof Window ? window.scrollY : scroller.scrollTop;
}

function progressFrom(scroller: HTMLElement | Window) {
  const max = scrollMax(scroller);
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, scrollTop(scroller) / max));
}

function offsetTop(el: HTMLElement, scroller: HTMLElement | Window) {
  if (scroller instanceof Window) {
    return el.getBoundingClientRect().top + window.scrollY;
  }
  const root = scroller.getBoundingClientRect().top;
  return el.getBoundingClientRect().top - root + scroller.scrollTop;
}

function prettyId(id: string) {
  return id.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function labelFor(el: HTMLElement) {
  const id = el.id;
  const data = el.getAttribute('data-scroll-section');
  if (data && data !== id && SECTION_LABELS[data]) return SECTION_LABELS[data];
  if (data && data !== id) return data;
  if (id && SECTION_LABELS[id]) return SECTION_LABELS[id];
  return prettyId(id || data || 'Sección');
}

function sectionNodes(scroller: HTMLElement | Window) {
  const scope = scroller instanceof Window ? document : scroller;
  return [...scope.querySelectorAll<HTMLElement>('[data-scroll-section]')].filter(
    (el, index, all) =>
      all.indexOf(el) === index &&
      el.offsetHeight > 40 &&
      (scroller instanceof Window ? !el.closest('[data-scroll-demo]') : true),
  );
}

function collectMarks(scroller: HTMLElement | Window): Mark[] {
  const nodes = sectionNodes(scroller);
  const height = docHeight(scroller);
  if (!nodes.length || height <= 0) return [];

  return nodes
    .map((el, index) => {
      const top = offsetTop(el, scroller);
      const label = labelFor(el);
      return {
        key: `${el.id || label}-start-${index}`,
        label,
        offset: top,
        t: Math.min(1, Math.max(0, top / height)),
        targetId: el.id || undefined,
      };
    })
    .sort((a, b) => a.offset - b.offset);
}

function readLine(scroller: HTMLElement | Window) {
  return scrollTop(scroller) + viewport(scroller) * 0.28;
}

/**
 * Gradient vertical reading meter with section checkpoints.
 */
const MOBILE_SCROLL_QUERY = '(max-width: 767px)';

function useDesktopScrollRail(enabled: boolean) {
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setActive(true);
      return;
    }
    const media = window.matchMedia(MOBILE_SCROLL_QUERY);
    const sync = () => setActive(!media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, [enabled]);

  return active;
}

export function ScrollIndicator({ className = '', contained = false }: ScrollIndicatorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [progress, setProgress] = useState(0);
  const [readY, setReadY] = useState(0);
  const showRail = useDesktopScrollRail(!contained);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !showRail) return;

    const scroller = contained ? root.closest<HTMLElement>('[data-scroll-demo]') : null;
    const target: HTMLElement | Window = scroller ?? window;
    let frame = 0;

    const paint = () => {
      const value = progressFrom(target);
      root.style.setProperty('--hw-scroll-p', String(value));
      root.setAttribute('aria-valuenow', String(Math.round(value * 100)));
      setProgress(value);
      setReadY(readLine(target));
    };

    const update = () => {
      frame = 0;
      paint();
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    const refresh = () => {
      setMarks(collectMarks(target));
      update();
    };

    target.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', refresh, { passive: true });

    const observed = target instanceof Window ? document.documentElement : target;
    const observer = new ResizeObserver(refresh);
    observer.observe(observed);

    const later = window.setTimeout(refresh, 700);
    refresh();

    return () => {
      target.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', refresh);
      observer.disconnect();
      window.clearTimeout(later);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [contained, showRail]);

  if (!showRail) return null;

  const jump = (mark: Mark) => {
    const root = rootRef.current;
    if (!root) return;
    const scroller = contained ? root.closest<HTMLElement>('[data-scroll-demo]') : null;
    if (scroller) {
      scroller.scrollTo({ top: mark.offset, behavior: 'smooth' });
      return;
    }
    if (mark.targetId) {
      document.getElementById(mark.targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    window.scrollTo({ top: Math.max(0, mark.offset - 96), behavior: 'smooth' });
  };

  const currentKey = [...marks].filter((mark) => readY >= mark.offset - 8).at(-1)?.key;

  return (
    <div
      ref={rootRef}
      className={['hw-scroll-indicator', contained ? 'hw-scroll-indicator--contained' : '', className]
        .filter(Boolean)
        .join(' ')}
      role="progressbar"
      aria-label="Progreso de lectura"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      <div className="hw-scroll-indicator__track">
        <div className="hw-scroll-indicator__fill" />
      </div>
      {progress > 0.01 ? <span className="hw-scroll-indicator__tip" aria-hidden="true" /> : null}
      <ol className="hw-scroll-indicator__marks">
        {marks.map((mark) => {
          const passed = readY >= mark.offset - 8;
          const current = mark.key === currentKey;
          return (
            <li key={mark.key}>
              <button
                type="button"
                className={[
                  'hw-scroll-indicator__mark',
                  passed ? 'is-passed' : '',
                  current ? 'is-active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{ '--t': mark.t } as CSSProperties}
                aria-label={mark.label}
                onClick={() => jump(mark)}
              >
                <span className="hw-scroll-indicator__dot" />
                <span className="hw-scroll-indicator__label">{mark.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

const DEMO_SECTIONS = [
  {
    id: 'demo-intro',
    label: 'Intro',
    copy: [
      'El riel vive a la derecha. El fill usa purple → cyan → orange.',
      'Los cuadrados marcan el arranque de cada section.',
    ],
  },
  {
    id: 'demo-track',
    label: 'Track',
    copy: [
      'Al pasar un checkpoint, se enciende. El actual se agranda con glow.',
      'Hacé hover para el nombre. Click para saltar a ese tramo.',
    ],
  },
  {
    id: 'demo-cierre',
    label: 'Cierre',
    copy: [
      'El tip blanco recorre la barra con el scroll. En el sitio real lee las sections de la página.',
      'Patrón FreeFrontend, resuelto con tokens Hiweb.',
    ],
  },
] as const;

export function ScrollIndicatorDemo() {
  return (
    <div data-scroll-demo className="hw-scroll-demo">
      <ScrollIndicator contained />
      {DEMO_SECTIONS.map((section) => (
        <div
          key={section.id}
          id={section.id}
          data-scroll-section={section.label}
          className="hw-scroll-demo__block"
        >
          <p className="mb-2 font-display text-xs tracking-[0.16em] text-muted uppercase">{section.label}</p>
          {section.copy.map((paragraph) => (
            <p key={paragraph} className="hw-scroll-demo__copy !text-sm text-ink-soft">
              {paragraph}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
