# Fase 7 — Cutover e index (BLOQUEADA)

Esta fase **no se ejecuta** hasta que el diseño+CMS estén listos y alguien lo pida explícito.

Ver [CUTOVER-SEO.md](./CUTOVER-SEO.md).

## Se hace (solo entonces)

- DNS del dominio vivo al Worker.
- `PUBLIC_SITE_INDEXABLE=true` **solo** en el host `www.hiwebmarketing.com`.
- robots `Allow: /` + línea Sitemap.
- Enviar sitemap a Search Console.

## No se hace

- Indexar staging / `*.workers.dev`.
- Indexar `hiweb-marketing-ui.vercel.app`.
- Activar el flag “para probar”.
