# Plantilla Astro + Sanity a partir de Hiweb

Especificación. No es un repo nuevo. Sirve para extraer, más adelante, una base para el siguiente cliente sin arrastrar el copy, los casos ni la migración desde Webflow.

Antes de copiar un módulo, hay que cerrar los hallazgos que se citan. Si se copia tal cual, el cliente hereda el bug.

## Tres cubetas

### Núcleo

Entra en todo proyecto. Hay que parametrizarlo, no reescribirlo.

| Pieza | De dónde sale | Arreglar antes de copiar |
| --- | --- | --- |
| Layout, meta, canonical, Open Graph | `src/layouts/Layout.astro`, `src/lib/seo.ts`, `src/lib/page-meta.ts` | S-01 y S-02: un solo origen, y el `_headers` de noindex no puede quedar fijo |
| JSON-LD | `src/lib/schema.ts` | S-09: el artículo no puede ir como `og:type=website` |
| Sitemap y robots | `src/pages/sitemap.xml.ts`, `src/pages/robots.txt.ts` | S-03: el sitemap tiene que salir de las rutas reales, incluidos los idiomas |
| Flag de indexación | `src/lib/seo.ts`, `wrangler.jsonc`, `public/_headers` | S-01 |
| Idioma ES/EN | `src/lib/locale.ts`, `src/middleware.ts`, páginas `en/` | S-05 y S-06: una sola fuente para el par, y el middleware no puede mandar un CTA a la home |
| Cliente Sanity y fallback | `src/sanity/client.ts`, `src/lib/content/index.ts` | A-01: el fallback tiene que existir también para el segundo idioma, o el segundo idioma no se prerenderiza si Sanity cae |
| Queries | `src/sanity/queries.ts` | C-02 y A-02: no pedir campos que el schema ya no tiene |
| Page builder | `src/components/content/SectionRenderer.astro`, `src/sanity/schemas/blocks/pageSections.ts` | C-03: tipar los miembros con `defineArrayMember` para que `tsc` pase |
| Redirects del CMS | `integrations/sanity-redirects.mjs` | B-04: un redirect no puede tapar una ruta que ya tiene página, o el build debe avisarlo |
| Draft mode y staging SSR | `src/pages/api/draft-mode/*`, `stagingSsr()` en `astro.config.mjs`, `src/middleware.ts` | G-05: el redirect de salida tiene que ser relativo |
| Webhook y cola de rebuild | `src/pages/api/sanity-webhook.ts`, `src/lib/rebuild/*`, cron de `wrangler.jsonc` | A-07 y G-03: el repo de dispatch es un parámetro, y el POST de estado no acepta cualquier token de Sanity |
| UI y primitives | `src/components/ui/*`, `src/components/sections/primitives/*` | D-04: el kit que se documenta tiene que ser el que las páginas usan |
| Tokens | `src/styles/global.css` | D-02: no copiar `tailwind.config.js`; Tailwind v4 lee `@theme` |
| Deploy a dos Workers | `.github/workflows/deploy-worker.yml`, `deploy-staging.yml`, `wrangler.jsonc` | G-10: `permissions: contents: read` y acciones fijadas a un SHA |

### Módulos opcionales

Se encienden por cliente. Cada uno debe poder quitarse sin romper el núcleo.

| Módulo | Archivos | Depende de | Arreglar antes |
| --- | --- | --- | --- |
| Blog | `post` schema, `src/pages/blog`, `src/pages/en/blogs`, Portable Text, tablas | núcleo, personas | S-06, S-09 |
| Portafolio | `caseStudy`, `src/pages/portafolio` | servicios e industrias | A-05: hoy el caso está fijo en español |
| Servicios | `service`, `serviceSections`, `src/pages/servicios` | page builder | C-02. El copy de `src/data/service-*.ts` no entra: es de Hiweb |
| Industrias | `industry`, `industrySections` | servicios y casos | A-01 |
| Diagnóstico (quiz) | `src/lib/growth/quiz`, `src/pages/api/quiz`, `MarketingQuiz.tsx`, D1 | D1, n8n opcional | G-02 |
| Calendario | `src/lib/growth/calendar`, APIs, `CalendarTool.tsx`, Google, D1 | D1, n8n, cuenta de servicio | G-01, G-02, G-04 |
| n8n | `src/lib/growth/n8n` | secreto y URLs de webhook | G-07 |
| Portal | `portalPage`, `src/components/portal`, `src/pages/portal.astro` | ninguno del núcleo salvo Layout | Es un demo de producto. Solo si el cliente lo vende |

### Solo de Hiweb

No se copia.

- `src/data/webflow-*.ts`, `src/data/site.ts` y el copy de `service-focus`, `service-pitch`, `service-plans`, `industryServices`
- `src/content/**` (casos, posts e industrias de este cliente). El mecanismo de fallback sí se copia, vacío
- `scripts/sanity/scrape-webflow-*`, `write-webflow-*`, `generate-webflow-*`, `import-production-posts.ts` y el resto de semillas con nombres, precios y slugs de Hiweb
- `fonts/` de la raíz y los OTF de Clash como únicos archivos. La plantilla deja el `@font-face` apuntando a WOFF2 que el cliente sustituye (P-01, P-02)
- Efectos de marca que no son el sistema: `DriftWall`, `GradientWaves`, `HeroStudioA` como hero obligatorio. El hero de la plantilla es un `PageHero` con un `h1`
- Nombres `hiweb-marketing-ui`, dataset `web-2026`, proyecto `fxardjr1`, hosts `www.hiwebmarketing.com` y `hiweb-web.sanity.studio`

## Repo plantilla

```text
plantilla/
  astro.config.mjs          site, adapter, redirects vacíos, staging SSR
  wrangler.jsonc            nombre del worker, D1 opcional, cron solo si hay rebuild
  sanity.config.ts          projectId y dataset por env
  src/layouts/Layout.astro
  src/pages/index.astro
  src/pages/en/index.astro
  src/pages/[slug].astro
  src/pages/robots.txt.ts
  src/pages/sitemap.xml.ts
  src/pages/api/sanity-webhook.ts
  src/pages/api/draft-mode/
  src/lib/content/          withFallback, sin JSON de cliente
  src/lib/seo.ts
  src/lib/locale.ts
  src/lib/rebuild/
  src/sanity/schemas/       siteSettings, navigation, footer, landingPage, redirect, seo compartido
  src/components/ui/
  src/components/sections/primitives/
  src/styles/global.css     tokens, sin hex de marca
  migrations/d1/            solo si se enciende quiz o calendario
  modules/                  blog, cases, services, industries, quiz, calendar, portal
  scripts/init.mjs
```

`modules/` no se importa hasta que `init` lo registra en el schema y en el sitemap. Así un cliente sin blog no arrastra `post`.

## Qué se parametriza

Un solo archivo `client.config.ts` (y el `.env`) con:

| Clave | Ejemplo Hiweb | Para qué |
| --- | --- | --- |
| `projectId`, `dataset` | `fxardjr1`, `web-2026` | Sanity |
| `studioHost` | `hiweb-web` | `sanity.cli.ts`, nunca un host de otro cliente |
| `siteUrl` | `https://www.hiwebmarketing.com` | canonical, sitemap, JSON-LD. Uno solo |
| `indexableHosts` | el mismo host | S-01 |
| `workerName`, `stagingWorkerName` | `hiweb-marketing-ui` | wrangler |
| `d1Name`, `d1Id` | quiz-calendar | solo si hay módulo con D1 |
| `githubRepo` | `hiwebapps/hiweb-marketing-ui` | dispatch de respaldo. Sin default a una cuenta personal |
| `locales` | `es`, `en` | se puede dejar en uno |
| `brand` | nombre, color de acento, fuentes | tokens |
| `modules` | lista de los opcionales | `init` |

Secretos, fuera del archivo: `SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET`, `CLOUDFLARE_API_TOKEN`, y si aplica `GOOGLE_SERVICE_ACCOUNT_*`, `N8N_WEBHOOK_*`, `STAGING_PASSWORD`.

## Schemas mínimos

Sin módulos opcionales, el Studio solo tiene:

- `siteSettings` (identidad, SEO por defecto, indexación)
- `navigation` y `footer`
- `landingPage` con el page builder (hero, texto, FAQ, CTA)
- `redirect`
- `seo` compartido (`src/sanity/schemas/shared.ts`)

Blog, casos, servicios, industrias, portal, contacto y calendario se añaden al activar el módulo. El array `of:` de secciones se declara con `defineArrayMember`, no con un objeto suelto (C-03).

## `scripts/init.mjs`

1. Pregunta el nombre del cliente, los dos hosts, el projectId y qué módulos van.
2. Escribe `client.config.ts` y los nombres en `wrangler.jsonc` y `sanity.cli.ts`.
3. Copia de `modules/` a `src/` solo las carpetas elegidas y registra sus schemas en `src/sanity/schemas/index.ts`.
4. No llama a `sanity deploy` ni a `wrangler deploy`. Imprime el checklist.

## Checklist de arranque

1. Node `>= 22.12`. `npm install`.
2. Crear el proyecto Sanity y el dataset. Poner `projectId` y `dataset` en el env. No reutilizar `fxardjr1`.
3. `npx sanity login` y `npx wrangler login` con la cuenta del cliente.
4. Correr `node scripts/init.mjs`.
5. `npm run dev` y `npm run studio`. Crear `siteSettings`, nav y footer.
6. Crear el Worker y, si hay quiz o calendario, la base D1. Aplicar `migrations/d1`.
7. Secretos del Worker: token de lectura de Sanity, secreto del webhook, y los del módulo que se haya encendido.
8. CORS del proyecto Sanity con el origen de live, el de staging y `localhost`.
9. Primer deploy a staging. Comprobar draft mode y que un redirect del CMS no tape `/`.
10. `PUBLIC_SITE_INDEXABLE` se queda en `false` hasta que el cliente pida el corte. En ese momento se hace el cambio de S-01 entero: flag, host y `_headers`, en un rebuild.
11. `npx tsc --noEmit` en cero antes de dar la base por buena. Hoy Hiweb no cumple eso (B-01).

## Orden de extracción

1. Cerrar B-04, S-01, S-02, G-01, G-03 y A-07 en Hiweb, porque son de producción y además envenenan la copia.
2. Sacar el núcleo a la plantilla y hacer que `tsc` pase (C-03).
3. Sacar blog y landings, que son los módulos que más se repiten.
4. Sacar calendario y quiz solo después de G-01 y G-02. No forman parte del núcleo.
5. Dejar portal, efectos WebGL y la migración Webflow fuera.
