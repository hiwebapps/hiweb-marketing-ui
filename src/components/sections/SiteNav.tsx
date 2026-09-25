import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  NAV_EXPLORE,
  NAV_INDUSTRY_ITEMS,
  NAV_SERVICE_GROUPS,
} from '../../data/site';
import { MOTION } from '../../lib/motion';
import { CHROME, EN_NAV_SERVICES, localePath, type Locale } from '../../lib/locale';
import { Button } from '../ui';
import './SiteNav.css';

gsap.registerPlugin(useGSAP);

type MenuKey = 'industrias' | 'servicios' | null;
type IconName =
  | (typeof NAV_INDUSTRY_ITEMS)[number]['icon']
  | (typeof NAV_SERVICE_GROUPS)[number]['items'][number]['icon']
  | (typeof NAV_EXPLORE)[number]['icon'];

/**
 * Nav global — pastilla glass oscura flotante, mega-menú de Servicios e Industrias.
 */
export function SiteNav({ locale = 'es' }: { locale?: Locale }) {
  const copy = CHROME[locale];
  const [open, setOpen] = useState<MenuKey>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [sheetLangOpen, setSheetLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const lastY = useRef(0);
  const closeTimer = useRef(0);
  const industriasId = useId();
  const serviciosId = useId();

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

  const openMenu = (key: Exclude<MenuKey, null>) => {
    window.clearTimeout(closeTimer.current);
    setOpen(key);
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
              <li className="hw-nav__item">
                <a href={localePath('/nosotros', locale)} className="hw-nav__link">
                  {copy.about}
                </a>
              </li>

              <li
                className="hw-nav__item hw-nav__item--dropdown"
                onMouseEnter={() => openMenu('industrias')}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  className={['hw-nav__link', open === 'industrias' ? 'is-open' : ''].filter(Boolean).join(' ')}
                  aria-expanded={open === 'industrias'}
                  aria-controls={industriasId}
                  onClick={() => openMenu('industrias')}
                >
                  {copy.industries}
                  <Chevron open={open === 'industrias'} />
                </button>
                {open === 'industrias' ? (
                  <div
                    ref={panelRef}
                    id={industriasId}
                    className="hw-nav__dropdown hw-nav__dropdown--industries"
                  >
                    {chunk(NAV_INDUSTRY_ITEMS, 2).map((column, index) => (
                      <div key={index} className="hw-nav__dropdown-col">
                        <p className={index === 0 ? 'hw-nav__dropdown-heading' : 'hw-nav__dropdown-heading hw-nav__dropdown-heading--ghost'}>
                          Industrias
                        </p>
                        <ul className="hw-nav__dropdown-list">
                          {column.map((item) => (
                            <li key={item.slug}>
                              <a
                                href={`/industrias/${item.slug}`}
                                className="hw-nav__dropdown-link"
                                onClick={() => setOpen(null)}
                              >
                                <span className="hw-nav__dropdown-icon" aria-hidden="true">
                                  <NavIcon name={item.icon} />
                                </span>
                                <span className="hw-nav__dropdown-copy">
                                  <span className="hw-nav__dropdown-title">{item.nombre}</span>
                                  <span className="hw-nav__dropdown-desc">{item.desc}</span>
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

              <li
                className="hw-nav__item hw-nav__item--dropdown"
                onMouseEnter={() => openMenu('servicios')}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  className={['hw-nav__link', open === 'servicios' ? 'is-open' : ''].filter(Boolean).join(' ')}
                  aria-expanded={open === 'servicios'}
                  aria-controls={serviciosId}
                  onClick={() => openMenu('servicios')}
                >
                  {copy.services}
                  <Chevron open={open === 'servicios'} />
                </button>
                {open === 'servicios' ? (
                  <div ref={panelRef} id={serviciosId} className="hw-nav__dropdown">
                    {NAV_SERVICE_GROUPS.map((group) => (
                      <div key={group.heading} className="hw-nav__dropdown-col">
                        <p className="hw-nav__dropdown-heading">{group.heading}</p>
                        <ul className="hw-nav__dropdown-list">
                          {group.items.map((item) => {
                            const translated = locale === 'en' ? EN_NAV_SERVICES[item.slug] : undefined;
                            return (
                            <li key={item.slug}>
                              <a
                                href={localePath(`/servicios/${item.slug}`, locale)}
                                className="hw-nav__dropdown-link"
                                onClick={() => setOpen(null)}
                              >
                                <span className="hw-nav__dropdown-icon" aria-hidden="true">
                                  <NavIcon name={item.icon} />
                                </span>
                                <span className="hw-nav__dropdown-copy">
                                  <span className="hw-nav__dropdown-title">{translated?.nombre ?? item.nombre}</span>
                                  <span className="hw-nav__dropdown-desc">{translated?.desc ?? item.desc}</span>
                                </span>
                              </a>
                            </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                    <div className="hw-nav__dropdown-col">
                      <p className="hw-nav__dropdown-heading">Explorar</p>
                      <ul className="hw-nav__dropdown-list">
                        {NAV_EXPLORE.map((item) => (
                          <li key={item.href}>
                            <a href={item.href} className="hw-nav__dropdown-link" onClick={() => setOpen(null)}>
                              <span className="hw-nav__dropdown-icon" aria-hidden="true">
                                <NavIcon name={item.icon} />
                              </span>
                              <span className="hw-nav__dropdown-copy">
                                <span className="hw-nav__dropdown-title">{item.nombre}</span>
                                <span className="hw-nav__dropdown-desc">{item.desc}</span>
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </li>

              <li className="hw-nav__item">
                <a href={localePath('/portafolio', locale)} className="hw-nav__link">
                  {copy.cases}
                </a>
              </li>
              <li className="hw-nav__item">
                <a href={localePath('/blog', locale)} className="hw-nav__link">
                  {copy.blog}
                </a>
              </li>
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
                <Button href={localePath('/contacto', locale)} size="md" variant="primary" className="hw-nav__ds-cta no-underline">
                  {copy.audit}
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
            <SheetNavLink href={localePath('/nosotros', locale)} onNavigate={() => setMobileOpen(false)}>
              {copy.about}
            </SheetNavLink>

            <SheetSection title={copy.industries}>
              <li>
                <a
                  href="/industrias"
                  className="hw-nav-sheet__link"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="hw-nav-sheet__icon" aria-hidden="true">
                    <NavIcon name="grid" />
                  </span>
                  <span className="hw-nav-sheet__label">Todas las industrias</span>
                </a>
              </li>
              {NAV_INDUSTRY_ITEMS.map((item) => (
                <li key={item.slug}>
                  <a
                    href={`/industrias/${item.slug}`}
                    className="hw-nav-sheet__link"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="hw-nav-sheet__icon" aria-hidden="true">
                      <NavIcon name={item.icon} />
                    </span>
                    <span className="hw-nav-sheet__label">{item.nombre}</span>
                  </a>
                </li>
              ))}
            </SheetSection>

            <SheetSection title={copy.services}>
              <li>
                <a
                  href={localePath('/servicios', locale)}
                  className="hw-nav-sheet__link"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="hw-nav-sheet__icon" aria-hidden="true">
                    <NavIcon name="grid" />
                  </span>
                  <span className="hw-nav-sheet__label">{locale === 'en' ? 'Services' : 'Todos los servicios'}</span>
                </a>
              </li>
              {NAV_SERVICE_GROUPS.flatMap((group) =>
                group.items.map((item) => (
                  <li key={item.slug}>
                    <a
                      href={localePath(`/servicios/${item.slug}`, locale)}
                      className="hw-nav-sheet__link"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="hw-nav-sheet__icon" aria-hidden="true">
                        <NavIcon name={item.icon} />
                      </span>
                      <span className="hw-nav-sheet__label">{locale === 'en' ? EN_NAV_SERVICES[item.slug]?.nombre ?? item.nombre : item.nombre}</span>
                    </a>
                  </li>
                )),
              )}
            </SheetSection>

            <SheetNavLink href={localePath('/portafolio', locale)} onNavigate={() => setMobileOpen(false)}>
              {copy.cases}
            </SheetNavLink>

            <SheetNavLink href={localePath('/blog', locale)} onNavigate={() => setMobileOpen(false)}>
              {copy.blog}
            </SheetNavLink>
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
              <Button href={localePath('/contacto', locale)} size="md" variant="primary" className="hw-nav-sheet__ds-cta no-underline">
                {copy.audit}
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

function chunk<T>(items: readonly T[], size: number): T[][] {
  const groups: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    groups.push([...items.slice(i, i + size)]);
  }
  return groups;
}

function NavIcon({ name }: { name: IconName }) {
  switch (name) {
    case 'activity':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    case 'target':
    case 'spark':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3v3" />
          <path d="M12 18v3" />
          <path d="M3 12h3" />
          <path d="M18 12h3" />
          <path d="m5.6 5.6 2.1 2.1" />
          <path d="m16.3 16.3 2.1 2.1" />
          <path d="m5.6 18.4 2.1-2.1" />
          <path d="m16.3 7.7 2.1-2.1" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );
    case 'users':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'video':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
          <rect x="2" y="6" width="14" height="12" rx="2" />
        </svg>
      );
    case 'badge':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'focus':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
          <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
          <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
          <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
        </svg>
      );
    case 'code':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case 'box':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M16.5 9.4 7.55 4.24" />
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.29 7 12 12 20.71 7" />
          <line x1="12" y1="22" x2="12" y2="12" />
        </svg>
      );
    case 'grid':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      );
    case 'book':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
          <path d="M18 14h-8" />
          <path d="M15 18h-5" />
          <path d="M10 6h8v4h-8V6Z" />
        </svg>
      );
    case 'mail':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    case 'factory':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4H2Z" />
        </svg>
      );
    case 'heart':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      );
    case 'building':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <rect width="16" height="20" x="4" y="2" rx="2" />
          <path d="M9 22v-4h6v4" />
          <path d="M8 6h.01" />
          <path d="M16 6h.01" />
          <path d="M12 6h.01" />
          <path d="M12 10h.01" />
          <path d="M12 14h.01" />
          <path d="M16 10h.01" />
          <path d="M16 14h.01" />
          <path d="M8 10h.01" />
          <path d="M8 14h.01" />
        </svg>
      );
    case 'plane':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
        </svg>
      );
    case 'utensils':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
      );
    case 'app':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      );
    default:
      return null;
  }
}
