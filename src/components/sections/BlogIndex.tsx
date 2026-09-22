import { useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MOTION } from '../../lib/motion';
import { BLOG_READING_MINUTES, postCoverUrl } from '../../lib/blog';
import { Badge, Button } from '../ui';
import { SectionHeader } from './primitives/SectionHeader';
import './BlogIndex.css';

gsap.registerPlugin(useGSAP);

export type BlogCard = {
  id: string;
  title: string;
  description: string;
  keyword?: string;
  autor: string;
  fecha: string;
  featured: boolean;
  servicio?: string;
  servicioNombre?: string;
  readingMinutes?: number;
  image?: string;
  ctaLabel?: string;
  href?: string;
  industria?: string;
  placeholder?: boolean;
};

export type BlogServiceFilter = {
  id: string;
  nombre: string;
};

type FilterId = 'all' | string;

const PLACEHOLDER_POSTS: BlogCard[] = [
  {
    id: 'placeholder-seo-local',
    title: 'SEO local para marcas con varias sedes',
    description: 'Cómo priorizar páginas, reviews y paid sin pelear el mismo keyword entre ciudades.',
    autor: 'Equipo Hiweb',
    fecha: '2026-05-01',
    featured: false,
    servicio: 'seo',
    servicioNombre: 'SEO',
    readingMinutes: BLOG_READING_MINUTES,
    image: postCoverUrl('placeholder-seo-local', 800, 520),
    ctaLabel: 'Ver playbook',
    placeholder: true,
  },
  {
    id: 'placeholder-mensaje',
    title: 'El mensaje que vende en manufactura no es el de SaaS',
    description: 'Por qué el mismo claim genérico diluye pipeline cuando el comprador es un comité.',
    autor: 'Equipo Hiweb',
    fecha: '2026-05-08',
    featured: false,
    servicio: 'branding',
    servicioNombre: 'Branding',
    readingMinutes: BLOG_READING_MINUTES,
    image: 'https://picsum.photos/id/180/800/520',
    ctaLabel: 'Leer marco',
    placeholder: true,
  },
  {
    id: 'placeholder-landing',
    title: 'Landings que cierran: una oferta, una prueba, un CTA',
    description: 'Estructura mínima para dejar de mandar tráfico a un home que no decide.',
    autor: 'Equipo Hiweb',
    fecha: '2026-05-14',
    featured: false,
    servicio: 'desarrollo-web',
    servicioNombre: 'Desarrollo Web',
    readingMinutes: BLOG_READING_MINUTES,
    image: 'https://picsum.photos/id/201/800/520',
    ctaLabel: 'Ver estructura',
    placeholder: true,
  },
  {
    id: 'placeholder-auditoria',
    title: 'Qué pedimos en una auditoría (y qué no)',
    description: 'El checklist real: señal, oferta, superficie digital y paid — sin deck ornamental.',
    autor: 'Equipo Hiweb',
    fecha: '2026-05-20',
    featured: false,
    servicio: 'seo',
    servicioNombre: 'SEO',
    readingMinutes: BLOG_READING_MINUTES,
    image: 'https://picsum.photos/id/3/800/520',
    ctaLabel: 'Ver checklist',
    placeholder: true,
  },
  {
    id: 'placeholder-crm',
    title: 'CRM sin teatro: eventos que sí importan',
    description: 'Qué tracking vale la pena instrumentar cuando el KPI es pipeline, no vanity.',
    autor: 'Equipo Hiweb',
    fecha: '2026-05-26',
    featured: false,
    servicio: 'crm-automatizacion',
    servicioNombre: 'CRM & Automatización',
    readingMinutes: BLOG_READING_MINUTES,
    image: 'https://picsum.photos/id/60/800/520',
    ctaLabel: 'Leer guía',
    placeholder: true,
  },
  {
    id: 'placeholder-brand',
    title: 'Brand systems que aguantan paid y web',
    description: 'Cómo un sistema visual deja de romper en banners, landing y portal del cliente.',
    autor: 'Equipo Hiweb',
    fecha: '2026-06-02',
    featured: false,
    servicio: 'branding',
    servicioNombre: 'Branding',
    readingMinutes: BLOG_READING_MINUTES,
    image: 'https://picsum.photos/id/119/800/520',
    ctaLabel: 'Ver enfoque',
    placeholder: true,
  },
];

type BlogIndexProps = {
  posts: BlogCard[];
  services?: BlogServiceFilter[];
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

function readingLabel(post: BlogCard) {
  return `${post.readingMinutes ?? BLOG_READING_MINUTES} minutos`;
}

export function BlogIndex({
  posts,
  services = [],
  title = 'Todos los artículos',
  description = 'Filtra por servicio. Cada pieza enlaza a lo que sí ejecutamos — no a un magazine genérico.',
}: BlogIndexProps) {
  const [filter, setFilter] = useState<FilterId>('all');
  const gridRef = useRef<HTMLUListElement>(null);

  const catalog = useMemo(() => (posts.length ? posts : PLACEHOLDER_POSTS), [posts]);

  const filters = useMemo(() => {
    const used = new Set(catalog.map((post) => post.servicio).filter(Boolean));
    const fromServices = services.filter((service) => used.has(service.id));
    const extras = [...used]
      .filter((id) => !fromServices.some((service) => service.id === id))
      .map((id) => {
        const post = catalog.find((item) => item.servicio === id);
        return { id: id as string, nombre: post?.servicioNombre ?? id };
      });
    return [{ id: 'all', nombre: 'Todos' }, ...fromServices, ...extras];
  }, [catalog, services]);

  const visible = useMemo(() => {
    if (filter === 'all') return catalog;
    return catalog.filter((post) => post.servicio === filter);
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

      <div className="blog-filters" role="radiogroup" aria-label="Filtrar por servicio">
        {filters.map((item) => {
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
              <span className="blog-filters__label">{item.nombre}</span>
            </label>
          );
        })}
      </div>

      <ul ref={gridRef} className="blog-grid">
        {visible.map((post) => {
          const href = postHref(post);
          const stopPlaceholder = post.placeholder
            ? (event: { preventDefault: () => void }) => event.preventDefault()
            : undefined;
          return (
          <li key={post.id} className="blog-card">
            <article className="blog-card__link">
              <a
                href={href}
                className="blog-card__media"
                aria-label={post.title}
                onClick={stopPlaceholder}
              >
                <img
                  src={postImage(post)}
                  alt=""
                  width={800}
                  height={520}
                  loading="lazy"
                />
                {post.servicioNombre ? (
                  <Badge variant="lime" className="blog-card__read">
                    {post.servicioNombre}
                  </Badge>
                ) : null}
              </a>
              <div className="blog-card__body">
                <h3 className="blog-card__title">
                  <a href={href} className="blog-card__title-link" onClick={stopPlaceholder}>
                    {post.title}
                  </a>
                </h3>
                <p className="blog-card__desc">{post.description}</p>
                <p className="blog-card__meta">
                  <span>{readingLabel(post)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.autor}</span>
                  <span aria-hidden="true">·</span>
                  <time>{post.fecha}</time>
                </p>
                <Button
                  href={href}
                  variant="secondary"
                  size="sm"
                  className="blog-card__action no-underline"
                  onClick={stopPlaceholder}
                >
                  {post.ctaLabel ?? 'Leer artículo'}
                </Button>
              </div>
            </article>
          </li>
          );
        })}
      </ul>
    </div>
  );
}
