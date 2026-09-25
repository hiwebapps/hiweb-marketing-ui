import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { PillarIcon } from '../icons/PillarIcons';
import type { ServiceFocusItem } from '../../data/service-focus';
import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';
import './ServiceFocus.css';

gsap.registerPlugin(useGSAP);

type ServiceFocusProps = {
  items: readonly ServiceFocusItem[];
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: 'canvas' | 'surface';
};

function IconChevron({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6 3.5 11 8l-5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function motion(seconds: number) {
  return prefersReducedMotion() ? 0 : seconds;
}

function isMobileLayout() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 860px)').matches;
}

function itemParts(root: HTMLElement, index: number) {
  const el = root.querySelectorAll<HTMLElement>('.service-focus__item')[index];
  if (!el) return null;
  const panel = el.querySelector<HTMLElement>('.service-focus__panel');
  const answer = el.querySelector<HTMLElement>('.service-focus__answer');
  const chevron = el.querySelector<HTMLElement>('.service-focus__chevron');
  if (!panel || !answer || !chevron) return null;
  return { panel, answer, chevron };
}

function closeItem(root: HTMLElement, index: number) {
  const parts = itemParts(root, index);
  if (!parts) return;
  const { panel, answer, chevron } = parts;
  gsap.killTweensOf([panel, answer, chevron]);
  const d = motion(1);
  gsap
    .timeline({ defaults: { overwrite: 'auto' } })
    .to(answer, { opacity: 0, y: -6, duration: 0.2 * d, ease: 'power2.in', visibility: 'visible' }, 0)
    .to(panel, { height: 0, duration: 0.42 * d, ease: 'power3.inOut' }, 0.02 * d)
    .to(chevron, { rotation: 90, duration: 0.36 * d, ease: 'power3.inOut' }, 0);
}

function openItem(root: HTMLElement, index: number) {
  const parts = itemParts(root, index);
  if (!parts) return;
  const { panel, answer, chevron } = parts;
  gsap.killTweensOf([panel, answer, chevron]);
  const d = motion(1);
  gsap
    .timeline({ defaults: { overwrite: 'auto' } })
    .to(panel, { height: 'auto', duration: 0.52 * d, ease: 'power3.out' }, 0)
    .fromTo(
      answer,
      { opacity: 0, y: 12, visibility: 'visible' },
      { opacity: 1, y: 0, duration: 0.4 * d, ease: 'power2.out' },
      0.08 * d,
    )
    .to(chevron, { rotation: -90, duration: 0.44 * d, ease: 'power3.out' }, 0);
}

function FocusCopy({ item }: { item: ServiceFocusItem }) {
  return (
    <span className="service-focus__copy">
      <span className="service-focus__tab-title">{item.title}</span>
      <span className="service-focus__tab-summary">{item.summary}</span>
    </span>
  );
}

function FocusDetail({ item }: { item: ServiceFocusItem }) {
  return (
    <>
      <h3 className="service-focus__detail-title">{item.detailTitle}</h3>
      <p className="service-focus__detail">{item.detail}</p>
      <figure className="service-focus__figure">
        <img src={item.image} alt={item.imageAlt} width={960} height={640} loading="lazy" />
      </figure>
    </>
  );
}

export function ServiceFocus({
  items,
  eyebrow = 'Cómo se ejecuta',
  title = 'Cuatro frentes del mismo servicio',
  description = 'Elige un frente. A la derecha está lo que hacemos en concreto, no el nombre del paquete.',
  tone = 'canvas',
}: ServiceFocusProps) {
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(0);
  const [openIndex, setOpenIndex] = useState(0);
  const current = items[active] ?? items[0];

  const { contextSafe } = useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const apply = () => {
        if (!isMobileLayout()) {
          root.classList.remove('is-ready');
          return;
        }
        gsap.utils.toArray<HTMLElement>('.service-focus__item', root).forEach((el, index) => {
          const panel = el.querySelector<HTMLElement>('.service-focus__panel');
          const answer = el.querySelector<HTMLElement>('.service-focus__answer');
          const chevron = el.querySelector<HTMLElement>('.service-focus__chevron');
          if (!panel || !answer || !chevron) return;
          const isOpen = index === openRef.current;
          gsap.set(panel, { height: isOpen ? 'auto' : 0, overflow: 'hidden' });
          gsap.set(answer, { opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 10, visibility: 'visible' });
          gsap.set(chevron, { rotation: isOpen ? -90 : 90, transformOrigin: '50% 50%' });
        });
        root.classList.add('is-ready');
      };

      apply();
      const query = window.matchMedia('(max-width: 860px)');
      query.addEventListener('change', apply);
      return () => query.removeEventListener('change', apply);
    },
    { scope: rootRef, dependencies: [items] },
  );

  const toggle = contextSafe((index: number) => {
    const root = rootRef.current;
    if (!root || !isMobileLayout()) return;
    const next = openRef.current === index ? -1 : index;
    if (openRef.current >= 0 && openRef.current !== next) closeItem(root, openRef.current);
    if (next >= 0) openItem(root, next);
    openRef.current = next;
    setOpenIndex(next);
  });

  if (!current) return null;

  return (
    <SectionBand id="ejecucion" tone={tone}>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        badgeVariant="purple"
        align="center"
        constrained={false}
      />
      <div ref={rootRef} className="service-focus">
        <div className="service-focus__board">
          <div className="service-focus__tabs" role="tablist" aria-label="Frentes del servicio">
            {items.map((item, index) => {
              const selected = index === active;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`service-focus-tab-${item.id}`}
                  className={selected ? 'service-focus__tab is-active' : 'service-focus__tab'}
                  aria-selected={selected}
                  aria-controls="service-focus-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(index)}
                >
                  <span className="service-focus__icon" aria-hidden="true">
                    <PillarIcon name={item.icon} />
                  </span>
                  <FocusCopy item={item} />
                  <IconChevron className="service-focus__tab-chevron" />
                </button>
              );
            })}
          </div>
          <div
            id="service-focus-panel"
            role="tabpanel"
            aria-labelledby={`service-focus-tab-${current.id}`}
            className="service-focus__stage"
          >
            <div key={current.id} className="service-focus__stage-body">
              <FocusDetail item={current} />
            </div>
          </div>
        </div>

        <div className="service-focus__list">
          {items.map((item, index) => {
            const isOpen = index === openIndex;
            return (
              <div key={item.id} className={isOpen ? 'service-focus__item is-open' : 'service-focus__item'}>
                <button
                  type="button"
                  className="service-focus__trigger"
                  aria-expanded={isOpen}
                  onClick={() => toggle(index)}
                >
                  <span className="service-focus__icon" aria-hidden="true">
                    <PillarIcon name={item.icon} />
                  </span>
                  <FocusCopy item={item} />
                  <IconChevron className="service-focus__chevron" />
                </button>
                <div className="service-focus__panel">
                  <div className="service-focus__answer">
                    <FocusDetail item={item} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionBand>
  );
}
