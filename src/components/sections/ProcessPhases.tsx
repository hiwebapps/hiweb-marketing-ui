import { useRef, type CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MOTION } from '../../lib/motion';
import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';
import './ProcessPhases.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type ProcessIconName = 'search' | 'spark' | 'play' | 'trend';
export type ProcessAccent = 'purple' | 'cyan' | 'orange' | 'lime' | 'green';

export type ProcessPhase = {
  index: string;
  title: string;
  description: string;
  icon?: ProcessIconName;
  accent?: ProcessAccent;
};

type ProcessPhasesProps = {
  phases: ProcessPhase[];
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: 'canvas' | 'surface';
};

const ACCENTS: ProcessAccent[] = ['purple', 'cyan', 'orange', 'lime'];

const ACCENT_HEX: Record<ProcessAccent, string> = {
  purple: '#927afe',
  cyan: '#01e7ff',
  orange: '#fe621c',
  lime: '#dbe64c',
  green: '#74c465',
};

const ICON_MAP = {
  search: IconSearch,
  spark: IconSpark,
  play: IconPlay,
  trend: IconTrend,
};

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16.5 20 20.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconSpark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4.5 13.4 9l4.6.4-3.5 3.1 1.1 4.5L12 14.7 8.4 17l1.1-4.5L6 9.4 10.6 9 12 4.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4.5" y="4.5" width="15" height="15" rx="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 8.8v6.4l5.4-3.2L10 8.8Z" fill="currentColor" />
    </svg>
  );
}

function IconTrend() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 16.5 9 12l3.2 3.2 7.3-7.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14.5 7.5h5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ICONS = [IconSearch, IconSpark, IconPlay, IconTrend];

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isStackedLayout() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches;
}

export function ProcessPhases({
  phases,
  eyebrow = 'Proceso',
  title = 'De la auditoría a la optimización',
  description = 'Cuatro fases. Un sistema. El mismo criterio de evidencia en cada ciclo.',
  tone = 'canvas',
}: ProcessPhasesProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const count = Math.max(phases.length, 1);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) return;

      const stacked = isStackedLayout();
      const paths = root.querySelectorAll<HTMLElement>('.proceso__path');
      const dots = root.querySelectorAll<HTMLElement>('.proceso__dot');
      const icons = root.querySelectorAll<HTMLElement>('.proceso__icon');
      const copies = root.querySelectorAll<HTMLElement>('.proceso__copy');

      gsap.set(paths, stacked
        ? { scaleY: 0, scaleX: 1, transformOrigin: 'center top' }
        : { scaleX: 0, scaleY: 1, transformOrigin: 'left center' });
      gsap.set(dots, { scale: 0 });
      gsap.set(icons, { scale: 0.72, autoAlpha: 0 });
      gsap.set(copies, { y: 18, autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: MOTION.ease },
        scrollTrigger: {
          trigger: root,
          start: 'top 74%',
          once: true,
        },
      });

      tl.to(
        paths,
        stacked
          ? { scaleY: 1, duration: MOTION.durationSlow, stagger: 0.12, ease: 'power2.inOut' }
          : { scaleX: 1, duration: MOTION.durationSlow, stagger: 0.12, ease: 'power2.inOut' },
      )
        .to(dots, { scale: 1, duration: MOTION.durationFast, stagger: 0.06, ease: 'back.out(1.7)' }, 0.16)
        .to(icons, { scale: 1, autoAlpha: 1, duration: MOTION.duration, stagger: 0.12, ease: 'back.out(1.35)' }, 0.08)
        .to(copies, { y: 0, autoAlpha: 1, duration: MOTION.duration, stagger: 0.12 }, 0.28);
    },
    { scope: rootRef, dependencies: [phases.length] },
  );

  return (
    <SectionBand id="proceso" tone={tone}>
      <div
        ref={rootRef}
        className="proceso"
        style={{ '--proceso-count': count } as CSSProperties}
      >
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          align="center"
          badgeVariant="purple"
        />

        <ol className="proceso__steps">
          {phases.map((phase, index) => {
            const accent = phase.accent && phase.accent in ACCENT_HEX ? phase.accent : ACCENTS[index % ACCENTS.length];
            const nextAccent = ACCENTS[(index + 1) % ACCENTS.length];
            const Icon = (phase.icon && ICON_MAP[phase.icon]) || ICONS[index % ICONS.length];
            const isLast = index === phases.length - 1;

            return (
              <li key={phase.index} className={`proceso__step proceso__step--${accent}`}>
                <div className="proceso__node">
                  <span className="proceso__icon">
                    <Icon />
                  </span>
                </div>
                {isLast ? null : (
                  <span className="proceso__rail" aria-hidden="true">
                    <span className="proceso__path" />
                    <span
                      className="proceso__dot proceso__dot--from"
                      style={{ background: ACCENT_HEX[accent] }}
                    />
                    <span
                      className="proceso__dot proceso__dot--to"
                      style={{ background: ACCENT_HEX[nextAccent] }}
                    />
                  </span>
                )}
                <div className="proceso__copy">
                  <h3 className="proceso__title">{phase.title}</h3>
                  <p className="proceso__desc">{phase.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </SectionBand>
  );
}
