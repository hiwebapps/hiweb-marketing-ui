import { CaseIcon } from '@sanity/icons/Case';
import { ChevronDownIcon } from '@sanity/icons/ChevronDown';
import { ComposeIcon } from '@sanity/icons/Compose';
import { DocumentsIcon } from '@sanity/icons/Documents';
import { FolderIcon } from '@sanity/icons/Folder';
import { HomeIcon } from '@sanity/icons/Home';
import { UsersIcon } from '@sanity/icons/Users';
import { Box, Button, Card, Flex, Text } from '@sanity/ui';
import { createElement, useEffect, useMemo, useState, type ComponentType, type ReactNode } from 'react';
import { useClient } from 'sanity';
import { usePresentationNavigate, usePresentationParams } from 'sanity/presentation';

type Locale = 'es' | 'en';

type NavDoc = {
  _id: string;
  title?: string;
  slug?: string;
};

type NavData = {
  services: NavDoc[];
  industries: NavDoc[];
  cases: NavDoc[];
  pages: NavDoc[];
  posts: NavDoc[];
};

const EMPTY: NavData = { services: [], industries: [], cases: [], pages: [], posts: [] };

const NAV_QUERY = `{
  "services": *[_type == "service" && coalesce(locale, "es") == $locale && defined(slug.current)] | order(orden asc) {
    _id, "title": nombre, "slug": slug.current
  },
  "industries": *[_type == "industry" && coalesce(locale, "es") == $locale && defined(slug.current)] | order(orden asc) {
    _id, "title": nombre, "slug": slug.current
  },
  "cases": *[_type == "caseStudy" && defined(slug.current)] | order(cliente asc) {
    _id, "title": cliente, "slug": slug.current
  },
  "pages": *[_type == "landingPage" && defined(slug.current)] | order(title asc) {
    _id, title, "slug": slug.current
  },
  "posts": *[_type == "post" && coalesce(locale, "es") == $locale && defined(slug.current)] | order(coalesce(fecha, _updatedAt) desc) {
    _id, title, "slug": slug.current
  }
}`;

function normalizePreviewPath(preview: string | undefined) {
  if (!preview) return '/';
  try {
    if (preview.startsWith('http')) return new URL(preview).pathname || '/';
  } catch {
    /* ignore malformed preview urls */
  }
  const path = preview.split('?')[0] || '/';
  return path.startsWith('/') ? path.replace(/\/$/, '') || '/' : `/${path}`;
}

function publishedId(id: string) {
  return id.replace(/^drafts\./, '');
}

function FolderLabel({
  label,
  open,
  onToggle,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  return createElement(Button, {
    mode: 'bleed',
    padding: 2,
    radius: 2,
    justify: 'flex-start',
    fontSize: 1,
    weight: 'semibold',
    icon: FolderIcon,
    iconRight: ChevronDownIcon,
    text: label,
    onClick: onToggle,
    selected: open,
    style: { width: '100%' },
  });
}

function NavItem({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon?: ComponentType;
  active: boolean;
  onClick: () => void;
}) {
  return createElement(Button, {
    mode: active ? 'default' : 'bleed',
    tone: active ? 'primary' : 'default',
    padding: 2,
    radius: 2,
    justify: 'flex-start',
    fontSize: 1,
    icon,
    text: label,
    onClick,
    style: { width: '100%' },
  });
}

function LocaleButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return createElement(Button, {
    mode: active ? 'default' : 'ghost',
    tone: active ? 'primary' : 'default',
    fontSize: 1,
    padding: 2,
    text: label,
    onClick,
    style: { flex: 1 },
  });
}

export function SiteNavigator() {
  const navigate = usePresentationNavigate();
  const params = usePresentationParams();
  const client = useClient({ apiVersion: '2026-09-18' });
  const [locale, setLocale] = useState<Locale>('es');
  const [data, setData] = useState<NavData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<Record<string, boolean>>({
    sitio: true,
    servicios: true,
    industrias: false,
    portafolio: false,
    paginas: false,
    blog: true,
  });

  const currentPath = useMemo(() => normalizePreviewPath(params.preview), [params.preview]);

  useEffect(() => {
    if (currentPath === '/en' || currentPath.startsWith('/en/')) setLocale('en');
  }, [currentPath]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    client
      .fetch<NavData>(NAV_QUERY, { locale })
      .then((result) => {
        if (!cancelled) setData(result ?? EMPTY);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [client, locale]);

  const go = (preview: string, document?: { type: string; id: string }) => {
    navigate(preview, document);
  };

  const toggle = (id: string) => setOpen((current) => ({ ...current, [id]: !current[id] }));

  const homeHref = locale === 'en' ? '/en' : '/';
  const aboutHref = locale === 'en' ? '/en/nosotros' : '/nosotros';
  const blogIndex = locale === 'en' ? '/en/blogs' : '/blog';

  const folder = (id: string, label: string, items: ReactNode) =>
    createElement(
      Flex,
      { direction: 'column', gap: 1 },
      createElement(FolderLabel, { label, open: open[id] !== false && Boolean(open[id]), onToggle: () => toggle(id) }),
      open[id]
        ? createElement(Box, { paddingLeft: 2 }, createElement(Flex, { direction: 'column', gap: 1 }, items))
        : null,
    );

  const docs = (items: NavDoc[], hrefFor: (slug: string) => string, type: string, icon: ComponentType) => {
    if (loading) {
      return createElement(Box, { padding: 2 }, createElement(Text, { size: 1, muted: true }, 'Cargando…'));
    }
    return items.map((item) => {
      if (!item.slug) return null;
      const href = hrefFor(item.slug);
      return createElement(NavItem, {
        key: item._id,
        label: item.title || item.slug,
        icon,
        active: currentPath === href,
        onClick: () => go(href, { type, id: publishedId(item._id) }),
      });
    });
  };

  return createElement(
    Card,
    { height: 'fill', overflow: 'auto', padding: 3, borderRight: true },
    createElement(
      Flex,
      { direction: 'column', gap: 4 },
      createElement(
        Flex,
        { direction: 'column', gap: 2 },
        createElement(Text, { size: 1, weight: 'bold' }, 'Sitemap'),
        createElement(Text, { size: 0, muted: true }, 'Carpetas como en Webflow — haz clic para previsualizar.'),
      ),
      createElement(
        Flex,
        { gap: 2 },
        createElement(LocaleButton, {
          label: 'ES',
          active: locale === 'es',
          onClick: () => setLocale('es'),
        }),
        createElement(LocaleButton, {
          label: 'EN',
          active: locale === 'en',
          onClick: () => setLocale('en'),
        }),
      ),
      folder(
        'sitio',
        'Sitio',
        [
          createElement(NavItem, {
            key: 'home',
            label: 'Inicio',
            icon: HomeIcon,
            active: currentPath === homeHref,
            onClick: () => go(homeHref, { type: 'homePage', id: locale === 'en' ? 'homePage-en' : 'homePage' }),
          }),
          createElement(NavItem, {
            key: 'about',
            label: locale === 'en' ? 'About' : 'Nosotros',
            icon: UsersIcon,
            active: currentPath === aboutHref,
            onClick: () => go(aboutHref, { type: 'aboutPage', id: locale === 'en' ? 'aboutPage-en' : 'aboutPage' }),
          }),
          createElement(NavItem, {
            key: 'contact',
            label: 'Contacto',
            icon: DocumentsIcon,
            active: currentPath === '/contacto',
            onClick: () => go('/contacto'),
          }),
        ],
      ),
      folder(
        'servicios',
        'Servicios',
        docs(
          data.services,
          (slug) => (locale === 'en' ? `/en/servicios/${slug}` : `/servicios/${slug}`),
          'service',
          CaseIcon,
        ),
      ),
      folder(
        'industrias',
        'Industrias',
        [
          locale === 'en'
            ? createElement(NavItem, {
                key: 'industries-index',
                label: 'Índice',
                icon: DocumentsIcon,
                active: currentPath === '/en/industrias',
                onClick: () => go('/en/industrias', { type: 'industriesIndex', id: 'industriesIndex-en' }),
              })
            : createElement(NavItem, {
                key: 'industries-index',
                label: 'Índice',
                icon: DocumentsIcon,
                active: currentPath === '/industrias',
                onClick: () => go('/industrias'),
              }),
          docs(
            data.industries,
            (slug) => (locale === 'en' ? `/en/industrias/${slug}` : `/industrias/${slug}`),
            'industry',
            CaseIcon,
          ),
        ],
      ),
      folder(
        'portafolio',
        'Portafolio',
        [
          createElement(NavItem, {
            key: 'cases-index',
            label: 'Índice',
            icon: DocumentsIcon,
            active: currentPath === '/portafolio',
            onClick: () => go('/portafolio'),
          }),
          docs(data.cases, (slug) => `/portafolio/${slug}`, 'caseStudy', CaseIcon),
        ],
      ),
      folder(
        'paginas',
        'Páginas',
        docs(data.pages, (slug) => `/${slug}`, 'landingPage', DocumentsIcon),
      ),
      folder(
        'blog',
        'Blog',
        [
          createElement(NavItem, {
            key: 'blog-index',
            label: locale === 'en' ? 'Índice /en/blogs' : 'Índice /blog',
            icon: DocumentsIcon,
            active: currentPath === blogIndex,
            onClick: () => go(blogIndex),
          }),
          docs(
            data.posts,
            (slug) => (locale === 'en' ? `/en/blogs/${slug}` : `/blog/${slug}`),
            'post',
            ComposeIcon,
          ),
        ],
      ),
      createElement(
        Card,
        { padding: 3, radius: 2, tone: 'transparent', border: true },
        createElement(
          Text,
          { size: 0, muted: true },
          'La columna de edición (derecha) muestra el documento de la página activa.',
        ),
      ),
    ),
  );
}
