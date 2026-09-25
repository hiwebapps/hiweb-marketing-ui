import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { LEGAL_LINKS, NAV_LINKS, SITE } from '../../data/site';
import { CHROME, localePath, type Locale } from '../../lib/locale';
import { MOTION } from '../../lib/motion';
import './SiteFooter.css';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const CONTACT = [
  { href: SITE.phoneHref, label: SITE.phone },
  { href: `mailto:${SITE.email}`, label: SITE.email },
  { href: SITE.whatsapp, label: 'WhatsApp' },
];

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16.6" cy="7.4" r="0.9" fill="currentColor" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7.4 9.4H4.8V19h2.6V9.4ZM6.1 5C5.2 5 4.5 5.7 4.5 6.6s.7 1.6 1.6 1.6 1.6-.7 1.6-1.6S7 5 6.1 5ZM19.2 12.3c0-2.4-1.3-3.6-3.4-3.6-1.5 0-2.3.8-2.7 1.4V9.4H10.5c0 1.1 0 9.6 0 9.6h2.6v-5.4c0-.3 0-.6.1-.8.3-.6.9-1.2 1.9-1.2 1.3 0 1.9.9 1.9 2.3V19h2.6v-6.7h-.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Footer — panel dark + wordmark gigante, SplitText y ScrollTrigger.
 */
export function SiteFooter({ locale = 'es' }: { locale?: Locale }) {
  const rootRef = useRef<HTMLElement>(null);
  const year = new Date().getFullYear();
  const copy = CHROME[locale];
  const menu = [
    { href: localePath('/nosotros', locale), label: copy.about },
    { href: localePath('/industrias', locale), label: copy.industries },
    { href: localePath('/servicios', locale), label: copy.services },
    ...NAV_LINKS.filter((item) => item.href !== '/nosotros').map((item) => ({
      href: localePath(item.href, locale),
      label: item.href === '/portafolio' ? copy.cases : item.href === '/blog' ? copy.blog : item.label,
    })),
    { href: localePath('/contacto', locale), label: copy.contact },
  ];

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) return;

      const title = root.querySelector<HTMLElement>('.site-footer__title');
      const mark = root.querySelector<HTMLElement>('.site-footer__mark');
      const bits = root.querySelectorAll<HTMLElement>(
        '.site-footer__brand, .site-footer__form, .site-footer__col, .site-footer__bar, .site-footer__legal',
      );

      gsap.set(bits, { y: 22, autoAlpha: 0 });
      gsap.to(bits, {
        y: 0,
        autoAlpha: 1,
        duration: MOTION.duration,
        ease: MOTION.ease,
        stagger: 0.07,
        scrollTrigger: {
          trigger: root,
          start: 'top 88%',
          once: true,
        },
      });

      if (title) {
        SplitText.create(title, {
          type: 'words,lines',
          autoSplit: true,
          mask: 'lines',
          aria: 'auto',
          onSplit(self) {
            return gsap.fromTo(
              self.words,
              { yPercent: 110 },
              {
                yPercent: 0,
                duration: MOTION.durationSlow,
                ease: MOTION.ease,
                stagger: 0.055,
                scrollTrigger: {
                  trigger: title,
                  start: 'top 92%',
                  once: true,
                },
              },
            );
          },
        });
      }

      if (mark) {
        SplitText.create(mark, {
          type: 'chars',
          charsClass: 'site-footer__char',
          aria: 'none',
          autoSplit: true,
          onSplit(self) {
            return gsap.fromTo(
              self.chars,
              { yPercent: 70, autoAlpha: 0, rotateX: 38 },
              {
                yPercent: 0,
                autoAlpha: 1,
                rotateX: 0,
                transformOrigin: '50% 100%',
                duration: 1.05,
                ease: 'power3.out',
                stagger: 0.07,
                scrollTrigger: {
                  trigger: mark,
                  start: 'top 98%',
                  once: true,
                },
              },
            );
          },
        });

        gsap.fromTo(
          mark,
          { yPercent: 16 },
          {
            yPercent: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 1.15,
            },
          },
        );
      }
    },
    { scope: rootRef },
  );

  return (
    <footer ref={rootRef} className="site-footer">
      <div className="site-footer__wash" aria-hidden="true">
        <span className="site-footer__grad site-footer__grad--a" />
        <span className="site-footer__grad site-footer__grad--b" />
        <span className="site-footer__grad site-footer__grad--c" />
      </div>

      <div className="site-footer__inner">
        <div className="site-footer__panel">
          <div className="site-footer__top">
            <div className="site-footer__intro">
              <p className="site-footer__brand">{SITE.name}</p>
              <h2 className="site-footer__title">{copy.footerTitle}</h2>
              <form className="site-footer__form" action={localePath('/contacto', locale)} method="get">
                <label className="sr-only" htmlFor="footer-email">
                  {copy.workEmail}
                </label>
                <input
                  id="footer-email"
                  className="site-footer__input"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder={copy.workEmail}
                  required
                />
                <button className="site-footer__submit" type="submit" aria-label={copy.toContact}>
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>
            </div>

            <nav className="site-footer__col" aria-label={copy.menu}>
              <p className="site-footer__heading">{copy.menu}</p>
              <ul>
                {menu.map((item) => (
                  <li key={item.href}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="site-footer__col" aria-label={copy.contact}>
              <p className="site-footer__heading">{copy.contact}</p>
              <ul>
                {CONTACT.map((item) => (
                  <li key={item.href}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="site-footer__bar">
            <p className="site-footer__locales">{SITE.locales.join(' · ')}</p>
            <div className="site-footer__tools">
              {SITE.socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="site-footer__icon"
                  aria-label={item.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.label === 'Instagram' ? <IconInstagram /> : <IconLinkedIn />}
                </a>
              ))}
            </div>
          </div>

          <div className="site-footer__legal">
            <p>
              © {year} {SITE.legalName}
            </p>
            <nav aria-label="Legal">
              {LEGAL_LINKS.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
            <a href="#top" className="site-footer__totop">
              {copy.backToTop}
            </a>
          </div>
        </div>
      </div>

      <div className="site-footer__mark-wrap" aria-hidden="true">
        <p className="site-footer__mark">Hiweb</p>
      </div>
    </footer>
  );
}
