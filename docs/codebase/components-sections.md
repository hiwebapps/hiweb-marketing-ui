# Secciones

`src/components/sections`, incluidas las primitivas. El `.css` hermano va en la ficha del componente.

## Qué monta el home

`src/pages/index.astro` y `src/pages/en/index.astro` no importan `HomePage`. Recorren `sectionOrder` del copy de la home y pintan un bloque por tipo. El grafo coincide con esos imports.

| Tipo | Componente | Hidratación |
| --- | --- | --- |
| `homeHero` | `HeroStudioA` | `client:load` |
| `homePillars` | `PillarGrid` | HTML, sin directiva `client:` |
| `homeServices` | `ServiceGrid` | HTML |
| `homeIndustries` | `IndustryGrid` | `client:visible` |
| `homeStories` | `CaseStories` | `client:visible` |
| `homeProcess` | `ProcessPhases` | `client:visible` |
| `homeMetrics` | `MetricsBand` | `client:visible`, solo si hay métricas |
| `homeTeam` | `TeamGrid` (`slider`) | `client:visible` |
| `homeFaq` | `FaqSection` | `client:visible` |
| `beforeAfter` | `BeforeAfter` | `client:visible`, solo si el bloque trae pares |
| `homeCta` | `FinalCtaBand` → `FinalCta` | `client:load` dentro de la banda |

`Layout.astro` envuelve esa home (y el resto del sitio) con `SiteNav` (`client:load`) y `SiteFooter` (`client:idle`).

`HomePage`, `HomeAfterHero` y `HomeBelowFold` arman un demo parecido. Ninguna página los importa. El comentario de `HomePage` dice que `index.astro` prefiere `HomeAfterHero` en SSR; el archivo de la página no lo importa.

## Heroes que ninguna página monta

Comprobado en el grafo (`Lo usan`) y en los imports de `src/pages`:

- `HeroSection` — solo el barril `sections/index.ts`. Lo pinta `SectionsKitPage` en `/sections`. Arrastra `DriftWall`, `GradientWaves`, `HeroWavesBackground` y `heroProjectTiles.js`.
- `HeroStudioB` — solo el barril. Lo pinta el mismo kit.
- `src/components/Hero.tsx` (ficha en `components-resto.md`) — el grafo no le da consumidores. Cero imports.

Sí los monta una ruta: `HeroStudioA` (home), `IndustryHero` (servicios, industrias, nosotros y los tres `*PageSection`), `BlogHero` (índices de blog y portafolio), `PageHero` (legales, diagnóstico y landings) y `CaseTelescopeHero` (`/portafolio/:slug`).

El kit (`/sections`, `client:only`) también muestra piezas que ninguna ruta de marketing importa: `TrustStrip`, `ProblemPov`, `HowItWorks`, `ValueChapter`, `SocialProof`, `FitSignal`, y los contenedores `HomePage`, `WorkPage` y `ContactPage`.

## Primitivas

### `src/components/sections/primitives/Eyebrow.tsx`
- Propósito: Etiqueta de sección en mayúsculas, con índice opcional (`01`, `1.1`).
- Por qué está así: Color de token (`text-muted` o `text-canvas/55` si `tone="on-ink"`) y tracking de display. No es decoración: marca en qué bloque estás.
- Exporta: `Eyebrow`.
- Depende de: —
- Lo usan: `sections/index.ts`, `PageHero.tsx`.
- Datos: `children`, `index`, `tone`.

### `src/components/sections/primitives/heading.tsx`
- Propósito: Parte un título en líneas (`HeadingText`) y aplica el ancho máximo de Sanity (`headingProps`).
- Exporta: `HeadingText`, `headingProps`.
- Depende de: `src/lib/heading.ts` (`headingMaxWidth`).
- Lo usan: `BlogHero`, `FinalCta`, `HeroStudioA`, `IndustryGrid`, `IndustryHero`, `MetricsBand`, `PageHero`, `PresenceMap`, `SectionHeader`, `ServicePitch`, `ServiceWhy`.
- Datos: el string `headingWidth` que viene del documento. Sin valor reconocido no pone `maxWidth`.

### `src/components/sections/primitives/HeroAtmosphere.tsx`
- Propósito: Fondo solo del hero claro: `spotlight`, `mesh`, `wash` o `none`.
- Por qué está así: Los blobs del mesh usan tokens de acento (`accent-purple`, `accent-cyan`, `accent-orange`) y las clases `animate-mesh-*`. El comentario dice que el drift respeta reduced motion vía CSS global.
- Exporta: `HeroAtmosphere`, `AtmosphereVariant`.
- Depende de: —
- Lo usan: `sections/index.ts`, `PageHero.tsx`.
- Datos: `variant` (default `spotlight`) y `animated`.

### `src/components/sections/primitives/HeroGradientShader.tsx`
- Propósito: Lienzo vacío para un gradiente WebGL: fallback CSS y `<canvas data-hero-shader>`.
- Por qué está así: El comentario dice que `src/scripts/hero-shader.ts` arranca el GL sin hidratar React. Ese script no lo importa nadie, y este componente no tiene JSX fuera del barril.
- Exporta: `HeroGradientShader`.
- Depende de: —
- Lo usan: `sections/index.ts` (reexport). Cero usos en JSX.
- Datos: `className`.
- Hallazgos: D-03.

### `src/components/sections/primitives/ProductFrame.tsx`
- Propósito: Marco de evidencia (borde hairline, `bg-canvas`, caption en mayúsculas).
- Por qué está así: Tokens `border` y `canvas`. El contenido debe ser UI, no ilustración.
- Exporta: `ProductFrame`.
- Depende de: —
- Lo usan: `sections/index.ts`, `ValueChapter.tsx`.
- Datos: `children`, `caption`.
- Hallazgos: D-03.

### `src/components/sections/primitives/SectionBand.tsx`
- Propósito: Contenedor de sección. Cambia de superficie y deja aire; no dibuja divisores.
- Por qué está así: `tone` mapea a tokens (`bg-canvas`, `bg-surface`, `bg-ink`, transparente). El ancho es `--section-max`. Si hay `id`, marca `data-scroll-section` para el indicador de scroll.
- Exporta: `SectionBand`.
- Depende de: —
- Lo usan: casi todas las secciones de marketing, `PortalPageView`, y las páginas de legales, blog, portafolio y términos (el grafo lista 36 archivos).
- Datos: `id`, `tone` (`canvas` | `surface` | `ink` | `wash`), `dense`, tag `section` | `div` | `footer`.
- Hallazgos: D-03.

### `src/components/sections/primitives/SectionHeader.tsx`
- Propósito: Cabecera de sección: badge, `h2` y un párrafo.
- Por qué está así: El `h2` lleva `data-split` para que `src/scripts/motion.ts` le aplique SplitText. `split={false}` lo apaga. El badge sale del kit `ui`.
- Exporta: `SectionHeader`.
- Depende de: `src/components/ui`, `primitives/heading.tsx`.
- Lo usan: `DesignSystem`, `PortalPageView` y la mayoría de secciones que tienen título de bloque (el grafo lista 27 archivos, más `pages/portafolio/[slug].astro`).
- Datos: `eyebrow`, `title`, `description`, `headingWidth`, `badgeVariant`, `tone`, `actions`.
- Hallazgos: S-04 (en la home el único título visible de este patrón es `h2`; el hueco de `h1` está en el hero).

## Secciones

### `src/components/sections/AboutHistory.tsx`
- Propósito: Bloque de historia en `/nosotros`: cabecera, collage de tres fotos y dos columnas de copy.
- CSS: `AboutHistory.css` — rejilla del collage y de las columnas. Lo importan también `nosotros.astro` y `en/nosotros.astro`.
- Exporta: `AboutHistoryImage`, `AboutHistoryColumn`, `AboutHistory`.
- Depende de: `SectionBand`, `SectionHeader`, `AboutHistory.css`.
- Lo usan: `AboutPageSection.astro`, `sections/index.ts`, `pages/nosotros.astro`, `pages/en/nosotros.astro`.
- Datos: props del bloque `aboutHistory`. Si falta foto o copy, usa picsum y el texto por defecto del componente.

### `src/components/sections/AboutPageSection.astro`
- Propósito: Despacha un bloque de la página Nosotros según `_type`.
- Exporta: componente Astro (props `section`, `locale`, `people`, fallbacks de imagen).
- Depende de: `IndustryHero`, `AboutHistory`, `PillarGrid`, `PresenceMap`, `PortalShowcase`, `BeforeAfter`, `TeamGrid`, `FinalCtaBand`, `src/lib/locale.ts`, `src/lib/content/types.ts`, `src/components/ui`.
- Lo usan: `pages/nosotros.astro`, `pages/en/nosotros.astro`.
- Datos: `AboutSection`. `aboutHero` → `IndustryHero`. `aboutHistory` exige dos columnas. `aboutPillars` arma `Pillar[]` y prefija `/en` con `localePath`. `aboutPortal` y `aboutProcess` pintan los dos `PortalShowcase`. `beforeAfter` va con `client:visible`. `aboutTeam` va con `client:load`, slider y filtros. `aboutMap` va con `client:visible`. `aboutCta` delega en `FinalCtaBand`.
- Hallazgos: S-05 (el par de contacto que arma esta página no es simétrico con el inglés).

### `src/components/sections/AboutTeaser.tsx`
- Propósito: Adelanto de Nosotros: copy a la izquierda y tarjeta de presencia (Mérida, Cancún, Monterrey) a la derecha.
- Exporta: `AboutTeaser`.
- Depende de: `src/components/ui`, `SectionBand`, `SectionHeader`, `src/data/site.ts` (`HOME_ABOUT`).
- Lo usan: `sections/index.ts`. Ninguna página lo monta.
- Datos: defaults de `HOME_ABOUT`. El enlace es `/nosotros`.

### `src/components/sections/BeforeAfter.tsx`
- Propósito: Comparador antes/después. Un `range` recorta el lado “antes”; acepta imagen o video.
- Por qué está así: Isla (`client:visible` en home, about, industria y servicio). El video se pausa si `prefers-reduced-motion`. El control es un `<input type="range">`, no un componente de `ui`.
- CSS: `BeforeAfter.css` — escenario, tags y handle. Reduced motion apaga transiciones que el TSX no declara.
- Exporta: `BeforeAfterPair`, `BeforeAfter`.
- Depende de: `src/components/ui` (tipo `BadgeVariant`), `SectionBand`, `SectionHeader`, `BeforeAfter.css`.
- Lo usan: `SectionRenderer.astro`, `PortalPageView.tsx`, `AboutPageSection.astro`, `IndustryPageSection.astro`, `ServicePageSection.astro`, `pages/index.astro`, `pages/en/index.astro`, `pages/portafolio/[slug].astro`.
- Datos: `pairs` (labels, imagen o video). Sin pares no renderiza.
- Hallazgos: D-04.

### `src/components/sections/BlogHero.tsx`
- Propósito: Hero oscuro del índice de blog y, en modo solo copy, del índice de portafolio. Tarjeta destacada opcional.
- Por qué está así: El `h1` lleva `data-split`. La foto destacada va con `alt=""` porque el enlace ya tiene `aria-label`.
- CSS: `BlogHero.css` — campo de blobs y la card. Reduced motion en la hoja. También la importan los índices de blog y `portafolio/index.astro`.
- Exporta: `BlogFeaturedPost`, `BlogHero`.
- Depende de: `src/lib/blog.ts` (`BLOG_READING_MINUTES`), `src/components/ui`, `primitives/heading.tsx`, `BlogHero.css`.
- Lo usan: `sections/index.ts`, `pages/blog/index.astro`, `pages/en/blogs/index.astro`, `pages/portafolio/index.astro`.
- Datos: props de la página. Sin imagen del destacado usa picsum con el id del post. El href por defecto es `/blog/:id`.
- Hallazgos: S-07, S-11.

### `src/components/sections/BlogIndex.tsx`
- Propósito: Rejilla del blog con filtro por servicio y animación de entrada de las cards.
- Por qué está así: Isla `client:load` en los índices. GSAP (`useGSAP`, `MOTION`) revela las cards al cambiar el filtro; con reduced motion solo deja `opacity: 1`. Los filtros son radios pintados a mano, no `Button`.
- CSS: `BlogIndex.css` — cards y chips. La reutiliza `CasesIndex`. Reduced motion en la hoja. También la importan los índices de blog y de portafolio.
- Exporta: `BlogCard`, `BlogServiceFilter`, `BlogIndex`.
- Depende de: `src/lib/motion.ts`, `src/lib/blog.ts`, `src/components/ui`, `SectionHeader`, `BlogIndex.css`.
- Lo usan: `sections/index.ts`, `pages/blog/index.astro`, `pages/en/blogs/index.astro`.
- Datos: posts de la página. Si no llegan, el componente trae posts `placeholder`. La portada sale de `postCoverUrl` o de picsum.
- Hallazgos: R-02, S-07, D-04.

### `src/components/sections/BlogPostToc.tsx`
- Propósito: Índice sticky del artículo. Marca el heading visible y sigue el scroll del propio TOC.
- Por qué está así: Isla `client:load`. Escribe los `id` en los `h2`/`h3` de `[data-blog-body]`. El scroll del TOC es `smooth` salvo `prefers-reduced-motion`.
- CSS: `BlogPost.css` — no es solo el TOC. Define la rejilla del artículo (toc / cabecera / cuerpo / relacionados), `--blog-post-pad-top: 9.5rem` y reduced motion. La importan este componente y `blog/[slug].astro` / `en/blogs/[slug].astro`. El TSX solo pinta el `<nav>`.
- Exporta: `BlogPostToc`.
- Depende de: `src/lib/blog.ts` (`PostHeading`), `BlogPost.css`.
- Lo usan: `sections/index.ts`, `pages/blog/[slug].astro`, `pages/en/blogs/[slug].astro`.
- Datos: `headings` calculados en la página. Sin headings no renderiza.
- Hallazgos: D-09 (`BlogPost.css`, 631 líneas).

### `src/components/sections/CaseFilter.tsx`
- Propósito: Filtro de casos por industria y servicio, y la rejilla resultante.
- Por qué está así: Estado en React. Los `<select>` son nativos, no `SelectField`.
- Exporta: `FilterableCase`, `CaseFilter`.
- Depende de: `CasePreview.tsx` (`CaseCard`, `CaseItem`).
- Lo usan: `sections/index.ts`. Ninguna página lo monta.
- Datos: `cases`, `industries`, `services`. Vacío: invita a `/contacto`.
- Hallazgos: D-04.

### `src/components/sections/CasePreview.tsx`
- Propósito: Tres cards de caso (cliente, industria, outcome) y la sección que las envuelve.
- Por qué está así: La barra de color usa tokens `accent-cyan` / `orange` / `purple`.
- Exporta: `CaseItem`, `CaseCard`, `CasePreview`.
- Depende de: `SectionBand`, `SectionHeader`.
- Lo usan: `SectionRenderer.astro`, `CaseFilter.tsx`, `sections/index.ts`, `WorkPage.tsx`.
- Datos: default interno (Pulse, Norte Industrial, Marina Bay) con href `/portafolio/:id`. La landing puede pasar casos reales.

### `src/components/sections/CasesIndex.tsx`
- Propósito: Índice de portafolio. Misma card que el blog, filtrada por industria.
- Por qué está así: Isla `client:load` en `portafolio/index.astro`. GSAP igual que `BlogIndex`; reduced motion deja las cards visibles.
- CSS: no tiene hoja propia. Importa `BlogIndex.css`.
- Exporta: `CaseIndexCard`, `CaseCards`, `CasesIndex`.
- Depende de: `src/lib/motion.ts`, `src/lib/blog.ts` (`postCoverUrl`), `SectionHeader`, `BlogIndex.css`.
- Lo usan: `sections/index.ts`, `pages/portafolio/index.astro`, `pages/portafolio/[slug].astro`.
- Datos: casos e industrias que pasa la página. Sin foto, `postCoverUrl('caso-' + id)`. El href por defecto es `/portafolio/:id`.
- Hallazgos: S-07, D-04.

### `src/components/sections/CaseStories.tsx`
- Propósito: Slider de testimonios: quote, foto, stats y enlace al caso.
- Por qué está así: Isla `client:visible` en home, industria, servicio, portafolio y landings. GSAP mueve el track; el swipe tiene umbral de 56 px. `prefersReducedMotion` acorta la animación. Los botones de paso no son `Button`.
- CSS: `CaseStories.css` — track y cards. Reduced motion en la hoja. `Layout.astro` y varias páginas la importan aparte del componente.
- Exporta: `CaseStoryStat`, `CaseStory`, `CaseStories`.
- Depende de: `src/components/ui`, `SectionBand`, `SectionHeader`, `CaseStories.css`.
- Lo usan: `SectionRenderer.astro`, `sections/index.ts`, `IndustryPageSection.astro`, `ServicePageSection.astro`, home ES/EN, industrias ES/EN, servicios ES/EN, `pages/portafolio/[slug].astro`.
- Datos: stories de la página. Default interno con fotos de pravatar si no hay `photo`. `locale` cambia las etiquetas de control.
- Hallazgos: D-04, D-05 (`#161616` en el CSS).

### `src/components/sections/CaseTelescopeHero.tsx`
- Propósito: Hero del caso. Zoom “telescopio” al cargar, capas frontales y fotos flotantes.
- Por qué está así: Isla `client:load` en `portafolio/[slug].astro`. GSAP anima `--progress` (1.55 s). Con reduced motion deja el progreso en 1 y oculta los floats.
- CSS: `CaseTelescopeHero.css` — la perspectiva y el blur viven en variables que el TSX solo escribe. Reduced motion en la hoja. La página del caso también importa el CSS.
- Exporta: `CaseTelescopeHero`.
- Depende de: `CaseTelescopeHero.css`.
- Lo usan: `sections/index.ts`, `pages/portafolio/[slug].astro`.
- Datos: `titleLeft`, `titleRight`, imagen, hasta 10 `floatImages`, `year`, `eyebrow`.
- Hallazgos: S-07, S-11.

### `src/components/sections/ContactBanner.tsx`
- Propósito: `h1` de contacto o calendario, más enlaces a email, teléfono y WhatsApp.
- Exporta: `ContactBanner`.
- Depende de: `src/lib/site-identity.ts` (`SiteIdentity`).
- Lo usan: `CalendarTool.tsx`, `ContactForm.tsx`.
- Datos: `title`, `subtitle` y el `site` (email, `phoneHref`, WhatsApp).
- Hallazgos: S-11.

### `src/components/sections/ContactDetails.tsx`
- Propósito: Tres bandas de un contacto viejo: canales, “qué pasa después” y ciudades. También exporta un hueco de calendario.
- Exporta: `ContactDetails`, `CalendarPlaceholder`.
- Depende de: `src/data/site.ts` (`CONTACT_NEXT_STEPS`, `SITE`), `SectionBand`, `SectionHeader`.
- Lo usan: `sections/index.ts`. Ninguna página los monta. El calendario real es `CalendarTool`.
- Datos: teléfono, email, WhatsApp y `locales` de `SITE`.

### `src/components/sections/ContactForm.tsx`
- Propósito: Formulario de `/contacto`. Arma campos según el copy (texto, servicios en checkbox, presupuesto en radio, relato).
- Por qué está así: El envío es `mailto:` al email del sitio, no n8n ni D1. Checkboxes y radios son `<input>` nativos; el kit `Checkbox` no entra.
- CSS: `ContactForm.css` — rejilla, errores y el banner. Quince hex son fallback de token; `#e23b3b` y `#6b6b6b` se salen de la paleta. La reutiliza `CalendarTool`.
- Exporta: `ContactForm`.
- Depende de: `src/lib/content/contact.ts`, `src/lib/site-identity.ts`, `src/components/ui` (`Button`, `TextArea`, `TextField`), `ContactBanner`, `ContactForm.css`.
- Lo usan: `sections/index.ts`, `pages/contacto.astro`. No hay `pages/en/contacto.astro`.
- Datos: `ContactPageCopy` (campos, servicios, presupuestos, errores) y `SiteIdentity`.
- Hallazgos: D-04, D-05.

### `src/components/sections/ContactPage.tsx`
- Propósito: Página de contacto de demo: formulario `mailto:hola@hiweb.marketing` y un `FinalCta`.
- Exporta: `ContactPage`.
- Depende de: `src/components/ui` (`Button`, `TextArea`, `TextField`, `SelectField`), `FinalCta`, `SectionBand`, `SectionHeader`.
- Lo usan: `sections/index.ts`. Ninguna página lo monta. `/contacto` usa `ContactForm`.
- Datos: opciones de “qué necesitas” fijas en el componente.
- Hallazgos: D-04 (`SelectField` solo vive aquí y en el catálogo), D-08.

### `src/components/sections/FaqSection.tsx`
- Propósito: Acordeón de FAQ, por ítems planos o por categorías. Puede emitir schema.
- Por qué está así: Isla `client:visible` en home, industrias y servicios. GSAP anima alto, opacidad y chevron; `prefersReducedMotion` pone la duración en 0. El chevron es un `<button>` propio.
- CSS: `FaqSection.css` — ítem y panel. Reduced motion en la hoja. `Layout` y las homes la importan aparte.
- Exporta: `FaqItem`, `FaqCategory`, `FaqSection`.
- Depende de: `src/data/site.ts` (`HOME_FAQ_CATEGORIES`), `src/lib/content/faq-answer.ts`, `src/lib/content/types.ts`, `SectionBand`, `SectionHeader`, `FaqSection.css`.
- Lo usan: `SectionRenderer.astro`, `sections/index.ts`, `IndustryPageSection.astro`, `ServicePageSection.astro`, home ES/EN, industrias ES/EN, servicios ES/EN.
- Datos: `categories` o `items`. Sin props usa `HOME_FAQ_CATEGORIES`. La respuesta pasa por `renderFaqAnswer`. `withSchema` y `columns` los manda la página de servicio.
- Hallazgos: R-05, D-04, P-05.

### `src/components/sections/FinalCta.tsx`
- Propósito: Cierre. Panel oscuro, marquee de fotos y un solo botón.
- Por qué está así: En las páginas entra por `FinalCtaBand` con `client:load`. El `h2` lleva `data-split`. El tipo acepta CTA secundario; el render solo pinta el primario (“una sola decisión”).
- CSS: `FinalCta.css` — el marquee es animación CSS, no GSAP. Reduced motion lo detiene. `--cta-ink: #111111` y un `#1a1a1a` fuera de paleta. `Layout.astro` importa la hoja.
- Exporta: `FinalCta`.
- Depende de: `src/components/ui`, `primitives/heading.tsx`, `FinalCta.css`.
- Lo usan: `ContactPage.tsx`, `FinalCtaBand.astro`, `sections/index.ts`, `WorkPage.tsx`. Las páginas lo reciben a través de la banda.
- Datos: badge, título, descripción, CTA y `images`. Sin imágenes usa el set fijo (fotos de `/images/services` y picsum). Los `alt` van vacíos: el marquee es `aria-hidden`.
- Hallazgos: D-05, P-05.

### `src/components/sections/FinalCtaBand.astro`
- Propósito: Envuelve `FinalCta` como isla y le pasa el fondo de fotos.
- Por qué está así: `client:load` en el componente React. Las fotos salen de `getCtaBackdrop()` en el build.
- Exporta: componente Astro. Reenvía badge, título, descripción, CTAs y `headingWidth`.
- Depende de: `FinalCta.tsx`, `src/lib/content` (`getCtaBackdrop`).
- Lo usan: `SectionRenderer.astro`, los tres `*PageSection.astro`, y las páginas de blog, home, industrias, nosotros, portafolio y servicios (ES y EN donde existe el par).
- Datos: props del bloque de cierre más el arreglo de imágenes del contenido.

### `src/components/sections/FitSignal.tsx`
- Propósito: Tres modelos de engagement (sprint, retainer, proyectos) con un CTA cada uno.
- Exporta: `FitSignal`.
- Depende de: `src/components/ui`, `SectionBand`, `SectionHeader`.
- Lo usan: `sections/index.ts` y el kit. Ninguna ruta de marketing.
- Datos: `models` o el default interno. Todos los href van a `/contacto`.
- Hallazgos: D-03, D-08.

### `src/components/sections/HeroSection.tsx`
- Propósito: Hero oscuro de laboratorio: copy a la izquierda, muro 3D a la derecha, CTAs con `BorderGlow`.
- Por qué está así: Fondo `#070912` (el mismo hex que `HeroWavesBackground`, no el token `--color-hiweb-dark`). Alturas en px arbitrarios. No es isla por sí mismo: solo lo monta el kit, que va `client:only`.
- Exporta: `HeroSection`.
- Depende de: `effects/BorderGlow.jsx`, `effects/DriftWall.jsx`, `effects/heroProjectTiles.js`, `effects/HeroWavesBackground.tsx`.
- Lo usan: `sections/index.ts` (y desde ahí `SectionsKitPage`). Ninguna página de marketing.
- Datos: copy y CTAs por defecto. `projects` cae en `HERO_PROJECT_TILES` (picsum).
- Hallazgos: D-03, D-05, D-08.

### `src/components/sections/HeroStudioA.tsx`
- Propósito: Hero de la home. Coverflow 3D, autoplay de 3.5 s, arrastre y click al portafolio.
- Por qué está así: Isla `client:load`. GSAP coloca las cards (`spacing`, `rotate`, escala según el ancho). `prefersReducedMotion` no autoavanza. El título es un `h2`, no un `h1`. Hay un `<button>` de play/pausa aparte de `Button`.
- CSS: `HeroStudioA.css` — con `html.motion-ready` y sin reduced motion oculta título, lead, CTAs y carrusel hasta `.is-ready`, para que no parpadeen al hidratar. `Layout` quita `motion-ready` si el script de motion no arranca. Un hex fuera de paleta (`#ddd`).
- Exporta: `HeroStudioSlide`, `HeroStudioA`.
- Depende de: `src/lib/motion.ts`, `src/components/ui`, `primitives/heading.tsx`, `HeroStudioA.css`.
- Lo usan: `HomePage.tsx`, `sections/index.ts`, `pages/index.astro`, `pages/en/index.astro`.
- Datos: título, lead, CTAs, `slides` y `headingWidth` del documento de home. Sin slides el carrusel queda vacío.
- Hallazgos: R-01, S-04, S-07, P-04, P-05, D-05, D-09.

### `src/components/sections/HeroStudioB.tsx`
- Propósito: Hero partido de laboratorio: copy, chips de Figma y cohete, y tres mockups (browser + dos teléfonos).
- Por qué está así: GSAP (`useGSAP`, `MOTION`) entra el copy y flota los devices. `gsap.matchMedia` con reduced motion los deja en su sitio, sin loop. El CTA es un `<a class="hero-studio-b__cta">`, no `Button`. El título es `h2`.
- CSS: `HeroStudioB.css` — la pastilla del CTA es `#111111` / hover `#1f1f1f`. Verde `#22c55e` y `#ff5a36` no son tokens. El TSX no explica esos colores.
- Exporta: `HeroStudioB`.
- Depende de: `src/lib/motion.ts`, `HeroStudioB.css`.
- Lo usan: `sections/index.ts` y el kit. Ninguna página.
- Datos: copy, CTA `/contacto` y tres fotos fijas de `/images/services` enlazadas a casos de ejemplo.
- Hallazgos: D-03, D-04, D-05, D-08.

### `src/components/sections/HomeAfterHero.tsx`
- Propósito: Cuerpo de home para demos: pilares, servicios y, en `HomeBelowFold`, el equipo.
- Por qué está así: El comentario pide HTML estático y motion por `data-*`. `IndustryGrid` no está aquí: en la home real es isla.
- Exporta: `HomeAfterHero`, `HomeBelowFold`.
- Depende de: `src/data/webflow-home.ts`, `src/lib/content/types.ts`, `PillarGrid`, `ServiceGrid`, `TeamGrid`.
- Lo usan: `HomePage.tsx`, `sections/index.ts`. `index.astro` no los importa.
- Datos: `services`, pilares opcionales (`homePillarsWithIcons`) e intros. `HomeBelowFold` muestra 4 personas y enlace a `/nosotros#nosotros`.

### `src/components/sections/HomePage.tsx`
- Propósito: Home ensamblada para demos: `HeroStudioA`, `HomeAfterHero`, `ProcessPhases` y `HomeBelowFold`.
- Exporta: `HomePage`.
- Depende de: `src/data/site.ts` (`PROCESS_PHASES`), `HeroStudioA`, `HomeAfterHero`, `ProcessPhases`.
- Lo usan: `sections/index.ts`. Ninguna página.
- Datos: servicios vacíos y las fases de `site.ts`. No lee el documento Sanity de la home.
- Hallazgos: D-08.

### `src/components/sections/HowItWorks.tsx`
- Propósito: Tres pasos (diagnóstico, sistema, ejecución) y dos CTAs.
- Exporta: `HowItWorks`.
- Depende de: `src/components/ui`, `SectionBand`, `SectionHeader`.
- Lo usan: `sections/index.ts` y el kit. Ninguna ruta de marketing. El proceso de la home es `ProcessPhases`.
- Datos: `steps` o el default interno. CTAs a `/contacto` y `#casos`.
- Hallazgos: D-03, D-08.

### `src/components/sections/IndustryGrid.tsx`
- Propósito: Carrusel de industrias. En escritorio se arrastra; en móvil, swipe.
- Por qué está así: Isla `client:visible` en la home y en la página de servicio. GSAP mueve el track. `prefersReducedMotion` y un umbral de swipe de 56 px. `locale` cambia “Industria anterior/siguiente”; el default es `es`, y la home EN no lo pasa.
- CSS: `IndustryGrid.css` — slides y máscara. Reduced motion en la hoja. 411 líneas.
- Exporta: `IndustryCard`, `IndustryGrid`.
- Depende de: `icons/IndustryIcons.tsx`, `src/components/ui`, `SectionBand`, `primitives/heading.tsx`, `IndustryGrid.css`.
- Lo usan: `SectionRenderer.astro`, `sections/index.ts`, `ServicePageSection.astro`, home ES/EN, servicios ES/EN.
- Datos: `industries` (slug, nombre, tagline, puntos, icono). Acento rotativo con hex de token (`#927afe`, `#01e7ff`, `#fe621c`, `#74c465`). Icono por slug o `IndustryIcon`.
- Hallazgos: R-04, D-04, D-09, P-05.

### `src/components/sections/IndustryHero.tsx`
- Propósito: Hero con foto de fondo, badges, `h1` y un CTA. Lo usan industria, servicio y nosotros.
- Por qué está así: El `h1` lleva `data-split`. `fetchPriority="high"` en la foto. Misma gramática de blobs que el hero de home, sin carrusel.
- CSS: `IndustryHero.css` — overlay, blobs y copy. Reduced motion en la hoja. `Layout.astro` la importa.
- Exporta: `IndustryHeroBadge`, `IndustryHero`.
- Depende de: `src/lib/heading.ts` (`headingPlain`, para el `aria-label`), `src/components/ui`, `primitives/heading.tsx`, `IndustryHero.css`.
- Lo usan: `SectionRenderer.astro`, `AboutPageSection.astro`, `IndustryPageSection.astro`, `ServicePageSection.astro`, `sections/index.ts`, y las páginas de industrias, nosotros y servicios (ES y EN).
- Datos: título, descripción, imagen, `object-position`, badges, CTA. Defaults: badge “Industria” y CTA `#casos`.
- Hallazgos: S-11.

### `src/components/sections/IndustryPageSection.astro`
- Propósito: Despacha un bloque de industria según `_type`.
- Exporta: componente Astro.
- Depende de: `IndustryHero`, `IndustryServices`, `PillarGrid`, `CaseStories`, `BeforeAfter`, `FaqSection`, `FinalCtaBand`, `src/lib/content/types.ts`, `src/components/ui`.
- Lo usan: `pages/industrias/[slug].astro`, `pages/en/industrias/[slug].astro`.
- Datos: `IndustrySection` más nombre, foto de respaldo, servicios e historias. `industryHero` → `IndustryHero`. `industryWhy` → `PillarGrid`. `industryServices` → `IndustryServices`. `industryCases` → `CaseStories` con `client:visible`. `industryFaq` → `FaqSection`. `beforeAfter` con `client:visible`. `industryCta` → `FinalCtaBand`. `hrefPrefix` que empieza por `/en` pone `locale="en"` en las historias.
- Hallazgos: D-08 (el fallback de la página repite este árbol).

### `src/components/sections/IndustryServices.tsx`
- Propósito: Cards de servicio leídas para una industria, con icono, acento y CTA.
- Por qué está así: Tokens de acento en hex. Un icono que es URL se pinta como máscara CSS (`--service-glyph`); si no, `ServiceIcon`.
- CSS: `IndustryServices.css` — orb y watermark. Reduced motion en la hoja. Las páginas de industria también la importan.
- Exporta: `IndustryServiceCard`, `IndustryServices`.
- Depende de: `src/lib/en-slugs.ts`, `src/lib/locale.ts` (`isRetiredCatalogPath`), `icons/ServiceIcons.tsx`, `src/components/ui`, `SectionBand`, `SectionHeader`, `IndustryServices.css`.
- Lo usan: `SectionRenderer.astro`, `sections/index.ts`, `IndustryPageSection.astro`, `pages/industrias/[slug].astro`, `pages/en/industrias/[slug].astro`.
- Datos: nombre de industria, servicios y labels. El icono de respaldo sale de `serviceContentKey`. El enlace es `hrefPrefix` (default `/servicios`) más el slug. Si `catalogHref` es una ruta de catálogo retirada, ese enlace no se pinta.

### `src/components/sections/LegalDocument.tsx`
- Propósito: Cuerpo de aviso y términos: párrafos, listas, definiciones, líneas y subsecciones. Convierte emails y teléfonos en enlaces.
- CSS: `LegalDocument.css` — artículo y listas. Las cuatro páginas legales importan la hoja.
- Exporta: `LegalDocument`.
- Depende de: `src/lib/content/from-sanity.ts` (`LegalBlock`, `LegalSection`), `LegalDocument.css`.
- Lo usan: `pages/aviso-de-privacidad.astro`, `pages/en/aviso-de-privacidad.astro`, `pages/terminos.astro`, `pages/en/terminos.astro`.
- Datos: `sections` ya mapeadas desde Sanity, más fecha de actualización.

### `src/components/sections/MetricsBand.tsx`
- Propósito: Banda de cifras con dos CTAs. Los números cuentan al entrar en viewport.
- Por qué está así: Isla `client:visible`. GSAP + `ScrollTrigger`. Con reduced motion escribe el valor final sin tween.
- CSS: `MetricsBand.css` — banda. Las homes y el caso también importan la hoja.
- Exporta: `MetricItem`, `MetricsBand`.
- Depende de: `src/lib/motion.ts`, `src/components/ui`, `SectionBand`, `primitives/heading.tsx`, `MetricsBand.css`.
- Lo usan: `SectionRenderer.astro`, `sections/index.ts`, home ES/EN, `pages/portafolio/[slug].astro`.
- Datos: `metrics` (`valor`, `prefix`, `suffix`, `decimals`, `detail`) más copy y CTAs. Default de título “Antes y después” si no llegan props.
- Hallazgos: P-04, P-05.

### `src/components/sections/NavIcon.tsx`
- Propósito: Icono de trazo para el nav. Si `name` es URL o ruta, pinta un `<img>`.
- Exporta: `NavIcon`.
- Depende de: —
- Lo usan: `icons/ServiceIcons.tsx` (fallback si el nombre no está en su mapa), `SiteNav.tsx`, `sanity/components/NavIconInput.tsx`.
- Datos: nombre (`activity`, `target`, `factory`, `googleads`, `meta`, etc.). Desconocido: `null`. El `<img>` de una URL lleva `alt=""`.

### `src/components/sections/PageHero.tsx`
- Propósito: Hero claro de interiores: eyebrow, `h1`, lead y acciones.
- Por qué está así: `HeroAtmosphere` detrás. El `h1` lleva `data-split`. Puede usar el ancho de la navbar (`fullWidth`) o el de `headingWidth`.
- Exporta: `PageHero`.
- Depende de: `HeroAtmosphere`, `Eyebrow`, `primitives/heading.tsx`.
- Lo usan: `SectionRenderer.astro`, `sections/index.ts`, páginas de aviso y términos (ES y EN), `pages/diagnostico-marketing-digital.astro`.
- Datos: `eyebrow`, `title`, `description`, `actions`, `atmosphere` (default `spotlight`).
- Hallazgos: D-03 (el comentario “el hero oscuro con DriftWall es solo de Home” no coincide con la home: la home monta `HeroStudioA`), S-11.

### `src/components/sections/PillarGrid.tsx`
- Propósito: Rejilla de razones. Icono, título, texto y, si hay href, un enlace “ver más”.
- Por qué está así: El CTA de la card es `<span class="pillar-card__cta">`, no `Button`. El acento es una variable CSS con el hex del token.
- CSS: `PillarGrid.css` — icono y hover. Reduced motion en la hoja. `global.css` cambia la familia de `.pillar-card__cta` a Inter.
- Exporta: `PillarAccent`, `Pillar`, `PillarGrid`.
- Depende de: `icons/PillarIcons.tsx`, `src/components/ui`, `SectionBand`, `SectionHeader`, `PillarGrid.css`.
- Lo usan: `SectionRenderer.astro`, `AboutPageSection.astro`, `HomeAfterHero.tsx`, `IndustryPageSection.astro`, `ServicePageSection.astro`, `sections/index.ts`, home, industrias, nosotros y servicios (ES y EN).
- Datos: `pillars` (título, descripción, icono, acento, href). El id por defecto es `diferenciadores`. `ctaLabel` por defecto es “Ver más”.
- Hallazgos: D-04, R-04.

### `src/components/sections/PortalShowcase.tsx`
- Propósito: Banda oscura en Nosotros: copy del portal y un mock de ventana (piezas pendientes y cursores).
- Por qué está así: Copy ES/EN en el componente (`COPY`). Los CTAs sí usan `Button`.
- CSS: `PortalShowcase.css` — la ventana del mock. `#17171c` fuera de paleta. Reduced motion en la hoja.
- Exporta: `PortalShowcase`.
- Depende de: `src/components/ui`, `SectionBand`, `SectionHeader`, `PortalShowcase.css`.
- Lo usan: `AboutPageSection.astro`, `pages/nosotros.astro`, `pages/en/nosotros.astro`.
- Datos: textos opcionales; si faltan, el diccionario interno. Cliente por defecto “Aura Café & Roastery”. Href primario `/portal` o `/en/portal`.
- Hallazgos: D-05.

### `src/components/sections/PresenceMap.tsx`
- Propósito: Globo de presencia (México, Estados Unidos, Canadá) con arcos y CTA.
- Por qué está así: Isla `client:visible`. `cobe` dibuja el globo en un canvas y rota `phi` en un frame. Con reduced motion no auto-rota; el arrastre sigue. El CTA es `<a class="presence-map__cta">`, no `Button`.
- CSS: `PresenceMap.css` — escena oscura. `#07090f` no es el token `hiweb-dark`. Reduced motion en la hoja. Nosotros y la landing `[slug]` importan la hoja.
- Exporta: `PresenceMap`.
- Depende de: `primitives/heading.tsx`, `PresenceMap.css`. El paquete `cobe` no sale en el grafo de imports locales.
- Lo usan: `SectionRenderer.astro`, `AboutPageSection.astro`, `sections/index.ts`, `pages/nosotros.astro`, `pages/en/nosotros.astro`.
- Datos: copy opcional. Marcadores y arcos están fijos en el archivo (lat/lon de MX, US, CA).
- Hallazgos: D-04, D-05.

### `src/components/sections/ProblemPov.tsx`
- Propósito: Tres dolores del comprador (presupuesto, oferta, marca vs performance).
- Exporta: `ProblemPov`.
- Depende de: `SectionBand`, `SectionHeader`.
- Lo usan: `sections/index.ts` y el kit. Ninguna ruta de marketing.
- Datos: título, descripción y `pains`, o el default interno.
- Hallazgos: D-03, D-08.

### `src/components/sections/ProcessPhases.tsx`
- Propósito: Fases 01–04 sobre una línea, con icono y acento.
- Por qué está así: Isla `client:visible` en home, servicio y caso. GSAP + `ScrollTrigger` revelan la línea al entrar. `MOTION` trae la curva. Reduced motion está en el CSS.
- CSS: `ProcessPhases.css` — la línea y los nodos. Reduced motion en la hoja, no en el TSX.
- Exporta: `ProcessIconName`, `ProcessAccent`, `ProcessPhase`, `ProcessPhases`.
- Depende de: `src/lib/motion.ts`, `SectionBand`, `SectionHeader`, `ProcessPhases.css`.
- Lo usan: `SectionRenderer.astro`, `HomePage.tsx`, `sections/index.ts`, `ServicePageSection.astro`, home ES/EN, servicios ES/EN, `pages/portafolio/[slug].astro`.
- Datos: `phases` (índice, título, descripción, icono `search|spark|play|trend`, acento). En la home real vienen del documento; `HomePage` usa `PROCESS_PHASES`.
- Hallazgos: P-04, P-05.

### `src/components/sections/SectionsKitPage.tsx`
- Propósito: Catálogo `/sections`. Índice de anclas y un demo de primitivas y secciones, incluidas las que ninguna ruta monta.
- Por qué está así: `client:only="react"` en `sections.astro`, así que el `h1` no está en el HTML sin JavaScript. Fondo `BackgroundMesh`.
- Exporta: `SectionsKitPage`.
- Depende de: `src/components/ui`, `BackgroundMesh.tsx`, `src/data/webflow-home.ts`, `src/data/service-focus.ts`, `src/data/service-pitch.ts`, `src/data/service-plans.ts`, `sections/index.ts`.
- Lo usan: `sections/index.ts` (se reexporta) y `pages/sections.astro`.
- Datos: demos armados en el archivo (cuatro servicios, cuatro industrias, tres casos) más pilares y copy de `webflow-home`. El comentario del page hero dice que el carrusel oscuro “se queda en Home”; la home no usa `HeroSection`.
- Hallazgos: D-03, D-08, S-08 (la página queda fuera del índice; el `h1` es `client:only`).

### `src/components/sections/ServiceFocus.tsx`
- Propósito: Frentes de un servicio. Tabs en escritorio y acordeón en móvil.
- Por qué está así: Isla `client:visible`. GSAP abre y cierra el panel igual que la FAQ; reduced motion pone la duración en 0. Bajo 860 px cambia el layout.
- CSS: `ServiceFocus.css` — columnas en `rem`. Reduced motion en la hoja.
- Exporta: `ServiceFocus`.
- Depende de: `icons/PillarIcons.tsx`, `src/data/service-focus.ts` (tipo `ServiceFocusItem`), `SectionBand`, `SectionHeader`, `ServiceFocus.css`.
- Lo usan: `sections/index.ts`, `ServicePageSection.astro`, `pages/servicios/[slug].astro`, `pages/en/servicios/[slug].astro`.
- Datos: `items` (icono, título, resumen, detalle, imagen). Si Sanity no trae ítems, la página usa `serviceFocusItems(slug)`.
- Hallazgos: D-04.

### `src/components/sections/ServiceGrid.tsx`
- Propósito: Mosaico de servicios. Pares ancho/estrecho y la última card impar a todo el ancho.
- Por qué está así: Un icono que es URL se pinta como máscara; si no, `ServiceIcon`. `serviceContentKey` solo elige la foto y el icono de respaldo.
- CSS: `ServiceGrid.css` — foto y glyph. Reduced motion en la hoja.
- Exporta: `GridCard`, `ServiceGrid`.
- Depende de: `src/lib/en-slugs.ts`, `icons/ServiceIcons.tsx`, `src/components/ui`, `SectionBand`, `SectionHeader`, `ServiceGrid.css`.
- Lo usan: `SectionRenderer.astro`, `HomeAfterHero.tsx`, `sections/index.ts`, home ES/EN.
- Datos: `services` (slug, nombre, tagline, imagen, icono). Fotos de respaldo en `SERVICE_VISUALS` (`/images/services/...`). El enlace es `hrefPrefix` (default `/servicios`) más el slug.
- Hallazgos: S-07 (la foto de la card va con `alt=""`).

### `src/components/sections/ServicePageSection.astro`
- Propósito: Despacha un bloque de servicio según `_type`.
- Exporta: componente Astro.
- Depende de: `IndustryHero`, `PillarGrid`, `ServiceFocus`, `ServicePitch`, `ServiceWhy`, `ServicePlans`, `IndustryGrid`, `BeforeAfter`, `ProcessPhases`, `CaseStories`, `FaqSection`, `FinalCtaBand`, `icons/PillarIcons.tsx`, `src/lib/en-slugs.ts`, `src/data/service-focus.ts`, `src/data/service-pitch.ts`, `icons/IndustryIcons.tsx`, `icons/ServiceIcons.tsx`, `src/components/ui`, `src/lib/content/types.ts`.
- Lo usan: `pages/servicios/[slug].astro`, `pages/en/servicios/[slug].astro`.
- Datos: `ServiceSection` y el `ServiceRecord`. Mapa: `serviceHero` → `IndustryHero`; `serviceOverview` → `PillarGrid` (icono por título con `iconForServiceOverviewCard`); `serviceFocus` → isla, con fallback `serviceFocusItems`; `servicePitch` → bloque o `service-pitch.ts`; `serviceWhy` → isla; `servicePlans`; `serviceIndustries` → `IndustryGrid`; `serviceProcess` → `ProcessPhases`; `serviceCases` → `CaseStories`; `serviceFaq`; `beforeAfter`; `serviceCta` → `FinalCtaBand`.
- Hallazgos: D-08, S-11.

### `src/components/sections/ServicePitch.tsx`
- Propósito: Propuesta del servicio: foto, badge, `h2`, párrafo y CTA.
- CSS: `ServicePitch.css` — split imagen/copy, en tokens y `rem`.
- Exporta: `ServicePitch`.
- Depende de: `src/components/ui`, `src/data/service-pitch.ts` (tipo), `SectionBand`, `primitives/heading.tsx`, `ServicePitch.css`.
- Lo usan: `sections/index.ts`, `ServicePageSection.astro`, servicios ES/EN.
- Datos: badge, título, descripción, imagen, alt y CTA. Si el bloque de Sanity no trae título e imagen, la página usa el pitch de `service-pitch.ts`.

### `src/components/sections/ServicePlans.tsx`
- Propósito: Planes del servicio: precio, lista “incluye” y un CTA por card. Una card puede ir destacada.
- Por qué está así: El check es `IconCheckCircle`. El botón destacado es `primary`; el resto, `secondary`.
- CSS: `ServicePlans.css` — una, dos o muchas columnas (`is-one|two|many`). Reduced motion en la hoja.
- Exporta: `ServicePlans`.
- Depende de: `src/components/ui`, `icons/PillarIcons.tsx`, `src/data/service-plans.ts` (tipo), `SectionBand`, `SectionHeader`, `ServicePlans.css`.
- Lo usan: `sections/index.ts`, `ServicePageSection.astro`, servicios ES/EN.
- Datos: `plans` (nombre, precio, periodo, includes, badge, `featured`), nota con enlace y CTA. El id de sección es `precios`.

### `src/components/sections/ServiceWhy.tsx`
- Propósito: “Por qué Hiweb” en la página de servicio: cards, dos contadores y un CTA.
- Por qué está así: Isla `client:visible`. GSAP + `ScrollTrigger` cuentan los stats al entrar. Reduced motion escribe el número final.
- CSS: `ServiceWhy.css` — loop de cards. Reduced motion en la hoja.
- Exporta: `ServiceWhy`.
- Depende de: `src/lib/motion.ts`, `src/components/ui`, `icons/ServiceIcons.tsx`, `SectionBand`, `primitives/heading.tsx`, `ServiceWhy.css`.
- Lo usan: `sections/index.ts`, `ServicePageSection.astro`, servicios ES/EN. En el fallback de la página solo entra si el slug es `seo`.
- Datos: `cards` y `stats` por props. Sin ellos, tres cards y dos cifras fijas en el archivo (10 años, +$1M USD), con copy de SEO.

### `src/components/sections/SiteFooter.tsx`
- Propósito: Footer global. Columnas, auditoría, redes y wordmark grande.
- Por qué está así: Isla `client:idle` en `Layout`. GSAP + `ScrollTrigger` revelan las columnas; `SplitText` parte el wordmark. Con reduced motion no registra la animación. El año es `new Date().getFullYear()`.
- CSS: `SiteFooter.css` — panel oscuro. Los hex repetidos son de token; hay un tope `min(33cqw, 430px)` en el wordmark. Reduced motion en la hoja. `Layout` importa el CSS.
- Exporta: `SiteFooter`.
- Depende de: `src/lib/footer.ts`, `src/lib/site-identity.ts`, `src/lib/locale.ts`, `src/components/ui`, `src/lib/motion.ts`, `SiteFooter.css`.
- Lo usan: `sections/index.ts`, `layouts/Layout.astro`.
- Datos: `footer` de Sanity o `fallbackFooter(locale, site)`. Identidad por defecto `fallbackSite()`.
- Hallazgos: P-04, S-05, R-06.

### `src/components/sections/SiteNav.tsx`
- Propósito: Nav fija. Pastilla, mega-menú de servicios e industrias, selector de idioma y hoja móvil. Se esconde al bajar.
- Por qué está así: Isla `client:load` en todas las páginas. GSAP entra la pastilla y el panel; con reduced motion solo añade `is-ready`. Rutas retiradas pasan por `isRetiredCatalogPath` y `localePath`.
- CSS: `SiteNav.css` — el vidrio no sale de tokens: `#23272f`, `#4f9cff`, `#0a0a0c`, tint `rgba(0,0,0,.92)`. Con `motion-ready` el shell espera a `.is-ready`. Reduced motion en la hoja. 899 líneas. `Layout` importa el CSS.
- Exporta: `SiteNav`.
- Depende de: `src/lib/motion.ts`, `src/lib/nav.ts`, `src/lib/locale.ts`, `src/components/ui`, `NavIcon.tsx`, `SiteNav.css`.
- Lo usan: `sections/index.ts`, `layouts/Layout.astro`.
- Datos: `nav` (`SiteNavContent`) o `fallbackNav(locale)`.
- Hallazgos: S-06, P-04, D-05, D-09, R-03 (el control de idioma queda en 42 px de alto).

### `src/components/sections/SocialProof.tsx`
- Propósito: Tres quotes con resultado, nombre y rol.
- Exporta: `SocialProof`.
- Depende de: `SectionBand`, `SectionHeader`.
- Lo usan: `sections/index.ts` y el kit. Ninguna ruta de marketing. El testimonio de la home es `CaseStories`.
- Datos: `quotes` o tres quotes internas (Pulse, Vertex, Campo).
- Hallazgos: D-03, D-08.

### `src/components/sections/TeamGrid.tsx`
- Propósito: Equipo. Rejilla con tope, o slider (home y nosotros) con filtros por categoría.
- Por qué está así: Isla `client:visible` en la home y `client:load` en nosotros. GSAP en el slider. Hay un `eslint-disable-next-line react-hooks/exhaustive-deps` y no hay ESLint en el repo. Los botones de paso no son `Button`.
- CSS: `TeamGrid.css` — cards y slider. Las homes, nosotros y la landing importan la hoja.
- Exporta: `TeamMember`, `TeamGrid`.
- Depende de: `src/data/site.ts` (`TEAM_CATEGORIES`, `TEAM_MEMBERS`), `src/lib/motion.ts`, `src/components/ui`, `SectionBand`, `SectionHeader`, `TeamGrid.css`.
- Lo usan: `SectionRenderer.astro`, `AboutPageSection.astro`, `HomeAfterHero.tsx`, `sections/index.ts`, home y nosotros (ES y EN).
- Datos: `members` de la página o `TEAM_MEMBERS`. Defaults de copy en español (“Conoce al equipo Hiweb”, “Conoce a todo el equipo”, “Integrante anterior”). `showFilters` solo en nosotros.
- Hallazgos: D-04, D-09, R-04, P-05.

### `src/components/sections/TrustStrip.tsx`
- Propósito: Fila de nombres (no logos de imagen) y una métrica opcional.
- Por qué está así: `SectionBand` con `dense`: sin padding vertical propio.
- Exporta: `TrustStrip`.
- Depende de: `SectionBand`.
- Lo usan: `sections/index.ts`, `WorkPage.tsx`, y el kit. Ninguna ruta de marketing.
- Datos: `logos` default (Anáhuac, Northstar, Pulse, Vertex, Campo, Orbit) y métrica `3.2×`.
- Hallazgos: D-03, D-08.

### `src/components/sections/ValueChapter.tsx`
- Propósito: Un outcome y un marco de producto. Incluye tres mocks (mensaje, performance, web).
- Exporta: `ValueChapter`, `MockMessagePanel`, `MockPerformancePanel`, `MockWebPanel`.
- Depende de: `SectionBand`, `SectionHeader`, `ProductFrame`.
- Lo usan: `sections/index.ts`. El kit monta `ValueChapter` y `MockMessagePanel`. Ninguna ruta de marketing.
- Datos: copy por props. Los mocks traen cifras y labels fijos (ROAS 4.2×, canales, CTA).
- Hallazgos: D-03, D-08.

### `src/components/sections/WorkPage.tsx`
- Propósito: Página Work de demo: `h1`, `TrustStrip`, `CasePreview` y `FinalCta`.
- Por qué está así: El `h1` lleva `data-split`. No es `/portafolio`: esa ruta usa `BlogHero` + `CasesIndex`.
- Exporta: `WorkPage`.
- Depende de: `CasePreview`, `FinalCta`, `TrustStrip`.
- Lo usan: `sections/index.ts`. Ninguna página.
- Datos: el copy está en el componente. Los casos salen del default de `CasePreview`.
- Hallazgos: D-08.

### `src/components/sections/index.ts`
- Propósito: Barril. Reexporta primitivas y secciones para que el kit importe un solo módulo.
- Por qué está así: Las páginas importan cada archivo. Evaluar el barril carga también `HeroSection`, `HeroStudioB`, `HomePage`, `WorkPage`, `ContactPage` y el resto, aunque el kit no use todos los símbolos.
- Exporta: lo que reexporta el archivo (primitivas, nav, footer, heroes, rejillas, servicio, blog, `HomePage`, `WorkPage`, `ContactPage`, `SectionsKitPage`, y los tipos `AtmosphereVariant`, `IndustryHeroBadge`, `GridCard`, `IndustryCard`, `MetricItem`, `AboutHistoryColumn`, `AboutHistoryImage`, `FilterableCase`, `CaseItem`, `CaseStory`, `CaseStoryStat`).
- Depende de: cada módulo que reexporta. El grafo lista el archivo dos veces en varios renglones; es el mismo import.
- Lo usan: `SectionsKitPage.tsx`.
- Datos: —
- Hallazgos: D-06, D-03, D-08.
