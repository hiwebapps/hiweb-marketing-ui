import { Button } from '../ui';
import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';
import type { BadgeVariant } from '../ui';
import './PortalShowcase.css';

type PortalShowcaseProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  badgeVariant?: BadgeVariant;
  headingWidth?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  clientName?: string;
  locale?: 'es' | 'en';
};

const COPY = {
  es: {
    eyebrow: 'Portal de clientes',
    title: 'Tus clientes aprueban rápido.',
    description:
      'El visor donde revisan redes, sitios, artículos y reportes. Un clic y ven cómo funciona.',
    primary: 'Ver el portal',
    secondary: 'Agenda tu auditoría',
    client: 'Aura Café & Roastery',
    window: 'Portal de Clientes',
    pieces: ['Carrusel Origen Chiapas', 'Sitio web', 'Artículo SEO'],
    pending: 'Pendiente',
    approved: 'Aprobado',
    cursors: ['Claudia', 'Alex'],
  },
  en: {
    eyebrow: 'Client portal',
    title: 'Your clients approve faster.',
    description:
      'The viewer where they review social, websites, articles, and reports. One click and they see how it works.',
    primary: 'See the portal',
    secondary: 'Schedule your audit',
    client: 'Aura Café & Roastery',
    window: 'Client Portal',
    pieces: ['Chiapas Origin carousel', 'Website', 'SEO article'],
    pending: 'Pending',
    approved: 'Approved',
    cursors: ['Claudia', 'Alex'],
  },
} as const;

function CursorMark({ name, variant }: { name: string; variant: 'a' | 'b' }) {
  return (
    <span className={`portal-showcase__cursor portal-showcase__cursor--${variant}`}>
      <svg viewBox="0 0 16 18" width="18" height="20" aria-hidden="true">
        <path d="M1.4 1.1 1.4 14.6 5.6 10.7 9.1 17.1 11.6 15.7 8.1 9.4 13.8 8.9Z" />
      </svg>
      <span>{name}</span>
    </span>
  );
}

export function PortalShowcase({
  eyebrow,
  title,
  description,
  badgeVariant = 'cyan',
  headingWidth,
  primaryLabel,
  primaryHref = '/portal',
  secondaryLabel,
  secondaryHref = '/contacto',
  clientName,
  locale = 'es',
}: PortalShowcaseProps) {
  const copy = COPY[locale];
  return (
    <SectionBand id="portal" tone="ink" className="portal-showcase-band">
      <div className="portal-showcase">
        <div className="portal-showcase__copy">
          <SectionHeader
            eyebrow={eyebrow || copy.eyebrow}
            title={title || copy.title}
            description={description || copy.description}
            badgeVariant={badgeVariant}
            tone="on-ink"
            headingWidth={headingWidth}
          />
          <div className="portal-showcase__actions">
            <Button href={primaryHref}>{primaryLabel || copy.primary}</Button>
            <Button href={secondaryHref} variant="secondary">
              {secondaryLabel || copy.secondary}
            </Button>
          </div>
        </div>
        <a className="portal-showcase__stage" href={primaryHref} aria-label={primaryLabel || copy.primary}>
          <div className="portal-showcase__window" aria-hidden="true">
            <div className="portal-showcase__bar">
              <span className="portal-showcase__dots">
                <i />
                <i />
                <i />
              </span>
              <span>
                {copy.window} <em>/ {clientName || copy.client}</em>
              </span>
            </div>
            <div className="portal-showcase__body">
              <ul>
                {copy.pieces.map((piece, index) => {
                  const actor = index === 0 ? 'a' : index === copy.pieces.length - 1 ? 'b' : null;
                  return (
                    <li key={piece} className={actor ? 'portal-showcase__row--target' : undefined}>
                      <span>{piece}</span>
                      {actor ? (
                        <span className={`portal-showcase__pill portal-showcase__pill--live portal-showcase__pill--${actor}`}>
                          <span className="portal-showcase__state portal-showcase__state--pending">{copy.pending}</span>
                          <span className="portal-showcase__state portal-showcase__state--approved">{copy.approved}</span>
                          <span className="portal-showcase__click" aria-hidden="true" />
                          <CursorMark name={copy.cursors[actor === 'a' ? 0 : 1]} variant={actor} />
                        </span>
                      ) : (
                        <span className="portal-showcase__pill">{copy.pending}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </a>
      </div>
    </SectionBand>
  );
}
