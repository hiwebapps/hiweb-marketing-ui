import type { ReactNode } from 'react';
import './BlogHero.css';

export type BlogFeaturedPost = {
  id: string;
  title: string;
  description: string;
  keyword?: string;
  image?: string;
  ctaLabel?: string;
  href?: string;
};

type BlogHeroProps = {
  eyebrow?: string;
  title?: ReactNode;
  description?: string;
  label?: string;
  featured?: BlogFeaturedPost;
};

/**
 * Blog index hero — dark gradient field (homepage language) + optional featured card.
 */
export function BlogHero({
  eyebrow = 'Recursos / Blog',
  title = 'Artículos para decidir, no para rellenar',
  description = 'Contenido por industria y servicio: respuestas directas, keywords reales y enlaces a lo que sí ejecutamos.',
  label = 'Blog',
  featured,
}: BlogHeroProps) {
  const image = featured
    ? (featured.image ?? `https://picsum.photos/seed/${encodeURIComponent(featured.id)}/720/480`)
    : null;
  const cta = featured?.ctaLabel ?? 'Leer artículo';
  const href = featured ? (featured.href ?? `/blog/${featured.id}`) : null;

  return (
    <section
      className={`blog-hero${featured ? '' : ' blog-hero--copy-only'}`}
      aria-label={label}
    >
      <div className="blog-hero__wash" aria-hidden="true">
        <span className="blog-hero__blob blog-hero__blob--tl" />
        <span className="blog-hero__blob blog-hero__blob--tr" />
        <span className="blog-hero__blob blog-hero__blob--bl" />
        <span className="blog-hero__blob blog-hero__blob--br" />
      </div>

      <div className="blog-hero__inner">
        <div className="blog-hero__copy">
          <p className="blog-hero__crumb">{eyebrow}</p>
          <h1 data-split className="blog-hero__title">
            {title}
          </h1>
          <p data-reveal className="blog-hero__lead">
            {description}
          </p>
        </div>

        {featured && href && image ? (
          <a
            data-reveal
            href={href}
            className="blog-hero__feature"
            aria-label={`${featured.title}. ${cta}`}
          >
            <div className="blog-hero__feature-media">
              <img src={image} alt="" width={720} height={480} loading="eager" />
            </div>
            <div className="blog-hero__feature-body">
              {featured.keyword ? (
                <p className="blog-hero__feature-tag">{featured.keyword}</p>
              ) : null}
              <h2 className="blog-hero__feature-title">{featured.title}</h2>
              <p className="blog-hero__feature-desc">{featured.description}</p>
              <span className="blog-hero__feature-cta">
                {cta}
                <span aria-hidden="true"> →</span>
              </span>
            </div>
          </a>
        ) : null}
      </div>
    </section>
  );
}
