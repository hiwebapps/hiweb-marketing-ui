import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { HOME_FAQ_CATEGORIES } from '../../data/site';
import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';
import './FaqSection.css';

gsap.registerPlugin(useGSAP);

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqCategory = {
  id: string;
  label: string;
  items: readonly FaqItem[];
};

type FaqSectionProps = {
  categories?: readonly FaqCategory[];
  items?: readonly FaqItem[];
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: 'canvas' | 'surface';
  withSchema?: boolean;
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

function itemParts(root: HTMLElement, index: number) {
  const el = root.querySelectorAll<HTMLElement>('.faq__item')[index];
  if (!el) return null;
  const panel = el.querySelector<HTMLElement>('.faq__panel');
  const answer = el.querySelector<HTMLElement>('.faq__answer');
  const chevron = el.querySelector<HTMLElement>('.faq__chevron');
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

function FaqAccordion({
  items,
  name,
}: {
  items: readonly FaqItem[];
  name: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(0);
  const [openIndex, setOpenIndex] = useState(0);
  const [ready, setReady] = useState(false);

  const { contextSafe } = useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      gsap.utils.toArray<HTMLElement>('.faq__item', root).forEach((el, index) => {
        const panel = el.querySelector<HTMLElement>('.faq__panel');
        const answer = el.querySelector<HTMLElement>('.faq__answer');
        const chevron = el.querySelector<HTMLElement>('.faq__chevron');
        if (!panel || !answer || !chevron) return;
        const isOpen = index === 0;
        gsap.set(panel, { height: isOpen ? 'auto' : 0, overflow: 'hidden' });
        gsap.set(answer, { opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 10, visibility: 'visible' });
        gsap.set(chevron, { rotation: isOpen ? -90 : 90, transformOrigin: '50% 50%' });
      });

      setReady(true);
    },
    { scope: rootRef, dependencies: [items] },
  );

  const toggle = contextSafe((index: number) => {
    const root = rootRef.current;
    if (!root) return;
    const next = openRef.current === index ? -1 : index;
    if (openRef.current >= 0 && openRef.current !== next) {
      closeItem(root, openRef.current);
    }
    if (next >= 0) openItem(root, next);
    openRef.current = next;
    setOpenIndex(next);
  });

  return (
    <div ref={rootRef} className={ready ? 'faq__list is-ready' : 'faq__list'}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const questionId = `${name}-q-${index}`;
        const panelId = `${name}-a-${index}`;

        return (
          <div key={item.question} className={isOpen ? 'faq__item is-open' : 'faq__item'}>
            <button
              type="button"
              id={questionId}
              className="faq__question"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(index)}
            >
              <span>{item.question}</span>
              <IconChevron className="faq__chevron" />
            </button>
            <div
              id={panelId}
              className="faq__panel"
              role="region"
              aria-labelledby={questionId}
              aria-hidden={!isOpen}
            >
              <p className="faq__answer">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * FAQ — categorías + acordeón. Emite FAQPage schema cuando withSchema=true.
 */
export function FaqSection({
  categories,
  items,
  eyebrow = 'FAQ',
  title = '¿Quieres saber más?',
  description,
  tone = 'canvas',
  withSchema = false,
}: FaqSectionProps) {
  const groups: readonly FaqCategory[] =
    categories ??
    (items
      ? [{ id: 'preguntas', label: 'Preguntas', items }]
      : HOME_FAQ_CATEGORIES);

  const showNav = groups.length > 1;
  const [activeId, setActiveId] = useState(groups[0]?.id ?? '');
  const active = groups.find((group) => group.id === activeId) ?? groups[0];
  const schemaItems = groups.flatMap((group) => group.items);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: schemaItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  if (!active) return null;

  return (
    <SectionBand id="faq" tone={tone}>
      {withSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ) : null}

      <SectionHeader eyebrow={eyebrow} title={title} description={description} badgeVariant="orange" />

      <div className={showNav ? 'faq faq--split' : 'faq'}>
        {showNav ? (
          <nav className="faq__nav" aria-label="Categorías de preguntas">
            {groups.map((group) => {
              const isActive = group.id === active.id;

              return (
                <button
                  key={group.id}
                  type="button"
                  className={isActive ? 'faq__cat is-active' : 'faq__cat'}
                  aria-pressed={isActive}
                  onClick={(event) => {
                    setActiveId(group.id);
                    event.currentTarget.scrollIntoView({
                      inline: 'center',
                      block: 'nearest',
                      behavior: 'smooth',
                    });
                  }}
                >
                  <span>{group.label}</span>
                  <IconChevron className="faq__cat-chevron" />
                </button>
              );
            })}
          </nav>
        ) : null}

        <FaqAccordion key={active.id} items={active.items} name={`faq-${active.id}`} />
      </div>
    </SectionBand>
  );
}
