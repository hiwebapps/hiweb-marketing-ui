import { Button } from '../ui';

const LINKS = [
  { href: '/#como-trabajamos', label: 'Proceso' },
  { href: '/#casos', label: 'Casos' },
  { href: '/#brand', label: 'Sistema' },
  { href: '/#faq', label: 'FAQ' },
];

/**
 * Nav sticky minimal — CTA único alineado con hero/cierre.
 */
export function SiteNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
        <a
          href="/"
          className="font-display text-sm font-semibold tracking-wide text-ink no-underline"
        >
          Hiweb
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-2.5 py-1.5 font-display text-xs font-medium tracking-wide text-muted no-underline uppercase transition-colors hover:bg-surface hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="/work" className="hidden no-underline sm:inline-flex">
            <Button size="sm" variant="ghost">
              Work
            </Button>
          </a>
          <a href="/contact" className="no-underline">
            <Button size="sm" variant="primary">
              Agendar llamada
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
