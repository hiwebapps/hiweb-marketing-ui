# Auditoría del codebase Hiweb

Fecha: 9 de octubre de 2026. Solo reporte. No se cambió código de producto, no se desplegó y no se escribió en Sanity.

El sitio es Astro 7 + React 19 + Sanity 6, servido en Cloudflare Workers, con D1 para el diagnóstico y el calendario. El build de live de esta auditoría terminó en 6 min 11 s. `tsc --noEmit` tiene 103 errores. `npm audit` reporta 32 avisos (17 high, 0 critical), todos transitivos.

## Informes

| Doc | Qué cubre |
| --- | --- |
| [00-baseline.md](./00-baseline.md) | Versiones, typecheck, audit, rutas, peso del build |
| [01-arquitectura.md](./01-arquitectura.md) | Cadena schema → query → página, Worker, código sin uso, docs viejos |
| [02-seo.md](./02-seo.md) | Indexación, canonical, sitemap, hreflang, encabezados |
| [03-performance.md](./03-performance.md) | JS, CSS, fuentes, imágenes, caché |
| [04-seguridad.md](./04-seguridad.md) | Webhook, calendario, quiz, cabeceras, CI |
| [05-responsive-a11y.md](./05-responsive-a11y.md) | Plantillas a 360–1920 y controles táctiles |
| [06-sanity.md](./06-sanity.md) | Schemas, GROQ, Studio, scripts |
| [07-convenciones-design-system.md](./07-convenciones-design-system.md) | Tokens, `ui/`, nombres, duplicación |

La guía para leer el repo, archivo por archivo, está en [../codebase/README.md](../codebase/README.md). La especificación de la plantilla para otros clientes está en [../template/SPEC.md](../template/SPEC.md).

## Qué arreglar primero

### Crítica

1. **`/contacto` no se publica.** En Sanity hay un redirect publicado `/contacto` → `/calendario`. El build no emite el HTML del formulario. `/contact` apunta a `/contacto`, así que las dos URLs salen del sitio. B-04.
2. **Encender la indexación no es cambiar una variable.** `shouldNoIndex` exige el flag y un host de `hiwebmarketing.com`. `public/_headers` manda `noindex` a todo, sin leer el flag. El canonical del build es `https://hiweb.com.mx` y `robots.txt`, cuando se abra, anuncia el sitemap en `www.hiwebmarketing.com`. S-01, S-02.

### Alta

3. **`GET /api/calendar/availability` puede cancelar citas confirmadas** si la búsqueda en Google Calendar no encuentra el evento. G-01.
4. **Reserva, diagnóstico y sesión no tienen límite.** Un cliente que no sea el navegador llena la agenda y escribe leads. G-02.
5. **Cualquier token que Sanity acepte para el proyecto puede disparar un deploy de producción** por `POST /api/rebuild-status`. G-03.
6. **El respaldo de rebuild apunta por defecto a `jahirgosu/hiweb-marketing-ui`**, no a `hiwebapps/hiweb-marketing-ui`. Solo se usa si no hay deploy hook. A-07, `src/lib/rebuild/dispatch.ts:28`.
7. **La home no tiene `h1`**, ni en español ni en inglés. El título es un `h2`. S-04, R-01.
8. **El sitemap no incluye `/en` ni los servicios e industrias en inglés**, y no mira el checkbox de noindex. S-03.
9. **El CTA en inglés de contacto arma `/en/contacto`**, y el middleware lo manda a `/en`. S-05.
10. **Hreflang y el selector de idioma no usan la misma fuente** (Sanity frente a mapas en código). S-06.
11. **`tsc` falla con 103 errores**, casi todos en los arrays `of:` de secciones. El resto esconde errores reales del hero y de `Button`. B-01.
12. **Inter variable pesa 875 KB** (466 KB gzip) y se pide en cada página. P-01. El runtime de islas suma otros 184 KB (57 KB gzip). P-03.
13. **Queries GROQ piden campos que el schema ya no tiene**, y `src/sanity/types.ts` describe otro modelo. A-02, A-03, C-01, C-02.

## Después, sin prisa de producción

- Cabeceras de seguridad en live (CSP de frames, HSTS, nosniff). G-06.
- Open redirect al salir del draft en staging. G-05.
- Secreto de n8n en la query string. G-07.
- Imágenes de Sanity a un solo ancho, sin `srcset`. P-06.
- Filtros del blog a 22 px de alto. R-02.
- Copy en español dentro de `/en`. R-04.
- Una FAQ de industria muestra Markdown crudo. R-05.
- Design system partido: tokens en `global.css`, mucho hex en CSS de sección, `tailwind.config.js` no entra en el build de Tailwind v4. D-01, D-02.
- Páginas ES y EN copiadas, y heroes que ya no monta ninguna ruta. D-08, A-11.
- Docs de `docs/cms/` que niegan el i18n y describen un SSR que ya no es el de ahora. A-04, S-10.

## Qué no se midió

Lighthouse no se corrió. Staging responde 401 y no se envió la contraseña. Las cifras de peso están en `03-performance.md`, tomadas del build de live. El responsive se miró sobre ese HTML estático, no sobre el Worker.
