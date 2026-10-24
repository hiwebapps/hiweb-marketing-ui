# Resto de componentes

Lo que no está en `src/components/sections` ni en `src/components/ui`: raíz de `components`, `effects`, `portal`, `growth`, `icons`, `content` y `seo`.

## Raíz

### `src/components/BackgroundMesh.tsx`
- Propósito: Fondo fijo de puntos y una viñeta suave. Lienzo claro, sin aurora.
- Por qué está así: `bg-canvas`. El punto es `rgba(0,0,0,.07)` a 24 px. `aria-hidden`.
- Exporta: `BackgroundMesh`.
- Depende de: —
- Lo usan: `DesignSystem.tsx`, `Hero.tsx`, `sections/SectionsKitPage.tsx`. Ninguna ruta de marketing.
- Datos: —
- Hallazgos: D-03.

### `src/components/CardGlass.tsx`
- Propósito: Superficie con borde hairline y sombra corta. El nombre dice “glass”; el render es canvas sólido, no vidrio oscuro.
- Por qué está así: Tokens `border` y `canvas`.
- Exporta: `CardGlass`.
- Depende de: —
- Lo usan: `DesignSystem.tsx`, `Hero.tsx`.
- Datos: `children`, `className`, tag `div` | `section` | `article`.
- Hallazgos: D-03.

### `src/components/Hero.tsx`
- Propósito: Splash “light product-tool”: mesh, tarjeta y dos botones. No es el hero de la home.
- Por qué está así: Tipografía del sistema (Clash + Inter) y `Button` del kit. El `h1` vive solo en este archivo.
- Exporta: `Hero`.
- Depende de: `BackgroundMesh.tsx`, `CardGlass.tsx`, `src/components/ui`.
- Lo usan: — (cero imports; el grafo coincide).
- Datos: copy fijo en el componente. El secundario apunta a `/design-system`.
- Hallazgos: A-11, D-08, D-03.

### `src/components/DesignSystem.tsx`
- Propósito: Catálogo `/design-system`: muestras de color, tipo, `Button`, campos, `Badge`, `CardGlass` y un demo del indicador de scroll.
- Por qué está así: `client:only="react"` en `design-system.astro`. El fondo de la página usa `bg-[#070912]`, no `--color-hiweb-dark` (`#070902`). La lista `PRODUCTION` manda a `/servicios` y `/industrias`; esas rutas redirigen a `/`.
- Exporta: `DesignSystem`.
- Depende de: `BackgroundMesh.tsx`, `CardGlass.tsx`, `effects/ScrollIndicator.tsx` (`ScrollIndicatorDemo`), `sections/primitives/SectionHeader.tsx`, `src/components/ui`.
- Lo usan: `pages/design-system.astro`.
- Datos: 14 muestras de color escritas en el archivo. `@theme` tiene más tokens de los que pinta esta página.
- Hallazgos: D-03, D-04, D-09, S-08 (dos `h1`, y la página no se indexa).

### `src/components/ClearStaleDraftMode.tsx`
- Propósito: Si el sitio se abre fuera de un iframe y queda la cookie de perspectiva de Sanity, pide `GET /api/draft-mode/disable?silent=1` y recarga.
- Por qué está así: Isla `client:only="react"`. No pinta nada.
- Exporta: default `ClearStaleDraftMode`.
- Depende de: — (el grafo). El archivo importa `perspectiveCookieName` de `@sanity/preview-url-secret/constants`.
- Lo usan: `PreviewChrome.astro`.
- Datos: la cookie de perspectiva. No lee el documento.

### `src/components/SanityVisualEditing.tsx`
- Propósito: Overlay de Presentation. Sincroniza la perspectiva, el historial del iframe y el refresh al editar.
- Por qué está así: Isla `client:only="react"`. Solo se activa si `window.self !== window.top`. Usa `VisualEditing` de `@sanity/visual-editing/react`.
- Exporta: default `SanityVisualEditing`.
- Depende de: — en el grafo de módulos locales. El archivo importa el cliente de visual editing y la cookie de perspectiva.
- Lo usan: `PreviewChrome.astro`.
- Datos: cookies de preview y la URL actual. No proyecta el documento.
- Hallazgos: C-09.

### `src/components/PreviewChrome.astro`
- Propósito: En staging, si hay cookie de perspectiva y cookie de acceso al preview, monta el overlay y el limpiador de draft.
- Por qué está así: Las dos islas van `client:only="react"`. Sin esas cookies no renderiza nada.
- Exporta: componente Astro (sin props).
- Depende de: `ClearStaleDraftMode.tsx`, `SanityVisualEditing.tsx`, `src/lib/preview-auth.ts` (`PREVIEW_ACCESS_COOKIE`).
- Lo usan: el grafo dice nadie. `layouts/Layout.astro` lo importa con `await import()` solo cuando el sitio es staging. Gana el archivo del layout.
- Datos: cookies `perspective` y `PREVIEW_ACCESS_COOKIE`.

## effects

`effects/` mezcla `.jsx`, `.js` y `.tsx`. El botón del kit importa el JSX a propósito.

### `src/components/effects/BorderGlow.jsx`
- Propósito: Borde que sigue al puntero. Escribe `--edge-proximity` y `--cursor-angle`. Si `animated` y no `loop`, barre el ángulo una vez.
- Por qué está así: El color del glow entra como HSL (`"210 80 78"`) y se parte en variables CSS. `Button` lo usa con `animated={false}`. Reduced motion está en la hoja, no en el JS.
- CSS: `BorderGlow.css` — `@property --cursor-angle` y las capas `::before` / `.edge-light`. El fondo por defecto del JS es `#120F17`; la hoja repite `#120f17` y usa `#c299ff`. Esos hex no son tokens.
- Exporta: default `BorderGlow`.
- Depende de: `BorderGlow.css`.
- Lo usan: `sections/HeroSection.tsx`, `ui/Button.tsx`.
- Datos: radios, colores, `fillOpacity`, `coneSpread`, `glowIntensity`.
- Hallazgos: D-05, D-06.

### `src/components/effects/DriftWall.jsx`
- Propósito: Muro de fotos en perspectiva. Columnas que se desplazan, con parallax del puntero y un tile activo.
- Por qué está así: `requestAnimationFrame`. Si `prefers-reduced-motion`, no corre el loop de velocidad. Máscara y overlay viven en CSS.
- CSS: `DriftWall.css` — `perspective`, máscaras con `#000` y overlay `#060010` / `#0b0b12`. Esos dos no son tokens; el resto de negros son la máscara. Reduced motion en la hoja.
- Exporta: default `DriftWall`.
- Depende de: `DriftWall.css`.
- Lo usan: `sections/HeroSection.tsx`.
- Datos: `items` (`image`, `title`, `href`). Sin props usa 15 tiles de picsum. `HeroSection` le pasa `HERO_PROJECT_TILES` y overlay `#070912`.
- Hallazgos: D-05, D-06, D-08.

### `src/components/effects/GradientWaves.jsx`
- Propósito: Olas en WebGL 2 (`ogl`). Un triángulo a pantalla completa y un fragment shader.
- Por qué está así: Con `prefers-reduced-motion` lee el media query antes de crear el renderer (congela el tiempo). El detalle (`low|medium|high`) cambia los steps del shader. El mouse puede mover el horizonte.
- CSS: `GradientWaves.css` — solo el contenedor a 100 %. El look lo deciden los uniforms, no la hoja.
- Exporta: default `GradientWaves`.
- Depende de: `GradientWaves.css`. El paquete `ogl` no es un módulo del repo.
- Lo usan: `effects/HeroWavesBackground.tsx`.
- Datos: colores de horizonte, ola y cresta, más velocidad, amplitud, grano y parallax.
- Hallazgos: D-06, D-08.

### `src/components/effects/HeroWavesBackground.tsx`
- Propósito: Ajuste de marca de `GradientWaves` para el hero de laboratorio: navy, morado y cresta cyan.
- Por qué está así: Una capa `#070912` tapa el hueco mientras arranca el GL. `aria-hidden`.
- Exporta: default `HeroWavesBackground`.
- Depende de: `GradientWaves.jsx`.
- Lo usan: `sections/HeroSection.tsx`.
- Datos: uniforms fijos en el archivo (no lee Sanity).
- Hallazgos: D-03, D-08.

### `src/components/effects/heroProjectTiles.js`
- Propósito: Doce tiles de picsum para el muro del hero, con título y href `/portafolio`.
- Exporta: `HERO_PROJECT_TILES`.
- Depende de: —
- Lo usan: `sections/HeroSection.tsx`.
- Datos: URLs `picsum.photos` y nombres de ejemplo (Pulse, Campo, Vertex, etc.). El comentario dice que son sustitutos hasta tener assets reales.
- Hallazgos: D-06, D-08.

### `src/components/effects/ScrollIndicator.tsx`
- Propósito: Riel fijo a la derecha. Lee `[data-scroll-section]`, marca el tramo visible y salta al hacer click.
- Por qué está así: Isla `client:load` en `Layout`, en todas las páginas. `useDesktopScrollRail` lo limita al escritorio. El scroll suave se salta si `prefers-reduced-motion`. Etiquetas ES/EN por id (`inicio`, `faq`, `precios`, …).
- CSS: `ScrollIndicator.css` — riel de 12 px, `z-index: 1500`, se apaga con `.is-resting`. Reduced motion en la hoja.
- Exporta: `ScrollIndicator`, `ScrollIndicatorDemo`.
- Depende de: `ScrollIndicator.css`.
- Lo usan: `DesignSystem.tsx` (el demo, con `contained`), `layouts/Layout.astro` (el riel real).
- Datos: `locale` y, en el demo, secciones falsas del propio archivo. En el sitio las marcas salen del DOM.
- Hallazgos: P-04, D-09 (401 líneas).

## portal

Demo de producto en `/portal` y `/en/portal`. El copy de ejemplo es Aura Café. Los botones de las vistas son `<button>` propios, no `Button` del kit (D-04).

### `src/components/portal/PortalPageView.tsx`
- Propósito: Página del portal. Recorre las secciones de Sanity y, en el hero, dispara el tour o el visor.
- Por qué está así: Isla `client:load`. El hero tiene el `h1`. “Ver tour” y “Abrir visor” hacen scroll a `#portal-visor` y disparan `portal-tour` o `portal-viewer`.
- CSS: `PortalPage.css` — hero, tira, bento y cierre. Un hex fuera de paleta (`#5c6570`). El halo del hero usa el lima en `rgba`, no una clase de token. Reduced motion en la hoja.
- Exporta: `PortalPageView`.
- Depende de: `src/components/ui`, `sections/BeforeAfter.tsx`, `sections/primitives/SectionBand.tsx`, `sections/primitives/SectionHeader.tsx`, `src/lib/content/types.ts`, `PortalDemo.tsx`, `PortalPage.css`.
- Lo usan: `pages/portal.astro`, `pages/en/portal.astro`.
- Datos: `PortalSection[]` y `locale`. Tipos: `portalHero`, `portalStrip`, `portalJourney`, `portalBento`, `portalFaq`, `portalCloser`, `beforeAfter`.
- Hallazgos: S-11, D-05, D-04.

### `src/components/portal/PortalDemo.tsx`
- Propósito: Ventana del visor. Inicio con pendientes y cinco módulos: redes, web, SEO, documentos y HiLinks.
- Por qué está así: Estado local (ruta, pieza abierta, tour, menú). Escucha `portal-tour` y `portal-viewer`. No llama a una API: aprueba y comenta sobre datos del archivo.
- CSS: `PortalDemo.css` — la ventana, el chrome de semáforo (`#ff5f56`) y la UI interna. 164 hex, 53 fuera de paleta, y casi todos los `font-size` en px del sitio. Reduced motion al final de la hoja. El TSX no elige esos colores.
- Exporta: `PortalModule`, `PortalSample`, `PortalDemo`.
- Depende de: `PortalTour.tsx`, `PortalHiLinks.tsx`, `PortalDocs.tsx`, `PortalSeo.tsx`, `PortalSocial.tsx`, `PortalWebView.tsx`, `PortalDemo.css`.
- Lo usan: `PortalPageView.tsx`.
- Datos: piezas, entregables y copy ES/EN dentro del archivo. `clientName` tapa el default “Aura Café & Roastery”. `samples` está en el tipo; el render que leí no lo pinta.
- Hallazgos: D-04, D-05, D-09 (857 líneas de TSX y 2280 de CSS).

### `src/components/portal/PortalTour.tsx`
- Propósito: Guía de cinco pasos sobre la ventana. Puede avanzar sola o a mano. Recorta el objetivo y coloca la tarjeta.
- Por qué está así: GSAP (`useGSAP`) mueve la tarjeta. `reducedMotion()` evita el desplazamiento suave. Mide el `frameRef` del demo.
- Exporta: `PortalTour`.
- Depende de: — en el grafo de módulos locales. El archivo importa `gsap` y `@gsap/react`.
- Lo usan: `PortalDemo.tsx`.
- Datos: pasos ES/EN fijos (`pending`, `band`, `social`, …).

### `src/components/portal/PortalSocial.tsx`
- Propósito: Parrilla de redes del demo: revisión, programado, publicado y planeación; lista, calendario o feed.
- Exporta: `SocialStatus`, `SocialFmt`, `SocialTab`, `SocialView`, `SocialPiece`, `SocialBoard`.
- Depende de: —
- Lo usan: `PortalDemo.tsx`.
- Datos: copy y piezas de ejemplo en el archivo (octubre 2026, Instagram y TikTok). El `h1` de la vista está en este módulo.
- Hallazgos: S-11.

### `src/components/portal/PortalWebView.tsx`
- Propósito: Revisión de páginas del demo. Lista y visor con pines en desktop y móvil.
- Exporta: `WebPin`, `WebPage`, `WebBoard`, `WebPageViewer`.
- Depende de: —
- Lo usan: `PortalDemo.tsx`.
- Datos: páginas, checks y pines de ejemplo. El visor tiene su `h1`.
- Hallazgos: S-11.

### `src/components/portal/PortalSeo.tsx`
- Propósito: Bandeja de artículos SEO y lector con comentarios anclados al párrafo.
- Exporta: `SeoStatus`, `SeoComment`, `SeoArticleData`, `SeoBoard`, `SeoArticle`.
- Depende de: —
- Lo usan: `PortalDemo.tsx`.
- Datos: artículos de ejemplo (estado, ronda, párrafos, comentarios). El lector tiene su `h1`.
- Hallazgos: S-11.

### `src/components/portal/PortalDocs.tsx`
- Propósito: Lista de documentos del demo y un lector que simula la descarga del PDF.
- Exporta: `PortalDoc`, `docsFor`, `DocsBoard`, `DocReader`.
- Depende de: —
- Lo usan: `PortalDemo.tsx`.
- Datos: tres documentos ES/EN (reporte, estrategia, brief) y cifras de ejemplo. El lector tiene su `h1`.
- Hallazgos: S-11.

### `src/components/portal/PortalHiLinks.tsx`
- Propósito: Editor de link-in-bio del demo: perfil, links, diseño y clics.
- Exporta: `HiLinksBoard`.
- Depende de: —
- Lo usan: `PortalDemo.tsx`.
- Datos: links, bio y métricas de ejemplo en el archivo. El textarea de la bio es nativo (D-04).

## growth

### `src/components/growth/CalendarTool.tsx`
- Propósito: Agenda de `/calendario`. Elige servicios, día y hora, deja los datos y puede cancelar con el id de la reserva.
- Por qué está así: Isla `client:load`. Llama a `fetchAvailability`, `bookAppointment` y `cancelAppointment`. El `h1` lo pinta `ContactBanner`. Los días del mes son botones propios.
- CSS: `CalendarTool.css` — mes y huecos. `#e23b3b` y `#f3f3f3` fuera de paleta. También importa `sections/ContactForm.css` para compartir campos con el formulario.
- Exporta: `CalendarTool`.
- Depende de: `src/lib/site-identity.ts`, `src/lib/growth/calendar/calendar-rules.ts`, `src/lib/growth/calendar/client.ts`, `src/lib/content/calendar-page.ts`, `src/lib/growth/calendar/types.ts`, `sections/ContactBanner.tsx`, `ui/Button.tsx`, `ui/TextField.tsx`, `sections/ContactForm.css`, `CalendarTool.css`.
- Lo usan: `pages/calendario.astro`, `pages/en/calendar.astro`.
- Datos: `CalendarPageCopy` (servicios, labels) y `SiteIdentity`. Los huecos llegan de `GET /api/calendar/availability`.
- Hallazgos: R-03, S-11, D-05.

### `src/components/growth/MarketingQuiz.tsx`
- Propósito: Diagnóstico en `/diagnostico-marketing-digital`. Preguntas, datos de contacto y resultado.
- Por qué está así: Isla `client:load`. Al montar abre sesión (`startQuizSession`). Cada paso actualiza la sesión; al final `submitQuiz`. Un botón de la UI es nativo, no `Button`.
- Exporta: `MarketingQuiz`.
- Depende de: `ui/Button.tsx`, `ui/TextField.tsx`, `src/lib/growth/quiz/questions.ts`, `src/lib/growth/quiz/session.ts`, `src/lib/growth/quiz/client.ts`, `src/lib/growth/quiz/types.ts`.
- Lo usan: `pages/diagnostico-marketing-digital.astro`. No hay par `/en`.
- Datos: `QUIZ_QUESTIONS` y el total de pasos. El resultado (`QuizScoreResult`) vuelve del API. El copy de la página (el hero) es otro documento, no este componente.

## icons

Trazos. Si `name` es URL o ruta, los tres pintan `<img alt="">`.

### `src/components/icons/IndustryIcons.tsx`
- Propósito: Seis iconos de industria: fábrica, corazón, edificio, avión, cubiertos, app.
- Exporta: `INDUSTRY_ICON_NAMES`, `IndustryIconName`, `IndustryIcon`.
- Depende de: —
- Lo usan: `sections/IndustryGrid.tsx`, `sections/ServicePageSection.astro`.
- Datos: nombre. Si no está en el mapa, cae en `factory`.

### `src/components/icons/ServiceIcons.tsx`
- Propósito: Nueve iconos de servicio (video, activity, users, target, badge, box, focus, spark, code).
- Por qué está así: El mapa local cubre esos nueve. Cualquier otro nombre delega en `NavIcon`, que conoce más glifos (factory, meta, googleads, …).
- Exporta: `SERVICE_ICON_NAMES`, `ServiceIconName`, `ServiceIcon`.
- Depende de: `sections/NavIcon.tsx`.
- Lo usan: `sections/IndustryServices.tsx`, `sections/ServiceGrid.tsx`, `sections/ServicePageSection.astro`, `sections/ServiceWhy.tsx`.
- Datos: nombre o URL.

### `src/components/icons/PillarIcons.tsx`
- Propósito: Seis iconos de pilar, sacados de `src/assets/iconografia-hiweb.svg` (geometría Lucide, con margen para que el trazo no se corte). También elige icono según el título de una card de servicio.
- Exporta: `IconUsers`, `IconGlobe`, `IconTarget`, `IconCheckCircle`, `IconLayers`, `IconWorkflow`, `PILLAR_ICON_NAMES`, `PillarIconName`, `PillarIcon`, `iconForServiceOverviewCard`.
- Depende de: —
- Lo usan: `content/SectionRenderer.astro`, `sections/PillarGrid.tsx`, `sections/ServiceFocus.tsx`, `sections/ServicePageSection.astro`, `sections/ServicePlans.tsx` (`IconCheckCircle`), `pages/servicios/[slug].astro`, `pages/en/services/[slug].astro`.
- Datos: nombre o URL. `iconForServiceOverviewCard` mira el título sin acentos (“que es”, “como funciona”, “resultado”) y si no reconoce, rota por índice.

## content

### `src/components/content/BlogBody.astro`
- Propósito: Cuerpo del post. Portable Text si el registro trae `portableText`; si no, el `Content` de la colección Astro.
- Exporta: componente Astro (prop `post`).
- Depende de: `src/lib/content/types.ts`, `PortableTextImage.astro`, `PortableTextTable.astro`.
- Lo usan: `pages/blog/[slug].astro`, `pages/en/blogs/[slug].astro`.
- Datos: `PostRecord`. Tipos custom del portable text: `image`, `table`, `blogTable`.

### `src/components/content/PortableTextImage.astro`
- Propósito: Figura de una imagen de Sanity dentro del post, con pie opcional.
- Por qué está así: `urlFor(node).width(1200).auto('format')`. Un solo ancho, sin `srcset`. `loading="lazy"`.
- Exporta: componente Astro (nodo de `astro-portabletext`).
- Depende de: `src/sanity/image.ts`.
- Lo usan: `BlogBody.astro`.
- Datos: `alt`, `caption`, `asset`. Sin asset no pinta.
- Hallazgos: P-06.

### `src/components/content/PortableTextTable.astro`
- Propósito: Tabla del portable text. La primera fila puede ser `<th>`. En móvil cada celda lleva `data-label`.
- Exporta: componente Astro.
- Depende de: —
- Lo usan: `BlogBody.astro`.
- Datos: `rows`, `caption`, `hasHeaderRow` o `headerRows`. Acepta celda string o bloque Portable Text y la aplana a texto. Sin filas, `null`.

### `src/components/content/SectionRenderer.astro`
- Propósito: Un bloque de landing (`/[slug]`) según `_type`. Es el otro árbol, distinto de servicio, industria y nosotros.
- Exporta: componente Astro (props `section`, `industryName`).
- Depende de: `CasePreview`, `CaseStories`, `FaqSection`, `FinalCtaBand`, `IndustryGrid`, `IndustryHero`, `IndustryServices`, `MetricsBand`, `PageHero`, `PillarGrid`, `BeforeAfter`, `PresenceMap`, `ProcessPhases`, `ServiceGrid`, `TeamGrid`, `icons/PillarIcons.tsx`, `src/components/ui`, `src/lib/content/format.ts`, `src/lib/content/types.ts`.
- Lo usan: `pages/[slug].astro`.
- Datos: `LandingSection`. `pageHero` con `variant="photo"` → `IndustryHero`; si no, `PageHero`. Luego `pillarGrid`, `serviceGrid` (variante `industry` → `IndustryServices`), `industryGrid`, `processPhases`, `caseStories`, `casePreview`, `faqSection`, `finalCta`, `teamGrid`, `metricsBand`, `beforeAfter`, `presenceMap`. Las historias salen de `CaseRecord` con `formatCaseStat`.

## seo

### `src/components/seo/JsonLd.astro`
- Propósito: Imprime uno o varios `<script type="application/ld+json">` con el objeto que le pasen.
- Exporta: componente Astro (prop `data`).
- Depende de: —
- Lo usan: — (el grafo coincide: nadie lo importa).
- Datos: un objeto o un arreglo. `JSON.stringify` directo.
- Hallazgos: S-09. El JSON-LD que sí se publica lo escribe `Layout.astro` con `src/lib/schema.ts`.
