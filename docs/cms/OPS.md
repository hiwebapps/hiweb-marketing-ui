# Operación — CORS, Studio y webhook

Complemento de [FASE-6.md](./FASE-6.md).

## CORS (Sanity Manage → API → CORS origins)

Añadir con *Allow credentials*:

- `http://localhost:4321`
- `http://localhost:3333`
- `https://hiweb-web.sanity.studio`
- URL del Worker (`https://hiweb-marketing-ui.<account>.workers.dev`)
- Dominio vivo, cuando exista

## Env del Worker

Después de crear `web-2026`, añadir (Dashboard o `wrangler secret`):

- `PUBLIC_SANITY_PROJECT_ID=fxardjr1`
- `PUBLIC_SANITY_DATASET=web-2026`
- `SANITY_API_READ_TOKEN` (secret)
- `PUBLIC_SITE_INDEXABLE=false` (ya va en `wrangler.jsonc`)

Sin esas vars públicas, el build usa `src/content/` como fallback.

| Token | Uso |
|-------|-----|
| Viewer | `SANITY_API_READ_TOKEN` en el Worker / build |
| Editor | `SANITY_API_WRITE_TOKEN` solo local, para `npm run sanity:seed:write` |

## Studio hosted

```bash
npm run studio:deploy
```

`sanity.cli.ts` fija `studioHost: 'hiweb-web'`. **Nunca** desplegar al host `hiweb-marketing`.

## Webhook de rebuild (Worker only)

El hook de Sanity ya apunta a `https://hiweb-marketing-ui.hiwebapps.workers.dev/api/sanity-webhook`. Falta el Deploy Hook de Cloudflare:

1. [dash.cloudflare.com](https://dash.cloudflare.com) → cuenta `web@hiwebmarketing.com`.
2. **Workers & Pages** → `hiweb-marketing-ui` → **Settings** → **Build**.
3. **Connect** el repo GitHub `jahirgosu/hiweb-marketing-ui` (autorizar la GitHub App de Cloudflare si pide).
4. Production branch: **`master`** (no `main`).
5. Build: `npm run build` · Deploy: `npx wrangler deploy` · Root: `/`.
6. Env de build: `PUBLIC_SITE_INDEXABLE=false`, `PUBLIC_SANITY_PROJECT_ID=fxardjr1`, `PUBLIC_SANITY_DATASET=web-2026`, `PUBLIC_SITE_URL=https://hiweb-marketing-ui.hiwebapps.workers.dev`, `SANITY_API_READ_TOKEN` (secret, viewer).
7. Cuando el primer build pase: **Settings → Deploy Hooks → Create hook** → copiar la URL.
8. `echo <URL> | npx wrangler secret put CLOUDFLARE_DEPLOY_HOOK_URL`

Filter del webhook Sanity: `_type in ["industry","service","caseStudy","post","homePage","aboutPage","siteSettings","person","landingPage","faq"]`.

Sin Deploy Hook, el publish llega al Worker pero **no** regenera el HTML prerendered.

## Checklist editorial

- [ ] Slug estable (no cambiar URLs publicadas a la ligera)
- [ ] SEO: título ≤ 70, description ≤ 160
- [ ] Imagen con alt
- [ ] Publish (no dejar en draft)
- [ ] Verificar la URL en el Worker (sigue noindex)
