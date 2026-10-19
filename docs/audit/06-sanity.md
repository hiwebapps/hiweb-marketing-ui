# 06. Sanity Studio

Fecha: 9 de octubre de 2026. Solo lectura del repo. No se tocó el schema, no se corrió `sanity deploy` ni `sanity typegen`, y no hay commit.

Comparado contra las prácticas de schema, GROQ, TypeGen, estructura, visual editing, page builder, SEO, localización y Astro (Sanity 6.15.0, dataset `web-2026`, proyecto `fxardjr1`, Studio host `hiweb-web`). El sitio puede compilar igual: Astro no usa `tsc`.

Lo que está bien y conviene no deshacer: `defineType` / `defineField` / `defineArrayMember` en casi todo el schema, iconos importados desde `@sanity/icons/<Nombre>` (el import raíz ya no existe), `seoFields` reutilizable con título y descripción opcionales, slugs únicos por idioma en servicio, industria, caso, post y landing, y singletons fijados por `_id` en la estructura.

## 1. Estado por schema

`src/sanity/schemas/index.ts` registra estos tipos. No hay documentos fuera de esta lista.

### Documentos

| Tipo | Preview | Required / slug | Grupos o fieldsets | Problemas concretos |
| --- | --- | --- | --- | --- |
| `homePage` | Sí («Home») | Sin slug. `sections` no es required | Grupos Contenido / SEO | Sin icono. Sin campo `locale`: el idioma es el `_id` (`homePage` / `homePage-en`). |
| `aboutPage` | Sí | `locale` required. Sin slug | Datos / Secciones / SEO | Sin icono. El par EN depende del id `aboutPage-en`, no de una acción de traducción. |
| `service` | Sí | `nombre`, `slug`, `locale`, `orden`, `tagline` required. Slug único por locale | Secciones / SEO | Sin icono. El page builder es el array `sections`. |
| `industry` | Sí | Igual que servicio | Datos / Secciones / SEO | Sin icono. |
| `industriesIndex` | Sí | Título required vía `headingTitleField` | Contenido / SEO | Singleton por id (`industriesIndex`, `industriesIndex-en`). |
| `servicesIndex`, `blogIndex`, `casesIndex` | Sí (factory en `catalogIndex.ts`) | Título de sección required | Contenido / SEO | Misma fábrica, tres documentos. |
| `caseStudy` | Sí | `cliente`, `slug`, `locale`, `titulo`, `resumen` required. Slug único por locale | Datos / Secciones / SEO. Fieldset «Datos de las cards» | Sin icono. `industria` es referencia, no required. |
| `landingPage` | Sí | `title`, `slug`, `locale` required. Slug único por locale y fuera de `reservedSlugs.ts` | Contenido / SEO | Plantillas `serviceLite`, `industryLite`, `campaign` en `landingTemplate.ts`. |
| `post` | Sí | `title`, `locale`, `slug`, `description`, `fecha` required. Slug único por locale | Contenido / SEO | Sin icono. `author` es referencia opcional; `autor` (string) queda como respaldo. `esSlug` solo se ve si `locale == "en"`. |
| `author` | Sí | `name`, `role`, `company`, `linkedin` required | No | `slug` existe y no es required ni único. Sin icono. |
| `person` | Sí | `name`, `role`, `category` required. `locale` oculto | No | Sin icono. El filtro de referencias sí está tipado como `ReferenceFilterResolver`. |
| `testimonial` | Sí | `client`, `quote`, `name`, `role` required | No | `locale` oculto. Stats es un objeto inline. |
| `faq` | Sí | `question` y `answer` (Portable Text, min 1) required | No | La biblioteca se usa solo si una landing apunta `faqRefs`. Las FAQ de servicio, industria y home son copias embebidas (`faqItem`), no esta referencia. |
| `contactPage` | Sí | Varios textos required | Grupos propios | `locale` oculto. La query del sitio solo lee `_id == "contactPage"`. |
| `calendarPage` | Sí | Textos required | Grupos | Par `calendarPage` / `calendarPage-en`. La query sí recibe `$id`. |
| `portalPage` | Sí | `title` required. `locale` no es required | Contenido / SEO | Aparece en Páginas y otra vez en la lista suelta: no está en `HIDDEN_FROM_FALLBACK`. |
| `legalPage` | Sí | `title` required | Contenido / SEO | Singletons `legal-terms` y `legal-privacy`, con par `-en`. |
| `sitePage` | Sí | `title` required. `slug` readOnly | Grupos | Un solo documento fijado: `page-diagnostico`. |
| `siteSettings` | Sí | `name` y contacto required | No | Singleton `siteSettings`. Muchos campos en un solo formulario, sin grupos. Sin icono. |
| `navigation` | Sí | `locale` required | No | Singleton por idioma. El filtro de páginas no cuadra con `ReferenceFilterResolver` (ver §2). |
| `footer` | Sí | Etiquetas required | No | `footer` / `footer-en`. |
| `ctaBackdrop` | Sí | La lista de imágenes no es required | No | Singleton `ctaBackdrop`. |
| `redirect` | Sí | `from` y `to` required, únicos, deben empezar por `/` | No | Entra al sitio en el próximo build (`integrations/sanity-redirects.mjs`), no en caliente. Sin icono. |

### Objetos de sección y bloques

Casi todos los bloques de `homeSections.ts`, `aboutSections.ts`, `serviceSections.ts`, `industrySections.ts`, `caseSections.ts`, `portalPage.ts` y `blocks/pageSections.ts` son `type: 'object'`, tienen preview (título de la sección) e icono, y no tienen grupos. `withVisibility()` les añade `hidden`. El array `of` abre cada bloque en diálogo (`options.modal`).

| Archivo | Tipos | Preview | Required | Problema |
| --- | --- | --- | --- | --- |
| `homeSections.ts` | `homeHero`, `homePillars`, `homeServices`, `homeIndustries`, `homeStories`, `homeProcess`, `homeMetrics`, `homeTeam`, `homeFaq`, `homeCta`, `homeServiceItem` | Sí | El título del hero y algunos ítems | El array se anota como `ArrayOfObjectsMember[]` (§2). |
| `aboutSections.ts` | `aboutHero`, `aboutHistory`, `aboutPillars`, `aboutProcess`, `aboutTeam`, `aboutMap`, `aboutCta`, `aboutPortal` | Sí | Labels de badges y pilares | Badges, columnas y filtros son objetos inline, no tipos con nombre. |
| `serviceSections.ts` | `serviceHero` … `serviceCta`, más `serviceFocusItem`, `serviceWhyCard`, `serviceIndustryItem`, `serviceProcessStep` | Sí | Títulos de cards; referencia `industry` required en la card | `serviceWhy` mete `serviceWhyStat` inline. `servicePitch.image` / `imageAlt` son la ruta vieja, al lado de `picture`. |
| `industrySections.ts` | `industryHero`, `industryWhy`, `industryServices`, `industryCases`, `industryFaq`, `industryCta`, `industryPillar` | Sí | Título y texto del pilar | |
| `caseSections.ts` | `caseHero`, `caseContext`, `caseProcess`, `caseMetrics`, `caseTestimonial`, `caseRelated`, `caseCta` | Sí | Poco required dentro del bloque | Servicios del caso son referencias dentro de `caseContext`, no del documento. |
| `portalPage.ts` | `portalHero`, `portalStrip`, `portalJourney`, `portalBento`, `portalFaq`, `portalCloser` | Sí | Módulo y título de cada sample | Samples, badges, pasos y cards son objetos inline. |
| `blocks/pageSections.ts` | `pageHero`, `pillarGrid`, `serviceGrid`, `industryGrid`, `processPhases`, `caseStories`, `casePreview`, `faqSection`, `finalCta`, `teamGrid`, `metricsBand`, `presenceMap` | Sí | Título del hero y de pilares | Segundo page builder, paralelo al de home/servicio. `pageHero.imagePosition` guarda un valor CSS (`object-position`). |
| `blocks/beforeAfter.ts` | `beforeAfter` | Sí | | Reutilizado en todos los arrays de sección. |
| `shared.ts` | `faqItem`, `servicePlan`, `titledBlock`, `processStep`, `metric`, `faqCategory`, `serviceBlurb` | Sí | Pregunta, precio del plan, título y descripción de bloques | `sectionIntro` y `cta` no tienen preview. |
| `legalPage.ts` | `legalParagraph`, `legalBullets`, `legalTerms`, `legalLines`, `legalSubsection`, `legalSection` | Sí | Texto required | Filas de términos son objetos inline. |
| `navigation.ts` | `navLink`, `navGroup`, `navBarItem` | Sí | Título y destino | `hidden` según `kind` (link vs dropdown). Correcto como toggle. |
| `footer.ts` | `footerLink` | Sí | Label y href | |
| `table.ts`, `blogTable.ts` | `table`, `blogTable` | Sí | | `blogTable` está `hidden: true` (legado del import). Celdas inline. |

### Referencias frente a embebidos

Encaja con la regla de reutilizar solo lo que se edita en otro sitio: `person`, `testimonial`, `service`, `industry`, `author` y las páginas del navbar son referencias. El cuerpo de una sección (hero, planes, FAQ de esa página) es objeto. La excepción es `faq`: existe el documento y, a la vez, copias `faqItem` dentro de servicio, industria, home y portal. Cambiar la biblioteca no cambia esas copias.

### Pares ES / EN

No está `@sanity/document-internationalization` ni un documento `locale`. El idioma es un string `es` | `en` más un `_id` que termina en `-en`.

| Mecanismo | Dónde |
| --- | --- |
| Campo `locale` + plantilla al crear | `service`, `industry`, `caseStudy`, `post`, `landingPage`, `person`, `testimonial` |
| Acción `createEnglishVersion` | Solo `post`, emparejado por `esSlug`, no por el sufijo `-en` |
| Acción `ensureEnglishPair` | `service`, `industry`, `caseStudy`, `landingPage`, `testimonial`, `person`, `contactPage`, `calendarPage` |
| Pane «crear inglés» en la estructura | Solo servicio e industria (`CreateEnglishPane`) |
| Ids fijos en la estructura | `homePage-en`, `aboutPage-en`, `portalPage-en`, `contactPage-en`, `calendarPage-en`, `footer-en`, índices y legales |

`homePage` no tiene campo `locale`. Contacto en inglés se puede crear en Studio y el sitio no lo lee (§3).

## 2. Los errores de `tsc`

`npx tsc --noEmit` sigue en 103 errores. En `src/sanity` son de tres familias. El Studio no los ejecuta: el schema es un objeto plano y los genéricos desaparecen al compilar.

### `ArrayOfObjectsMember` y `section` unknown

`aboutSections.ts` (311–321), `homeSections.ts` (323–334), `serviceSections.ts` (460–473), `industrySections.ts` (202–209), `caseSections.ts` (206–214) y `portalPage.ts` (250–257) hacen esto:

```ts
export const aboutSectionMembers: ArrayOfObjectsMember[] = [
  defineArrayMember({ type: 'aboutHero', ...dialog }),
];
```

`dialog` es `{ options: { modal: { type: 'dialog', width: 'medium' } } }`. Eso es una opción válida del miembro de array (`modal` existe en `ArrayOptions`).

El tipo importado no es ese miembro. En Sanity 6.15, `ArrayOfObjectsMember` es el estado del formulario (`kind: 'item' | 'error'`, con `key` e `index`), no el tipo del schema. El tipo del `of` es `ArrayOfType[]` en `@sanity/types`. Por eso TypeScript dice que `{ type, options.modal }` no es asignable a `ArrayOfObjectsMember` (TS2322).

Esa anotación fija el tipo de la variable. Al pasarla a `of:` en `homePage.ts` (20), `aboutPage.ts` (36), `service.ts` (108), `industry.ts` (82), `caseStudy.ts` (120) y `portalPage.ts` (302), `ArrayOfObjectsMember[]` tampoco es `ArrayOfType[]`. `defineField` deja de inferir el ítem y la validación cae en `unknown[]`. De ahí TS18046: `section` es `unknown` en `sections.map((section) => section._type)` (`homePage.ts` 26, `aboutPage.ts` 42, `service.ts` 114, `industry.ts` 88, `caseStudy.ts` 126).

En runtime el Studio abre el diálogo, valida el duplicado de sección y guarda igual. El fallo es solo el typecheck. Quitar la anotación `ArrayOfObjectsMember[]` (o anotar con el retorno de `defineArrayMember`) apaga esta cadena. No hace falta cambiar `options.modal`.

### `structure.ts` TS2558

Líneas 234, 266 y 322: `context.documentStore.listenQuery<LocaleDoc[]>(...)`.

En `@sanity/types` de esta versión, `DocumentStore.listenQuery` no es genérico. Devuelve `Observable<any>` y acepta 0 argumentos de tipo. El `<LocaleDoc[]>` es de una API anterior. En runtime la suscripción es la misma; `groupPairs` sigue recibiendo las filas. El error no apaga las listas de servicios, industrias, casos ni páginas.

### `navigation.ts` y `ReferenceFilterResolver`

Línea 39: `options.filter: pageFilter`.

`ReferenceFilterResolver` recibe `ReferenceFilterResolverContext`, cuyo `document` es `SanityDocument`. `pageFilter` declara el argumento como `{ document?: { locale?: string } }`. TypeScript rechaza el encaje porque `SanityDocument` no tiene ninguna propiedad en común con `{ locale?: string }` (los campos custom no están en el tipo del documento). En runtime Sanity sí llama la función con el documento, que tiene `locale`, y el filtro GROQ se aplica.

`person.ts` ya lo hace bien: la función está anotada como `ReferenceFilterResolver` y lee `locale` con un cast. El filtro de la navbar puede copiar ese patrón. No está roto en el Studio.

## 3. Schema, GROQ y TypeGen

Las queries exportadas de `src/sanity/queries.ts` usan `defineQuery`. Los fragmentos (`imageProjection`, `seoProjection`, `serviceSectionsProjection`, etc.) son `/* groq */` interpolados, que es el patrón previsto.

`sanity.cli.ts` tiene `typegen.path`, `schema` y `generates` (`./src/sanity/types.ts`), y no tiene `typegen.enabled: true`. Sigue existiendo `sanity-typegen.json` con la misma config; esa forma está deprecada. `schema.json` está en `.gitignore`, así que el extract no vive en el repo. `src/sanity/types.ts` sí está commiteado y no se regeneró después del page builder.

Ningún archivo de `src/` importa esos `*QueryResult`. `loadQuery` pide `Record<string, unknown>` o un genérico del llamador. El tipo viejo no rompe el build. Tampoco avisa si una query y un mapper se separan.

### Ejemplo verificado: el tipo generado todavía describe el schema viejo

`industry.ts` hoy tiene `nombre`, `slug`, `locale`, `orden`, `tagline`, `sections` y SEO. No tiene `heroTitle`, `porQue`, `faqs` ni `serviceBlurbs`.

`src/sanity/types.ts` 207–247 sigue tipando `Industry` con `heroTitle: string`, `porQue`, `faqs` y `serviceBlurbs`, y sin `sections` ni `locale`.

El comentario de la query generada (línea 682) sigue siendo el filtro sin `locale` y la proyección plana `heroTitle, porQue[]{ title, description }`. La query actual está en `queries.ts` 730–743: filtra `coalesce(locale, "es") == $locale` y arma el cuerpo con `industryBodyProjection`.

Lo mismo en home, about, service y case: `HomePageQueryResult` (línea 589) proyecta `heroTitle`, `heroLead`, `process[]` y `faqCategories[]`. `homePageQuery` (línea 440) proyecta `sections[]`.

### Ejemplo verificado: la query pide campos que el schema ya no declara

GROQ no falla si el campo no existe: devuelve `null` y el `coalesce` sigue. Esos nombres ya no se editan.

| Query | Campos que el schema del documento ya no tiene | Dónde vive ahora |
| --- | --- | --- |
| `servicesQuery` / `serviceBySlugQuery` (786–832) | `heroTitle`, `heroDescription`, `heroImage`, `heroBadge`, `cards`, `proceso`, `faqs`, `planesEyebrow`, `planesTitle`, `planes[]` | `sections[]` (`serviceHero`, `serviceOverview`, `serviceProcess`, `serviceFaq`, `servicePlans`) |
| `industriesQuery` (687–726) | Fallback `heroTitle`, `porQue`, `faqs`, `serviceBlurbs`, `retos` | `sections[_type == "industryHero" \| "industryWhy" \| …]` |
| `aboutPageQuery` (596) | Fallback `heroTitle`, `heroDescription` | `sections[_type == "aboutHero"]` |
| `casesQuery` (899–916) | Fallback `metricas`, `reto`, `estrategia`, `fases`, `testimonio`, `anio`, `imagenesProyecto`, `servicios` | `caseMetrics`, `caseContext`, `caseProcess`, `caseTestimonial`, `caseHero` |
| `landingBySlugQuery` (1052) | `industries[]-> { porQue[]{ title } }` | `industry.sections[_type == "industryWhy"].pillars` |

`serviceBySlugQuery` proyecta las dos cosas: los campos raíz viejos y `serviceSectionsProjection`. El mapper en `src/lib/content/map-sanity.ts` aún hace `doc.heroTitle || hero.title`. Si un documento solo tuviera el hero dentro de `sections`, el sitio se salva en JavaScript. Si un documento viejo solo tuviera `heroTitle` en la raíz, Studio ya no muestra ese campo: el dato queda fuera del formulario. Eso es lo que el ciclo deprecated → hidden → quitar evita, y aquí el campo se quitó del schema con la query todavía apuntando a él.

### Ejemplo verificado: la query no trae `_key` en la home

`serviceSectionsProjection`, `aboutSectionsProjection`, `caseSectionsProjection` y `portalPageQuery` piden `_key` en `sections[]`. `homePageQuery` (441–444) y `homePageEnQuery` (367–370) piden `_type`, `hidden` y `headingWidth`, y no `_key`. Los `items[]` anidados de pilares, proceso y FAQ de la home tampoco lo piden. Sin `_key`, el overlay de Presentation no puede señalar el bloque, y un `key` de React por índice se desalinea al reordenar.

### Campos de schema que ninguna query de `queries.ts` pide

- `author.slug`, `author.company` (el post solo desreferencia `author->name`).
- `post.readingMinutes`, `post.esSlug` (el alterno se calcula en la query del post, pero `esSlug` entra al filtro, no a la proyección pública).
- `redirect` no está en `queries.ts`; lo lee `integrations/sanity-redirects.mjs` en el build.
- `faq` como documento no tiene query de listado. Solo entra si `landingBySlugQuery` expande `faqRefs`.
- `contactPage` con `_id == "contactPage-en"` no tiene query. La única página es `src/pages/contacto.astro`.
- `casesQuery` y `landingBySlugQuery` filtran `coalesce(locale, "es") == "es"`. Un caso o una landing en inglés no salen por esas queries.
- `canonicalPath` sí viaja en `seoProjection`. `noindex` también.

## 4. Studio

`sanity.config.ts` arma el workspace `hiweb-web` con Structure, Presentation y Vision (`2026-09-18`). El orden de tools es Guía, Structure, Blogs, SEO, Presentation, Galería, Vision. El navbar es `StudioNavbar`. El footer interno de tareas es `DocumentFooter`.

`sanity.cli.ts` fija `studioHost: 'hiweb-web'` y `deployment.appId` con `autoUpdates: true`. El deploy del Studio no forma parte de este informe.

### Estructura

`structure.ts` cumple el patrón de singleton: Home, Nosotros, ajustes, navbar, footer y legales abren `S.document().documentId(...)`. Los listados genéricos excluyen `HIDDEN_FROM_FALLBACK`. Falta `portalPage` en esa lista, así que el tipo sale también al final del desk.

Las listas de servicio, industria, caso, landing, testimonio y persona arman pares ES/EN con `listenQuery` en perspectiva `raw`. El type argument sobra (§2); la lista en sí está bien planteada.

El documento `post` tiene una segunda vista SEO (`PostSeoView`). El resto solo tiene el formulario.

### Acciones, badges, componentes, tools

| Pieza | Qué hace |
| --- | --- |
| `actions/createEnglishVersion.ts` | Solo posts. Abre el par o crea el borrador EN. |
| `actions/ensureEnglishPair.ts` | Crea el documento `-en` al publicar o guardar los tipos listados en el config. |
| `actions/createRedirect.ts` | En post, servicio, industria, caso y landing. |
| `actions/completeLandingTemplate.ts` | Rellena `sections` según `templateKind`. |
| `badges/postBadges.ts` | Traducción y palabras, solo en `post`. |
| `badges/seoBadges.ts` | Checklist SEO en todos; keyword solo en `post`. |
| `components/CharCountInput.ts`, `SerpPreview.ts` | Límites de meta (aviso, no error). Alineado con SEO: el override es opcional. |
| `components/NavIconInput.tsx` | Icono del navbar y de la card de servicio. |
| `components/CreateEnglishPane.ts` | Pane vacío para crear el EN de servicio o industria. |
| `components/ViewStagingButton.tsx`, `StudioNavbar.tsx`, `DocumentFooter.tsx` | Chrome del Studio. |
| `tools/guideTool.ts`, `blogsTool.ts`, `seoTool.ts`, `imageGalleryTool.ts` | Guía, listado de posts, inventario SEO y galería. Leen con perspectiva `raw`. |
| `presentation/resolve.ts` | `defineDocuments` / `defineLocations` para home, nosotros, contacto, portal, calendario, diagnóstico, legales, servicio, industria, caso, post y landing, con prefijo `/en`. |
| `presentation/SiteNavigator.ts` | Árbol del preview. Casos y posts respetan el locale. Las landings del árbol están fijas en español (`locale == "es"`). |
| `sectionInsertMenu.ts` | Rejilla de landings. Las miniaturas salen de `/static/section-previews/${type}.svg`. Los otros page builders usan solo lista. |
| `starters.ts` | Documento inicial de servicio e industria, ya con `sections[]`. |
| `reservedSlugs.ts` | Slugs de rutas Astro que una landing no puede ocupar. |
| `landingTemplate.ts` | Tres recetas de bloques. Coherente con «limitar bloques por tipo de documento». |

Hay dos familias de page builder: bloques `page*` para landings y bloques `home*` / `service*` / `industry*` / `case*` / `about*` / `portal*` para cada plantilla fija. No es un único `pageBuilder` reutilizado. Para páginas de fórmula cerrada es aceptable. El coste es el doble de tipos y de proyecciones GROQ.

Campos de presentación que la guía desaconseja, porque un rediseño los dejaría sin sentido: `headingWidth`, `accent`, `badgeVariant` y `pageHero.imagePosition`. Están en muchos bloques. No impiden editar. Si el diseño sigue congelado, son controles de maquetación metidos en el contenido.

## 5. Visual editing y drafts

`astro.config.mjs` (71–74) deja `stega.enabled: false` en `@sanity/astro` y guarda `studioUrl: https://hiweb-web.sanity.studio`. El cliente de `src/sanity/client.ts` no enciende stega. En staging usa `perspective: 'drafts'` para cualquier request; en vivo usa `published`. Hace falta el token de lectura. Staging es SSR (`deploy-staging.yml`): un draft se ve sin reconstruir el sitio. En vivo, el HTML prerenderizado no incluye drafts.

El clic para editar no sale de esa integración. Sale de este camino:

1. Presentation abre `https://staging.hiweb.com.mx` (`previewUrl.initial`). Staging pide usuario y contraseña, salvo la cookie de preview.
2. `GET /api/draft-mode/enable` solo existe en staging (`enable.ts` responde 404 fuera). Valida el secret, guarda la cookie de perspectiva y la cookie de acceso al preview.
3. `middleware.ts` deja pasar el iframe si esa cookie firma la contraseña de staging, y mete el estado de preview en la request.
4. `load-query.ts` solo entonces pide `resultSourceMap` y stega, con un filtro que no toca `href`, `slug`, `icon`, `accent` y otros campos de lógica. Si no hay preview, el fetch es el del cliente (drafts en staging, published en vivo) y sin stega.
5. `PreviewChrome.astro` monta `<VisualEditing>` solo si están las dos cookies. El componente, además, no pinta nada si la ventana no está en un iframe.
6. `SanityVisualEditing.tsx` recarga la página entera al cambiar la perspectiva o al refrescar. No hay query por bloque ni actualización parcial.

Qué queda a medias:

- Stega apagado en la integración es correcto para que el HTML público no lleve caracteres invisibles. El overlay depende del camino de arriba, no de `stega.enabled`.
- Sin `_key` en la home, el overlay no puede anclar esas secciones.
- El refresh es un reload. No hay live content por bloque.
- `metaTitle` y `metaDescription` no están en `STEGA_SKIP`. En el iframe de Presentation pueden colarse en `<title>` si el layout usa el mismo fetch. Staging está en noindex; el riesgo es la vista previa, no el índice.
- Contacto, casos y landings en inglés no tienen la misma query que el documento que el editor ve en el par.
- `/api/draft-mode/enable` no existe en el Worker de producción. Presentation apunta a staging a propósito.

Drafts en staging, para quien pasa el basic auth: se ven, porque el cliente ya va en `drafts`. El overlay y la cookie de perspectiva solo aparecen después de entrar por Presentation.

## 6. `scripts/sanity`

| Script | Escritura | ¿Correr otra vez? |
| --- | --- | --- |
| `seed-from-collections.ts` | Dry-run. Escribe con `--write` (`createOrReplace`) | No. Semilla inicial desde las colecciones. |
| `import-production-posts.ts` | Dry-run / `--write` | No. Copia única de posts de producción a `web-2026`. |
| `import-en-blogs.mjs` | Dry-run / `--write`. También marca `locale: es` en posts sin idioma | No. Import del blog EN y puede reescribir ids. |
| `rebuild-post-tables.ts` | Dry-run / `--write` | No, salvo un cuerpo de post aún con la tabla vieja. |
| `write-webflow-home.ts`, `write-webflow-services.ts`, `write-webflow-cases.ts` | Dry-run / `--write` | No. Pisan home, servicios o casos con el volcado de Webflow. `write-webflow-cases.ts` además borra documentos que ya no vienen en el volcado. |
| `scrape-webflow-services.ts`, `scrape-webflow-cases.ts` | No escriben en Sanity. Bajan HTML | No hace falta. Son el paso anterior al generador. |
| `generate-webflow-services.ts`, `generate-webflow-cases.ts` | No escriben en Sanity. Regeneran `src/data` y, el de casos, contenido local | No. Machacan el volcado curado. |
| `migrate-home-sections.ts` | No escribe. Sale con código 1 | Retirado. El comentario manda a `migrate-home-builder.ts`. |
| `migrate-home-builder.ts` | Dry-run / `--write`. Pasa campos planos a `sections[]` y hace `unset` | No, si la home ya vive en `sections`. |
| `write-home` no está; sí `seed-home-en.ts`, `seed-about-en.ts`, `seed-services-en.ts`, `seed-industries-en.ts` | Dry-run / `--write` (`createOrReplace` del par `-en`) | No. Reemplazan el documento EN entero. |
| `write-about-sections.ts`, `write-industry-sections.ts`, `write-service-sections.ts`, `write-case-sections.ts` | Dry-run / `--write`. Algunos hacen `unset` de campos raíz | No. One-shot del pase a secciones. |
| `write-service-plans.ts`, `add-missing-service-sections.ts`, `fill-service-section-controls.ts`, `fill-industry-bullets.ts`, `unset-service-legacy-fields.ts`, `move-case-services.ts` | Dry-run / `--write` | No. Parches de la misma migración. `unset-service-legacy-fields.ts` borra campos. |
| `seed-authors.ts`, `seed-navigation.ts` | Dry-run / `--write` | No como rutina. `seed-navigation.ts` reescribe el navbar y quita campos sueltos. |
| `align-en-slugs.mjs` | Dry-run / `--write` (`createOrReplace`) | No, salvo un slug EN concreto y revisado. |
| `seed-contact-page.mjs` | Siempre. `createOrReplace` de `contactPage`. No mira `--write` | No. Cada ejecución publica el contacto en español. |
| `register-worker-webhook.mjs` | Siempre. Crea un webhook y puede crear un token viewer. El propio archivo dice que no se vuelva a correr | No. |

## Hallazgos

### C-01. `types.ts` describe un Sanity que el schema ya no es

- Severidad: Alta
- Archivo: `src/sanity/types.ts:207-247` y `:682`; `sanity.cli.ts:30-34`; `sanity-typegen.json`; `src/sanity/schemas/industry.ts:14-93`; `src/sanity/queries.ts:730-743`
- Evidencia: `Industry` generado exige `heroTitle` y `porQue` y no tiene `sections` ni `locale`. El comentario de `IndustriesQueryResult` es la query plana, sin filtro de idioma. La query viva filtra `locale` y lee `sections`. `HomePageQueryResult` todavía proyecta `heroLead` y `process[]`; `homePageQuery` proyecta `sections[]`. `typegen.enabled` no está. `sanity-typegen.json` sigue en el repo. Ningún módulo importa esos `QueryResult`.
- Impacto: El typecheck no vigila el contrato entre Studio y el sitio. Un campo nuevo en el schema no aparece en el tipo, y un campo borrado sigue pareciendo obligatorio. El build no se cae porque el front castea a `unknown`.
- Corrección propuesta: Borrar `sanity-typegen.json`, dejar la config solo en `sanity.cli.ts` y regenerar con `npm run sanity:typegen` cuando se decida actualizar tipos. Hasta entonces, no usar `src/sanity/types.ts` como mapa del contenido.
- Esfuerzo: medio

### C-02. Las queries aún leen campos que el formulario ya no tiene

- Severidad: Alta
- Archivo: `src/sanity/queries.ts:786-832` (servicio), `:687-726` (industria), `:596` (about), `:899-916` (caso), `:1052` (landing); schemas `service.ts`, `industry.ts`, `aboutPage.ts`, `caseStudy.ts`
- Evidencia: `service.ts` no declara `heroTitle`, `cards`, `proceso`, `faqs` ni `planes[]`. `serviceBySlugQuery` los proyecta igual, y además proyecta `sections`. `industry` no declara `porQue`; la landing hace `industries[]->{ porQue[]{ title } }`. Los `coalesce` usan el campo raíz como respaldo del bloque.
- Impacto: Un documento migrado se lee por `sections` y el fallback sale `null`: el sitio aguanta. Un documento que solo tenga el campo viejo sigue pintando por GROQ, pero el editor ya no ve ese campo. No hay `deprecated` ni `hidden` de transición.
- Corrección propuesta: Cuando se confirme que ningún documento publicado depende del campo raíz, quitar esos nombres de la proyección y dejar la ruta `sections[]`. Mientras tanto, no borrar datos en Content Lake.
- Esfuerzo: medio

### C-03. El array de secciones está anotado con el tipo del formulario

- Severidad: Alta
- Archivo: `src/sanity/schemas/serviceSections.ts:460-473` (y los mismos arrays en `homeSections.ts:323`, `aboutSections.ts:311`, `industrySections.ts:202`, `caseSections.ts:206`, `portalPage.ts:250`); uso en `service.ts:108-114`, `homePage.ts:20-26`, `aboutPage.ts:36-42`, `industry.ts:82-88`, `caseStudy.ts:120-126`
- Evidencia: TS2322, `{ type, options.modal }` no es `ArrayOfObjectsMember`. TS2322 otra vez al pasar ese array a `of`. TS18046, `section` es `unknown` en la validación de duplicados. `ArrayOfObjectsMember` en Sanity 6.15 es `kind: 'item' | 'error'`, no el miembro de `defineArrayMember`. `options.modal` sí es opción de schema.
- Impacto: `tsc` no puede usarse como red. El Studio evalúa el objeto igual: el diálogo, el insert menu y la validación corren.
- Corrección propuesta: Quitar la anotación `ArrayOfObjectsMember[]` y dejar que `defineArrayMember` infiera el miembro. No hace falta cambiar el modal.
- Esfuerzo: bajo

### C-04. La home no pide `_key` y el overlay no puede señalar el bloque

- Severidad: Media
- Archivo: `src/sanity/queries.ts:366-370` y `:440-444`. Contraste: `:60-63` (`serviceSectionsProjection` sí pide `_key`)
- Evidencia: `sections[]` de `homePageQuery` y `homePageEnQuery` selecciona `_type`, `hidden`, `headingWidth` y no `_key`. Los `items[]` de pilares, proceso y FAQ de la home tampoco. Portal (`PortalPageView.tsx`) usa el índice como `key` de React.
- Impacto: Reordenar secciones de la home dentro de Presentation no tiene ancla estable. El clic para editar esa lista queda a medias aunque stega esté activo.
- Corrección propuesta: Añadir `_key` en cada array de la proyección de home (y en los ítems anidados) y usarlo como `key` al renderizar.
- Esfuerzo: bajo

### C-05. El par en inglés de contacto, casos y landings no llega al sitio

- Severidad: Media
- Archivo: `src/sanity/queries.ts:910-911`, `:1031-1032`, `:1154`; `src/sanity/structure.ts:517`; `src/pages/contacto.astro`; `src/sanity/presentation/SiteNavigator.ts:42`
- Evidencia: La estructura abre `contactPage-en`, pero `contactPageQuery` fija `_id == "contactPage"` y solo existe `/contacto`. `casesQuery` y `landingBySlugQuery` exigen `locale == "es"`. El navegador de Presentation lista landings solo en español. Posts, servicios, industrias, home, nosotros, portal y calendario sí tienen rama EN.
- Impacto: Un editor puede publicar contacto, un caso o una landing en inglés y no verlos en el sitio. No es un fallo del schema: la query no los pide.
- Corrección propuesta: Decidir si esos tres tipos tienen URL en inglés. Si no, no ofrecer el par en la estructura. Si sí, parametrizar la query con `$locale` como ya hacen servicio e industria.
- Esfuerzo: medio

### C-06. `portalPage` sale dos veces en el desk

- Severidad: Baja
- Archivo: `src/sanity/structure.ts:15-115` y `:671`; el par está en `:541`
- Evidencia: `HIDDEN_FROM_FALLBACK` no incluye `portalPage`. `S.documentTypeListItems()` lo vuelve a listar después de Blog y Equipo.
- Impacto: Dos entradas para el mismo documento. Confunde, no pierde datos.
- Corrección propuesta: Añadir `portalPage` (y cualquier documento nuevo) a esa lista.
- Esfuerzo: bajo

### C-07. Dos scripts escriben en Sanity sin `--write`

- Severidad: Alta
- Archivo: `scripts/sanity/seed-contact-page.mjs:98`; `scripts/sanity/register-worker-webhook.mjs:1-49`
- Evidencia: El seed de contacto hace `createOrReplace` en cuanto se ejecuta. El registro del webhook crea un hook nuevo y puede crear un token; el comentario del archivo pide no correrlo otra vez. El resto de scripts de contenido exigen `--write` y por defecto solo imprimen.
- Impacto: Un `node scripts/sanity/seed-contact-page.mjs` publica encima del contacto en español. Un segundo webhook duplica el rebuild y genera otro secreto.
- Corrección propuesta: El seed de contacto debería exigir `--write`, igual que `seed-home-en.ts`. El webhook no debería volver a ejecutarse; si hace falta cambiar el filtro, editar el hook que ya existe.
- Esfuerzo: bajo

### C-08. Los scripts de Webflow reescriben documentos enteros

- Severidad: Media
- Archivo: `scripts/sanity/write-webflow-cases.ts:136-141`; `write-webflow-home.ts`; `write-webflow-services.ts`; `import-production-posts.ts`; `import-en-blogs.mjs`; `migrate-home-builder.ts`; `unset-service-legacy-fields.ts`
- Evidencia: Con `--write`, casos hace `createOrReplace` y `delete` de lo que ya no está en el volcado. Home y servicios hacen `patch` o replace desde el HTML viejo. `unset-service-legacy-fields.ts` borra campos. `migrate-home-sections.ts` ya está retirado y termina en error.
- Impacto: Volver a correrlos pisa lo editado en Studio desde la migración.
- Corrección propuesta: Dejarlos como historial. No engancharlos a npm scripts de uso diario. El comentario de retirada de `migrate-home-sections.ts` es el modelo.
- Esfuerzo: bajo

### C-09. Presentation recarga la página y stega no cubre el SEO del iframe

- Severidad: Media
- Archivo: `astro.config.mjs:71-74`; `src/sanity/lib/load-query.ts:7-21` y `:54-67`; `src/components/SanityVisualEditing.tsx:107-114`; `src/pages/api/draft-mode/enable.ts:13`
- Evidencia: La integración deja stega apagado. El overlay solo se monta en staging, dentro del iframe, con las dos cookies. `refresh` y el cambio de perspectiva hacen `window.location.reload()`. `STEGA_SKIP` no incluye `metaTitle` ni `metaDescription`. Enable responde 404 fuera de staging.
- Impacto: Los drafts sí se ven en staging para quien entra con la contraseña, porque el cliente usa `perspective: 'drafts'`. El clic para editar y el refresco en vivo quedan a medias: cada cambio recompone el documento entero, y la home además llega sin `_key` (C-04).
- Corrección propuesta: Mantener stega apagado en el cliente público. Seguir encendiéndolo solo en `loadQuery` cuando hay preview, y excluir también los campos que van a `<head>`. El reload es una limitación conocida de este Astro; no hace falta un live query por bloque para que los drafts se vean.
- Esfuerzo: medio

### C-10. Idioma repartido en tres convenciones

- Severidad: Media
- Archivo: `sanity.config.ts:110-130`; `src/sanity/schemas/homePage.ts:13-31`; `src/sanity/schemas/post.ts:84-91`; `src/sanity/actions/ensureEnglishPair.ts`; `src/sanity/queries.ts:738-740`
- Evidencia: No hay plugin de document internationalization ni tipo `locale`. Posts se emparejan con `esSlug` y `createEnglishVersion`. Servicios e industrias usan `_id` terminado en `-en` y `string::split(^._id, "-en")`. Home no tiene campo `locale`. `ensureEnglishPair` no cubre home, about, portal, footer ni legales: esos pares solo existen si el id ya está en la estructura.
- Impacto: Un id que contenga `-en` antes del sufijo parte mal el slug alterno. Un editor no tiene el mismo botón «crear inglés» en todos los tipos que la estructura muestra como par.
- Corrección propuesta: Un solo emparejamiento. Si se queda el sufijo `-en`, que la query use ese id y no un `split` genérico, y que home guarde `locale` como el resto de singletons.
- Esfuerzo: alto

### C-11. `sectionIntro` y `cta` no tienen preview

- Severidad: Baja
- Archivo: `src/sanity/schemas/shared.ts:330-360`
- Evidencia: Esos dos objetos no definen `preview`. El resto de bloques de sección sí, con el nombre de la sección como subtítulo.
- Impacto: Dentro de un array se ven como «Untitled» o solo con el primer campo.
- Corrección propuesta: `preview.select` sobre `title` o `eyebrow` en `sectionIntro`, y sobre `label` en `cta`.
- Esfuerzo: bajo

### C-12. Documentos principales sin icono

- Severidad: Baja
- Archivo: `src/sanity/schemas/homePage.ts`, `aboutPage.ts`, `service.ts`, `industry.ts`, `caseStudy.ts`, `post.ts`, `author.ts`, `person.ts`, `siteSettings.ts`, `navigation.ts`, `footer.ts`, `redirect.ts`
- Evidencia: Esos `defineType` de documento no tienen `icon`. Los bloques de sección y `faq`, `landingPage`, `portalPage`, `legalPage` sí. Los iconos que hay usan el subpath correcto.
- Impacto: El desk y el menú de crear documento se leen peor. No afecta al contenido.
- Corrección propuesta: Un icono por documento, importado desde `@sanity/icons/<Nombre>`.
- Esfuerzo: bajo
