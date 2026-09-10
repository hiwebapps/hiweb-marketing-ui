import {
  LEGAL_LINKS,
  NAV_INDUSTRIES,
  NAV_SERVICES,
  SITE,
} from '../../data/site';

/**
 * Footer global — columnas de industrias, servicios, contacto y legal.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-canvas">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <a href="/" className="font-display text-sm font-semibold tracking-wide text-ink no-underline">
            {SITE.name}
          </a>
          <p className="mt-3 max-w-xs !text-sm !leading-relaxed text-muted">{SITE.tagline}</p>
          <p className="mt-4 !text-xs text-muted">{SITE.locales.join(' · ')}</p>
        </div>

        <div>
          <p className="font-display text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
            Industrias
          </p>
          <ul className="mt-3 space-y-1.5">
            {NAV_INDUSTRIES.map((item) => (
              <li key={item.slug}>
                <a
                  href={`/industrias/${item.slug}`}
                  className="!text-sm text-ink-soft no-underline hover:text-ink"
                >
                  {item.nombre}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
            Servicios
          </p>
          <ul className="mt-3 space-y-1.5">
            {NAV_SERVICES.map((item) => (
              <li key={item.slug}>
                <a
                  href={`/servicios/${item.slug}`}
                  className="!text-sm text-ink-soft no-underline hover:text-ink"
                >
                  {item.nombre}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
            Contacto
          </p>
          <ul className="mt-3 space-y-1.5">
            <li>
              <a href={SITE.phoneHref} className="!text-sm text-ink-soft no-underline hover:text-ink">
                {SITE.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="!text-sm text-ink-soft no-underline hover:text-ink">
                {SITE.email}
              </a>
            </li>
            <li>
              <a href={SITE.whatsapp} className="!text-sm text-ink-soft no-underline hover:text-ink">
                WhatsApp
              </a>
            </li>
            {SITE.socials.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="!text-sm text-ink-soft no-underline hover:text-ink">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-5">
          <p className="!text-xs text-muted">© {new Date().getFullYear()} {SITE.legalName}</p>
          <nav className="flex flex-wrap gap-4">
            {LEGAL_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="!text-xs font-medium text-ink-soft no-underline hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
