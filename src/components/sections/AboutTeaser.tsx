import { Badge } from '../ui';
import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';
import { HOME_ABOUT } from '../../data/site';

type AboutTeaserProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function AboutTeaser({
  eyebrow = HOME_ABOUT.eyebrow,
  title = HOME_ABOUT.title,
  description = HOME_ABOUT.description,
}: AboutTeaserProps) {
  return (
    <SectionBand id="nosotros" tone="canvas">
      <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-end">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        <div data-reveal className="rounded-2xl border border-border bg-surface p-6">
          <Badge>Presencia</Badge>
          <p className="mt-3 font-display text-lg font-semibold text-ink">
            Mérida · Cancún · Monterrey
          </p>
          <p className="mt-2 !text-sm">Tecnología propia: nuestro portal. Operación cross-border.</p>
          <a
            href="/nosotros"
            className="mt-5 inline-block font-display text-sm font-semibold text-ink no-underline"
          >
            Conoce Hiweb →
          </a>
        </div>
      </div>
    </SectionBand>
  );
}
