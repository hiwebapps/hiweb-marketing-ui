# 03. Rendimiento

Medido sobre el build de live del 9 de octubre de 2026 (`astro build`, 6 min 11 s, exit 0). No se desplegó. Lighthouse contra staging no se corrió: staging responde 401 y esta fase no envía la contraseña. Lighthouse local se intentó aparte; si no hay cifra en la sección correspondiente, el navegador de la herramienta no pudo puntuar la página y las cifras de abajo son la medición.

## Qué pesa al abrir el home

El HTML de `/` pesa 148 KB (26 KB gzip). Además el navegador pide este grafo, resuelto siguiendo los `import` de cada chunk:

| Grupo | Raw | Gzip aproximado |
| --- | --- | --- |
| JavaScript del home (islas + runtime + GSAP) | ~433 KB | el runtime solo ya son 57 KB; GSAP + ScrollTrigger + SplitText suman ~48 KB gzip |
| CSS del home (`Layout` + hero + industrias + equipo) | ~110 KB | `Layout.css` son 18 KB gzip |
| Inter variable (preload) | 875 KB | 466 KB |
| Clash Display Semibold (preload) | 27 KB | 19 KB |

Inter es el coste dominante, por encima de todo el JavaScript. La itálica variable son otros 905 KB (505 KB gzip) y se baja en cuanto un texto la usa. Clash declara seis pesos en `src/styles/global.css` (líneas 6–52). Cada peso usado son ~25 KB de OTF sin comprimir bien: el gzip de un OTF se queda en 17–19 KB, frente a un WOFF2 que suele bajar a la mitad.

`/_astro/*` sale con `Cache-Control: public, max-age=31536000, immutable` (lo inyecta el adapter). `/fonts/*` y `/images/*` no tienen cabecera propia en `public/_headers` ni en `dist/client/_headers`. Esas respuestas dependen del default de Cloudflare.

## Hallazgos

### P-01. Inter variable en TTF, sin subset

- Severidad: Alta
- Archivo: `src/styles/global.css:54-68`, `public/fonts/inter/Inter-Variable.ttf`, `src/layouts/Layout.astro:104-110`
- Evidencia: El `@font-face` de Inter apunta a un TTF variable de 874 708 bytes (gzip 465 723). El preload del layout lo pide en cada página. Hay un segundo archivo itálico de 904 532 bytes.
- Impacto: En móvil, la fuente del cuerpo puede pesar más que el HTML, el CSS y el JS juntos. `font-display: swap` evita el texto invisible, pero el intercambio se nota.
- Corrección propuesta: Pasar Inter (solo los ejes y el alfabeto latino que se usan) a WOFF2. Quitar la itálica variable si el sitio no la necesita, o partirla.
- Esfuerzo: medio

### P-02. Clash Display en seis OTF

- Severidad: Media
- Archivo: `src/styles/global.css:6-52`
- Evidencia: Seis `@font-face` (`Extralight` 200 hasta `Bold` 700), todos `format("opentype")`. El preload solo cubre Semibold. Los otros se piden cuando el CSS los usa.
- Impacto: Una página con tres pesos de título baja ~75 KB extra, mal comprimidos.
- Corrección propuesta: Dejar dos pesos (500 y 600, o el par que realmente se vea) en WOFF2.
- Esfuerzo: bajo

### P-03. El runtime de islas pesa 184 KB en todas las páginas con React

- Severidad: Alta
- Archivo: `dist/client/_astro/client.*.js` (184 091 bytes, gzip 57 334), referenciado desde `dist/client/index.html`
- Evidencia: Es el chunk más grande del sitio y entra en el home junto con `SiteNav`, el hero y el resto de islas. `react.*.js` suelto son solo 7.6 KB; el grueso está en este runtime.
- Impacto: Cada plantilla con `client:load` paga ~57 KB gzip antes de ejecutar la isla.
- Corrección propuesta: Medir el contenido del chunk (React DOM vs. el client de Astro) y bajar islas que no necesitan estado al HTML estático. El nav podría ser HTML con un script pequeño para el menú.
- Esfuerzo: alto

### P-04. GSAP en el home por varias islas a la vez

- Severidad: Media
- Archivo: `src/layouts/Layout.astro:134-139`, `src/scripts/motion.ts`, `src/components/sections/HeroStudioA.tsx`, `SiteFooter.tsx`, `MetricsBand.tsx`, `ProcessPhases.tsx`
- Evidencia: El grafo del home incluye `gsap` (70 KB / 27 KB gzip), `ScrollTrigger` (43 KB / 17 KB gzip) y `SplitText` (7 KB / 3 KB gzip). `SiteNav` y `ScrollIndicator` van con `client:load` en todas las páginas. El footer va con `client:idle` pero igual importa GSAP y SplitText.
- Impacto: ~48 KB gzip de animación en la primera visita, aunque `prefers-reduced-motion` luego no anime.
- Corrección propuesta: No importar GSAP en el nav si el menú puede hacerse con CSS. Cargar SplitText solo en el footer cuando el texto se va a partir. Respetar reduced-motion antes de importar, con un `import()` dinámico.
- Esfuerzo: medio

### P-05. Muchas islas en el home

- Severidad: Media
- Archivo: `src/pages/index.astro` (hero `client:load` cerca de la línea 122; el resto `client:visible`), `src/layouts/Layout.astro:134-137`
- Evidencia: El HTML del home enlaza islas de nav, scroll, hero, industrias, casos, proceso, métricas, equipo, FAQ, CTA y footer. Cada una es un chunk. Las de `client:visible` no se ejecutan hasta verse, pero el navegador igual puede precargarlas si están en el HTML como módulos.
- Impacto: Más round-trips y más JS parseado en escritorio, donde varias secciones entran en el primer pantallazo.
- Corrección propuesta: Dejar en isla solo lo que tiene estado (nav, FAQ, before/after, formularios). Métricas, proceso y CTA pueden ser HTML.
- Esfuerzo: medio

### P-06. Las imágenes de Sanity salen a un solo ancho

- Severidad: Media
- Archivo: `src/sanity/image.ts:13-16`
- Evidencia: `urlForWidth` pide un ancho, `auto('format')` y devuelve una URL. No hay `srcset` ni `sizes` en `src/`. El adapter usa `imageService: 'compile'` e `imagesBindingName: false` en `astro.config.mjs:80-84`, así que no hay redimensionado de Cloudflare en el request.
- Impacto: Una foto de caso a 1200 px se manda igual a un móvil de 390 px. `auto=format` ayuda con el formato, no con el tamaño.
- Corrección propuesta: Generar dos o tres anchos y un `srcset`. Reservar ancho y alto para evitar salto de layout.
- Esfuerzo: medio

### P-07. Fuentes e imágenes sin caché larga explícita

- Severidad: Baja
- Archivo: `public/_headers`, `dist/client/_headers`
- Evidencia: La única regla de caché es `/_astro/*` immutable. `/fonts/*` y `/images/*` heredan el default. El `X-Robots-Tag` global sí cubre todo (`/*`).
- Impacto: Una segunda visita puede revalidar ~500 KB de Inter.
- Corrección propuesta: Añadir `Cache-Control` largo a `/fonts/*` y a las imágenes de `public/` que no cambian de nombre.
- Esfuerzo: bajo

### P-08. El build prerender tarda seis minutos

- Severidad: Baja
- Archivo: salida de `astro build`; páginas como `/blog/marketing-gastronomico-restaurantes/index.html` en ~1.9 s y cada caso en ~1.45 s
- Evidencia: 6 min 11 s para el build de live. Cada ruta estática espera a Sanity (`useCdn: false` en `astro.config.mjs:69`).
- Impacto: El webhook de rebuild y el deploy se alargan. No afecta al TTFB del visitante, porque el HTML ya está generado.
- Corrección propuesta: Cachear las queries repetidas (settings, nav, footer) dentro del proceso de build. Valorar el CDN de Sanity en el build de live, donde solo se lee lo publicado.
- Esfuerzo: medio

### P-09. Archivos de fuentes que no se sirven

- Severidad: Baja
- Archivo: `fonts/Roboto_Serif` (~30 MB), `fonts/borscha`, `fonts/dm-sans`, `fonts/syne`, `fonts/Inter`, `fonts/clash-display-font`
- Evidencia: El CSS solo referencia `/fonts/clash-display` y `/fonts/inter` bajo `public/fonts`. El resto está en `fonts/` en la raíz del repo, incluyendo `__MACOSX`.
- Impacto: No sale al visitante. Sí ralentiza el clone y confunde a quien busca la fuente real.
- Corrección propuesta: Sacar del repo lo que no usa `global.css`, o moverlo a un almacén de diseño.
- Esfuerzo: bajo

## Lo que ya está bien

- `font-display: swap` en todos los `@font-face`.
- Preload de la fuente de títulos y de Inter.
- `client:visible` en las secciones debajo del hero, y `client:idle` en el footer.
- `client:only` queda en `/design-system` y `/sections`, que no son páginas de marketing.
- `ogl` (`GradientWaves.jsx`) solo entra por `HeroSection`, y esa pieza no está en el home actual (`HeroStudioA` es el hero que enlaza `index.astro`). `cobe` solo entra con `PresenceMap`.
- Los hashes de `/_astro` permiten caché de un año.
- Hay `prefers-reduced-motion` en el CSS global y en la mayoría de las secciones con GSAP. El detalle de cobertura está en `05-responsive-a11y.md`.

## Lighthouse

No hay puntuación de Lighthouse en este informe. Hace falta Chrome accesible desde el agente y un servidor de los HTML de `dist/client`. Las cifras de peso de arriba son la evidencia de velocidad. Staging (`https://staging.hiweb.com.mx`) no se midió porque responde 401 sin la contraseña.
