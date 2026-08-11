type AtmosphereVariant = 'none' | 'spotlight' | 'mesh' | 'wash';

type HeroAtmosphereProps = {
  /** spotlight = radial top; mesh = 3 blobs light; wash = fade vertical; none = vacío */
  variant?: AtmosphereVariant;
  /** Drift lento en mesh (respeta prefers-reduced-motion vía CSS global) */
  animated?: boolean;
  className?: string;
};

/**
 * Atmósfera opcional SOLO del hero — no en Steps/FAQ.
 * Texto/UI van encima en superficies sólidas (ProductFrame / copy).
 */
export function HeroAtmosphere({
  variant = 'spotlight',
  animated = true,
  className = '',
}: HeroAtmosphereProps) {
  if (variant === 'none') return null;

  return (
    <div
      className={['pointer-events-none absolute inset-0 overflow-hidden', className]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
    >
      {variant === 'spotlight' ? (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(17,17,17,0.06)_0%,transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_20%,rgba(1,231,255,0.08)_0%,transparent_60%)]" />
        </>
      ) : null}

      {variant === 'wash' ? (
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-canvas to-canvas" />
      ) : null}

      {variant === 'mesh' ? (
        <>
          <div className="absolute inset-0 bg-canvas" />
          <div
            className={[
              'absolute -top-[20%] -left-[10%] h-[55vmin] w-[55vmin] rounded-full bg-accent-purple/20 blur-4xl',
              animated ? 'animate-mesh-a' : '',
            ].join(' ')}
          />
          <div
            className={[
              'absolute -top-[5%] -right-[8%] h-[50vmin] w-[50vmin] rounded-full bg-accent-cyan/15 blur-4xl',
              animated ? 'animate-mesh-b' : '',
            ].join(' ')}
          />
          <div
            className={[
              'absolute bottom-[-15%] left-[30%] h-[45vmin] w-[45vmin] rounded-full bg-accent-orange/12 blur-4xl',
              animated ? 'animate-mesh-c' : '',
            ].join(' ')}
          />
          {/* Soften toward white so body sections stay Cal-clean */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-canvas" />
        </>
      ) : null}
    </div>
  );
}

export type { AtmosphereVariant };
