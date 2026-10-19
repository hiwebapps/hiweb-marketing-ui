# 05. Responsive y accesibilidad

Revisión en el navegador sobre el HTML del build de live, servido en local desde `dist/client` (9 de octubre de 2026). No es el Worker de producción: es el mismo HTML que ese build emitió.

Anchos medidos: 360, 768, 1024, 1440 y 1920. En cada uno se miró si `documentElement.scrollWidth` pasa de `clientWidth` (scroll horizontal de la página).

## Resultado por plantilla

| Plantilla | 360 | h1 | Notas |
| --- | --- | --- | --- |
| `/` | sin scroll horizontal | 0 | El título del hero es `h2`. El menú hamburguesa abre y el ítem "Casos de Éxito" mide 320×53. |
| `/en` | sin scroll | 0 | Mismo hero. Queda copy en español en secciones que el resto ya está en inglés. `lang=en`. |
| `/servicios/seo` | sin scroll | 1 | |
| `/industrias/salud` | sin scroll | 1 | Una respuesta del FAQ muestra Markdown crudo. |
| `/portafolio/gaios` | sin scroll | 1 | |
| `/blog` | sin scroll | 1 | Los filtros miden ~22 px de alto. |
| `/blog/auditoria-seo` | sin scroll | 1 | Hay índice, un `h1` y el cuerpo. |
| `/calendario` | sin scroll | 1 | Día del calendario 42×42. Nombre, email, teléfono y empresa tienen nombre accesible. |
| `/diagnostico-marketing-digital` | sin scroll | 1 | Las opciones miden 58–82 px de alto. |
| `/portal` | sin scroll en 360 y en 1440 | 1 | |
| `/terminos` | sin scroll | 1 | Jerarquía `h1` + `h2` por cláusula. |
| `/contacto` | no existe en este build | — | Redirect de Sanity a `/calendario`. Ver B-04. |

Home en 768, 1024, 1440 y 1920: scroll horizontal 0. A 768 el botón "Abrir menú" sigue visible. A 1024 ese botón mide 0×0 y el enlace "Nosotros" del nav de escritorio mide 82×51. El corte del menú está entre 768 y 1024.

El contenedor de la home a 1920 ocupa el ancho de la ventana. El tope de 1300 px vive en el contenido interior (`--section-max` en `global.css`), no en `<main>`.

## Hallazgos

### R-01. La home, en español y en inglés, no tiene `h1`

- Severidad: Alta
- Archivo: `src/components/sections/HeroStudioA.tsx` (el título es `h2`). Confirmado en el DOM de `/` y `/en` a 360 y a 1440.
- Evidencia: `document.querySelectorAll('h1').length` es 0. El título visible es "Agencia de Marketing Digital en México…" con `level: 2`.
- Impacto: La URL principal no tiene encabezado de nivel 1. El mismo hueco está en S-04.
- Corrección propuesta: El título del hero de la home debe ser `h1`. En el resto de secciones, `h2`.
- Esfuerzo: bajo

### R-02. Filtros del blog por debajo del tamaño táctil

- Severidad: Media
- Archivo: índice `/blog`, chips "Todos", "Redes Sociales", "SEO"
- Evidencia: A 360 px las etiquetas miden 69×22, 128×22 y 54×22. El control de radio interior mide 13×13.
- Impacto: En el teléfono el filtro es fácil de fallar. El criterio habitual es 44×44 px.
- Corrección propuesta: Subir el alto del chip a 44 px, con el radio dentro de esa área.
- Esfuerzo: bajo

### R-03. Días del calendario y el selector de idioma quedan justos

- Severidad: Baja
- Archivo: `/calendario` y el botón "Idioma: español" del nav
- Evidencia: Cada día mide 42×42. El idioma mide 86×42. El botón de menú del diagnóstico mide 44×44. Las opciones del quiz sí pasan de 44 px de alto.
- Impacto: El fallo es pequeño. En un dedo, el día y el idioma se sienten justos.
- Corrección propuesta: 44 px de alto mínimo en el día y en el control de idioma.
- Esfuerzo: bajo

### R-04. En la home en inglés quedan frases y controles en español

- Severidad: Media
- Archivo: `src/pages/en/index.astro` y los componentes que reciben copy fijo
- Evidencia: En `/en`, con `lang=en`, el DOM mezcla inglés con "Ver más", "Industria anterior", "Industria siguiente", "Mostrar Healthcare", "Hablamos el idioma de tu sector", "Conoce a todo el equipo" y párrafos de proceso, métricas y FAQ todavía en español. Los botones del carrusel de industrias no cambian de idioma.
- Impacto: Quien entra por el selector EN lee una página a medias. No es un fallo de layout: el texto no se parte ni se sale.
- Corrección propuesta: Pasar esos rótulos por `locale.ts` (o por el documento de la home EN) y no dejar el default en español dentro del componente.
- Esfuerzo: medio

### R-05. Una respuesta de FAQ de industria se ve como Markdown

- Severidad: Media
- Archivo: FAQ de `/industrias/salud`, campo de respuesta en Sanity
- Evidencia: El texto accesible incluye `` [nuestro blog](https://ww ``. `innerText` de la página tiene una coincidencia de `](http`.
- Impacto: El lector ve la sintaxis, no el enlace. El resto de respuestas de esa página sí salen como texto.
- Corrección propuesta: Renderizar esa respuesta con el mismo Portable Text o el parser que ya usan otras FAQ, o guardar la respuesta sin Markdown.
- Esfuerzo: bajo

### R-06. El teléfono del footer no es el de los términos

- Severidad: Baja
- Archivo: footer de las plantillas revisadas y `src/pages/terminos` (contenido Sanity)
- Evidencia: El footer muestra `+52 999 123 4567`. Términos dice `999 560 2388` y `admin@hiwebmarketing.com`.
- Impacto: Dos teléfonos públicos. Uno de los dos está desactualizado.
- Corrección propuesta: Un solo teléfono y un solo correo en `siteSettings`, y que términos lo lea de ahí.
- Esfuerzo: bajo

## Lo que sí aguanta

- Ninguna plantilla revisada genera scroll horizontal a 360 px. El marquee del CTA final es más ancho que la ventana, pero el documento no crece: el track va recortado.
- El menú móvil abre, el botón pasa a "Cerrar menú" y los enlaces caben en 320 px.
- Servicio, industria, caso, blog, artículo, calendario, diagnóstico, portal y términos tienen un solo `h1`.
- Los campos del calendario tienen nombre accesible (Nombre, Email, Teléfono, Empresa).
- `prefers-reduced-motion` está en `global.css` y en la mayoría de las secciones con GSAP (lista en `03-performance.md`). No se forzó el media query en el navegador.
- El foco visible no está en un solo lugar: hay `:focus-visible` en nav, FAQ, footer, hero, blog y casos. No hay una regla global en `src/styles/global.css`. Un control nuevo puede quedar sin anillo si su CSS no lo declara.
