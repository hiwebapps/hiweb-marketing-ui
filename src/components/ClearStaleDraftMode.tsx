import { perspectiveCookieName } from '@sanity/preview-url-secret/constants';
import { useEffect } from 'react';

function isFramed() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

function hasDraftCookie() {
  return document.cookie.split('; ').some((part) => part.startsWith(`${perspectiveCookieName}=`));
}

/** Drops a leftover Presentation cookie when the staging site is opened outside Studio. */
export default function ClearStaleDraftMode() {
  useEffect(() => {
    if (isFramed() || !hasDraftCookie()) return;
    void fetch('/api/draft-mode/disable?silent=1', {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    }).then((response) => {
      if (response.ok) window.location.reload();
    });
  }, []);

  return null;
}
