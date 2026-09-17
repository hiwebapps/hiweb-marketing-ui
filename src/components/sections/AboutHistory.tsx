import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';
import './AboutHistory.css';

export type AboutHistoryImage = {
  src: string;
  alt: string;
};

export type AboutHistoryColumn = {
  title: string;
  paragraphs: string[];
};

type AboutHistoryProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  images?: [AboutHistoryImage, AboutHistoryImage, AboutHistoryImage];
  columns?: [AboutHistoryColumn, AboutHistoryColumn];
};

const DEFAULT_IMAGES: [AboutHistoryImage, AboutHistoryImage, AboutHistoryImage] = [
  {
    src: 'https://picsum.photos/id/1015/1200/900',
    alt: 'Trabajo en laptop — placeholder',
  },
  {
    src: 'https://picsum.photos/id/180/800/600',
    alt: 'Oficina en operación — placeholder',
  },
  {
    src: 'https://picsum.photos/id/201/800/600',
    alt: 'Sesión de equipo — placeholder',
  },
];

const DEFAULT_COLUMNS: [AboutHistoryColumn, AboutHistoryColumn] = [
  {
    title: 'Nuestra visión',
    paragraphs: [
      'Dejar de vender tácticas sueltas. El marketing que importa conecta oferta, media y web en un sistema que el comité entiende y ventas puede usar.',
      'Queremos ser el partner de industria que un director de marketing recomienda sin reservas — evidencia primero, teatro nunca.',
    ],
  },
  {
    title: 'Cómo operamos',
    paragraphs: [
      'Hiweb nace de cuentas consolidadas donde el catálogo no bastaba. Reorganizamos oferta, prueba y equipo alrededor del resultado por sector.',
      'Un núcleo senior en estrategia, performance, creativo y producto web. La auditoría es el filtro: si no hay fit, lo decimos en la misma llamada.',
    ],
  },
];

/**
 * Historia / About — header + collage asimétrico + dos columnas de copy.
 */
export function AboutHistory({
  eyebrow = 'Historia',
  title = 'De agencia de tácticas a arquitectura por industria',
  description = 'Hiweb nace de operar cuentas consolidadas donde el catálogo de servicios no bastaba. El comprador no busca “SEO”: busca un resultado en su sector. Reorganizamos oferta, prueba y equipo alrededor de eso.',
  images = DEFAULT_IMAGES,
  columns = DEFAULT_COLUMNS,
}: AboutHistoryProps) {
  const [hero, top, bottom] = images;
  const [left, right] = columns;

  return (
    <SectionBand id="historia" tone="canvas" className="about-history">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        badgeVariant="purple"
      />

      <div data-reveal className="about-history__gallery" aria-hidden="true">
        <figure className="about-history__shot about-history__shot--hero">
          <img src={hero.src} alt="" width={1200} height={900} decoding="async" loading="lazy" />
        </figure>
        <div className="about-history__stack">
          <figure className="about-history__shot">
            <img src={top.src} alt="" width={800} height={600} decoding="async" loading="lazy" />
          </figure>
          <figure className="about-history__shot">
            <img src={bottom.src} alt="" width={800} height={600} decoding="async" loading="lazy" />
          </figure>
        </div>
      </div>

      <div className="about-history__columns">
        <article data-reveal className="about-history__column">
          <h3 className="about-history__column-title">{left.title}</h3>
          {left.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="about-history__column-copy">
              {paragraph}
            </p>
          ))}
        </article>
        <article data-reveal className="about-history__column">
          <h3 className="about-history__column-title">{right.title}</h3>
          {right.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="about-history__column-copy">
              {paragraph}
            </p>
          ))}
        </article>
      </div>
    </SectionBand>
  );
}
