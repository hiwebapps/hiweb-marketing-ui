# Fase 6 — Operación editorial

## Se hace

- CORS en Sanity Manage: `http://localhost:4321`, URL del Worker, `https://hiweb-web.sanity.studio`.
- Token Viewer (`SANITY_API_READ_TOKEN`) para builds.
- Webhook Sanity → `POST /api/sanity-webhook` → Cloudflare Deploy Hook (rebuild de prerender).
- `npm run studio:deploy` **solo** al host `hiweb-web`.
- Checklist editorial: slug, SEO, Publish, imagen con alt.

## No se hace

- Presentation / Visual Editing / stega (fase opcional 6b; ver el otro repo `VISUAL-EDITING.md`).
- Deploy del Studio a `hiweb-marketing`.
- Indexar.

## Checklist editorial

1. Abrir https://hiweb-web.sanity.studio
2. Editar → SEO (título ≤ 70, description ≤ 160) → Publish
3. Esperar el rebuild del Worker (o `npm run deploy`)
4. Verificar la URL en el front (sigue noindex)

## Definition of Done

- Studio hosted apunta a `web-2026`.
- Un publish dispara rebuild **o** queda documentado el deploy manual.
- CORS no bloquea localhost ni el Worker.
