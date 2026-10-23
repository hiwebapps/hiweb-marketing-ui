# Studio, queries y Presentation

Todo lo de `src/sanity` que no es schema. Los tipos están en [sanity-schemas.md](./sanity-schemas.md). El workspace se llama `hiweb-web`, el host del Studio es `hiweb-web.sanity.studio`, el proyecto es `fxardjr1` y el dataset es `web-2026`. La API es `2026-09-18`.

`sanity.config.ts` (raíz, ficha en [runtime.md](./runtime.md)) engancha estas piezas: Structure, Presentation, Vision, Guía, Pendientes, Blogs, SEO y Galería. El navbar es `StudioNavbar`. El pie de tareas es `DocumentFooter`.

## Fichas

### `src/sanity/queries.ts`

- Propósito: todas las GROQ que el sitio ejecuta, más una que nadie ejecuta.
- Por qué está así: `defineQuery` deja el string estable para TypeGen. Los fragmentos (`imageProjection`, `seoProjection`, `serviceSectionsProjection`, `aboutSectionsProjection`, `industrySectionsProjection`, `caseSectionsProjection`, `navPagePath`) son `/* groq */` interpolados para no repetir la proyección de imagen y de SEO.
- Exporta: `navigationQuery`, `footerQuery`, `ctaBackdropQuery`, `siteIdentityQuery`, `catalogIndexQuery`, `legalPageQuery`, `siteFaviconQuery`, `siteSettingsQuery`, `homePageEnQuery`, `homePageQuery`, `aboutPageQuery`, `industriesQuery`, `industryBySlugQuery`, `industriesIndexQuery`, `servicesQuery`, `serviceBySlugQuery`, `casesQuery`, `caseBySlugQuery`, `postsQuery`, `postBySlugQuery`, `peopleQuery`, `landingsQuery`, `landingBySlugQuery`, `calendarPageQuery`, `portalPageQuery`, `sitePageQuery`, `contactPageQuery`, `sitemapEntriesQuery`.
- Depende de: nada del repo. Solo de `defineQuery`.
- Lo usan: `src/lib/content/from-sanity.ts`.
- Datos: documento por `_id` en home (`homePage`, `homePage-en`), about, portal, calendario, legales, navbar, footer, contacto (`contactPage` fijo), ajustes y `ctaBackdrop`. Catálogos filtran `coalesce(locale, "es") == $locale` en servicio e industria. Casos y landings filtran `== "es"` a pelo. `sitemapEntriesQuery` arma las URLs del sitemap.
- Hallazgos: C-02 y A-02. Servicio, industria, about, caso y la landing piden campos de documento que el schema ya no declara (`heroTitle`, `cards`, `proceso`, `faqs`, `planes*`, `porQue`, `metricas`, `reto`, …) y también proyectan `sections[]`. C-04. `homePageQuery` y `homePageEnQuery` no piden `_key` en `sections[]` ni en los ítems anidados. C-05 y A-05. Contacto, casos y landings en inglés no salen. A-03. `navigationQuery` pide el modelo viejo (`industryLinks`, `serviceGroups`, `exploreLinks`). A-08. `siteSettingsQuery` añade `seoProjection` y nadie en `src/` la ejecuta. A-09. Calendario y contacto no proyectan todo `seoFields`. A-10. `templateKind` no se consulta. C-10. El alterno de servicio e industria sale de `string::split(^._id, "-en")`.

### `src/sanity/client.ts`

- Propósito: cliente de lectura del sitio.
- Por qué está así: en live usa el API CDN para no gastar la cuota de API Requests del plan gratuito; el rebuild corre 10 minutos después de publicar, así que el CDN ya tiene el cambio. En staging el CDN está apagado porque no sirve drafts. En staging la perspectiva es `drafts` (hace falta token). En live es `published`. El token de staging se lee del binding del Worker, no solo de `import.meta.env`.
- Exporta: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`, `isSanityConfigured`, `createSanityClient`, `getSanityClient`.
- Depende de: `src/lib/site-env.ts`, `src/lib/runtime-env.ts`.
- Lo usan: `src/lib/content/index.ts`, `src/pages/api/draft-mode/enable.ts`, `image.ts`, `lib/load-query.ts`.
- Datos: project `fxardjr1`, dataset `web-2026`, API `2026-09-18`, si las env no dicen otra cosa. `isSanityConfigured` exige `PUBLIC_SANITY_PROJECT_ID` y `PUBLIC_SANITY_DATASET`. El cliente no enciende stega.
- Hallazgos: C-09. Stega apagado aquí es el camino público. El overlay solo se enciende en `loadQuery` cuando hay preview.

### `src/sanity/lib/load-query.ts`

- Propósito: `fetch` que el loader de contenido usa, con stega solo dentro del iframe de Presentation.
- Por qué está así: el HTML público no debe llevar caracteres invisibles. Si hay cookie de preview, pide `resultSourceMap` y stega contra `https://hiweb-web.sanity.studio`. Un filtro deja fuera `href`, `slug`, `icon`, `accent` y otros campos de lógica para que el overlay no rompa rutas.
- Exporta: `loadQuery`.
- Depende de: `src/lib/preview-context.ts`, `client.ts`.
- Lo usan: `src/lib/content/from-sanity.ts`.
- Datos: el genérico lo pone el llamador (`Record<string, unknown>` o el tipo del mapper). No usa los `*QueryResult` de `types.ts`.
- Hallazgos: C-09. `STEGA_SKIP` no incluye `metaTitle` ni `metaDescription`. Sin preview, el fetch es el del cliente (drafts en staging, published en live) y sin stega. C-04. Aunque stega esté activo, la home llega sin `_key`.

### `src/sanity/image.ts`

- Propósito: URLs de `cdn.sanity.io` para imágenes del dataset.
- Por qué está así: el builder usa el mismo project y dataset que el cliente. `auto('format')` pide un formato moderno. Un solo ancho: no hay `srcset` en este helper.
- Exporta: `urlFor`, `urlForWidth`.
- Depende de: `client.ts`.
- Lo usan: `src/components/content/PortableTextImage.astro`, `src/lib/content/map-sanity.ts`.
- Datos: `urlForWidth` devuelve `undefined` si no hay asset.
- Hallazgos: ninguno de C-01–C-12. El ancho único está anotado como P-06 en la auditoría de performance, fuera de estos dos informes.

### `src/sanity/types.ts`

- Propósito: salida commiteada de `sanity typegen generate`.
- Por qué está así: el comentario del archivo pide no editarlo a mano. Se regenera con `npm run sanity:typegen` (`sanity schema extract` y luego `typegen generate`). El extract escribe `schema.json`, que está en `.gitignore`.
- Exporta: tipos de schema (`Industry`, `HomePage`, `Service`, `Post`, `Author`, `CaseStudy`, `AboutPage`, `SiteSettings`, …) y `*QueryResult` (`HomePageQueryResult`, `IndustriesQueryResult`, `SiteSettingsQueryResult`, `SitemapEntriesQueryResult`, …).
- Depende de: nada. Es generado.
- Lo usan: nadie en `src/`. El grafo no tiene consumidores.
- Datos: el archivo describe el schema anterior al page builder. `Industry` exige `heroTitle` y `porQue` y no tiene `sections` ni `locale`. `HomePageQueryResult` proyecta `heroLead` y `process[]`.
- Hallazgos: C-01 y A-12. El typecheck no vigila el contrato entre Studio y el sitio. El build no se cae porque el front no importa estos tipos.

### `src/sanity/structure.ts`

- Propósito: el desk.
- Por qué está así: Home, Nosotros, ajustes, navbar, footer, legales, portal, contacto, calendario y el diagnóstico abren `S.document().documentId(...)` para que no se creen copias. Los listados de servicio, industria, caso, landing, testimonio y persona arman pares ES/EN con `listenQuery` en perspectiva `raw`.
- Exporta: `structure`.
- Depende de: `components/CreateEnglishPane.ts`.
- Lo usan: `sanity.config.ts`.
- Datos: ids fijos `siteSettings`, `navigation` / `navigation-en`, `footer` / `footer-en`, `homePage` / `homePage-en`, `aboutPage` / `aboutPage-en`, `contactPage` / `contactPage-en`, `calendarPage` / `calendarPage-en`, `portalPage` / `portalPage-en`, `legal-terms` / `legal-terms-en`, `legal-privacy` / `legal-privacy-en`, `page-diagnostico`, `ctaBackdrop`, `blogIndex` / `blogIndex-en`, `casesIndex` / `casesIndex-en`. Servicios e industrias salen de `listenQuery` por pares. `industriesIndex` y `servicesIndex` están en `HIDDEN_FROM_FALLBACK` y no tienen `documentId` en este archivo. `page-meta.ts` igual construye `industrias;industries-index` y `servicios;services-index`. `HIDDEN_FROM_FALLBACK` esconde el resto del listado genérico del final. El pane «crear inglés» solo está en servicio e industria.
- Hallazgos: C-06. Falta `portalPage` en `HIDDEN_FROM_FALLBACK`, así que sale otra vez al final del desk. C-05. El desk abre `contactPage-en` y el sitio no lo lee. El `<LocaleDoc[]>` de `listenQuery` es TS2558: en Sanity 6.15 ese método no es genérico. En runtime la lista sigue igual. C-10. Home, about, portal, footer y legales no pasan por `ensureEnglishPair`: el par existe si el id ya está aquí.

### `src/sanity/presentation/resolve.ts`

- Propósito: qué documento corresponde a cada URL del preview.
- Por qué está así: Presentation tiene que abrir el singleton correcto (`homePage` frente a `homePage-en`) y el slug correcto con prefijo `/en`.
- Exporta: `resolve` (`defineDocuments` / `defineLocations`).
- Depende de: nada del repo.
- Lo usan: `sanity.config.ts` (`presentationTool`).
- Datos: rutas de home, nosotros, contacto, portal, calendario, diagnóstico, legales, servicio, industria, caso, post y landing. El prefijo inglés sale de `locale` o del id que termina en `-en`.
- Hallazgos: C-05. El mapa incluye contacto, casos y landings; las queries del sitio no publican el inglés de esos tres.

### `src/sanity/presentation/SiteNavigator.ts`

- Propósito: árbol lateral del preview (`unstable_navigator`).
- Por qué está así: el editor salta de servicio a industria a caso sin volver al desk. Casos y posts respetan el locale elegido. Las landings del árbol están fijas en `locale == "es"`.
- Exporta: `SiteNavigator`.
- Depende de: nada del repo (cliente de Studio).
- Lo usan: `sanity.config.ts`.
- Datos: `NAV_QUERY` lista servicios, industrias, casos, landings y posts con slug. El panel mide entre 240 px y 360 px.
- Hallazgos: C-05. `pages` filtra `coalesce(locale, "es") == "es"`.

### `src/sanity/actions/createEnglishVersion.ts`

- Propósito: botón de traducción solo en `post`.
- Por qué está así: el par del blog es `esSlug`, no el sufijo `-en`. Si el par existe, abre el documento. Si no, crea el borrador EN.
- Exporta: `createEnglishVersion`.
- Depende de: `blog/posts.ts` (`createEnglishDraft`, `findPair`, `splitPath`).
- Lo usan: `sanity.config.ts`, en el documento `post`.
- Datos: API `2026-09-18`.
- Hallazgos: C-10. Este botón no está en servicio, industria ni en los singletons.

### `src/sanity/actions/ensureEnglishPair.ts`

- Propósito: al publicar o guardar, crea el documento `-en` si falta.
- Por qué está así: servicio e industria delegan en `ensureServiceOrIndustryEnglish` para no pisar un inglés que ya tiene copy. El resto de tipos cubiertos arma un borrador mínimo.
- Exporta: `ensureEnglishPair`.
- Depende de: `englishDraft.ts`.
- Lo usan: `sanity.config.ts`, en `service`, `industry`, `caseStudy`, `landingPage`, `testimonial`, `person`, `contactPage` y `calendarPage`.
- Datos: el id inglés es `${publishedId}-en`. No reemplaza un documento que ya existe con contenido.
- Hallazgos: C-10. No cubre home, about, portal, footer ni legales. C-05. Crear el par de contacto, caso o landing no les da URL.

### `src/sanity/actions/createRedirect.ts`

- Propósito: si el slug publicado y el del draft difieren, ofrece crear un documento `redirect`.
- Por qué está así: el cambio de slug no mueve el HTML hasta el próximo deploy. El botón deja el `from` viejo apuntando al `to` nuevo.
- Exporta: `createRedirect`.
- Depende de: `src/lib/page-meta.ts` (`pagePath`).
- Lo usan: `sanity.config.ts`, en `post`, `service`, `industry`, `caseStudy` y `landingPage`.
- Datos: el `_id` es `redirect-` más el slug normalizado. Hace falta documento publicado y draft a la vez.
- Hallazgos: el redirect entra al sitio en el build (`integrations/sanity-redirects.mjs`). Un `from` que coincide con una página Astro la tapa (B-04, en `/contacto`).

### `src/sanity/actions/completeLandingTemplate.ts`

- Propósito: rellena `sections` vacías según `templateKind`.
- Por qué está así: la plantilla es semilla. Si el editor ya guardó bloques, la acción no debe reordenar la página.
- Exporta: `completeLandingTemplate`.
- Depende de: `landingTemplate.ts`.
- Lo usan: `sanity.config.ts`, solo en `landingPage`.
- Datos: kinds `serviceLite`, `industryLite`, `campaign`. Usa `setIfMissing` / bloques de `makeLandingBlock`.
- Hallazgos: A-10. El front no lee `templateKind`. Completar la plantilla solo cambia el documento en Studio.

### `src/sanity/badges/postBadges.ts`

- Propósito: badges de traducción y de palabras en el documento `post`.
- Por qué está así: el editor ve si falta el par, si el inglés está viejo (`STALE_MS`) y cuántas palabras tiene el cuerpo, sin abrir la vista SEO.
- Exporta: `translationBadge`, `wordsBadge`.
- Depende de: `blog/posts.ts`.
- Lo usan: `sanity.config.ts`, solo si `schemaType === 'post'`.
- Datos: estado `missingEn` | `missingEs` | `stale` | `ok`. Palabras a 200 por minuto.
- Hallazgos: ninguno propio. El emparejamiento es el de C-10.

### `src/sanity/badges/seoBadges.ts`

- Propósito: checklist SEO en la cabecera del documento.
- Por qué está así: título y descripción son avisos, no errores de validación. El badge lo recuerda en la lista. La keyword solo aplica al post.
- Exporta: `seoChecklistBadge`, `keywordBadge`.
- Depende de: `src/lib/blog.ts`, `src/lib/page-meta.ts`, `blog/posts.ts`, `seo/inventory.ts`.
- Lo usan: `sanity.config.ts`. El checklist va en todos los tipos. `keywordBadge` solo en `post`.
- Datos: lee meta, slug y, en posts, la keyword.
- Hallazgos: ninguno propio.

### `src/sanity/components/CharCountInput.ts`

- Propósito: input de string o text con contador.
- Por qué está así: la meta description avisa al pasar de 155–160. No bloquea el publish.
- Exporta: `charCountInput(ideal, max)`.
- Depende de: nada del repo.
- Lo usan: `schemas/post.ts`, `schemas/shared.ts` (`metaDescription`).
- Datos: el componente pinta el largo frente al ideal y al máximo.
- Hallazgos: ninguno.

### `src/sanity/components/SerpPreview.ts`

- Propósito: input del título SEO con un avance de cómo se ve en el buscador.
- Por qué está así: el título tiene tope de aviso a 70 caracteres. Verlo junto al campo evita un meta cortado.
- Exporta: `serpTitleInput`.
- Depende de: `src/lib/page-meta.ts`.
- Lo usan: `schemas/shared.ts` (`metaTitle`).
- Datos: usa el documento para armar título y URL de muestra.
- Hallazgos: C-09. Ese string puede llevar stega en el iframe si el layout lo pinta en `<title>`.

### `src/sanity/components/NavIconInput.tsx`

- Propósito: picker visual de los iconos del navbar y de la card de servicio.
- Por qué está así: la lista `navIcons` es un string (`users`, `globe`, …). El input muestra el mismo dibujo que `NavIcon` pinta en el sitio.
- Exporta: `NavIconInput`.
- Depende de: `src/components/sections/NavIcon.tsx`.
- Lo usan: `schemas/homeSections.ts`, `schemas/navigation.ts`, `schemas/service.ts`.
- Datos: el valor guardado sigue siendo el string de la lista. Una imagen de galería (`cardIconImage`, `iconImage`) lo puede reemplazar en el sitio.
- Hallazgos: ninguno.

### `src/sanity/components/CreateEnglishPane.ts`

- Propósito: pane vacío del desk para crear el inglés de un servicio o una industria.
- Por qué está así: el par no debe crearse al abrir el español. El pane llama a `ensureServiceOrIndustryEnglish` cuando el editor entra a «English» y todavía no hay documento.
- Exporta: `CreateEnglishPane`.
- Depende de: `englishDraft.ts`.
- Lo usan: `structure.ts`.
- Datos: el id destino es el español más `-en`, en borrador.
- Hallazgos: C-10. Este pane no existe para posts ni para singletons.

### `src/sanity/components/PostSeoView.ts`

- Propósito: segunda vista del documento `post`, titulada SEO.
- Por qué está así: el formulario ya tiene el grupo SEO. Esta vista cruza el artículo con el inventario (título duplicado, description corta, alt, par de idioma) sin salir del documento.
- Exporta: `PostSeoView`.
- Depende de: `src/lib/blog.ts`, `src/lib/page-meta.ts`, `seo/inventory.ts`.
- Lo usan: `sanity.config.ts` (`defaultDocumentNode`, solo `post`).
- Datos: perspectiva del documento abierto.
- Hallazgos: el resto de tipos solo tiene el formulario.

### `src/sanity/components/ViewStagingButton.tsx`

- Propósito: abre la URL de staging del documento que está en pantalla.
- Por qué está así: el preview de Presentation pide contraseña. Este botón manda al path público de staging (`pagePath`) para ver el draft con el basic auth.
- Exporta: `ViewStagingButton`.
- Depende de: `src/lib/page-meta.ts`.
- Lo usan: `DocumentFooter.tsx`.
- Datos: origen `https://staging.hiweb.com.mx`.
- Hallazgos: C-05. Si el documento es contacto, caso o landing en inglés, el path que arma `pagePath` no tiene página.

### `src/sanity/components/DocumentFooter.tsx`

- Propósito: pie de la barra de tareas, a la izquierda de Publish.
- Por qué está así: el borrador ya se ve en staging (el cliente va en `drafts`). En www.hiwebmarketing.com aparece después de Publish y del rebuild. El texto lo dice para que el editor no espere el HTML al segundo.
- Exporta: `DocumentFooter`.
- Depende de: `ViewStagingButton.tsx`.
- Lo usan: `sanity.config.ts` (`__internal_tasks.footerAction`).
- Datos: no lee el documento. El botón sí.
- Hallazgos: A-13. El publish de live espera el cron (unos 10 minutos), no un reload inmediato.

### `src/sanity/components/StudioNavbar.tsx`

- Propósito: navbar del Studio con el estado del rebuild.
- Por qué está así: el editor publica y el HTML de live no cambia al momento. La barra consulta `https://www.hiwebmarketing.com/api/rebuild-status` y compara el manifest del Studio (`/static/create-manifest.json`, `__HIWEB_STUDIO_BUILT_AT__`) para avisar si el schema desplegado y el sitio van en builds distintos.
- Exporta: `StudioNavbar`.
- Depende de: nada del repo.
- Lo usan: `sanity.config.ts` (`studio.components.navbar`).
- Datos: guarda en `localStorage` la clave `hiweb.studioRelease.<builtAt>`.
- Hallazgos: A-13. La barra existe porque el webhook encola y el cron dispara después. G-09 (seguridad) anota que el estado del deploy es público; no está en 06 ni en 01.

### `src/sanity/englishDraft.ts`

- Propósito: crea el borrador inglés de un servicio o una industria sin reemplazar uno que ya existe.
- Por qué está así: el starter trae «New service» / «New industry». Si el español ya tiene nombre real, se copia el nombre y el slug. Si el inglés ya tiene copy, solo se rellenan slug o nombre cuando siguen siendo el placeholder.
- Exporta: `ensureServiceOrIndustryEnglish`.
- Depende de: `starters.ts`.
- Lo usan: `actions/ensureEnglishPair.ts`, `components/CreateEnglishPane.ts`.
- Datos: lee el publicado o el draft español. Escribe `drafts.${id}-en`. No toca `locale == "en"` en el documento de origen.
- Hallazgos: C-10. Un `_id` que contenga `-en` antes del sufijo parte mal el alterno en la query, no en esta función: aquí el sufijo se concatena una vez.

### `src/sanity/starters.ts`

- Propósito: documento inicial de servicio e industria, ya con `sections[]`.
- Por qué está así: un servicio nuevo debe abrir con el mismo orden de secciones que las fichas publicadas, en español o en inglés, para que el editor rellene y no arme el page builder desde cero.
- Exporta: `serviceStarter`, `industryStarter`.
- Depende de: nada del repo.
- Lo usan: `englishDraft.ts`. `sanity.config.ts` los usa como `value` de las plantillas `service-es`, `service-en`, `industry-es`, `industry-en`.
- Datos: diez secciones de servicio (hero a CTA) y las de industria (hero, why, services, cases, faq, cta). `_key` igual al `_type` porque cada sección va una vez. CTAs apuntan a `/contacto`.
- Hallazgos: el copy del starter no es el de la web vieja. Los seeds EN (`seed-services-en.ts`, `seed-industries-en.ts`) escriben otro texto.

### `src/sanity/landingTemplate.ts`

- Propósito: tres recetas de bloques para una landing nueva.
- Por qué está así: limitar los bloques por tipo de página (`serviceLite`, `industryLite`, `campaign`) evita un page builder infinito en el alta. Después el editor puede añadir el resto de `LANDING_SECTION_MEMBERS`.
- Exporta: `LandingTemplateKind`, `LANDING_TEMPLATE_TYPES`, `randomKey`, `makeLandingBlock`, `landingTemplateSections`.
- Depende de: nada del repo.
- Lo usan: `actions/completeLandingTemplate.ts`, `schemas/landingPage.ts`. `sanity.config.ts` arma las plantillas `landing-serviceLite`, `landing-industryLite`, `landing-campaign`.
- Datos: `serviceLite` lleva hero, pilares, industrias, proceso, casos, FAQ y CTA. `industryLite` cambia industrias por servicios y quita el proceso. `campaign` es hero, pilares, métricas, FAQ y CTA. El hero de campaña nace `plain`; los otros, `photo`. El CTA de ejemplo apunta a `/contacto`.
- Hallazgos: A-10. La receta no viaja al sitio. El render usa `sections`.

### `src/sanity/reservedSlugs.ts`

- Propósito: slugs que una landing no puede ocupar.
- Por qué está así: `/[slug].astro` y las rutas de archivo conviven. Si una landing se llama `blog` o `contacto`, gana la ruta equivocada o el redirect.
- Exporta: `RESERVED_SLUGS`, `isReservedSlug`.
- Depende de: nada del repo.
- Lo usan: `src/pages/sitemap.xml.ts`, `src/pages/[slug].astro`, `schemas/landingPage.ts`.
- Datos: `servicios`, `industrias`, `portafolio`, `blog`, `nosotros`, `contacto`, `diagnostico-marketing-digital`, `calendario`, `portal`, `design-system`, `sections`, `terminos`, `aviso-de-privacidad`, `work`, `contact`, `api`, `studio`, `sitemap.xml`, `robots.txt`.
- Hallazgos: B-04. Reservar `contacto` no impide que un documento `redirect` tape la página. La reserva solo valida el slug de `landingPage`.

### `src/sanity/sectionInsertMenu.ts`

- Propósito: menú de inserción de las landings, en rejilla y en lista.
- Por qué está así: los otros page builders usan solo lista. La landing tiene más bloques genéricos y las miniaturas ayudan a elegir. Los SVG están en `/static/section-previews/${type}.svg`.
- Exporta: `sectionInsertMenu`.
- Depende de: nada del repo.
- Lo usan: `schemas/landingPage.ts`.
- Datos: `filter: true`, vista `grid` con `previewImageUrl`, vista `list`.
- Hallazgos: si falta el SVG, la celda queda sin miniatura. El schema sigue insertando el bloque.

### `src/sanity/seo/inventory.ts`

- Propósito: filas de SEO que consumen el tool, el badge y la vista del post.
- Por qué está así: una sola query en perspectiva `raw` ve publicados y drafts. Empareja por tipo y por slug o por id `-en`, y marca título duplicado o description corta.
- Exporta: `SEO_TYPES`, `TYPE_LABELS`, `PAIRED_TYPES`, `SINGLE_LOCALE_TYPES`, `SeoStatus`, `SeoSource`, `SeoEntry`, `SEO_QUERY`, `normalizeHref`, `buildSeoEntries`, `duplicateTitles`, `isShortDescription`.
- Depende de: `src/lib/page-meta.ts`.
- Lo usan: `badges/seoBadges.ts`, `components/PostSeoView.ts`, `tools/seoTool.ts`.
- Datos: tipos incluidos: home, about, service, industry, case, contact, calendar, landing, post, los cuatro índices y legal. `SINGLE_LOCALE_TYPES` está vacío. El estado es `published` | `changed` | `draft`.
- Hallazgos: C-10. El inventario hereda las tres formas de emparejar idioma. No es la query del sitio.

### `src/sanity/blog/posts.ts`

- Propósito: lógica compartida del tool de blogs, de los badges y de la acción de traducir.
- Por qué está así: contar palabras, ver si el inglés está viejo y abrir el par no debe copiarse en tres componentes de Studio.
- Exporta: `STALE_MS` (10 minutos), `WORDS_PER_MINUTE` (200), tipos `PostStatus`, `TranslationStatus`, `PostRow`, `PostVersion`, `PostPair`, `POSTS_QUERY`, `publishedId`, `countWords`, `readingMinutes`, `formatWords`, `bodyText`, `translationStatus`, `TRANSLATION_LABELS`, `STATUS_LABELS`, `buildPairs`, `splitPath`, `sitePath`, `presentationPath`, `findPair`, `createEnglishDraft`.
- Depende de: nada del repo.
- Lo usan: `actions/createEnglishVersion.ts`, `badges/postBadges.ts`, `badges/seoBadges.ts`, `tools/blogsTool.ts`.
- Datos: `POSTS_QUERY` lee todos los `post` en crudo, con `pt::text(body)` y el conteo de imágenes sin alt. `sitePath` es `/blog/:slug` o `/en/blogs/:slug`. El par sale de `esSlug`, no del sufijo `-en`.
- Hallazgos: C-10. Esta es la convención del blog. Servicio e industria usan otra.

### `src/sanity/tools/guideTool.ts`

- Propósito: tool «Guía», el primero del navbar.
- Por qué está así: el desk tiene muchos singletons y dos page builders. La guía explica dónde se edita cada cosa sin abrir Vision.
- Exporta: `guideTool` (nombre `guia`).
- Depende de: nada del repo.
- Lo usan: `sanity.config.ts`.
- Datos: contenido estático del componente. No escribe en el dataset.
- Hallazgos: ninguno.

### `src/sanity/tools/pendingTool.ts`

- Propósito: tool «Pendientes», todos los borradores del dataset con publicación en lote.
- Por qué está así: el Studio no publica varios documentos a la vez y Content Releases es de plan Enterprise. El tool lista cada `drafts.*` (singletons incluidos: navbar, footer, ajustes, cierre), corre la misma validación que el formulario (`useValidationStatus` con referencias publicadas) y solo deja marcar los que no tienen errores. Publica uno por uno con `sanity.action.document.publish` e `ifDraftRevisionId`, así que un fallo no frena a los demás y un borrador que cambió a mitad no se publica.
- Exporta: `pendingTool` (nombre `pendientes`).
- Depende de: `src/lib/page-meta.ts` (`pagePath`, `publishedId`, `isEnglish`).
- Lo usan: `sanity.config.ts`.
- Datos: `DRAFTS_QUERY` en perspectiva `raw`, sin tipos `sanity.*` ni `system.*`. La última persona que editó sale del endpoint de historial (`/data/history/.../transactions/<draftId>?reverse=true&limit=1`). El nombre de los singletons sale de `SINGLETON_LABELS`, el mismo del desk.
- Hallazgos: publicar desde aquí no pasa por las acciones de documento, así que `ensureEnglishPair` no crea el par `-en`. El sitio en vivo sigue esperando el rebuild.

### `src/sanity/tools/blogsTool.ts`

- Propósito: listado de posts con estado, traducción y palabras.
- Por qué está así: la lista del desk no muestra si falta el inglés o si el cuerpo tiene imágenes sin alt. El tool lee `POSTS_QUERY` en perspectiva `raw`.
- Exporta: `blogsTool` (nombre `blogs`).
- Depende de: `blog/posts.ts`.
- Lo usan: `sanity.config.ts`.
- Datos: pares ES/EN, palabras, minutos, alt faltante.
- Hallazgos: C-10. El par es `esSlug`.

### `src/sanity/tools/seoTool.ts`

- Propósito: inventario SEO de todo el sitio dentro del Studio.
- Por qué está así: duplicados de título y descriptions cortas se ven mejor en una tabla que documento por documento.
- Exporta: `seoTool` (nombre `seo`).
- Depende de: `src/lib/page-meta.ts`, `seo/inventory.ts`.
- Lo usan: `sanity.config.ts`.
- Datos: `SEO_QUERY` en perspectiva `raw`.
- Hallazgos: no sustituye a `queries.ts`. Un campo que el sitio no proyecta (A-09) puede verse aquí y no en la página.

### `src/sanity/tools/imageGalleryTool.ts`

- Propósito: tool «Galería» para ver los assets del dataset.
- Por qué está así: iconos de navbar, fotos de casos y fondos del cierre se eligen en varios documentos. La galería los junta sin pasar por cada referencia.
- Exporta: `imageGalleryTool` (nombre `galeria`).
- Depende de: nada del repo.
- Lo usan: `sanity.config.ts`.
- Datos: lee assets con el cliente del Studio, perspectiva `raw`.
- Hallazgos: ninguno.
