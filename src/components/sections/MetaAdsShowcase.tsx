import { useState, useMemo } from 'react';
import { META_ADS_DATA, type MetaAd } from './meta-ads-data';
import { Badge, Button } from '../ui';
import './MetaAdsShowcase.css';

export type MetaAdsShowcaseProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function MetaAdsShowcase({
  eyebrow = 'Paid Media & Performance',
  title = 'Anuncios en Meta que no se ven como anuncios',
  description = 'Estructuramos campañas de Facebook e Instagram Ads con copys persuasivos, creatividad que detiene el scroll y segmentación orientada a ventas y leads calificados.',
}: MetaAdsShowcaseProps) {
  const [activeObjective, setActiveObjective] = useState<string>('all');
  const [carouselIndices, setCarouselIndices] = useState<Record<string, number>>({});

  const filteredAds = useMemo(() => {
    if (activeObjective === 'all') return META_ADS_DATA;
    return META_ADS_DATA.filter((ad) => ad.objective === activeObjective);
  }, [activeObjective]);

  const handleNextSlide = (adId: string, max: number) => {
    setCarouselIndices((prev) => ({
      ...prev,
      [adId]: ((prev[adId] || 0) + 1) % max,
    }));
  };

  const handlePrevSlide = (adId: string, max: number) => {
    setCarouselIndices((prev) => ({
      ...prev,
      [adId]: ((prev[adId] || 0) - 1 + max) % max,
    }));
  };

  return (
    <section className="meta-ads-section" id="meta-ads-showcase">
      <div className="meta-ads-section__inner">
        {/* Header */}
        <div className="meta-ads-section__header">
          <Badge variant="lime" tone="on-ink">{eyebrow}</Badge>
          <h2 className="hw-section-title meta-ads-section__title">{title}</h2>
          <p className="meta-ads-section__lead">{description}</p>
        </div>

        {/* Objective Filter Pills */}
        <div className="meta-ads-filters">
          <button
            type="button"
            className={`meta-filter-pill ${activeObjective === 'all' ? 'is-active' : ''}`}
            onClick={() => setActiveObjective('all')}
          >
            Todos los objetivos ({META_ADS_DATA.length})
          </button>
          <button
            type="button"
            className={`meta-filter-pill ${activeObjective === 'ventas' ? 'is-active' : ''}`}
            onClick={() => setActiveObjective('ventas')}
          >
            🛍️ E-commerce & Ventas
          </button>
          <button
            type="button"
            className={`meta-filter-pill ${activeObjective === 'leads' ? 'is-active' : ''}`}
            onClick={() => setActiveObjective('leads')}
          >
            📋 Generación de Leads B2B / High-Ticket
          </button>
          <button
            type="button"
            className={`meta-filter-pill ${activeObjective === 'trafico' ? 'is-active' : ''}`}
            onClick={() => setActiveObjective('trafico')}
          >
            📍 Tráfico Local & Reservas
          </button>
        </div>

        {/* Ads Grid */}
        <div className="meta-ads-grid">
          {filteredAds.map((ad) => {
            const currentIdx = carouselIndices[ad.id] || 0;
            const currentMedia = ad.media[currentIdx] || ad.media[0];
            const hasMultiple = ad.media.length > 1;

            return (
              <div key={ad.id} className="meta-ad-wrapper">
                {/* Performance Pill Header */}
                <div className="meta-ad-kpi-bar">
                  <span className="meta-ad-kpi-tag">{ad.objectiveLabel}</span>
                  <div className="meta-ad-kpis">
                    {ad.metrics.roas && <span className="meta-kpi-badge meta-kpi-badge--roas">{ad.metrics.roas}</span>}
                    {ad.metrics.cpl && <span className="meta-kpi-badge">{ad.metrics.cpl}</span>}
                    {ad.metrics.conversions && <span className="meta-kpi-badge">{ad.metrics.conversions}</span>}
                  </div>
                </div>

                {/* Facebook / Instagram Ad Card */}
                <article className="meta-ad-card">
                  {/* Sponsor Header */}
                  <div className="meta-ad-card__head">
                    <img src={ad.brandAvatar} alt={ad.brandName} className="meta-ad-card__avatar" />
                    <div className="meta-ad-card__user-info">
                      <div className="meta-ad-card__name-row">
                        <h3 className="meta-ad-card__brand-name">{ad.brandName}</h3>
                        <span className="meta-ad-card__verified" title="Cuenta verificada">✓</span>
                      </div>
                      <p className="meta-ad-card__sponsored">
                        Publicidad · <span className="meta-ad-card__globe">🌐</span>
                      </p>
                    </div>
                    <div className="meta-ad-card__dots">•••</div>
                  </div>

                  {/* Primary Ad Copy */}
                  <div className="meta-ad-card__copy">
                    <p className="meta-ad-card__text">{ad.primaryText}</p>
                  </div>

                  {/* Ad Media (Image / Carousel) */}
                  <div className="meta-ad-card__media">
                    <img src={currentMedia} alt={ad.headline} className="meta-ad-card__img" loading="lazy" />

                    {hasMultiple && (
                      <>
                        <button
                          type="button"
                          className="meta-ad-nav meta-ad-nav--prev"
                          onClick={() => handlePrevSlide(ad.id, ad.media.length)}
                          aria-label="Anterior"
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          className="meta-ad-nav meta-ad-nav--next"
                          onClick={() => handleNextSlide(ad.id, ad.media.length)}
                          aria-label="Siguiente"
                        >
                          ›
                        </button>
                        <div className="meta-ad-dots">
                          {ad.media.map((_, i) => (
                            <span
                              key={i}
                              className={`meta-ad-dot ${i === currentIdx ? 'is-active' : ''}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* CTA Bar (Link / Action) */}
                  <div className="meta-ad-card__cta-bar">
                    <div className="meta-ad-card__cta-info">
                      <span className="meta-ad-card__url">{ad.displayUrl.toUpperCase()}</span>
                      <h4 className="meta-ad-card__headline">{ad.headline}</h4>
                    </div>
                    <button type="button" className="meta-ad-card__btn">
                      {ad.ctaText}
                    </button>
                  </div>

                  {/* Social Proof Footer */}
                  <div className="meta-ad-card__footer">
                    <div className="meta-ad-card__reactions">
                      <span className="meta-reaction-icon">👍</span>
                      <span className="meta-reaction-icon">❤️</span>
                      <span className="meta-reactions-count">{ad.likes}</span>
                    </div>
                    <div className="meta-ad-card__comments-shares">
                      <span>{ad.comments} comentarios</span>
                      <span>•</span>
                      <span>{ad.shares} veces compartido</span>
                    </div>
                  </div>
                </article>

                {/* Case Link */}
                {ad.caseSlug && (
                  <div className="meta-ad-case-link">
                    <Button
                      href={`/portafolio/${ad.caseSlug}`}
                      variant="ghost"
                      size="sm"
                      className="no-underline w-full justify-center text-xs text-white/70 hover:text-white"
                    >
                      Ver caso completo de {ad.brandName} →
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
