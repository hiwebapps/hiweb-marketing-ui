import { useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MOTION } from '../../lib/motion';
import { postCoverUrl } from '../../lib/blog';
import { SectionHeader } from './primitives/SectionHeader';
import './BlogIndex.css';

gsap.registerPlugin(useGSAP);

export type CaseIndexCard = {
  id: string;
  title: string;
  description: string;
  client: string;
  outcome: string;
  industry: string;
  industrySlug: string;
  image?: string;
  href?: string;
  featured?: boolean;
};

type FilterId = 'all' | string;

type CasesIndexProps = {
  cases: CaseIndexCard[];
  industries: ReadonlyArray<{ slug: string; nombre: string }>;
  title?: string;
  description?: string;
};

function caseHref(item: CaseIndexCard) {
  return item.href ?? `/portafolio/${item.id}`;
}

function caseImage(item: CaseIndexCard) {
  return item.image ?? postCoverUrl(`caso-${item.id}`, 800, 520);
}

/**
 * Portfolio index grid — same visual system as BlogIndex, filtered by industry.
 */
export function CasesIndex({
  cases,
  industries,
  title = 'Todos los casos',
  description = 'Filtra por industria. Cada caso muestra cliente, outcome y el trabajo real.',
}: CasesIndexProps) {
  const [filter, setFilter] = useState<FilterId>('all');
  const gridRef = useRef<HTMLUListElement>(null);

  const filters = useMemo(
    () => [
      { id: 'all' as const, label: 'Todos' },
      ...industries
        .filter((industry) => cases.some((item) => item.industrySlug === industry.slug))
        .map((industry) => ({ id: industry.slug, label: industry.nombre })),
    ],
    [cases, industries],
  );

  const visible = useMemo(() => {
    if (filter === 'all') return cases;
    return cases.filter((item) => item.industrySlug === filter);
  }, [cases, filter]);

  const visibleKey = visible.map((item) => item.id).join('|');

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('.blog-card', gridRef.current);
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
    { scope: gridRef, dependencies: [filter, visibleKey] },
  );

  return (
    <div className="blog-index">
      <SectionHeader
        eyebrow="Portafolio"
        title={title}
        description={description}
        badgeVariant="lime"
      />

      <div className="blog-filters" role="radiogroup" aria-label="Filtrar por industria">
        {filters.map((item) => {
          const active = filter === item.id;
          return (
            <label key={item.id} className={`blog-filters__item${active ? ' is-active' : ''}`}>
              <input
                type="radio"
                name="case-industry"
                value={item.id}
                checked={active}
                onChange={() => setFilter(item.id)}
              />
              <span className="blog-filters__dot" aria-hidden="true" />
              <span className="blog-filters__label">{item.label}</span>
            </label>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 !text-sm text-muted">
          No hay casos publicados en esa industria todavía. Prueba otro filtro o{' '}
          <a href="/contacto">agenda una auditoría</a>.
        </p>
      ) : (
        <ul ref={gridRef} className="blog-grid">
          {visible.map((item) => (
            <li key={item.id} className="blog-card">
              <a href={caseHref(item)} className="blog-card__link">
                <div className="blog-card__media">
                  <img
                    src={caseImage(item)}
                    alt=""
                    width={800}
                    height={520}
                    loading="lazy"
                  />
                </div>
                <div className="blog-card__body">
                  <p className="blog-card__tag">
                    {item.industry}
                    {item.outcome ? ` · ${item.outcome}` : ''}
                  </p>
                  <h3 className="blog-card__title">{item.title}</h3>
                  <p className="blog-card__desc">{item.description}</p>
                  <span className="blog-card__cta">
                    Ver caso
                    <span aria-hidden="true"> →</span>
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
