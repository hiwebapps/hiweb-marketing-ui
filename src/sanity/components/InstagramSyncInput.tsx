import { useState } from 'react';
import { Badge, Button, Card, Flex, Stack, Text } from '@sanity/ui';
import { useToast } from '@sanity/ui/toast';
import { set, useClient, useFormValue, type StringInputProps } from 'sanity';

function cleanInstagramHandle(raw: string): string {
  if (!raw) return '';
  let u = raw.trim();
  u = u.replace(/^(?:https?:\/\/)?(?:www\.)?instagram\.com\//i, '');
  u = u.split('?')[0].split('#')[0];
  u = u.replace(/^\/+|\/+$/g, '').replace(/^@+/, '').trim();
  return u;
}

export function InstagramSyncInput(props: StringInputProps) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const client = useClient({ apiVersion: '2026-09-18' });
  const rawDoc = (useFormValue as unknown as (path: string[]) => unknown)([]) as {
    _id?: string;
    cutoffDate?: string;
    customPostUrls?: string[];
  } | undefined;

  const rawId = rawDoc?._id;
  const documentId = rawId ? rawId.replace(/^drafts\./, '') : undefined;
  const rawValue = typeof props.value === 'string' ? props.value : '';
  const username = cleanInstagramHandle(rawValue);
  const cutoffDate = rawDoc?.cutoffDate;
  const customPostUrls = Array.isArray(rawDoc?.customPostUrls)
    ? rawDoc.customPostUrls.filter((u) => typeof u === 'string' && u.trim().length > 0)
    : [];

  const isCustomUrls = customPostUrls.length > 0;
  const isCutoff = Boolean(cutoffDate);

  async function handleSync() {
    if (!username) {
      toast.push({
        status: 'warning',
        title: 'Usuario requerido',
        description: 'Escribe el usuario de Instagram (ej. el.secretomx) antes de sincronizar.',
      });
      return;
    }

    if (props.onChange && rawValue !== username) {
      props.onChange(set(username));
    }

    setLoading(true);

    try {
      let apiOrigin = 'http://localhost:4322';

      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const port = window.location.port;

        if (hostname.includes('sanity.studio')) {
          apiOrigin = 'https://www.hiwebmarketing.com';
        } else if (port === '3333' || hostname === 'localhost' || hostname === '127.0.0.1') {
          apiOrigin = 'http://localhost:4322';
          try {
            const probe = await fetch('http://localhost:4322/api/sync-instagram', { method: 'OPTIONS' });
            if (probe.status !== 204 && !probe.ok) throw new Error();
          } catch {
            apiOrigin = 'http://localhost:4321';
          }
        } else {
          apiOrigin = window.location.origin;
        }
      }

      const effectiveId = documentId || `brand-${username.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}`;

      const response = await fetch(`${apiOrigin}/api/sync-instagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${client.config().token ?? ''}`,
        },
        body: JSON.stringify({
          username,
          documentId: effectiveId,
          untilDate: cutoffDate || undefined,
          postUrls: isCustomUrls ? customPostUrls : undefined,
        }),
      });

      const text = await response.text();
      let data: {
        success?: boolean;
        error?: string;
        count?: number;
        bio?: string;
      };

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Respuesta inesperada (${response.status}): ${text.slice(0, 120) || 'El servidor Astro no respondió en ' + apiOrigin + '.'}`
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al conectar con la API de sincronización.');
      }

      toast.push({
        status: 'success',
        title: '¡Sincronización completada!',
        description: isCustomUrls
          ? `Se importaron ${data.count ?? 0} publicaciones específicas desde las URLs proporcionadas.`
          : isCutoff
            ? `Se importaron ${data.count ?? 0} publicaciones anteriores al ${cutoffDate}.`
            : `Se importaron ${data.count ?? 0} publicaciones recientes, avatar y biografía.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.push({
        status: 'error',
        title: 'No se pudo sincronizar',
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Flex direction="column" gap={3}>
      {props.renderDefault(props)}
      <Card padding={3} tone="transparent" radius={2} border>
        <Stack space={3}>
          <Flex align="center" justify="space-between" gap={3} wrap="wrap">
            <Stack space={2}>
              <Flex align="center" gap={2}>
                <Text size={1} weight="semibold">
                  Sincronizador Inteligente
                </Text>
                {isCustomUrls ? (
                  <Badge tone="positive" fontSize={0}>
                    {customPostUrls.length} URLs directas
                  </Badge>
                ) : isCutoff ? (
                  <Badge tone="caution" fontSize={0}>
                    Hasta {cutoffDate}
                  </Badge>
                ) : (
                  <Badge tone="default" fontSize={0}>
                    Últimos posts
                  </Badge>
                )}
              </Flex>
              <Text size={1} muted>
                {loading
                  ? isCustomUrls
                    ? `Descargando ${customPostUrls.length} publicaciones específicas y subiendo multimedia a Sanity...`
                    : isCutoff
                      ? `Filtrando publicaciones anteriores a ${cutoffDate} y subiendo multimedia...`
                      : 'Consultando Instagram y subiendo imágenes a Sanity...'
                  : isCustomUrls
                    ? `Importará exactamente las ${customPostUrls.length} publicaciones pegadas en el campo de URLs abajo.`
                    : isCutoff
                      ? `Solo importará publicaciones hechas antes de ${cutoffDate} (descartando contenido posterior).`
                      : 'Descarga perfil, avatar y las 12 publicaciones más recientes automáticamente.'}
              </Text>
            </Stack>

            <Button
              tone={isCustomUrls ? 'positive' : isCutoff ? 'caution' : 'primary'}
              mode="ghost"
              loading={loading}
              disabled={loading || !username}
              onClick={handleSync}
              text={
                loading
                  ? 'Sincronizando...'
                  : isCustomUrls
                    ? `⚡ Sincronizar ${customPostUrls.length} URLs`
                    : isCutoff
                      ? `⚡ Sincronizar hasta ${cutoffDate}`
                      : '⚡ Sincronizar Instagram'
              }
            />
          </Flex>

          {!isCustomUrls && !isCutoff && (
            <Text size={0} muted style={{ borderTop: '1px solid var(--card-border-color)', paddingTop: 6 }}>
              💡 <em>Para clientes inactivos: Llena el campo <strong>Fecha de fin de gestión</strong> o pega <strong>URLs específicas</strong> abajo antes de hacer clic en sincronizar.</em>
            </Text>
          )}
        </Stack>
      </Card>
    </Flex>
  );
}
