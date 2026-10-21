import { useState, useMemo, useEffect } from 'react';
import {
  SOCIAL_BRANDS,
  SOCIAL_INDUSTRIES,
  ALL_POSTS,
  type SocialPost,
} from './social-feed-data';
import { Badge, Button } from '../ui';
import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';
import './InstagramGridFeed.css';

export type InstagramGridFeedProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  headingWidth?: string;
  tone?: 'canvas' | 'surface' | 'wash';
};

export function InstagramGridFeed({
  id = 'feed-instagram',
  eyebrow = 'Feed en vivo',
  title = 'Contenido que despierta deseo y llena agendas',
  description = 'Publicaciones reales producidas y gestionadas para nuestros clientes: dirección de arte, video de alto impacto y copys diseñados para vender.',
  headingWidth,
  tone = 'canvas',
}: InstagramGridFeedProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [activePost, setActivePost] = useState<SocialPost | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Brands belonging to the selected industry
  const availableBrands = useMemo(() => {
    if (selectedIndustry === 'all') return SOCIAL_BRANDS;
    return SOCIAL_BRANDS.filter((b) => b.industryId === selectedIndustry);
  }, [selectedIndustry]);

  // Posts filtered by industry and brand
  const filteredPosts = useMemo(() => {
    return ALL_POSTS.filter((post) => {
      const matchIndustry =
        selectedIndustry === 'all' || post.industryId === selectedIndustry;
      const matchBrand =
        selectedBrand === 'all' || post.brandId === selectedBrand;
      return matchIndustry && matchBrand;
    });
  }, [selectedIndustry, selectedBrand]);

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
    <SectionBand id={id} tone={tone} className="ig-grid-band">
      {/* Kit Section Header */}
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        align="center"
        badgeVariant="orange"
        headingWidth={headingWidth}
      />

      {/* Filter Controls aligned to kit */}
      <div className="ig-controls">
        {/* Industry Filters using Kit Buttons */}
        <div className="ig-industry-filters" role="group" aria-label="Filtrar por industria">
          {SOCIAL_INDUSTRIES.map((ind) => {
            const active = selectedIndustry === ind.id;
            return (
              <Button
                key={ind.id}
                type="button"
                size="sm"
                variant={active ? 'primary' : 'secondary'}
                glow={active}
                aria-pressed={active}
                onClick={() => {
                  setSelectedIndustry(ind.id);
                  setSelectedBrand('all');
                }}
              >
                {ind.name}
              </Button>
            );
          })}
        </div>

        {/* Sub-filter by Brand */}
        {availableBrands.length > 1 && (
          <div className="ig-brand-filters">
            <span className="ig-brand-filters__label">Marca:</span>
            <div className="ig-brand-filters__pills">
              <button
                type="button"
                className={`ig-brand-pill ${selectedBrand === 'all' ? 'is-active' : ''}`}
                onClick={() => setSelectedBrand('all')}
              >
                Todas
              </button>
              {availableBrands.map((brand) => (
                <button
                  key={brand.id}
                  type="button"
                  className={`ig-brand-pill ${selectedBrand === brand.id ? 'is-active' : ''}`}
                  onClick={() => setSelectedBrand(brand.id)}
                >
                  <img src={brand.avatar} alt="" className="ig-brand-pill__avatar" />
                  {brand.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Instagram Post Grid */}
      <div className="ig-posts-grid">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="ig-post-card group"
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

              {/* Industry Tag Badge (replaces format tag) */}
              <div className="ig-post-card__badge-wrap">
                <span className="ig-post-card__industry-badge">
                  {post.industryName || post.brandCategory}
                </span>
              </div>

              {/* Hover Overlay with Real Engagement */}
              <div className="ig-post-card__overlay">
                <div className="ig-post-card__overlay-brand">
                  <img
                    src={post.brandAvatar}
                    alt=""
                    className="ig-post-card__overlay-avatar"
                  />
                  <span>{post.brandName}</span>
                </div>

                <div className="ig-post-card__overlay-stats">
                  {post.stats.views && (
                    <span className="ig-stat-item">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                      </svg>
                      {post.stats.views}
                    </span>
                  )}
                  {post.stats.likes && (
                    <span className="ig-stat-item">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      {post.stats.likes}
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
                <img
                  src={post.brandAvatar}
                  alt=""
                  className="ig-post-card__footer-avatar"
                />
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
          <div
            className="ig-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="ig-modal-close"
              onClick={() => setActivePost(null)}
              aria-label="Cerrar publicación"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
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
                    <img
                      src={activePost.brandAvatar}
                      alt={activePost.brandName}
                      className="ig-modal-sidebar__avatar"
                    />
                    <div>
                      <div className="ig-modal-sidebar__name-row">
                        <h4 className="ig-modal-sidebar__handle">{activePost.brandHandle}</h4>
                        <span className="ig-modal-sidebar__bullet">•</span>
                        <span className="ig-modal-sidebar__follow">Hiweb Client</span>
                      </div>
                      <p className="ig-modal-sidebar__category">
                        {activePost.industryName || activePost.brandCategory}
                      </p>
                    </div>
                  </div>
                  {activePost.industryName && (
                    <Badge variant="orange">{activePost.industryName}</Badge>
                  )}
                </div>

                {/* Caption Content */}
                <div className="ig-modal-sidebar__body">
                  <div className="ig-modal-sidebar__post-entry">
                    <p className="ig-modal-sidebar__caption">
                      <strong className="ig-modal-sidebar__caption-handle">
                        {activePost.brandHandle}
                      </strong>{' '}
                      {activePost.caption}
                    </p>
                  </div>

                  {activePost.outcomeTag && (
                    <div className="ig-modal-sidebar__metric-box">
                      <span className="ig-modal-sidebar__metric-label">
                        Impacto registrado:
                      </span>
                      <strong className="ig-modal-sidebar__metric-value">
                        {activePost.outcomeTag}
                      </strong>
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
                        variant="primary"
                        size="sm"
                        glow
                        className="no-underline w-full justify-center"
                      >
                        Ver caso de éxito de {activePost.brandName} →
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SectionBand>
  );
}
