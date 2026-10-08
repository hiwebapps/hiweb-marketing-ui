import { Button, Card, Flex, Text } from '@sanity/ui';
import { useEffect, useState } from 'react';
import { type NavbarProps } from 'sanity';

const STATUS_URL = 'https://hiweb.com.mx/api/rebuild-status';
const STUDIO_HOST = 'hiweb-web.sanity.studio';
const MANIFEST_URL = '/static/create-manifest.json';
/** A deploy's manifest is written at the end of the same build. */
const SAME_DEPLOY_MS = 20 * 60 * 1000;

declare const __HIWEB_STUDIO_BUILT_AT__: string | undefined;

type RebuildStatus = {
  queued: boolean;
  deployAt: string | null;
};

type StudioRelease = {
  createdAt: string;
  schema: string;
};

function builtAt() {
  return typeof __HIWEB_STUDIO_BUILT_AT__ === 'string' ? __HIWEB_STUDIO_BUILT_AT__ : '';
}

function releaseKey() {
  return `hiweb.studioRelease.${builtAt() || 'unknown'}`;
}

function readRelease(): StudioRelease | null {
  try {
    const raw = window.localStorage.getItem(releaseKey());
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StudioRelease;
    if (!parsed.createdAt || !parsed.schema) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeRelease(release: StudioRelease) {
  try {
    window.localStorage.setItem(releaseKey(), JSON.stringify(release));
  } catch {
    // Private browsing can block storage. The next poll checks again.
  }
}

async function fetchRelease(): Promise<StudioRelease | null> {
  const response = await fetch(`${MANIFEST_URL}?t=${Date.now()}`, { cache: 'no-store' });
  if (!response.ok) return null;
  const body = (await response.json()) as {
    createdAt?: string;
    workspaces?: { name?: string; schema?: string }[];
  };
  const workspace =
    body.workspaces?.find((item) => item.name === 'hiweb-web') ?? body.workspaces?.[0];
  if (!body.createdAt || !workspace?.schema) return null;
  return { createdAt: body.createdAt, schema: workspace.schema };
}

function releaseIsStale(remote: StudioRelease) {
  const saved = readRelease();
  if (!saved) {
    const own = Date.parse(builtAt());
    const remoteAt = Date.parse(remote.createdAt);
    if (Number.isFinite(own) && Number.isFinite(remoteAt) && remoteAt - own > SAME_DEPLOY_MS) {
      return true;
    }
    writeRelease(remote);
    return false;
  }
  return saved.schema !== remote.schema || saved.createdAt !== remote.createdAt;
}

function minutesLeft(deployAt: string | null, now: number) {
  if (!deployAt) return 0;
  const remaining = Date.parse(deployAt) - now;
  if (!Number.isFinite(remaining) || remaining <= 0) return 0;
  return Math.ceil(remaining / 60_000);
}

/** The live site keeps building for a few minutes after the queue clears. */
const UPDATE_WINDOW_MS = 6 * 60 * 1000;

function liveSiteMessage(status: RebuildStatus, deployAtMs: number | null, now: number) {
  if (status.queued) {
    const minutes = minutesLeft(status.deployAt, now);
    if (minutes <= 0) {
      return 'La espera terminó. hiweb.com.mx empieza a actualizarse y tarda unos 5 minutos en mostrar los cambios.';
    }
    const label = minutes === 1 ? '1 minuto' : `${minutes} minutos`;
    return `En espera. hiweb.com.mx se actualiza en ${label}. Si publicas otro documento, la espera de 10 minutos vuelve a empezar. Después, el sitio tarda unos 5 minutos en mostrar los cambios.`;
  }
  if (deployAtMs && now < deployAtMs + UPDATE_WINDOW_MS) {
    return 'hiweb.com.mx se está actualizando. En unos minutos se ven los cambios. Recarga esa página con Ctrl+F5.';
  }
  return null;
}

export function StudioNavbar(props: NavbarProps) {
  const [stale, setStale] = useState(false);
  const [status, setStatus] = useState<RebuildStatus | null>(null);
  const [deployAtMs, setDeployAtMs] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let cancelled = false;

    async function tick() {
      if (window.location.hostname === STUDIO_HOST) {
        try {
          const remote = await fetchRelease();
          if (!cancelled && remote) setStale(releaseIsStale(remote));
        } catch {
          // A failed manifest check leaves the current banner as it is.
        }
      }
      try {
        const response = await fetch(STATUS_URL);
        if (!response.ok) throw new Error(`status ${response.status}`);
        const body = (await response.json()) as RebuildStatus;
        if (!cancelled) {
          const next = { queued: Boolean(body.queued), deployAt: body.deployAt ?? null };
          setStatus(next);
          const at = Date.parse(next.deployAt ?? '');
          if (Number.isFinite(at)) setDeployAtMs(at);
        }
      } catch {
        // A failed status check keeps the last message.
      }
    }

    void tick();
    const poll = window.setInterval(() => void tick(), 30_000);
    const clock = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => {
      cancelled = true;
      window.clearInterval(poll);
      window.clearInterval(clock);
    };
  }, []);

  const liveMessage = status ? liveSiteMessage(status, deployAtMs, now) : null;

  return (
    <Flex direction="column">
      {stale ? (
        <Card padding={3} tone="caution" radius={0}>
          <Flex align="center" justify="space-between" gap={3}>
            <Text size={1} weight="semibold">
              Hay una versión nueva de Studio. Recarga esta página antes de seguir editando, para que los cambios se guarden.
            </Text>
            <Button text="Recargar" mode="ghost" onClick={() => window.location.reload()} />
          </Flex>
        </Card>
      ) : null}
      {liveMessage ? (
        <Card padding={3} tone="primary" radius={0}>
          <Text size={1}>{liveMessage}</Text>
        </Card>
      ) : null}
      {props.renderDefault(props)}
    </Flex>
  );
}
