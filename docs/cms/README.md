# CMS + Cloudflare — Hiweb Marketing (sitio actual)

Este sitio **no replica Webflow**. El diseño y las secciones React se quedan. Sanity alimenta el copy, las listas y las imágenes. El front se sirve en Cloudflare Workers. El Studio vive en un host propio (`hiweb-web`) para no pisar [hiweb-marketing.sanity.studio](https://hiweb-marketing.sanity.studio).

## Arquitectura

- Sanity project `fxardjr1`, dataset `web-2026` (no `production`).
- Studio hosted: `https://hiweb-web.sanity.studio`.
- Front: este repo → Cloudflare Worker `hiweb-marketing-ui`. Vercel ya no se usa.
- Páginas públicas **prerender** (HTML estático). SSR solo para `robots.txt`, `sitemap.xml` y el webhook.
- Indexación **apagada** hasta [CUTOVER-SEO.md](./CUTOVER-SEO.md).

## Fases

| Fase | Doc | Estado |
|------|-----|--------|
| 0 Contrato | [FASE-0.md](./FASE-0.md) | Docs + env |
| 1 Cloudflare | [FASE-1.md](./FASE-1.md) | Adapter + wrangler |
| 2 Schemas | [FASE-2.md](./FASE-2.md) | Studio + content model |
| 3 Semilla | [FASE-3.md](./FASE-3.md) | Import desde JSON/MD |
| 4 Front | [FASE-4.md](./FASE-4.md) | Queries + páginas |
| 5 SEO | [FASE-5.md](./FASE-5.md) | Flag noindex, sitemap, OG |
| 6 Ops | [FASE-6.md](./FASE-6.md) | CORS, webhook, studio deploy |
| 7 Cutover | [FASE-7.md](./FASE-7.md) | **Bloqueada** |

## Env vars

Ver [`.env.example`](../../.env.example). Nunca commitear tokens.

Operación editorial (CORS, webhook, studio): [OPS.md](./OPS.md).

## Qué no se hace nunca en este track

- Cambiar el diseño actual.
- Traer page builders (`splitHero`, `splitTabs`, etc.).
- i18n ES/EN.
- Indexar `*.workers.dev`, previews o `hiweb-marketing-ui.vercel.app`.
- `sanity deploy` al host `hiweb-marketing`.
