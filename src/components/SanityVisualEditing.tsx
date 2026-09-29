import type { ClientPerspective } from '@sanity/client';
import { perspectiveCookieName } from '@sanity/preview-url-secret/constants';
import { VisualEditing, type HistoryAdapter, type HistoryUpdate } from '@sanity/visual-editing/react';
import { useEffect, useMemo, useRef, useState } from 'react';

function isFramed() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

function serializePerspective(perspective: ClientPerspective) {
  return typeof perspective === 'string' ? perspective : JSON.stringify(perspective);
}

function readCookie(name: string) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function writePerspectiveCookie(perspective: ClientPerspective) {
  const next = serializePerspective(perspective);
  if (readCookie(perspectiveCookieName) === next) return false;
  const secure = window.location.protocol === 'https:';
  document.cookie = `${perspectiveCookieName}=${encodeURIComponent(next)}; path=/; SameSite=${secure ? 'None' : 'Lax'}${secure ? '; Secure' : ''}`;
  return true;
}

function currentUrl() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function applyHistoryUpdate(update: Pick<HistoryUpdate, 'type' | 'url'>) {
  const current = window.location.href;
  if (update.type === 'push' && current !== update.url) window.location.assign(update.url);
  if (update.type === 'replace' && current !== update.url) window.location.replace(update.url);
  if (update.type === 'pop') window.history.back();
}

export default function SanityVisualEditing() {
  type Navigate = Parameters<HistoryAdapter['subscribe']>[0];
  const navigateRef = useRef<Navigate | undefined>(undefined);
  const lastUrlRef = useRef('');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(isFramed());
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const sync = () => {
      const url = currentUrl();
      if (url === lastUrlRef.current) return;
      lastUrlRef.current = url;
      navigateRef.current?.({ type: 'push', title: document.title, url });
    };

    sync();
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;
    window.history.pushState = function pushState(...args) {
      originalPush.apply(window.history, args);
      sync();
    };
    window.history.replaceState = function replaceState(...args) {
      originalReplace.apply(window.history, args);
      sync();
    };

    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
    };
  }, [enabled]);

  const history = useMemo<HistoryAdapter>(
    () => ({
      subscribe: (navigate) => {
        navigateRef.current = navigate;
        const url = currentUrl();
        lastUrlRef.current = url;
        navigate({ type: 'push', title: document.title, url });
        return () => {
          if (navigateRef.current === navigate) navigateRef.current = undefined;
        };
      },
      update: (update) => {
        applyHistoryUpdate(update);
      },
    }),
    [],
  );

  if (!enabled) return null;

  return (
    <VisualEditing
      history={history}
      portal
      onPerspectiveChange={(perspective) => {
        if (writePerspectiveCookie(perspective)) window.location.reload();
      }}
      refresh={() =>
        new Promise((resolve) => {
          window.location.reload();
          resolve();
        })
      }
    />
  );
}
