# Fase 4 — Conectar páginas (diseño congelado)

## Se hace

- `src/sanity/queries.ts` con `defineQuery` y proyecciones (nunca `*`).
- Mappers a las props actuales de las secciones.
- Loader `src/lib/content/` como única puerta: Sanity si hay projectId, si no collections.
- Orden: settings → servicios → industrias → casos → blog → home/nosotros.
- Imágenes: `urlFor().width().auto('format')`.
- Blog: Portable Text con `astro-portabletext`; TOC desde bloques h2/h3.

## No se hace

- Cambiar CSS/markup de secciones.
- Meter GROQ dentro de componentes React.
- Hardcodear Picsum nuevos.
- Mezclar `getCollection` y fetch Sanity en la misma página (el loader encapsula el fallback).

## Definition of Done

- Las URLs actuales renderizan el mismo diseño.
- Con dataset vacío/sin token, el build sigue usando `src/content/`.
