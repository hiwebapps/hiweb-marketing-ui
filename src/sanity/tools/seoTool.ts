import { EyeOpenIcon } from '@sanity/icons/EyeOpen';
import { RefreshIcon } from '@sanity/icons/Refresh';
import { SearchIcon } from '@sanity/icons/Search';
import { SplitVerticalIcon } from '@sanity/icons/SplitVertical';
import { TagIcon } from '@sanity/icons/Tag';
import { createElement, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { type Tool, useClient, useWorkspace } from 'sanity';
import { IntentLink, useRouter } from 'sanity/router';
import { Badge, Box, Button, Card, Flex, Select, Spinner, Text, TextInput } from '@sanity/ui';
import { presentationUrl, splitStudioPath } from '../../lib/page-meta';
import {
  buildSeoEntries,
  duplicateTitles,
  isShortDescription,
  SEO_QUERY,
  SINGLE_LOCALE_TYPES,
  TYPE_LABELS,
  type SeoEntry,
  type SeoSource,
  type SeoStatus,
} from '../seo/inventory';

type IssueFilter =
  | 'all'
  | 'missingMeta'
  | 'duplicate'
  | 'short'
  | 'missingOg'
  | 'unpaired';

const STATUS_LABELS: Record<SeoStatus, string> = {
  published: 'Publicado',
  changed: 'Cambios sin publicar',
  draft: 'Borrador',
};

const GRID = '150px minmax(220px, 1.4fr) 160px 120px 140px 220px';

function option(value: string, label: string) {
  return createElement('option', { key: value, value }, label);
}

function SeoTool(_props: { tool: Tool }) {
  const client = useClient({ apiVersion: '2026-09-18' });
  const { basePath } = useWorkspace();
  const router = useRouter();
  const [rows, setRows] = useState<SeoSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadToken, setReloadToken] = useState(0);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [locale, setLocale] = useState('all');
  const [issue, setIssue] = useState<IssueFilter>('all');
  const loaded = useRef(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!loaded.current) setLoading(true);
      setError('');
      try {
        const data = await client.withConfig({ perspective: 'raw' }).fetch<SeoSource[]>(SEO_QUERY);
        if (!cancelled) {
          setRows(data ?? []);
          loaded.current = true;
        }
      } catch {
        if (!cancelled) setError('No se pudo cargar el inventario SEO.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [client, reloadToken]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const subscription = client
      .listen('*[_type in ["homePage","aboutPage","service","industry","caseStudy","contactPage","landingPage","post","industriesIndex","servicesIndex","blogIndex","casesIndex","legalPage"]]', {}, { includeResult: false, visibility: 'query' })
      .subscribe(() => {
        clearTimeout(timer);
        timer = setTimeout(() => setReloadToken((token) => token + 1), 800);
      });
    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [client]);

  const entries = useMemo(() => buildSeoEntries(rows), [rows]);
  const dupes = useMemo(() => duplicateTitles(entries), [entries]);
  const needle = query.trim().toLowerCase();

  function flagged(entry: SeoEntry, filter: IssueFilter) {
    if (filter === 'missingMeta') return !entry.customTitle;
    if (filter === 'duplicate') return (dupes.get(entry.title.trim().toLowerCase()) ?? 0) > 1;
    if (filter === 'short') return isShortDescription(entry);
    if (filter === 'missingOg') return !entry.hasOg;
    if (filter === 'unpaired') return !entry.paired && !SINGLE_LOCALE_TYPES.has(entry.type);
    return true;
  }

  const visible = entries.filter((entry) => {
    if (type !== 'all' && entry.type !== type) return false;
    if (locale !== 'all' && entry.locale !== locale) return false;
    if (!flagged(entry, issue)) return false;
    if (!needle) return true;
    return `${entry.path} ${entry.title} ${entry.label}`.toLowerCase().includes(needle);
  });

  const counts = {
    missingMeta: entries.filter((entry) => flagged(entry, 'missingMeta')).length,
    duplicate: entries.filter((entry) => flagged(entry, 'duplicate')).length,
    short: entries.filter((entry) => flagged(entry, 'short')).length,
    missingOg: entries.filter((entry) => flagged(entry, 'missingOg')).length,
    unpaired: entries.filter((entry) => flagged(entry, 'unpaired')).length,
  };

  function go(event: MouseEvent, path: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    router.navigateUrl({ path });
  }

  const summary = loading
    ? 'Cargando páginas…'
    : `${entries.length} URLs · ${counts.missingMeta} sin título SEO · ${counts.duplicate} con título repetido · ${counts.unpaired} sin pareja`;

  return createElement(
    Flex,
    { direction: 'column', style: { height: '100%' } },
    createElement(
      Card,
      { borderBottom: true, padding: 4 },
      createElement(
        Flex,
        { direction: 'column', gap: 4 },
        createElement(
          Flex,
          { align: 'center', justify: 'space-between', gap: 3 },
          createElement(
            Flex,
            { direction: 'column', gap: 2 },
            createElement(Text, { size: 3, weight: 'semibold' }, 'SEO'),
            createElement(Text, { muted: true, size: 1 }, summary),
          ),
          createElement(Button, {
            icon: RefreshIcon,
            mode: 'bleed',
            text: 'Actualizar',
            disabled: loading,
            onClick: () => setReloadToken((token) => token + 1),
          }),
        ),
        createElement(
          Flex,
          { align: 'center', gap: 2, wrap: 'wrap' },
          createElement(
            Box,
            { flex: 1, style: { minWidth: 220 } },
            createElement(TextInput, {
              icon: SearchIcon,
              placeholder: 'Buscar por ruta o título',
              value: query,
              onChange: (event) => setQuery(event.currentTarget.value),
            }),
          ),
          createElement(
            Select,
            { value: issue, fontSize: 1, onChange: (event) => setIssue(event.currentTarget.value as IssueFilter) },
            option('all', 'Todo'),
            option('missingMeta', `Sin título SEO · ${counts.missingMeta}`),
            option('duplicate', `Título duplicado · ${counts.duplicate}`),
            option('short', `Descripción corta · ${counts.short}`),
            option('missingOg', `Sin Open Graph · ${counts.missingOg}`),
            option('unpaired', `Sin pareja · ${counts.unpaired}`),
          ),
          createElement(
            Select,
            { value: type, fontSize: 1, onChange: (event) => setType(event.currentTarget.value) },
            option('all', 'Todo tipo'),
            ...Object.entries(TYPE_LABELS).map(([id, label]) => option(id, label)),
          ),
          createElement(
            Select,
            { value: locale, fontSize: 1, onChange: (event) => setLocale(event.currentTarget.value) },
            option('all', 'Todo idioma'),
            option('es', 'Español'),
            option('en', 'English'),
          ),
        ),
      ),
    ),
    createElement(
      Box,
      { flex: 1, overflow: 'auto', padding: 4 },
      loading
        ? createElement(Flex, { align: 'center', justify: 'center', padding: 6 }, createElement(Spinner, { muted: true }))
        : null,
      error ? createElement(Card, { padding: 4, radius: 2, tone: 'critical' }, createElement(Text, { size: 1 }, error)) : null,
      !loading && !error && visible.length === 0
        ? createElement(Card, { padding: 4, radius: 2, tone: 'transparent' }, createElement(Text, { muted: true, size: 1 }, 'Ninguna página coincide con esos filtros.'))
        : null,
      !loading && !error && visible.length > 0
        ? createElement(
            Flex,
            { direction: 'column', gap: 2, style: { minWidth: 1100 } },
            createElement(
              Box,
              {
                style: {
                  display: 'grid',
                  gridTemplateColumns: GRID,
                  gap: 16,
                  padding: '8px 12px',
                  position: 'sticky',
                  top: 0,
                  background: 'var(--card-bg-color)',
                  zIndex: 1,
                },
              },
              ...['Ruta', 'Título publicado', 'Meta', 'Open Graph', 'Pareja', ''].map((label, index) =>
                createElement(Text, { key: index, size: 1, weight: 'semibold', muted: true }, label),
              ),
            ),
            ...visible.map((entry) => rowView(entry)),
          )
        : null,
    ),
  );

  function rowView(entry: SeoEntry) {
    const duplicate = (dupes.get(entry.title.trim().toLowerCase()) ?? 0) > 1;
    const split = entry.paired
      ? splitStudioPath(basePath, entry.type, entry.esId, entry.enId, entry.esSlug)
      : '';
    const actions = [
      createElement(Button, {
        key: 'open',
        as: IntentLink,
        intent: 'edit',
        params: { id: entry.id, type: entry.type },
        mode: 'ghost',
        text: 'Abrir',
        fontSize: 1,
        padding: 2,
      }),
      split
        ? createElement(Button, {
            key: 'split',
            as: 'a',
            href: split,
            icon: SplitVerticalIcon,
            mode: 'default',
            text: 'Lado a lado',
            fontSize: 1,
            padding: 2,
            onClick: (event: MouseEvent) => go(event, split),
          })
        : null,
      entry.path
        ? createElement(Button, {
            key: 'view',
            as: 'a',
            href: presentationUrl(basePath, entry.path),
            icon: EyeOpenIcon,
            mode: 'ghost',
            text: 'Ver',
            fontSize: 1,
            padding: 2,
            onClick: (event: MouseEvent) => go(event, presentationUrl(basePath, entry.path)),
          })
        : null,
    ];
    return createElement(
      Card,
      { key: entry.id, padding: 3, radius: 2, border: true },
      createElement(
        Box,
        { style: { display: 'grid', gridTemplateColumns: GRID, gap: 16, alignItems: 'center' } },
        createElement(
          Flex,
          { direction: 'column', gap: 2, style: { minWidth: 0 } },
          createElement(Text, { size: 1, weight: 'medium', textOverflow: 'ellipsis' }, entry.path),
          createElement(Text, { muted: true, size: 0 }, `${TYPE_LABELS[entry.type] ?? entry.type} · ${entry.locale === 'en' ? 'EN' : 'ES'} · ${STATUS_LABELS[entry.status]}`),
        ),
        createElement(
          Flex,
          { direction: 'column', gap: 2, style: { minWidth: 0 } },
          createElement(Text, { size: 1, textOverflow: 'ellipsis' }, entry.title),
          createElement(Text, { muted: true, size: 0 }, `${entry.title.length} caracteres${entry.customTitle ? '' : ' · fallback'}`),
        ),
        createElement(
          Flex,
          { gap: 2, wrap: 'wrap' },
          createElement(Badge, { tone: entry.customTitle ? 'positive' : 'caution', fontSize: 0 }, entry.customTitle ? 'Título' : 'Sin título'),
          createElement(
            Badge,
            { tone: !entry.description.trim() || isShortDescription(entry) ? 'caution' : 'positive', fontSize: 0 },
            entry.description.trim() ? `${entry.description.trim().length} desc` : 'Sin desc',
          ),
          duplicate ? createElement(Badge, { tone: 'critical', fontSize: 0 }, 'Duplicado') : null,
        ),
        createElement(
          Flex,
          { gap: 2, wrap: 'wrap' },
          createElement(Badge, { tone: entry.hasOg ? 'positive' : 'caution', fontSize: 0 }, entry.hasOg ? 'Imagen' : 'Sin imagen'),
          entry.hasOg
            ? createElement(Badge, { tone: entry.hasOgAlt ? 'positive' : 'caution', fontSize: 0 }, entry.hasOgAlt ? 'Alt' : 'Sin alt')
            : null,
        ),
        createElement(
          Flex,
          { direction: 'column', gap: 2 },
          createElement(
            Badge,
            { tone: entry.paired ? 'positive' : SINGLE_LOCALE_TYPES.has(entry.type) ? 'default' : 'caution' },
            entry.paired ? 'Con pareja' : SINGLE_LOCALE_TYPES.has(entry.type) ? 'Sin idioma' : 'Sin pareja',
          ),
          entry.missingServiceLink || entry.missingIndustryLink
            ? createElement(
                Badge,
                { tone: 'caution', fontSize: 0 },
                [entry.missingServiceLink ? 'sin enlace al servicio' : '', entry.missingIndustryLink ? 'sin enlace a la industria' : '']
                  .filter(Boolean)
                  .join(' · '),
              )
            : null,
        ),
        createElement(Flex, { gap: 1, wrap: 'wrap', justify: 'flex-end' }, ...actions),
      ),
    );
  }
}

export function seoTool(): Tool {
  return {
    name: 'seo',
    title: 'SEO',
    icon: TagIcon,
    component: SeoTool,
  };
}
