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
  align?: 'left' | 'center';
  locale?: 'es' | 'en';
  posts?: SocialPost[];
  brands?: BrandProfile[];
};

function parseStatNum(val?: string | number): number {
  if (val == null) return 0;
  if (typeof val === 'number') return val;
  const s = String(val).trim().toLowerCase().replace(/,/g, '');
  if (!s) return 0;
  if (s.endsWith('m')) return parseFloat(s) * 1_000_000 || 0;
  if (s.endsWith('k')) return parseFloat(s) * 1_000 || 0;
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function getPostEngagement(stats?: { views?: string; likes?: string; comments?: string; shares?: string }): number {
  if (!stats) return 0;
  return parseStatNum(stats.views) + (parseStatNum(stats.likes) * 5) + (parseStatNum(stats.comments) * 10) + (parseStatNum(stats.shares) * 10);
}

export function InstagramGridFeed({
  id = 'feed-instagram',
  eyebrow = 'Feed en vivo',
  title = 'Contenido que despierta deseo y llena agendas',
  description = 'Publicaciones reales producidas y gestionadas para nuestros clientes: dirección de arte, video de alto impacto y copys diseñados para vender.',
  headingWidth,
  tone = 'canvas',
  align = 'left',
  locale = 'es',
  posts: customPosts,
  brands: customBrands,
}: InstagramGridFeedProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [activePost, setActivePost] = useState<SocialPost | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const postsPool = useMemo(() => {
    if (customPosts && customPosts.length > 0) {
      return [...customPosts].sort((a, b) => getPostEngagement(b.stats) - getPostEngagement(a.stats));
    }
    if (customBrands && customBrands.length > 0) {
      const onePostPerBrand: SocialPost[] = [];
      for (const brand of customBrands) {
        const visiblePosts = (brand.posts || []).filter((p) => p.showInService !== false);
        const candidates = visiblePosts.length > 0 ? visiblePosts : brand.posts || [];
        if (candidates.length > 0) {
          const sorted = [...candidates].sort((a, b) => getPostEngagement(b.stats) - getPostEngagement(a.stats));
          onePostPerBrand.push(sorted[0]);
        }
      }
      onePostPerBrand.sort((a, b) => getPostEngagement(b.stats) - getPostEngagement(a.stats));
      return onePostPerBrand;
    }
    return [...ALL_POSTS].sort((a, b) => getPostEngagement(b.stats) - getPostEngagement(a.stats));
  }, [customPosts, customBrands]);

  const industriesList = useMemo(() => {
    if (customBrands && customBrands.length > 0) {
      const map = new Map<string, string>();
      map.set('all', locale === 'en' ? 'All industries' : 'Todas las industrias');
      for (const b of customBrands) {
        if (b.industryId && b.industryName) {
          map.set(b.industryId, b.industryName);
        }
      }
      if (map.size > 1) {
        return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
      }
    }
    return SOCIAL_INDUSTRIES;
  }, [customBrands, locale]);

  // Posts filtered by industry
  const filteredPosts = useMemo(() => {
    const list = postsPool.filter((post) => {
      return selectedIndustry === 'all' || post.industryId === selectedIndustry;
    });
    return list.sort((a, b) => getPostEngagement(b.stats) - getPostEngagement(a.stats));
  }, [postsPool, selectedIndustry]);

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
        align={align}
        badgeVariant="orange"
        headingWidth={headingWidth}
      />

      {/* Filter Controls aligned to kit */}
      <div className="ig-controls">
        {/* Industry Filters using Kit Buttons */}
        <div className="ig-industry-filters" role="group" aria-label="Filtrar por industria">
          {industriesList.map((ind) => {
            const active = selectedIndustry === ind.id;
            return (
              <Button
                key={ind.id}
                type="button"
                size="sm"
                variant={active ? 'primary' : 'secondary'}
                glow={active}
                aria-pressed={active}
                onClick={() => setSelectedIndustry(ind.id)}
              >
                {ind.name}
              </Button>
            );
          })}
        </div>
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

              {/* Instagram Format Indicator (Top Right) */}
              {post.kind === 'reel' && (
                <div className="ig-post-card__format-mark" aria-label="Reel">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M10 8.5v7l6-3.5-6-3.5Z" />
                  </svg>
                </div>
              )}
              {post.kind === 'carousel' && (
                <div className="ig-post-card__format-mark" aria-label="Carrusel">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="7" y="7" width="12" height="12" rx="2" />
                    <rect x="4" y="4" width="12" height="12" rx="2" fill="currentColor" stroke="none" />
                  </svg>
                </div>
              )}

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
                  {post.stats.views && parseStatNum(post.stats.views) > 0 && (
                    <span className="ig-stat-item">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                      </svg>
                      {post.stats.views}
                    </span>
                  )}
                  {post.stats.comments && parseStatNum(post.stats.comments) > 0 && (
                    <span className="ig-stat-item">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                      </svg>
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
                {activePost.kind === 'reel' && activePost.videoUrl ? (
                  <video
                    src={activePost.videoUrl}
                    poster={activePost.cover}
                    controls
                    autoPlay
                    muted
                    playsInline
                    className="ig-modal-media__video"
                  />
                ) : (
                  <img
                    src={activePost.slides[currentSlideIndex]?.src || activePost.cover}
                    alt={activePost.slides[currentSlideIndex]?.alt || activePost.caption}
                    className="ig-modal-media__img"
                  />
                )}

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
                    <div className="ig-modal-sidebar__brand-meta">
                      <h4 className="ig-modal-sidebar__handle">{activePost.brandHandle}</h4>
                      <p className="ig-modal-sidebar__category">
                        {activePost.brandName}
                      </p>
                    </div>
                  </div>
                  {activePost.industryName && (
                    <div className="ig-modal-sidebar__tag-wrap">
                      <Badge variant="orange">{activePost.industryName}</Badge>
                    </div>
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

                    {activePost.stats.views && parseStatNum(activePost.stats.views) > 0 && (
                      <div className="ig-modal-sidebar__views-badge">
                        <span>👁️ {activePost.stats.views} {locale === 'en' ? 'views' : 'reproducciones'}</span>
                      </div>
                    )}
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
                  <div className="ig-modal-sidebar__actions">
                    {activePost.caseSlug && (
                      <Button
                        href={locale === 'en' ? `/en/success-stories/${activePost.caseSlug}` : `/portafolio/${activePost.caseSlug}`}
                        variant="primary"
                        size="sm"
                        glow
                        className="no-underline w-full justify-center"
                      >
                        {locale === 'en'
                          ? 'View case study →'
                          : 'Ver caso de éxito →'}
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
