import type { CSSProperties } from 'react';
import { PillarIcon, PILLAR_ICON_NAMES, type PillarIconName } from '../icons/PillarIcons';
import { Badge } from '../ui';
import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';
import './PillarGrid.css';

export type PillarAccent = 'purple' | 'cyan' | 'orange' | 'green';

export type Pillar = {
  title: string;
  description: string;
  icon?: PillarIconName;
  accent?: PillarAccent;
  href?: string;
};

type PillarGridProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  pillars: Pillar[];
  tone?: 'canvas' | 'surface' | 'wash';
  ctaLabel?: string;
};

const ACCENT_HEX: Record<PillarAccent, string> = {
  purple: '#927afe',
  cyan: '#01e7ff',
  orange: '#fe621c',
  green: '#74c465',
};

const DEFAULT_ACCENTS: PillarAccent[] = ['purple', 'cyan', 'orange', 'green'];

export function PillarGrid({
  eyebrow = 'Diferenciadores',
  title = 'Cuatro razones para no contratar una agencia genérica',
  description = 'Partner interno, idioma de industria, servicios atados a resultado y evidencia verificable.',
  pillars,
  tone = 'canvas',
  ctaLabel = 'Ver más',
}: PillarGridProps) {
  const cols =
    pillars.length >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3';
  const onSurface = tone === 'surface';

  return (
    <SectionBand id="diferenciadores" tone={tone}>
      <div className="flex justify-center">
        <Badge>{eyebrow}</Badge>
      </div>
      <SectionHeader
        title={title}
        description={description}
        align="center"
        className="mt-5"
      />

      <ul className={['mt-14 grid gap-x-6 gap-y-10', cols].join(' ')}>
        {pillars.map((pillar, index) => {
          const icon = pillar.icon ?? PILLAR_ICON_NAMES[index % PILLAR_ICON_NAMES.length];
          const accent = pillar.accent ?? DEFAULT_ACCENTS[index % DEFAULT_ACCENTS.length];
          const href = pillar.href;
          const inner = (
            <>
              <span className="pillar-card__icon">
                <PillarIcon name={icon} />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-ink">
                {pillar.title}
              </h3>
              <p className="mt-2 !text-sm !leading-relaxed">{pillar.description}</p>
              {href ? (
                <span className="pillar-card__cta">
                  {ctaLabel}
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              ) : null}
            </>
          );

          return (
            <li key={pillar.title} data-reveal>
              <article
                className={['pillar-card group', onSurface ? 'pillar-card--on-surface' : '']
                  .filter(Boolean)
                  .join(' ')}
                style={{ '--pillar-accent': ACCENT_HEX[accent] } as CSSProperties}
              >
                <span className="pillar-card__wash" aria-hidden="true" />
                {href ? (
                  <a href={href} className="pillar-card__body no-underline">
                    {inner}
                  </a>
                ) : (
                  <div className="pillar-card__body">{inner}</div>
                )}
              </article>
            </li>
          );
        })}
      </ul>
    </SectionBand>
  );
}
