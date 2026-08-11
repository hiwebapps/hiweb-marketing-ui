import { HeroGradientShader } from './primitives/HeroGradientShader';
import {
  ProjectMarquee3D,
  type ProjectCard,
} from './primitives/ProjectMarquee3D';

type HeroSectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  projects?: ProjectCard[];
  /** Dot grid global — off by default; el shader es el fondo del hero */
  showGrid?: boolean;
};

/**
 * 01 · Hero alto contraste — shader mesh (Laravel/Arcade) + marquee 3D de proyectos.
 */
export function HeroSection({
  eyebrow = 'Marketing digital · B2B y marcas en crecimiento',
  title = 'Pipeline medible para marcas que ya no pueden improvisar.',
  description = 'Ayudamos a equipos de marketing a lograr leads y conversiones claras con mensaje, paid y web como un solo sistema.',
  primaryLabel = 'Agendar llamada',
  primaryHref = '/contact',
  secondaryLabel = 'Ver casos',
  secondaryHref = '#casos',
  projects,
}: HeroSectionProps) {
  return (
    <div className="hero-contrast relative overflow-hidden bg-[#070912] text-white">
      <HeroGradientShader />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-20 pb-6 md:pt-28 md:pb-8">
        <div className="mx-auto max-w-3xl animate-hero-rise text-center">
          <p className="font-display text-xs font-medium tracking-[0.2em] text-white/50 uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-4 !text-4xl !leading-[1.12] !text-white md:!text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl !text-lg !text-white/70">{description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
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
          <p className="mt-4 text-xs text-white/40">Sin compromiso · Respuesta en 24h</p>
        </div>

        <div className="relative z-10 mt-14 md:mt-16">
          <ProjectMarquee3D projects={projects} />
        </div>
      </div>

      {/* Fade AFTER the marquee — no overlapping cards */}
      <div
        className="pointer-events-none relative z-10 h-14 bg-gradient-to-b from-transparent to-canvas md:h-16"
        aria-hidden="true"
      />
    </div>
  );
}
