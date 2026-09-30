/**
 * Merges published Sanity redirects into the Astro build.
 * A new redirect reaches the site on the next deploy. Fetch failures
 * leave the static redirects in astro.config.mjs in place.
 */
export function sanityRedirects() {
  return {
    name: 'sanity-redirects',
    hooks: {
      'astro:config:setup': async ({ updateConfig, config }) => {
        const query = '*[_type == "redirect" && defined(from) && defined(to)]{ from, to }';
        const url = `https://fxardjr1.api.sanity.io/v2026-09-18/data/query/web-2026?query=${encodeURIComponent(query)}`;
        try {
          const response = await fetch(url);
          if (!response.ok) return;
          const json = await response.json();
          const extra = {};
          for (const row of json.result ?? []) {
            if (
              typeof row.from === 'string' &&
              row.from.startsWith('/') &&
              !row.from.startsWith('//') &&
              typeof row.to === 'string' &&
              row.to.startsWith('/') &&
              !row.to.startsWith('//') &&
              row.from !== row.to
            ) {
              extra[row.from] = row.to;
            }
          }
          if (Object.keys(extra).length === 0) return;
          updateConfig({ redirects: { ...(config.redirects ?? {}), ...extra } });
        } catch (error) {
          console.warn('No se pudieron leer las redirecciones de Sanity.', error);
        }
      },
    },
  };
}
