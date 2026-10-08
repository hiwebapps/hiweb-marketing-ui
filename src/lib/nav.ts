import { NAV_EXPLORE, NAV_INDUSTRY_ITEMS, NAV_SERVICE_GROUPS } from '../data/site';
import { CHROME, EN_NAV_SERVICES, localePath, type Locale } from './locale';

export type NavLink = {
  title: string;
  description: string;
  href: string;
  icon: string;
};

export type NavGroup = {
  heading: string;
  links: NavLink[];
};

export type NavBarItem =
  | { label: string; kind: 'link'; href: string }
  | { label: string; kind: 'dropdown'; columns: NavGroup[]; indexLabel: string; indexHref: string };

export type SiteNavContent = {
  bar: NavBarItem[];
  ctaLabel: string;
  ctaHref: string;
};

function link(title: string, description: string, href: string, icon: string, locale: Locale): NavLink {
  return { title, description, href: localePath(href, locale), icon };
}

function pairColumns(links: NavLink[], firstHeading: string): NavGroup[] {
  const columns: NavGroup[] = [];
  for (let index = 0; index < links.length; index += 2) {
    columns.push({
      heading: columns.length === 0 ? firstHeading : '',
      links: links.slice(index, index + 2),
    });
  }
  return columns;
}

/** Same menu the site shipped before the navbar lived in Studio. */
export function fallbackNav(locale: Locale): SiteNavContent {
  const copy = CHROME[locale];
  return {
    bar: [
      { label: copy.about, kind: 'link', href: localePath('/nosotros', locale) },
      {
        label: copy.industries,
        kind: 'dropdown',
        columns: pairColumns(
          NAV_INDUSTRY_ITEMS.map((item) => link(item.nombre, item.desc, `/industrias/${item.slug}`, item.icon, locale)),
          copy.industries,
        ),
        indexLabel: '',
        indexHref: '',
      },
      {
        label: copy.services,
        kind: 'dropdown',
        columns: [
          ...NAV_SERVICE_GROUPS.map((group) => ({
            heading: group.heading,
            links: group.items.map((item) => {
              const translated = locale === 'en' ? EN_NAV_SERVICES[item.slug] : undefined;
              return link(
                translated?.nombre ?? item.nombre,
                translated?.desc ?? item.desc,
                `/servicios/${item.slug}`,
                item.icon,
                locale,
              );
            }),
          })),
          {
            heading: 'Explorar',
            links: NAV_EXPLORE.map((item) => ({
              title: item.nombre,
              description: item.desc,
              href: item.href,
              icon: item.icon,
            })),
          },
        ],
        indexLabel: '',
        indexHref: '',
      },
      { label: copy.cases, kind: 'link', href: localePath('/portafolio', locale) },
      { label: copy.blog, kind: 'link', href: localePath('/blog', locale) },
    ],
    ctaLabel: copy.audit,
    ctaHref: localePath('/contacto', locale),
  };
}
