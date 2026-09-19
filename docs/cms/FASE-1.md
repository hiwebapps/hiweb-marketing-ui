# Fase 1 — Cloudflare (mismo diseño, otro runtime)

## Se hace

- Instalar `@astrojs/cloudflare`.
- `output: 'server'` + `export const prerender = true` en páginas públicas.
- `wrangler.jsonc` con `nodejs_compat`.
- Scripts `deploy` / `preview` de Wrangler.
- Middleware `X-Robots-Tag` (el header ya no depende solo de `vercel.json`).
- GSAP: `vite.ssr.noExternal: ['gsap']`.
- Dejar el proyecto Vercel intacto hasta que el Worker responda.

## No se hace

- Rediseño.
- KV SESSION ni Cloudflare Images (Presentation).
- Apagar Vercel el mismo día.
- SSR de las páginas de marketing (peor TTFB/SEO).
- Indexar el `*.workers.dev`.

## Comandos

```bash
npm run build
npx wrangler login   # una vez
npm run deploy
```

## Definition of Done

- `npm run build` genera `dist/` con adapter Cloudflare.
- Páginas de marketing salen prerendered.
- El header noindex sigue activo.
