import { useState } from 'react';
import { Button, Card, Flex, Text } from '@sanity/ui';
import { useToast } from '@sanity/ui/toast';
import { useFormValue, type StringInputProps } from 'sanity';

export function InstagramSyncInput(props: StringInputProps) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const rawDoc = (useFormValue as unknown as (path: string[]) => unknown)([]) as { _id?: string } | undefined;
  const rawId = rawDoc?._id;
  // Clean draft prefix if present, or generate UUID if brand new unsaved doc
  const documentId = rawId ? rawId.replace(/^drafts\./, '') : undefined;
  const username = typeof props.value === 'string' ? props.value.trim().replace(/^@/, '') : '';

  async function handleSync() {
    if (!username) {
      toast.push({
        status: 'warning',
        title: 'Usuario requerido',
        description: 'Escribe el usuario de Instagram (ej. el.secretomx) antes de sincronizar.',
      });
      return;
    }

    setLoading(true);

    try {
      // Determine origin: local Astro dev server (4322), proxy, or remote staging
      let apiOrigin = 'http://localhost:4322';

      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const port = window.location.port;

        if (hostname.includes('sanity.studio')) {
          apiOrigin = 'https://staging.hiweb.com.mx';
        } else if (port === '3333' || hostname === 'localhost' || hostname === '127.0.0.1') {
          // Local Sanity Studio runs on 3333, Astro API runs on 4322 (fallback 4321)
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

      // Generate a fallback documentId if creating brand new document before first save
      const effectiveId = documentId || `brand-${username.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}`;

      const response = await fetch(`${apiOrigin}/api/sync-instagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          documentId: effectiveId,
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
          `Respuesta inesperada (${response.status}): ${text.slice(0, 120) || 'El servidor Astro no respondió en ' + apiOrigin + '. Verifica que el servidor de desarrollo esté activo con astro dev.'}`
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al conectar con la API de sincronización.');
      }

      toast.push({
        status: 'success',
        title: '¡Sincronización completada!',
        description: `Se importaron ${data.count ?? 0} publicaciones, avatar y biografía correctamente.`,
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
      <Card padding={2} tone="transparent" radius={2} border>
        <Flex align="center" justify="space-between" gap={3}>
          <Text size={1} muted>
            {loading ? 'Consultando Instagram y subiendo imágenes a Sanity...' : 'Descarga perfil, avatar y últimas 12 publicaciones automáticamente.'}
          </Text>
          <Button
            tone="primary"
            mode="ghost"
            loading={loading}
            disabled={loading || !username}
            onClick={handleSync}
            text={loading ? 'Sincronizando...' : '⚡ Sincronizar Instagram'}
          />
        </Flex>
      </Card>
    </Flex>
  );
}
