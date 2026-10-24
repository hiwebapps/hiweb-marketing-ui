Las rutas de `src/pages` (salvo `src/pages/api`) son el sitio. `astro.config.mjs` declara `output: 'server'` y el adapter de Cloudflare. Cada plantilla de abajo exporta `prerender = true`, así el build de live la deja en HTML; el hook `stagingSsr` pone `prerender = false` en todas las rutas cuando `PUBLIC_SITE_ENV=staging`. `robots.txt.ts` y `sitemap.xml.ts` quedan en SSR en los dos entornos. El español está en la raíz y el inglés en `src/pages/en`. Antes de todo, el middleware manda con 301 las URLs inglesas viejas a la actual, en un solo salto: prefijos en español (`/en/servicios`, `/en/industrias`, `/en/portafolio`, `/en/calendario`, `/en/terminos`, `/en/aviso-de-privacidad`, `/en/nosotros`), slugs en español de servicios e industrias y los 15 slugs viejos de posts (`src/lib/legacy-en-paths.ts`). Después solo deja vivir bajo `/en` estas secciones: `/en/success-stories`, `/en/services/`, `/en/industries/`, `/en/blogs`, `/en/terms`, `/en/privacy-policy`, `/en/calendar` y `/en/portal`. Un `/en/<algo>` de un solo segmento pasa a `src/pages/en/[slug].astro` (Nosotros en inglés) y, si responde 404, redirige a `/en`. Cualquier otro `/en/…` redirige a `/en`. No hay archivo para los índices `/servicios`, `/industrias`, `/en/services` ni `/en/industries`: `astro.config.mjs` manda los españoles a `/` y el middleware los ingleses a `/en`. Los pares con `alternates` escritos en la plantilla son `/` ↔ `/en`, `/nosotros` ↔ `/en/<slug de Nosotros>`, `/blog` ↔ `/en/blogs`, `/portafolio` ↔ `/en/success-stories`, `/calendario` ↔ `/en/calendar`, `/portal` ↔ `/en/portal`, `/terminos` ↔ `/en/terms` y `/aviso-de-privacidad` ↔ `/en/privacy-policy`. Servicios, industrias, casos y posts emiten hreflang solo si el registro trae `alternateSlug`. Contacto, diagnóstico, landings, `/design-system` y `/sections` no tienen par en inglés. En servicio, industria, nosotros, caso y landing, si el documento trae `sections`, la página delega en `ServicePageSection`, `IndustryPageSection`, `AboutPageSection` o `SectionRenderer`; si el array viene vacío, la misma plantilla pinta un árbol de respaldo. El grafo marca «Lo usan: —» en todas: nadie las importa. Quien las usa es la URL.

### `src/pages/index.astro`
- Propósito: Home en español. Recorre `sectionOrder` y monta el bloque que corresponda (`homeHero`, `homePillars`, `homeServices`, `homeIndustries`, `homeStories`, `homeProcess`, `homeMetrics`, `homeTeam`, `homeFaq`, `beforeAfter`, `homeCta`).
- Por qué está así: `prerender = true`. `HeroStudioA` va con `client:load`. `IndustryGrid`, `CaseStories`, `ProcessPhases`, `MetricsBand`, `TeamGrid`, `FaqSection` y `BeforeAfter` van con `client:visible`. `PillarGrid` y `ServiceGrid` no llevan directiva. `FinalCtaBand.astro` hidrata su vista con `client:load` por dentro. No pasa `lang`. El hreflang es fijo: `es: '/'`, `en: '/en'`. El JSON-LD de FAQ sale solo si el orden incluye `homeFaq`.
- Exporta: la ruta `/` y `prerender`.
- Depende de: `src/layouts/Layout.astro`, `HeroStudioA`, `IndustryGrid`, `CaseStories`, `ProcessPhases`, `MetricsBand`, `FaqSection`, `FinalCtaBand.astro`, `PillarGrid`, `ServiceGrid`, `TeamGrid`, `BeforeAfter`, `homePillarsWithIcons` de `src/data/webflow-home.ts`, `faqSchema` de `src/lib/schema.ts`, y `getHomeCopy`, `getSiteSettings`, `getPeople`, `getIndustries`, `getServices`, `getCases` de `src/lib/content`. También el CSS de TeamGrid, FaqSection, CaseStories y MetricsBand.
- Lo usan: la URL `/`.
- Datos: `getHomeCopy()` (default `es`) mezcla el documento Sanity con `collectionsHome()`, que clona `WEBFLOW_HOME`. Si `home.hasSections` es falso, el orden fijo es hero, pilares, servicios, industrias, historias, proceso, métricas, equipo, FAQ y CTA. Cards de industria, cards de servicio y slides del hero usan el documento; si vienen vacíos, salen de `getIndustries()`, `getServices()` y `getCases()` (casos con `ogImage`, destacados primero, `localeCompare` en `es`). El equipo usa `leaders` o las primeras cuatro personas. `getPeople` pide inglés solo si `home.team.memberLocale === 'en'`. El CTA del equipo, si el documento no lo trae, es «Conoce a todo el equipo» hacia `/nosotros#nosotros`.
- Hallazgos: S-04, R-01, P-05, D-08.

### `src/pages/en/index.astro`
- Propósito: Home en inglés. El mismo recorrido de secciones que `index.astro`, con `lang="en"` y prefijos `/en/services` y `/en/industries`.
- Por qué está así: `prerender = true` y las mismas directivas de cliente que la home en español. El hreflang es el mismo par `/` ↔ `/en`. Los slides del hero siguen enlazando a `/portafolio/${id}`.
- Exporta: la ruta `/en` y `prerender`.
- Depende de: los mismos módulos que `src/pages/index.astro`, más `getIndustriesIndex` de `src/lib/content` (el grafo lo deja dentro de ese barrel; el archivo sí lo importa).
- Lo usan: la URL `/en`.
- Datos: `getHomeCopy('en')`, con el mismo relleno de `collectionsHome()`. Industrias y servicios de respaldo salen de `getIndustries('en')` y `getServices('en')`. Los casos del hero, si no hay `heroCases`, salen de `getCases()` (consulta fija en español). `getIndustriesIndex()` lee el documento `industriesIndex-en` y pasa `cardCtaLabel` a `IndustryGrid`. `getPeople` pide español solo si `memberLocale === 'es'`. El CTA del equipo, si el documento no lo trae, sigue siendo «Conoce a todo el equipo» hacia `/nosotros#nosotros`. El carrusel del hero sí recibe `cardCta`, `pauseLabel` y `playLabel` en inglés, y `CaseStories` recibe `locale="en"`.
- Hallazgos: S-03 (esta URL no entra al sitemap), S-04, R-01, R-04, D-08.

### `src/pages/nosotros.astro`
- Propósito: Página Nosotros en español. Si `about.sections` tiene elementos, pinta cada sección visible con `AboutPageSection`. Si el array está vacío, pinta hero, historia, pilares, portal, equipo, mapa y CTA.
- Por qué está así: `prerender = true`. En el árbol de respaldo, `TeamGrid` va con `client:load` y `PresenceMap` con `client:visible`. El resto de ese árbol no lleva directiva. Hreflang `/nosotros` ↔ `aboutPath('en', slug)`, con el slug del documento `aboutPage-en`.
- Exporta: la ruta `/nosotros` y `prerender`.
- Depende de: `Layout.astro`, `IndustryHero`, `AboutHistory`, `PillarGrid`, `PresenceMap`, `PortalShowcase`, `TeamGrid`, `FinalCtaBand.astro`, `AboutPageSection.astro`, `HOME_PILLARS` de `src/data/site.ts`, `breadcrumbSchema`, y `getAboutCopy`, `getPeople`, `getSiteSettings`. CSS de AboutHistory, TeamGrid y PresenceMap.
- Lo usan: la URL `/nosotros`.
- Datos: `getAboutCopy()` (español) usa Sanity y, si falla o viene vacío, `collectionsAbout()`. `getPeople` sigue `aboutTeam.memberLocale`. El respaldo fija título, imagen `/images/team/hiweb-team.png`, CTA a `/contacto`, pilares `HOME_PILLARS`, `PortalShowcase` hacia `/portal` y `/contacto`, y el mapa con `site.locales`.
- Hallazgos: D-08, S-12.

### `src/pages/en/[slug].astro`
- Propósito: Nosotros en inglés. La ruta es `/en/<slug>`, con el slug del documento `aboutPage-en` (vacío = `nosotros`, ver `aboutPath` en `src/lib/page-meta.ts`). Cualquier otro slug responde 404. Misma bifurcación por `about.sections`. El respaldo arma pilares, filtros de equipo y CTAs desde el documento, y pasa `locale="en"` a `AboutPageSection`.
- Por qué está así: `prerender = true`; `getStaticPaths` genera una sola ruta. `lang="en"`, hreflang con la ruta española. Al cambiar un slug publicado, la acción «Crear redirección» de Studio guarda la ruta vieja como `redirect`. En el respaldo, `TeamGrid` es `client:load` y `PresenceMap` es `client:visible`. Los `href` de pilares, el CTA del hero, el del equipo y el del cierre pasan por `localePath(..., 'en')`. `PortalShowcase` deja el secundario en `/contacto` (sin `localePath`) y el principal en `/en/portal`.
- Exporta: la ruta `/en/<slug>`, `getStaticPaths` y `prerender`.
- Depende de: los mismos componentes que `nosotros.astro`, más `localePath` de `src/lib/locale.ts`, `aboutPath` de `src/lib/page-meta.ts` y `notFound`. No importa `src/data/site.ts` (el grafo tampoco lo lista aquí).
- Lo usan: la URL `/en/<slug>`.
- Datos: `getAboutCopy('en')` devuelve el documento Sanity o `{}` si viene vacío: no llama a `collectionsAbout()`. Con `{}`, `sections` queda vacío y se pinta el JSX de respaldo, cuyos textos por defecto están en inglés («Collective expertise…», «Schedule your audit», «Differentiators»). `getPeople` pide español solo si `memberLocale === 'es'`.
- Hallazgos: A-01, S-05, D-08.

### `src/pages/servicios/[slug].astro`
- Propósito: Ficha de servicio en español, una ruta por slug. Con `sections`, delega en `ServicePageSection`. Sin secciones, pinta hero, overview, focus, pitch, planes, industrias, proceso, casos, FAQ y CTA.
- Por qué está así: `prerender = true`. `getStaticPaths` devuelve `serviceStaticPaths()` y `resolveEntry` relee ese listado en SSR de staging si la prop no llegó. Sin entrada, `notFound()` responde 404. Hreflang solo si hay `alternateSlug`: `/servicios/${id}` ↔ `/en/services/${alternateSlug}`. `ServiceFocus`, `ServiceWhy` (solo el id `seo`), `IndustryGrid`, `ProcessPhases`, `CaseStories` y `FaqSection` del respaldo van con `client:visible`. `FaqSection` lleva `withSchema={false}` porque el JSON-LD ya sale de `faqSchema`.
- Exporta: la ruta `/servicios/[slug]`, `prerender` y `getStaticPaths`.
- Depende de: `Layout.astro`, `getCases`, `getIndustries`, `serviceStaticPaths`, `IndustryHero`, `PillarGrid`, `ServiceFocus`, `ServicePitch`, `ServiceWhy`, `ServicePlans`, `IndustryGrid`, `ProcessPhases`, `CaseStories`, `FaqSection`, `FinalCtaBand.astro`, `ServicePageSection.astro`, `breadcrumbSchema` y `faqSchema`, `iconForServiceOverviewCard` de `src/components/icons/PillarIcons.tsx`, `serviceFocusItems`, `servicePitch`, `servicePlans`, `resolveEntry` y `notFound`. CSS de CaseStories. El tipo `BadgeVariant` sale de `src/components/ui`.
- Lo usan: la URL `/servicios/:slug`.
- Datos: el registro es `ServiceRecord`. Planes: `entry.data.planes` o `servicePlans(entry.id)`. Focus y pitch usan el mismo id contra `src/data/service-focus.ts` y `src/data/service-pitch.ts`. Casos: `getCases()` filtrados por `servicios` que referencian `entry.id`, y solo los que traen `testimonio.quote`. Industrias del grid: `getIndustries()` (español, con fallback de colección). Si hay secciones y una `serviceFaq` visible con ítems, el schema usa esos ítems; si hay secciones y no hay esa FAQ, el schema de FAQ queda vacío; si no hay secciones, usa `entry.data.faqs`. El respaldo deja el CTA en `/contacto` y el copy en español.
- Hallazgos: S-06, S-11, D-08.

### `src/pages/en/services/[slug].astro`
- Propósito: Ficha de servicio en inglés. La misma bifurcación que la española, con `locale="en"` en `ServicePageSection` y en `CaseStories`.
- Por qué está así: `prerender = true`, `getStaticPaths` llama a `serviceStaticPaths('en')`, `lang="en"`. El hreflang, si hay `alternateSlug`, invierte el par: español en `/servicios/${alternateSlug}` e inglés en `/en/services/${id}`. Las directivas de cliente del respaldo coinciden con la ficha española. `serviceContentKey(entry.id)` traduce el slug inglés a la clave de los módulos de `src/data` (focus, pitch, planes, imagen `/images/services/${contentKey}-hero.jpg`, y el caso especial `seo` de `ServiceWhy`).
- Exporta: la ruta `/en/services/[slug]`, `prerender` y `getStaticPaths`.
- Depende de: los mismos módulos que `servicios/[slug].astro`, más `serviceContentKey` de `src/lib/en-slugs.ts`.
- Lo usan: la URL `/en/services/:slug`.
- Datos: servicios del path vía `getServices('en')`, sin fallback de `src/content`. Las industrias del grid salen de `getIndustries()` sin locale, o sea el catálogo español. Los casos salen de `getCases()` si el servicio referencia `entry.id` o `contentKey`, y el enlace del caso es `/portafolio/${id}`. El respaldo conserva textos en español (`Cotiza tu proyecto`, `Cómo se entiende…`, `El servicio`, `Cómo trabajamos`) y `ctaHref="/contacto"`.
- Hallazgos: A-01, S-03, S-06, D-08.

### `src/pages/industrias/[slug].astro`
- Propósito: Ficha de industria en español. Con secciones, `IndustryPageSection` por cada bloque visible. Sin secciones, hero, pilares, servicios, casos, FAQ y CTA.
- Por qué está así: `prerender = true`. Paths con `industryStaticPaths()`. `resolveEntry` cubre el SSR de staging. 404 si no hay entrada. Hreflang solo con `alternateSlug`. En el respaldo, `CaseStories` y `FaqSection` van con `client:visible` y la FAQ lleva `withSchema={false}`. El CTA del hero apunta a `#casos`.
- Exporta: la ruta `/industrias/[slug]`, `prerender` y `getStaticPaths`.
- Depende de: `Layout.astro`, `getCases`, `getServices`, `industryStaticPaths`, `IndustryHero`, `IndustryServices`, `PillarGrid`, `CaseStories`, `FaqSection`, `FinalCtaBand.astro`, `IndustryPageSection.astro`, `breadcrumbSchema`, `faqSchema`, `industryServiceDescription` de `src/data/industryServices.ts`, `serviceContentKey` de `src/lib/en-slugs.ts`, `formatCaseStat`, `resolveEntry` y `notFound`. CSS de CaseStories, FaqSection e IndustryServices.
- Lo usan: la URL `/industrias/:slug`.
- Datos: `IndustryRecord`. Servicios del grid: `getServices()` (español, con fallback). La descripción de cada card es el blurb del documento o `industryServiceDescription(id de industria, serviceContentKey(slug), nombre)`. Casos: `getCases()` con `industria.id === entry.id`; el enlace es `/portafolio/${id}`. Imagen de hero: `entry.data.heroImage` o `/images/industries/${id}.jpg`. El schema de FAQ entra si no hay secciones o si alguna sección visible es `industryFaq`, y el cuerpo del schema es `entry.data.faqs`.
- Hallazgos: S-06, S-11, R-05, D-08.

### `src/pages/en/industries/[slug].astro`
- Propósito: Ficha de industria en inglés. Misma bifurcación. `IndustryPageSection` e `IndustryServices` reciben `hrefPrefix="/en/services"`. `CaseStories` recibe `locale="en"`.
- Por qué está así: `prerender = true`, `industryStaticPaths('en')`, `lang="en"`. Hreflang invertido respecto a la ficha española cuando hay `alternateSlug`. El respaldo no trae copy fijo en español: títulos, CTA, casos vacíos y FAQ salen de campos del registro (`heroCtaLabel`, `servicesTitle`, `casesEmpty`, `faqTitle`, `closingTitle`). Esas props pueden llegar vacías si el documento no las trae.
- Exporta: la ruta `/en/industries/[slug]`, `prerender` y `getStaticPaths`.
- Depende de: los mismos módulos que `industrias/[slug].astro`.
- Lo usan: la URL `/en/industries/:slug`.
- Datos: `getServices('en')` para las cards, sin fallback de colección. El blurb busca `item.id` y, si no está, `serviceContentKey(item.id)`. Los casos siguen siendo `getCases()` (consulta en español) enlazados a `/portafolio/${id}`. La imagen de respaldo usa el slug inglés: `/images/industries/${entry.id}.jpg`.
- Hallazgos: A-01, S-03, S-06, D-08.

### `src/pages/blog/index.astro`
- Propósito: Índice del blog en español. Hero del destacado y, debajo, `BlogIndex` con filtros por servicio.
- Por qué está así: `prerender = true`. `BlogIndex` va con `client:load`. `BlogHero` no lleva directiva. Hreflang fijo `/blog` ↔ `/en/blogs`. Las cards no traen `href` ni `hrefPrefix`.
- Exporta: la ruta `/blog` y `prerender`.
- Depende de: `Layout.astro`, `getCatalogIndex`, `getPosts`, `getServices`, `BlogHero`, `BlogIndex`, `SectionBand`, `FinalCtaBand.astro`, `breadcrumbSchema`, `postCoverUrl` de `src/lib/blog.ts`. CSS de BlogHero y BlogIndex.
- Lo usan: la URL `/blog`.
- Datos: posts con `getPosts()` (español, fallback de colección), ordenados por `fecha` descendente. La ficha de índice es `getCatalogIndex('blogIndex')`; si Sanity no la tiene, el fallback del loader es `null` y la página usa textos propios («Artículos para decidir…», «Leer artículo», «Descubrir más»). La portada es `post.coverUrl` o `postCoverUrl(id, 800, 520)`. El destacado es el post con `featured` o, si ninguno, el primero. Los filtros salen de `getServices()` ordenados por `orden`.
- Hallazgos: S-05, S-12, R-02.

### `src/pages/en/blogs/index.astro`
- Propósito: Índice del blog en inglés, en `/en/blogs` (no existe `src/pages/en/blog`).
- Por qué está así: `prerender = true`, `lang="en"`, hreflang `/blog` ↔ `/en/blogs`. `BlogIndex` es `client:load` y recibe `hrefPrefix="/en/blogs"`. Cada card trae `href: /en/blogs/${id}`. `astro.config.mjs` redirige `/en/blog` a `/en/blogs`.
- Exporta: la ruta `/en/blogs` y `prerender`.
- Depende de: los mismos módulos que `blog/index.astro`.
- Lo usan: la URL `/en/blogs`.
- Datos: `getPosts('en')` y `getServices('en')`, sin fallback de colección. El índice es `getCatalogIndex('blogIndex-en')`. Fechas en `en-US`. Textos de respaldo en inglés («Latest blogs», «Read article», «All articles»).
- Hallazgos: A-01, S-05, S-12.

### `src/pages/blog/[slug].astro`
- Propósito: Artículo en español: miga, título, autor, portada, cuerpo, TOC, relacionados y CTA.
- Por qué está así: `prerender = true`. `getStaticPaths` usa `postStaticPaths()`. Si la prop `entry` no está (SSR de staging), la página llama a `getPost(slug)` en lugar de `resolveEntry`. Sin entrada, 404. `BlogPostToc` va con `client:load`. Un `<script define:vars>` copia los ids de `headings` a los `h2` y `h3` de `[data-blog-body]`. Hreflang solo con `alternateSlug`. La portada y las miniaturas relacionadas salen con `alt=""`.
- Exporta: la ruta `/blog/[slug]`, `prerender` y `getStaticPaths`.
- Depende de: `Layout.astro`, `BlogBody.astro`, `getPost`, `getPosts`, `getSiteSettings`, `postStaticPaths`, `BlogPostToc`, `FinalCtaBand.astro`, `Button` de `src/components/ui`, `articleSchema` y `breadcrumbSchema`, `extractPortableHeadings`, `extractPostHeadings`, `postCoverUrl`, `notFound`. CSS de BlogPost. El grafo también nombra `resolve-entry.ts`: el archivo solo importa `notFound` de ahí.
- Lo usan: la URL `/blog/:slug`.
- Datos: `PostRecord`. Relacionados: `getPosts('es', { stega: false })`, se quita el actual, se ordena por fecha y se cortan cuatro. Headings desde `portableText` o, si no hay, desde `markdownBody`. El schema es breadcrumb más `articleSchema` (título, descripción, href, autor, fecha, `site.legalName`). La plantilla no pinta `faqs` del post. `FinalCta` va sin props.
- Hallazgos: S-06, S-07, S-09, S-11.

### `src/pages/en/blogs/[slug].astro`
- Propósito: Artículo en inglés. La misma pieza que el post español, con copy de plantilla en inglés y enlaces bajo `/en/blogs`.
- Por qué está así: `prerender = true`, `postStaticPaths('en')`, `lang="en"`. Sin prop, `getPost(slug, 'en')`. El hreflang, si existe, pone el español en `/blog/${alternateSlug}` y el inglés en `/en/blogs/${id}`. TOC con `client:load` y el mismo script de ids. Portada y miniaturas con `alt=""`.
- Exporta: la ruta `/en/blogs/[slug]`, `prerender` y `getStaticPaths`.
- Depende de: los mismos módulos que `blog/[slug].astro`.
- Lo usan: la URL `/en/blogs/:slug`.
- Datos: relacionados con `getPosts('en', { stega: false })`. Fechas en `en-US`. Byline «by», tarjeta «Author», lista «Related», CTA «All articles» hacia `/en/blogs`. `FinalCta` recibe el título «Want to apply this to your business?». `getPost` en inglés no cae a la colección de posts.
- Hallazgos: A-01, S-06, S-07.

### `src/pages/portafolio/index.astro`
- Propósito: Índice de casos en español. Hero y grilla filtrable por industria.
- Por qué está así: `prerender = true`. `CasesIndex` va con `client:load`. Hreflang `/portafolio` ↔ `/en/success-stories`.
- Exporta: la ruta `/portafolio` y `prerender`.
- Depende de: `Layout.astro`, `getCases`, `getCatalogIndex`, `getIndustries`, `BlogHero`, `CasesIndex`, `SectionBand`, `FinalCtaBand.astro`, `breadcrumbSchema`, `postCoverUrl`, `WEBFLOW_CASES_INDEX` de `src/data/webflow-cases.ts`. CSS de BlogHero y BlogIndex.
- Lo usan: la URL `/portafolio`. `astro.config.mjs` redirige `/work` aquí.
- Datos: `getCatalogIndex('casesIndex')`. Título y descripción: SEO del índice, si no `WEBFLOW_CASES_INDEX`, si no los campos `title` y `description` de la página. Casos de `getCases()` (fallback de colección), destacados primero y luego `localeCompare` del cliente en `es`. La imagen de la card es `seo.ogImage` o `postCoverUrl('caso-${id}', 800, 520)`. Cada card enlaza a `/portafolio/${id}`.
- Hallazgos: A-05, S-12.

### `src/pages/portafolio/[slug].astro`
- Propósito: Caso de estudio. Recorre secciones (`caseHero`, `caseContext`, `caseProcess`, `caseMetrics`, `caseTestimonial`, `caseRelated`, `beforeAfter`, `caseCta`) y descarta el bloque si le faltan fases, métricas, quote, relacionados o pares.
- Por qué está así: `prerender = true`. `caseStaticPaths()` usa el locale español por defecto. `resolveEntry` recompone la entrada en staging. 404 si no existe. Hreflang solo si hay `alternateSlug`: `/portafolio/${id}` ↔ `/en/success-stories/${alternateSlug}`. `CaseTelescopeHero` es `client:load`. `ProcessPhases`, `MetricsBand`, `CaseStories` y `BeforeAfter` son `client:visible`. El título del hero parte el nombre del cliente en dos mitades para `titleLeft` y `titleRight`.
- Exporta: la ruta `/portafolio/[slug]`, `prerender` y `getStaticPaths`.
- Depende de: `Layout.astro`, `caseStaticPaths`, `getCases`, `getIndustries`, `CaseTelescopeHero`, `SectionBand`, `SectionHeader`, `BeforeAfter`, `ProcessPhases`, `MetricsBand`, `CaseStories`, `CaseCards` de `CasesIndex`, `FinalCtaBand.astro`, `breadcrumbSchema`, `postCoverUrl`, `formatCaseStat`, `resolveEntry` y `notFound`. CSS de CaseTelescopeHero, MetricsBand, CaseStories y BlogIndex.
- Lo usan: la URL `/portafolio/:slug`.
- Datos: `CaseRecord` de `getCases()`, que filtra `locale` español en la query. Si `sections` viene vacío, la página fabrica el árbol: hero, contexto (reto y estrategia), proceso, métricas, testimonio si hay quote, relacionados y CTA «Agenda un diagnóstico similar». La imagen es `seo.ogImage`, si no la del hero de la industria, si no `postCoverUrl`. Relacionados: otros casos de la misma `industria.id`. Los servicios del contexto enlazan a `/servicios/${id}`. `imageAlt` se calcula (`heroImageAlt` de la industria o «Imagen del caso…») y se pasa al telescopio.
- Hallazgos: A-05, A-06, S-07, S-11, S-12.

### `src/pages/en/success-stories/index.astro`
- Propósito: Índice de casos en inglés. La misma grilla que `/portafolio` con textos en inglés.
- Por qué está así: `prerender = true`, `lang="en"`, hreflang `/portafolio` ↔ `/en/success-stories`. `CasesIndex` recibe las etiquetas en inglés por props y `contactHref="/en/calendar"`.
- Exporta: la ruta `/en/success-stories` y `prerender`.
- Depende de: lo mismo que `portafolio/index.astro`.
- Lo usan: la URL `/en/success-stories`. El middleware manda aquí `/en/portafolio` y `/en/marketing-portafolio`.
- Datos: `getCatalogIndex('casesIndex-en')`, `getCases('en')` y `getIndustries('en')`. Cada card enlaza a `/en/success-stories/${id}`.

### `src/pages/en/success-stories/[slug].astro`
- Propósito: Caso de estudio en inglés. El mismo recorrido de secciones que `portafolio/[slug].astro`.
- Por qué está así: `prerender = true`, `caseStaticPaths('en')`, `lang="en"`. El hreflang, si hay `alternateSlug`, apunta el español a `/portafolio/${alternateSlug}`. El árbol de respaldo y los títulos por defecto van en inglés.
- Exporta: la ruta `/en/success-stories/[slug]`, `prerender` y `getStaticPaths`.
- Depende de: lo mismo que `portafolio/[slug].astro`.
- Lo usan: la URL `/en/success-stories/:slug`.
- Datos: `getCases('en')` y `getIndustries('en')`. Relacionados: otros casos ingleses de la misma industria. Los servicios del contexto enlazan a `/en/services/${id}`; los CTA por defecto van a `/en/calendar` y `/en/success-stories`.

### `src/pages/contacto.astro`
- Propósito: Formulario de contacto en español. Al enviar, arma un `mailto:` con nombre, apellido, email, celular, sitio, servicios, presupuesto y proyecto.
- Por qué está así: `prerender = true`. `ContactForm` no lleva directiva de cliente: el HTML queda estático y el `<script>` de la página hace `preventDefault`, valida servicios y presupuesto, y asigna `window.location.href` al mailto. El destinatario es `form.dataset.email` o `hola@hiweb.marketing`. No pasa `alternates` ni `ogImage`. No existe `src/pages/en/contacto.astro`.
- Exporta: la ruta `/contacto` y `prerender`.
- Depende de: `Layout.astro`, `ContactForm`, `getContactPage`, `getSiteSettings`, `breadcrumbSchema`.
- Lo usan: la URL `/contacto`. `astro.config.mjs` redirige `/contact` a `/contacto`.
- Datos: `getContactPage()` lee Sanity y, si no hay token, falla o viene vacío, usa `DEFAULT_CONTACT` de `src/lib/content/contact.ts`. La página pasa `metaTitle`, `metaDescription`, `noindex` y `canonicalPath`. No pide imagen social.
- Hallazgos: B-04, A-09, S-05, S-12.

### `src/pages/calendario.astro`
- Propósito: Agenda en español. Monta `CalendarTool` con el copy de la página y los ajustes del sitio.
- Por qué está así: `prerender = true`. `CalendarTool` va con `client:load` porque reserva, cancela y consulta horarios por fetch. `lang="es"`. Canonical fijo `/calendario`. Hreflang `/calendario` ↔ `/en/calendar`. No pasa `noindex` ni `ogImage`.
- Exporta: la ruta `/calendario` y `prerender`.
- Depende de: `Layout.astro`, `CalendarTool`, `getCalendarPage`, `getSiteSettings`, `breadcrumbSchema`.
- Lo usan: la URL `/calendario`.
- Datos: `getCalendarPage('es')`. Sin Sanity configurado, o si la query falla o viene vacía, el loader devuelve `DEFAULT_CALENDAR.es` de `src/lib/content/calendar-page.ts`. El título visible es `page.metaTitle` o `${page.title} — Hiweb Marketing`.
- Hallazgos: A-09, S-12, R-03.

### `src/pages/en/calendar.astro`
- Propósito: La misma agenda, con copy en inglés.
- Por qué está así: `prerender = true`, `CalendarTool` con `client:load`, `lang="en"`, canonical fijo `/en/calendar`, el mismo par de hreflang. Tampoco pasa `noindex` ni `ogImage`.
- Exporta: la ruta `/en/calendar` y `prerender`.
- Depende de: los mismos módulos que `calendario.astro`.
- Lo usan: la URL `/en/calendar`.
- Datos: `getCalendarPage('en')` con respaldo `DEFAULT_CALENDAR.en`. La miga usa «Home» hacia `/en`.
- Hallazgos: A-09, S-12.

### `src/pages/diagnostico-marketing-digital.astro`
- Propósito: Landing del diagnóstico. Hero y el quiz de ocho preguntas.
- Por qué está así: `prerender = true`. `MarketingQuiz` va con `client:load` (sesión y envío por `/api/quiz`). `PageHero` no lleva directiva. Canonical fijo `/diagnostico-marketing-digital`. No pasa `alternates`, `lang`, `noindex` ni `ogImage`. No hay par en `/en`.
- Exporta: la ruta `/diagnostico-marketing-digital` y `prerender`.
- Depende de: `Layout.astro`, `PageHero`, `MarketingQuiz`, `getSitePage`, `breadcrumbSchema`.
- Lo usan: la URL `/diagnostico-marketing-digital`.
- Datos: `getSitePage('page-diagnostico')`. El respaldo está en `SITE_PAGES` dentro de `src/lib/content/index.ts` (título «Diagnóstico de marketing digital», eyebrow «Diagnóstico», meta propios). Si Sanity está configurado y la query falla o viene vacía, vuelve a ese objeto.
- Hallazgos: S-11, S-12.

### `src/pages/portal.astro`
- Propósito: Portal de clientes en español. Una isla con las secciones del documento o del JSON de respaldo.
- Por qué está así: `prerender = true`. `PortalPageView` va con `client:load` y `locale="es"`. `lang="es"`. Hreflang `/portal` ↔ `/en/portal`. Canonical: `seo.canonicalPath` o `/portal`.
- Exporta: la ruta `/portal` y `prerender`.
- Depende de: `Layout.astro`, `PortalPageView`, `getPortal`, `src/lib/content/portal-defaults.json`, el tipo `PortalSection`, `breadcrumbSchema`.
- Lo usan: la URL `/portal`.
- Datos: `getPortal('es')` devuelve `null` si Sanity no está configurado o la query lanza. Si `remote.sections` tiene longitud, se usan esas secciones; si no, `defaults.es.sections`. Título y descripción: SEO remoto o `metaTitle` / `metaDescription` del JSON (`Portal de clientes — Hiweb Marketing` en español).
- Hallazgos: S-11, S-12.

### `src/pages/en/portal.astro`
- Propósito: Portal en inglés. La misma isla con `locale="en"` y el fallback `defaults.en`.
- Por qué está así: `prerender = true`, `client:load`, `lang="en"`, hreflang del par portal, canonical `seo.canonicalPath` o `/en/portal`.
- Exporta: la ruta `/en/portal` y `prerender`.
- Depende de: los mismos módulos que `portal.astro`.
- Lo usan: la URL `/en/portal`.
- Datos: `getPortal('en')` con la misma regla de `null`. Secciones: las remotas si hay, si no `defaults.en.sections`. La miga dice «Home» hacia `/en`.
- Hallazgos: S-11, S-12.

### `src/pages/aviso-de-privacidad.astro`
- Propósito: Aviso de privacidad en español. Hero a ancho completo y `LegalDocument` con la fecha y las secciones.
- Por qué está así: `prerender = true`. Hreflang fijo con `/en/privacy-policy`. `noindex` es `page.seo.noindex ?? true`: si el documento no trae el booleano `true`, la página sigue excluida. `PageHero` y `LegalDocument` no llevan directiva de cliente.
- Exporta: la ruta `/aviso-de-privacidad` y `prerender`.
- Depende de: `Layout.astro`, `PageHero`, `SectionBand`, `LegalDocument`, `getLegalPage`, `breadcrumbSchema`, CSS de LegalDocument.
- Lo usan: la URL `/aviso-de-privacidad`.
- Datos: `getLegalPage('legal-privacy')`. El loader devuelve `null` si Sanity falla o el documento no está. Entonces el título es «Aviso de privacidad Hiweb», la descripción es el texto de la LFPDPPP escrito en la plantilla, y `sections` es `[]`.
- Hallazgos: S-05, S-08, S-12.

### `src/pages/en/privacy-policy.astro`
- Propósito: Aviso de privacidad en inglés.
- Por qué está así: igual que la versión española, con `lang="en"` y el mismo `noindex ?? true`.
- Exporta: la ruta `/en/privacy-policy` y `prerender`.
- Depende de: los mismos módulos que `aviso-de-privacidad.astro`.
- Lo usan: la URL `/en/privacy-policy`.
- Datos: `getLegalPage('legal-privacy-en')`. Título de respaldo: «Hiweb Privacy Notice». Descripción de respaldo en inglés, citando la ley federal mexicana. Secciones `[]` si no hay documento.
- Hallazgos: S-08, S-12.

### `src/pages/terminos.astro`
- Propósito: Términos y condiciones en español. La misma composición que el aviso.
- Por qué está así: `prerender = true`, hreflang `/terminos` ↔ `/en/terms`, `noindex={page?.seo?.noindex ?? true}`.
- Exporta: la ruta `/terminos` y `prerender`.
- Depende de: `Layout.astro`, `PageHero`, `SectionBand`, `LegalDocument`, `getLegalPage`, `breadcrumbSchema`, CSS de LegalDocument.
- Lo usan: la URL `/terminos`.
- Datos: `getLegalPage('legal-terms')`. Título de respaldo: «Términos y condiciones Hiweb». Descripción de respaldo sobre el uso de hiwebmarketing.com y la contratación. Secciones `[]` si el loader devuelve `null`.
- Hallazgos: S-05, S-08, S-12.

### `src/pages/en/terms.astro`
- Propósito: Términos en inglés.
- Por qué está así: `prerender = true`, `lang="en"`, el mismo par de hreflang y el mismo `noindex ?? true`.
- Exporta: la ruta `/en/terms` y `prerender`.
- Depende de: los mismos módulos que `terminos.astro`.
- Lo usan: la URL `/en/terms`.
- Datos: `getLegalPage('legal-terms-en')`. Título de respaldo: «Hiweb Terms and Conditions». Descripción de respaldo en inglés.
- Hallazgos: S-08, S-12.

### `src/pages/[slug].astro`
- Propósito: Landing de campaña u otra página suelta, en la raíz (`/nombre`). Pinta cada sección visible con `SectionRenderer`.
- Por qué está así: `prerender = true`. `getStaticPaths` pide `landingStaticPaths()` y tira los slugs de `isReservedSlug`. En la petición, si el slug está reservado o `resolveEntry` no encuentra la entrada, responde 404. No pasa `alternates` ni `lang`. No hay ruta inglesa de landings. El schema añade `faqSchema` solo si alguna sección visible es `faqSection`.
- Exporta: la ruta `/[slug]`, `prerender` y `getStaticPaths`.
- Depende de: `Layout.astro`, `SectionRenderer.astro`, `getIndustries`, `landingStaticPaths`, `resolveEntry`, `notFound`, `isReservedSlug` de `src/sanity/reservedSlugs.ts`, `breadcrumbSchema`, `faqSchema`, el tipo `LandingPage`. CSS de CaseStories, FaqSection, TeamGrid y PresenceMap.
- Lo usan: la URL `/:slug` cuando el slug no está reservado.
- Datos: `getLandings()` usa Sanity y, si falla o viene vacío, un array vacío: no hay colección de landings en `src/content`. `RESERVED_SLUGS` bloquea `servicios`, `industrias`, `portafolio`, `blog`, `nosotros`, `contacto`, `diagnostico-marketing-digital`, `calendario`, `portal`, `design-system`, `sections`, `terminos`, `aviso-de-privacidad`, `work`, `contact`, `api`, `studio`, `sitemap.xml` y `robots.txt`. La query de landings no proyecta `templateKind`; esta plantilla solo lee `sections`. Los nombres de industria para el renderer salen de `getIndustries()`.
- Hallazgos: A-05, A-10, S-11, S-12.

### `src/pages/design-system.astro`
- Propósito: Catálogo interno del kit de UI. Monta `DesignSystem` y nada más.
- Por qué está así: `prerender = true`. `client:only="react"`: el comentario del archivo dice que los CTA con BorderGlow necesitan una isla React, y esa directiva no emite HTML de la isla en el servidor. `Layout` recibe `noindex` fijo. No hay `alternates`. El slug está en `RESERVED_SLUGS`, así que una landing no puede ocuparlo.
- Exporta: la ruta `/design-system` y `prerender`.
- Depende de: `Layout.astro` y `src/components/DesignSystem.tsx`.
- Lo usan: la URL `/design-system`.
- Hallazgos: D-03, S-03, S-08.

### `src/pages/sections.astro`
- Propósito: Catálogo interno de secciones. Monta `SectionsKitPage`.
- Por qué está así: `prerender = true`, `client:only="react"`, `noindex` fijo. El comentario del archivo dice que el kit incluye `HeroSection` y `GradientWaves`. Slug reservado. No hay `alternates`.
- Exporta: la ruta `/sections` y `prerender`.
- Depende de: `Layout.astro` y `src/components/sections/SectionsKitPage.tsx`.
- Lo usan: la URL `/sections`.
- Hallazgos: D-03, S-03, S-08.

### `src/pages/robots.txt.ts`
- Propósito: Responde `robots.txt` según el host de la petición.
- Por qué está así: `prerender = false`. Tiene que leer `url.hostname` en cada request. `shouldNoIndex` mira `PUBLIC_SITE_INDEXABLE` y la lista `hiwebmarketing.com` / `www.hiwebmarketing.com`.
- Exporta: `prerender = false` y `GET`. La ruta es `/robots.txt`.
- Depende de: `shouldNoIndex` de `src/lib/seo.ts`.
- Lo usan: la URL `/robots.txt`.
- Datos: si `shouldNoIndex` es verdadero, el cuerpo es `User-agent: *` y `Disallow: /`. Si es falso, es `Allow: /` más `Sitemap: https://www.hiwebmarketing.com/sitemap.xml`. `Content-Type: text/plain` y `Cache-Control: public, max-age=0, must-revalidate`.
- Hallazgos: S-01, S-02.

### `src/pages/sitemap.xml.ts`
- Propósito: XML de URLs para QA. El comentario del archivo dice que `robots.txt` no lo anuncia mientras el sitio no es indexable.
- Por qué está así: `prerender = false`. Arma la lista en el request, con el origen de `site` (el `site` de Astro), si no `PUBLIC_SITE_URL`, si no `url.origin`. Si `shouldNoIndex(url.hostname)`, añade `X-Robots-Tag: noindex, nofollow` (esa cadena es más corta que `ROBOTS_NOINDEX` del layout). `Cache-Control: public, max-age=3600`.
- Exporta: `prerender = false` y `GET`. La ruta es `/sitemap.xml`.
- Depende de: `getIndustries`, `getServices`, `getCases`, `getPosts`, `getLandings` de `src/lib/content`, `isReservedSlug`, `shouldNoIndex`.
- Lo usan: la URL `/sitemap.xml`.
- Datos: la lista fija es `/`, `/portafolio`, `/blog`, `/nosotros`, `/en/nosotros`, `/en/blogs`, `/contacto`, `/diagnostico-marketing-digital`, `/calendario`, `/en/calendar`, `/portal` y `/en/portal`. Después suma `/servicios/${id}` y `/industrias/${id}` de `getServices()` y `getIndustries()` sin locale (español), `/portafolio/${id}`, `/blog/${id}`, `/en/blogs/${id}` de `getPosts('en')`, y `/${id}` de landings que no estén en `RESERVED_SLUGS`. Cada nodo es solo `<loc>`. No entra `/en`, ni `/en/services/…`, ni `/en/industries/…`, ni términos, ni aviso, ni `/design-system`, ni `/sections`. No se lee `seo.noindex`.
- Hallazgos: S-02, S-03.
