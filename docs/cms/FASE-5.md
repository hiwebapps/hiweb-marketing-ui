# Fase 5 — SEO técnico (sigue noindex)

## Se hace

- `shouldNoIndex(hostname)` + `PUBLIC_SITE_INDEXABLE` (default false).
- `robots.txt` dinámico: `Disallow: /` mientras el flag esté off.
- `sitemap.xml` para QA interna; **no** se enlaza en robots hasta cutover.
- Meta title/description/canonical/OG desde el grupo SEO, con fallback al copy.
- JSON-LD existente + `og:image` real (no favicon como default de página).
- Alt obligatorio en schemas de imagen.
- Middleware `X-Robots-Tag` en todas las respuestas noindex.

## No se hace

- `Allow: /` en robots.
- Search Console.
- Quitar noindex de Layout mientras el flag sea false.
- Indexar `*.workers.dev`, previews o Vercel.

## Definition of Done

- `curl` a `/robots.txt` muestra `Disallow: /`.
- HTML incluye `noindex`.
- Sitemap responde 200 pero no está anunciado a crawlers.
