import { Badge, Button } from '../ui';
import './FinalCta.css';

type FinalCtaProps = {
  badge?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

type MarqueeCard = {
  src: string;
  size: 's' | 'm' | 'l' | 'xl';
};

const ROWS: MarqueeCard[][] = [
  [
    { src: '/images/services/branding.jpg', size: 'l' },
    { src: 'https://picsum.photos/id/1015/720/420', size: 'xl' },
    { src: '/images/services/seo.jpg', size: 'm' },
    { src: 'https://picsum.photos/id/119/640/400', size: 'l' },
    { src: '/images/services/meta-ads.jpg', size: 's' },
    { src: 'https://picsum.photos/id/160/700/420', size: 'xl' },
  ],
  [
    { src: 'https://picsum.photos/id/180/700/420', size: 'xl' },
    { src: '/images/services/google-ads.jpg', size: 'm' },
    { src: 'https://picsum.photos/id/201/640/400', size: 'l' },
    { src: '/images/services/redes-sociales.jpg', size: 's' },
    { src: 'https://picsum.photos/id/28/720/420', size: 'xl' },
    { src: '/images/services/ia-marketing.jpg', size: 'm' },
  ],
  [
    { src: '/images/services/desarrollo-web.jpg', size: 'l' },
    { src: 'https://picsum.photos/id/29/640/400', size: 'm' },
    { src: '/images/services/crm-automatizacion.jpg', size: 'xl' },
    { src: 'https://picsum.photos/id/57/700/420', size: 's' },
    { src: '/images/services/community-manager.jpg', size: 'l' },
    { src: 'https://picsum.photos/id/122/640/400', size: 'm' },
  ],
  [
    { src: 'https://picsum.photos/id/110/720/420', size: 'm' },
    { src: '/images/services/branding.jpg', size: 'xl' },
    { src: 'https://picsum.photos/id/64/640/400', size: 's' },
    { src: '/images/services/seo.jpg', size: 'l' },
    { src: 'https://picsum.photos/id/76/700/420', size: 'xl' },
    { src: '/images/services/meta-ads.jpg', size: 'm' },
  ],
];

function MarqueeRow({ cards, reverse }: { cards: MarqueeCard[]; reverse: boolean }) {
  const loop = [...cards, ...cards];

  return (
    <div className={`final-cta__row${reverse ? ' final-cta__row--reverse' : ''}`}>
      <div className="final-cta__track">
        {loop.map((card, index) => (
          <article
            key={`${card.src}-${index}`}
            className={`final-cta__card final-cta__card--${card.size}`}
          >
            <img src={card.src} alt="" draggable={false} decoding="async" />
          </article>
        ))}
      </div>
    </div>
  );
}

/**
 * Final CTA — panel ink con marquee infinito y una sola decisión.
 */
export function FinalCta({
  badge = 'Siguiente paso',
  title = 'Listos cuando tú lo estés.',
  description = 'Cuéntanos industria, objetivo e ICP. Te devolvemos un diagnóstico claro y el siguiente paso.',
  primaryLabel = 'Agenda tu auditoría',
  primaryHref = '/contacto',
}: FinalCtaProps) {
  return (
    <section id="contacto" className="final-cta" data-scroll-section="contacto">
      <div className="final-cta__panel">
        <div className="final-cta__marquee" aria-hidden="true">
          {ROWS.map((cards, index) => (
            <MarqueeRow key={index} cards={cards} reverse={index % 2 === 0} />
          ))}
        </div>

        <div className="final-cta__veil" />

        <div className="final-cta__content">
          <Badge variant="lime" tone="on-ink">
            {badge}
          </Badge>
          <h2 className="final-cta__title">{title}</h2>
          <p className="final-cta__lead">{description}</p>
          <Button href={primaryHref} variant="primary" size="md" className="final-cta__btn no-underline">
            {primaryLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
