import { LEGAL_LINKS, SITE } from '../data/site';
import { CHROME, localePath, type Locale } from './locale';

export type FooterLink = {
  label: string;
  href: string;
};

export type SiteFooterContent = {
  brand: string;
  title: string;
  emailPlaceholder: string;
  menuHeading: string;
  menuLinks: FooterLink[];
  contactHeading: string;
  contactLinks: FooterLink[];
  locations: string;
  legalName: string;
  legalLinks: FooterLink[];
  backToTop: string;
};

/** Same footer the site shipped before it lived in Studio. */
export function fallbackFooter(locale: Locale): SiteFooterContent {
  const copy = CHROME[locale];
  return {
    brand: SITE.name,
    title: copy.footerTitle,
    emailPlaceholder: copy.workEmail,
    menuHeading: copy.menu,
    menuLinks: [
      { href: localePath('/nosotros', locale), label: copy.about },
      { href: localePath('/industrias', locale), label: copy.industries },
      { href: localePath('/servicios', locale), label: copy.services },
      { href: localePath('/portafolio', locale), label: copy.cases },
      { href: localePath('/blog', locale), label: copy.blog },
      { href: localePath('/contacto', locale), label: copy.contact },
    ],
    contactHeading: copy.contact,
    contactLinks: [
      { href: SITE.phoneHref, label: SITE.phone },
      { href: `mailto:${SITE.email}`, label: SITE.email },
      { href: SITE.whatsapp, label: 'WhatsApp' },
    ],
    locations: SITE.locales.join(' · '),
    legalName: SITE.legalName,
    legalLinks: LEGAL_LINKS.map((item) => ({ href: item.href, label: item.label })),
    backToTop: copy.backToTop,
  };
}
