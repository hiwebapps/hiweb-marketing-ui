# Schemas de Sanity

El schema vive en `src/sanity/schemas` y se registra en `schemaTypes` (`index.ts`). El desk, las queries y Presentation están en [sanity-studio.md](./sanity-studio.md). El dataset es `web-2026` del proyecto `fxardjr1`.

Casi todo usa `defineType` / `defineField` / `defineArrayMember`. Los iconos que hay se importan desde `@sanity/icons/<Nombre>`. El idioma no es un plugin de document internationalization: es un string `es` | `en` y, en los singletons, un `_id` que termina en `-en`.

`withVisibility()` en `shared.ts` añade `hidden` a los bloques de sección. El sitio omite el bloque; el Studio lo sigue mostrando, marcado como oculto.

## Qué tipo pinta qué página

| Tipo | Documento u objeto | Página |
| --- | --- | --- |
| `homePage` | documento | `/` (`homePage`) y `/en` (`homePage-en`) |
| `homeHero`, `homePillars`, `homeServices`, `homeIndustries`, `homeStories`, `homeProcess`, `homeMetrics`, `homeTeam`, `homeFaq`, `homeCta`, `homeServiceItem` | objeto | Home. `homeServiceItem` es la card dentro de `homeServices` |
| `aboutPage` | documento | `/nosotros` (`aboutPage`) y `/en/<slug>` (`aboutPage-en`; slug vacío = `nosotros`) |
| `aboutHero`, `aboutHistory`, `aboutPillars`, `aboutProcess`, `aboutPortal`, `aboutTeam`, `aboutMap`, `aboutCta` | objeto | Nosotros |
| `service` | documento | `/servicios/[slug]` y `/en/services/[slug]` |
| `serviceHero`, `serviceOverview`, `serviceFocus`, `servicePitch`, `serviceWhy`, `servicePlans`, `serviceIndustries`, `serviceProcess`, `serviceCases`, `serviceFaq`, `serviceCta` | objeto | Ficha de servicio |
| `serviceFocusItem`, `serviceWhyCard`, `serviceIndustryItem`, `serviceProcessStep` | objeto | Ítems dentro de esas secciones de servicio |
| `industry` | documento | `/industrias/[slug]` y `/en/industries/[slug]` |
| `industryHero`, `industryWhy`, `industryServices`, `industryCases`, `industryFaq`, `industryCta`, `industryPillar` | objeto | Ficha de industria |
| `industriesIndex` | documento | Copy del bloque de industrias. `getIndustriesIndex` lo lee la home en inglés. `/industrias` redirige a `/` |
| `servicesIndex` | documento | Misma fábrica que los índices. `/servicios` redirige a `/` |
| `blogIndex` | documento | `/blog` y `/en/blogs` |
| `casesIndex` | documento | `/portafolio` |
| `caseStudy` | documento | `/portafolio/[slug]`. La query fija `locale == "es"`. No hay `/en/portafolio` |
| `caseHero`, `caseContext`, `caseProcess`, `caseMetrics`, `caseTestimonial`, `caseRelated`, `caseCta` | objeto | Ficha de caso |
| `landingPage` | documento | `/[slug]` vía `SectionRenderer`. La query fija español |
| `pageHero`, `pillarGrid`, `serviceGrid`, `industryGrid`, `processPhases`, `caseStories`, `casePreview`, `faqSection`, `finalCta`, `teamGrid`, `metricsBand`, `presenceMap` | objeto | Landing en `/[slug]` |
| `beforeAfter` | objeto | Home, nosotros, servicio, industria, caso, portal y landing |
| `post` | documento | `/blog/[slug]` y `/en/blogs/[slug]` |
| `author` | documento | Card del artículo. No tiene URL propia |
| `table` | objeto | Cuerpo Portable Text del post |
| `blogTable` | objeto | Legado del import. `hidden: true`. El sitio pinta `table` |
| `person` | documento | Equipo en home, nosotros y landings (`teamGrid`) |
| `testimonial` | documento | Cita referenciada desde `caseTestimonial` |
| `faq` | documento | Solo si una landing apunta `faqRefs`. El resto de FAQ son `faqItem` embebido |
| `faqItem`, `faqCategory`, `sectionIntro`, `cta`, `titledBlock`, `processStep`, `metric`, `servicePlan`, `serviceBlurb` | objeto | Piezas reutilizadas dentro de secciones. `sectionIntro` y `cta` no tienen preview (C-11) |
| `contactPage` | documento | `/contacto`. La query solo lee `_id == "contactPage"`. Un redirect publicado manda esa URL a `/calendario` (B-04) |
| `calendarPage` | documento | `/calendario` (`calendarPage`) y `/en/calendar` (`calendarPage-en`) |
| `portalPage` | documento | `/portal` y `/en/portal` |
| `portalHero`, `portalStrip`, `portalJourney`, `portalBento`, `portalFaq`, `portalCloser` | objeto | Portal |
| `legalPage` | documento | `/terminos` (`legal-terms`), `/aviso-de-privacidad` (`legal-privacy`) y los pares `-en` |
| `legalParagraph`, `legalBullets`, `legalTerms`, `legalLines`, `legalSubsection`, `legalSection` | objeto | Cuerpo de la página legal |
| `sitePage` | documento | `/diagnostico-marketing-digital` (`page-diagnostico`) |
| `siteSettings` | documento | `Layout.astro` en todas las páginas (identidad y favicon) |
| `navigation`, `navBarItem`, `navGroup`, `navLink` | documento y objetos | `SiteNav` en el layout |
| `footer`, `footerLink` | documento y objeto | `SiteFooter` en el layout |
| `ctaBackdrop` | documento | Fotos del marquee de cierre. El texto del CTA lo pone cada página |
| `redirect` | documento | No se renderiza. `integrations/sanity-redirects.mjs` lo mete en el build |

## Fichas

### `src/sanity/schemas/index.ts`

- Propósito: lista única de tipos que `sanity.config.ts` pasa a `schema.types`.
- Por qué está así: un solo array evita registrar el mismo objeto dos veces y deja el orden de objetos antes que el de documentos.
- Exporta: `schemaTypes`.
- Depende de: el resto de archivos de esta carpeta, más `blocks/beforeAfter.ts` y `blocks/pageSections.ts`.
- Lo usan: `sanity.config.ts`. El grafo de imports no lo marca porque el config está en la raíz.
- Datos: no guarda documentos. `beforeAfter` entra envuelto en `withVisibility`. `homeServiceItem` e `industryPillar` se registran aparte de su array de sección.
- Hallazgos: no hay documentos fuera de esta lista.

### `src/sanity/schemas/shared.ts`

- Propósito: campos y objetos que varios documentos repiten.
- Por qué está así: el SEO, el alt de imagen, el título con saltos de línea y el ancho del heading son el mismo control en home, servicio, landing y legal.
- Exporta: `headingTitleField`, `headingWidthField`, `seoFields`, `seoGroups`, `imageWithAlt`, `faqAnswerField`, `faqItem`, `servicePlan`, `titledBlock`, `processStep`, `metric`, `sectionIntro`, `cta`, `faqCategory`, `serviceBlurb`, `withVisibility`.
- Depende de: `src/lib/heading.ts` (`HEADING_WIDTH_OPTIONS`), `CharCountInput.ts`, `SerpPreview.ts`.
- Lo usan: casi todos los schemas de documento y de sección. Ver [grafo.md](./grafo.md).
- Datos: `seoFields` es `metaTitle` (aviso ≤ 70), `metaDescription` (aviso ≤ 160), `ogImage` con alt, `noindex` (default false) y `canonicalPath` (ruta que empieza por `/`). `headingWidth`, `accent` y `badgeVariant` son controles de maquetación dentro del contenido. `faqAnswerField` es Portable Text corto (negrita, cursiva, un enlace).
- Hallazgos: C-11. `sectionIntro` y `cta` no definen `preview`. A-09. `calendarPageQuery` y `contactPageQuery` no proyectan todo `seoFields`.

### `src/sanity/schemas/homePage.ts`

- Propósito: singleton de la home. Solo `sections` y SEO.
- Por qué está así: el copy dejó de ser campos planos y pasó a un array con un bloque por sección. La validación impide repetir el mismo `_type`.
- Exporta: `homePage`.
- Depende de: `homeSections.ts`, `shared.ts`.
- Lo usan: `schemas/index.ts`.
- Datos: ids `homePage` y `homePage-en`. No hay campo `locale`. El idioma es el `_id`. Preview fijo «Home».
- Hallazgos: C-03. `of: homeSectionMembers` está anotado como `ArrayOfObjectsMember[]` y el validador de duplicados ve `section` como `unknown`. C-10. Home no guarda `locale`, a diferencia del resto de singletons. C-12. El documento no tiene icono.

### `src/sanity/schemas/homeSections.ts`

- Propósito: bloques del page builder de la home.
- Por qué está así: cada sección de la home tiene campos propios (`homeHero` no es `pageHero`). El insert menu es lista, no la rejilla de landings.
- Exporta: `homeServiceItem`, `homeHero`, `homePillars`, `homeServices`, `homeIndustries`, `homeStories`, `homeProcess`, `homeMetrics`, `homeTeam`, `homeFaq`, `homeCta`, `homeSectionMembers`, `homeSectionTypes`.
- Depende de: `NavIconInput.tsx`, `navigation.ts` (`navIcons`), `person.ts`, `shared.ts`.
- Lo usan: `homePage.ts`, `schemas/index.ts`.
- Datos: `homeSectionMembers` incluye esos bloques más `beforeAfter`, cada uno en diálogo (`modal: dialog`). `homeSectionTypes` les aplica `withVisibility`. `homeTeam` referencia `person` y elige `memberLocale`. `homeServiceItem` puede apuntar a un `service` o llevar nombre, tagline, imagen e icono propios.
- Hallazgos: C-03 en `homeSectionMembers` (líneas 323–334).

### `src/sanity/schemas/aboutPage.ts`

- Propósito: documento de Nosotros.
- Por qué está así: el cuerpo es `sections`. `locale` required distingue el par, pero la estructura abre ids fijos `aboutPage` y `aboutPage-en`.
- Exporta: `aboutPage`.
- Depende de: `aboutSections.ts`, `shared.ts`.
- Lo usan: `schemas/index.ts`.
- Datos: grupos Datos / Secciones / SEO. Misma regla de «una sección de cada tipo».
- Hallazgos: C-03 en el validador de `sections`. C-12. Sin icono. A-02. `aboutPageQuery` todavía hace `coalesce` contra campos planos (`heroTitle`, `historyTitle`, …) que este documento ya no declara.

### `src/sanity/schemas/aboutSections.ts`

- Propósito: bloques de Nosotros.
- Por qué está así: historia, pilares, mapa y portal no se reutilizan en otras plantillas.
- Exporta: `aboutHero`, `aboutHistory`, `aboutPillars`, `aboutProcess`, `aboutTeam`, `aboutMap`, `aboutCta`, `aboutPortal`, `aboutSectionMembers`, `aboutSectionTypes`.
- Depende de: `person.ts`, `shared.ts`.
- Lo usan: `aboutPage.ts`, `schemas/index.ts`.
- Datos: badges, columnas y filtros son objetos inline. `aboutTeam` usa `personReferenceMember()`. `aboutPortal` guarda el cliente de la demo y dos botones. `aboutSectionMembers` también admite `beforeAfter`.
- Hallazgos: C-03 (líneas 311–321).

### `src/sanity/schemas/service.ts`

- Propósito: documento de un servicio, en español o en inglés.
- Por qué está así: la card del bento (`nombre`, `slug`, `orden`, `tagline`, `cardImage`, `cardIcon`) vive en la raíz porque la usan los listados. El cuerpo de la ficha vive en `sections`.
- Exporta: `service`.
- Depende de: `NavIconInput.tsx`, `navigation.ts`, `serviceSections.ts`, `shared.ts`.
- Lo usan: `schemas/index.ts`.
- Datos: slug único por `locale`. Grupos Secciones / SEO. Plantillas de creación en `sanity.config.ts` (`serviceStarter`).
- Hallazgos: C-03 en el validador. C-02 y A-02. `servicesQuery` / `serviceBySlugQuery` piden `heroTitle`, `cards`, `proceso`, `faqs` y `planes*` que este schema ya no tiene. El detalle no proyecta `cardImage` ni `cardIcon`, que sí están aquí y sí salen en el listado. C-12. Sin icono.

### `src/sanity/schemas/serviceSections.ts`

- Propósito: bloques de la ficha de servicio y sus ítems.
- Por qué está así: el orden de secciones del starter (`serviceHero` … `serviceCta`) es el de la plantilla visual. `beforeAfter` se puede insertar en cualquier hueco.
- Exporta: `serviceFocusItem`, `serviceWhyCard`, `serviceIndustryItem`, `serviceProcessStep`, `serviceHero`, `serviceOverview`, `serviceFocus`, `servicePitch`, `serviceWhy`, `servicePlansSection` (tipo `servicePlans`), `serviceIndustries`, `serviceProcess`, `serviceCases`, `serviceFaq`, `serviceCta`, `serviceSectionMembers`, `serviceSectionTypes`.
- Depende de: `shared.ts`.
- Lo usan: `service.ts`, `schemas/index.ts`.
- Datos: `servicePitch` guarda a la vez `image` / `imageAlt` (ruta vieja) y `picture`. `serviceWhy` mete `serviceWhyStat` inline. `serviceIndustryItem.industry` es referencia required. `serviceFaq` puede ir en columnas o en `faqItem`.
- Hallazgos: C-03 (líneas 460–473).

### `src/sanity/schemas/industry.ts`

- Propósito: documento de industria y el singleton del índice.
- Por qué está así: la ficha sigue el mismo patrón que servicio (`nombre`, slug por idioma, `orden`, `tagline`, `sections`). El índice es otro tipo porque no tiene slug ni secciones: es el copy del bloque de industrias en la home.
- Exporta: `industry`, `industriesIndex`.
- Depende de: `industrySections.ts`, `shared.ts`.
- Lo usan: `schemas/index.ts`.
- Datos: `industriesIndex` tiene eyebrow, título, pilares (`titledBlock`), cierre y `cardCtaLabel`, más SEO. La query usa `$id`. El loader pide `industriesIndex-en`. El desk no abre ese id: `catalogList` solo lista industrias. `page-meta.ts` igual arma la ruta de Studio `industrias;industries-index`.
- Hallazgos: C-02, A-02. La proyección de industria hace `coalesce` contra `heroTitle`, `porQue`, `faqs`, `serviceBlurbs`, `retos`. C-01. `types.ts` todavía describe `Industry` con esos campos y sin `sections`. C-03 y C-12 en `industry`.

### `src/sanity/schemas/industrySections.ts`

- Propósito: bloques de la ficha de industria.
- Por qué está así: el porqué, los servicios, los casos y la FAQ de una industria no coinciden con los bloques `page*` de una landing.
- Exporta: `industryPillar`, `industryHero`, `industryWhy`, `industryServices`, `industryCases`, `industryFaq`, `industryCta`, `industrySectionMembers`, `industrySectionTypes`.
- Depende de: `shared.ts`.
- Lo usan: `industry.ts`, `schemas/index.ts`.
- Datos: `industryWhy.pillars` es `industryPillar` (título, texto, icono). `industryServices.blurbs` es `serviceBlurb`. `industrySectionMembers` incluye `beforeAfter`.
- Hallazgos: C-03 (líneas 202–209).

### `src/sanity/schemas/caseStudy.ts`

- Propósito: documento de un caso de portafolio.
- Por qué está así: cliente, slug, industria, título, resumen, destacado y acento alimentan la card del índice. El relato (reto, fases, métricas, testimonio) está en `sections`. `cards` es un fieldset, no un campo.
- Exporta: `caseStudy`.
- Depende de: `caseSections.ts`, `shared.ts`.
- Lo usan: `schemas/index.ts`.
- Datos: `industria` es referencia, no required. Slug único por `locale`. `locale` required con default `es`.
- Hallazgos: C-03. A-05 y C-05. El schema tiene idioma y las queries filtran `locale == "es"`. A-06. `resultadoFrase` está en la colección de fallback y en `mapCase`, y no está en este schema. C-12. Sin icono.

### `src/sanity/schemas/caseSections.ts`

- Propósito: bloques de la ficha de caso.
- Por qué está así: el hero del telescopio, el contexto y las métricas no se comparten con la landing.
- Exporta: `caseHero`, `caseContext`, `caseProcess`, `caseMetrics`, `caseTestimonial`, `caseRelated`, `caseCta`, `caseSectionMembers`, `caseSectionTypes`.
- Depende de: `shared.ts`.
- Lo usan: `caseStudy.ts`, `schemas/index.ts`.
- Datos: los servicios del caso son referencias dentro de `caseContext`, no del documento. `caseHero` guarda el año y las imágenes del proyecto. `caseSectionMembers` incluye `beforeAfter`.
- Hallazgos: C-03 (líneas 206–214).

### `src/sanity/schemas/landingPage.ts`

- Propósito: página suelta en `/[slug]`, armada con la biblioteca `page*`.
- Por qué está así: no es un servicio ni una industria. El slug no puede pisar una ruta de Astro (`reservedSlugs.ts`). La plantilla solo siembra `sections`; el render usa el array guardado.
- Exporta: `LANDING_SECTION_MEMBERS`, `landingPage`.
- Depende de: `landingTemplate.ts`, `reservedSlugs.ts`, `sectionInsertMenu.ts`, `shared.ts`.
- Lo usan: `schemas/index.ts`.
- Datos: `locale` oculto, default `es`, required. `templateKind`: `serviceLite` | `industryLite` | `campaign`. `sections` abre con la rejilla de `sectionInsertMenu`. Icono `DocumentIcon`.
- Hallazgos: A-10. `templateKind` no sale en `landingsQuery` ni `landingBySlugQuery`. A-05 y C-05. Una landing en inglés no tiene ruta.

### `src/sanity/schemas/blocks/pageSections.ts`

- Propósito: segundo page builder, el de las landings.
- Por qué está así: estos bloques se rellenan con catálogos (`source` refs o todos) y los pinta `SectionRenderer.astro`. No sustituyen a `home*` / `service*` / `industry*`.
- Exporta: `pageHero`, `pillarGrid`, `serviceGrid`, `industryGrid`, `processPhases`, `caseStories`, `casePreview`, `landingFaqSection` (tipo `faqSection`), `finalCta`, `teamGrid`, `metricsBand`, `presenceMap`, `landingSectionTypes`.
- Depende de: `shared.ts`.
- Lo usan: `schemas/index.ts`. `landingPage.ts` nombra los tipos en `LANDING_SECTION_MEMBERS`.
- Datos: `pageHero.imagePosition` guarda un valor CSS (`object-position`). `faqSection` puede llevar `faqItem` o `faqRefs` al documento `faq`. `serviceGrid` e `industryGrid` eligen referencias o el catálogo entero. `tone` y `headingWidth` son de maquetación.
- Hallazgos: la guía de Studio desaconseja `headingWidth`, `accent`, `badgeVariant` e `imagePosition` porque un rediseño los deja sin sentido. Siguen siendo editables.

### `src/sanity/schemas/blocks/beforeAfter.ts`

- Propósito: comparador antes/después, reutilizado en todos los arrays de sección.
- Por qué está así: un solo objeto evita copiar el par foto/video en cada plantilla. `schemas/index.ts` le aplica `withVisibility`.
- Exporta: `beforeAfter`.
- Depende de: `shared.ts`.
- Lo usan: `schemas/index.ts`. Los members de home, about, service, industry, case, portal y landing lo incluyen en el `of`.
- Datos: eyebrow, título, descripción, badge, `badgeVariant`, y `pairs[]` con etiquetas, imagen o video de antes y de después.
- Hallazgos: ninguno de C-01–C-12 propio. El overlay de la home no puede anclar este bloque si la query no pide `_key` (C-04).

### `src/sanity/schemas/post.ts`

- Propósito: artículo y autor del blog.
- Por qué está así: el par ES/EN del post no usa el sufijo `-en`. Se empareja con `esSlug` y la acción `createEnglishVersion`. `autor` (string) queda si no hay referencia `author`.
- Exporta: `author`, `post`.
- Depende de: `CharCountInput.ts`, `shared.ts`.
- Lo usan: `schemas/index.ts`.
- Datos: `post` exige `title`, `locale`, `slug` único por idioma, `description` y `fecha`. `esSlug` solo se muestra si `locale == "en"`. `keyword`, `featured`, `readingMinutes`, categorías (referencias a servicio e industria), `cover`, `body` (Portable Text con imagen y `table`) y `faqs`. `author` exige nombre, puesto, empresa y LinkedIn. Su `slug` no es required ni único.
- Hallazgos: C-10. El emparejamiento del post es distinto al de servicio e industria. C-12. Ni `post` ni `author` tienen icono. La query del artículo no proyecta `readingMinutes`; el índice sí. `author.slug` y `author.company` no salen en la query pública.

### `src/sanity/schemas/table.ts`

- Propósito: tabla del cuerpo del blog.
- Por qué está así: el import de Webflow aplanaba cada celda en un párrafo. `table` es el bloque que `rebuild-post-tables.ts` escribe.
- Exporta: `table`.
- Depende de: nada del repo.
- Lo usan: `schemas/index.ts`. El cuerpo de `post` lo admite.
- Datos: `headerRows` (default 1) y `rows[]` de `cells[]` con `value`.
- Hallazgos: ninguno propio.

### `src/sanity/schemas/blogTable.ts`

- Propósito: forma vieja de tabla que trajeron los posts de producción.
- Por qué está así: sigue registrado para que un documento antiguo no pierda el bloque, y está `hidden: true` para que el editor no lo cree.
- Exporta: `blogTable`.
- Depende de: nada del repo.
- Lo usan: `schemas/index.ts`.
- Datos: `caption`, `hasHeaderRow`, `rows[].cells` como strings.
- Hallazgos: legado del import. El script de rebuild lo convierte en `table`.

### `src/sanity/schemas/person.ts`

- Propósito: miembro del equipo.
- Por qué está así: la misma persona se referencia desde home, nosotros y landings. El filtro de la referencia mira `memberLocale` de la sección, no un campo suelto del padre.
- Exporta: `personLocaleFilter`, `personReferenceMember`, `person`.
- Depende de: `shared.ts`.
- Lo usan: `aboutSections.ts`, `homeSections.ts`, `schemas/index.ts`.
- Datos: `locale` oculto. `name`, `role`, `category` (`web` | `redes` | `diseno`) required. Foto, bio, `accent`, `orden`, redes (TikTok, Instagram, LinkedIn).
- Hallazgos: C-12. Sin icono. El filtro sí está tipado como `ReferenceFilterResolver`, a diferencia del de la navbar.

### `src/sanity/schemas/testimonial.ts`

- Propósito: cita reutilizable.
- Por qué está así: el caso la referencia en `caseTestimonial` en lugar de copiar quote, nombre y cargo.
- Exporta: `testimonial`.
- Depende de: nada del repo.
- Lo usan: `schemas/index.ts`.
- Datos: `locale` oculto. `client`, `quote`, `name`, `role` required. `stats` es un objeto inline `{ value, label }`. Foto con alt.
- Hallazgos: `ensureEnglishPair` puede crear el par `-en`. El sitio de casos solo publica español (A-05).

### `src/sanity/schemas/faq.ts`

- Propósito: biblioteca de preguntas.
- Por qué está así: una landing puede apuntar `faqRefs`. Las FAQ de home, servicio, industria y portal son copias `faqItem`, así que editar esta biblioteca no las cambia.
- Exporta: `faq`.
- Depende de: `shared.ts` (`faqAnswerField`).
- Lo usan: `schemas/index.ts`.
- Datos: `question` required, respuesta Portable Text (mínimo un bloque), `orden`. Icono `HelpCircleIcon`.
- Hallazgos: no hay query de listado. Solo entra si `landingBySlugQuery` expande `faqRefs`.

### `src/sanity/schemas/catalogIndex.ts`

- Propósito: fábrica de tres documentos de índice.
- Por qué está así: blog, portafolio y el índice de servicios comparten eyebrow, títulos, filtro, cierre y SEO. Tres `defineType` evitan un documento genérico con un discriminador.
- Exporta: `servicesIndex`, `blogIndex`, `casesIndex`.
- Depende de: `shared.ts`.
- Lo usan: `schemas/index.ts`.
- Datos: título de sección required vía `headingTitleField`. El desk fija `blogIndex` / `blogIndex-en` y `casesIndex` / `casesIndex-en`. `servicesIndex` es el mismo factory y no tiene ítem en el desk: `catalogList` de servicios no lo abre, y está en `HIDDEN_FROM_FALLBACK`.
- Hallazgos: ninguno de tipo. `/servicios` y `/industrias` no son estas páginas: redirigen a home en `astro.config.mjs`.

### `src/sanity/schemas/contactPage.ts`

- Propósito: copy del formulario de contacto.
- Por qué está así: los campos, los servicios y los presupuestos son objetos inline porque solo existen en esta pantalla. El envío es `mailto:`, no n8n ni D1.
- Exporta: `contactPage`.
- Depende de: `shared.ts`.
- Lo usan: `schemas/index.ts`.
- Datos: grupos Banner, Campos, Servicios, Presupuesto, SEO. `locale` oculto. `contactField` (`kind`, etiqueta, placeholder, hint, required, ancho), `contactService`, `contactBudget` (con flag `custom`). Ids de desk `contactPage` y `contactPage-en`.
- Hallazgos: C-05. La estructura abre el par inglés y `contactPageQuery` fija `_id == "contactPage"`. Solo existe `src/pages/contacto.astro`. B-04. Un redirect publicado `/contacto` → `/calendario` hace que el build no emita el HTML de esta página. A-09. La query no pide `ogImage`.

### `src/sanity/schemas/calendarPage.ts`

- Propósito: copy de la herramienta de citas.
- Por qué está así: las reglas de horario viven en código (`calendar-rules.ts`). Studio solo edita textos, campos y etiquetas. El par es `calendarPage` / `calendarPage-en` y la query sí recibe `$id`.
- Exporta: `calendarPage`.
- Depende de: `shared.ts`.
- Lo usan: `schemas/index.ts`.
- Datos: grupos Banner, Campos, Servicios, Textos, SEO. `locale` oculto. `calendarField.kind`: services, name, email, phone, company, website. Icono `DocumentIcon`.
- Hallazgos: A-09. `calendarPageQuery` pide `metaTitle` y `metaDescription` y no pide `noindex`, `canonicalPath` ni `ogImage`.

### `src/sanity/schemas/portalPage.ts`

- Propósito: documento y bloques del portal de clientes.
- Por qué está así: el recorrido (hero, tira, journey, bento, FAQ, cierre) es propio de `/portal`. Samples, badges, pasos y cards son objetos inline.
- Exporta: `portalSectionMembers`, `portalSectionTypes`, `portalPage`, y los `defineType` de `portalHero`, `portalStrip`, `portalJourney`, `portalBento`, `portalFaq`, `portalCloser`.
- Depende de: `shared.ts`.
- Lo usan: `schemas/index.ts`.
- Datos: `title` required. `locale` no es required (default `es`). Ids `portalPage` y `portalPage-en`. Icono `DocumentIcon`. Cada sample exige módulo y título.
- Hallazgos: C-03 en `portalSectionMembers` (líneas 250–257). C-06. `portalPage` no está en `HIDDEN_FROM_FALLBACK`, así que el desk lo lista dos veces.

### `src/sanity/schemas/legalPage.ts`

- Propósito: términos y aviso de privacidad, con sus bloques.
- Por qué está así: el cuerpo legal no es Portable Text genérico. Párrafo, viñetas, pares término/texto y líneas etiqueta/valor tienen preview propio.
- Exporta: `legalParagraph`, `legalBullets`, `legalTerms`, `legalLines`, `legalSubsection`, `legalSection`, `legalPage`, `legalObjectTypes`.
- Depende de: `shared.ts`.
- Lo usan: `schemas/index.ts`.
- Datos: `legalPage` tiene `locale` oculto, eyebrow, título required, `updatedLabel`, `updatedOn`, `intro` y `sections`. Ids `legal-terms`, `legal-terms-en`, `legal-privacy`, `legal-privacy-en`. Las filas de `legalTerms` y `legalLines` son objetos inline.
- Hallazgos: la proyección de `legalPageQuery` coincide con estos objetos. Si Sanity falla, la página recibe `null` (A-14, en el loader, no en este archivo).

### `src/sanity/schemas/sitePage.ts`

- Propósito: copy de una URL fija que no es landing. Hoy, el diagnóstico.
- Por qué está así: la ruta ya existe en Astro. El slug es `readOnly` para que el editor no la mueva. El quiz en sí no es este documento: las preguntas están en código.
- Exporta: `sitePage`.
- Depende de: `shared.ts`.
- Lo usan: `schemas/index.ts`.
- Datos: `title` required, eyebrow, descripción, slug. Id fijado `page-diagnostico`. Icono `DocumentIcon`. Fallback de la página: `SITE_PAGES` en `lib/content/index.ts`.
- Hallazgos: ninguno de schema. No hay `/en` de diagnóstico.

### `src/sanity/schemas/siteSettings.ts`

- Propósito: singleton de marca y contacto.
- Por qué está así: nombre, tagline, email, teléfono, WhatsApp, sedes y redes salen en el layout, no en una URL. No hay grupo SEO: el meta de cada página vive en `seoFields` de ese documento.
- Exporta: `siteSettings`.
- Depende de: nada del repo.
- Lo usan: `schemas/index.ts`.
- Datos: id `siteSettings`. `name` y datos de contacto required según la auditoría (`name`, `legalName`, `tagline`). Favicon PNG o SVG. `socials[]` es `{ label, href }` inline.
- Hallazgos: A-08. `siteSettingsQuery` pide `seoProjection` y este schema no tiene esos campos. El sitio usa `siteIdentityQuery` y `siteFaviconQuery`. C-12. Sin icono.

### `src/sanity/schemas/navigation.ts`

- Propósito: navbar por idioma.
- Por qué está así: un ítem es enlace o dropdown (`kind`). Las columnas y el índice del dropdown se ocultan cuando `kind` es link. El destino puede ser una referencia a una página o un `href`.
- Exporta: `navIcons`, `navLink`, `navGroup`, `navBarItem`, `navigation`.
- Depende de: `NavIconInput.tsx`.
- Lo usan: `homeSections.ts`, `service.ts`, `schemas/index.ts`.
- Datos: ids `navigation` y `navigation-en`. `locale` required. `bar[]` de `navBarItem`, más `ctaLabel`, `ctaPage`, `ctaHref`. `PAGE_TYPES` limita a qué documentos puede apuntar el picker.
- Hallazgos: el `filter` de la referencia no encaja con `ReferenceFilterResolver` (TS). En el Studio el filtro sí corre. A-03. `navigationQuery` todavía pide `industryLinks`, `serviceGroups`, `exploreLinks` y los hrefs de índice que este schema ya no declara. C-12. Sin icono.

### `src/sanity/schemas/footer.ts`

- Propósito: pie por idioma.
- Por qué está así: el pie no comparte el documento de la navbar. Ciudades, columnas y legales se editan aquí. `siteSettings.socials` sigue siendo la fuente de los iconos de redes.
- Exporta: `footerLink`, `footer`.
- Depende de: nada del repo.
- Lo usan: `schemas/index.ts`.
- Datos: ids `footer` y `footer-en`. `locale` required. `brand` y `emailPlaceholder` están `hidden`. Enlaces required en `footerLink`.
- Hallazgos: C-12. Sin icono. `getFooter` cae a `src/lib/footer.ts` si Sanity viene vacío.

### `src/sanity/schemas/ctaBackdrop.ts`

- Propósito: fotos del marquee que cierra todas las páginas.
- Por qué está así: el texto del cierre se edita en cada página. El fondo es uno solo, singleton `ctaBackdrop`.
- Exporta: `ctaBackdrop`.
- Depende de: nada del repo.
- Lo usan: `schemas/index.ts`.
- Datos: `images[]` con hotspot y alt opcional. La lista no es required. Icono `ImagesIcon`. Query `ctaBackdropQuery`.
- Hallazgos: ninguno.

### `src/sanity/schemas/redirect.ts`

- Propósito: redirección publicada en el próximo build.
- Por qué está así: el sitio prerenderiza en live. Un `from` → `to` no puede aplicarse en caliente. La integración de Astro lee el tipo en el build.
- Exporta: `redirect`.
- Depende de: nada del repo.
- Lo usan: `schemas/index.ts`. Lo consume `integrations/sanity-redirects.mjs`, no `queries.ts`.
- Datos: `from` y `to` required, únicos, deben empezar por `/` y no por `//`.
- Hallazgos: B-04. En `web-2026` hay un redirect publicado `/contacto` → `/calendario`. El build no crea `contacto/index.html`. `/contact` apunta a `/contacto`, así que las dos URLs salen del sitio. C-12. Sin icono.
