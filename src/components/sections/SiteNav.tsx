import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MOTION } from '../../lib/motion';
import { fallbackNav, type SiteNavContent } from '../../lib/nav';
import { CHROME, isRetiredCatalogPath, localePath, type Locale } from '../../lib/locale';
import { Button } from '../ui';
import { NavIcon } from './NavIcon';
import './SiteNav.css';

gsap.registerPlugin(useGSAP);

/**
 * Nav global — pastilla glass oscura flotante, mega-menú de Servicios e Industrias.
 */
export function SiteNav({
  locale = 'es',
  nav = null,
}: {
  locale?: Locale;
  nav?: SiteNavContent | null;
}) {
  const model = nav ?? fallbackNav(locale);
  const [open, setOpen] = useState<number | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [sheetLangOpen, setSheetLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const lastY = useRef(0);
  const closeTimer = useRef(0);
  const menuId = useId();

  useGSAP(
    () => {
      const nav = navRef.current;
      const shell = nav?.querySelector('.hw-nav__shell');
      if (!nav || !shell) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        nav.classList.add('is-ready');
        return;
      }

      gsap.set(shell, { y: -16, autoAlpha: 0 });
      nav.classList.add('is-ready');
      gsap.to(shell, {
        y: 0,
        autoAlpha: 1,
        duration: MOTION.duration,
        delay: 0.06,
        ease: MOTION.ease,
      });
    },
    { scope: navRef },
  );

  useGSAP(
    () => {
      if (!panelRef.current || !open) return;
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.28, ease: 'power3.out' },
      );
    },
    { dependencies: [open] },
  );

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpen(null);
        setLangOpen(false);
        if (!(event.target as Element | null)?.closest?.('.hw-nav__lang')) setSheetLangOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(null);
        setLangOpen(false);
        setSheetLangOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(closeTimer.current);
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      lastY.current = y;

      if (mobileOpen || open) {
        setHidden(false);
        return;
      }
      if (y < 48) {
        setHidden(false);
        return;
      }
      if (delta > 8) setHidden(true);
      else if (delta < -8) setHidden(false);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileOpen, open]);

  const openMenu = (index: number) => {
    window.clearTimeout(closeTimer.current);
    setOpen(index);
  };

  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(null), 140);
  };

  return (
    <>
      <header
        ref={navRef}
        className={['hw-nav', mobileOpen ? 'is-open' : '', hidden ? 'is-hidden' : '']
          .filter(Boolean)
          .join(' ')}
      >
        <svg className="hw-nav__filter" aria-hidden="true" focusable="false">
          <filter
            id="hw-nav-glass-distortion"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            filterUnits="objectBoundingBox"
          >
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.011" numOctaves="1" seed="5" result="turbulence" />
            <feComponentTransfer in="turbulence" result="mapped">
              <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
              <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
              <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
            </feComponentTransfer>
            <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
            <feSpecularLighting
              in="softMap"
              surfaceScale="5"
              specularConstant="1"
              specularExponent="100"
              lightingColor="white"
              result="specLight"
            >
              <fePointLight x="-200" y="-200" z="300" />
            </feSpecularLighting>
            <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage" />
            <feDisplacementMap in="SourceGraphic" in2="softMap" scale="80" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>

        <div className="hw-nav__shell">
          <div className="hw-nav__glass" />
          <div className="hw-nav__tint" />
          <div className="hw-nav__highlight" />

          <nav className="hw-nav__bar" aria-label="Principal">
            <a href={localePath('/', locale)} className="hw-nav__brand" aria-label="Hiweb inicio">
              <img src="/images/isotipo-hiweb.png" width="27" height="27" alt="" className="hw-nav__logo" />
              <span className="hw-nav__brand-text">Hiweb</span>
            </a>

            <ul className="hw-nav__links">
              {model.bar.map((item, index) => {
                if (item.kind === 'dropdown') {
                  const panelId = `${menuId}-${index}`;
                  return (
                    <li
                      key={`dropdown-${index}`}
                      className="hw-nav__item hw-nav__item--dropdown"
                      onMouseEnter={() => openMenu(index)}
                      onMouseLeave={scheduleClose}
                    >
                      <button
                        type="button"
                        className={['hw-nav__link', open === index ? 'is-open' : ''].filter(Boolean).join(' ')}
                        aria-expanded={open === index}
                        aria-controls={panelId}
                        onClick={() => openMenu(index)}
                      >
                        {item.label}
                        <Chevron open={open === index} />
                      </button>
                      {open === index ? (
                        <div
                          ref={panelRef}
                          id={panelId}
                          className="hw-nav__dropdown"
                          style={{ gridTemplateColumns: `repeat(${Math.max(item.columns.length, 1)}, minmax(0, 1fr))` }}
                        >
                          {item.columns.map((column, columnIndex) => (
                            <div key={`${column.heading}-${columnIndex}`} className="hw-nav__dropdown-col">
                              <p className={column.heading ? 'hw-nav__dropdown-heading' : 'hw-nav__dropdown-heading hw-nav__dropdown-heading--ghost'}>
                                {column.heading || '\u00a0'}
                              </p>
                              <ul className="hw-nav__dropdown-list">
                                {column.links.map((link) => (
                                  <li key={link.href}>
                                    <a href={link.href} className="hw-nav__dropdown-link" onClick={() => setOpen(null)}>
                                      <span className="hw-nav__dropdown-icon" aria-hidden="true">
                                        <NavIcon name={link.icon} />
                                      </span>
                                      <span className="hw-nav__dropdown-copy">
                                        <span className="hw-nav__dropdown-title">{link.title}</span>
                                        <span className="hw-nav__dropdown-desc">{link.description}</span>
                                      </span>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </li>
                  );
                }

                return (
                  <li key={`${item.href}-${index}`} className="hw-nav__item">
                    <a href={item.href} className="hw-nav__link">
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="hw-nav__end">
              <div className="hw-nav__lang-slot">
                <LangSwitch locale={locale} open={langOpen} onToggle={() => setLangOpen((value) => !value)} onClose={() => setLangOpen(false)} />
              </div>
              <button
                type="button"
                className="hw-nav__burger"
                aria-expanded={mobileOpen}
                aria-controls="hw-nav-sheet"
                aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
                onClick={() => setMobileOpen(true)}
              >
                <span className="hw-nav__burger-line" />
                <span className="hw-nav__burger-line" />
                <span className="hw-nav__burger-line" />
              </button>

              <div className="hw-nav__ctas">
                <LangSwitch locale={locale} open={langOpen} onToggle={() => setLangOpen((value) => !value)} onClose={() => setLangOpen(false)} />
                <Button href={model.ctaHref} size="md" variant="primary" className="hw-nav__ds-cta no-underline">
                  {model.ctaLabel}
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {mobileOpen ? (
        <div className="hw-nav-sheet" id="hw-nav-sheet" role="dialog" aria-modal="true" aria-label="Menú">
          <div className="hw-nav-sheet__top">
            <div className="hw-nav-sheet__header">
              <a href="/" className="hw-nav-sheet__brand" aria-label="Hiweb inicio">
                <img src="/images/isotipo-hiweb.png" width="27" height="27" alt="" className="hw-nav-sheet__logo" />
                <span className="hw-nav-sheet__brand-text">Hiweb</span>
              </a>
              <div className="hw-nav-sheet__header-actions">
                <button
                  type="button"
                  className="hw-nav-sheet__close"
                  aria-label="Cerrar menú"
                  onClick={() => setMobileOpen(false)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="hw-nav-sheet__scroll">
            {model.bar.map((item, index) => {
              if (item.kind === 'dropdown') {
                return (
                  <SheetSection key={`dropdown-${index}`} title={item.label}>
                    {item.indexLabel && item.indexHref && !isRetiredCatalogPath(item.indexHref) ? (
                      <li>
                        <a href={item.indexHref} className="hw-nav-sheet__link" onClick={() => setMobileOpen(false)}>
                          <span className="hw-nav-sheet__icon" aria-hidden="true">
                            <NavIcon name="grid" />
                          </span>
                          <span className="hw-nav-sheet__label">{item.indexLabel}</span>
                        </a>
                      </li>
                    ) : null}
                    {item.columns.flatMap((column) =>
                      column.links.map((link) => (
                        <li key={link.href}>
                          <a href={link.href} className="hw-nav-sheet__link" onClick={() => setMobileOpen(false)}>
                            <span className="hw-nav-sheet__icon" aria-hidden="true">
                              <NavIcon name={link.icon} />
                            </span>
                            <span className="hw-nav-sheet__label">{link.title}</span>
                          </a>
                        </li>
                      )),
                    )}
                  </SheetSection>
                );
              }
              return (
                <SheetNavLink key={`${item.href}-${index}`} href={item.href} onNavigate={() => setMobileOpen(false)}>
                  {item.label}
                </SheetNavLink>
              );
            })}
          </div>

          <div className="hw-nav-sheet__footer">
            <div className="hw-nav-sheet__footer-row">
              <LangSwitch
                locale={locale}
                open={sheetLangOpen}
                menuPlacement="up"
                onToggle={() => setSheetLangOpen((value) => !value)}
                onClose={() => setSheetLangOpen(false)}
              />
              <Button href={model.ctaHref} size="md" variant="primary" className="hw-nav-sheet__ds-cta no-underline">
                {model.ctaLabel}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function LangSwitch({
  locale,
  open,
  onToggle,
  onClose,
  menuPlacement = 'down',
}: {
  locale: Locale;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  menuPlacement?: 'down' | 'up';
}) {
  const menuRef = useRef<HTMLUListElement>(null);
  const closeTimer = useRef(0);

  useGSAP(
    () => {
      if (!menuRef.current || !open) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.28, ease: 'power3.out' },
      );
    },
    { dependencies: [open] },
  );

  const hoverCapable = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  return (
    <div
      className={`hw-nav__lang${open ? ' is-open' : ''}${menuPlacement === 'up' ? ' hw-nav__lang--up' : ''}`}
      onMouseEnter={() => {
        if (!hoverCapable()) return;
        window.clearTimeout(closeTimer.current);
        if (!open) onToggle();
      }}
      onMouseLeave={() => {
        if (!hoverCapable()) return;
        window.clearTimeout(closeTimer.current);
        closeTimer.current = window.setTimeout(onClose, 140);
      }}
    >
      <button
        type="button"
        className="hw-nav__lang-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={CHROME[locale].languageCurrent}
        onClick={onToggle}
      >
        <svg className="hw-nav__lang-globe" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
        </svg>
        <span>{locale === 'en' ? 'EN' : 'ES'}</span>
        <svg className="hw-nav__lang-chevron" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 6.2 8 10l4-3.8" />
        </svg>
      </button>
      {open ? (
        <ul ref={menuRef} className="hw-nav__lang-menu" role="listbox" aria-label={CHROME[locale].language}>
          <li>
            <button
              type="button"
              className={`hw-nav__lang-option${locale === 'es' ? ' is-current' : ''}`}
              role="option"
              aria-selected={locale === 'es'}
              onClick={() => {
                onClose();
                window.location.assign(localePath(window.location.pathname, 'es'));
              }}
            >
              ES · Español
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`hw-nav__lang-option${locale === 'en' ? ' is-current' : ''}`}
              role="option"
              aria-selected={locale === 'en'}
              onClick={() => {
                onClose();
                window.location.assign(localePath(window.location.pathname, 'en'));
              }}
            >
              EN · English
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}

function SheetNavLink({
  href,
  children,
  onNavigate,
}: {
  href: string;
  children: ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <div className="hw-nav-sheet__section">
      <a href={href} className="hw-nav-sheet__heading hw-nav-sheet__heading--link" onClick={onNavigate}>
        <span>{children}</span>
      </a>
    </div>
  );
}

function SheetSection({ title, children }: { title: string; children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  return (
    <section className={['hw-nav-sheet__section', expanded ? 'is-open' : ''].filter(Boolean).join(' ')}>
      <button
        type="button"
        className="hw-nav-sheet__heading"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((current) => !current)}
      >
        <span>{title}</span>
        <Chevron open={expanded} />
      </button>
      <div
        id={panelId}
        className="hw-nav-sheet__panel"
        role="region"
        aria-label={title}
        hidden={!expanded}
      >
        <ul className="hw-nav-sheet__list">{children}</ul>
      </div>
    </section>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden="true"
      style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 0.15s ease-out' }}
    >
      <path
        d="M10.293,3.293,6,7.586,1.707,3.293A1,1,0,0,0,.293,4.707l5,5a1,1,0,0,0,1.414,0l5-5a1,1,0,1,0-1.414-1.414Z"
        fill="currentColor"
      />
    </svg>
  );
}
