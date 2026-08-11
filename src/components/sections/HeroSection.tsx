import DriftWall from '../effects/DriftWall.jsx';
import { HERO_PROJECT_TILES } from '../effects/heroProjectTiles.js';
import HeroWavesBackground from '../effects/HeroWavesBackground';

type HeroSectionProps = {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  projects?: Array<{ image: string; title?: string; href?: string }>;
};

/**
 * 01 · Hero — copy a la izquierda; DriftWall absolute a la derecha (bleed / overflow).
 */
export function HeroSection({
  title = 'Pipeline medible para marcas que ya no pueden improvisar.',
  description = 'Ayudamos a equipos de marketing a lograr leads y conversiones claras con mensaje, paid y web como un solo sistema.',
  primaryLabel = 'Agendar llamada',
  primaryHref = '/contact',
  secondaryLabel = 'Ver casos',
  secondaryHref = '#casos',
  projects = HERO_PROJECT_TILES,
}: HeroSectionProps) {
  return (
    <div className="hero-contrast relative min-h-[640px] overflow-hidden bg-[#070912] text-white md:min-h-[720px] lg:min-h-[780px]">
      <HeroWavesBackground />

      {/* DriftWall · más al centro, bleed leve a la derecha */}
      <div className="absolute inset-x-0 bottom-8 z-[5] h-[300px] sm:h-[340px] md:inset-y-0 md:bottom-auto md:left-[40%] md:right-auto md:z-[6] md:h-full md:w-[68%] lg:left-[38%] lg:w-[70%]">
        <DriftWall
          className="hero-drift-wall"
          items={projects}
          columns={4}
          tileWidth={180}
          tileHeight={120}
          gap={14}
          radius={14}
          tilt={14}
          turn={-14}
          perspective={1100}
          depth={60}
          speed={38}
          direction="up"
          variance={0.4}
          parallax={0.55}
          lift={52}
          fade={0.12}
          dim={0.95}
          grayscale={false}
          overlayColor="#070912"
        />
      </div>

      {/* Copy · izquierda; pointer-events solo en el bloque de texto
          para no bloquear hover del DriftWall en columnas cercanas */}
      <div className="pointer-events-none relative z-10 mx-auto flex max-w-6xl flex-col justify-center px-6 pt-16 pb-[340px] md:min-h-[720px] md:pb-24 md:pt-24 lg:min-h-[780px]">
        <div className="pointer-events-auto animate-hero-rise max-w-xl md:max-w-[42%] lg:max-w-lg">
          <h1 className="!text-4xl !leading-[1.12] !text-white md:!text-5xl lg:!text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-lg !text-lg !text-white/70">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={primaryHref} className="no-underline">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg bg-white px-7 py-3.5 font-display text-sm font-semibold tracking-wide text-[#111] transition-[transform,background-color] duration-150 hover:bg-white/90 active:scale-[0.98]"
              >
                {primaryLabel}
              </button>
            </a>
            <a href={secondaryHref} className="no-underline">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-white/25 bg-transparent px-7 py-3.5 font-display text-sm font-semibold tracking-wide text-white transition-[transform,background-color] duration-150 hover:bg-white/10 active:scale-[0.98]"
              >
                {secondaryLabel}
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
