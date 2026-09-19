# Cutover SEO (NO INDEX until ready)

El front se queda **noindex** hasta que cada ítem abajo esté hecho y alguien active el flag a propósito.

## Durante la migración (ahora)

- `PUBLIC_SITE_INDEXABLE` unset o `false` en todos los entornos.
- `robots.txt` → `Disallow: /`
- Meta robots + `X-Robots-Tag` vía `src/lib/seo.ts`, middleware y `public/_headers`
- El sitio indexable sigue siendo el live actual (Webflow / dominio de producción), no este Worker.
- Sitemap interno: `/sitemap.xml` (no enlazado desde robots).
- En cutover, borrar o vaciar `public/_headers` (el header estático no lee el flag).

## Pre-cutover QA

- [ ] URLs de industrias, servicios, casos, blog, nosotros, contacto → 200
- [ ] Title + meta description por página (grupo SEO o fallback)
- [ ] Forms de contacto
- [ ] Studio `hiweb-web` con schemas de `web-2026`
- [ ] Worker en Cloudflare con env de producción
- [ ] Aprobación explícita de go-live

## Orden de cutover (no reordenar)

1. Poner el dominio vivo en el Worker.
2. Setear **solo** en ese host: `PUBLIC_SITE_INDEXABLE=true`
3. Confirmar `robots.txt` → `Allow: /` + Sitemap
4. Confirmar HTML sin noindex y con canonical
5. Enviar sitemap en Search Console

## Rollback

1. `PUBLIC_SITE_INDEXABLE=false` de inmediato
2. DNS de vuelta al origen anterior si hace falta
