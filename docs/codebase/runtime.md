# Build, Worker, middleware y layout

Cómo se arma el sitio y cómo se sirve. El copy y los schemas están en [sanity-schemas.md](./sanity-schemas.md) y [sanity-studio.md](./sanity-studio.md). Los scripts que escriben el dataset están en [scripts.md](./scripts.md).

Live prerenderiza las páginas de marketing. Staging apaga ese prerender para que un draft de Sanity se vea sin rebuild. El cron que publica el HTML de live solo existe en el Worker de producción.

## Fichas

### `astro.config.mjs`

- Propósito: config de Astro 7. Salida `server`, adapter de Cloudflare, React, Tailwind v4, Sanity y los redirects.
- Por qué está así: el Studio no va embebido. `studioUrl` apunta a `https://hiweb-web.sanity.studio` y `stega.enabled` está en false para que el HTML público no lleve caracteres invisibles. Staging fuerza SSR en el hook `astro:route:setup` porque un draft no puede esperar un build. GSAP arranca un timer al importarse y el Worker solo lo permite dentro de un request, así que el plugin sustituye `gsap` por `src/lib/gsap-ssr-stub.ts` en el bundle de SSR.
- Exporta: el default de `defineConfig`.
- Depende de: `integrations/sanity-redirects.mjs`. Carga env con `loadEnv` de Vite.
- Lo usan: `astro build` y `astro dev`.
- Datos: `site` es `https://staging.hiweb.com.mx` si `PUBLIC_SITE_ENV=staging`; si no, `PUBLIC_SITE_URL` o `https://hiweb.com.mx`. Proyecto Sanity `fxardjr1`, dataset `web-2026`, API `2026-09-18`, `useCdn` verdadero en vivo y falso en staging. Adapter `imageService: 'compile'`, `prerenderEnvironment: 'node'`. Redirects fijos: `/work` → `/portafolio`, `/contact` → `/contacto`, seis slugs viejos de servicios en inglés, `/en/blog` → `/en/blogs`, y `/industrias`, `/servicios`, `/en/industries`, `/en/services` → home. `optimizeDeps.exclude` deja fuera `styled-components`, `@sanity/ui`, `sanity` y `@sanity/visual-editing` porque el prebundle de Rolldown rompe `astro dev`.
- Hallazgos: C-09. Stega apagado en la integración es el camino correcto del HTML público. El overlay vive en `load-query.ts`. B-04. `/contact` apunta a `/contacto`, y un redirect de Sanity manda `/contacto` a `/calendario`, así que el build no emite ninguna de las dos. A-04, en los docs viejos de `docs/cms/`: staging no deja ninguna ruta en prerender, y en live hay más SSR que robots, sitemap y el webhook.

### `wrangler.jsonc`

- Propósito: los dos Workers. Live `hiweb-marketing-ui` y staging `hiweb-marketing-ui-staging`.
- Por qué está así: un deploy de live no actualiza staging. El adapter escribe `dist/server/wrangler.json` según `CLOUDFLARE_ENV`. Sin esa variable en el build, `wrangler deploy --env staging` publicaría el bundle en el Worker de live. `--keep-vars` conserva los secretos que no están en este archivo.
- Exporta: config. `main` es `./src/worker.ts`. Assets en `./dist`, binding `ASSETS`.
- Depende de: nada del grafo.
- Lo usan: `wrangler deploy` y los workflows.
- Datos: `compatibility_date` `2026-09-18`, flag `nodejs_compat`. Live: `PUBLIC_SITE_INDEXABLE=false`, `PUBLIC_SITE_URL=https://www.hiwebmarketing.com`, project `fxardjr1`, dataset `web-2026`, cron `* * * * *`, D1 `hiweb-marketing-quiz-calendar` (`282c179c-d35d-4dfa-b631-afaad98d802c`), `migrations_dir` `migrations/d1`. Staging: `PUBLIC_SITE_ENV=staging`, URL `https://staging.hiweb.com.mx`, la misma pareja Sanity, D1 distinta (`hiweb-marketing-quiz-calendar-staging`, `0391782c-b084-452c-a283-74af9c54451f`), crons `[]`. Observability encendida en live.
- Hallazgos: A-13. El cron de live corre cada minuto. El flush no dispara el deploy hasta unos 10 minutos después del último publish. Staging no tiene cron y no debe tenerlo mientras siga en SSR. A-07. El default del repo de GitHub no está en este archivo: está en `src/lib/rebuild/dispatch.ts`. Si el Worker no tiene `CLOUDFLARE_DEPLOY_HOOK_URL` ni `GITHUB_DISPATCH_REPO`, el cron pega a `jahirgosu/hiweb-marketing-ui`. `PUBLIC_SITE_INDEXABLE` queda en `false` en los dos entornos.

### `sanity.config.ts`

- Propósito: workspace `hiweb-web`, título «Hiweb Web 2026».
- Por qué está así: el orden de tools (Guía, Structure, Blogs, SEO, Presentation, Galería, Vision) pone lo que el editor usa antes que Vision. Las acciones de inglés y de redirect no van en todos los tipos: cada una cubre la convención de idioma de ese documento. Las plantillas de alta siembran `sections` para no abrir un documento vacío.
- Exporta: el default de `defineConfig`.
- Depende de: `src/sanity/schemas` (`schemaTypes`), `structure.ts`, `presentation/resolve.ts`, `presentation/SiteNavigator.ts`, acciones, badges, `PostSeoView`, `DocumentFooter`, `StudioNavbar`, `landingTemplate.ts`, `starters.ts`, y los cuatro tools.
- Lo usan: `sanity dev` y `sanity deploy`. No entra en el build de Astro.
- Datos: project y dataset por `SANITY_STUDIO_*` o `PUBLIC_SANITY_*`, si no `fxardjr1` / `web-2026`. Preview inicial `SANITY_STUDIO_PREVIEW_URL` o `https://staging.hiweb.com.mx`. Orígenes permitidos: ese host, `https://hiweb-marketing-ui-staging.hiwebapps.workers.dev` y localhost en el puerto 4321. Draft mode: `/api/draft-mode/enable` y `disable`. Vision usa la API `2026-09-18`. El post tiene vista Formulario y vista SEO. Plantillas: servicio e industria ES/EN, caso, testimonio y persona en español, post ES/EN, y tres landings (`serviceLite`, `industryLite`, `campaign`).
- Hallazgos: C-10. Tres mecanismos de idioma conviven en este archivo: `createEnglishVersion` solo en `post`, `ensureEnglishPair` en ocho tipos, y los singletons solo si el id ya está en `structure.ts`. C-09. Presentation abre staging a propósito. `/api/draft-mode/enable` responde 404 fuera de staging.

### `sanity.cli.ts`

- Propósito: CLI del Studio y de TypeGen.
- Por qué está así: el host `hiweb-web` y el `appId` viven aquí para que `sanity deploy` no pregunte el proyecto. `typegen` apunta a `./src/**/*.{ts,tsx,js,jsx,astro}`, esquema `./schema.json` y salida `./src/sanity/types.ts`. No hay `typegen.enabled: true`. Vite inyecta `__HIWEB_STUDIO_BUILT_AT__` para que el navbar compare el build del Studio con el del sitio.
- Exporta: el default de `defineCliConfig`.
- Depende de: nada del grafo.
- Lo usan: `sanity` CLI y `npm run sanity:typegen`.
- Datos: el mismo project y dataset que el config. `studioHost: 'hiweb-web'`. `deployment.appId` `hfmbspi4louqwqyclcamau1z`, `autoUpdates: true`.
- Hallazgos: C-01. La config de TypeGen está aquí y, otra vez, en `sanity-typegen.json`. `types.ts` no se regeneró después del page builder. El deploy del Studio no forma parte del deploy del Worker.

### `sanity-typegen.json`

- Propósito: el mismo `path`, `schema` y `generates` que `sanity.cli.ts`.
- Por qué está así: es la forma anterior de configurar TypeGen. El CLI ya tiene el bloque `typegen`. El JSON sigue en el repo.
- Exporta: nada. JSON de config.
- Depende de: nada.
- Lo usan: el CLI de Sanity si no lee el bloque de `sanity.cli.ts`. La forma está deprecada.
- Datos: `"./src/**/*.{ts,tsx,js,jsx,astro}"`, `"./schema.json"`, `"./src/sanity/types.ts"`.
- Hallazgos: C-01. La corrección propuesta es borrar este archivo y dejar la config solo en `sanity.cli.ts`, y no usar `types.ts` como mapa del contenido hasta regenerarlo.

### `src/worker.ts`

- Propósito: entry del Worker. El `fetch` es el de Astro. El `scheduled` vacía la cola de rebuild.
- Por qué está así: el webhook solo inserta `rebuild_requests`. Quien llama al deploy hook es el cron, para juntar varios publish en un solo build.
- Exporta: default `{ fetch, scheduled }`.
- Depende de: `src/lib/rebuild/flush.ts` (`flushDueRebuild`).
- Lo usan: `wrangler.jsonc` (`main`). El grafo no marca consumidores porque Wrangler lo carga por config.
- Datos: `scheduled` hace `waitUntil(flushDueRebuild(env))`. No mira el evento del cron.
- Hallazgos: A-13. En live el cron es cada minuto y el flush espera unos 10 minutos desde `requested_at`. Staging no registra cron, y `canDispatchRebuild` rechaza `PUBLIC_SITE_ENV=staging`. A-07. `flushDueRebuild` termina en `src/lib/rebuild/dispatch.ts`. Sin `CLOUDFLARE_DEPLOY_HOOK_URL`, el `POST` de respaldo va a `https://api.github.com/repos/${githubRepo}/dispatches` con default `jahirgosu/hiweb-marketing-ui`. El README identifica `hiwebapps/hiweb-marketing-ui`. Sin hook y sin `GITHUB_DISPATCH_REPO`, el cron marca el rebuild como fallido y reintenta cada minuto.

### `src/middleware.ts`

- Propósito: recorta `/en` a las secciones que existen, pide basic auth en staging y mete el estado de preview en la request.
- Por qué está así: una URL inglesa que no tiene página (`/en/contacto`, un slug suelto) vuelve a `/en` en lugar de caer en una landing española. Staging no es público: sin usuario y contraseña responde 401, salvo la cookie de Presentation o las rutas de draft mode. El iframe del Studio necesita `frame-ancestors` y no un `X-Frame-Options` que lo bloquee.
- Exporta: `onRequest`.
- Depende de: `src/lib/preview-auth.ts`, `src/lib/preview-context.ts`, `src/lib/runtime-env.ts`, `src/lib/seo.ts`, `src/lib/site-env.ts`.
- Lo usan: Astro, en cada request que pasa por el middleware.
- Datos: secciones inglesas permitidas: `/en/services/`, `/en/industries/`, `/en/blogs`, `/en/terms`, `/en/privacy-policy`, `/en/calendar`, `/en/portal`. Un `/en/<algo>` de un solo segmento llega a la página (Nosotros en inglés usa el slug de Studio) y, si responde 404, redirige a `/en`. Credenciales `STAGING_USER` y `STAGING_PASSWORD` por binding. Cookie `PREVIEW_ACCESS_COOKIE` más la cookie de perspectiva de `@sanity/preview-url-secret`. En staging añade `Cache-Control: no-store` y CSP `frame-ancestors` con `hiweb-web.sanity.studio`, `*.sanity.studio` y localhost 3333 y 4321. `X-Robots-Tag` cuando `shouldNoIndex` es cierto.
- Hallazgos: C-09. El overlay solo aparece si la cookie de preview firma la contraseña y `loadQuery` enciende stega. Entrar a staging con basic auth ya muestra drafts, porque el cliente va en perspectiva `drafts`, aunque no haya overlay. C-05. `/en/contacto` no está en la lista blanca: el middleware lo manda a `/en`. A-04. Este archivo es la prueba de que sí hay i18n, al revés de lo que dice `docs/cms/README.md`.

### `src/layouts/Layout.astro`

- Propósito: documento HTML de todas las páginas de marketing.
- Por qué está así: nav, footer, favicon, JSON-LD de organización y el `<head>` SEO son iguales en home, blog y landing. Cada página pasa título, descripción, canonical, `noindex`, `ogImage`, `jsonLd`, `lang` y `alternates`. En staging, y solo entonces, carga `PreviewChrome` para el iframe de Presentation.
- Exporta: el layout. Props `title`, `description`, `canonical`, `noindex`, `ogImage`, `jsonLd`, `lang` (`es` | `en`), `alternates`.
- Depende de: `src/styles/global.css`, CSS de nav, footer, CTA, hero de industria, casos y FAQ, `SiteNav`, `SiteFooter`, `ScrollIndicator`, `src/lib/content` (`getFavicon`, `getFooter`, `getNavigation`, `getSiteSettings`), `src/lib/schema.ts`, `src/lib/seo.ts`. El grafo lista las páginas que lo importan, de `index.astro` a `[slug].astro`, incluidas las de `/en`.
- Lo usan: todas las páginas `.astro` de marketing. Ver [grafo.md](./grafo.md).
- Datos: title por defecto «Hiweb Marketing — Partner estratégico». Descripción: la prop o `site.tagline`. Canonical absoluto con `Astro.site`. Hreflang `es`, `en` y `x-default` hacia el español cuando hay `alternates`. Preload de Clash Display Semibold e Inter variable. Favicon de Sanity o `/favicon.svg` más `/favicon.ico`. `SiteNav` con `client:load`, `SiteFooter` con `client:idle`, `ScrollIndicator` con `client:load`. Un script inline añade `motion-ready` y lo quita a los 2,5 s si `window.__HIWEB_MOTION__` no arrancó. Luego carga `src/scripts/motion.ts`.
- Hallazgos: C-09. `metaTitle` y `metaDescription` llegan a `<title>` y a `og:description` por las props. En el iframe, si el fetch trae stega y esos campos no están en `STEGA_SKIP`, el `<head>` puede llevar los caracteres. A-13. El layout lee contenido en el build de live. Un publish no cambia este HTML hasta el deploy. A-09. Lo que calendario y contacto no proyectan (`ogImage`, `noindex`) no puede llegar a estas props.

### `src/styles/global.css`

- Propósito: Tailwind v4, fuentes y tokens del sitio claro.
- Por qué está así: `@import "tailwindcss"` y `@theme` sustituyen a `tailwind.config.js` en el build. Las fuentes que se sirven están en `public/fonts` (Clash Display e Inter). La carpeta `fonts/` de la raíz no entra aquí.
- Exporta: CSS global. No hay símbolos JS.
- Depende de: nada del grafo.
- Lo usan: `Layout.astro`.
- Datos: `@font-face` de Clash Display del 200 al 700 en `.otf`, e Inter variable 100–900 en normal e itálica (`.ttf`, `font-display: swap`). Tokens: canvas, surface, ink, muted, bordes, acentos (naranja, cian, morado, lima, azules, rojo, verde, teal), `--font-display`, `--font-sans`, `--container-6xl: 1300px`. Base: `color-scheme: light`, scrollbar oculto desde 768 px, escala de `h1`–`h5`, selección, clase `.hw-section-title`, selección clara sobre fondos oscuros, y la animación `mesh-drift` del fondo.
- Hallazgos: ninguno de 06 ni de 01 en este archivo. El peso de Inter variable está en P-01 (auditoría de performance): el layout lo pide en cada página.

### `src/content.config.ts`

- Propósito: colecciones de Astro que respaldan el español cuando Sanity no responde.
- Por qué está así: industrias, servicios, casos y posts ya estaban en JSON y Markdown antes del dataset `web-2026`. El loader es `glob` sobre `src/content`. El schema Zod es el modelo plano, el de antes de `sections[]`.
- Exporta: `collections` con `industrias`, `servicios`, `casos` y `posts`.
- Depende de: nada del grafo. `astro:content`, `astro/loaders`, `astro/zod`.
- Lo usan: `getCollection` en `src/lib/content/from-collections.ts`. El grafo no marca el import porque Astro lo resuelve por convención.
- Datos: industrias exigen `heroTitle`, `retos`, `porQue` y `faqs`. Servicios exigen tres `cards`, `proceso` y `faqs`. Casos exigen `resultadoFrase`, `metricas`, `reto`, `estrategia` y `fases`, con `industria` y `servicios` como `reference`. Posts son Markdown con `keyword`, `autor`, `fecha` y `faqs`. No hay colección de home, about, legal, contacto, calendario, portal, nav ni footer.
- Hallazgos: A-06. `resultadoFrase` es required aquí y no existe en `caseStudy` ni en la query. A-01. Estas colecciones son el fallback del español. El inglés de catálogos no pasa por `withFallback`. A-14. Legal, portal, contacto, calendario, nav, footer y landings no leen `src/content`. A-02. Los nombres que las queries todavía piden (`heroTitle`, `porQue`, `cards`) son los de este Zod, no los del schema de Studio.

### `src/env.d.ts`

- Propósito: tipos de `import.meta.env` y del módulo `cloudflare:workers`.
- Por qué está así: el Worker y Astro leen los mismos nombres. Sin este archivo, `PUBLIC_SITE_ENV` y los tokens quedan como `any` fuera de `astro/client`.
- Exporta: `ImportMetaEnv`, ampliación de `ImportMeta`, y `env` de `cloudflare:workers` como `Record<string, string | undefined>`.
- Depende de: nada. Referencia `astro/client`.
- Lo usan: el typecheck. El grafo no tiene importadores.
- Datos: `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `PUBLIC_SITE_ENV`, `PUBLIC_SITE_INDEXABLE`, `PUBLIC_SITE_URL`, `STAGING_USER`, `STAGING_PASSWORD`, `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`, `SANITY_REVALIDATE_SECRET`, `CLOUDFLARE_DEPLOY_HOOK_URL`, `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, `SANITY_STUDIO_PREVIEW_URL`. No declara `GITHUB_DISPATCH_REPO` ni `CLOUDFLARE_ENV`. Esas las lee el runtime de rebuild y el adapter, no `import.meta.env` de las páginas.
- Hallazgos: A-07. El default del repo vive en código, no en una variable tipada aquí. Quien configure el Worker puede no ver que falta `GITHUB_DISPATCH_REPO`.

### `.github/workflows/deploy-worker.yml`

- Propósito: rebuild del Worker de live.
- Por qué está así: lo dispara un `repository_dispatch` de tipo `sanity-rebuild` o un `workflow_dispatch`. No despliega Vercel. El build lleva `PUBLIC_SITE_URL=https://www.hiwebmarketing.com` y no lleva `PUBLIC_SITE_ENV`, para que el prerender y el adapter apunten al Worker de producción.
- Exporta: workflow «Deploy Worker».
- Depende de: secrets `SANITY_API_READ_TOKEN`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
- Lo usan: el dispatch de `src/lib/rebuild/dispatch.ts` cuando no hay deploy hook, y quien lo lance a mano.
- Datos: Node 22, `npm ci`, `npm run build` con `PUBLIC_SITE_INDEXABLE=false`, project `fxardjr1`, dataset `web-2026`. Luego `wrangler deploy --keep-vars`. Timeout 20 minutos. Rama del checkout: la que dispare el workflow.
- Hallazgos: A-07. El dispatch tiene que pegarle a este repo (`hiwebapps/hiweb-marketing-ui`) para que este archivo corra. El default del código apunta a `jahirgosu/hiweb-marketing-ui`. A-13. Aunque el workflow exista, el cron no lo llama hasta pasados unos 10 minutos, y solo si el camino de respaldo es el que está activo. El camino normal es `CLOUDFLARE_DEPLOY_HOOK_URL`.

### `.github/workflows/deploy-staging.yml`

- Propósito: deploy del Worker de staging en cada push a `master`, o a mano.
- Por qué está así: staging es SSR. Un push de código tiene que publicar el Worker, y un draft de Sanity no necesita este workflow para verse. Por eso no escucha `repository_dispatch`.
- Exporta: workflow «Deploy staging».
- Depende de: los mismos tres secrets que live.
- Lo usan: GitHub, en push a `master`.
- Datos: el build exporta `PUBLIC_SITE_ENV=staging`, `PUBLIC_SITE_URL=https://staging.hiweb.com.mx` y `CLOUDFLARE_ENV=staging`. Sin `CLOUDFLARE_ENV`, el `wrangler.json` generado sería el de live y `deploy --env staging` publicaría ese bundle en el Worker de producción. Comando: `deploy --env staging --keep-vars`. `PUBLIC_SITE_INDEXABLE=false`.
- Hallazgos: A-13. Staging no tiene cron. Los drafts se ven porque `stagingSsr()` apaga el prerender y el cliente usa perspectiva `drafts`. A-04. Este workflow es el que mantiene el SSR de staging. Los docs de `docs/cms/` que hablan de tres rutas SSR describen otro sitio.

### `src/scripts/motion.ts`

- Propósito: arranca GSAP en el cliente: SplitText, reveals, contadores y parallax.
- Por qué está así: el layout lo carga como `<script>`, no como isla de React. Así el HTML ya pintado recibe la animación sin hidratar cada sección. Marca `window.__HIWEB_MOTION__` para que el script inline del layout no quite `motion-ready` a los 2,5 s.
- Exporta: `initMotion`. El archivo también se autoejecuta en `DOMContentLoaded` y otra vez en `load`.
- Depende de: `gsap`, `ScrollTrigger`, `SplitText` y `src/lib/motion.ts` (`MOTION`).
- Lo usan: `src/layouts/Layout.astro`. Las secciones no lo importan: dejan `data-split`, `data-reveal`, `data-counter` o `data-parallax` en el DOM.
- Datos: ignora `prefers-reduced-motion`. Split espera a `document.fonts.ready`. Reveal y contador entran al 85–88 % del viewport, una sola vez. Parallax solo desde 768 px. Un `MutationObserver` reescanea islas que llegan tarde (`client:load`, `client:idle`).
- Hallazgos: P-03. SplitText y ScrollTrigger entran en cada página porque el layout siempre carga este archivo. El stub de GSAP en `astro.config.mjs` solo afecta al bundle de SSR.

### `src/scripts/hero-shader.ts`

- Propósito: gradiente WebGL sobre un `<canvas data-hero-shader>`.
- Por qué está así: el comentario de `HeroGradientShader.tsx` dice que el GL no debe hidratar React. El script busca el canvas, arma un ruido en el fragment shader y, si WebGL falla, oculta el canvas para dejar el fallback CSS.
- Exporta: `initHeroShader(speed = 1)`.
- Depende de: nada del grafo. Solo WebGL del navegador.
- Lo usan: nadie. No hay `<script>` ni import. `HeroGradientShader` pinta el canvas y el fallback, y el barril de primitivas reexporta el componente, pero este archivo no se ejecuta.
- Datos: contexto `webgl` sin alpha, antialias, depth ni stencil, `powerPreference: 'low-power'`. Si `prefers-reduced-motion`, dibuja un frame fijo en `t = 4.2`. Si no, hace loop con `requestAnimationFrame` y para en `pagehide`.
- Hallazgos: el canvas de `HeroGradientShader` se queda en el fallback CSS. El archivo está en el repo y en el grafo, y no entra en el bundle de ninguna página.
