import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  TEAM_CATEGORIES,
  TEAM_MEMBERS,
  type TeamCategory,
} from '../../data/site';
import { MOTION } from '../../lib/motion';
import { Badge, Button, type BadgeVariant } from '../ui';
import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';
import './TeamGrid.css';

gsap.registerPlugin(useGSAP);

type TeamAccent = BadgeVariant;

type TeamSocials = {
  tiktok?: string;
  instagram?: string;
  linkedin?: string;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photo: string;
  category: TeamCategory;
  accent?: TeamAccent;
  socials?: TeamSocials;
};

type FilterId = 'all' | TeamCategory;

type TeamGridProps = {
  eyebrow?: string;
  title?: ReactNode;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  members?: TeamMember[];
  /** Cap visible members (homepage). Filters ignore this when active. */
  limit?: number;
  /** Category filter row — use on /nosotros */
  showFilters?: boolean;
};

const ACCENTS: TeamAccent[] = ['cyan', 'purple', 'orange', 'lime'];

const FILTERS: ReadonlyArray<{ id: FilterId; label: string }> = [
  { id: 'all', label: 'Todos' },
  ...TEAM_CATEGORIES,
];

function IconTikTok() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.2 4.2c.7 2.4 2.4 4.1 4.8 4.7v3.1c-1.6 0-3.1-.5-4.3-1.4v6.6c0 3.2-2.6 5.8-5.8 5.8S3.1 20.4 3.1 17.2c0-3.2 2.6-5.8 5.8-5.8.4 0 .7 0 1.1.1v3.2c-.3-.1-.7-.2-1.1-.2-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7V4.2h2.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16.6" cy="7.4" r="0.9" fill="currentColor" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7.4 9.4H4.8V19h2.6V9.4ZM6.1 5C5.2 5 4.5 5.7 4.5 6.6s.7 1.6 1.6 1.6 1.6-.7 1.6-1.6S7 5 6.1 5ZM19.2 12.3c0-2.4-1.3-3.6-3.4-3.6-1.5 0-2.3.8-2.7 1.4V9.4H10.5c0 1.1 0 9.6 0 9.6h2.6v-5.4c0-.3 0-.6.1-.8.3-.6.9-1.2 1.9-1.2 1.3 0 1.9.9 1.9 2.3V19h2.6v-6.7h-.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="team-card__social"
      aria-label={label}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}

export function TeamGrid({
  eyebrow = 'Equipo',
  title = 'Conoce al equipo Hiweb',
  description = 'Un núcleo senior en estrategia, performance, creativo y producto web. Las caras que sí aparecen en la auditoría.',
  ctaLabel = 'Conoce a todo el equipo',
  ctaHref = '/nosotros',
  members = [...TEAM_MEMBERS],
  limit,
  showFilters = false,
}: TeamGridProps) {
  const [filter, setFilter] = useState<FilterId>('all');
  const gridRef = useRef<HTMLUListElement>(null);

  const filtered =
    showFilters && filter !== 'all'
      ? members.filter((member) => member.category === filter)
      : members;

  const visible =
    !showFilters && limit != null ? filtered.slice(0, limit) : filtered;

  const visibleKey = visible.map((member) => member.name).join('|');

  useGSAP(
    () => {
      if (!showFilters) return;
      const cards = gsap.utils.toArray<HTMLElement>('.team-card', gridRef.current);
      if (!cards.length) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        cards,
        { opacity: 0, y: MOTION.revealY },
        {
          opacity: 1,
          y: 0,
          duration: MOTION.duration,
          ease: MOTION.ease,
          stagger: MOTION.stagger,
          overwrite: true,
        },
      );
    },
    { scope: gridRef, dependencies: [showFilters, filter, visibleKey] },
  );

  return (
    <SectionBand id="nosotros" tone="canvas">
      <div className="team">
        <div className="team__intro">
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            badgeVariant="cyan"
          />
          <div className="team__cta">
            <Button href={ctaHref}>{ctaLabel}</Button>
          </div>
        </div>

        {showFilters ? (
          <div className="team__filters" role="group" aria-label="Filtrar por categoría">
            {FILTERS.map((item) => {
              const active = filter === item.id;
              return (
                <Button
                  key={item.id}
                  type="button"
                  size="sm"
                  variant={active ? 'primary' : 'secondary'}
                  glow={active}
                  aria-pressed={active}
                  onClick={() => setFilter(item.id)}
                >
                  {item.label}
                </Button>
              );
            })}
          </div>
        ) : null}

        <ul ref={gridRef} className="team__grid">
          {visible.map((member, index) => {
            const accent = member.accent ?? ACCENTS[index % ACCENTS.length];

            return (
              <li
                key={member.name}
                data-reveal={showFilters ? undefined : true}
                className={`team-card team-card--${accent}`}
              >
                <div
                  className="team-card__photo"
                  style={{ '--photo': `url('${member.photo}')` } as CSSProperties}
                >
                  <span className="team-card__dither" aria-hidden="true" />
                  <img
                    className="team-card__subject"
                    src={member.photo}
                    alt={member.name}
                    width={720}
                    height={1280}
                  />
                  <span className="team-card__wash" aria-hidden="true" />
                </div>
                <div className="team-card__body">
                  <Badge variant={accent}>{member.role}</Badge>
                  <h3 className="team-card__name">{member.name}</h3>
                  <p className="team-card__bio">{member.bio}</p>
                  <div className="team-card__socials">
                    {member.socials?.tiktok ? (
                      <SocialLink href={member.socials.tiktok} label={`TikTok de ${member.name}`}>
                        <IconTikTok />
                      </SocialLink>
                    ) : null}
                    {member.socials?.instagram ? (
                      <SocialLink
                        href={member.socials.instagram}
                        label={`Instagram de ${member.name}`}
                      >
                        <IconInstagram />
                      </SocialLink>
                    ) : null}
                    {member.socials?.linkedin ? (
                      <SocialLink
                        href={member.socials.linkedin}
                        label={`LinkedIn de ${member.name}`}
                      >
                        <IconLinkedIn />
                      </SocialLink>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </SectionBand>
  );
}
