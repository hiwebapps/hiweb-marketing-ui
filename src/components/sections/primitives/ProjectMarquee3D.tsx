export type ProjectCard = {
  id: string;
  name: string;
  tag: string;
  outcome: string;
  accent: 'cyan' | 'orange' | 'purple' | 'lime';
};

const DEFAULT_PROJECTS: ProjectCard[] = [
  { id: 'pulse', name: 'Pulse', tag: 'SaaS B2B', outcome: '+184% demos', accent: 'cyan' },
  { id: 'campo', name: 'Campo', tag: 'Retail', outcome: '2.4× ROAS', accent: 'orange' },
  { id: 'vertex', name: 'Vertex', tag: 'Servicios', outcome: '−40% ciclo', accent: 'purple' },
  { id: 'orbit', name: 'Orbit', tag: 'Fintech', outcome: '3.1× pipeline', accent: 'cyan' },
  { id: 'northstar', name: 'Northstar', tag: 'EdTech', outcome: '+92% leads', accent: 'lime' },
  { id: 'anahuac', name: 'Anáhuac', tag: 'Educación', outcome: 'Brand system', accent: 'purple' },
  { id: 'helios', name: 'Helios', tag: 'Health', outcome: '+61% booked', accent: 'orange' },
  { id: 'lumen', name: 'Lumen', tag: 'B2B', outcome: '2× MQL', accent: 'cyan' },
];

const accentGlow = {
  cyan: 'shadow-[0_0_40px_rgba(1,231,255,0.18)] border-accent-cyan/35',
  orange: 'shadow-[0_0_40px_rgba(254,98,28,0.18)] border-accent-orange/35',
  purple: 'shadow-[0_0_40px_rgba(146,122,254,0.2)] border-accent-purple/35',
  lime: 'shadow-[0_0_40px_rgba(219,230,76,0.15)] border-accent-lime/35',
} as const;

const accentWash = {
  cyan: 'bg-accent-cyan/20',
  orange: 'bg-accent-orange/20',
  purple: 'bg-accent-purple/20',
  lime: 'bg-accent-lime/20',
} as const;

type ProjectMarquee3DProps = {
  projects?: ProjectCard[];
};

/**
 * Marquee 3D horizontal de proyectos — perspectiva + tilt, sin cilindro ni barras negras.
 * Duplica el track para loop infinito. Pausa en hover / reduced-motion.
 */
export function ProjectMarquee3D({
  projects = DEFAULT_PROJECTS,
}: ProjectMarquee3DProps) {
  const loop = [...projects, ...projects];

  return (
    <div className="hero-marquee-3d relative mx-auto w-full max-w-6xl select-none">
      <p className="mb-6 text-center font-display text-[11px] font-medium tracking-[0.18em] text-white/45 uppercase">
        Proyectos Hiweb
      </p>

      <div className="hero-marquee-scene relative overflow-hidden py-4">
        <div className="hero-marquee-track flex w-max gap-4 px-4 will-change-transform">
          {loop.map((project, i) => (
            <a
              key={`${project.id}-${i}`}
              href="/work"
              className={[
                'hero-marquee-card group relative flex h-[168px] w-[220px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border bg-[#12152a]/90 p-5 no-underline transition-[transform,background-color] duration-300 hover:bg-[#1a1f38]',
                accentGlow[project.accent],
              ].join(' ')}
            >
              <div
                className={[
                  'pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full blur-2xl',
                  accentWash[project.accent],
                ].join(' ')}
                aria-hidden="true"
              />
              <div className="relative">
                <p className="font-display text-[10px] font-medium tracking-[0.16em] text-white/55 uppercase">
                  {project.tag}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-white">
                  {project.name}
                </h3>
              </div>
              <p className="relative font-display text-sm font-semibold text-white/90">
                {project.outcome}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export { DEFAULT_PROJECTS };
