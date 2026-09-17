import { useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MOTION } from '../../lib/motion';
import { postCoverUrl } from '../../lib/blog';
import { SectionHeader } from './primitives/SectionHeader';
import './BlogIndex.css';

gsap.registerPlugin(useGSAP);

export type BlogCategory = 'estrategia' | 'performance' | 'industrias' | 'creativo';

export type BlogCard = {
  id: string;
  title: string;
  description: string;
  keyword: string;
  autor: string;
  fecha: string;
  featured: boolean;
  category: BlogCategory;
  image?: string;
  ctaLabel?: string;
  href?: string;
  industria?: string;
  servicio?: string;
  placeholder?: boolean;
};

type FilterId = 'all' | BlogCategory;

const FILTERS: ReadonlyArray<{ id: FilterId; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'estrategia', label: 'Estrategia' },
  { id: 'performance', label: 'Performance' },
  { id: 'industrias', label: 'Industrias' },
  { id: 'creativo', label: 'Creativo' },
];

const PLACEHOLDER_POSTS: BlogCard[] = [
  {
    id: 'placeholder-seo-local',
    title: 'SEO local para marcas con varias sedes',
    description: 'Cómo priorizar páginas, reviews y paid sin pelear el mismo keyword entre ciudades.',
    keyword: 'seo local',
    autor: 'Equipo Hiweb',
    fecha: '2026-05-01',
    featured: false,
    category: 'performance',
    image: postCoverUrl('placeholder-seo-local', 800, 520),
    ctaLabel: 'Ver playbook',
    placeholder: true,
  },
  {
    id: 'placeholder-mensaje',
    title: 'El mensaje que vende en manufactura no es el de SaaS',
    description: 'Por qué el mismo claim genérico diluye pipeline cuando el comprador es un comité.',
    keyword: 'mensaje por industria',
    autor: 'Equipo Hiweb',
    fecha: '2026-05-08',
    featured: false,
    category: 'industrias',
    image: 'https://picsum.photos/id/180/800/520',
    ctaLabel: 'Leer marco',
    placeholder: true,
  },
  {
    id: 'placeholder-landing',
    title: 'Landings que cierran: una oferta, una prueba, un CTA',
    description: 'Estructura mínima para dejar de mandar tráfico a un home que no decide.',
    keyword: 'conversion web',
    autor: 'Equipo Hiweb',
    fecha: '2026-05-14',
    featured: false,
    category: 'creativo',
    image: 'https://picsum.photos/id/201/800/520',
    ctaLabel: 'Ver estructura',
    placeholder: true,
  },
  {
    id: 'placeholder-auditoria',
    title: 'Qué pedimos en una auditoría (y qué no)',
    description: 'El checklist real: señal, oferta, superficie digital y paid — sin deck ornamental.',
    keyword: 'auditoría marketing',
    autor: 'Equipo Hiweb',
    fecha: '2026-05-20',
    featured: false,
    category: 'estrategia',
    image: 'https://picsum.photos/id/3/800/520',
    ctaLabel: 'Ver checklist',
    placeholder: true,
  },
  {
    id: 'placeholder-crm',
    title: 'CRM sin teatro: eventos que sí importan',
    description: 'Qué tracking vale la pena instrumentar cuando el KPI es pipeline, no vanity.',
    keyword: 'crm marketing',
    autor: 'Equipo Hiweb',
    fecha: '2026-05-26',
    featured: false,
    category: 'performance',
    image: 'https://picsum.photos/id/60/800/520',
    ctaLabel: 'Leer guía',
    placeholder: true,
  },
  {
    id: 'placeholder-brand',
    title: 'Brand systems que aguantan paid y web',
    description: 'Cómo un sistema visual deja de romper en banners, landing y portal del cliente.',
    keyword: 'brand system',
    autor: 'Equipo Hiweb',
    fecha: '2026-06-02',
    featured: false,
    category: 'creativo',
    image: 'https://picsum.photos/id/119/800/520',
    ctaLabel: 'Ver enfoque',
    placeholder: true,
  },
];

type BlogIndexProps = {
  posts: BlogCard[];
  title?: string;
  description?: string;
};

function postHref(post: BlogCard) {
  if (post.placeholder) return '#';
  return post.href ?? `/blog/${post.id}`;
}

function postImage(post: BlogCard) {
  return post.image ?? postCoverUrl(post.id, 800, 520);
}

export function BlogIndex({
  posts,
  title = 'Todos los artículos',
  description = 'Filtra por tema. Cada pieza enlaza a un servicio, industria o caso — no a un magazine genérico.',
}: BlogIndexProps) {
  const [filter, setFilter] = useState<FilterId>('all');
  const gridRef = useRef<HTMLUListElement>(null);

  const catalog = useMemo(() => {
    const ids = new Set(posts.map((post) => post.id));
    return [...posts, ...PLACEHOLDER_POSTS.filter((post) => !ids.has(post.id))];
  }, [posts]);

  const visible = useMemo(() => {
    if (filter === 'all') return catalog;
    return catalog.filter((post) => post.category === filter);
  }, [catalog, filter]);

  const visibleKey = visible.map((post) => post.id).join('|');

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
        eyebrow="Blog"
        title={title}
        description={description}
        badgeVariant="purple"
      />

      <div className="blog-filters" role="radiogroup" aria-label="Filtrar por categoría">
        {FILTERS.map((item) => {
          const active = filter === item.id;
          return (
            <label key={item.id} className={`blog-filters__item${active ? ' is-active' : ''}`}>
              <input
                type="radio"
                name="blog-category"
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

      <ul ref={gridRef} className="blog-grid">
        {visible.map((post) => (
          <li key={post.id} className="blog-card">
            <a
              href={postHref(post)}
              className="blog-card__link"
              aria-disabled={post.placeholder || undefined}
              onClick={post.placeholder ? (event) => event.preventDefault() : undefined}
            >
              <div className="blog-card__media">
                <img
                  src={postImage(post)}
                  alt=""
                  width={800}
                  height={520}
                  loading="lazy"
                />
              </div>
              <div className="blog-card__body">
                <p className="blog-card__tag">{post.keyword}</p>
                <h3 className="blog-card__title">{post.title}</h3>
                <p className="blog-card__desc">{post.description}</p>
                <span className="blog-card__cta">
                  {post.ctaLabel ?? 'Leer artículo'}
                  <span aria-hidden="true"> →</span>
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
