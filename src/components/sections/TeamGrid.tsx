import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
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

type TeamFilter = {
  id?: string;
  label: string;
  members?: TeamMember[];
};

type TeamGridProps = {
  eyebrow?: string;
  title?: ReactNode;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  members?: TeamMember[];
  /** Cap visible members when this is still a grid. */
  limit?: number;
  /** Cards side by side. Homepage leaders only. */
  slider?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  positionLabel?: string;
  /** Category filter row — use on /nosotros */
  showFilters?: boolean;
  filters?: ReadonlyArray<TeamFilter>;
  filterLabel?: string;
  headingWidth?: string;
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

function TeamCard({ member, index, reveal }: { member: TeamMember; index: number; reveal?: boolean }) {
  const accent = member.accent ?? ACCENTS[index % ACCENTS.length];
  return (
    <li data-reveal={reveal ? true : undefined} className={`team-card team-card--${accent}`}>
      <div className="team-card__photo" style={{ '--photo': `url('${member.photo}')` } as CSSProperties}>
        <span className="team-card__dither" aria-hidden="true" />
        <img className="team-card__subject" src={member.photo} alt={member.name} width={720} height={1280} />
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
            <SocialLink href={member.socials.instagram} label={`Instagram de ${member.name}`}>
              <IconInstagram />
            </SocialLink>
          ) : null}
          {member.socials?.linkedin ? (
            <SocialLink href={member.socials.linkedin} label={`LinkedIn de ${member.name}`}>
              <IconLinkedIn />
            </SocialLink>
          ) : null}
        </div>
      </div>
    </li>
  );
}

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={direction === 'left' ? 'M10 3 5 8l5 5' : 'M6 3l5 5-5 5'}
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

function TeamSlider({
  members,
  previousLabel,
  nextLabel,
  positionLabel,
}: {
  members: TeamMember[];
  previousLabel: string;
  nextLabel: string;
  positionLabel: string;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const indexRef = useRef(0);
  const drag = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    origin: 0,
    axis: '' as '' | 'x' | 'y',
    moved: false,
  });
  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const membersKey = members.map((member) => member.name).join('|');

  const metrics = () => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>('.team-card');
    if (!viewport || !track || !card) return null;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
    const step = card.offsetWidth + gap;
    if (step <= 0) return null;
    const visible = Math.max(1, Math.round((viewport.clientWidth + gap) / step));
    return {
      step,
      max: Math.max(0, track.children.length - visible),
      maxShift: Math.max(0, track.scrollWidth - viewport.clientWidth),
    };
  };

  const place = (next: number, animate: boolean) => {
    const track = trackRef.current;
    const frame = metrics();
    if (!track || !frame) return;
    const clamped = Math.max(0, Math.min(frame.max, next));
    const x = Math.min(clamped * frame.step, frame.maxShift);
    track.style.transition =
      animate && !prefersReducedMotion() ? 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)' : 'none';
    track.style.transform = `translate3d(${-x}px, 0, 0)`;
    indexRef.current = clamped;
    setIndex(clamped);
    setMaxIndex(frame.max);
  };

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    indexRef.current = 0;
    place(0, false);
    const observer = new ResizeObserver(() => place(indexRef.current, false));
    observer.observe(viewport);
    return () => observer.disconnect();
    // membersKey resets the row when the people change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [membersKey]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: indexRef.current,
      axis: '',
      moved: false,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (state.pointerId !== event.pointerId) return;
    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;
    if (!state.axis) {
      if (Math.hypot(dx, dy) < 8) return;
      state.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (state.axis === 'y') {
        state.pointerId = -1;
        return;
      }
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (state.axis !== 'x') return;
    const frame = metrics();
    const track = trackRef.current;
    if (!frame || !track) return;
    state.moved = true;
    const base = Math.min(state.origin * frame.step, frame.maxShift);
    const x = Math.max(0, Math.min(frame.maxShift, base - dx));
    track.style.transition = 'none';
    track.style.transform = `translate3d(${-x}px, 0, 0)`;
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (state.pointerId !== event.pointerId) return;
    const dx = event.clientX - state.startX;
    state.pointerId = -1;
    if (state.axis !== 'x') return;
    if (dx <= -48) place(state.origin + 1, true);
    else if (dx >= 48) place(state.origin - 1, true);
    else place(state.origin, true);
  };

  const pages = maxIndex + 1;

  return (
    <div className="team__slider">
      <div
        ref={viewportRef}
        className="team__viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(event) => {
          if (drag.current.moved) {
            event.preventDefault();
            event.stopPropagation();
            drag.current.moved = false;
          }
        }}
      >
        <ul ref={trackRef} className="team__track">
          {members.map((member, memberIndex) => (
            <TeamCard key={`${member.name}-${memberIndex}`} member={member} index={memberIndex} />
          ))}
        </ul>
      </div>
      <div className="team__slider-nav">
        {pages > 1 ? (
          <>
            <div className="team__dots">
              {Array.from({ length: pages }, (_, page) => (
                <button
                  key={page}
                  type="button"
                  className={page === index ? 'team__dot is-active' : 'team__dot'}
                  aria-label={`${positionLabel} ${page + 1}`}
                  aria-current={page === index ? 'true' : undefined}
                  onClick={() => place(page, true)}
                />
              ))}
            </div>
            <div className="team__slider-arrows">
              <button
                type="button"
                className="team__slider-btn"
                onClick={() => place(index - 1, true)}
                disabled={index <= 0}
                aria-label={previousLabel}
              >
                <Chevron direction="left" />
              </button>
              <button
                type="button"
                className="team__slider-btn"
                onClick={() => place(index + 1, true)}
                disabled={index >= maxIndex}
                aria-label={nextLabel}
              >
                <Chevron direction="right" />
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
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
  slider = false,
  previousLabel = 'Integrante anterior',
  nextLabel = 'Siguiente integrante',
  positionLabel = 'Ir a la posición',
  showFilters = false,
  filters = FILTERS,
  filterLabel = 'Filtrar por categoría',
  headingWidth,
}: TeamGridProps) {
  const [filterIndex, setFilterIndex] = useState(0);
  const gridRef = useRef<HTMLUListElement>(null);
  const selected = filters[filterIndex] ?? filters[0];
  const selectedId = selected?.id;
  const usesMemberLists = filters.some((item) => Array.isArray(item.members));
  const category =
    selectedId === 'web' || selectedId === 'redes' || selectedId === 'diseno' ? selectedId : undefined;

  const filtered = !showFilters
    ? members
    : usesMemberLists
      ? (selected?.members ?? [])
      : category
        ? members.filter((member) => member.category === category)
        : members;

  const visible = slider || showFilters || limit == null ? filtered : filtered.slice(0, limit);

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
    { scope: gridRef, dependencies: [showFilters, filterIndex, visibleKey] },
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
            headingWidth={headingWidth}
          />
          <div className="team__cta">
            <Button href={ctaHref}>{ctaLabel}</Button>
          </div>
        </div>

        {showFilters ? (
          <div className="team__filters" role="group" aria-label={filterLabel}>
            {filters.map((item, index) => {
              const active = filterIndex === index;
              return (
                <Button
                  key={`${item.label}-${index}`}
                  type="button"
                  size="sm"
                  variant={active ? 'primary' : 'secondary'}
                  glow={active}
                  aria-pressed={active}
                  onClick={() => setFilterIndex(index)}
                >
                  {item.label}
                </Button>
              );
            })}
          </div>
        ) : null}

        {slider ? (
          <TeamSlider
            members={visible}
            previousLabel={previousLabel}
            nextLabel={nextLabel}
            positionLabel={positionLabel}
          />
        ) : (
          <ul ref={gridRef} className="team__grid">
            {visible.map((member, index) => (
              <TeamCard key={`${member.name}-${index}`} member={member} index={index} reveal={!showFilters} />
            ))}
          </ul>
        )}
      </div>
    </SectionBand>
  );
}
