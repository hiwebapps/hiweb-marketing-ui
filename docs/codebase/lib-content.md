# `src/lib/content`

Puerta de copy del sitio. Las páginas importan el barril `index.ts`. Ese barril pide el documento a Sanity (`from-sanity.ts` → `src/sanity/queries.ts` → `loadQuery`) y lo convierte a las props de `types.ts` (`map-sanity.ts`, o un mapper local). Si Sanity no está configurado, viene vacío o lanza, varias lecturas en español caen a `from-collections.ts` (`src/content` más `src/data`). Otras lecturas tienen su respaldo en constantes de este mismo folder, en `portal-defaults.json`, o devuelven `null` y el componente usa `src/data`.

El grafo marca `index.ts` con «Lo usan: —». Las páginas, `Layout.astro`, `FinalCtaBand.astro`, `sitemap.xml.ts` y `src/lib/growth/calendar/services.ts` sí importan el barril.

## Patrón `withFallback`

Vive en `index.ts` y no se exporta. Firma: `withFallback(load, fallback, isEmpty?)`.

1. Si `isSanityConfigured()` (`src/sanity/client.ts`) es falso, devuelve `fallback()` y no avisa.
2. Si la llamada resuelve y `isEmpty` dice que el valor está vacío (lista de largo 0, documento nulo), devuelve `fallback()` y no avisa.
3. Si la llamada lanza, imprime una sola vez `[cms] Sanity unavailable (…). Using src/content fallback.` y devuelve `fallback()`. El texto del aviso nombra `src/content` aunque el respaldo de esa llamada sea `fallbackSite()`, `null` o un array vacío.

Lo usan, en español o sin locale: industrias, industria, servicios, servicio, casos, caso, posts, post, personas (ver abajo), home, about, ajustes, favicon, nav, footer, CTA, índices de catálogo, índice de industrias, legal y landings.

Quedan fuera de la función, a propósito en el código actual:

- `getIndustries`, `getIndustry`, `getServices`, `getService`, `getPosts` y `getPost` con `locale === 'en'` llaman solo a Sanity. Una excepción sale del loader. A-01.
- `getAboutCopy('en')` devuelve el documento o `{}`. A-01.
- `getPeople('en')` usa el equipo inglés si la lista trae gente. Si viene vacía, sigue con el `withFallback` español (`sanityPeople('es')` / `collectionsPeople`). Si la lectura inglesa lanza, la excepción sale igual.
- `getSitePage`, `getCalendarPage` y `getContactPage` repiten el try/catch a mano y caen a constantes de este folder. A-14.
- `getPortal` cae a `null`. La página sustituye las secciones con `portal-defaults.json`. A-14.
- `getHomeCopy` sí pasa por `withFallback` y, además, rellena huecos con `collectionsHome()` campo por campo aunque Sanity haya respondido.

## Fichas

### `src/lib/content/index.ts`

- Propósito: API que leen las páginas. Elige Sanity o respaldo y arma los `staticPaths`.
- Por qué está así: el build de live prerenderiza con el dataset publicado. Sin token, o con el dataset caído, el español de colecciones tiene que seguir saliendo. El inglés de catálogo se dejó en llamada directa: no hay colección EN en `src/content`. Home mezcla las dos fuentes porque un documento de Sanity puede traer solo algunas secciones y la página espera pilares, proceso, métricas y FAQ completos. Calendario, contacto, diagnóstico y portal no comparten el helper porque su respaldo no es `src/content`.
- Exporta: `getIndustries`, `getIndustry`, `industryStaticPaths`, `getServices`, `getService`, `serviceStaticPaths`, `getCases`, `getCase`, `caseStaticPaths`, `getPosts`, `getPost`, `postStaticPaths`, `getPeople`, `getHomeCopy`, `getAboutCopy`, `getSiteSettings`, `getFavicon`, `getNavigation`, `getFooter`, `getCtaBackdrop`, `getCatalogIndex`, `getIndustriesIndex`, `getLegalPage`, `getSitePage`, `getCalendarPage`, `getContactPage`, `getPortal`, `getLandings`, `getLanding`, `landingStaticPaths`.
- Depende de: `src/sanity/client.ts` (`isSanityConfigured`), `src/lib/site-identity.ts` (`fallbackSite`), `from-collections.ts`, `from-sanity.ts`, `hydrate-landing.ts`, `calendar-page.ts`, `contact.ts`, `types.ts`.
- Lo usan: `src/layouts/Layout.astro` (favicon, footer, nav, ajustes); `src/components/sections/FinalCtaBand.astro`; `src/pages/index.astro` y `src/pages/en/index.astro`; `src/pages/nosotros.astro` y `src/pages/en/nosotros.astro`; `src/pages/servicios/[slug].astro` y `src/pages/en/services/[slug].astro`; `src/pages/industrias/[slug].astro` y `src/pages/en/industries/[slug].astro`; `src/pages/portafolio/index.astro` y `src/pages/portafolio/[slug].astro`; `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`, `src/pages/en/blogs/index.astro`, `src/pages/en/blogs/[slug].astro`; `src/pages/calendario.astro` y `src/pages/en/calendar.astro`; `src/pages/contacto.astro`; `src/pages/portal.astro` y `src/pages/en/portal.astro`; `src/pages/terminos.astro`, `src/pages/aviso-de-privacidad.astro` y las pares `en/`; `src/pages/diagnostico-marketing-digital.astro`; `src/pages/[slug].astro`; `src/pages/sitemap.xml.ts`; `src/lib/growth/calendar/services.ts` (`getCalendarPage`).
- Datos: `SITE_PAGES` es el copy fijo de `page-calendario` y `page-diagnostico` (el diagnóstico es el que la ruta usa). `getHomeCopy` parte de `collectionsHome()` y pisa cada bloque solo si Sanity trae intro o una lista con elementos. `postStaticPaths` vuelve a pedir cada post completo. `landingStaticPaths` hidrata cada landing con catálogos. El sitemap llama `getServices()` y `getIndustries()` sin locale, así que lista el español.
- Hallazgos: A-01, A-14, D-07, S-03 (el sitemap no pide el catálogo EN porque esta API, llamada sin locale, devuelve español).

### `src/lib/content/types.ts`

- Propósito: forma de las props que consumen secciones y páginas. Un registro de colección (`IndustryRecord`, `ServiceRecord`, `CaseRecord`, `PostRecord`) y los bloques de sección (`IndustrySection`, `ServiceSection`, `CasePageSection`, `AboutSection`, `LandingSection`, `PortalSection`, `HomeCopy`, `AboutCopy`).
- Por qué está así: el schema guarda el cuerpo en `sections[]`, y varias páginas todavía leen campos planos (`heroTitle`, `faqs`, `metricas`). El tipo conserva las dos formas para que el mapper pueda preferir la sección y dejar el plano como respaldo. Los nombres mezclan español de negocio (`nombre`, `porQue`, `reto`) e inglés de UI (`heroTitle`, `tagline`).
- Exporta: tipos de FAQ (`FaqAnswer`, `FaqItem`, `FaqTextBlock`), `TitledBlock`, `ProcessPhase`, `Metric`, `SeoFields`, `IndustryRecord` y `IndustrySection`, `ServiceRecord` y `ServiceSection`, `CaseRecord` y `CasePageSection`, `PostRecord`, `PersonRecord`, `HomeCopy` y piezas de home, `AboutCopy` y `AboutSection`, `BeforeAfterBlock`, `LandingPage` y `LandingSection`, `PortalPage` y `PortalSection`, `CmsImage`.
- Depende de: `src/lib/heading.ts` (`HeadingWidth`), `@sanity/image-url` (`SanityImageSource`).
- Lo usan: `from-collections.ts`, `from-sanity.ts`, `map-sanity.ts`, `hydrate-landing.ts`, `faq-answer.ts`, `index.ts`, `src/lib/schema.ts`, `src/data/webflow-home.ts`, `src/data/webflow-services.ts`, `src/data/webflow-cases.ts`, `SectionRenderer.astro`, `BlogBody.astro`, `AboutPageSection.astro`, `IndustryPageSection.astro`, `ServicePageSection.astro`, `FaqSection.tsx`, `HomeAfterHero.tsx`, `PortalPageView.tsx`, y las páginas de blog, industrias, servicios, portafolio, portal, landings y `en/` que importan el tipo del registro.
- Datos: `FaqAnswer` es un string o Portable Text. `SeoFields` lleva `metaTitle`, `metaDescription`, `ogImage`, `noindex`, `canonicalPath`. `LandingSection` distingue `source: 'all' | 'refs'` en grillas que `hydrate-landing.ts` rellena. `PostRecord` puede traer `markdownBody` (colección) o `portableText` (Sanity). `CaseRecord.data.resultadoFrase` existe en el tipo.
- Hallazgos: D-06 (identificadores en español y en inglés en el mismo tipo), A-06 (`resultadoFrase` está en el tipo y el mapper lo lee; el schema y la query del caso no lo tienen).

### `src/lib/content/from-sanity.ts`

- Propósito: una función `sanity*` por documento. Ejecuta la GROQ de `src/sanity/queries.ts` con `loadQuery` y entrega el registro ya mapeado.
- Por qué está así: las páginas no conocen GROQ. El id del singleton inglés va en el código (`aboutPage-en`, `calendarPage-en`, `portalPage-en`, `footer-en`, `navigation-en`). Casos y landings no reciben locale: las queries filtran español. Nav y footer se arman aquí, no en `map-sanity.ts`, porque su forma es la de `nav.ts` y `footer.ts`. Legal también se aplana aquí.
- Exporta: `sanityIndustries`, `sanityIndustry`, `sanityIndustriesIndex`, `IndustriesIndexCopy`, `sanityServices`, `sanityService`, `sanityCases`, `sanityCase`, `sanityPosts`, `sanityPost`, `sanityPeople`, `sanityHome`, `sanitySitePage`, `sanityCalendarPage`, `sanityContactPage`, `sanityPortal`, `sanityAbout`, `sanityFavicon`, `SiteFavicon`, `sanitySiteIdentity`, `sanityCatalogIndex`, `CatalogIndexCopy`, `sanityLegalPage`, `LegalCopy`, `LegalSection`, `LegalBlock`, `sanityCtaBackdrop`, `sanityFooter`, `sanityNavigation`, `sanityLandings`, `sanityLanding`.
- Depende de: `src/lib/heading.ts` (`asHeadingWidth`), `src/sanity/lib/load-query.ts`, `src/sanity/queries.ts`, `calendar-page.ts`, `contact.ts`, `map-sanity.ts`, `src/lib/footer.ts` (tipos), `src/lib/site-identity.ts`, `src/lib/nav.ts` (tipos), `types.ts`.
- Lo usan: `index.ts`. `LegalDocument.tsx` importa los tipos `LegalBlock` y `LegalSection`.
- Datos: `fetchList` descarta filas sin `id` ni `name`. `sanityHome` elige `homePageEnQuery` o `homePageQuery`. `sanityPosts` puede apagar stega. `sanitySiteIdentity` rellena cada campo vacío con `fallbackSite()` y pide la query con `stega: false`. `sanityFavicon` igual, y devuelve `null` si no hay URL. `asBar` arma columnas desde `columns`; si vienen vacías, rearma industrias y servicios con `industryLinks`, `serviceGroups`, `exploreLinks` y los href de índice que la query todavía pide. `sanityFooter` devuelve `null` si no hay documento. `sanityNavigation` devuelve `null` si la barra queda vacía.
- Hallazgos: A-03 (`asBar` todavía lee el modelo viejo de la navbar), A-05 (casos y landings salen solo en español porque la query filtra `es`; este archivo no pide otro locale), A-08 (este archivo usa `siteIdentityQuery` y `siteFaviconQuery`; `siteSettingsQuery` no se llama), A-09 (calendario y contacto pasan por `mapCalendarPage` y `mapContactPage`, que no reciben el SEO completo que el schema declara).

### `src/lib/content/map-sanity.ts`

- Propósito: convierte el JSON de la query en `IndustryRecord`, `ServiceRecord`, `CaseRecord`, `PostRecord`, `PersonRecord`, `HomeCopy`, `AboutCopy`, `LandingPage` y `PortalPage`.
- Por qué está así: el documento nuevo vive en `sections`, y el documento viejo (y el fallback de colecciones) vive en campos de raíz. Cada mapper copia la raíz y, si hay sección, la prefiere para hero, métricas, proceso, FAQ y planes. Las imágenes pasan por `urlForWidth` a un solo ancho. `noindex` solo se guarda cuando el booleano es exactamente `true`.
- Exporta: `mapIndustry`, `mapService`, `mapCase`, `mapPost`, `mapPerson`, `mapHome`, `mapAbout`, `mapLandingSection`, `mapLanding`, `mapPortal`.
- Depende de: `src/lib/heading.ts` (`asHeadingWidth`), `src/sanity/image.ts` (`urlForWidth`), `types.ts`.
- Lo usan: `from-sanity.ts`.
- Datos: imagen de contenido a 1600 px, cover de post y `ogImage` a 1200, foto de persona y de autor más chicas. `canonicalPath` solo se acepta si empieza por `/` y no por `//`. `mapService` usa `doc.heroTitle` y, si falta, el título de `serviceHero`. `mapCase` lee `resultadoFrase` y, para métricas, reto, estrategia, fases y testimonio, prefiere la sección. `mapHome` recorre `sections` (`homeHero`, `homePillars`, `homeServices`, `homeIndustries`, `homeStories`, `homeProcess`, `homeMetrics`, `homeTeam`, `homeFaq`, `beforeAfter`, `homeCta`) y guarda `sectionOrder` de las que no están `hidden`. `mapPortal` acepta módulos `rrss`, `web`, `seo`, `docs`, `hilinks` y tira la sección si `hidden` es true. `mapLandingSection` traduce cada `_type` de bloque de landing; un tipo desconocido sale `null`. La lectura de un post calcula minutos con `readingMinutes` o con `bodyText` a 200 palabras.
- Hallazgos: A-02 (el mapper todavía entiende los campos planos que la query pide y el schema ya quitó), A-06 (`mapCase` asigna `resultadoFrase`), P-06 (cada imagen sale de `urlForWidth` a un ancho), S-08 (`seoOf` omite `noindex` cuando el checkbox no es `true`, y las legales hacen `?? true`).

### `src/lib/content/from-collections.ts`

- Propósito: respaldo en español cuando `withFallback` no se queda con Sanity. Lee las colecciones Astro `industrias`, `servicios`, `casos` y `posts`.
- Por qué está así: `src/content` tiene el esqueleto (sobre todo industrias y el markdown de posts). El copy largo de servicios, casos y home vive en `src/data/webflow-*.ts`, escrito por los scripts de migración. About y el equipo no tienen colección: salen de `SITE` y `TEAM_MEMBERS`.
- Exporta: `collectionsIndustries`, `collectionsServices`, `collectionsCases`, `collectionsPosts`, `collectionsPeople`, `collectionsHome`, `collectionsAbout`.
- Depende de: `astro:content` (`getCollection`), `src/data/industryServices.ts`, `src/data/site.ts`, `src/data/webflow-home.ts`, `src/data/webflow-services.ts`, `src/data/webflow-cases.ts`, `types.ts`.
- Lo usan: `index.ts`.
- Datos: industrias ordenadas por `orden`, con un blurb por servicio generado en código y SEO armado con el nombre. Servicios: si hay entrada en `WEBFLOW_SERVICES`, pisa nombre, orden, tagline, hero, cards, proceso, FAQ y SEO; si no, solo el tagline de `WEBFLOW_SERVICE_TAGLINES`. Casos: `WEBFLOW_CASES` pisa el cuerpo y mete `resultadoFrase` en el título SEO del fallback; los servicios de la ficha resuelven nombre e imagen desde la colección. Posts: cuerpo en `markdownBody`, orden por fecha descendente. Home es un `structuredClone` de `WEBFLOW_HOME`. About es un hero y un bloque de historia fijos, más el tagline de `SITE`.
- Hallazgos: A-06 (el fallback del caso usa `resultadoFrase` en `metaTitle`), A-14 y D-07 (este archivo es el respaldo de colecciones; calendario, contacto, legal, portal, nav y footer no pasan por aquí).

### `src/lib/content/hydrate-landing.ts`

- Propósito: rellena las secciones de una landing cuyo `source` no es `refs` con el catálogo ya cargado.
- Por qué está así: en Studio una grilla puede decir «todos» y guardar el array vacío. El HTML necesita los registros. Si el editor eligió referencias, el array que vino de Sanity se deja quieto.
- Exporta: `hydrateLanding`, `landingNeedsCatalogs`.
- Depende de: `types.ts`.
- Lo usan: `index.ts` (`getLanding`).
- Datos: `serviceGrid` copia id, nombre y tagline. `industryGrid` copia id, nombre, tagline y usa los títulos de `porQue` como puntos, y solo si la lista venía vacía. `caseStories` y `casePreview` reciben los `CaseRecord` enteros. `teamGrid` recibe las personas. `landingNeedsCatalogs` evita pedir un catálogo que ninguna sección usa.
- Hallazgos: A-10 (el render sigue `sections`; `templateKind` no entra en esta hidratación).

### `src/lib/content/resolve-entry.ts`

- Propósito: en el prerender la página ya trae `entry` en props. En el SSR de staging la ruta solo trae el slug y hay que buscarlo otra vez.
- Por qué está así: `stagingSsr()` apaga el prerender. Sin este helper cada plantilla repetiría el mismo `if`.
- Exporta: `resolveEntry`, `notFound` (respuesta 404 con cuerpo `Not found`).
- Depende de: nada del repo.
- Lo usan: `src/pages/[slug].astro`, `src/pages/blog/[slug].astro`, `src/pages/en/blogs/[slug].astro`, `src/pages/industrias/[slug].astro`, `src/pages/en/industries/[slug].astro`, `src/pages/servicios/[slug].astro`, `src/pages/en/services/[slug].astro`, `src/pages/portafolio/[slug].astro`. Las de blog importan `notFound`; el resto importa los dos.
- Datos: si `current` ya existe, lo devuelve. Si no hay slug, `undefined`. Si no, carga los paths y compara `params.slug`.
- Hallazgos: —

### `src/lib/content/format.ts`

- Propósito: texto corto derivado de un registro, para no repetir el formato en cada plantilla.
- Por qué está así: las métricas de un caso se muestran como valor + etiqueta, y el título de página a veces ya viene del SEO.
- Exporta: `formatCaseStat`, `pageTitle`.
- Depende de: nada.
- Lo usan: `formatCaseStat` en `SectionRenderer.astro`, `src/pages/industrias/[slug].astro`, `src/pages/en/industries/[slug].astro`, `src/pages/portafolio/[slug].astro`. `pageTitle` no tiene ningún import en el repo.
- Datos: el valor concatena `prefix`, el número (`toFixed` si hay `decimals`) y `suffix`. `pageTitle` devuelve el fallback si viene con texto, y si no `${name} — Hiweb Marketing`.
- Hallazgos: —

### `src/lib/content/faq-answer.ts`

- Propósito: una respuesta de FAQ es un string o Portable Text. Este archivo saca el texto plano (schema.org) y el árbol React (el acordeón).
- Por qué está así: el mismo campo se imprime en la página y dentro de `FAQPage`. Los enlaces del Portable Text se filtran a ruta interna, ancla, `mailto`, `tel`, `http` y `https`.
- Exporta: `faqAnswerText`, `renderFaqAnswer`.
- Depende de: `types.ts`, `react` (`createElement`).
- Lo usan: `src/components/sections/FaqSection.tsx` (los dos), `src/lib/schema.ts` (`faqAnswerText`).
- Datos: un string se devuelve tal cual, sin interpretar Markdown. Un array se aplana a párrafos; `strong` y `em` son marcas; un link externo abre en pestaña nueva con `rel="noreferrer"`.
- Hallazgos: R-05 (una respuesta guardada como Markdown se ve con la sintaxis, porque el string no se parsea).

### `src/lib/content/calendar-page.ts`

- Propósito: copy y catálogo de servicios de `/calendario` y `/en/calendar`, más el mapper del documento Sanity.
- Por qué está así: el formulario necesita etiquetas, hints y la lista de servicios aunque Sanity falle. Los ids EN no son los ids ES (coinciden con `en-slugs.ts` en los que cambian de slug). El horario real lo impone `calendar-rules.ts`; este archivo solo describe ese horario en el copy.
- Exporta: tipos `CalendarField` y `CalendarPageCopy`, `DEFAULT_CALENDAR`, `mapCalendarPage`.
- Depende de: `src/lib/growth/calendar/types.ts` (`CalendarServiceOption`).
- Lo usan: `from-sanity.ts` y `index.ts` (`getCalendarPage`). `CalendarTool.tsx` importa el tipo `CalendarPageCopy`.
- Datos: nueve servicios por idioma. `asksForWebsite` en desarrollo web. `mapCalendarPage` exige label en cada servicio; el id es `serviceId`, si no `_key`, si no el label. Si el documento no trae servicios, se quedan los de `DEFAULT_CALENDAR`. Los siete días de la semana se aceptan solo si el array trae siete strings. SEO mapeado: `metaTitle` y `metaDescription`.
- Hallazgos: A-09 (el mapper no lee `noindex`, `canonicalPath` ni `ogImage`), A-14 (el respaldo es `DEFAULT_CALENDAR`, no `src/content`).

### `src/lib/content/contact.ts`

- Propósito: copy del formulario de `/contacto` y el mapper de `contactPage`.
- Por qué está así: el formulario arma un `mailto:` en el componente. No pasa por D1 ni por n8n. El respaldo tiene que traer campos, servicios y presupuestos completos para que el JSX no reciba `null`.
- Exporta: `CONTACT_FIELD_KINDS`, `ContactFieldKind`, `ContactField`, `ContactOption`, `ContactBudget`, `ContactPageCopy`, `DEFAULT_CONTACT`, `mapContactPage`.
- Depende de: `src/data/site.ts` (`NAV_SERVICES`, para los servicios por defecto).
- Lo usan: `from-sanity.ts` y `index.ts` (`getContactPage`). `ContactForm.tsx` importa los tipos.
- Datos: ocho campos (nombre, apellido, email, teléfono, web, servicios, presupuesto, proyecto). Presupuestos fijos de 8k a 60k MXN más uno personalizado. `mapContactPage` devuelve `null` si no queda ningún campo válido; `getContactPage` entonces usa `DEFAULT_CONTACT`. Website, servicios, presupuesto y proyecto salen a ancho completo. SEO mapeado: `metaTitle`, `metaDescription`, `noindex`, `canonicalPath` (ruta que empiece por `/`).
- Hallazgos: A-09 (no entra `ogImage`), A-14, B-04 (la ruta que consume este copy no se publica: en Sanity hay un redirect de `/contacto` a `/calendario`).

### `src/lib/content/portal-defaults.json`

- Propósito: copy de reserva de `/portal` y `/en/portal` cuando `getPortal` devuelve `null` o un documento sin secciones.
- Por qué está así: el portal no tiene colección en `src/content`. El JSON imita el documento de Sanity (secciones con `_type` y `_key`) para que la página pueda usarlo como `PortalSection[]` sin otro mapper.
- Exporta: objeto con claves `es` y `en`. Cada una trae `title`, `metaTitle`, `metaDescription` y `sections`.
- Depende de: nada.
- Lo usan: `src/pages/portal.astro` y `src/pages/en/portal.astro`. `index.ts` no lo importa. La página usa las secciones remotas si el array trae elementos; si no, las de este archivo. Título y meta prefieren el SEO remoto.
- Datos: las dos lenguas tienen las mismas seis secciones, en este orden: `portalHero` (muestras `rrss`, `web`, `seo`, `docs`, `hilinks` y cliente de ejemplo Aura Café), `portalStrip`, `portalJourney` (tres pasos), `portalBento`, `portalFaq`, `portalCloser`.
- Hallazgos: A-14.
