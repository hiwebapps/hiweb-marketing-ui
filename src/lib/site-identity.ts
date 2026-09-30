import { SITE } from '../data/site';

export type SiteSocial = { label: string; href: string };

export type SiteIdentity = {
  name: string;
  legalName: string;
  tagline: string;
  email: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  locales: string[];
  socials: SiteSocial[];
};

export function fallbackSite(): SiteIdentity {
  return {
    name: SITE.name,
    legalName: SITE.legalName,
    tagline: SITE.tagline,
    email: SITE.email,
    phone: SITE.phone,
    phoneHref: SITE.phoneHref,
    whatsapp: SITE.whatsapp,
    locales: [...SITE.locales],
    socials: SITE.socials.map((item) => ({ label: item.label, href: item.href })),
  };
}
