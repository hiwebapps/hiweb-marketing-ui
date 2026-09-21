# Hiweb Marketing UI

Sitio Astro + React de Hiweb. El diseño vive en este repo. El copy, las imágenes y las listas se editan en Sanity (`web-2026`) y el HTML se sirve en Cloudflare Workers.

Guía para retomar el proyecto en otra máquina o en otra cuenta de Cursor.

## URLs

| Qué | Dónde |
|-----|--------|
| Repo | https://github.com/hiwebapps/hiweb-marketing-ui |
| Rama | `master` |
| Sitio (noindex) | https://hiweb-marketing-ui.hiwebapps.workers.dev |
| Studio | https://hiweb-web.sanity.studio |
| Proyecto Sanity | `fxardjr1` · dataset `web-2026` |
| Worker | `hiweb-marketing-ui` |

No uses el Studio `hiweb-marketing` ni el dataset `production`. Ese es el sitio viejo.

## Qué necesitas antes de codear

1. Node `>= 22.12`.
2. Acceso de GitHub a `hiwebapps/hiweb-marketing-ui` (lectura y push a `master`, o una rama propia).
3. Invitación al proyecto Sanity `fxardjr1` (rol Editor o Administrator si vas a escribir contenido o desplegar Studio).
4. Acceso a la cuenta de Cloudflare del Worker (`web@hiwebmarketing.com`) si vas a desplegar.

Pide los tokens por un canal privado. No van en git.

## Arranque

```sh
git clone https://github.com/hiwebapps/hiweb-marketing-ui.git
cd hiweb-marketing-ui
npm install
copy .env.example .env
```

En macOS/Linux: `cp .env.example .env`.

Abre la carpeta en Cursor. Las reglas del repo están en `AGENTS.md` y `CLAUDE.md`.

```sh
npm run dev
```

El sitio queda en http://localhost:4321. En Cursor, si el agente levanta el server, el comando del repo es `astro dev --background`.

Sin tokens el front sigue funcionando: las páginas prerender usan `src/content/` si Sanity no responde.

## Tokens (`.env`)

Copia `.env.example` a `.env`. Los IDs públicos ya vienen puestos. Completa solo los secretos.

| Variable | Quién la crea | Para qué |
|----------|----------------|----------|
| `SANITY_API_READ_TOKEN` | [sanity.io/manage](https://www.sanity.io/manage) → proyecto `fxardjr1` → API → Tokens. Rol **Viewer**. | Build y lecturas del dataset publicado. |
| `SANITY_API_WRITE_TOKEN` | Mismo lugar. Rol **Editor**. | Scripts `sanity:*:write`. No lo subas al Worker. |
| `SANITY_REVALIDATE_SECRET` | Un string largo que acuerden. | Header `Authorization: Bearer` del webhook `/api/sanity-webhook`. |
| `CLOUDFLARE_DEPLOY_HOOK_URL` | Cloudflare → Worker `hiweb-marketing-ui` → Settings → Deploy hooks. | Rebuild al publicar en Sanity. |
| `GITHUB_DISPATCH_TOKEN` | GitHub → Settings → Developer settings → fine-grained PAT con `contents` y `actions` sobre este repo. | Rebuild de respaldo si no hay Deploy Hook. |

`PUBLIC_SITE_INDEXABLE` se queda en `false` hasta el cutover. Ver `docs/cms/CUTOVER-SEO.md`.

Login de CLIs (una vez por máquina, con la cuenta que tenga acceso):

```sh
npx sanity login
npx wrangler login
```

`sanity login` abre el navegador. La cuenta tiene que ser miembro de `fxardjr1`. `wrangler login` tiene que ser la cuenta que posee el Worker `hiweb-marketing-ui`.

## Comandos

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Astro en local |
| `npm run studio` | Studio local en http://localhost:3333 |
| `npm run build` | Build de producción a `dist/` |
| `npm run deploy` | Build + `wrangler deploy` |
| `npm run studio:deploy` | Publica el schema en **hiweb-web** |

Deploy del Worker conservando secrets ya cargados:

```sh
npx astro build
npx wrangler deploy --keep-vars
```

`--keep-vars` evita borrar `SANITY_API_READ_TOKEN` y el resto de secrets del Worker.

## Reglas que no se saltan

- `PUBLIC_SITE_INDEXABLE` sigue en `false`. No indexar `*.workers.dev`.
- `npm run studio:deploy` solo va a `hiweb-web` (`sanity.cli.ts` lo fija). Nunca al host `hiweb-marketing`.
- No commitear `.env`, tokens ni `dist/`.
- El diseño de las secciones no se rediseña al pasar copy. El contenido entra en los campos que ya existen.
- Rama de trabajo: `master`.

## Dónde está el contenido

- Home en Studio: pestañas **Hero, Pilares, Servicios, Industrias, Testimonios, Proceso, Métricas, FAQ, SEO**. En Hero se eligen y ordenan los casos del carrusel. En Servicios se elige el orden y se puede sobreescribir el tagline.
- Casos reales del portafolio: documentos `caseStudy` y fallback en `src/content/casos/`.
- Servicios: documentos `service` y `src/content/servicios/`.
- Blog: documentos `post` (dataset `web-2026`).

Si las listas de selección de la Home están vacías, el sitio muestra todos los casos, servicios o industrias. Para precargarlas (hace falta `SANITY_API_WRITE_TOKEN`):

```sh
npm run sanity:migrate-home-sections
npm run sanity:migrate-home-sections:write
```

El primer comando solo imprime. El segundo escribe.

## Mapa del repo

```text
src/pages/            rutas
src/components/       secciones React
src/sanity/schemas/   modelo del Studio
src/sanity/queries.ts GROQ
src/lib/content/      Sanity con fallback a src/content
src/content/          JSON/MD de respaldo
src/data/             copy curado de Webflow (home, servicios, casos)
scripts/sanity/       escritura al dataset
docs/cms/             contrato, fases y operación
```

Operación (CORS, webhook, checklist editorial): [docs/cms/OPS.md](docs/cms/OPS.md). Índice del CMS: [docs/cms/README.md](docs/cms/README.md).
