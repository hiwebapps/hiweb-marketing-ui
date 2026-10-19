# 04. Seguridad

Auditoría de solo lectura del Worker público (`hiweb-marketing-ui`) y del de staging. No se modificó código, no se desplegó y no se volvió a ejecutar `npm audit`. Los números de línea corresponden al árbol revisado.

Alcance: webhook y cola de rebuild, draft mode, quiz, calendario, SQL de D1, credencial de Google, cliente n8n, middleware, cabeceras, CORS, límites de uso, variables `PUBLIC_*`, flujos de GitHub Actions y el audit ya corrido.

## Controles presentes

- **Webhook de Sanity.** `POST /api/sanity-webhook` rechaza la petición si falta `SANITY_REVALIDATE_SECRET` (500) o si el valor no coincide (401). El cuerpo no se interpreta: no hay forma de elegir un comando ni un repositorio desde el JSON. Staging no dispara deploy (`canDispatchRebuild` sale en falso si `PUBLIC_SITE_ENV === 'staging'`). La cola es una sola fila `pending`; un publish nuevo solo mueve `requested_at`. El cron borra esa fila con `DELETE ... AND requested_at = ?` y, si el deploy falla, la restaura con `ON CONFLICT DO NOTHING`, así un publish más nuevo no se pisa. El cron de staging está vacío.
- **Preview de staging.** `/api/draft-mode/enable` responde 404 fuera de staging y solo sigue si `validatePreviewUrl` devuelve `isValid`. La cookie `hiweb_preview` es HttpOnly, va firmada con HMAC-SHA-256 (WebCrypto `verify`) y caduca a las 12 horas. La cookie de perspectiva de Sanity no es la credencial.
- **Staging.** El middleware exige Basic Auth salvo las dos rutas de draft mode y una cookie de preview válida. Si faltan `STAGING_USER` o `STAGING_PASSWORD`, responde 500 y no abre el sitio.
- **SQL.** `d1Run`, `d1First` y `d1All` usan `prepare().bind(...)`. Las consultas de quiz, calendario y rebuild pasan ids, fechas y textos como parámetros. No hay concatenación de entrada de usuario en el SQL. El índice único parcial `idx_calendar_bookings_confirmed_slot` evita dos citas confirmadas en el mismo horario.
- **Google.** La clave se lee en el servidor con `GOOGLE_SERVICE_ACCOUNT_EMAIL` y `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (sin prefijo `PUBLIC_`). Esos módulos no los importa ningún componente con `client:*`. El token de acceso se cachea en memoria del isolate y no sale en las respuestas JSON. El scope pedido es `calendar.readonly`.
- **CORS.** Book, cancel, quiz, webhook y availability no envían `Access-Control-Allow-Origin`. Un `fetch` cross-origin con `application/json` no pasa el preflight. La única API con CORS es `rebuild-status`, y solo refleja orígenes de una lista fija, sin `Access-Control-Allow-Credentials`.
- **Secretos en el repo.** No aparecieron tokens `sk-`, claves `AIza`, PAT de GitHub ni bloques `BEGIN PRIVATE KEY` en `src/` ni en `scripts/`. Los scripts leen `SANITY_API_WRITE_TOKEN` / `SANITY_API_READ_TOKEN` desde el entorno. `.sanity-revalidate.secret` está en `.gitignore`. Las variables `PUBLIC_*` declaradas (`PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `PUBLIC_SITE_ENV`, `PUBLIC_SITE_INDEXABLE`, `PUBLIC_SITE_URL`) son datos de sitio, no credenciales.
- **CI.** Ningún workflow escucha `pull_request` ni `pull_request_target`. Un PR de un fork no despliega. Los secretos no se hacen `echo`; GitHub los enmascara al pasar por `${{ secrets.* }}`.

---

### G-01. Consultar disponibilidad puede cancelar citas confirmadas

- Severidad: Alta
- Archivo: `src/pages/api/calendar/availability.ts:9-18`; `src/lib/growth/calendar/availability.ts:40`; `src/lib/growth/calendar/reconcile-google.ts:8-31`; `src/lib/growth/calendar/google-calendar-api.ts:19-63`
- Evidencia: `GET /api/calendar/availability` no pide autenticación. Llama a `getAvailabilityForDate`, que siempre ejecuta `reconcileBookingsWithGoogleCalendar`. Esa función lista las reservas confirmadas del día y, por cada una, busca un evento en Google Calendar. Si la cuenta de servicio existe, el `events.list` responde OK y ningún `summary`/`description` contiene el id, `googleCalendarEventExistsForBooking` devuelve `false` y `cancelBooking` marca la cita como cancelada. Si no hay token o Google responde con error, la función devuelve `true` y no cancela: el efecto depende de que la credencial esté configurada y de que la búsqueda falle en encontrar el evento. El id de la reserva lo escribe n8n en la descripción del evento (`src/lib/growth/n8n/payloads.ts:75-90`); el Worker no crea el evento. Hay una ventana entre el `INSERT` y el evento, y cualquier fallo o retraso de esa búsqueda la cierra cancelando.
- Impacto: cualquiera en internet, con una fecha `YYYY-MM-DD`, puede borrar citas confirmadas de ese día. No hace falta adivinar el UUID. También dispara `freeBusy` y `events.list` con la cuenta de servicio en cada consulta.
- Corrección propuesta: sacar la reconciliación del GET público. Ejecutarla en un cron o en una ruta autenticada, y no cancelar cuando la búsqueda venga vacía por un evento aún no creado. Exigir una coincidencia estable (id guardado al crear el evento) y un margen posterior a `created_at`.
- Esfuerzo: medio

### G-02. Reserva, diagnóstico y sesión no tienen límite de uso

- Severidad: Alta
- Archivo: `src/pages/api/calendar/book.ts:10-24`; `src/pages/api/quiz/submit.ts:19-44`; `src/pages/api/quiz/session.ts:28-50`; `src/lib/growth/quiz/validators.ts:34-67`; `src/lib/growth/calendar/validators.ts:40-142`
- Evidencia: no hay rate limit, captcha ni tope de tamaño en el repositorio (`429`, Turnstile, hCaptcha y reCAPTCHA no aparecen en `src/`). `POST /api/calendar/book` valida formato y horario, inserta en D1 y llama a n8n con el email como `attendeeEmail` y un bloque de HubSpot. El índice único impide dos citas en el mismo slot, así que repetir el POST llena la agenda. `POST /api/quiz/submit` no exige que la sesión exista: con `lead` y `answers` válidos inserta un lead y dispara n8n. `POST /api/quiz/session` crea filas en `quiz_sessions` sin prueba de nada. Nombre, empresa, web, industria y teléfono no tienen longitud máxima (el teléfono solo exige un mínimo). El texto de Slack se arma con el nombre y el email sin escapar mrkdwn (`src/lib/growth/n8n/payloads.ts:36-71`).
- Impacto: un cliente que no sea el navegador (el CORS no frena a curl) puede ocupar todos los horarios, escribir leads y sesiones sin límite, y hacer que n8n envíe invitaciones de calendario o contactos de CRM a correos arbitrarios. Un nombre con formato de Slack puede mencionar canales si n8n publica `slack.text` tal cual.
- Corrección propuesta: límite por IP y por email en book, submit, session y availability (el binding de rate limiting de Workers o las reglas del WAF). Tope de caracteres en cada campo. Captcha en book y submit. Escapar el texto que va a Slack. Mantener el índice único, que ya cubre la carrera de doble reserva.
- Esfuerzo: medio

### G-03. Cualquier token que vea el proyecto Sanity puede desplegar producción

- Severidad: Alta
- Archivo: `src/pages/api/rebuild-status.ts:14-19`, `src/pages/api/rebuild-status.ts:64-96`; `src/lib/rebuild/dispatch.ts:8-42`
- Evidencia: `POST /api/rebuild-status` no usa `SANITY_REVALIDATE_SECRET`. Acepta un `Bearer` y lo considera válido si `GET https://api.sanity.io/v2021-06-07/projects/fxardjr1` responde OK. No comprueba rol ni un secreto de deploy. Si `canDispatchRebuild` es verdadero, borra la fila pendiente y llama a `dispatchRebuild` en el acto: `POST` al `CLOUDFLARE_DEPLOY_HOOK_URL` o, si no hay hook, `repository_dispatch` con `GITHUB_DISPATCH_TOKEN`. No hay debounce en este POST (el de 10 minutos solo aplica al webhook). CORS permite `https://hiweb-web.sanity.studio` y `http://localhost:3333` / `127.0.0.1:3333`. El webhook sí está bien cerrado: sin el secreto compartido no encola nada, y staging no despacha.
- Impacto: un token de sesión o un robot token con el que esa API de proyecto responda 2xx pasa a ser credencial de deploy del Worker de producción. Cada POST lanza un deploy nuevo (coste, carreras de publicación, volver a construir `master`). No inyecta código por sí mismo: el hook despliega lo que ya está en el repositorio o en el deploy hook.
- Corrección propuesta: exigir `SANITY_REVALIDATE_SECRET` o una lista de tokens de deploy, además de comprobar el proyecto. Opcional: comprobar que el token tiene rol de administrador. Aplicar el mismo debounce que al webhook y un límite de deploys por hora.
- Esfuerzo: bajo

### G-04. Cancelar una cita solo exige el UUID y devuelve datos personales

- Severidad: Media
- Archivo: `src/pages/api/calendar/cancel.ts:11-28`; `src/lib/growth/calendar/validators.ts:171-178`; `src/lib/growth/db/calendar.ts:123-131`
- Evidencia: `POST /api/calendar/cancel` toma `bookingId`, comprueba que sea un UUID y llama a `cancelBooking`. No pide email, cookie ni un token distinto del id. La respuesta es el registro completo (`name`, `email`, `phone`, `website`, empresa). `POST /api/calendar/book` ya devuelve ese mismo objeto al quien reservó (`book.ts:21`). El id no es enumerable (`crypto.randomUUID` en `src/lib/growth/shared/utils.ts:8-12`).
- Impacto: quien obtenga el id (respuesta, Slack, HubSpot, logs) cancela la cita y lee los datos de contacto. No hace falta la bandeja de la persona que reservó.
- Corrección propuesta: un token de cancelación distinto del id, de un solo uso, o exigir el email de la reserva. En la respuesta pública devolver solo id, fecha y estado.
- Esfuerzo: bajo

### G-05. Salir del draft mode en staging redirige a una URL arbitraria y no pide la contraseña

- Severidad: Media
- Archivo: `src/pages/api/draft-mode/disable.ts:24-40`; `src/middleware.ts:69-73`
- Evidencia: en staging, el middleware no aplica Basic Auth a `/api/draft-mode/enable` ni `/api/draft-mode/disable`. Enable sí exige un secreto de preview de Sanity válido y firma la cookie de acceso. Disable no exige ni la cookie ni la contraseña: borra `hiweb_preview` y la cookie de perspectiva. Con `?silent=1` responde JSON. Si no, hace `redirect(url.searchParams.get('redirect') || '/', 307)` sin comprobar que el destino sea del mismo origen. Enable redirige al `redirectTo` que devuelve `validatePreviewUrl` solo cuando `isValid` (`enable.ts:29-48`). En producción ambas rutas responden 404.
- Impacto: `https://staging.hiweb.com.mx/api/draft-mode/disable?redirect=https://ejemplo-ajeno` es un open redirect en un host de la marca, alcanzable sin la contraseña de staging. Sirve para phishing. La cookie de preview es HttpOnly y de host, así que el destino externo no se la lleva. `silent=1` solo permite a un sitio hacer que el navegador de un editor cierre el preview (CSRF de logout).
- Corrección propuesta: aceptar solo rutas relativas que empiecen por `/` y no por `//`. Mantener enable detrás de `validatePreviewUrl`.
- Esfuerzo: bajo

### G-06. El HTML público no envía CSP, HSTS, anti-clickjacking ni Permissions-Policy

- Severidad: Media
- Archivo: `src/middleware.ts:83-96`; `public/_headers:1-2`; `src/layouts/Layout.astro:72-119`; `wrangler.jsonc:11-22`
- Evidencia: lo que sí hay. `public/_headers` solo pone `X-Robots-Tag`. El middleware, cuando `shouldNoIndex` es verdadero (hoy `PUBLIC_SITE_INDEXABLE` es `false` en `wrangler.jsonc`), copia esa misma etiqueta. En staging añade `Content-Security-Policy: frame-ancestors ...` (self, el Studio y localhost) y borra `X-Frame-Options` para que Presentation pueda embeber. `Layout.astro` no declara CSP, referrer ni permissions; sí publica `<meta name="generator" content={Astro.generator}>` (línea 119). `wrangler.jsonc` no define cabeceras. Esta revisión no miró el dashboard de la zona Cloudflare: ahí podría existir HSTS u otras cabeceras que el repo no muestra.
- Impacto: en el Worker de producción (live) la respuesta SSR no lleva `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` ni `X-Content-Type-Options`. El sitio se puede embeber y un clickjacking puede apuntar al formulario de cita o al diagnóstico. Sin HSTS en el repo, un primer salto por HTTP depende de que la zona fuerce HTTPS. La CSP de staging solo limita ancestros de frame; no limita scripts.
- Corrección propuesta: en el middleware, para live y staging, enviar al menos `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` mínima (cámara, micrófono y geolocalización desactivados) y HSTS con `max-age` largo en HTTPS. En live, `Content-Security-Policy: frame-ancestors 'self'` (o `X-Frame-Options: DENY`). Dejar `frame-ancestors` amplio solo en staging. Quitar o restringir `generator` si no hace falta.
- Esfuerzo: bajo

### G-07. El secreto de n8n va en la query y el webhook sale aunque no haya secreto

- Severidad: Media
- Archivo: `src/lib/growth/n8n/client.ts:3-18`, `src/lib/growth/n8n/client.ts:33-50`, `src/lib/growth/n8n/client.ts:72-78`; `src/pages/api/quiz/submit.ts:43`
- Evidencia: `buildN8nWebhookUrl` añade `?secret=` si la URL aún no lo trae, y `sendN8nWebhook` repite el valor en `X-Webhook-Secret`. Si `N8N_WEBHOOK_SECRET` viene vacío, escribe un warning y hace el `POST` igual. Las URLs y el secreto salen de bindings de Worker (`N8N_WEBHOOK_QUIZ_URL`, `N8N_WEBHOOK_CALENDAR_URL`, `N8N_WEBHOOK_SECRET` en `src/lib/growth/shared/env.ts:25-32`), no del cliente. El calendario espera la respuesta (`book.ts:16`). El quiz no: `dispatchQuizWebhook` lanza el `fetch` con `void` y sin `waitUntil`, y `submit.ts:43` no lo espera. El comentario del propio cliente dice que en Workers hay que esperar la respuesta.
- Impacto: el secreto queda en la URL (logs del fetch, del proxy de n8n o un redirect). Si el secreto no está configurado, el webhook sigue saliendo y solo lo protege lo opaca que sea la URL. El diagnóstico puede responder 200 al usuario y perder el aviso a n8n porque el isolate termina al devolver la respuesta.
- Corrección propuesta: mandar el secreto solo en la cabecera. No llamar a n8n si el secreto falta. En el quiz, `await sendN8nWebhook` o `context.waitUntil(...)`.
- Esfuerzo: bajo

### G-08. npm audit ya corrido: 32 avisos, ninguno critical

- Severidad: Media
- Archivo: árbol de dependencias (evidencia aportada; no se reejecutó `npm audit`). `package.json` declara `sanity` y, en devDependencies, `wrangler`.
- Evidencia: 32 vulnerabilidades: 1 low, 14 moderate, 17 high, 0 critical. Las citadas: `undici` (DoS), vía `miniflare` / `@module-federation`, transitiva de `wrangler`; `svgo` 4.0.0–4.0.2 (high); `uuid` &lt; 11.1.1 vía `typeid-js` / `sanity` (moderate; el fix fuerza `sanity@5`). `wrangler` es dependencia de desarrollo y de CI, no el código que atiende book o el webhook. `svgo` entra en el pipeline de build. `uuid` puede acompañar a `sanity` dentro del Worker.
- Impacto: no es un fallo explotable por sí solo en las rutas públicas revisadas. El DoS de `undici` afecta a tooling (`wrangler` / `miniflare`) salvo que el bundle de runtime lo arrastre. El aviso de `uuid` queda en la cadena de Sanity hasta que se pueda subir de major. Conviene tratarlo como deuda, por debajo de G-01–G-03.
- Corrección propuesta: actualizar `wrangler` cuando el aviso de `undici` tenga parche sin bajar de la versión que ya usa el proyecto. Revisar el árbol de `svgo` con `npm ls svgo` y subir el paquete que lo fija. No forzar `sanity@5` solo por el `uuid` moderate sin una migración planificada.
- Esfuerzo: medio

### G-09. El estado del deploy es público y un error del webhook devuelve el mensaje interno

- Severidad: Baja
- Archivo: `src/pages/api/rebuild-status.ts:53-61`; `src/pages/api/sanity-webhook.ts:32-36`, `src/pages/api/sanity-webhook.ts:54-62`; `src/lib/rebuild/queue.ts:56-69`
- Evidencia: `GET /api/rebuild-status` no pide autenticación. Devuelve solo `{ queued, deployAt }` (o `{ queued: false, deployAt: null }` si no hay D1). No devuelve la URL del hook ni el token de GitHub. El comentario del archivo lo declara público. `GET /api/sanity-webhook` responde `{ ok: true, service: 'sanity-rebuild-webhook' }` sin secreto. Si `markRebuildRequested` lanza, el 500 incluye `error.message`. La comparación del bearer es `!==`, no de tiempo constante; con un secreto largo y por red, eso no es práctico. El bearer también se acepta si el header trae el secreto pelado, sin el prefijo `Bearer `.
- Impacto: se ve si hay un deploy encolado y a qué hora saldría. Un fallo de D1 puede filtrar texto del driver al cliente del webhook. No da capacidad de desplegar (eso está en G-03 y en el secreto del webhook).
- Corrección propuesta: dejar el GET de estado solo para los orígenes del Studio, o detrás del mismo bearer del webhook. En el 500 del webhook devolver un código fijo, como ya hace `jsonError`. Comparar el secreto con `crypto.subtle` o un compare de longitud fija, y exigir el prefijo `Bearer `.
- Esfuerzo: bajo

### G-10. Los workflows no fijan permisos del GITHUB_TOKEN ni el SHA de las acciones

- Severidad: Baja
- Archivo: `.github/workflows/deploy-worker.yml:5-33`; `.github/workflows/deploy-staging.yml:5-36`
- Evidencia: `deploy-worker.yml` solo corre en `workflow_dispatch` y `repository_dispatch` (`sanity-rebuild`). `deploy-staging.yml` solo en `workflow_dispatch` y `push` a `master`. No hay `pull_request` ni `pull_request_target`: un fork no dispara el deploy ni recibe estos secretos. No hay un paso que imprima `secrets`. `SANITY_API_READ_TOKEN` entra como variable de entorno del `npm run build`; `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` entran a `cloudflare/wrangler-action@v3`. Ningún job declara `permissions:`. Las acciones están en tag mayor (`actions/checkout@v5`, `actions/setup-node@v5`, `cloudflare/wrangler-action@v3`), no en SHA. No hay environment con revisores. `repository_dispatch` lo puede enviar quien tenga el `GITHUB_DISPATCH_TOKEN` del Worker (es el camino previsto del webhook, no un fork).
- Impacto: el token por defecto del job queda en el valor que tenga el repositorio (a veces `contents: write`). Una acción comprometida en ese tag podría usar ese token durante el build, donde también está el token de lectura de Sanity y, en el paso de Wrangler, el token de Cloudflare. Un PR externo no llega a ese punto.
- Corrección propuesta: `permissions: contents: read` en ambos jobs. Fijar las tres acciones a un SHA. Opcional: environment protegido en el deploy de producción.
- Esfuerzo: bajo

## Notas de higiene (sin hallazgo propio)

- **Cuenta de Google.** Carga en `getServerEnv` → `getGoogleServiceAccountConfig` (`src/lib/growth/google/service-account-auth.ts:65-75`). El intercambio de token va a `https://oauth2.googleapis.com/token`. Un fallo hace `console.error` del cuerpo de Google (`líneas 110-116`); eso queda en logs del Worker, no en el JSON al navegador, y no registra la clave PEM. El grafo de cliente (`CalendarTool.tsx` y el resto de islas) no importa este módulo. `CLOUDFLARE_DEPLOY_HOOK_URL`, `GITHUB_DISPATCH_TOKEN` y `SANITY_REVALIDATE_SECRET` se referencian en rutas de API, pero los workflows de build no los pasan: en runtime mandan los secrets del Worker. Excepción: `SANITY_API_READ_TOKEN` sí se pasa al `npm run build` y `src/sanity/client.ts:30` lo lee con `import.meta.env.SANITY_API_READ_TOKEN`. Eso lo incrusta en el bundle de servidor, no en una isla (ningún `.tsx` importa `src/sanity/client.ts`; `src/lib/content/index.ts` solo lo usa desde páginas `.astro`). Sigue siendo un token de viewer dentro del script desplegado. Conviene leerlo solo con `cloudflare:workers` en runtime, como ya hace `readBinding` en staging.
- **Comparación de la contraseña de staging.** `credentialsMatch` en `src/middleware.ts:37` usa `===`. Mismo criterio que el bearer del webhook: poco práctico por red, y la cookie de preview sí usa `crypto.subtle.verify`.
- **`src/lib/preview-context.ts`.** Solo guarda la perspectiva en `AsyncLocalStorage` durante el request. No autentica.
