import { AddIcon } from '@sanity/icons/Add';
import { ComposeIcon } from '@sanity/icons/Compose';
import { EyeOpenIcon } from '@sanity/icons/EyeOpen';
import { RefreshIcon } from '@sanity/icons/Refresh';
import { SearchIcon } from '@sanity/icons/Search';
import { SplitVerticalIcon } from '@sanity/icons/SplitVertical';
import { createElement, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { type Tool, useClient, useWorkspace } from 'sanity';
import { useRouter } from 'sanity/router';
import { Badge, Box, Button, Card, Flex, Select, Spinner, Text, TextInput } from '@sanity/ui';
import { useToast } from '@sanity/ui/toast';
import {
  buildPairs,
  createEnglishDraft,
  formatWords,
  POSTS_QUERY,
  presentationPath,
  splitPath,
  STATUS_LABELS,
  TRANSLATION_LABELS,
  type PostPair,
  type PostRow,
  type PostStatus,
  type PostVersion,
  type TranslationStatus,
} from '../blog/posts';

type StateFilter = 'all' | 'draft' | 'published';
type TranslationFilter = 'all' | TranslationStatus;

const STATUS_TONES: Record<PostStatus, 'positive' | 'caution' | 'default'> = {
  published: 'positive',
  changed: 'caution',
  draft: 'default',
};

const TRANSLATION_TONES: Record<TranslationStatus, 'positive' | 'caution' | 'critical'> = {
  ok: 'positive',
  stale: 'caution',
  missingEn: 'critical',
  missingEs: 'critical',
};

const GRID = 'minmax(220px, 1fr) minmax(220px, 1fr) 96px 150px 220px';

function unique(values: (string | undefined)[]) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))].sort((a, b) =>
    a.localeCompare(b, 'es'),
  );
}

function hasDraft(pair: PostPair) {
  return [pair.es, pair.en].some((version) => version && version.status !== 'published');
}

function option(value: string, label: string) {
  return createElement('option', { key: value, value }, label);
}

function FilterSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReturnType<typeof option>[];
}) {
  return createElement(
    Select,
    { value, fontSize: 1, onChange: (event) => onChange(event.currentTarget.value) },
    ...children,
  );
}

function VersionCell({ version, label }: { version?: PostVersion; label: string }) {
  if (!version) {
    return createElement(
      Flex,
      { direction: 'column', gap: 2 },
      createElement(Text, { muted: true, size: 1 }, `Sin versión en ${label}`),
    );
  }
  return createElement(
    Flex,
    { direction: 'column', gap: 2, style: { minWidth: 0 } },
    createElement(Text, { size: 1, weight: 'medium', textOverflow: 'ellipsis' }, version.title || 'Sin título'),
    createElement(Text, { muted: true, size: 0, textOverflow: 'ellipsis' }, version.slug ? `/${version.slug}` : 'Sin slug'),
    createElement(
      Flex,
      { gap: 2, wrap: 'wrap', align: 'center' },
      createElement(Badge, { tone: STATUS_TONES[version.status], fontSize: 0 }, STATUS_LABELS[version.status]),
      createElement(Text, { muted: true, size: 0 }, formatWords(version.words)),
      version.missingAlt
        ? createElement(Badge, { tone: 'caution', fontSize: 0 }, `${version.missingAlt} sin alt`)
        : null,
    ),
  );
}

function BlogsTool(_props: { tool: Tool }) {
  const client = useClient({ apiVersion: '2026-09-18' });
  const { basePath } = useWorkspace();
  const router = useRouter();
  const toast = useToast();
  const [rows, setRows] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadToken, setReloadToken] = useState(0);
  const [creating, setCreating] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [servicio, setServicio] = useState('all');
  const [industria, setIndustria] = useState('all');
  const [author, setAuthor] = useState('all');
  const [state, setState] = useState<StateFilter>('all');
  const [translation, setTranslation] = useState<TranslationFilter>('all');
  const loaded = useRef(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!loaded.current) setLoading(true);
      setError('');
      try {
        const data = await client.withConfig({ perspective: 'raw' }).fetch<PostRow[]>(POSTS_QUERY);
        if (cancelled) return;
        setRows(data ?? []);
        loaded.current = true;
      } catch {
        if (!cancelled) setError('No se pudieron cargar los artículos.');
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
      .listen('*[_type == "post"]', {}, { includeResult: false, visibility: 'query' })
      .subscribe(() => {
        clearTimeout(timer);
        timer = setTimeout(() => setReloadToken((token) => token + 1), 800);
      });
    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [client]);

  const pairs = useMemo(() => buildPairs(rows), [rows]);

  const options = useMemo(() => {
    const versions = pairs.flatMap((pair) => [pair.es, pair.en]).filter(Boolean) as PostVersion[];
    return {
      servicios: unique(pairs.map((pair) => pair.es?.servicio ?? pair.en?.servicio)),
      industrias: unique(pairs.map((pair) => pair.es?.industria ?? pair.en?.industria)),
      authors: unique(versions.map((version) => version.author)),
    };
  }, [pairs]);

  const needle = query.trim().toLowerCase();

  const visible = pairs.filter((pair) => {
    const versions = [pair.es, pair.en].filter(Boolean) as PostVersion[];
    if (needle) {
      const haystack = versions
        .flatMap((version) => [version.title, version.slug, version.esSlug])
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    if (servicio !== 'all' && (pair.es?.servicio ?? pair.en?.servicio) !== servicio) return false;
    if (industria !== 'all' && (pair.es?.industria ?? pair.en?.industria) !== industria) return false;
    if (author !== 'all' && !versions.some((version) => version.author === author)) return false;
    if (state === 'draft' && !hasDraft(pair)) return false;
    if (state === 'published' && hasDraft(pair)) return false;
    if (translation !== 'all' && pair.translation !== translation) return false;
    return true;
  });

  const counts = useMemo(() => {
    const next: Record<TranslationStatus, number> = { ok: 0, stale: 0, missingEn: 0, missingEs: 0 };
    for (const pair of pairs) next[pair.translation] += 1;
    return next;
  }, [pairs]);

  function go(event: MouseEvent, path: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    router.navigateUrl({ path });
  }

  async function createEnglish(pair: PostPair) {
    if (!pair.es) return;
    setCreating(pair.key);
    try {
      const enId = await createEnglishDraft(client, pair.es.id);
      router.navigateUrl({ path: splitPath(basePath, pair.es.id, enId) });
    } catch (err) {
      toast.push({
        status: 'error',
        title: 'No se pudo crear la versión en inglés',
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setCreating(null);
    }
  }

  function linkButton(key: string, text: string, path: string, icon?: typeof EyeOpenIcon, mode: 'ghost' | 'default' = 'ghost') {
    return createElement(Button, {
      key,
      as: 'a',
      href: path,
      onClick: (event: MouseEvent) => go(event, path),
      icon,
      mode,
      text,
      fontSize: 1,
      padding: 2,
    });
  }

  function actions(pair: PostPair) {
    const items = [];
    if (pair.es || pair.en) {
      items.push(
        linkButton(
          'split',
          pair.es && pair.en ? 'Lado a lado' : 'Abrir',
          splitPath(basePath, pair.es?.id, pair.en?.id),
          SplitVerticalIcon,
          'default',
        ),
      );
    }
    if (pair.es && !pair.en) {
      items.push(
        createElement(Button, {
          key: 'create',
          icon: AddIcon,
          mode: 'ghost',
          tone: 'primary',
          text: creating === pair.key ? 'Creando…' : 'Crear EN',
          disabled: creating !== null || !pair.es.slug,
          title: pair.es.slug ? undefined : 'Primero define el slug en español.',
          onClick: () => void createEnglish(pair),
          fontSize: 1,
          padding: 2,
        }),
      );
    }
    if (pair.es?.slug) items.push(linkButton('view-es', 'Ver ES', presentationPath(basePath, 'es', pair.es.slug), EyeOpenIcon));
    if (pair.en?.slug) items.push(linkButton('view-en', 'Ver EN', presentationPath(basePath, 'en', pair.en.slug), EyeOpenIcon));
    return createElement(Flex, { gap: 1, wrap: 'wrap', justify: 'flex-end' }, ...items);
  }

  const summary = loading
    ? 'Cargando artículos…'
    : `${pairs.length} artículos · ${counts.missingEn} sin inglés · ${counts.missingEs} sin español · ${counts.stale} por revisar`;

  const header = createElement(
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
    ...['Español', 'English', 'Fecha', 'Traducción', ''].map((label, index) =>
      createElement(Text, { key: index, size: 1, weight: 'semibold', muted: true }, label),
    ),
  );

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
            createElement(Text, { size: 3, weight: 'semibold' }, 'Blogs'),
            createElement(Text, { muted: true, size: 1 }, summary),
          ),
          createElement(Button, {
            icon: RefreshIcon,
            mode: 'bleed',
            text: 'Actualizar',
            onClick: () => setReloadToken((token) => token + 1),
            disabled: loading,
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
              placeholder: 'Buscar por título o slug',
              value: query,
              onChange: (event) => setQuery(event.currentTarget.value),
            }),
          ),
          createElement(FilterSelect, {
            value: translation,
            onChange: (value) => setTranslation(value as TranslationFilter),
            children: [
              option('all', 'Toda traducción'),
              option('missingEn', `${TRANSLATION_LABELS.missingEn} · ${counts.missingEn}`),
              option('missingEs', `${TRANSLATION_LABELS.missingEs} · ${counts.missingEs}`),
              option('stale', `${TRANSLATION_LABELS.stale} · ${counts.stale}`),
              option('ok', `${TRANSLATION_LABELS.ok} · ${counts.ok}`),
            ],
          }),
          createElement(FilterSelect, {
            value: state,
            onChange: (value) => setState(value as StateFilter),
            children: [
              option('all', 'Todo estado'),
              option('draft', 'Con borrador'),
              option('published', 'Todo publicado'),
            ],
          }),
          createElement(FilterSelect, {
            value: servicio,
            onChange: setServicio,
            children: [option('all', 'Todo servicio'), ...options.servicios.map((name) => option(name, name))],
          }),
          createElement(FilterSelect, {
            value: industria,
            onChange: setIndustria,
            children: [option('all', 'Toda industria'), ...options.industrias.map((name) => option(name, name))],
          }),
          createElement(FilterSelect, {
            value: author,
            onChange: setAuthor,
            children: [option('all', 'Todo autor'), ...options.authors.map((name) => option(name, name))],
          }),
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
        ? createElement(
            Card,
            { padding: 4, radius: 2, tone: 'transparent' },
            createElement(Text, { muted: true, size: 1 }, 'Ningún artículo coincide con esos filtros.'),
          )
        : null,
      !loading && !error && visible.length > 0
        ? createElement(
            Flex,
            { direction: 'column', gap: 2, style: { minWidth: 980 } },
            header,
            ...visible.map((pair) =>
              createElement(
                Card,
                { key: pair.key, padding: 3, radius: 2, border: true },
                createElement(
                  Box,
                  { style: { display: 'grid', gridTemplateColumns: GRID, gap: 16, alignItems: 'center' } },
                  createElement(VersionCell, { version: pair.es, label: 'español' }),
                  createElement(VersionCell, { version: pair.en, label: 'inglés' }),
                  createElement(Text, { size: 1, muted: true }, pair.es?.fecha ?? pair.en?.fecha ?? '—'),
                  createElement(
                    Box,
                    null,
                    createElement(Badge, { tone: TRANSLATION_TONES[pair.translation] }, TRANSLATION_LABELS[pair.translation]),
                  ),
                  actions(pair),
                ),
              ),
            ),
          )
        : null,
    ),
  );
}

export function blogsTool(): Tool {
  return {
    name: 'blogs',
    title: 'Blogs',
    icon: ComposeIcon,
    component: BlogsTool,
  };
}
