import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { fallbackFooter, type SiteFooterContent } from '../../lib/footer';
import { fallbackSite, type SiteIdentity } from '../../lib/site-identity';
import { CHROME, isRetiredCatalogPath, localePath, type Locale } from '../../lib/locale';
import { Button } from '../ui';
import { MOTION } from '../../lib/motion';
import './SiteFooter.css';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

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

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9.1 20v-7.8H6.5V9.2h2.6V7c0-2.6 1.6-4 3.9-4 1.1 0 2.1.1 2.3.1v2.7h-1.6c-1.3 0-1.5.6-1.5 1.5v1.9h3l-.4 3h-2.6V20H9.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconTikTok() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 0 1-2.59-2.5 2.59 2.59 0 0 1 2.59-2.5c.31 0 .61.05.88.15V9.87a5.77 5.77 0 0 0-.88-.07A5.81 5.81 0 0 0 4 15.6a5.81 5.81 0 0 0 5.86 5.8 5.81 5.81 0 0 0 5.86-5.8V9.16a7.48 7.48 0 0 0 4.28 1.34V7.32a4.49 4.49 0 0 1-3.4-1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function renderSocialIcon(label: string) {
  const l = label.toLowerCase();
  if (l.includes('instagram')) return <IconInstagram />;
  if (l.includes('facebook')) return <IconFacebook />;
  if (l.includes('tiktok') || l.includes('tik tok')) return <IconTikTok />;
  return <IconLinkedIn />;
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Footer — panel dark + wordmark gigante, SplitText y ScrollTrigger.
 */
export function SiteFooter({
  locale = 'es',
  footer = null,
  site = fallbackSite(),
}: {
  locale?: Locale;
  footer?: SiteFooterContent | null;
  site?: SiteIdentity;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const year = new Date().getFullYear();
  const copy = footer ?? fallbackFooter(locale, site);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) return;

      const title = root.querySelector<HTMLElement>('.site-footer__title');
      const mark = root.querySelector<HTMLElement>('.site-footer__mark');
      const bits = root.querySelectorAll<HTMLElement>(
        '.site-footer__brand, .site-footer__audit, .site-footer__col, .site-footer__bar, .site-footer__legal',
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
              <img
                className="site-footer__brand"
                src={copy.brandMark || '/images/isotipo-hiweb.png'}
                width="28"
                height="28"
                alt="Hiweb"
              />
              <h2 className="site-footer__title">{copy.title}</h2>
              <Button
                href={localePath('/contacto', locale)}
                variant="primary"
                size="md"
                className="site-footer__audit"
              >
                {CHROME[locale].audit}
              </Button>
            </div>

            <nav className="site-footer__col" aria-label={copy.menuHeading}>
              <p className="site-footer__heading">{copy.menuHeading}</p>
              <ul>
                {copy.menuLinks.filter((item) => !isRetiredCatalogPath(item.href)).map((item) => (
                  <li key={`${item.href}-${item.label}`}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="site-footer__col" aria-label={copy.contactHeading}>
              <p className="site-footer__heading">{copy.contactHeading}</p>
              <ul>
                {copy.contactLinks.map((item) => (
                  <li key={`${item.href}-${item.label}`}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="site-footer__bar">
            <p className="site-footer__locales">{copy.locations}</p>
            <div className="site-footer__tools">
              {site.socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="site-footer__icon"
                  aria-label={item.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  {renderSocialIcon(item.label)}
                </a>
              ))}
            </div>
          </div>

          <div className="site-footer__legal">
            <p>
              © {year} {(copy.legalName || 'Hiweb').replace(/Hiweb Marketing/gi, 'Hiweb')}
            </p>
            <nav aria-label="Legal">
              {copy.legalLinks.map((item) => (
                <a key={`${item.href}-${item.label}`} href={item.href}>
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
        <p className="site-footer__mark">{(site.name || 'Hiweb').replace(/Hiweb Marketing/gi, 'Hiweb')}</p>
      </div>
    </footer>
  );
}
