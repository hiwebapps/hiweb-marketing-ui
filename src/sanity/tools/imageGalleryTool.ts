import { ImagesIcon } from '@sanity/icons/Images';
import { RefreshIcon } from '@sanity/icons/Refresh';
import { SearchIcon } from '@sanity/icons/Search';
import { createElement, useEffect, useMemo, useState, type ReactNode } from 'react';
import { type Tool, useClient } from 'sanity';
import { IntentLink } from 'sanity/router';
import { Badge, Box, Button, Card, Dialog, Flex, Select, Spinner, Text, TextInput } from '@sanity/ui';

const HEAVY_BYTES = 500 * 1024;

const TYPE_LABELS: Record<string, string> = {
  aboutPage: 'Nosotros',
  caseStudy: 'Caso',
  contactPage: 'Contacto',
  faq: 'FAQ',
  homePage: 'Home',
  industriesIndex: 'Índice de industrias',
  industry: 'Industria',
  landingPage: 'Página',
  footer: 'Footer',
  navigation: 'Navbar',
  person: 'Equipo',
  post: 'Blog',
  service: 'Servicio',
  siteSettings: 'Ajustes',
};

const FIELD_LABELS: Record<string, string> = {
  body: 'Cuerpo',
  cover: 'Portada',
  image: 'Imagen',
  imagenesProyecto: 'Imágenes del proyecto',
  ogImage: 'Open Graph',
  photo: 'Foto',
  sections: 'Secciones',
};

type FilterId = 'all' | 'missingAlt' | 'withAlt' | 'unused' | 'heavy';
type FormatId = 'all' | 'jpeg' | 'png' | 'webp' | 'avif' | 'svg';

type Asset = {
  _id: string;
  originalFilename?: string;
  mimeType?: string;
  size?: number;
  url?: string;
  width?: number;
  height?: number;
};

type Usage = {
  assetId: string;
  alt: string;
  docId: string;
  patchId: string;
  docType: string;
  docTitle: string;
  field: string;
  path: string;
};

type RawDoc = {
  _id: string;
  _type: string;
  patchId?: string;
  title?: unknown;
  nombre?: unknown;
  titulo?: unknown;
  cliente?: unknown;
  name?: unknown;
};

const GALLERY_QUERY = `{
  "assets": *[_type == "sanity.imageAsset"]{
    _id,
    originalFilename,
    mimeType,
    size,
    url,
    "width": metadata.dimensions.width,
    "height": metadata.dimensions.height
  },
  "docs": *[!(_type match "sanity.*") && !(_type match "system.*")]
}`;

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'missingAlt', label: 'Sin alt' },
  { id: 'withAlt', label: 'Con alt' },
  { id: 'unused', label: 'Sin usar' },
  { id: 'heavy', label: 'Pesadas' },
];

function textValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function publishedId(id: string) {
  return id.replace(/^drafts\./, '');
}

function documentTitle(doc: RawDoc) {
  const name = [doc.title, doc.nombre, doc.titulo, doc.name, doc.cliente].map(textValue).find(Boolean);
  const base = name || TYPE_LABELS[doc._type] || doc._type;
  return publishedId(doc._id).endsWith('-en') ? `${base} · English` : base;
}

function fieldLabel(path: string) {
  const parts = path
    .split('.')
    .map((part) => part.replace(/\[(?:\d+|_key=="[^"]*")\]/g, ''))
    .filter(Boolean);
  const key = parts.at(-1) ?? '';
  return FIELD_LABELS[key] ?? key;
}

function arraySegment(item: unknown, index: number) {
  if (item && typeof item === 'object' && typeof (item as { _key?: unknown })._key === 'string') {
    const key = (item as { _key: string })._key;
    if (key && !key.includes('"') && !key.includes('\\')) return `[_key=="${key}"]`;
  }
  return `[${index}]`;
}

function preferDrafts(docs: RawDoc[]) {
  const map = new Map<string, RawDoc>();
  for (const doc of docs) {
    const id = publishedId(doc._id);
    const isDraft = doc._id.startsWith('drafts.');
    const current = map.get(id);
    if (!current || isDraft) map.set(id, { ...doc, _id: id, patchId: isDraft ? doc._id : id });
  }
  return [...map.values()];
}

function collectUsages(docs: RawDoc[]) {
  const usages: Usage[] = [];

  function visit(doc: RawDoc, value: unknown, path: string) {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(doc, item, `${path}${arraySegment(item, index)}`));
      return;
    }
    const record = value as Record<string, unknown>;
    const asset = record.asset;
    const ref =
      asset && typeof asset === 'object' && typeof (asset as { _ref?: unknown })._ref === 'string'
        ? (asset as { _ref: string })._ref
        : '';
    if (ref.startsWith('image-')) {
      usages.push({
        assetId: ref,
        alt: textValue(record.alt),
        docId: doc._id,
        patchId: doc.patchId || doc._id,
        docType: doc._type,
        docTitle: documentTitle(doc),
        field: fieldLabel(path),
        path,
      });
    }
    for (const [key, child] of Object.entries(record)) {
      if (key === 'asset' || key.startsWith('_')) continue;
      visit(doc, child, path ? `${path}.${key}` : key);
    }
  }

  for (const doc of preferDrafts(docs)) visit(doc, doc, '');
  return usages;
}

function formatOf(mime?: string): FormatId | 'other' {
  if (mime === 'image/jpeg') return 'jpeg';
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  if (mime === 'image/avif') return 'avif';
  if (mime === 'image/svg+xml') return 'svg';
  return 'other';
}

function formatLabel(mime?: string) {
  const format = formatOf(mime);
  if (format === 'jpeg') return 'JPEG';
  if (format === 'png') return 'PNG';
  if (format === 'webp') return 'WebP';
  if (format === 'avif') return 'AVIF';
  if (format === 'svg') return 'SVG';
  return mime || 'Imagen';
}

function formatSize(bytes?: number) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileName(asset: Asset) {
  return asset.originalFilename?.trim() || 'Sin nombre';
}

function imageUrl(url: string, width: number) {
  const join = url.includes('?') ? '&' : '?';
  return `${url}${join}w=${width}&auto=format`;
}

function matchesStatus(filter: FilterId, usages: Usage[], size?: number) {
  const missing = usages.some((usage) => !usage.alt);
  const unused = usages.length === 0;
  if (filter === 'all') return true;
  if (filter === 'missingAlt') return !unused && missing;
  if (filter === 'withAlt') return !unused && !missing;
  if (filter === 'unused') return unused;
  return (size ?? 0) > HEAVY_BYTES;
}

function AltField({
  usage,
  onSave,
}: {
  usage: Usage;
  onSave: (usage: Usage, alt: string) => Promise<'draft' | 'published'>;
}) {
  const [value, setValue] = useState(usage.alt);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'draft' | 'published' | 'error'>('idle');
  const dirty = value.trim() !== usage.alt;

  useEffect(() => {
    setValue(usage.alt);
  }, [usage.alt, usage.patchId, usage.path]);

  return createElement(
    Flex,
    { direction: 'column', gap: 2 },
    createElement(Text, { size: 1, weight: 'medium' }, 'Texto alternativo'),
    createElement(
      Flex,
      { align: 'center', gap: 2 },
      createElement(
        Box,
        { flex: 1 },
        createElement(TextInput, {
          value,
          placeholder: 'Describe la imagen',
          disabled: saving,
          onChange: (event) => {
            setValue(event.currentTarget.value);
            setStatus('idle');
          },
        }),
      ),
      createElement(Button, {
        text: saving ? 'Guardando…' : 'Guardar',
        tone: 'primary',
        disabled: saving || !dirty,
        onClick: () => {
          setSaving(true);
          setStatus('idle');
          void onSave(usage, value)
            .then((where) => setStatus(where))
            .catch(() => setStatus('error'))
            .finally(() => setSaving(false));
        },
      }),
    ),
    status === 'draft'
      ? createElement(
          Text,
          { muted: true, size: 1 },
          'Guardado en el borrador. Publica el documento para verlo en el sitio.',
        )
      : null,
    status === 'published' ? createElement(Text, { muted: true, size: 1 }, 'Guardado.') : null,
    status === 'error'
      ? createElement(Text, { size: 1 }, 'No se pudo guardar el texto alternativo.')
      : null,
  );
}

function ImageGallery(_props: { tool: Tool }) {
  const client = useClient({ apiVersion: '2026-09-18' });
  const [assets, setAssets] = useState<Asset[]>([]);
  const [usages, setUsages] = useState<Usage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadToken, setReloadToken] = useState(0);
  const [filter, setFilter] = useState<FilterId>('all');
  const [format, setFormat] = useState<FormatId>('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await client.withConfig({ perspective: 'raw' }).fetch<{
          assets?: Asset[];
          docs?: RawDoc[];
        }>(GALLERY_QUERY);
        if (cancelled) return;
        setAssets(data.assets ?? []);
        setUsages(collectUsages(data.docs ?? []));
      } catch {
        if (!cancelled) setError('No se pudo cargar la galería.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [client, reloadToken]);

  const usageIndex = useMemo(() => {
    const index = new Map<string, Usage[]>();
    for (const usage of usages) {
      const list = index.get(usage.assetId) ?? [];
      list.push(usage);
      index.set(usage.assetId, list);
    }
    return index;
  }, [usages]);

  const needle = query.trim().toLowerCase();

  const searched = useMemo(() => {
    return assets
      .filter((asset) => format === 'all' || formatOf(asset.mimeType) === format)
      .filter((asset) => {
        if (!needle) return true;
        const list = usageIndex.get(asset._id) ?? [];
        const haystack = [
          fileName(asset),
          ...list.flatMap((usage) => [usage.alt, usage.docTitle, usage.field, TYPE_LABELS[usage.docType] ?? '']),
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(needle);
      })
      .sort((a, b) => fileName(a).localeCompare(fileName(b), 'es'));
  }, [assets, format, needle, usageIndex]);

  const counts = useMemo(() => {
    const next = { all: searched.length, missingAlt: 0, withAlt: 0, unused: 0, heavy: 0 };
    for (const asset of searched) {
      const list = usageIndex.get(asset._id) ?? [];
      if (matchesStatus('missingAlt', list, asset.size)) next.missingAlt += 1;
      if (matchesStatus('withAlt', list, asset.size)) next.withAlt += 1;
      if (matchesStatus('unused', list, asset.size)) next.unused += 1;
      if (matchesStatus('heavy', list, asset.size)) next.heavy += 1;
    }
    return next;
  }, [searched, usageIndex]);

  const visible = searched.filter((asset) =>
    matchesStatus(filter, usageIndex.get(asset._id) ?? [], asset.size),
  );
  const selected = assets.find((asset) => asset._id === selectedId) ?? null;
  const selectedUsages = selected ? (usageIndex.get(selected._id) ?? []) : [];

  async function saveAlt(usage: Usage, nextAlt: string) {
    const alt = nextAlt.trim();
    if (!usage.path) throw new Error('La imagen no tiene un campo donde guardar el alt.');
    await client
      .patch(usage.patchId)
      .set({ [`${usage.path}.alt`]: alt })
      .commit();
    setUsages((current) =>
      current.map((item) =>
        item.patchId === usage.patchId && item.path === usage.path ? { ...item, alt } : item,
      ),
    );
    return usage.patchId.startsWith('drafts.') ? 'draft' : 'published';
  }

  const summary = loading
    ? 'Cargando imágenes…'
    : `${counts.all} imágenes · ${counts.missingAlt} sin alt · ${counts.unused} sin usar · ${counts.heavy} de más de 500 KB`;

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
            createElement(Text, { size: 3, weight: 'semibold' }, 'Galería'),
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
              placeholder: 'Buscar por nombre, alt o documento',
              value: query,
              onChange: (event) => setQuery(event.currentTarget.value),
            }),
          ),
          createElement(
            Select,
            {
              value: format,
              onChange: (event) => setFormat(event.currentTarget.value as FormatId),
              fontSize: 1,
            },
            createElement('option', { value: 'all' }, 'Todos los formatos'),
            createElement('option', { value: 'jpeg' }, 'JPEG'),
            createElement('option', { value: 'png' }, 'PNG'),
            createElement('option', { value: 'webp' }, 'WebP'),
            createElement('option', { value: 'avif' }, 'AVIF'),
            createElement('option', { value: 'svg' }, 'SVG'),
          ),
        ),
        createElement(
          Flex,
          { gap: 2, wrap: 'wrap' },
          FILTERS.map((item) =>
            createElement(Button, {
              key: item.id,
              mode: filter === item.id ? 'default' : 'ghost',
              tone: item.id === 'missingAlt' && filter === item.id ? 'caution' : 'default',
              text: `${item.label} · ${counts[item.id]}`,
              onClick: () => setFilter(item.id),
              fontSize: 1,
              padding: 2,
            }),
          ),
        ),
      ),
    ),
    createElement(
      Box,
      { flex: 1, overflow: 'auto', padding: 4 },
      loading ? createElement(Flex, { align: 'center', justify: 'center', padding: 6 }, createElement(Spinner, { muted: true })) : null,
      error ? createElement(Card, { padding: 4, radius: 2, tone: 'critical' }, createElement(Text, { size: 1 }, error)) : null,
      !loading && !error && visible.length === 0
        ? createElement(
            Card,
            { padding: 4, radius: 2, tone: 'transparent' },
            createElement(Text, { muted: true, size: 1 }, 'Ninguna imagen coincide con ese filtro.'),
          )
        : null,
      !loading && !error
        ? createElement(
            Box,
            {
              style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: 16,
              },
            },
            visible.map((asset) => {
              const list = usageIndex.get(asset._id) ?? [];
              const missing = list.some((usage) => !usage.alt);
              const unused = list.length === 0;
              let badge: ReactNode = createElement(Badge, { tone: 'positive' }, 'Con alt');
              if (unused) badge = createElement(Badge, { tone: 'default' }, 'Sin usar');
              else if (missing) badge = createElement(Badge, { tone: 'caution' }, 'Sin alt');
              return createElement(
                Card,
                {
                  key: asset._id,
                  as: 'button',
                  padding: 0,
                  radius: 2,
                  shadow: 1,
                  tone: 'default',
                  onClick: () => setSelectedId(asset._id),
                  style: { overflow: 'hidden', textAlign: 'left', cursor: 'pointer', width: '100%' },
                },
                createElement(
                  Box,
                  { style: { height: 140, background: 'var(--card-muted-bg-color)' } },
                  asset.url
                    ? createElement('img', {
                        src: imageUrl(asset.url, 480),
                        alt: '',
                        style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
                      })
                    : null,
                ),
                createElement(
                  Flex,
                  { direction: 'column', gap: 3, padding: 3 },
                  createElement(Text, { size: 1, weight: 'medium', textOverflow: 'ellipsis' }, fileName(asset)),
                  createElement(
                    Text,
                    { muted: true, size: 0 },
                    `${formatLabel(asset.mimeType)} · ${formatSize(asset.size)}${asset.width && asset.height ? ` · ${asset.width}×${asset.height}` : ''}`,
                  ),
                  badge,
                ),
              );
            }),
          )
        : null,
    ),
    selected
      ? createElement(
          Dialog,
          {
            id: 'image-gallery-detail',
            header: fileName(selected),
            width: 2,
            onClose: () => setSelectedId(null),
          },
          createElement(
            Box,
            { padding: 4 },
            createElement(
              Flex,
              { direction: 'column', gap: 4 },
              selected.url
                ? createElement(
                    Card,
                    { radius: 2, tone: 'transparent', style: { overflow: 'hidden' } },
                    createElement('img', {
                      src: imageUrl(selected.url, 1400),
                      alt: selectedUsages.find((usage) => usage.alt)?.alt || fileName(selected),
                      style: { display: 'block', width: '100%', maxHeight: 420, objectFit: 'contain' },
                    }),
                  )
                : null,
              createElement(
                Text,
                { muted: true, size: 1 },
                `${formatLabel(selected.mimeType)} · ${formatSize(selected.size)}${selected.width && selected.height ? ` · ${selected.width}×${selected.height}` : ''}`,
              ),
              selectedUsages.length === 0
                ? createElement(
                    Text,
                    { size: 1 },
                    'Ningún documento usa esta imagen, así que no hay un campo de alt para editar.',
                  )
                : createElement(
                    Flex,
                    { direction: 'column', gap: 3 },
                    selectedUsages.length > 1
                      ? createElement(
                          Text,
                          { muted: true, size: 1 },
                          'Esta imagen se usa en varios lugares. El texto alternativo es de cada uno.',
                        )
                      : null,
                    selectedUsages.map((usage) =>
                      createElement(
                        Card,
                        { key: `${usage.patchId}-${usage.path}`, padding: 3, radius: 2, border: true },
                        createElement(
                          Flex,
                          { direction: 'column', gap: 3 },
                          createElement(
                            Flex,
                            { align: 'flex-start', justify: 'space-between', gap: 3 },
                            createElement(
                              Flex,
                              { direction: 'column', gap: 2 },
                              createElement(Text, { size: 1, weight: 'semibold' }, usage.docTitle),
                              createElement(
                                Text,
                                { muted: true, size: 1 },
                                `${TYPE_LABELS[usage.docType] ?? usage.docType}${usage.field ? ` · ${usage.field}` : ''}`,
                              ),
                            ),
                            createElement(Button, {
                              as: IntentLink,
                              intent: 'edit',
                              params: { id: usage.docId, type: usage.docType },
                              mode: 'ghost',
                              text: 'Abrir',
                              padding: 2,
                            }),
                          ),
                          createElement(AltField, { usage, onSave: saveAlt }),
                        ),
                      ),
                    ),
                  ),
            ),
          ),
        )
      : null,
  );
}

export function imageGalleryTool(): Tool {
  return {
    name: 'galeria',
    title: 'Galería',
    icon: ImagesIcon,
    component: ImageGallery,
  };
}
