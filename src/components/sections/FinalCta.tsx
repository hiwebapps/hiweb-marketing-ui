import { Badge, Button } from '../ui';
import { SectionBand } from './primitives/SectionBand';

type FinalCtaProps = {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

/**
 * 07 · Final CTA — misma decisión que nav y hero.
 */
export function FinalCta({
  title = 'Listos cuando tú lo estés.',
  description = 'Cuéntanos industria, objetivo e ICP. Te devolvemos un diagnóstico claro y el siguiente paso.',
  primaryLabel = 'Agenda tu auditoría',
  primaryHref = '/contacto',
  secondaryLabel = 'Escribir a Hiweb',
  secondaryHref = 'mailto:hola@hiweb.marketing',
}: FinalCtaProps) {
  return (
    <SectionBand id="contacto" tone="ink" as="section">
      <div className="mx-auto max-w-3xl text-center">
        <div className="flex justify-center">
          <Badge tone="on-ink">Siguiente paso</Badge>
        </div>
        <h2 className="mt-4 !text-3xl !leading-[1.2] text-canvas md:!text-5xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl !text-base text-canvas/65 md:!text-lg">
          {description}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={primaryHref} className="no-underline">
            <Button
              variant="secondary"
              className="border-canvas/20 bg-canvas text-ink hover:bg-canvas/90"
            >
              {primaryLabel}
            </Button>
          </a>
          <a href={secondaryHref} className="no-underline">
            <Button
              variant="ghost"
              className="text-canvas/80 hover:bg-canvas/10 hover:text-canvas"
            >
              {secondaryLabel}
            </Button>
          </a>
        </div>
      </div>
    </SectionBand>
  );
}
