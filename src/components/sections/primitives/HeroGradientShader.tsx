/**
 * Presentational shell for the hero gradient.
 * WebGL is initialized by `src/scripts/hero-shader.ts` (no React hydration).
 */
export function HeroGradientShader({ className = '' }: { className?: string }) {
  return (
    <div
      className={['pointer-events-none absolute inset-0 overflow-hidden', className]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
    >
      <div className="hero-shader-fallback absolute inset-0" />
      <canvas data-hero-shader className="absolute inset-0 h-full w-full" />
    </div>
  );
}
