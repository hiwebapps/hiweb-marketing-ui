import { useState, useMemo, useEffect } from 'react';
import { SOCIAL_BRANDS, ALL_POSTS, type SocialPost } from './social-feed-data';
import { Badge, Button } from '../ui';
import './InstagramGridFeed.css';

export type InstagramGridFeedProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  filterBrand?: string;
  filterCategory?: string;
  headingWidth?: string;
};

export function InstagramGridFeed({
  eyebrow = 'Feed en vivo',
  title = 'Contenido que despierta deseo y llena agendas',
  description = 'Publicaciones reales producidas y gestionadas para nuestros clientes: dirección de arte, video de alto impacto y copys diseñados para vender.',
}: InstagramGridFeedProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedKind, setSelectedKind] = useState<string>('all');
  const [activePost, setActivePost] = useState<SocialPost | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const filteredPosts = useMemo(() => {
    return ALL_POSTS.filter((post) => {
      const matchBrand = selectedBrand === 'all' || post.brandId === selectedBrand;
      const matchKind = selectedKind === 'all' || post.kind === selectedKind;
      return matchBrand && matchKind;
    });
  }, [selectedBrand, selectedKind]);

  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [activePost]);

  // Lock scroll when modal is open
  useEffect(() => {
    if (activePost) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setActivePost(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [activePost]);

  return (
    <section className="ig-grid-section" id="feed-instagram">
      <div className="ig-grid-section__inner">
        {/* Section Header */}
        <div className="ig-grid-section__header">
          <Badge variant="lime" tone="on-ink">{eyebrow}</Badge>
          <h2 className="hw-section-title ig-grid-section__title">{title}</h2>
          <p className="ig-grid-section__lead">{description}</p>
        </div>

        {/* Profile Stats Bar */}
        <div className="ig-profile-banner">
          <div className="ig-profile-banner__info">
            <div className="ig-profile-banner__avatar-wrap">
              <img
                src="/images/isotipo-hiweb.png"
                alt="Hiweb"
                className="ig-profile-banner__avatar"
              />
              <span className="ig-profile-banner__verified" title="Verificado">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"/></svg>
              </span>
            </div>
            <div className="ig-profile-banner__meta">
              <div className="ig-profile-banner__handle-row">
                <h3 className="ig-profile-banner__handle">hiweb.mx</h3>
                <span className="ig-profile-banner__badge">Social Growth & Creative Hub</span>
              </div>
              <p className="ig-profile-banner__tagline">
                Estrategia, producción audiovisual y gestión de comunidades para marcas en México.
              </p>
            </div>
          </div>

          <div className="ig-profile-banner__stats">
            <div className="ig-profile-stat">
              <span className="ig-profile-stat__value">+1.2M</span>
              <span className="ig-profile-stat__label">Vistas orgánicas</span>
            </div>
            <div className="ig-profile-stat">
              <span className="ig-profile-stat__value">84.7%</span>
              <span className="ig-profile-stat__label">Engagement pico</span>
            </div>
            <div className="ig-profile-stat">
              <span className="ig-profile-stat__value">+14</span>
              <span className="ig-profile-stat__label">Marcas activas</span>
            </div>
          </div>
        </div>

        {/* Brand & Format Filter Tabs */}
        <div className="ig-filter-bar">
          <div className="ig-filter-bar__group">
            <span className="ig-filter-bar__label">Filtrar marca:</span>
            <div className="ig-filter-bar__pills">
              <button
                type="button"
                className={`ig-pill ${selectedBrand === 'all' ? 'is-active' : ''}`}
                onClick={() => setSelectedBrand('all')}
              >
                Todas las marcas
              </button>
              {SOCIAL_BRANDS.map((brand) => (
                <button
                  key={brand.id}
                  type="button"
                  className={`ig-pill ${selectedBrand === brand.id ? 'is-active' : ''}`}
                  onClick={() => setSelectedBrand(brand.id)}
                >
                  <img src={brand.avatar} alt="" className="ig-pill__icon" />
                  {brand.name}
                </button>
              ))}
            </div>
          </div>

          <div className="ig-filter-bar__group ig-filter-bar__group--types">
            <span className="ig-filter-bar__label">Formato:</span>
            <div className="ig-filter-bar__pills">
              <button
                type="button"
                className={`ig-pill-type ${selectedKind === 'all' ? 'is-active' : ''}`}
                onClick={() => setSelectedKind('all')}
              >
                Todos
              </button>
              <button
                type="button"
                className={`ig-pill-type ${selectedKind === 'reel' ? 'is-active' : ''}`}
                onClick={() => setSelectedKind('reel')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M9 7.5v9l7-4.5-7-4.5Z"/></svg>
                Reels
              </button>
              <button
                type="button"
                className={`ig-pill-type ${selectedKind === 'carousel' ? 'is-active' : ''}`}
                onClick={() => setSelectedKind('carousel')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><rect x="7" y="7" width="12" height="12" rx="2"/><rect x="4" y="4" width="12" height="12" rx="2" fill="currentColor"/></svg>
                Carruseles
              </button>
              <button
                type="button"
                className={`ig-pill-type ${selectedKind === 'photo' ? 'is-active' : ''}`}
                onClick={() => setSelectedKind('photo')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                Fotos
              </button>
            </div>
          </div>
        </div>

        {/* Instagram Post Grid */}
        <div className="ig-posts-grid">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="ig-post-card"
              onClick={() => setActivePost(post)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setActivePost(post);
              }}
            >
              <div className="ig-post-card__media">
                <img
                  src={post.cover}
                  alt={post.caption}
                  className="ig-post-card__img"
                  loading="lazy"
                />

                {/* Corner Type Badge */}
                <div className="ig-post-card__badge" aria-hidden="true">
                  {post.kind === 'reel' && (
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 7.5v9l7-4.5-7-4.5Z"/></svg>
                  )}
                  {post.kind === 'carousel' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="7" y="7" width="12" height="12" rx="2"/><rect x="4" y="4" width="12" height="12" rx="2" fill="currentColor"/></svg>
                  )}
                </div>

                {/* Hover Overlay with Real Engagement */}
                <div className="ig-post-card__overlay">
                  <div className="ig-post-card__overlay-brand">
                    <img src={post.brandAvatar} alt="" className="ig-post-card__overlay-avatar" />
                    <span>{post.brandName}</span>
                  </div>

                  <div className="ig-post-card__overlay-stats">
                    {post.stats.views && (
                      <span className="ig-stat-item">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                        {post.stats.views}
                      </span>
                    )}
                    {post.stats.likes && (
                      <span className="ig-stat-item">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        {post.stats.likes}
                      </span>
                    )}
                    {post.stats.comments && (
                      <span className="ig-stat-item">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                        {post.stats.comments}
                      </span>
                    )}
                  </div>

                  {post.outcomeTag && (
                    <span className="ig-post-card__overlay-outcome">
                      {post.outcomeTag}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Card Summary */}
              <div className="ig-post-card__footer">
                <div className="ig-post-card__brand-pill">
                  <span className="ig-post-card__brand-dot" />
                  <span className="ig-post-card__brand-name">{post.brandHandle}</span>
                </div>
                <p className="ig-post-card__caption-preview">{post.caption}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Lightbox / Post Modal */}
        {activePost && (
          <div className="ig-modal-backdrop" onClick={() => setActivePost(null)}>
            <div className="ig-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="ig-modal-close"
                onClick={() => setActivePost(null)}
                aria-label="Cerrar publicación"
              >
                ✕
              </button>

              <div className="ig-modal-layout">
                {/* Media Viewport */}
                <div className="ig-modal-media">
                  <img
                    src={activePost.slides[currentSlideIndex]?.src || activePost.cover}
                    alt={activePost.slides[currentSlideIndex]?.alt || activePost.caption}
                    className="ig-modal-media__img"
                  />

                  {activePost.slides.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="ig-modal-nav ig-modal-nav--prev"
                        onClick={() =>
                          setCurrentSlideIndex((prev) =>
                            prev > 0 ? prev - 1 : activePost.slides.length - 1
                          )
                        }
                        aria-label="Foto anterior"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        className="ig-modal-nav ig-modal-nav--next"
                        onClick={() =>
                          setCurrentSlideIndex((prev) =>
                            prev < activePost.slides.length - 1 ? prev + 1 : 0
                          )
                        }
                        aria-label="Foto siguiente"
                      >
                        ›
                      </button>
                      <div className="ig-modal-dots">
                        {activePost.slides.map((_, i) => (
                          <span
                            key={i}
                            className={`ig-modal-dot ${i === currentSlideIndex ? 'is-active' : ''}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Sidebar Details */}
                <div className="ig-modal-sidebar">
                  {/* Brand Header */}
                  <div className="ig-modal-sidebar__head">
                    <div className="ig-modal-sidebar__brand">
                      <div className="ig-modal-sidebar__avatar-ring">
                        <img
                          src={activePost.brandAvatar}
                          alt={activePost.brandName}
                          className="ig-modal-sidebar__avatar"
                        />
                      </div>
                      <div>
                        <div className="ig-modal-sidebar__name-row">
                          <h4 className="ig-modal-sidebar__handle">{activePost.brandHandle}</h4>
                          <span className="ig-modal-sidebar__bullet">•</span>
                          <span className="ig-modal-sidebar__follow">Seguir</span>
                        </div>
                        <p className="ig-modal-sidebar__category">{activePost.brandCategory}</p>
                      </div>
                    </div>
                  </div>

                  {/* Caption Content */}
                  <div className="ig-modal-sidebar__body">
                    <div className="ig-modal-sidebar__post-entry">
                      <p className="ig-modal-sidebar__caption">
                        <strong className="ig-modal-sidebar__caption-handle">{activePost.brandHandle}</strong>{' '}
                        {activePost.caption}
                      </p>
                      <p className="ig-modal-sidebar__hashtags">
                        #MarketingDigital #Hiweb #RedesSociales #ContentCreation #{activePost.brandId}
                      </p>
                    </div>

                    {activePost.outcomeTag && (
                      <div className="ig-modal-sidebar__metric-box">
                        <span className="ig-modal-sidebar__metric-label">Impacto registrado:</span>
                        <strong className="ig-modal-sidebar__metric-value">{activePost.outcomeTag}</strong>
                      </div>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div className="ig-modal-sidebar__footer">
                    <div className="ig-modal-sidebar__stats-strip">
                      {activePost.stats.likes && (
                        <span>❤️ {activePost.stats.likes} Me gusta</span>
                      )}
                      {activePost.stats.views && (
                        <span>👁️ {activePost.stats.views} Reproducciones</span>
                      )}
                    </div>

                    <div className="ig-modal-sidebar__actions">
                      {activePost.caseSlug && (
                        <Button
                          href={`/portafolio/${activePost.caseSlug}`}
                          variant="secondary"
                          size="sm"
                          className="no-underline w-full justify-center"
                        >
                          Ver caso de éxito completo →
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
