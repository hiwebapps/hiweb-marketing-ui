# El resto de `src/lib`

Lo que no es copy de página (`src/lib/content`) ni calendario o diagnóstico (`src/lib/growth`): SEO, datos estructurados, idioma, menú, footer, identidad, rebuild, preview, blog, movimiento, encabezados y el alias de GSAP en el SSR.

El grafo deja `gsap-ssr-stub.ts` sin consumidores. Lo resuelve `astro.config.mjs` (`gsapSsrStubPlugin`) cuando el import de `gsap` ocurre en SSR. `STAGING_ORIGIN` en `site-env.ts` y `languageAlternates` en `page-meta.ts` no tienen imports; el botón de staging del Studio repite el origen en su propio archivo.

## Fichas

### `src/lib/seo.ts`

- Propósito: decide si el sitio se esconde de los buscadores y absolutiza una ruta para canonical y Open Graph.
- Por qué está así: el cutover exige el flag y, además, un host de la lista blanca. `hiweb.com.mx` no está en esa lista. La directiva de cierre es la misma cadena que Layout aplica a una página con `noindex`.
- Exporta: `ROBOTS_NOINDEX`, `DEFAULT_OG_IMAGE` (`/images/services/branding-hero.jpg`), `shouldNoIndex`, `absoluteUrl`.
- Depende de: `import.meta.env.PUBLIC_SITE_INDEXABLE` y `PUBLIC_SITE_URL`.
- Lo usan: `src/layouts/Layout.astro`, `src/middleware.ts`, `src/pages/robots.txt.ts`, `src/pages/sitemap.xml.ts`.
- Datos: hosts indexables: `hiwebmarketing.com` y `www.hiwebmarketing.com`. El flag tiene que ser `true` o `1`. Si falta cualquiera de las dos condiciones, `shouldNoIndex` devuelve true. `absoluteUrl` deja pasar un `http(s)` ya absoluto y, si no, resuelve contra el `site` que le pasen, `PUBLIC_SITE_URL` o `https://hiweb.com.mx`.
- Hallazgos: S-01, S-02, S-08, S-10.

### `src/lib/schema.ts`

- Propósito: objetos JSON-LD de Organization, BreadcrumbList, FAQPage y Article.
- Por qué está así: Layout y las páginas arman el script a partir de estas funciones. Las URLs salen de `SITE.url` (`src/data/site.ts`), el mismo origen que el build usa como `https://hiweb.com.mx`, no del host de `PUBLIC_ORIGIN`.
- Exporta: `organizationSchema`, `breadcrumbSchema`, `faqSchema`, `articleSchema`.
- Depende de: `src/data/site.ts`, `src/lib/content/faq-answer.ts`, `src/lib/content/types.ts` (`FaqAnswer`), `src/lib/site-identity.ts` (tipo).
- Lo usan: `Layout.astro` (Organization en cada página). `faqSchema` en home ES y EN, industrias, servicios y landings. `breadcrumbSchema` en blog, portafolio, contacto, calendario, portal, nosotros, legales, diagnóstico y las pares `en/` que lo importan. `articleSchema` en `blog/[slug].astro` y `en/blogs/[slug].astro`.
- Datos: Organization lleva nombre legal, email, teléfono y `areaServed` como ciudades a partir de `site.locales`. FAQ aplana la respuesta con `faqAnswerText`. Article lleva headline, description, url, `datePublished`, autor (cargo, empresa, LinkedIn, foto si vienen) y publisher. No lleva imagen, `dateModified` ni `inLanguage`.
- Hallazgos: S-02, S-09.

### `src/lib/locale.ts`

- Propósito: saber si la ruta es inglesa, traducir el path del selector y guardar el chrome (etiquetas de nav y footer) en los dos idiomas.
- Por qué está así: el hreflang de una ficha sale de Sanity (`alternateSlug`). El selector no lee ese campo: traduce servicios con `en-slugs.ts` y posts con `blog-pairs.ts`. Cualquier otra ruta inglesa que el middleware no deje vivir se fabrica igual y luego el middleware la manda a `/en`.
- Exporta: `Locale`, `localeFromPath`, `localePath`, `isRetiredCatalogPath`, `CHROME`, `EN_NAV_SERVICES`.
- Depende de: `blog-pairs.ts`, `en-slugs.ts`.
- Lo usan: `SiteNav.tsx`, `SiteFooter.tsx`, `IndustryServices.tsx` (`isRetiredCatalogPath`), `AboutPageSection.astro` y `src/pages/en/nosotros.astro` (`localePath`), `nav.ts`, `footer.ts`, `scripts/sanity/seed-navigation.ts`.
- Datos: inglés si el path es `/en` o empieza por `/en/`. `localePath` quita el prefijo, traduce `/servicios/:slug` y `/blog` ↔ `/blogs`, y en inglés antepone `/en`. `RETIRED_CATALOG_PATHS` es `/industrias`, `/servicios` y las dos con `/en`. `CHROME.en` deja en español `menu` («Menú»), `workEmail` («Email de trabajo») y `backToTop` («Volver arriba ↑»). `EN_NAV_SERVICES` traduce nueve slugs españoles; los headings de grupo no pasan por aquí.
- Hallazgos: S-05 (`localePath('/contacto', 'en')` produce `/en/contacto`), S-06, R-04 (el chrome inglés no cubre los rótulos que la home sigue teniendo en español dentro de los componentes; este archivo es la fuente que la auditoría propone para esos rótulos).

### `src/lib/en-slugs.ts`

- Propósito: slug público inglés de un servicio y la clave española con la que están guardadas fotos e iconos.
- Por qué está así: cinco servicios cambian de slug al pasar a inglés. El resto se llama igual. Los drafts viejos usan slugs de agencia (`agencia-seo`, `agencia-de-facebook-ads`, …) que hay que devolver al slug corto antes de buscar el asset.
- Exporta: `EN_SERVICE_SLUG`, `englishServiceSlug`, `serviceContentKey`.
- Depende de: nada.
- Lo usan: `locale.ts`, `IndustryServices.tsx`, `ServiceGrid.tsx`, `ServicePageSection.astro`, `src/pages/industrias/[slug].astro`, `src/pages/en/industrias/[slug].astro`, `src/pages/en/servicios/[slug].astro`.
- Datos: `google-ads` → `google-ads-management-services`, `redes-sociales` → `social-media`, `desarrollo-web` → `web-development`, `crm-automatizacion` → `crm-automation`, `ia-marketing` → `ai-tools-for-marketing`. `serviceContentKey` quita un zero-width space, invierte ese mapa y aplica `SERVICE_SLUG_ALIAS`.
- Hallazgos: S-06 (el selector usa este mapa; el hreflang de la ficha usa `alternateSlug`).

### `src/lib/blog-pairs.ts`

- Propósito: mapa estático slug de post ES ↔ slug de post EN, tomado de hiwebmarketing.com.
- Por qué está así: el selector tiene que traducir la URL sin pedir Sanity. El par que imprime hreflang es `esSlug` en el documento, no este objeto. Varias claves son iguales en los dos idiomas (el slug español se repite del otro lado).
- Exporta: `EN_BLOG_SLUG`, `ES_BLOG_SLUG`.
- Depende de: nada.
- Lo usan: `locale.ts`.
- Datos: dos récords inversos. Si el slug no está, `locale.ts` deja el mismo segmento.
- Hallazgos: S-06.

### `src/lib/nav.ts`

- Propósito: tipos de la barra y el menú que el sitio usaba antes de que la navbar viviera en Studio.
- Por qué está así: `getNavigation` devuelve `null` cuando Sanity no trae barra. `SiteNav` sustituye con `fallbackNav`. Los href pasan por `localePath`, incluido el CTA, que apunta a contacto.
- Exporta: `NavLink`, `NavGroup`, `NavBarItem`, `SiteNavContent`, `fallbackNav`.
- Depende de: `src/data/site.ts` (`NAV_EXPLORE`, `NAV_INDUSTRY_ITEMS`, `NAV_SERVICE_GROUPS`), `locale.ts`.
- Lo usan: `SiteNav.tsx`. `from-sanity.ts` importa los tipos y devuelve un `SiteNavContent` cuando el documento existe.
- Datos: enlaces de Nosotros, Industrias (columnas de a dos), Servicios (grupos de `NAV_SERVICE_GROUPS` más «Explorar»), Casos y Blog. En inglés los servicios usan `EN_NAV_SERVICES`. `indexLabel` e `indexHref` salen vacíos. El CTA es `localePath('/contacto', locale)`.
- Hallazgos: A-03 (el documento nuevo convive con este respaldo), A-14, S-05 (el CTA inglés cae en `/en/contacto`).

### `src/lib/footer.ts`

- Propósito: tipos del footer y el footer de respaldo.
- Por qué está así: igual que la nav, Studio puede devolver `null` y el componente necesita un footer completo, con teléfono y legales de `src/data`.
- Exporta: `FooterLink`, `SiteFooterContent`, `fallbackFooter`.
- Depende de: `src/data/site.ts` (`LEGAL_LINKS`), `locale.ts`, `site-identity.ts`.
- Lo usan: `SiteFooter.tsx`. `from-sanity.ts` importa `FooterLink` y `SiteFooterContent`.
- Datos: menú con nosotros, industrias, servicios, portafolio, blog y contacto, todos vía `localePath`. Contacto del pie: teléfono, mailto y WhatsApp. Sedes unidas con ` · `. El título sale de `CHROME[locale].footerTitle`.
- Hallazgos: A-14, S-05 (contacto en inglés queda en `/en/contacto`), R-06 (el teléfono que se ve es el de `SiteIdentity`, y términos publica otro).

### `src/lib/site-identity.ts`

- Propósito: nombre, contacto y redes cuando `siteSettings` no responde.
- Por qué está así: Layout pide ajustes en cada página. El documento de Sanity pisa campo por campo en `sanitySiteIdentity`; este objeto es la base y el relleno de los huecos.
- Exporta: `SiteSocial`, `SiteIdentity`, `fallbackSite`.
- Depende de: `src/data/site.ts` (`SITE`).
- Lo usan: `index.ts` (`getSiteSettings`), `from-sanity.ts`, `footer.ts`, `schema.ts` (tipo), `SiteFooter.tsx`, `ContactForm.tsx`, `ContactBanner.tsx`, `CalendarTool.tsx`.
- Datos: copia `name`, `legalName`, `tagline`, `email`, `phone`, `phoneHref`, `whatsapp`, `locales` y `socials`.
- Hallazgos: A-14, R-06.

### `src/lib/page-meta.ts`

- Propósito: reglas de título, descripción y path que comparten el sitio público (como referencia) y las herramientas SEO del Studio.
- Por qué está así: el HTML real lo escribe Layout con lo que manda la página. Studio necesita la misma receta para la vista SERP, los badges y el inventario, sin importar Astro. `PUBLIC_ORIGIN` es `https://www.hiwebmarketing.com`, distinto del `site` del build.
- Exporta: `PUBLIC_ORIGIN`, `SHORT_DESCRIPTION` (70), `PageMetaDoc`, `publishedId`, `slugOf`, `isEnglish`, `pagePath`, `fallbackTitle`, `publishedTitle`, `publishedDescription`, `languageAlternates`, `splitStudioPath`, `presentationUrl`.
- Depende de: nada del repo.
- Lo usan: `src/sanity/actions/createRedirect.ts` (`pagePath`), `src/sanity/badges/seoBadges.ts` (`publishedId`), `src/sanity/components/PostSeoView.ts` (`pagePath`), `SerpPreview.ts` (`PUBLIC_ORIGIN`, `publishedTitle`, `publishedDescription`), `ViewStagingButton.tsx` (`pagePath`, `PageMetaDoc`), `src/sanity/seo/inventory.ts`, `src/sanity/tools/seoTool.ts` (`presentationUrl`, `splitStudioPath`). `languageAlternates` no tiene imports.
- Datos: inglés si `locale === 'en'` o el id publicado termina en `-en`. Paths: home, nosotros, contacto (siempre `/contacto`), calendario, `sitePage`, servicio, industria, caso, post, landing, índices y legales (`legal-terms` → `/terminos`, el resto de legal → `/aviso-de-privacidad`). Los índices de industrias y servicios siguen descritos como URLs, y esas rutas hoy redirigen a la home. `splitStudioPath` arma el pane doble del desk para post, servicio, industria, home, about y los tres índices.
- Hallazgos: S-02 (`PUBLIC_ORIGIN`), S-05 (contacto siempre `/contacto`; índices que ya no son páginas).

### `src/lib/heading.ts`

- Propósito: ancho máximo de un título de sección y el texto de ese título en una sola línea.
- Por qué está así: el editor elige `sm` | `md` | `lg` | `xl` en el schema. El componente aplica el píxel. El `<title>` y los `aria-label` no pueden conservar el salto de línea del campo.
- Exporta: `HEADING_WIDTH_OPTIONS`, `HeadingWidth`, `asHeadingWidth`, `headingMaxWidth`, `headingPlain`.
- Depende de: nada.
- Lo usan: `src/sanity/schemas/shared.ts` (la lista del campo), `src/components/sections/primitives/heading.tsx` (`headingMaxWidth`), `IndustryHero.tsx` (`headingPlain`), `from-sanity.ts` y `map-sanity.ts` (`asHeadingWidth`), `types.ts` (el tipo).
- Datos: 640, 768, 960 y 1300 px. Un valor desconocido es `undefined` y el componente no pone max-width. `headingPlain` colapsa saltos y espacios.
- Hallazgos: —

### `src/lib/motion.ts`

- Propósito: duraciones, ease y stagger compartidos por las islas que animan con GSAP.
- Por qué está así: cada sección importaba números distintos. Un solo objeto mantiene la misma curva. No importa GSAP: solo constantes, así el módulo es seguro en el Worker.
- Exporta: `MOTION` (`ease` `power3.out`, `duration` 0.7, `durationFast` 0.45, `durationSlow` 0.9, `stagger` 0.08, `revealY` 24).
- Depende de: nada.
- Lo usan: `BlogIndex.tsx`, `CasesIndex.tsx`, `HeroStudioA.tsx`, `HeroStudioB.tsx`, `MetricsBand.tsx`, `ProcessPhases.tsx`, `ServiceWhy.tsx`, `SiteFooter.tsx`, `SiteNav.tsx`, `TeamGrid.tsx`, `src/scripts/motion.ts`.
- Datos: el objeto es `as const`.
- Hallazgos: P-04 (varias de esas islas cargan GSAP, ScrollTrigger y SplitText en la home; este archivo es el token, el peso está en la librería).

### `src/lib/gsap-ssr-stub.ts`

- Propósito: sustituto de GSAP cuando el bundle de servidor importa la librería.
- Por qué está así: el import real de GSAP arranca un timer, y el Worker solo lo permite dentro de un request. El plugin de `astro.config.mjs` reescribe `gsap` y `gsap/…` a este archivo en SSR. En el cliente llega la librería de verdad y las animaciones corren ahí.
- Exporta: default, `ScrollTrigger`, `SplitText`, `useGSAP`. Los cuatro son el mismo proxy.
- Depende de: nada.
- Lo usan: `astro.config.mjs` (`gsapSsrStubPlugin`, `enforce: 'pre'`, solo si `options.ssr`). No hay un `import` TypeScript hacia este path. El grafo lo deja vacío por eso.
- Datos: el proxy es una función que se devuelve a sí misma. Cualquier propiedad que no sea `then` devuelve el mismo proxy, para que `gsap.timeline().to()` no truene en el servidor. `then` es `undefined` para que una promesa no lo trate como thenable.
- Hallazgos: P-04 (el stub no quita el JS del cliente).

### `src/lib/blog.ts`

- Propósito: portada de reserva, minutos de lectura por defecto y los encabezados h2/h3 para la tabla de contenido.
- Por qué está así: un post de colección trae Markdown; uno de Sanity trae Portable Text. La TOC tiene que salir de los dos. La imagen de picsum cubre fichas que todavía no tienen cover en el CMS, también en el índice de casos.
- Exporta: `BLOG_READING_MINUTES` (5), `postCoverUrl`, `slugifyHeading`, `PostHeading`, `extractPortableHeadings`, `extractPostHeadings`.
- Depende de: nada.
- Lo usan: `BlogHero.tsx`, `BlogIndex.tsx`, `BlogPostToc.tsx` (tipo), `CasesIndex.tsx`, páginas de blog ES y EN (índice y ficha), `portafolio/index.astro` y `portafolio/[slug].astro`, `src/sanity/badges/seoBadges.ts` (`slugifyHeading`), `src/sanity/components/PostSeoView.ts` (`extractPortableHeadings`).
- Datos: `postCoverUrl` es `https://picsum.photos/seed/${id}/${width}/${height}`. El slug del ancla quita acentos, pasa a minúsculas y desambigua repetidos con `-2`, `-3`. Portable Text mira bloques `h2` y `h3`. Markdown mira líneas `##` y `###` y les quita links e marcas.
- Hallazgos: —

### `src/lib/site-env.ts`

- Propósito: saber si este build es staging.
- Por qué está así: staging cambia el cliente de Sanity, el basic auth y las rutas de draft. La señal es `PUBLIC_SITE_ENV === 'staging'` en el momento del build (`import.meta.env`), no el host de la petición.
- Exporta: `isStagingSite`, `STAGING_ORIGIN` (`https://staging.hiweb.com.mx`).
- Depende de: nada.
- Lo usan: `isStagingSite` en `runtime-env.ts`, `middleware.ts`, `src/pages/api/draft-mode/disable.ts`, `enable.ts`, `src/sanity/client.ts`. `STAGING_ORIGIN` no se importa; `ViewStagingButton.tsx` declara la misma URL en local.
- Datos: comparación en minúsculas y con trim. Cualquier otro valor, incluido vacío, es live.
- Hallazgos: S-03 (en staging el cliente usa drafts y el sitemap es SSR; la función es la que elige ese modo).

### `src/lib/runtime-env.ts`

- Propósito: leer un secreto del Worker en staging, con el valor de build como primer intento.
- Por qué está así: en live el token de lectura va horneado en el bundle de servidor. En staging el secret vive en el binding y el HTML no se prerenderiza, así que se puede leer `cloudflare:workers` durante el request.
- Exporta: `readBinding`.
- Depende de: `site-env.ts`.
- Lo usan: `middleware.ts` (`STAGING_USER`, `STAGING_PASSWORD`), `src/pages/api/draft-mode/enable.ts` (`SANITY_API_READ_TOKEN`, `STAGING_PASSWORD`), `src/sanity/client.ts` (`SANITY_API_READ_TOKEN`).
- Datos: si `import.meta.env[name]` es un string con texto, gana ese valor. Fuera de staging no se consulta el binding y, si el build no lo traía, el resultado es `undefined`. El `import()` dinámico está en try/catch para el dev sin Workers.
- Hallazgos: —

### `src/lib/preview-auth.ts`

- Propósito: cookie HttpOnly que deja al iframe de Presentation saltarse el basic auth de staging.
- Por qué está así: la cookie de perspectiva de Sanity no es la credencial. Esta firma HMAC-SHA256 con la contraseña de staging y caduca a las 12 horas.
- Exporta: `PREVIEW_ACCESS_COOKIE` (`hiweb_preview`), `PREVIEW_ACCESS_MAX_AGE`, `signPreviewAccess`, `verifyPreviewAccess`.
- Depende de: WebCrypto.
- Lo usan: `src/components/PreviewChrome.astro` (el nombre), `src/middleware.ts` (`verifyPreviewAccess`), `src/pages/api/draft-mode/enable.ts` (firma), `disable.ts` (el nombre, para borrarla).
- Datos: valor `exp.hex`. El mensaje firmado es `hiweb-preview.${exp}`. Verificación en tiempo constante vía `crypto.subtle.verify`. Firma o expiración inválida → false.
- Hallazgos: G-05 (enable firma esta cookie; disable, en otro archivo, la borra y redirige sin comprobarla).

### `src/lib/preview-context.ts`

- Propósito: guarda la perspectiva de Presentation durante un request, sin pasar la cookie por cada loader.
- Por qué está así: `loadQuery` tiene que saber si pide drafts y stega. `AsyncLocalStorage` ata ese estado a la cadena async del middleware.
- Exporta: `PreviewState` (`perspective`, `stega`), `runWithPreview`, `getPreviewState`.
- Depende de: `node:async_hooks`.
- Lo usan: `src/middleware.ts` (`runWithPreview`), `src/sanity/lib/load-query.ts` (`getPreviewState`).
- Datos: si no hay estado o `stega` es falso, `runWithPreview` ejecuta la función sin almacenar nada. No autentica: la cookie la comprueba `preview-auth.ts` antes.
- Hallazgos: —

### `src/lib/rebuild/queue.ts`

- Propósito: una sola fila `pending` en `rebuild_requests`. El webhook la marca; el cron dispara cuando han pasado 10 minutos desde el último publish.
- Por qué está así: varios publishes seguidos deben reiniciar el reloj, no encolar diez deploys. Borrar con `requested_at` concreto evita pisar un publish que llegó mientras el cron ya leía la fila.
- Exporta: `REBUILD_DEBOUNCE_MS` (10 minutos), `markRebuildRequested`, `flushRebuildIfDue`, `readRebuildStatus`, `clearPendingRebuild`, `restorePendingRebuild`.
- Depende de: `src/lib/growth/db/d1.ts`.
- Lo usan: `flush.ts` (`flushRebuildIfDue`), `src/pages/api/sanity-webhook.ts` (`markRebuildRequested`), `src/pages/api/rebuild-status.ts` (`readRebuildStatus`, `clearPendingRebuild`, `restorePendingRebuild`).
- Datos: `INSERT … ON CONFLICT` actualiza `requested_at`. `flushRebuildIfDue` devuelve `idle`, `waiting`, `superseded`, `retry` o `fired`. Si el disparo falla o lanza, reinserta la misma marca con `ON CONFLICT DO NOTHING`. `readRebuildStatus` devuelve `queued` y `deployAt` (marca + 10 minutos) sin autenticar.
- Hallazgos: A-13, G-09 (el estado de la cola es público en la ruta que llama a `readRebuildStatus`).

### `src/lib/rebuild/dispatch.ts`

- Propósito: dispara el deploy de live. Staging no dispara.
- Por qué está así: el HTML de live nace en el build. El camino previsto es el deploy hook de Cloudflare. Si no hay hook y sí hay token de GitHub, manda `repository_dispatch` con `event_type: sanity-rebuild`. El repo por defecto de ese dispatch es `jahirgosu/hiweb-marketing-ui`.
- Exporta: `RebuildBindings`, `canDispatchRebuild`, `dispatchRebuild`.
- Depende de: nada del repo. Lee los bindings que le pasan.
- Lo usan: `flush.ts`, `src/pages/api/rebuild-status.ts`, `src/pages/api/sanity-webhook.ts` (`canDispatchRebuild`).
- Datos: `canDispatchRebuild` es falso si `PUBLIC_SITE_ENV === 'staging'` o si faltan hook y token. Con hook, POST al hook y true solo si la respuesta es OK. Sin hook, POST a `https://api.github.com/repos/${GITHUB_DISPATCH_REPO || 'jahirgosu/hiweb-marketing-ui'}/dispatches` con `Authorization: Bearer` y `X-GitHub-Api-Version: 2022-11-28`.
- Hallazgos: A-07, A-13, G-03 (el POST de `rebuild-status` llama a `dispatchRebuild` en cuanto un token de Sanity ve el proyecto).

### `src/lib/rebuild/flush.ts`

- Propósito: lo que el cron del Worker ejecuta cada minuto.
- Por qué está así: el webhook solo escribe la fila. Alguien tiene que mirar el reloj y llamar al dispatch. Ese alguien es `src/worker.ts`, y solo en el Worker que tiene el cron (live).
- Exporta: `RebuildCronEnv`, `flushDueRebuild`.
- Depende de: `src/lib/growth/db/d1.ts` (tipo), `dispatch.ts`, `queue.ts`.
- Lo usan: `src/worker.ts`.
- Datos: sin permiso de dispatch o sin `DATABASE`, devuelve `'skipped'`. Si no, el resultado de `flushRebuildIfDue`.
- Hallazgos: A-13.
