# Scripts de Sanity, redirects y D1

Nada de `scripts/sanity` lo importa el sitio. Son CLI. El grafo los marca con «Lo usan: —» salvo `lib/rebuild-tables.ts`. Escriben en el dataset `web-2026` del proyecto `fxardjr1` cuando llevan token de escritura (`SANITY_API_WRITE_TOKEN`, o el token guardado por el CLI de Sanity).

Convención de escritura:

- **Dry-run hasta `--write`.** Sin el flag imprime y no muta. Con el flag publica.
- **Escribe siempre.** No mira `--write`.
- **No escribe en Sanity.** Genera archivos locales o sale con error.
- **One-shot Webflow.** Paso de la migración desde hiwebmarketing.com / el export de Webflow. Volver a correrlo pisa lo editado en Studio (C-08).

`package.json` solo expone siete: `sanity:seed`, `sanity:import-posts`, `sanity:rebuild-tables`, `sanity:write-home`, `sanity:write-services`, `sanity:write-cases` y `sanity:migrate-home-sections`, cada uno con variante `:write`. El resto se corre a mano. `sanity:migrate-home-sections` ya no escribe: el script sale con código 1.

## `scripts/sanity`

### `scripts/sanity/seed-from-collections.ts`

- Propósito: semilla inicial de `web-2026` desde `src/content` y `src/data/site.ts`.
- Por qué está así: el dataset nuevo tenía que nacer del JSON y Markdown que el sitio ya prerenderizaba.
- Exporta: nada. CLI.
- Depende de: `src/data/site.ts`, `src/data/industryServices.ts`.
- Lo usan: npm `sanity:seed` y `sanity:seed:write`.
- Datos: `createOrReplace` de industrias, servicios, casos, posts, personas y ajustes. Dataset `web-2026`.
- Escritura: dry-run hasta `--write`.
- Migración: one-shot de semilla, anterior al page builder. No es el volcado Webflow, pero no debe repetirse encima de Studio.
- Hallazgos: C-08 en espíritu. Un `--write` reemplaza documentos enteros.

### `scripts/sanity/import-production-posts.ts`

- Propósito: copia los posts en español del dataset de producción al `web-2026`.
- Por qué está así: el blog ya vivía en otro dataset de Sanity. Este pase los trae, autores incluidos, y reconstruye tablas con `lib/rebuild-tables.ts`.
- Exporta: nada. CLI.
- Depende de: `scripts/sanity/lib/rebuild-tables.ts`.
- Lo usan: npm `sanity:import-posts` y `:write`.
- Datos: transacción `createOrReplace` de autores y de posts.
- Escritura: dry-run hasta `--write`.
- Migración: one-shot. No es el scrape de Webflow; es la copia entre datasets. C-08. Repetirlo pisa el cuerpo editado.
- Hallazgos: C-08.

### `scripts/sanity/import-en-blogs.mjs`

- Propósito: importa los artículos en inglés publicados en el sitio de Webflow.
- Por qué está así: el dataset de producción no traía el blog EN. El HTML viejo sí.
- Exporta: nada. CLI. Acepta `--limit`.
- Depende de: nada del grafo. Lee la web publicada.
- Lo usan: nadie. Se corre con `node`.
- Datos: `createOrReplace` de cada post EN. También hace `patch` de `locale: es` en posts que no tenían idioma, y puede reescribir ids.
- Escritura: dry-run hasta `--write`.
- Migración: one-shot Webflow.
- Hallazgos: C-08.

### `scripts/sanity/rebuild-post-tables.ts`

- Propósito: convierte tablas aplanadas (un párrafo por celda) en bloques `table`.
- Por qué está así: el import dejó el cuerpo ilegible. El bloque `blogTable` está oculto; este script escribe `table`.
- Exporta: nada. CLI.
- Depende de: `lib/rebuild-tables.ts`.
- Lo usan: npm `sanity:rebuild-tables` y `:write`.
- Datos: `patch` del `body` con `autoGenerateArrayKeys`.
- Escritura: dry-run hasta `--write`.
- Migración: one-shot del import. Tiene sentido otra vez solo si queda un post con la tabla vieja.
- Hallazgos: C-08 lo agrupa con los pases que no deben ser rutina.

### `scripts/sanity/lib/rebuild-tables.ts`

- Propósito: detecta una rejilla de párrafos y la arma como filas y celdas.
- Por qué está así: el import y el rebuild comparten la misma heurística (`isHeaderish`, esquina vacía, número de columnas).
- Exporta: `PtBlock`, `TableHit`, `blockText`, `isHeaderish`, `rebuildFlattenedTables`.
- Depende de: nada.
- Lo usan: `import-production-posts.ts`, `rebuild-post-tables.ts`.
- Datos: no toca la red. Devuelve el `body` nuevo y la lista de tablas encontradas.
- Escritura: no escribe. Lo hace quien lo llama, y solo con `--write`.
- Migración: pieza del one-shot de posts.
- Hallazgos: ninguno propio.

### `scripts/sanity/scrape-webflow-services.ts`

- Propósito: baja el HTML de las fichas de servicio de Webflow a un JSON local.
- Por qué está así: el generador y el write no deben pegarle a la web vieja en cada corrida. El scrape es el paso anterior.
- Exporta: nada. CLI.
- Depende de: nada del grafo.
- Lo usan: nadie.
- Datos: escribe un volcado UTF-8 en disco, no en Sanity.
- Escritura: no escribe en Sanity.
- Migración: one-shot Webflow.
- Hallazgos: C-08. No hace falta volver a bajarlo.

### `scripts/sanity/scrape-webflow-cases.ts`

- Propósito: baja el índice y el detalle de `/portafolio` de Webflow.
- Por qué está así: igual que el scrape de servicios. El JSON local es la fuente del generador.
- Exporta: nada. CLI.
- Depende de: nada del grafo.
- Lo usan: nadie.
- Datos: JSON UTF-8 en disco.
- Escritura: no escribe en Sanity.
- Migración: one-shot Webflow.
- Hallazgos: C-08.

### `scripts/sanity/generate-webflow-services.ts`

- Propósito: regenera `src/data/webflow-services.ts` desde las páginas vivas de Webflow y un mapa curado.
- Por qué está así: el fallback del sitio y el script de write leen ese módulo. Generarlo a mano no escala a nueve servicios.
- Exporta: nada. CLI.
- Depende de: `src/data/webflow-home.ts`.
- Lo usan: nadie.
- Datos: escribe TypeScript en `src/data`. No llama a la API de Sanity.
- Escritura: no escribe en Sanity. Machaca el volcado curado en disco.
- Migración: one-shot Webflow.
- Hallazgos: C-08. El runtime también importa `webflow-services.ts` como fallback. Regenerarlo cambia el respaldo del sitio, no solo un script.

### `scripts/sanity/generate-webflow-cases.ts`

- Propósito: regenera `src/data/webflow-cases.ts` y `src/content/casos/*.json` desde el scrape.
- Por qué está así: el índice de portafolio y el fallback de casos leen ese volcado.
- Exporta: nada. CLI.
- Depende de: nada del grafo.
- Lo usan: nadie.
- Datos: TypeScript y JSON locales.
- Escritura: no escribe en Sanity. Machaca el volcado curado.
- Migración: one-shot Webflow.
- Hallazgos: C-08. `from-collections.ts` sigue leyendo esos archivos cuando Sanity no responde.

### `scripts/sanity/write-webflow-home.ts`

- Propósito: parchea `homePage` y los taglines de servicio con el copy de la home de Webflow.
- Por qué está así: la semilla desde colecciones no traía el texto publicado en la web vieja.
- Exporta: nada. CLI.
- Depende de: `src/data/webflow-home.ts`.
- Lo usan: npm `sanity:write-home` y `:write`.
- Datos: `createIfNotExists` de `homePage` y `patch` de taglines. Token de write o, en su defecto, el de read.
- Escritura: dry-run hasta `--write`.
- Migración: one-shot Webflow.
- Hallazgos: C-08. Con `--write` pisa la home desde el HTML viejo.

### `scripts/sanity/write-webflow-services.ts`

- Propósito: parchea los nueve servicios con hero, cards, proceso y FAQ de Webflow.
- Por qué está así: esos campos eran el cuerpo plano, antes de `sections[]`.
- Exporta: nada. CLI.
- Depende de: `src/data/webflow-services.ts`.
- Lo usan: npm `sanity:write-services` y `:write`.
- Datos: `patch` por documento de servicio.
- Escritura: dry-run hasta `--write`.
- Migración: one-shot Webflow.
- Hallazgos: C-08.

### `scripts/sanity/write-webflow-cases.ts`

- Propósito: sustituye los casos de ficción por el portafolio de Webflow.
- Por qué está así: la colección traía casos de muestra. El sitio público tenía otros clientes.
- Exporta: nada. CLI.
- Depende de: `src/data/webflow-cases.ts`.
- Lo usan: npm `sanity:write-cases` y `:write`.
- Datos: `createOrReplace` de cada caso del volcado y `delete` de los documentos que ya no vienen en él.
- Escritura: dry-run hasta `--write`.
- Migración: one-shot Webflow.
- Hallazgos: C-08. El `delete` borra casos editados en Studio que no estén en el volcado.

### `scripts/sanity/migrate-home-sections.ts`

- Propósito: ya no tiene. El comentario manda a `migrate-home-builder.ts`.
- Por qué está así: el primer intento escribía los campos planos. La home pasó a `sections[]` y el script se dejó para que el npm script no apunte a un archivo borrado.
- Exporta: nada.
- Depende de: nada.
- Lo usan: npm `sanity:migrate-home-sections` y `:write`. Los dos salen igual.
- Datos: no lee el dataset.
- Escritura: no escribe. `process.exit(1)` siempre, con o sin `--write`.
- Migración: retirado. El one-shot vigente es `migrate-home-builder.ts`.
- Hallazgos: C-08. El comentario de retirada es el modelo para el resto de scripts de Webflow.

### `scripts/sanity/migrate-home-builder.ts`

- Propósito: pliega los campos planos de `homePage` en `sections[]` y hace `unset` de los planos.
- Por qué está así: el schema dejó de declarar `heroTitle` y `process[]`. Había que mover el dato antes de que el formulario lo ocultara.
- Exporta: nada. CLI.
- Depende de: nada del grafo.
- Lo usan: nadie en npm.
- Datos: `patch` con `set({ sections })` y `unset(FLAT_FIELDS)`.
- Escritura: dry-run hasta `--write`.
- Migración: one-shot del pase a secciones. No es el scrape, pero pisa la home si se repite.
- Hallazgos: C-08.

### `scripts/sanity/seed-home-en.ts`

- Propósito: crea `homePage-en` a partir de la home en español, sustituyendo las frases que existen en hiwebmarketing.com/en.
- Por qué está así: la home no tiene campo `locale`. El inglés es otro `_id`. Lo que no está en la web vieja se queda en español.
- Exporta: nada. CLI.
- Depende de: nada del grafo.
- Lo usan: nadie en npm.
- Datos: `createOrReplace` del documento entero `homePage-en`.
- Escritura: dry-run hasta `--write`.
- Migración: one-shot del alta EN. Repetirlo reemplaza el documento inglés.
- Hallazgos: C-08. C-10. Home sigue sin `locale` en el schema.

### `scripts/sanity/seed-about-en.ts`

- Propósito: publica `aboutPage-en` traduciendo la página española. La web vieja no tenía About en inglés.
- Por qué está así: el desk ya abre ese id. Alguien tenía que crear el documento la primera vez.
- Exporta: nada. CLI.
- Depende de: nada del grafo.
- Lo usan: nadie en npm.
- Datos: `createOrReplace` de `aboutPage-en`. Si el español no tiene `locale`, le pone `es`.
- Escritura: dry-run hasta `--write`.
- Migración: one-shot del alta EN.
- Hallazgos: C-08.

### `scripts/sanity/seed-services-en.ts`

- Propósito: clona cada servicio español a un documento inglés, mismo slug y `locale: "en"`, y sustituye las cadenas que estaban en hiwebmarketing.com/en.
- Por qué está así: el par es `${id}-en`. El starter no trae el copy publicado.
- Exporta: nada. CLI.
- Depende de: nada del grafo.
- Lo usan: nadie en npm.
- Datos: `createOrReplace` del documento EN y, si falta, `locale: es` en el español.
- Escritura: dry-run hasta `--write`.
- Migración: one-shot del alta EN.
- Hallazgos: C-08. Reemplaza el documento EN entero.

### `scripts/sanity/seed-industries-en.ts`

- Propósito: crea las industrias en inglés con la traducción guardada en `industry-en-copy.json`.
- Por qué está así: el copy EN no salía de un scrape genérico. Está curado en ese JSON.
- Exporta: nada. CLI.
- Depende de: lee `scripts/sanity/industry-en-copy.json` con `readFileSync`. El grafo no lo ve porque no es un `import`.
- Lo usan: nadie en npm.
- Datos: `createOrReplace` de cada industria `-en` y del índice EN. Marca `locale: es` en el español si faltaba.
- Escritura: dry-run hasta `--write`.
- Migración: one-shot del alta EN.
- Hallazgos: C-08.

### `scripts/sanity/industry-en-copy.json`

- Propósito: copy en inglés de seis industrias para `seed-industries-en.ts`.
- Por qué está así: el texto está revisado aparte del script, para no mezclar la traducción con el `createOrReplace`.
- Exporta: nada. JSON.
- Depende de: nada.
- Lo usan: `seed-industries-en.ts`.
- Datos: claves `manufactura`, `salud`, `inmobiliarias`, `turismo-hoteleria`, `restaurantes` y `saas`. Cada una trae nombre, tagline y el resto del copy de la ficha. No se vuelca aquí.
- Escritura: no escribe. Es la fuente del seed.
- Migración: one-shot del alta EN.
- Hallazgos: ninguno.

### `scripts/sanity/write-about-sections.ts`

- Propósito: copia el documento plano de Nosotros a `sections[]` y hace `unset` de los campos raíz.
- Por qué está así: `aboutPage` ya solo declara `locale`, `sections` y SEO.
- Exporta: nada. CLI.
- Depende de: `src/data/site.ts`.
- Lo usan: nadie en npm.
- Datos: `patch` de cada about, español e inglés. Si el documento ya tiene secciones, lo salta.
- Escritura: dry-run hasta `--write`.
- Migración: one-shot del pase a secciones.
- Hallazgos: C-08.

### `scripts/sanity/write-industry-sections.ts`

- Propósito: copia los campos planos de cada industria a `sections[]` y hace `unset` de la raíz.
- Por qué está así: el mismo corte que about. `porQue`, `faqs` y `retos` pasan a bloques.
- Exporta: nada. CLI.
- Depende de: nada del grafo.
- Lo usan: nadie en npm.
- Datos: `patch` por documento. Salta los que ya tienen secciones.
- Escritura: dry-run hasta `--write`.
- Migración: one-shot del pase a secciones.
- Hallazgos: C-08. C-02 sigue pidiendo esos campos planos en la query aunque el script ya los haya quitado del documento.

### `scripts/sanity/write-service-sections.ts`

- Propósito: copia la ficha plana de cada servicio al array `sections`.
- Por qué está así: hero, cards, proceso y FAQ tenían que quedar dentro de `serviceHero`, `serviceOverview`, `serviceProcess` y `serviceFaq`.
- Exporta: nada. CLI.
- Depende de: `src/data/service-pitch.ts`.
- Lo usan: nadie en npm.
- Datos: `patch` de `sections`. Si ya hay secciones, completa; si no, escribe el array.
- Escritura: dry-run hasta `--write`.
- Migración: one-shot del pase a secciones.
- Hallazgos: C-08.

### `scripts/sanity/write-case-sections.ts`

- Propósito: copia reto, fases, métricas y testimonio de cada caso a `sections[]`.
- Por qué está así: `caseStudy` ya no declara esos campos en la raíz.
- Exporta: nada. CLI.
- Depende de: nada del grafo.
- Lo usan: nadie en npm.
- Datos: `patch` de `sections` en cada caso.
- Escritura: dry-run hasta `--write`.
- Migración: one-shot del pase a secciones.
- Hallazgos: C-08. A-02. La query de casos sigue pidiendo `metricas`, `reto`, `estrategia`, `fases` y `testimonio` en la raíz.

### `scripts/sanity/write-service-plans.ts`

- Propósito: escribe la sección de precios de SEO (`servicePlans`) en el servicio publicado.
- Por qué está así: los planes no venían en el HTML de Webflow. Salen de `src/data/service-plans.ts`.
- Exporta: nada. CLI.
- Depende de: `src/data/service-plans.ts`.
- Lo usan: nadie en npm.
- Datos: `patch` del documento de servicio, con keys generadas.
- Escritura: dry-run hasta `--write`.
- Migración: parche one-shot de la misma migración a secciones.
- Hallazgos: C-08.

### `scripts/sanity/add-missing-service-sections.ts`

- Propósito: añade Por qué y Planes a los servicios que no los tenían, en la misma posición. Los precios quedan en «A cotizar».
- Por qué está así: un servicio de muestra tenía el bloque y el resto no. El schema exige el hueco, no el precio.
- Exporta: nada. CLI.
- Depende de: nada del grafo.
- Lo usan: nadie en npm.
- Datos: `patch` de `sections`.
- Escritura: dry-run hasta `--write`.
- Migración: parche one-shot.
- Hallazgos: C-08.

### `scripts/sanity/fill-service-section-controls.ts`

- Propósito: rellena focus, why, industrias, proceso, casos y CTA editables dentro de las secciones ya creadas.
- Por qué está así: el pase a `sections[]` dejó títulos vacíos. Los controles salen de `src/data/service-focus.ts` y del documento.
- Exporta: nada. CLI.
- Depende de: `src/data/service-focus.ts`.
- Lo usan: nadie en npm.
- Datos: `patch` de `sections`.
- Escritura: dry-run hasta `--write`.
- Migración: parche one-shot.
- Hallazgos: C-08.

### `scripts/sanity/fill-industry-bullets.ts`

- Propósito: copia los bullets que la card de industria ya mostraba a la sección de servicios.
- Por qué está así: `serviceBlurb` puede llevar texto propio. Sin este pase la card quedaba vacía al dejar de leer el campo plano.
- Exporta: nada. CLI.
- Depende de: nada del grafo.
- Lo usan: nadie en npm.
- Datos: `patch` de `sections`.
- Escritura: dry-run hasta `--write`.
- Migración: parche one-shot.
- Hallazgos: C-08.

### `scripts/sanity/unset-service-legacy-fields.ts`

- Propósito: borra del documento de servicio los campos que el schema ya no declara.
- Por qué está así: GROQ sigue devolviendo un campo aunque el formulario no lo muestre. Hasta que la query deje de pedirlo, el dato viejo sigue pintando (C-02). Este script lo quita del Content Lake.
- Exporta: nada. CLI.
- Depende de: nada del grafo.
- Lo usan: nadie en npm.
- Datos: `patch().unset` de los campos presentes en cada documento.
- Escritura: dry-run hasta `--write`.
- Migración: parche one-shot. Borra datos.
- Hallazgos: C-08. C-02. La corrección de C-02 pide no borrar en el Content Lake hasta confirmar que ningún publicado depende del campo raíz.

### `scripts/sanity/move-case-services.ts`

- Propósito: mueve las referencias `servicios` de la raíz del caso a la sección Contexto y quita `resultadoFrase`.
- Por qué está así: el schema guarda los servicios dentro de `caseContext`. `resultadoFrase` no está en el schema (A-06).
- Exporta: nada. CLI.
- Depende de: nada del grafo.
- Lo usan: nadie en npm.
- Datos: `patch` con `set({ sections })` y `unset(['servicios', 'resultadoFrase'])`.
- Escritura: dry-run hasta `--write`.
- Migración: parche one-shot.
- Hallazgos: A-06. C-08.

### `scripts/sanity/seed-authors.ts`

- Propósito: crea los autores del blog de Hiweb.
- Por qué está así: `post.author` es una referencia. Sin documentos `author`, la card cae al string `autor`.
- Exporta: nada. CLI.
- Depende de: nada del grafo.
- Lo usan: nadie en npm.
- Datos: transacción `createOrReplace` de cada autor.
- Escritura: dry-run hasta `--write`.
- Migración: semilla. No es Webflow. No es rutina: un segundo `--write` reemplaza la ficha.
- Hallazgos: ninguno de C-07. Sigue el patrón de dry-run.

### `scripts/sanity/seed-navigation.ts`

- Propósito: escribe los documentos `navigation` y `navigation-en` con el menú que antes estaba fijo en `SiteNav`.
- Por qué está así: el schema nuevo es `bar[]` de links y dropdowns con `columns`. Este script anida el menú viejo y hace `unset` de los campos sueltos.
- Exporta: nada. CLI.
- Depende de: `src/data/site.ts`, `src/lib/locale.ts`.
- Lo usan: nadie en npm.
- Datos: `patch` del publicado y, si existe, del draft. Quita `LOOSE_FIELDS`.
- Escritura: dry-run hasta `--write`.
- Migración: one-shot del navbar. Repetirlo reescribe el menú editado en Studio.
- Hallazgos: A-03. La query todavía pide esos campos sueltos. El script los borra del documento.

### `scripts/sanity/align-en-slugs.mjs`

- Propósito: apunta los servicios en inglés a los slugs públicos de hiwebmarketing.com/en.
- Por qué está así: el clon EN nació con el slug español. Las rutas `/en/servicios/...` ya estaban publicadas con otro slug, y `astro.config.mjs` redirige seis de los viejos.
- Exporta: nada. CLI.
- Depende de: nada del grafo.
- Lo usan: nadie en npm.
- Datos: `createOrReplace` del documento EN con el slug nuevo.
- Escritura: dry-run hasta `--write`.
- Migración: one-shot de slugs. Solo si un slug EN concreto está mal y se revisó.
- Hallazgos: C-08. `createOrReplace` sustituye el documento, no solo el slug.

### `scripts/sanity/seed-contact-page.mjs`

- Propósito: publica el documento `contactPage` que el desk muestra en Páginas.
- Por qué está así: el formulario necesitaba un singleton con campos, servicios y presupuestos antes de que el editor lo rellenara.
- Exporta: nada. CLI.
- Depende de: nada del grafo.
- Lo usan: nadie en npm. `node scripts/sanity/seed-contact-page.mjs`.
- Datos: `createOrReplace` de `contactPage` (español). No toca `contactPage-en`.
- Escritura: escribe siempre. No mira `--write`.
- Migración: semilla de contacto. No es el scrape de Webflow. Cada ejecución publica encima del español.
- Hallazgos: C-07. C-05. Aunque el documento exista, la página `/contacto` puede no salir al sitio si sigue el redirect de B-04.

### `scripts/sanity/register-worker-webhook.mjs`

- Propósito: crea el webhook de Sanity que pega al Worker y, si hace falta, un token viewer.
- Por qué está así: el publish tiene que encolar un rebuild. El archivo mismo dice que no se vuelva a correr: un segundo run crea otro hook y otro secreto.
- Exporta: nada. CLI.
- Depende de: nada del grafo.
- Lo usan: nadie.
- Datos: escribe `.sanity-revalidate.secret` en disco, puede hacer `POST` a la API de tokens del proyecto `fxardjr1`, crea el webhook y sube el secreto al Worker con Wrangler.
- Escritura: escribe siempre. No mira `--write`.
- Migración: alta única de infraestructura. No es Webflow.
- Hallazgos: C-07. A-13 describe el efecto: el webhook no despliega al momento, encola en D1. A-07. Si el cron no tiene deploy hook, el respaldo apunta a otro repo de GitHub.

## `integrations/sanity-redirects.mjs`

### `integrations/sanity-redirects.mjs`

- Propósito: en el build, mezcla los `redirect` publicados de Sanity con los redirects fijos de `astro.config.mjs`.
- Por qué está así: un redirect editado en Studio no puede ser un reload del Worker. Entra cuando Astro vuelve a generar el sitio. Si el fetch falla, se quedan solo los redirects del config.
- Exporta: `sanityRedirects`.
- Depende de: nada del grafo. Hace `fetch` a `https://fxardjr1.api.sanity.io/v2026-09-18/data/query/web-2026` con la query `*[_type == "redirect" && defined(from) && defined(to)]{ from, to }`. Sin token: solo publicados y dataset público.
- Lo usan: `astro.config.mjs` (`integrations`).
- Datos: acepta rutas que empiezan por `/`, rechaza `//` y rechaza `from === to`. El extra pisa la clave si ya existía en `config.redirects`.
- Escritura: no escribe en Sanity. Escribe la tabla de redirects del build.
- Migración: no. Corre en cada `astro build`.
- Hallazgos: B-04. La query devuelve `/contacto` → `/calendario` (y un redirect de un post EN). El build registra `contacto/index.html` con cuerpo vacío. `/contact` en el config apunta a `/contacto`, así que las dos URLs salen del sitio. El schema de `redirect` avisa que entra en el próximo deploy, y no avisa si `from` ya es una página.

## `migrations/d1`

Un binding `DATABASE` y dos bases: live `hiweb-marketing-quiz-calendar` y staging `hiweb-marketing-quiz-calendar-staging` (`wrangler.jsonc`). No comparten filas. `migrations_dir` es esta carpeta. El orden es el prefijo numérico.

### `migrations/d1/0001_quiz_calendar.sql`

- Propósito: tablas del diagnóstico y de las citas.
- Por qué está así: quiz y calendario comparten el binding y no comparten tablas. El formulario de contacto no entra aquí.
- Exporta: DDL.
- Depende de: nada.
- Lo usan: Wrangler al aplicar migraciones. El código lee estas tablas desde `src/lib/growth`.
- Datos: `quiz_sessions` (paso y respuestas JSON), `quiz_leads` (nombre, empresa, email, teléfono, web, industria, puntaje, nivel, servicios recomendados, `pending_sync`) y `calendar_bookings` (servicio, fecha, hora, `status` default `confirmed`). Índices por `updated_at`, email y fecha.
- Escritura: aplica el esquema una vez por base. No es dry-run. No toca Sanity.
- Migración: esquema inicial. No es Webflow.
- Hallazgos: A-13 usa otra tabla, la de `0004`. G-01 y G-02 están en la auditoría de seguridad, no en estos dos informes.

### `migrations/d1/0002_calendar_slot_unique.sql`

- Propósito: un solo booking confirmado por fecha y hora.
- Por qué está así: dos reservas podían quedar `confirmed` en el mismo slot. El índice único parcial lo impide sin bloquear filas canceladas.
- Exporta: DDL.
- Depende de: `0001` (`calendar_bookings`).
- Lo usan: el insert de `createBooking`.
- Datos: `idx_calendar_bookings_confirmed_slot` sobre `(selected_date, selected_time)` donde `status = 'confirmed'`.
- Escritura: aplica el índice. No es dry-run.
- Migración: no es Webflow.
- Hallazgos: ninguno de 01 ni de 06.

### `migrations/d1/0003_calendar_booking_website.sql`

- Propósito: columna `website` en `calendar_bookings`.
- Por qué está así: el formulario de la cita ganó el campo sitio web después de la tabla inicial. `quiz_leads` ya lo tenía.
- Exporta: DDL.
- Depende de: `0001`.
- Lo usan: el insert de la reserva.
- Datos: `ALTER TABLE calendar_bookings ADD COLUMN website TEXT`.
- Escritura: aplica la columna. No es dry-run.
- Migración: no es Webflow.
- Hallazgos: el schema `calendarPage` tiene `kind: website` en los campos de copy. Esta columna es el dato de la reserva, no el label.

### `migrations/d1/0004_rebuild_requests.sql`

- Propósito: cola de un rebuild pendiente.
- Por qué está así: el webhook de Sanity no llama al deploy hook en el mismo request. Inserta una fila. El cron de live la lee cuando ya pasaron unos minutos.
- Exporta: DDL.
- Depende de: nada de las tablas anteriores. Mismo binding.
- Lo usan: `src/pages/api/sanity-webhook.ts` y `src/lib/rebuild/queue.ts`, vía el cron de `src/worker.ts`.
- Datos: `rebuild_requests` con `id` (la fila práctica es `pending`) y `requested_at`.
- Escritura: aplica la tabla. No es dry-run. No toca Sanity.
- Migración: no es Webflow.
- Hallazgos: A-13. El cron corre cada minuto y no dispara hasta unos 10 minutos después del último publish. Staging tiene la lista de crons vacía. A-07. Si no hay `CLOUDFLARE_DEPLOY_HOOK_URL`, el dispatch de respaldo usa por defecto `jahirgosu/hiweb-marketing-ui`, no `hiwebapps/hiweb-marketing-ui`.
