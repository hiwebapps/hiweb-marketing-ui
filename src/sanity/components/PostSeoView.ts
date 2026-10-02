import { useEffect, useState } from 'react';
import { createElement } from 'react';
import { useClient } from 'sanity';
import { Badge, Box, Card, Flex, Spinner, Text } from '@sanity/ui';
import { extractPortableHeadings } from '../../lib/blog';
import { pagePath } from '../../lib/page-meta';
import { normalizeHref } from '../seo/inventory';

type ViewProps = {
  document?: { displayed?: Record<string, unknown> };
  documentId: string;
};

const PATHS_QUERY = `{
  "services": *[_type == "service" && defined(slug.current)]{
    _id,
    "locale": coalesce(locale, "es"),
    "slug": slug.current
  },
  "industries": *[_type == "industry" && defined(slug.current)]{
    _id,
    "locale": coalesce(locale, "es"),
    "slug": slug.current
  },
  "posts": *[_type == "post" && defined(slug.current)]{
    "locale": coalesce(locale, "es"),
    "slug": slug.current
  },
  "cases": *[_type == "caseStudy" && defined(slug.current) && coalesce(locale, "es") == "es"].slug.current,
  "landings": *[_type == "landingPage" && defined(slug.current) && coalesce(locale, "es") == "es"].slug.current
}`;

type PathRows = {
  services?: { _id: string; locale: string; slug: string }[];
  industries?: { _id: string; locale: string; slug: string }[];
  posts?: { locale: string; slug: string }[];
  cases?: string[];
  landings?: string[];
};

function hrefsOf(body: unknown) {
  if (!Array.isArray(body)) return [];
  const hrefs: string[] = [];
  for (const block of body) {
    const marks = (block as { markDefs?: { _type?: string; href?: string }[] }).markDefs;
    for (const mark of marks ?? []) {
      if (mark?._type === 'link' && mark.href) hrefs.push(mark.href);
    }
  }
  return hrefs;
}

function pathFor(row: { locale: string; slug: string } | undefined, kind: 'service' | 'industry') {
  if (!row) return '';
  const prefix = kind === 'service' ? 'servicios' : 'industrias';
  return row.locale === 'en' ? `/en/${prefix}/${row.slug}` : `/${prefix}/${row.slug}`;
}

function knownPaths(data: PathRows) {
  const paths = new Set<string>([
    '/',
    '/en',
    '/nosotros',
    '/en/nosotros',
    '/blog',
    '/en/blogs',
    '/contacto',
    '/servicios',
    '/en/servicios',
    '/industrias',
    '/en/industrias',
    '/portafolio',
  ]);
  for (const row of data.services ?? []) {
    paths.add(row.locale === 'en' ? `/en/servicios/${row.slug}` : `/servicios/${row.slug}`);
  }
  for (const row of data.industries ?? []) {
    paths.add(row.locale === 'en' ? `/en/industrias/${row.slug}` : `/industrias/${row.slug}`);
  }
  for (const row of data.posts ?? []) {
    paths.add(row.locale === 'en' ? `/en/blogs/${row.slug}` : `/blog/${row.slug}`);
  }
  for (const slug of data.cases ?? []) paths.add(`/portafolio/${slug}`);
  for (const slug of data.landings ?? []) paths.add(`/${slug}`);
  return paths;
}

export function PostSeoView(props: ViewProps) {
  const client = useClient({ apiVersion: '2026-09-18' });
  const doc = props.document?.displayed ?? {};
  const [catalog, setCatalog] = useState<PathRows | null>(null);

  useEffect(() => {
    let cancelled = false;
    client
      .fetch<PathRows>(PATHS_QUERY)
      .then((data) => {
        if (!cancelled) setCatalog(data ?? {});
      })
      .catch(() => {
        if (!cancelled) setCatalog({});
      });
    return () => {
      cancelled = true;
    };
  }, [client]);

  const paths = catalog ? knownPaths(catalog) : null;
  const headings = extractPortableHeadings(Array.isArray(doc.body) ? doc.body : undefined);
  const hrefs = hrefsOf(doc.body);
  const locale = doc.locale === 'en' ? 'en' : 'es';
  const serviceRef = (doc.categoriaServicio as { _ref?: string } | undefined)?._ref;
  const industryRef = (doc.categoriaIndustria as { _ref?: string } | undefined)?._ref;
  const servicePath = pathFor(catalog?.services?.find((row) => row._id === serviceRef), 'service');
  const industryPath = pathFor(catalog?.industries?.find((row) => row._id === industryRef), 'industry');
  const normalized = hrefs.map((href) => ({ href, path: normalizeHref(href) }));
  const internal = normalized.filter((item) => item.path.startsWith('/'));
  const unknown = paths ? internal.filter((item) => !paths.has(item.path)) : [];
  const missingService = Boolean(servicePath) && !internal.some((item) => item.path === servicePath);
  const missingIndustry = Boolean(industryPath) && !internal.some((item) => item.path === industryPath);

  return createElement(
    Box,
    { padding: 4 },
    createElement(
      Flex,
      { direction: 'column', gap: 5, style: { maxWidth: 720 } },
      createElement(Text, { size: 2, weight: 'semibold' }, 'Esquema'),
      headings.length === 0
        ? createElement(Text, { muted: true, size: 1 }, 'Este artículo no tiene H2 ni H3.')
        : createElement(
            Flex,
            { direction: 'column', gap: 2 },
            ...headings.map((heading) =>
              createElement(
                Text,
                { key: heading.id, size: 1, style: { paddingLeft: heading.depth === 3 ? 16 : 0 } },
                `${heading.depth === 2 ? 'H2' : 'H3'} · ${heading.text}`,
              ),
            ),
          ),
      createElement(Text, { size: 2, weight: 'semibold' }, 'Enlaces internos'),
      paths === null ? createElement(Spinner, { muted: true }) : null,
      missingService
        ? createElement(Badge, { tone: 'caution' }, `No enlaza a su servicio (${servicePath})`)
        : null,
      missingIndustry
        ? createElement(Badge, { tone: 'caution' }, `No enlaza a su industria (${industryPath})`)
        : null,
      internal.length === 0
        ? createElement(Text, { muted: true, size: 1 }, 'El cuerpo no tiene enlaces internos.')
        : createElement(
            Flex,
            { direction: 'column', gap: 2 },
            ...internal.map((item) =>
              createElement(
                Card,
                { key: `${item.href}-${item.path}`, padding: 3, radius: 2, border: true },
                createElement(
                  Flex,
                  { align: 'center', justify: 'space-between', gap: 3 },
                  createElement(Text, { size: 1 }, item.path),
                  unknown.some((row) => row.path === item.path)
                    ? createElement(Badge, { tone: 'caution' }, 'Ruta desconocida')
                    : createElement(Badge, { tone: 'positive' }, 'Existe'),
                ),
              ),
            ),
          ),
      createElement(
        Text,
        { muted: true, size: 1 },
        'Estos avisos no impiden publicar. La ruta del artículo es ' +
          (pagePath('post', props.documentId, { locale, slug: (doc.slug as { current?: string } | undefined)?.current }) || '—') +
          '.',
      ),
      ),
  );
}
