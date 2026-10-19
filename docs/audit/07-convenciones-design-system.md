# 07. Convenciones y design system

Auditoría de solo lectura. Conteos sobre `src/` (CSS de componente, JSX, nombres, pares ES/EN). `tsc --noEmit` no se reejecutó: los 103 errores son el dato de partida de esta auditoría.

## Conclusión

El código no respeta un solo design system. Hay un núcleo compartido —tokens en `src/styles/global.css`, `Button`, `Badge`, `SectionBand` y `SectionHeader`— y, encima, cada bloque grande trae su CSS. En 37 hojas de componente hay **390 hex** y **233 `rgb()`/`rgba()`**; **111 hex están fuera de la paleta**. El portal (`PortalDemo.css`, 2 280 líneas) es un segundo sistema: 164 hex y 97 `font-size` en px. Los catálogos `/design-system` y `/sections` documentan ese núcleo y, a la vez, heroes y páginas que ninguna ruta monta.

---

### D-01. El sistema visual está partido entre tokens, CSS local y el portal

- Severidad: Alta
- Archivo: `src/styles/global.css:74`, `src/components/portal/PortalDemo.css:1`, `src/components/sections/SiteNav.css:10`
- Evidencia:
  - `@theme` define **21** colores (`--color-canvas` … `--color-accent-teal`), 2 blurs, 3 familias y `--container-6xl`. No hay escala de spacing ni de type más allá de lo que Tailwind pone en `@layer base` (`src/styles/global.css:120-204`).
  - 37 CSS en `src/components/` (más `src/styles/global.css` = 38 hojas en `src/`). Totales de componente: **390 hex**, **233 rgb/rgba**, **27 hsl**, **99 `font-size` con px**, **325** declaraciones de padding/margin/gap/inset/top/right/bottom/left con px, **283** `var(--color-)`.
  - De esos 390 hex, **279 repiten un token** (75 de ellos son fallback dentro de `var(--color-*, #…​)`) y **111 no están en la paleta**.
  - Hojas que sí usan el token y no inventan hex: `BlogPost.css` (0 hex, 55 `var(--color-)`), `ServiceFocus.css` (0 hex, 24 vars), `FaqSection.css`, `BlogIndex.css`, `MetricsBand.css`, `ServicePitch.css`.
  - El portal no: `PortalDemo.css:14-20` redefine `--cyan-ink: #1b3645`, `--gray: #b4b4b4` y semáforos `#ff5f56` / `#ffbd2e` / `#27c93f` en las líneas 79-81. `SiteNav.css:10-11` inventa `--hw-nav-cta: #23272f` y `--hw-nav-hover: #4f9cff`.
- Impacto: cambiar un acento en `@theme` no mueve la nav, el mapa, el CTA de presencia, el hero de estudio B ni la UI del portal. Cada sección conserva su propia escala.
- Corrección propuesta: dejar `@theme` como única fuente. Sustituir hex fuera de paleta por tokens o por un token nuevo con nombre. El portal puede mapear sus alias (`--ink`, `--ora`) a `var(--color-*)` sin fallback hex, y los semáforos de ventana pasan a tokens de estado.
- Esfuerzo: alto

### D-02. `tailwind.config.js` no participa en el build de Tailwind v4

- Severidad: Media
- Archivo: `tailwind.config.js:5`, `astro.config.mjs:8`, `astro.config.mjs:100`, `src/styles/global.css:1`
- Evidencia:
  - `package.json` depende de `tailwindcss` y `@tailwindcss/vite` `^4.3.3`. El plugin entra solo en `astro.config.mjs:100` (`plugins: [gsapSsrStubPlugin(), tailwindcss()]`).
  - `src/styles/global.css:1` es `@import "tailwindcss"`. No hay `postcss.config.*`. Ningún archivo del repo referencia `tailwind.config` ni `@config`.
  - El propio config lo dice en las líneas 5-6: los tokens se aplican vía `@theme`. Los 21 colores del config coinciden hoy con `@theme` (`tailwind.config.js:13-44` = `src/styles/global.css:76-100`). Es una copia, no una fuente distinta.
  - Lo que el config no tiene y el CSS sí: `--section-max: 1300px` (`src/styles/global.css:114`) y `--container-6xl`.
- Impacto: editar `tailwind.config.js` no cambia el sitio. La próxima persona que “actualice la paleta” en ese archivo no verá el cambio.
- Corrección propuesta: borrar `tailwind.config.js`, o enlazarlo con `@config` solo si hace falta algo que `@theme` no cubre. Hoy no hace falta.
- Esfuerzo: bajo

### D-03. `/design-system` y `/sections` mezclan el kit real con prototipos que las rutas no montan

- Severidad: Alta
- Archivo: `src/pages/design-system.astro:8`, `src/components/DesignSystem.tsx:15`, `src/pages/sections.astro:8`, `src/components/sections/SectionsKitPage.tsx:39`
- Evidencia:
  - `design-system.astro` solo monta `DesignSystem` (`client:only="react"`). `sections.astro` solo monta `SectionsKitPage`. El comentario de `sections.astro:9` admite `HeroSection` + `GradientWaves`.
  - La paleta del catálogo (`DesignSystem.tsx:15-29`) lista 14 muestras. `@theme` tiene 21 colores. Faltan en la página: `accent-blue` `#1e4990`, `accent-deep-blue` `#2b2f8f`, `accent-teal` `#059b7a`, `hiweb-light`, `hiweb-light-gray` y los dos bordes.
  - El catálogo pinta un fondo que no es token: `DesignSystem.tsx:287` usa `bg-[#070912]`. El token oscuro es `--color-hiweb-dark: #070902` (`global.css:86`). El mismo hex suelto está en `HeroSection.tsx:31` y `HeroWavesBackground.tsx:11`.
  - `DesignSystem.tsx:31-51` llama “secciones en producción” a Servicios en `/servicios` e Industrias en `/industrias`. Esas rutas redirigen a `/` (`astro.config.mjs:95-96`).
  - `SectionsKitPage.tsx:39-64` monta piezas que **ninguna página** importa: `HeroStudioB`, `HeroSection`, `TrustStrip`, `ProblemPov`, `HowItWorks`, `ValueChapter`, `SocialProof`, `FitSignal`. Búsqueda de esas etiquetas en `src/pages`: 0.
  - `PageHero.tsx:18` dice: “El hero oscuro con DriftWall es solo de Home.” Home monta `HeroStudioA` (`src/pages/index.astro:5` y `:120`). `DriftWall` solo entra por `HeroSection.tsx:2`, y `HeroSection` solo entra por el kit.
  - `SectionsKitPage.tsx:177` dice que el hero oscuro con carrusel “se queda en Home”. Home no usa ese hero.
  - Primitivas del kit, usos JSX fuera de `primitives/`:

    | Primitiva | Usos JSX | Archivos | Dónde vive de verdad |
    | --- | ---: | ---: | --- |
    | `SectionBand` | 46 | 36 | Secciones de marketing |
    | `SectionHeader` | 36 | 27 | Secciones de marketing |
    | `Eyebrow` | 3 | 2 | `PageHero.tsx:39` y el kit |
    | `ProductFrame` | 2 | 2 | `ValueChapter.tsx:48` y el kit |
    | `HeroAtmosphere` | 1 | 1 | `PageHero.tsx:32` |
    | `HeroGradientShader` | 0 | 0 | Solo se exporta en `sections/index.ts:7` |

  - `CardGlass` y `BackgroundMesh` aparecen en `DesignSystem.tsx`, `Hero.tsx` y el kit. Ninguna ruta de marketing los monta.
- Impacto: el catálogo enseña controles y secciones que un editor no va a encontrar en hiweb.com.mx, y omite 7 tokens que sí están en `@theme`.
- Corrección propuesta: partir el kit en “en rutas” y “archivo”. Quitar del demo `Hero`, `HeroSection`, `HeroStudioB`, `TrustStrip`, `ProblemPov`, `HowItWorks`, `ValueChapter`, `SocialProof`, `FitSignal`, `HomePage`, `WorkPage` y `ContactPage`, o marcarlos como retirados. Completar la grilla de color con los 21 tokens. Corregir el comentario de `PageHero.tsx:18`.
- Esfuerzo: medio

### D-04. `Button` y `Badge` sí se usan; `Checkbox`, `Toggle` y gran parte de los inputs no

- Severidad: Alta
- Archivo: `src/components/ui/index.ts:1`, `src/components/sections/ContactForm.tsx:92`, `src/components/sections/PresenceMap.tsx:241`
- Evidencia: etiquetas JSX en `src/`, excluyendo `src/components/ui/` y `src/sanity/` (Sanity usa `@sanity/ui`, no este kit):

  | Componente | Apariciones JSX | Archivos | Notas |
  | --- | ---: | ---: | --- |
  | `Button` | 58 | 27 | 12 en `DesignSystem.tsx`, 3 en `SectionsKitPage.tsx`. Quedan **43** en páginas y secciones. |
  | `Badge` | 32 | 17 | Incluye el catálogo. |
  | `TextField` | 19 | 5 | `ContactForm`, `ContactPage`, `CalendarTool`, `MarketingQuiz`, catálogo. |
  | `TextArea` | 3 | 3 | `ContactForm`, `ContactPage`, catálogo. |
  | `SelectField` | 2 | 2 | Solo `DesignSystem.tsx:329` y `ContactPage.tsx`. `ContactPage` no lo importa ninguna página. |
  | `Checkbox` | 1 | 1 | Solo `DesignSystem.tsx:348`. |
  | `Toggle` | 1 | 1 | Solo `DesignSystem.tsx:353`. |

  Controles escritos a mano, mismo recorte (fuera de `ui/` y de `sanity/`):

  | Etiqueta | Total | Portal | Resto |
  | --- | ---: | ---: | --- |
  | `<button` | 101 | 78 | 23 |
  | `<input` | 14 | 8 | 6 |
  | `<textarea` | 1 | 1 (`PortalHiLinks.tsx`) | 0 |
  | `<select` | 2 | 0 | 2 (`CaseFilter.tsx:39` y `:56`) |

  `<button` fuera del portal: `SiteNav.tsx` 7, `TeamGrid.tsx` 3, `CalendarTool.tsx` 2, `CaseStories.tsx` 2, `FaqSection.tsx` 2, `IndustryGrid.tsx` 2, `ServiceFocus.tsx` 2, y 1 en `ScrollIndicator.tsx`, `MarketingQuiz.tsx` y `HeroStudioA.tsx:427`. Casi todos son menú, carrusel, acordeón o play, no el CTA negro.

  CTAs que no pasan por `Button`:
  - `PresenceMap.tsx:241` — `<a className="presence-map__cta">`.
  - `HeroStudioB.tsx:134` — `<a className="hero-studio-b__cta">`, y el CSS lo pinta como pastilla: `HeroStudioB.css:92` `background: #111111`, hover `#1f1f1f` en la línea 102.
  - `PillarGrid.tsx:80` — `<span className="pillar-card__cta">` dentro de la card. `global.css:325` le cambia la familia a Inter “porque el botón compartido sigue en Clash Display”.

  El formulario real no usa `Checkbox`: `ContactForm.tsx:92` es `<input type="checkbox">` y `ContactForm.tsx:110` es `<input type="radio">`. Filtros iguales: `BlogIndex.tsx:225`, `CasesIndex.tsx` (radio), `BeforeAfter.tsx:86` (range).
- Impacto: el catálogo muestra seis controles de formulario. En el sitio viven dos (`TextField`, `TextArea`). Un checkbox del design system no se puede copiar al contacto sin rehacer el marcado.
- Corrección propuesta: usar `Checkbox` en `ContactForm` o borrar `Checkbox` y `Toggle` del kit hasta que haya un uso. Pasar `presence-map__cta` y `hero-studio-b__cta` a `Button`. Dejar los `<button` de carrusel y menú como controles, no como variante de CTA.
- Esfuerzo: medio

### D-05. Los 10 CSS con más hex, y el type/spacing que no sale de tokens

- Severidad: Alta
- Archivo: `src/components/portal/PortalDemo.css:26`, `src/components/sections/SiteNav.css:10`, `src/components/sections/HeroStudioB.css:40`
- Evidencia: ranking por **hex en bruto** (comentarios CSS excluidos). “Fuera” = hex que no es uno de los 21 tokens ni `#000`/`#fff` equivalentes.

  | # | Archivo | Hex | Fuera de paleta | Ejemplo |
  | ---: | --- | ---: | ---: | --- |
  | 1 | `src/components/portal/PortalDemo.css` | 164 | 53 | `#1b3645` en `:14`, `#ff5f56` en `:79` |
  | 2 | `src/components/sections/SiteNav.css` | 33 | 18 | `#23272f` en `:10`, `#4f9cff` en `:11`, `#0a0a0c` en `:226` |
  | 3 | `src/components/effects/DriftWall.css` | 26 | 2 | `#060010` en `:15`, `#0b0b12` en `:68`. Muchos `#000` son máscaras. |
  | 4 | `src/components/sections/HeroStudioB.css` | 22 | 10 | `#22c55e` en `:40` (verde Tailwind, no `#74c465`), `#ff5a36` en `:74` |
  | 5 | `src/components/sections/ContactForm.css` | 18 | 3 | `#e23b3b` en `:132`, `#6b6b6b` en `:128`. 15 hex son fallback de token. |
  | 6 | `src/components/portal/PortalPage.css` | 12 | 1 | `#5c6570` en `:172` |
  | 7 | `src/components/sections/PortalShowcase.css` | 12 | 1 | `#17171c` en `:38` |
  | 8 | `src/components/sections/SiteFooter.css` | 12 | 0 | Hex de token, repetidos. |
  | 9 | `src/components/growth/CalendarTool.css` | 10 | 7 | `#e23b3b` en `:144`, `#f3f3f3` en `:73` |
  | 10 | `src/components/sections/HeroStudioA.css` | 9 | 1 | `#ddd` en `:219` |

  Siguen fuera de paleta, aunque no entren al top 10: `CaseStories.css:171` `#161616`, `PresenceMap.css:9` `#07090f`, `FinalCta.css:76` `#1a1a1a`, `Badge.css:27` `#1b3645`, `BorderGlow.css:22` `#120f17` y `:104` `#c299ff`. El shader de `global.css:296-300` usa `#05060f`, `#0a1030`, `#121a3a` y un azul `rgba(90, 140, 255, 0.28)` que no es `accent-blue`.

  `font-size` en px: **99** declaraciones. **97** están en `PortalDemo.css` (de `:26` `14px` a `:2273` `28px`, incluyendo `13.5px` en `:253` y `:2160`). Las otras dos: `PortalPage.css:110` (`15px`) y `SiteFooter.css:276` (`min(33cqw, 430px)`, tope de un wordmark, no cuerpo de texto). El resto del marketing usa `rem` o utilidades Tailwind.

  Spacing: `@theme` no define spacing. Hay **325** declaraciones con px en esas propiedades; **276** están en `PortalDemo.css`. El marketing que mejor se acerca al sistema usa `rem` suelto, no un token (`BlogPost.css:2` `--blog-post-pad-top: 9.5rem`, `ServiceFocus.css:6` columnas en `rem`). En className hay **35** utilidades arbitrarias `…-[Npx]`. Ocho están en `HeroSection.tsx`, entre ellas `min-h-[640px]`, `md:min-h-[720px]` y `lg:min-h-[780px]` en la línea 31. `Button.tsx:46-48` fija alturas `h-[44px]`, `h-[50px]`, `h-[56px]`.
- Impacto: la paleta documentada (ink, canvas, cuatro acentos) no es la paleta pintada. Nav, presencia, casos, calendario y portal introducen negros, grises y verdes que no existen en `@theme`.
- Corrección propuesta: tratar el top 4 (portal, nav, DriftWall, HeroStudioB) primero. Donde el hex sea el token, dejar solo `var(--color-*)`. Donde no lo sea, o se agrega el token o se reemplaza. No hace falta una escala de spacing nueva para el marketing en `rem`; sí hace falta dejar de usar px sueltos en el portal si ese bloque debe verse como el mismo producto.
- Esfuerzo: alto

### D-06. Tres convenciones de nombre, y `effects/` mezcla `.jsx`, `.js` y `.tsx`

- Severidad: Media
- Archivo: `src/components/effects/BorderGlow.jsx:157`, `src/components/effects/heroProjectTiles.js:1`, `src/components/ui/Button.tsx:2`, `src/data/industryServices.ts`
- Evidencia: archivos de `src/` con extensión de código o CSS:

  | Convención | Extensiones y conteo |
  | --- | --- |
  | PascalCase | 87 `.tsx`, 37 `.css`, 12 `.astro`, 5 `.ts`, 3 `.jsx` |
  | camelCase | 35 `.ts`, 1 `.js` (`heroProjectTiles.js`) |
  | kebab-case | 102 `.ts`, 14 `.astro` (rutas), 1 `.tsx`, 1 `.css` |
  | Otro | 8 `.astro` de rutas dinámicas (`[slug]`), `src/content.config.ts`, `src/env.d.ts`, `src/cloudflare-worker.d.ts` |

  Los componentes de UI van en PascalCase y el CSS hermano también (`HeroStudioA.tsx` + `HeroStudioA.css`). `lib/` y `src/lib/content/` van en kebab (`map-sanity.ts`, `from-sanity.ts`). Schemas, actions y tools de `src/sanity/` van en camelCase (`homeSections.ts`, `ensureEnglishPair.ts`). `src/data/` es camelCase salvo `industryServices.ts`, que no lleva guion como `service-focus.ts` o `webflow-home.ts`.

  `src/components/effects/` tiene 6 módulos: `BorderGlow.jsx`, `DriftWall.jsx`, `GradientWaves.jsx`, `heroProjectTiles.js`, `HeroWavesBackground.tsx`, `ScrollIndicator.tsx`. `Button.tsx:2` importa el JSX (`import BorderGlow from '../effects/BorderGlow.jsx'`).

  Idioma de identificadores: los archivos de componente están en inglés. Los campos de contenido mezclan español e inglés en el mismo tipo. `src/lib/content/types.ts:58-67` tiene `nombre`, `tagline`, `heroTitle`, `porQue`. `src/content.config.ts:13-22` repite `nombre`, `orden`, `porQue`, `retos` junto a `heroTitle`. `src/data/site.ts:18-19` usa `nombre` en `NAV_INDUSTRIES`. Las rutas públicas están en español (`/nosotros`, `/portafolio`, `/contacto`); el inglés vive bajo `/en`.

  Barriles `index.ts`: 4.
  - `src/components/ui/index.ts` — lo importan páginas y secciones.
  - `src/components/sections/index.ts` — lo importa **solo** `SectionsKitPage.tsx:37`. Las páginas importan cada archivo (`index.astro:5-15`).
  - `src/lib/content/index.ts` — API de contenido que usan las páginas.
  - `src/sanity/schemas/index.ts` — registro del schema.

  Los `index.astro` de `blog/`, `portafolio/` y `en/blogs/` son rutas, no barriles.
- Impacto: no hay una regla que decirle a alguien nuevo. Un componente nuevo puede salir PascalCase, camelCase o kebab y los tres ya existen. El barril de secciones no es el camino que usan las páginas, así que exportar ahí no publica la pieza.
- Corrección propuesta: dejar PascalCase para componentes React/Astro y su CSS, kebab-case para rutas y módulos de `lib/`, y camelCase solo dentro de `src/sanity/` si ese árbol ya está así. Pasar `effects/*.jsx` y `heroProjectTiles.js` a `.tsx`. No añadir piezas nuevas al barril de secciones si las páginas siguen importando el archivo.
- Esfuerzo: medio

### D-07. El mismo contenido vive en `src/data/`, `src/content/` y `src/lib/content/`

- Severidad: Media
- Archivo: `src/lib/content/index.ts:53`, `src/content.config.ts:10`, `src/pages/index.astro:16`
- Evidencia:
  - `src/data/` — 8 módulos de copy y catálogos aún importados por la UI: `site.ts`, `webflow-home.ts`, `webflow-services.ts`, `webflow-cases.ts`, `service-focus.ts`, `service-pitch.ts`, `service-plans.ts`, `industryServices.ts`. Home sigue leyendo pilares de ahí: `index.astro:16` importa `homePillarsWithIcons` desde `webflow-home`.
  - `src/content/` — 31 JSON/MD de colecciones Astro: 6 industrias, 8 servicios, 15 casos, 2 posts. `content.config.ts:10-49` las carga con `glob`.
  - `src/lib/content/` — 12 archivos de runtime: tipos, mapeo Sanity (`map-sanity.ts`, `from-sanity.ts`), fallback a colecciones (`from-collections.ts`) y el barrel `index.ts`. Si Sanity falla, `index.ts:76` avisa y usa `src/content`.
  - No es la misma capa tres veces: Sanity manda, `src/content` es el fallback de colecciones, y `src/data` es copy de presentación que las secciones todavía leen directo (el kit también: `SectionsKitPage.tsx:3-6`).
- Impacto: un texto de pilares o de planes puede estar en Sanity, en un JSON de `src/content` y en `src/data` a la vez. El que se ve depende de qué importó la sección.
- Corrección propuesta: dejar `src/lib/content` como única puerta. Mover lo que `src/data` aún alimenta (pilares, focus, pitch, planes) al documento Sanity o al fallback de colecciones, y dejar de importar `src/data` desde páginas.
- Esfuerzo: alto

### D-08. Heroes de más, páginas ES/EN casi copiadas, y el fallback inline repite el `*PageSection`

- Severidad: Alta
- Archivo: `src/pages/index.astro:120`, `src/pages/en/index.astro:122`, `src/pages/servicios/[slug].astro:107`, `src/components/sections/ServicePageSection.astro:41`, `src/components/Hero.tsx:7`
- Evidencia: heroes y páginas-contenedor.

  | Pieza | ¿La monta una ruta? |
  | --- | --- |
  | `HeroStudioA` | Sí. `index.astro:120`, `en/index.astro:122`. También `HomePage.tsx:14`, y `HomePage` no lo importa ninguna página. |
  | `IndustryHero` | Sí. Servicios, industrias, nosotros, y los tres `*PageSection.astro`. |
  | `BlogHero` | Sí. `blog/index.astro:66`, `en/blogs/index.astro:68`, `portafolio/index.astro:48`. |
  | `PageHero` | Sí. Legales, `diagnostico-marketing-digital.astro:25`, `SectionRenderer.astro:94`. |
  | `CaseTelescopeHero` | Sí. `portafolio/[slug].astro:118`. |
  | `HeroSection` | No. Solo `SectionsKitPage.tsx`. Arrastra `DriftWall.jsx`, `GradientWaves.jsx`, `HeroWavesBackground.tsx` y `heroProjectTiles.js`. |
  | `HeroStudioB` | No. Solo el kit. Tiene CSS de 245 líneas. |
  | `Hero` (`src/components/Hero.tsx`) | No. 0 imports. Es el splash “Light product-tool” de las líneas 7-27. |

  Tampoco hay imports de página para `HomePage`, `WorkPage` ni `ContactPage`, aunque `sections/index.ts:61-64` los exporta.

  Pares ES/EN. El ratio es líneas normalizadas compartidas / líneas normalizadas del archivo ES, después de quitar imports y el frontmatter y de igualar `/en/`, `lang="en"` y `locale="en"`. Es un piso de similitud, no un diff semántico.

  | Par | Líneas ES | Líneas EN | Ratio |
  | --- | ---: | ---: | ---: |
  | `index.astro` / `en/index.astro` | 287 | 299 | 0.99 |
  | `servicios/[slug].astro` | 184 | 189 | 0.93 |
  | `blog/[slug].astro` | 200 | 201 | 0.88 |
  | `aviso-de-privacidad.astro` | 44 | 45 | 0.87 |
  | `terminos.astro` | 44 | 45 | 0.87 |
  | `industrias/[slug].astro` | 172 | 172 | 0.85 |
  | `portal.astro` | 33 | 33 | 0.81 |
  | `calendario.astro` | 28 | 28 | 0.89 |
  | `blog/index.astro` | 101 | 106 | 0.78 |
  | `nosotros.astro` | 104 | 150 | 0.73 |

  Cada slug de servicio, industria y nosotros tiene dos árboles. Si hay secciones de Sanity, la página delega en `ServicePageSection.astro`, `IndustryPageSection.astro` o `AboutPageSection.astro` (`servicios/[slug].astro:107-124`). Si no las hay, la misma página vuelve a escribir el árbol en JSX (`servicios/[slug].astro:127-180`): `IndustryHero`, `PillarGrid`, `ServiceFocus`, `ServicePitch`, `ServiceWhy`, `ServicePlans`, `IndustryGrid`, `ProcessPhases`, `CaseStories`, `FaqSection`, `FinalCta`. Ese árbol ya está en `ServicePageSection.astro` a partir de la línea 41.

  El fallback inglés no está traducido. `en/servicios/[slug].astro:137` sigue con `ctaLabel="Cotiza tu proyecto"` y `:141` con `` `Cómo se entiende ${entry.data.nombre}` ``. `en/nosotros.astro:84-146` sí trae copy en inglés en su fallback; `nosotros.astro:60-99` es la versión corta en español. Por eso ese par baja a 0.73.
- Impacto: un cambio de sección hay que hacerlo en el `*PageSection` y otra vez en el fallback de la página ES y en el de la EN. Los heroes muertos siguen en el bundle del kit y en el barril.
- Corrección propuesta: una plantilla por tipo de página, con `locale` como prop — `*PageSection` ya va por ahí. Borrar el bloque `else` de las páginas cuando el fallback viva en el componente. Sacar del build `Hero.tsx`, `HeroSection`, `HeroStudioB` y la cadena DriftWall/GradientWaves si el kit deja de mostrarlos.
- Esfuerzo: alto

### D-09. TypeScript estricto, cero `any`, sin lint, y 11 archivos de componente pasan de 400 líneas

- Severidad: Media
- Archivo: `tsconfig.json:2`, `package.json:8`, `src/components/sections/TeamGrid.tsx:228`, `src/components/portal/PortalDemo.tsx`
- Evidencia:
  - `tsconfig.json` extiende `astro/tsconfigs/strict`, incluye `**/*`, excluye `dist`, y fija `jsx: react-jsx`.
  - `tsc --noEmit`: **103 errores** (medidos aparte; no se volvieron a correr aquí).
  - `any` explícito: **0** en `src/` (`*.ts`, `*.tsx`, `*.js`, `*.jsx`, `*.astro`) y **0** en el resto de `*.ts`/`*.tsx` del repo. Los 103 errores no vienen de `any` anotado.
  - `package.json` no tiene `eslint`, `prettier` ni `@astrojs/check`. No hay `.eslintrc*`, `eslint.config.*` ni `.prettierrc*`. Los scripts son `dev`, `build`, `preview`, `deploy` y tareas Sanity. `devDependencies` son `@types/node`, `tsx` y `wrangler`.
  - Aun así hay un comentario de lint: `TeamGrid.tsx:228` `eslint-disable-next-line react-hooks/exhaustive-deps`. No hay herramienta que lo lea.
  - Archivos de `src/components/` con más de 400 líneas:

    | Líneas | Archivo |
    | ---: | --- |
    | 2280 | `src/components/portal/PortalDemo.css` |
    | 899 | `src/components/sections/SiteNav.css` |
    | 857 | `src/components/portal/PortalDemo.tsx` |
    | 631 | `src/components/sections/BlogPost.css` |
    | 542 | `src/components/DesignSystem.tsx` |
    | 525 | `src/components/sections/SiteNav.tsx` |
    | 487 | `src/components/sections/TeamGrid.tsx` |
    | 455 | `src/components/sections/HeroStudioA.css` |
    | 455 | `src/components/sections/HeroStudioA.tsx` |
    | 411 | `src/components/sections/IndustryGrid.css` |
    | 401 | `src/components/effects/ScrollIndicator.tsx` |

- Impacto: `strict` no se está haciendo cumplir en CI (no hay script de `tsc` ni de `astro check` en `package.json`). Los archivos de 800–2 000 líneas concentran el CSS y los botones ajenos al kit (D-04 y D-05). El comentario de ESLint da una señal falsa de que las reglas de hooks están activas.
- Corrección propuesta: añadir `astro check` o `tsc --noEmit` como script y bajar los 103 errores antes de sumar ESLint. Partir `PortalDemo` por vista (rrss, web, seo, hilinks, docs), que es de donde salen la mayoría de sus `<button`. Quitar el `eslint-disable` hasta que exista el linter, o instalar ESLint y dejar que esa línea haga algo.
- Esfuerzo: alto

---

## Qué está alineado

- Los tokens vivos están en un solo sitio: `src/styles/global.css:74-111`. Tailwind v4 los consume por `@theme`, no por el config JS.
- `Button` (43 usos fuera del catálogo) y `Badge` son el CTA y la etiqueta de las secciones de marketing. `SectionBand` (46) y `SectionHeader` (36) son la gramática real de esas secciones.
- Varias hojas ya están en tokens y en `rem`: `BlogPost.css`, `ServiceFocus.css`, `FaqSection.css`, `MetricsBand.css`, `ServicePitch.css`.
- No hay `any` explícito. El hueco de calidad es de herramental y de tamaño de archivo, no de tipos escapados con `any`.
