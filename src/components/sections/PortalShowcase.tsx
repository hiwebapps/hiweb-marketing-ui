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
    cursors: ['Claudia', 'Alex'],
  },
} as const;

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
                {copy.pieces.map((piece) => (
                  <li key={piece}>
                    <span>{piece}</span>
                    <span className="portal-showcase__pill">{copy.pending}</span>
                  </li>
                ))}
              </ul>
              <span className="portal-showcase__cursor portal-showcase__cursor--a">{copy.cursors[0]}</span>
              <span className="portal-showcase__cursor portal-showcase__cursor--b">{copy.cursors[1]}</span>
            </div>
          </div>
        </a>
      </div>
    </SectionBand>
  );
}
