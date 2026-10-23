import { useState, useMemo, useRef, useEffect } from 'react';
import {
  SOCIAL_BRANDS,
  SOCIAL_INDUSTRIES,
  type BrandProfile,
  type SocialPost,
} from './social-feed-data';
import { Badge, Button } from '../ui';
import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';
import './InstagramPhoneSwitcher.css';

export type InstagramPhoneSwitcherProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  headingWidth?: string;
  tone?: 'canvas' | 'surface' | 'wash';
  brandId?: string;
  brand?: BrandProfile;
  hideSwitcher?: boolean;
  align?: 'left' | 'center';
};

export function InstagramPhoneSwitcher({
  id = 'feed-phone-switcher',
  eyebrow,
  title,
  description,
  headingWidth,
  tone = 'surface',
  brandId,
  brand: customBrand,
  hideSwitcher = false,
  align,
}: InstagramPhoneSwitcherProps) {
  const isSingleBrand = Boolean(hideSwitcher || brandId || customBrand);

  const matchedBrand = useMemo(() => {
    if (customBrand) return customBrand;
    if (brandId) {
      const clean = brandId.toLowerCase().trim();
      return (
        SOCIAL_BRANDS.find(
          (b) =>
            b.id.toLowerCase() === clean ||
            b.handle.toLowerCase() === clean ||
            clean.includes(b.id.toLowerCase()) ||
            b.id.toLowerCase().includes(clean) ||
            b.name.toLowerCase().includes(clean) ||
            clean.includes(b.name.toLowerCase()),
        ) || null
      );
    }
    return null;
  }, [customBrand, brandId]);

  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedBrandIndex, setSelectedBrandIndex] = useState(0);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setIsPlaying(true);
    setIsMuted(true);
  }, [selectedPost]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => undefined);
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const visibleBrands = useMemo(() => {
    if (selectedIndustry === 'all') return SOCIAL_BRANDS;
    return SOCIAL_BRANDS.filter((b) => b.industryId === selectedIndustry);
  }, [selectedIndustry]);

  // Keep selected brand valid if industry filter changes
  const brand: BrandProfile =
    matchedBrand ||
    (isSingleBrand
      ? SOCIAL_BRANDS[0]
      : visibleBrands[selectedBrandIndex] || visibleBrands[0] || SOCIAL_BRANDS[0]);

  const resolvedEyebrow =
    eyebrow ?? (isSingleBrand ? 'Feed de Instagram' : 'En las manos de tu audiencia');
  const resolvedTitle =
    title ??
    (isSingleBrand
      ? `Feed de ${brand.name}`
      : 'Perfiles cuidados hasta el último píxel');
  const resolvedDescription =
    description ??
    (isSingleBrand
      ? `Estrategia visual, cuadrícula y publicaciones producidas para ${brand.name}.`
      : 'Interactúa con feeds reales en vivo. Diseñamos cuadrículas armónicas, producimos contenido visual con ritmo y redactamos copys que conectan con la intención de compra.');
  const resolvedAlign = align ?? (isSingleBrand ? 'left' : 'center');

  return (
    <SectionBand id={id} tone={tone} className="ig-switcher-band">
      {/* Kit Section Header */}
      <SectionHeader
        eyebrow={resolvedEyebrow}
        title={resolvedTitle}
        description={resolvedDescription}
        align={resolvedAlign}
        badgeVariant="lime"
        headingWidth={headingWidth}
      />

      {/* Filter by Industry (Omitted in single-brand mode) */}
      {!isSingleBrand ? (
        <div className="ig-switcher-controls">
          <div className="ig-switcher-industry-filters" role="group" aria-label="Filtrar por industria">
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
                    setSelectedBrandIndex(0);
                    setSelectedPost(null);
                  }}
                >
                  {ind.name}
                </Button>
              );
            })}
          </div>

          {/* Brand Stories Selector */}
          <div className="ig-story-selector">
            <p className="ig-story-selector__title">Elige una marca para explorar su cuenta:</p>
            <div className="ig-story-selector__track">
              {visibleBrands.map((item, idx) => {
                const isActive = item.id === brand.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`ig-story-circle ${isActive ? 'is-active' : ''}`}
                    onClick={() => {
                      setSelectedBrandIndex(idx);
                      setSelectedPost(null);
                    }}
                  >
                    <div className="ig-story-circle__ring">
                      <img src={item.avatar} alt={item.name} className="ig-story-circle__img" />
                    </div>
                    <span className="ig-story-circle__name">{item.name.split(' ')[0]}</span>
                    <span className="ig-story-circle__ind">{item.industryName.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {/* 2-Column Showcase */}
      <div className="ig-switcher-layout">
        {/* Left Column: Context & Metrics */}
        <div className="ig-switcher-copy">
          <div className="ig-brand-card">
            <div className="ig-brand-card__header">
              <img src={brand.avatar} alt="" className="ig-brand-card__avatar" />
              <div className="ig-brand-card__meta">
                <div className="ig-brand-card__row">
                  <h3 className="ig-brand-card__name">{brand.name}</h3>
                  {brand.industryName ? <Badge variant="orange">{brand.industryName}</Badge> : null}
                </div>
                <span className="ig-brand-card__handle">@{brand.handle}</span>
              </div>
            </div>

            <p className="ig-brand-card__bio">{brand.bio}</p>

            {!isSingleBrand ? (
              <div className="ig-brand-card__metrics">
                <div className="ig-brand-metric">
                  <span className="ig-brand-metric__val">{brand.stats.followers}</span>
                  <span className="ig-brand-metric__lbl">Seguidores</span>
                </div>
                <div className="ig-brand-metric">
                  <span className="ig-brand-metric__val">{brand.stats.posts}</span>
                  <span className="ig-brand-metric__lbl">Publicaciones</span>
                </div>
                <div className="ig-brand-metric">
                  <span className="ig-brand-metric__val">
                    {brand.posts[0]?.outcomeTag || 'Impacto probado'}
                  </span>
                  <span className="ig-brand-metric__lbl">Resultado clave</span>
                </div>
              </div>
            ) : (
              <div className="ig-brand-card__metrics">
                <div className="ig-brand-metric">
                  <span className="ig-brand-metric__val">{brand.stats.followers}</span>
                  <span className="ig-brand-metric__lbl">Seguidores</span>
                </div>
                <div className="ig-brand-metric">
                  <span className="ig-brand-metric__val">{brand.stats.posts}</span>
                  <span className="ig-brand-metric__lbl">Publicaciones</span>
                </div>
              </div>
            )}

            {!isSingleBrand && brand.posts[0]?.caseSlug && (
              <div className="ig-brand-card__cta">
                <Button
                  href={`/portafolio/${brand.posts[0].caseSlug}`}
                  variant="primary"
                  size="sm"
                  glow
                  className="no-underline w-full justify-center"
                >
                  Ver caso de estudio de {brand.name} →
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Realistic iPhone Device */}
        <div className="ig-phone-col">
          <div className="ig-mockup">
            {/* Outer Titanium Frame */}
            <div className="ig-mockup__frame">
              {/* Screen Bezel */}
              <div className="ig-mockup__screen">
                {/* Dynamic Island */}
                <div className="ig-mockup__island">
                  <span className="ig-mockup__camera" />
                </div>

                {/* Status Bar */}
                <div className="ig-status-bar">
                  <span className="ig-status-bar__time">9:41</span>
                  <div className="ig-status-bar__icons">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.27 19.55 10.59 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9z" />
                    </svg>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4z" />
                    </svg>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <rect x="2" y="7" width="18" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
                      <rect x="4" y="9" width="12" height="6" rx="1.5" />
                      <path d="M22 11v2" />
                    </svg>
                  </div>
                </div>

                {/* Main App Body */}
                <div className={`ig-app-content ${selectedPost ? 'is-post-active' : ''}`}>
                  {!selectedPost ? (
                    /* View A: Profile View */
                    <div className="ig-app-profile">
                      {/* Profile Header Bar */}
                      <div className="ig-app-topbar">
                        <span className="ig-app-topbar__back">
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M15 18l-6-6 6-6" />
                          </svg>
                        </span>
                        <span className="ig-app-topbar__user">{brand.handle}</span>
                        <span className="ig-app-topbar__more">•••</span>
                      </div>

                      {/* Profile Info */}
                      <div className="ig-app-info">
                        <div className="ig-app-info__row">
                          <div className="ig-app-avatar-ring">
                            <img src={brand.avatar} alt="" className="ig-app-avatar" />
                          </div>
                          <div className="ig-app-stats">
                            <div className="ig-app-stat">
                              <strong>{brand.stats.posts}</strong>
                              <span>posts</span>
                            </div>
                            <div className="ig-app-stat">
                              <strong>{brand.stats.followers}</strong>
                              <span>seguidores</span>
                            </div>
                            <div className="ig-app-stat">
                              <strong>{brand.stats.following}</strong>
                              <span>seguidos</span>
                            </div>
                          </div>
                        </div>

                        <div className="ig-app-bio">
                          <h4 className="ig-app-bio__title">{brand.name}</h4>
                          <p className="ig-app-bio__category">{brand.industryName || brand.category}</p>
                          <p className="ig-app-bio__text">{brand.bio}</p>
                          {brand.linkText && (
                            <p className="ig-app-bio__link">🔗 {brand.linkText}</p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="ig-app-actions">
                          <button type="button" className="ig-app-btn ig-app-btn--primary">Seguir</button>
                          <button type="button" className="ig-app-btn">Mensaje</button>
                          <button type="button" className="ig-app-btn">Contacto</button>
                        </div>

                        {/* Story Highlights */}
                        {brand.highlights.length > 0 && (
                          <div className="ig-app-highlights">
                            {brand.highlights.map((h, i) => (
                              <div key={i} className="ig-app-highlight">
                                <div className="ig-app-highlight__circle">
                                  <img src={h.cover} alt="" />
                                </div>
                                <span>{h.title}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Tab bar */}
                        <div className="ig-app-tabs">
                          <button type="button" className="ig-app-tab is-active" aria-label="Cuadrícula">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                              <path d="M3 3h7v7H3zm11 0h7v7h-7zm0 11h7v7h-7zM3 14h7v7H3z" />
                            </svg>
                          </button>
                          <button type="button" className="ig-app-tab" aria-label="Reels">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="4" />
                              <path d="m10 8.5 6 3.5-6 3.5v-7Z" fill="currentColor" />
                            </svg>
                          </button>
                        </div>

                        {/* 3x3 Post Grid */}
                        <div className="ig-app-grid">
                          {brand.posts.map((post) => (
                            <button
                              key={post.id}
                              type="button"
                              className="ig-app-grid__item"
                              onClick={() => setSelectedPost(post)}
                            >
                              <img src={post.cover} alt="" />
                              {post.kind === 'reel' && (
                                <span className="ig-app-grid__mark" aria-hidden="true">
                                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                                    <path d="M10 8.5v7l6-3.5-6-3.5Z" />
                                  </svg>
                                </span>
                              )}
                              {post.kind === 'carousel' && (
                                <span className="ig-app-grid__mark" aria-hidden="true">
                                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="7" y="7" width="12" height="12" rx="2" />
                                    <rect x="4" y="4" width="12" height="12" rx="2" fill="currentColor" stroke="none" />
                                  </svg>
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : selectedPost.kind === 'reel' ? (
                    /* View B: Vertical Reel Player (9:16 Full Experience) */
                    <div className="ig-app-reel-view">
                      <div className="ig-reel-viewport" onClick={togglePlay}>
                        {selectedPost.videoUrl ? (
                          <video
                            ref={videoRef}
                            src={selectedPost.videoUrl}
                            poster={selectedPost.cover}
                            autoPlay
                            muted={isMuted}
                            playsInline
                            loop
                            className="ig-reel-video"
                          />
                        ) : (
                          <img src={selectedPost.cover} alt="" className="ig-reel-video" />
                        )}

                        {/* Centered Play indicator when paused */}
                        {!isPlaying && (
                          <div className="ig-reel-paused-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )}

                        {/* Top Reel Navigation Bar */}
                        <div className="ig-reel-topbar">
                          <button
                            type="button"
                            className="ig-reel-topbar__btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPost(null);
                            }}
                            aria-label="Volver al perfil"
                          >
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M15 18l-6-6 6-6" />
                            </svg>
                          </button>
                          <span className="ig-reel-topbar__title">Reels</span>
                          <button
                            type="button"
                            className="ig-reel-topbar__btn"
                            onClick={toggleMute}
                            aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                          >
                            {isMuted ? (
                              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
                              </svg>
                            ) : (
                              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                              </svg>
                            )}
                          </button>
                        </div>

                        {/* Bottom & Side Reels Overlay */}
                        <div className="ig-reel-overlay">
                          <div className="ig-reel-overlay__left">
                            <div className="ig-reel-overlay__brand">
                              <img src={selectedPost.brandAvatar} alt="" className="ig-reel-overlay__avatar" />
                              <span className="ig-reel-overlay__handle">{selectedPost.brandHandle}</span>
                              <span className="ig-reel-overlay__dot">•</span>
                              <span className="ig-reel-overlay__follow">Seguir</span>
                            </div>
                            {selectedPost.caption && (
                              <p className="ig-reel-overlay__caption">{selectedPost.caption}</p>
                            )}
                            <div className="ig-reel-overlay__audio">
                              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                              </svg>
                              <span>Audio original • {selectedPost.brandName}</span>
                            </div>
                          </div>

                          <div className="ig-reel-overlay__right">
                            <div className="ig-reel-action">
                              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                              </svg>
                              <span>{selectedPost.stats.comments || '48'}</span>
                            </div>
                            <div className="ig-reel-action">
                              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m22 2-7 20-4-9-9-4Z" />
                              </svg>
                              <span>{selectedPost.stats.shares || '120'}</span>
                            </div>
                            <button
                              type="button"
                              className="ig-reel-exit-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPost(null);
                              }}
                              aria-label="Cerrar reel"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* View C: Single Photo / Carousel Post Inside Phone */
                    <div className="ig-app-post-view">
                      <div className="ig-app-topbar">
                        <button
                          type="button"
                          className="ig-app-topbar__back"
                          onClick={() => setSelectedPost(null)}
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M15 18l-6-6 6-6" />
                          </svg>
                        </button>
                        <span className="ig-app-topbar__user">Publicación</span>
                        <span className="ig-app-topbar__more">•••</span>
                      </div>

                      {/* Post Header */}
                      <div className="ig-post-head">
                        <img src={selectedPost.brandAvatar} alt="" className="ig-post-head__avatar" />
                        <div>
                          <p className="ig-post-head__user">{selectedPost.brandHandle}</p>
                          <span className="ig-post-head__cat">{selectedPost.industryName || selectedPost.brandCategory}</span>
                        </div>
                      </div>

                      {/* Post Media */}
                      <div className="ig-post-media">
                        <img src={selectedPost.slides?.[0]?.src || selectedPost.cover} alt="" />
                      </div>

                      {/* Post Action Icons */}
                      <div className="ig-post-bar">
                        <div className="ig-post-bar__left">
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" color="#ff3040">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                          </svg>
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m22 2-7 20-4-9-9-4Z" />
                          </svg>
                        </div>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>

                      {/* Caption & Stats */}
                      <div className="ig-post-copy">
                        <p className="ig-post-caption">
                          <strong>{selectedPost.brandHandle}</strong> {selectedPost.caption}
                        </p>
                        <button
                          type="button"
                          className="ig-post-back-btn"
                          onClick={() => setSelectedPost(null)}
                        >
                          ← Volver al perfil
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Instagram Bottom Tab Bar */}
                  <div className="ig-app-bottombar" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                    </svg>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="7" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <path d="M12 8v8M8 12h8" />
                    </svg>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <img src={brand.avatar} alt="" className="ig-app-bottombar__avatar" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionBand>
  );
}
