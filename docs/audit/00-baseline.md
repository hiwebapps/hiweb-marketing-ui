# 00. Línea base

Fecha de medición: 9 de octubre de 2026. Máquina con Node `v24.16.0` y npm `12.0.2`. El `package.json` pide Node `>=22.12.0`.

Esta fase no corrige nada. Describe el estado medido para que el resto de la auditoría tenga una referencia.

## Stack

| Pieza | Versión instalada | Última en el rango / registro |
| --- | --- | --- |
| astro | 7.3.3 | 7.3.8 |
| @astrojs/cloudflare | 14.3.2 | 14.3.4 |
| @astrojs/react | 6.0.2 | 6.0.6 (major 7.0.1 existe) |
| react / react-dom | 19.2.8 | 19.3.0 |
| sanity, groq, @sanity/vision | 6.15.0 | 6.18.0 |
| @sanity/client | 8.6.2 | 8.9.0 |
| wrangler | 4.135.0 | 4.149.0 |
| tailwindcss | 4.3.3 | al día en el momento de `npm outdated` |
| gsap | 3.15.0 | al día |

`npm outdated` también marca parches de `@sanity/icons`, `@sanity/visual-editing`, `@types/node`, `@types/react`, `@types/react-dom` y `tsx`. Ninguno es un salto de major salvo `@astrojs/react` 7, que no conviene mezclar con Astro 7.3 sin una prueba aparte.

Salida de producción: `output: 'server'` con el adapter de Cloudflare. En el build de live (`PUBLIC_SITE_ENV` vacío) las páginas con `export const prerender = true` se generan a HTML. En staging, `stagingSsr()` en `astro.config.mjs` apaga el prerender de todas las rutas.

## Herramientas que no están

- `@astrojs/check` no está en dependencias ni en `node_modules`. No se corrió `astro check`.
- No hay ESLint ni Prettier en `package.json`.
- `tsconfig.json` extiende `astro/tsconfigs/strict`.

`sanity typegen` no se ejecutó. El script del repo escribe `schema.json` y regenera tipos, y esta fase no debe modificar archivos generados. La comparación schema / GROQ / tipos está en `06-sanity.md`.

## TypeScript

`npx tsc --noEmit` termina con **103 errores** en 27 archivos.

| Código | Cantidad | Qué significa aquí |
| --- | --- | --- |
| TS2322 | 67 | Un tipo no cabe donde se asigna. Casi todos son miembros de arrays `of:` en schemas de secciones. |
| TS2345 | 8 | Argumento incompatible (GSAP `TweenVars`, scripts de seed, mappers). |
| TS18046 | 5 | `section` es `unknown` dentro de validaciones de schema. |
| TS2722 / TS18048 | 5 + 5 | `contextSafe` de GSAP puede ser `undefined` en `HeroStudioA.tsx`. |
| TS2558 | 3 | `structure.ts` pasa un type argument a una función que ya no acepta ninguno. |
| TS2339 | 3 | Propiedad que no existe (`Button` disabled, `reduceMotion`). |
| TS2353 / TS7006 | 3 + 3 | Campos de más en scripts de seed; parámetros `any` implícito en `astro.config.mjs`. |
| TS7022 | 1 | `proxy` sin anotación en `src/lib/gsap-ssr-stub.ts`. |

Archivos con más errores:

| Errores | Archivo |
| --- | --- |
| 12 | `src/sanity/schemas/serviceSections.ts` |
| 12 | `src/components/sections/HeroStudioA.tsx` |
| 11 | `src/sanity/schemas/homeSections.ts` |
| 9 | `src/sanity/schemas/aboutSections.ts` |
| 8 | `src/sanity/schemas/caseSections.ts` |
| 8 | `src/sanity/schemas/portalPage.ts` |
| 7 | `src/sanity/schemas/industrySections.ts` |
| 5 | `astro.config.mjs` |

El build de Astro no usa `tsc`, así que el sitio puede compilar igual. Los errores de schema son de tipos de Studio (el array `of` se declara a mano con `options.modal` y TypeScript no lo acepta como `ArrayOfObjectsMember`). Los de `HeroStudioA.tsx` y `Button.tsx` sí están en el código que se hidrata.

### B-01. `tsc --noEmit` no está en verde

- Severidad: Alta
- Archivo: `src/sanity/schemas/serviceSections.ts` y el resto de la tabla anterior
- Evidencia: 103 errores. El grueso es TS2322 en los `of:` de secciones, por ejemplo `aboutSections.ts` alrededor de la línea 313.
- Impacto: Un agente o un editor no puede fiarse del typecheck para saber si un cambio de schema o de hero es seguro. Los errores reales se esconden entre los de tipado del array.
- Corrección propuesta: Tipar los miembros con `defineArrayMember` (o un helper que devuelva el tipo que Sanity espera) y arreglar los 20 errores que no son de schema.
- Esfuerzo: medio

### B-02. No hay lint ni `astro check`

- Severidad: Media
- Archivo: `package.json`
- Evidencia: No aparecen `eslint`, `prettier` ni `@astrojs/check`.
- Impacto: El único control automático es `tsc`, y hoy falla. Astro (frontmatter, componentes `.astro`) no se revisa.
- Corrección propuesta: Añadir `astro check` en CI cuando `tsc` esté en cero, y un formatter único.
- Esfuerzo: bajo

## Dependencias

`npm audit`: **32 avisos** (1 low, 14 moderate, 17 high, 0 critical). `npm audit --omit=dev` reporta el mismo total, así que npm los cuenta dentro del árbol que instala el proyecto, no solo como herramientas sueltas.

Los que importan para el runtime o el build:

- `undici` 7.0.0–7.29.0, high, varios DoS y un bypass de TLS. Entra por `miniflare` y `@module-federation/dts-plugin` (cadena de wrangler / el adapter). No es código de la aplicación.
- `svgo` 4.0.0–4.0.2, high, sanitizado incompleto de SVG. `npm audit fix` lo cubre. Afecta al optimizador de imágenes en build, no al HTML público directamente.
- `uuid` &lt;11.1.1 vía `typeid-js` (dependencia de Sanity), moderate. El arreglo que propone npm baja Sanity a 5.14.1. No hay que aplicarlo así.

### B-03. Avisos high en dependencias transitivas

- Severidad: Media
- Archivo: `package-lock.json` (`undici`, `svgo`, `uuid`)
- Evidencia: 17 high, 14 moderate. Ninguno es un paquete importado desde `src/`.
- Impacto: `svgo` procesa SVG en el build. `undici` vive en el toolchain de Workers. El riesgo en el sitio publicado es indirecto.
- Corrección propuesta: `npm audit fix` sin `--force`, luego subir wrangler y Sanity dentro de la misma major (6.18 / wrangler 4.149) y volver a auditar.
- Esfuerzo: bajo

## Tamaño del código

354 archivos de código en `src/`, `scripts/`, `integrations/` y `migrations/` (`.ts`, `.tsx`, `.astro`, `.js`, `.jsx`, `.mjs`, `.css`).

## Rutas

En live, `prerender = true` genera HTML en el build. `prerender = false` queda en el Worker. En staging el hook `stagingSsr` pone `prerender = false` en todas.

Todas las páginas de contenido leen `src/lib/content`. Ese módulo intenta Sanity y, si falla o viene vacío, usa `src/content` (`from-collections.ts`). Inglés de industrias, y varios documentos que no tienen JSON local (legal, contacto, calendario, portal, landings), dependen de Sanity: el fallback inglés de `getIndustries` llama solo a `sanityIndustries('en')`.

| Ruta | Prerender en live | Datos |
| --- | --- | --- |
| `/`, `/en` | sí | home, casos, industrias, servicios, personas, settings |
| `/[slug]` | sí | landing pages |
| `/blog`, `/blog/[slug]` | sí | posts, catálogo, servicios |
| `/en/blogs`, `/en/blogs/[slug]` | sí | posts EN |
| `/portafolio`, `/portafolio/[slug]` | sí | casos, industrias; el índice además usa `WEBFLOW_CASES_INDEX` |
| `/servicios/[slug]`, `/en/servicios/[slug]` | sí | servicio + copy de `src/data/service-*` |
| `/industrias/[slug]`, `/en/industrias/[slug]` | sí | industria + `src/data/industryServices.ts` |
| `/nosotros`, `/en/nosotros` | sí | about, personas; ES también usa `HOME_PILLARS` de `src/data/site.ts` |
| `/contacto` | sí | contact page, settings. No hay `/en/contacto` |
| `/calendario`, `/en/calendario` | sí | calendar page. El tool habla con `/api/calendar/*` |
| `/portal`, `/en/portal` | sí | portal + `portal-defaults.json` |
| `/diagnostico-marketing-digital` | sí | site page. El quiz habla con `/api/quiz/*` |
| `/aviso-de-privacidad`, `/terminos` y pares `/en/*` | sí | legal page |
| `/design-system`, `/sections` | sí | sin CMS. Islas `client:only="react"` |
| `/robots.txt`, `/sitemap.xml` | no | SSR |
| `/api/quiz/session`, `/api/quiz/submit` | no | D1 |
| `/api/calendar/availability`, `book`, `cancel` | no | D1 + Google Calendar |
| `/api/draft-mode/enable`, `disable` | no | preview |
| `/api/sanity-webhook`, `/api/rebuild-status` | no | cola de rebuild |

Redirects fijos en `astro.config.mjs`: `/work`, `/contact`, seis slugs viejos de servicios en inglés, `/en/blog` → `/en/blogs`, y los índices `/industrias`, `/servicios`, `/en/industrias`, `/en/servicios` vuelven al home. Los redirects editables en Sanity los añade `integrations/sanity-redirects.mjs` en el build.

## Build de live

`npx astro build` con `PUBLIC_SITE_URL=https://hiweb.com.mx` y sin `PUBLIC_SITE_ENV` terminó en **6 min 11 s**, exit 0. El adapter inyectó `Cache-Control: public, max-age=31536000, immutable` para `/_astro/*`.

Rutas que no generaron HTML (`response body was empty`, el patrón de un redirect):

| Ruta | Por qué |
| --- | --- |
| `/contact`, `/work`, `/en/blog`, `/industrias`, `/servicios`, `/en/industrias`, `/en/servicios` | Redirects de `astro.config.mjs` |
| `/contacto` | Redirect publicado en Sanity: `/contacto` → `/calendario` |

### B-04. `/contacto` no se publica

- Severidad: Crítica
- Archivo: `integrations/sanity-redirects.mjs:31`; documento `redirect` en el dataset `web-2026`
- Evidencia: La query pública `*[_type == "redirect"]` devuelve `/contacto -> /calendario` y un redirect de un post EN. El build dice `/contacto/index.html (+0ms) (file not created, response body was empty)`. `/contact` apunta a `/contacto`, así que las dos URLs salen del sitio.
- Impacto: El formulario de `src/pages/contacto.astro` no está en el HTML de producción. Quien abre Contacto cae en el calendario.
- Corrección propuesta: Borrar o despublicar ese redirect en Studio. En código, no dejar que un redirect de Sanity tape una ruta que ya tiene página, o avisar en el build.
- Esfuerzo: bajo

## Bundles del build nuevo

`dist/client/_astro`: **52 JS, 725 758 bytes** y **13 CSS, 241 453 bytes**.

| Archivo | Raw | Gzip |
| --- | --- | --- |
| `client.*.js` (runtime de islas) | 184 091 | 57 334 |
| `Layout.*.css` | 91 628 | 17 577 |
| `gsap.*.js` | 69 634 | 27 069 |
| `portal-defaults.*.css` | 54 560 | 9 555 |
| `ScrollTrigger.*.js` | 42 777 | 17 434 |
| `SectionsKitPage.*.js` | 124 539 | solo en `/sections` |
| `PortalPageView.*.js` | 84 204 | solo en `/portal` |

El home (`dist/client/index.html`, 148 KB raw / 26 KB gzip) referencia un grafo de **543 KB** entre CSS y JS. De eso, unos **433 KB son JavaScript** (runtime 184 KB, GSAP + ScrollTrigger + SplitText unos 120 KB, y el resto las islas). El CSS del home son ~110 KB raw, casi todo `Layout.css`.

HTML de otras plantillas: blog índice 212 KB / 34 KB gzip, servicio SEO 136 KB, portal 64 KB, calendario 42 KB, diagnóstico 31 KB.

Fuentes que el sitio pide (`public/fonts`): Inter variable 875 KB (gzip 466 KB) más itálica 905 KB (gzip 505 KB). Clash Display son 6 OTF de ~25 KB cada uno (~17–19 KB gzip). El `<head>` solo hace preload de `ClashDisplay-Semibold.otf` e `Inter-Variable.ttf`.

En el repo, fuera de `public/`, hay archivos de fuentes que el CSS no usa: `fonts/Roboto_Serif` (~30 MB), `fonts/Inter` duplicado, `fonts/borscha`, `fonts/dm-sans`, `fonts/syne` y un zip suelto. No se sirven, pero hinchan el clone.

## Hidratación que ya se ve sin el build

En todas las páginas, `Layout.astro` monta `SiteNav` y `ScrollIndicator` con `client:load`, y `SiteFooter` con `client:idle`. El hero del home y varias piezas above-the-fold usan `client:load`. El resto de secciones usa `client:visible`. `design-system` y `sections` son `client:only="react"`, así que no tienen HTML de esa isla.

GSAP entra en nav, footer, heroes, métricas, proceso, blog, casos, industrias, servicios y el script global `src/scripts/motion.ts`. `cobe` solo en `PresenceMap.tsx`. `ogl` solo en `GradientWaves.jsx`.
