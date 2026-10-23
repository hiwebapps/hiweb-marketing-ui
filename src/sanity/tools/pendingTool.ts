import { EyeOpenIcon } from '@sanity/icons/EyeOpen';
import { PublishIcon } from '@sanity/icons/Publish';
import { RefreshIcon } from '@sanity/icons/Refresh';
import { SearchIcon } from '@sanity/icons/Search';
import { createElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type Tool, useClient, useSchema, useUser, useValidationStatus } from 'sanity';
import { IntentLink } from 'sanity/router';
import { Badge, Box, Button, Card, Checkbox, Dialog, Flex, Select, Spinner, Text, TextInput } from '@sanity/ui';
import { useToast } from '@sanity/ui/toast';
import { isEnglish, pagePath, publishedId } from '../../lib/page-meta';

const STAGING_ORIGIN = 'https://staging.hiweb.com.mx';

const DRAFTS_QUERY = /* groq */ `*[_id in path("drafts.**") && !(_type match "sanity.*") && !(_type match "system.*")] | order(_updatedAt desc){
  _id,
  _type,
  _rev,
  _updatedAt,
  locale,
  "slug": slug.current,
  nombre,
  cliente,
  title,
  name,
  titulo,
  label,
  from,
  to,
  "publishedAt": *[_id == string::split(^._id, "drafts.")[1]][0]._updatedAt
}`;

/** Singletons get the same name the desk uses. Their `-en` twin shares it. */
const SINGLETON_LABELS: Record<string, string> = {
  siteSettings: 'Ajustes del sitio',
  navigation: 'Navbar',
  footer: 'Footer',
  homePage: 'Home',
  aboutPage: 'Nosotros',
  contactPage: 'Contacto',
  calendarPage: 'Calendario',
  portalPage: 'Portal de clientes',
  'legal-terms': 'Términos y condiciones',
  'legal-privacy': 'Aviso de privacidad',
  'page-diagnostico': 'Diagnóstico de marketing digital',
  ctaBackdrop: 'Cierre (fondo del CTA)',
  blogIndex: 'Índice del blog',
  casesIndex: 'Índice de casos',
  industriesIndex: 'Índice de industrias',
  servicesIndex: 'Índice de servicios',
};

type DraftRow = {
  _id: string;
  _type: string;
  _rev: string;
  _updatedAt: string;
  locale?: string;
  slug?: string;
  nombre?: string;
  cliente?: string;
  title?: string;
  name?: string;
  titulo?: string;
  label?: string;
  from?: string;
  to?: string;
  publishedAt?: string | null;
};

type Validity = 'validating' | 'ok' | 'error';

const GRID = '32px minmax(240px, 1fr) 230px 190px 180px';
const MAX_WIDTH = 1200;

function rowLabel(row: DraftRow) {
  const id = publishedId(row._id);
  const base = id.endsWith('-en') ? id.slice(0, -3) : id;
  if (row._type === 'redirect' && (row.from || row.to)) return `${row.from || '?'} → ${row.to || '?'}`;
  return (
    SINGLETON_LABELS[base] ||
    row.nombre ||
    row.cliente ||
    row.title ||
    row.name ||
    row.titulo ||
    row.label ||
    row.slug ||
    'Sin título'
  ).trim();
}

type SchemaNode = { title?: string; fields?: { name: string; type: SchemaNode }[]; of?: SchemaNode[] };

/** Array items inside a page builder can be of several types, so the walk stops at the array. */
function fieldTitle(root: SchemaNode | undefined, path: unknown[]) {
  const titles: string[] = [];
  let node = root;
  for (const segment of path) {
    if (!node) break;
    if (typeof segment === 'string') {
      const field = node.fields?.find((item) => item.name === segment);
      if (!field) break;
      titles.push(field.type.title || segment);
      node = field.type;
    } else {
      node = node.of?.length === 1 ? node.of[0] : undefined;
    }
  }
  return titles.join(' › ');
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
}

function option(value: string, label: string) {
  return createElement('option', { key: value, value }, label);
}

function EditorName({ userId }: { userId: string }) {
  const [user] = useUser(userId);
  return createElement(Text, { muted: true, size: 0, textOverflow: 'ellipsis' }, user?.displayName ?? '…');
}

function useLastEditor(row: DraftRow) {
  const client = useClient({ apiVersion: '2026-09-18' });
  const [author, setAuthor] = useState('');
  useEffect(() => {
    let cancelled = false;
    const { dataset } = client.config();
    client
      .request<unknown>({
        uri: `/data/history/${dataset}/transactions/${row._id}?excludeContent=true&reverse=true&limit=1`,
      })
      .then((body) => {
        const first = typeof body === 'string' ? JSON.parse(body.split('\n')[0] || '{}') : body;
        if (!cancelled) setAuthor((first as { author?: string })?.author ?? '');
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [client, row._id, row._rev]);
  return author;
}

function DraftRowView({
  row,
  schemaType,
  typeTitle,
  selected,
  validity,
  onToggle,
  onValidity,
}: {
  row: DraftRow;
  schemaType: SchemaNode | undefined;
  typeTitle: string;
  selected: boolean;
  validity: Validity;
  onToggle: (id: string) => void;
  onValidity: (id: string, value: Validity) => void;
}) {
  const status = useValidationStatus(row._id, row._type, true);
  const errors = status.validation.filter((marker) => marker.level === 'error');
  const warnings = status.validation.filter((marker) => marker.level === 'warning');
  const next: Validity = status.isValidating || !status.revision ? 'validating' : errors.length ? 'error' : 'ok';
  const author = useLastEditor(row);
  const errorFields = [
    ...new Set(errors.map((marker) => fieldTitle(schemaType, marker.path as unknown[]) || marker.message)),
  ];

  useEffect(() => {
    onValidity(row._id, next);
  }, [onValidity, row._id, next]);

  const id = publishedId(row._id);
  const english = isEnglish(id, row.locale);
  const path = pagePath(row._type, id, { locale: row.locale, slug: row.slug });
  const isNew = !row.publishedAt;

  return createElement(
    Card,
    { padding: 3, radius: 2, border: true, tone: selected ? 'primary' : 'default' },
    createElement(
      Box,
      { style: { display: 'grid', gridTemplateColumns: GRID, gap: 16, alignItems: 'center' } },
      createElement(Checkbox, {
        checked: selected,
        disabled: validity !== 'ok',
        'aria-label': `Seleccionar ${rowLabel(row)}`,
        title: validity === 'error' ? 'Corrige los errores antes de publicar.' : undefined,
        onChange: () => onToggle(row._id),
      }),
      createElement(
        Flex,
        { direction: 'column', gap: 2, style: { minWidth: 0 } },
        createElement(Text, { size: 1, weight: 'medium', textOverflow: 'ellipsis' }, rowLabel(row)),
        createElement(Text, { muted: true, size: 0, textOverflow: 'ellipsis' }, `${typeTitle} · ${english ? 'EN' : 'ES'}${path ? ` · ${path}` : ''}`),
      ),
      createElement(
        Flex,
        { direction: 'column', gap: 2, style: { minWidth: 0 } },
        createElement(
          Flex,
          { gap: 2, wrap: 'wrap', align: 'center' },
          createElement(Badge, { tone: isNew ? 'primary' : 'caution', fontSize: 0 }, isNew ? 'Nuevo, nunca publicado' : 'Cambios sin publicar'),
          validity === 'validating' ? createElement(Badge, { fontSize: 0 }, 'Validando…') : null,
          errors.length
            ? createElement(
                Badge,
                { tone: 'critical', fontSize: 0, title: errors.map((marker) => marker.message).join('\n') },
                `${errors.length} ${errors.length === 1 ? 'error' : 'errores'}`,
              )
            : null,
          !errors.length && warnings.length
            ? createElement(
                Badge,
                { tone: 'caution', fontSize: 0, title: warnings.map((marker) => marker.message).join('\n') },
                `${warnings.length} ${warnings.length === 1 ? 'aviso' : 'avisos'}`,
              )
            : null,
        ),
        errorFields.length
          ? createElement(Text, { size: 0, muted: true }, `Revisa: ${errorFields.join(' · ')}`)
          : null,
      ),
      createElement(
        Flex,
        { direction: 'column', gap: 2, style: { minWidth: 0 } },
        createElement(Text, { size: 1 }, formatDate(row._updatedAt)),
        author ? createElement(EditorName, { userId: author }) : null,
      ),
      createElement(
        Flex,
        { gap: 1, wrap: 'wrap', justify: 'flex-end' },
        createElement(Button, {
          as: IntentLink,
          intent: 'edit',
          params: { id, type: row._type },
          mode: 'ghost',
          text: 'Abrir',
          fontSize: 1,
          padding: 2,
        }),
        path
          ? createElement(Button, {
              as: 'a',
              href: `${STAGING_ORIGIN}${path}`,
              target: '_blank',
              rel: 'noreferrer',
              icon: EyeOpenIcon,
              mode: 'ghost',
              text: 'Staging',
              fontSize: 1,
              padding: 2,
            })
          : null,
      ),
    ),
  );
}

function PendingTool(_props: { tool: Tool }) {
  const client = useClient({ apiVersion: '2026-09-18' });
  const schema = useSchema();
  const toast = useToast();
  const [rows, setRows] = useState<DraftRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadToken, setReloadToken] = useState(0);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [validity, setValidity] = useState<Record<string, Validity>>({});
  const [confirming, setConfirming] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!loaded.current) setLoading(true);
      setError('');
      try {
        const data = await client.withConfig({ perspective: 'raw' }).fetch<DraftRow[]>(DRAFTS_QUERY);
        if (cancelled) return;
        setRows((data ?? []).filter((row) => schema.get(row._type)));
        loaded.current = true;
      } catch {
        if (!cancelled) setError('No se pudieron cargar los borradores.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [client, schema, reloadToken]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const subscription = client
      .listen('*[_id in path("drafts.**")]', {}, { includeResult: false, visibility: 'query' })
      .subscribe(() => {
        clearTimeout(timer);
        timer = setTimeout(() => setReloadToken((token) => token + 1), 800);
      });
    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [client]);

  useEffect(() => {
    const ids = new Set(rows.map((row) => row._id));
    setSelected((current) => {
      const next = new Set([...current].filter((id) => ids.has(id) && validity[id] === 'ok'));
      return next.size === current.size ? current : next;
    });
  }, [rows, validity]);

  const onValidity = useCallback((id: string, value: Validity) => {
    setValidity((current) => (current[id] === value ? current : { ...current, [id]: value }));
  }, []);

  const onToggle = useCallback((id: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const typeTitle = useCallback((name: string) => schema.get(name)?.title ?? name, [schema]);

  const types = useMemo(
    () =>
      [...new Set(rows.map((row) => row._type))]
        .map((name) => ({ name, title: typeTitle(name) }))
        .sort((a, b) => a.title.localeCompare(b.title, 'es')),
    [rows, typeTitle],
  );

  const needle = query.trim().toLowerCase();
  const visible = rows.filter((row) => {
    if (type !== 'all' && row._type !== type) return false;
    if (!needle) return true;
    return `${rowLabel(row)} ${row.slug ?? ''} ${typeTitle(row._type)}`.toLowerCase().includes(needle);
  });

  const selectable = visible.filter((row) => validity[row._id] === 'ok');
  const allSelected = selectable.length > 0 && selectable.every((row) => selected.has(row._id));
  const withErrors = rows.filter((row) => validity[row._id] === 'error').length;
  const newCount = rows.filter((row) => !row.publishedAt).length;
  const targets = rows.filter((row) => selected.has(row._id));

  function toggleAll() {
    setSelected((current) => {
      const next = new Set(current);
      for (const row of selectable) {
        if (allSelected) next.delete(row._id);
        else next.add(row._id);
      }
      return next;
    });
  }

  async function publishSelected() {
    setConfirming(false);
    const failed: { label: string; message: string }[] = [];
    setProgress({ done: 0, total: targets.length });
    for (const [index, row] of targets.entries()) {
      try {
        await client.action({
          actionType: 'sanity.action.document.publish',
          draftId: row._id,
          publishedId: publishedId(row._id),
          ifDraftRevisionId: row._rev,
        });
      } catch (err) {
        failed.push({ label: rowLabel(row), message: err instanceof Error ? err.message : 'Error desconocido' });
      }
      setProgress({ done: index + 1, total: targets.length });
    }
    setProgress(null);
    setSelected(new Set());
    setReloadToken((token) => token + 1);
    const ok = targets.length - failed.length;
    if (ok) {
      toast.push({
        status: 'success',
        title: `${ok} ${ok === 1 ? 'documento publicado' : 'documentos publicados'}`,
        description: 'hiweb.com.mx se actualiza con el siguiente deploy del sitio.',
      });
    }
    if (failed.length) {
      toast.push({
        status: 'error',
        duration: 15000,
        title: `${failed.length} no se ${failed.length === 1 ? 'pudo' : 'pudieron'} publicar`,
        description: failed.map((item) => `${item.label}: ${item.message}`).join(' · '),
      });
    }
  }

  const publishing = progress !== null;
  const summary = loading
    ? 'Cargando borradores…'
    : rows.length === 0
      ? 'No hay nada pendiente: todo está publicado.'
      : `${rows.length} con cambios sin publicar · ${newCount} nunca publicados · ${withErrors} con errores`;

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
        alignItems: 'center',
      },
    },
    createElement(Checkbox, {
      checked: allSelected,
      indeterminate: !allSelected && selectable.some((row) => selected.has(row._id)),
      disabled: selectable.length === 0 || publishing,
      onChange: toggleAll,
      title: 'Seleccionar todo lo que se puede publicar',
      'aria-label': 'Seleccionar todo lo que se puede publicar',
    }),
    ...['Documento', 'Estado', 'Última edición', ''].map((label, index) =>
      createElement(Text, { key: index, size: 1, weight: 'semibold', muted: true }, label),
    ),
  );

  const dialog = confirming
    ? createElement(
        Dialog,
        {
          id: 'pending-publish-confirm',
          header: `Publicar ${targets.length} ${targets.length === 1 ? 'documento' : 'documentos'}`,
          width: 1,
          onClose: () => setConfirming(false),
          footer: createElement(
            Flex,
            { gap: 2, justify: 'flex-end', padding: 3 },
            createElement(Button, { mode: 'bleed', text: 'Cancelar', onClick: () => setConfirming(false) }),
            createElement(Button, {
              tone: 'positive',
              icon: PublishIcon,
              text: 'Publicar',
              onClick: () => void publishSelected(),
            }),
          ),
        },
        createElement(
          Box,
          { padding: 4 },
          createElement(
            Flex,
            { direction: 'column', gap: 3 },
            createElement(
              Text,
              { size: 1, muted: true },
              'Los cambios se verán en hiweb.com.mx después del siguiente deploy del sitio. En staging ya se ven.',
            ),
            ...targets.map((row) => {
              const label = rowLabel(row);
              const kind = typeTitle(row._type);
              const locale = isEnglish(publishedId(row._id), row.locale) ? 'EN' : 'ES';
              return createElement(
                Text,
                { key: row._id, size: 1 },
                `• ${label} — ${kind === label ? '' : `${kind} · `}${locale}`,
              );
            }),
          ),
        ),
      )
    : null;

  return createElement(
    Flex,
    { direction: 'column', style: { height: '100%' } },
    dialog,
    createElement(
      Card,
      { borderBottom: true, padding: 4 },
      createElement(
        Flex,
        { direction: 'column', gap: 4, style: { maxWidth: MAX_WIDTH, margin: '0 auto', width: '100%' } },
        createElement(
          Flex,
          { align: 'center', justify: 'space-between', gap: 3, wrap: 'wrap' },
          createElement(
            Flex,
            { direction: 'column', gap: 2 },
            createElement(Text, { size: 3, weight: 'semibold' }, 'Pendientes de publicar'),
            createElement(Text, { muted: true, size: 1 }, summary),
          ),
          createElement(
            Flex,
            { gap: 2, align: 'center' },
            createElement(Button, {
              icon: RefreshIcon,
              mode: 'bleed',
              text: 'Actualizar',
              disabled: loading || publishing,
              onClick: () => setReloadToken((token) => token + 1),
            }),
            createElement(Button, {
              icon: publishing ? undefined : PublishIcon,
              tone: 'positive',
              text: publishing
                ? `Publicando ${progress.done} de ${progress.total}…`
                : `Publicar seleccionados (${targets.length})`,
              disabled: targets.length === 0 || publishing,
              onClick: () => setConfirming(true),
            }),
          ),
        ),
        createElement(
          Flex,
          { align: 'center', gap: 2, wrap: 'wrap' },
          createElement(
            Box,
            { flex: 1, style: { minWidth: 220 } },
            createElement(TextInput, {
              icon: SearchIcon,
              placeholder: 'Buscar por nombre, tipo o slug',
              value: query,
              onChange: (event) => setQuery(event.currentTarget.value),
            }),
          ),
          createElement(
            Box,
            { style: { width: 220 } },
            createElement(
              Select,
              { value: type, fontSize: 1, onChange: (event) => setType(event.currentTarget.value) },
              option('all', 'Todo tipo'),
              ...types.map((item) => option(item.name, item.title)),
            ),
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
        ? createElement(
            Card,
            { padding: 4, radius: 2, tone: 'transparent' },
            createElement(
              Text,
              { muted: true, size: 1 },
              rows.length === 0 ? 'Todo está publicado.' : 'Ningún borrador coincide con esos filtros.',
            ),
          )
        : null,
      !loading && !error && visible.length > 0
        ? createElement(
            Flex,
            { direction: 'column', gap: 2, style: { minWidth: 960, maxWidth: MAX_WIDTH, margin: '0 auto' } },
            header,
            ...visible.map((row) =>
              createElement(DraftRowView, {
                key: row._id,
                row,
                schemaType: schema.get(row._type) as SchemaNode | undefined,
                typeTitle: typeTitle(row._type),
                selected: selected.has(row._id),
                validity: validity[row._id] ?? 'validating',
                onToggle,
                onValidity,
              }),
            ),
          )
        : null,
    ),
  );
}

export function pendingTool(): Tool {
  return {
    name: 'pendientes',
    title: 'Pendientes',
    icon: PublishIcon,
    component: PendingTool,
  };
}
