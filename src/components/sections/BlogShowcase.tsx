import { useState, useMemo } from 'react';
import { BLOG_SHOWCASE_DATA, type BlogArticle } from './blog-showcase-data';
import { Badge, Button } from '../ui';
import './BlogShowcase.css';

export type BlogShowcaseProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  initialModalArticleId?: string;
};

export function BlogShowcase({
  eyebrow = 'Criterio & Contenido Editorial',
  title = 'Metodología, datos reales y visión de industria',
  description = 'No redactamos artículos de relleno para algoritmos. Publicamos análisis profundos, benchmarks de inversión y tácticas accionables para líderes de negocio.',
  initialModalArticleId,
}: BlogShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedArticleForModal, setSelectedArticleForModal] = useState<BlogArticle | null>(() => {
    if (initialModalArticleId) {
      return BLOG_SHOWCASE_DATA.find((a) => a.id === initialModalArticleId) || null;
    }
    return null;
  });


  const filteredArticles = useMemo(() => {
    if (activeCategory === 'all') return BLOG_SHOWCASE_DATA;
    return BLOG_SHOWCASE_DATA.filter((art) => art.category === activeCategory);
  }, [activeCategory]);

  const spotlightArticle = filteredArticles[0];
  const companionArticles = filteredArticles.slice(1);

  return (
    <section className="blog-showcase-section" id="blog-showcase">
      <div className="blog-showcase-section__inner">
        {/* Header */}
        <div className="blog-showcase-section__header">
          <Badge variant="lime" tone="on-ink">{eyebrow}</Badge>
          <h2 className="hw-section-title blog-showcase-section__title">{title}</h2>
          <p className="blog-showcase-section__lead">{description}</p>
        </div>

        {/* Category Pills */}
        <div className="blog-showcase-filters">
          <button
            type="button"
            className={`blog-filter-pill ${activeCategory === 'all' ? 'is-active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            Todos ({BLOG_SHOWCASE_DATA.length})
          </button>
          <button
            type="button"
            className={`blog-filter-pill ${activeCategory === 'ia-paid' ? 'is-active' : ''}`}
            onClick={() => setActiveCategory('ia-paid')}
          >
            🤖 IA & Paid Media
          </button>
          <button
            type="button"
            className={`blog-filter-pill ${activeCategory === 'seo' ? 'is-active' : ''}`}
            onClick={() => setActiveCategory('seo')}
          >
            🔍 SEO & Posicionamiento
          </button>
          <button
            type="button"
            className={`blog-filter-pill ${activeCategory === 'b2b' ? 'is-active' : ''}`}
            onClick={() => setActiveCategory('b2b')}
          >
            🏭 B2B & Nearshoring
          </button>
          <button
            type="button"
            className={`blog-filter-pill ${activeCategory === 'estrategia' ? 'is-active' : ''}`}
            onClick={() => setActiveCategory('estrategia')}
          >
            📈 Estrategia & Growth
          </button>
        </div>

        {/* Spotlight Featured Article */}
        {spotlightArticle && (
          <div className="blog-spotlight-card">
            <div className="blog-spotlight-card__media">
              <img
                src={spotlightArticle.image}
                alt={spotlightArticle.title}
                loading="lazy"
                className="blog-spotlight-card__img"
              />
              <div className="blog-spotlight-card__badge-overlay">
                <span className="blog-tag-badge">{spotlightArticle.categoryLabel}</span>
                <span className="blog-time-badge">⏱ {spotlightArticle.readingMinutes} min de lectura</span>
              </div>
            </div>

            <div className="blog-spotlight-card__content">
              <div className="blog-spotlight-card__meta">
                <span className="blog-meta-date">{spotlightArticle.publishedAt}</span>
                <span className="blog-meta-dot">·</span>
                <span className="blog-meta-author">{spotlightArticle.author}</span>
                {spotlightArticle.featured && (
                  <>
                    <span className="blog-meta-dot">·</span>
                    <span className="blog-meta-highlight">⭐ Destacado de redacción</span>
                  </>
                )}
              </div>

              <h3 className="blog-spotlight-card__title">
                <a href={`/blog/${spotlightArticle.slug}`}>
                  {spotlightArticle.title}
                </a>
              </h3>

              <p className="blog-spotlight-card__excerpt">
                {spotlightArticle.excerpt}
              </p>

              {/* Key takeaways teaser preview */}
              <div className="blog-spotlight-takeaways">
                <div className="blog-takeaways-label">Puntos clave del artículo:</div>
                <ul className="blog-takeaways-list">
                  {spotlightArticle.takeaways.map((point, idx) => (
                    <li key={idx} className="blog-takeaway-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bdff01" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="blog-spotlight-actions">
                <Button
                  variant="primary"
                  tone="on-ink"
                  size="md"
                  href={`/blog/${spotlightArticle.slug}`}
                >
                  Leer artículo completo →
                </Button>
                <button
                  type="button"
                  className="blog-summary-btn"
                  onClick={() => setSelectedArticleForModal(spotlightArticle)}
                >
                  ⚡ Resumen ejecutivo rápido
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Companion Articles Grid */}
        {companionArticles.length > 0 && (
          <div className="blog-companion-grid">
            {companionArticles.map((article) => (
              <article key={article.id} className="blog-companion-card">
                <div className="blog-companion-card__media">
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    className="blog-companion-card__img"
                  />
                  <span className="blog-companion-tag">{article.categoryLabel}</span>
                </div>

                <div className="blog-companion-card__body">
                  <div className="blog-companion-meta">
                    <span>{article.publishedAt}</span>
                    <span className="blog-meta-dot">·</span>
                    <span>{article.readingMinutes} min lectura</span>
                  </div>

                  <h4 className="blog-companion-title">
                    <a href={`/blog/${article.slug}`}>{article.title}</a>
                  </h4>

                  <p className="blog-companion-excerpt">{article.excerpt}</p>

                  <div className="blog-companion-footer">
                    <button
                      type="button"
                      className="blog-companion-summary-link"
                      onClick={() => setSelectedArticleForModal(article)}
                    >
                      Ver takeaways
                    </button>
                    <a href={`/blog/${article.slug}`} className="blog-companion-read-link">
                      Leer →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Global Footer CTA */}
        <div className="blog-showcase-footer">
          <p className="blog-showcase-footer__text">
            ¿Buscas una estrategia adaptada a las métricas y ciclo comercial de tu empresa?
          </p>
          <div className="blog-showcase-footer__ctas">
            <Button variant="primary" tone="on-ink" size="md" href="/contacto">
              Consultar con un estratega
            </Button>
            <Button variant="ghost" tone="on-ink" size="md" href="/blog">
              Explorar los 40+ artículos del blog →
            </Button>
          </div>
        </div>
      </div>

      {/* TL;DR Quick Reader Modal */}
      {selectedArticleForModal && (
        <div
          className="blog-tldr-backdrop"
          onClick={() => setSelectedArticleForModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="blog-tldr-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="blog-tldr-close"
              onClick={() => setSelectedArticleForModal(null)}
              aria-label="Cerrar resumen"
            >
              ✕
            </button>

            <div className="blog-tldr-header">
              <span className="blog-tag-badge">{selectedArticleForModal.categoryLabel}</span>
              <span className="blog-tldr-readtime">⏱ {selectedArticleForModal.readingMinutes} min lectura</span>
            </div>

            <h3 className="blog-tldr-title">{selectedArticleForModal.title}</h3>
            <p className="blog-tldr-desc">{selectedArticleForModal.excerpt}</p>

            <div className="blog-tldr-points-box">
              <h5 className="blog-tldr-box-title">💡 3 Conclusiones Clave para tu Negocio:</h5>
              <ul className="blog-tldr-box-list">
                {selectedArticleForModal.takeaways.map((point, i) => (
                  <li key={i} className="blog-tldr-box-item">
                    <span className="blog-tldr-num">0{i + 1}</span>
                    <p className="blog-tldr-num-text">{point}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="blog-tldr-actions">
              <Button
                variant="primary"
                tone="on-ink"
                size="md"
                href={`/blog/${selectedArticleForModal.slug}`}
              >
                Leer el artículo completo ({selectedArticleForModal.readingMinutes} min) →
              </Button>
              <button
                type="button"
                className="blog-tldr-cancel-btn"
                onClick={() => setSelectedArticleForModal(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
