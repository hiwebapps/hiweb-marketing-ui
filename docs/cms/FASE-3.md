# Fase 3 — Semilla desde el contenido actual

## Se hace

- Script `scripts/sanity/seed-from-collections.mjs`.
- Lee `src/content/**`, `src/data/site.ts` e `industryServices.ts`.
- Dry-run por defecto; `--write` publica en `web-2026`.
- Sube imágenes locales de `/public/images` como assets Sanity (alt + hotspot).
- IDs estables: `industry-manufactura`, `service-seo`, `case-pulse`, etc.

## No se hace

- Scrape Webflow.
- Importar posts/servicios del dataset `production`.
- Borrar `src/content/` todavía (el front puede caer a collections si Sanity no responde).

## Comandos

```bash
npm run sanity:seed          # dry-run
npm run sanity:seed -- --write
```

Requiere `SANITY_API_WRITE_TOKEN` (Editor o Admin) en `.env`.

## Definition of Done

- Dry-run lista documentos sin escribir.
- `--write` deja el dataset con el mismo copy que el JSON/MD actual.
