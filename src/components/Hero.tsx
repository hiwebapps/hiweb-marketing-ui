import { BackgroundMesh } from './BackgroundMesh';
import { CardGlass } from './CardGlass';
import { Button } from './ui';

/**
 * Hero light product-tool: canvas blanco, CTA negro, tipografía Borscha + Roboto Serif.
 */
export function Hero() {
  return (
    <div className="relative min-h-dvh">
      <BackgroundMesh />

      <main className="relative z-10 flex min-h-dvh items-center justify-center px-6 py-16">
        <CardGlass className="animate-hero-rise w-full max-w-4xl bg-surface p-8 sm:p-12 md:p-14">
          <p className="mb-4 font-display text-sm font-medium tracking-[0.2em] text-muted uppercase">
            Hiweb Marketing
          </p>

          <h1>
            Precisión limpia para el{' '}
            <span className="text-ink">marketing digital</span> que construye
            producto.
          </h1>

          <p className="mt-6 max-w-2xl">
            Light product-tool: claridad de Cal, disciplina de Linear y ritmo de
            Raycast. Tipografía Borscha + Roboto Serif. Un acento, hairlines y CTAs negros.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button variant="primary">Empezar</Button>
            <a href="/design-system" className="no-underline">
              <Button variant="secondary">Ver sistema visual</Button>
            </a>
          </div>
        </CardGlass>
      </main>
    </div>
  );
}
