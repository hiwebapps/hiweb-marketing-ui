# Fase 2 — Studio + schemas

## Se hace

- Paquetes: `sanity`, `@sanity/astro`, `@sanity/client`, `@sanity/image-url`, `@sanity/vision`, `groq`, `astro-portabletext`.
- `sanity.config.ts` + `sanity.cli.ts` con `studioHost: 'hiweb-web'`.
- Schemas alineados a `src/content.config.ts` y `src/data/site.ts` (sin page builder).
- Structure en español: Sitio, Home, Industrias, Servicios, Casos, Blog, Equipo.
- Dataset `web-2026`.
- TypeGen (`sanity-typegen.json` + `npm run sanity:typegen`).
- Grupo SEO reutilizable en documentos de página.

## No se hace

- `sanity deploy` al host `hiweb-marketing`.
- Page builder / bloques Webflow.
- `@sanity/document-internationalization`.
- Studio embebido en `/admin`.
- Mezclar documentos del dataset `production`.

## Comandos

```bash
npx sanity login
npx sanity dataset create web-2026 --visibility public
npx sanity schema deploy
npm run sanity:typegen
npm run studio          # http://localhost:3333
```

El CLI debe estar autenticado contra el proyecto `fxardjr1`. Sin membresía, `dataset create` falla (Unauthorized).

## Definition of Done

- Studio abre contra `web-2026`.
- Los tipos coinciden con industrias, servicios, casos, posts, settings, home, about, people.
