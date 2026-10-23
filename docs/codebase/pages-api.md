`src/pages/api` son nueve endpoints de Worker. Todos exportan `prerender = false`: leen la petición, D1, cookies o bindings, y el build de live no los hornea. El grafo los deja en «Lo usan: —» porque ningún módulo los importa; quien entra es la URL. Calendario y diagnóstico los llama el navegador a través de `src/lib/growth/calendar/client.ts` y `src/lib/growth/quiz/client.ts`. Draft mode lo abre el preview de Sanity en staging y lo cierra `ClearStaleDraftMode`. `POST /api/sanity-webhook` encola un rebuild; el cron de `wrangler.jsonc` es el que dispara el deploy unos diez minutos después del último publish, y staging no despacha. `GET /api/rebuild-status` lo consulta el navbar del Studio. El middleware de staging exige Basic Auth en el resto del sitio y deja pasar `/api/draft-mode/enable` y `/api/draft-mode/disable` sin esa contraseña.

### `src/pages/api/calendar/availability.ts`
- Propósito: Devuelve los huecos de un día para el calendario.
- Por qué está así: `prerender = false`. Es un `GET` público: no mira cookie ni bearer. La fecha tiene que llegar en el query.
- Exporta: `prerender = false` y `GET`. La ruta es `/api/calendar/availability`.
- Depende de: `getAvailabilityForDate` de `src/lib/growth/calendar/availability.ts`, `getServiceLabel` de `src/lib/growth/calendar/calendar-rules.ts`, `jsonError` de `src/lib/growth/api/response.ts`, `AppError` de `src/lib/growth/shared/errors.ts`.
- Lo usan: la URL `/api/calendar/availability`. `fetchAvailability` en `src/lib/growth/calendar/client.ts` la llama desde `CalendarTool` y solo manda `date`.
- Datos: query `date` obligatorio, formato `YYYY-MM-DD`; si falta o no cumple, `AppError` 400 `INVALID_DATE`. Query `service` opcional: si viene, la respuesta pone `getServiceLabel(service)`; si no, `service` es `''`. El cuerpo es `{ date, service, slots }` con el resultado de `getAvailabilityForDate(date)`. Los errores salen por `jsonError`.
- Hallazgos: G-01.

### `src/pages/api/calendar/book.ts`
- Propósito: Crea una reserva y avisa a n8n de `calendar.booked`.
- Por qué está así: `prerender = false`. El `POST` espera el JSON de la cita y la respuesta del webhook antes de contestar. Si n8n falla, el `catch` lo deja en `console.error` y la reserva igual se devuelve.
- Exporta: `prerender = false` y `POST`. La ruta es `/api/calendar/book`.
- Depende de: `createBooking` de `src/lib/growth/calendar/booking.ts`, el tipo `BookingInput`, `dispatchCalendarWebhook` de `src/lib/growth/n8n/client.ts`, `buildCalendarN8nPayload` de `src/lib/growth/n8n/payloads.ts`, `jsonError`.
- Lo usan: la URL `/api/calendar/book`. `bookAppointment` en `src/lib/growth/calendar/client.ts`, llamado por `CalendarTool`.
- Datos: el cuerpo se castea a `BookingInput` y entra a `createBooking`. La respuesta es `{ booking }` con el registro que devuelve esa función. No hay tope de uso en este archivo.
- Hallazgos: G-02, G-04.

### `src/pages/api/calendar/cancel.ts`
- Propósito: Cancela una reserva por id y avisa a n8n de `calendar.cancelled`.
- Por qué está así: `prerender = false`. El `POST` solo exige el id. Si n8n falla, se registra el error y la respuesta sigue siendo la reserva ya cancelada.
- Exporta: `prerender = false` y `POST`. La ruta es `/api/calendar/cancel`.
- Depende de: `cancelBooking` de `src/lib/growth/db/calendar.ts`, `validateBookingId` de `src/lib/growth/calendar/validators.ts`, `dispatchCalendarWebhook`, `buildCalendarN8nPayload`, `jsonError`, `AppError`.
- Lo usan: la URL `/api/calendar/cancel`. `cancelAppointment` en `src/lib/growth/calendar/client.ts`, llamado por `CalendarTool`.
- Datos: cuerpo `{ bookingId?: string }`. `validateBookingId` comprueba que sea un UUID. Si `cancelBooking` no devuelve fila, `AppError` 404 `BOOKING_NOT_FOUND`. La respuesta es `{ booking }` con el registro completo.
- Hallazgos: G-04.

### `src/pages/api/quiz/session.ts`
- Propósito: Crea o actualiza la sesión del diagnóstico mientras la persona responde.
- Por qué está así: `prerender = false`. Solo hay `POST`. Si D1 no guarda la fila, la ruta sigue y marca `ephemeral: true` para no cortar el quiz.
- Exporta: `prerender = false` y `POST`. La ruta es `/api/quiz/session`.
- Depende de: `QUIZ_TOTAL_STEPS` de `src/lib/growth/quiz/questions.ts`, el tipo `QuizAnswers`, `sanitizeSessionId` de `src/lib/growth/quiz/validators.ts`, `createQuizSession`, `getQuizSession` y `updateQuizSession` de `src/lib/growth/db/quiz.ts`, `jsonError`, `createId` de `src/lib/growth/shared/utils.ts`.
- Lo usan: la URL `/api/quiz/session`. `createQuizSession` y `updateQuizSession` de `src/lib/growth/quiz/client.ts`. El alta la dispara `startQuizSession` (`src/lib/growth/quiz/session.ts`) desde `MarketingQuiz`; el update lo llama el propio quiz.
- Datos: cuerpo con `action` (`create` o `update`), `sessionId`, `questionId`, `optionId`, `answers` y `currentStep`. Si no viene `action`, hay `sessionId` implica `update` y si no, `create`. En `create`, D1 devuelve `{ sessionId, currentStep, totalSteps, answers }`. Si `createQuizSession` no devuelve fila, la respuesta usa `createId()`, paso 0, `answers: {}` y `ephemeral: true`. En `update`, si la sesión existe, fusiona la respuesta (`questionId` + `optionId`, o el objeto `answers`) y persiste el paso. Si no existe, devuelve el mismo shape en memoria con `ephemeral: true`. `totalSteps` es `QUIZ_TOTAL_STEPS`.
- Hallazgos: G-02.

### `src/pages/api/quiz/submit.ts`
- Propósito: Cierra el diagnóstico: valida lead y respuestas, puntúa, guarda el lead, borra la sesión y avisa a n8n.
- Por qué está así: `prerender = false`. No comprueba que la sesión exista. `dispatchQuizWebhook` se llama sin `await` y sin `waitUntil`.
- Exporta: `prerender = false` y `POST`. La ruta es `/api/quiz/submit`.
- Depende de: `calculateQuizScore` de `src/lib/growth/quiz/scoring.ts`, tipos `QuizAnswers` y `QuizLeadInput`, `sanitizeSessionId`, `validateQuizAnswers`, `validateQuizLead`, `deleteQuizSession` e `insertQuizLead` de `src/lib/growth/db/quiz.ts`, `dispatchQuizWebhook`, `buildQuizN8nPayload`, `jsonError`, `AppError`.
- Lo usan: la URL `/api/quiz/submit`. `submitQuiz` en `src/lib/growth/quiz/client.ts`, llamado por `MarketingQuiz`.
- Datos: hacen falta `lead` y `answers`; si falta uno, 400 `INVALID_BODY`. `sessionId` es opcional. Tras validar, `calculateQuizScore` arma el resultado e `insertQuizLead` guarda. Si no hay `leadId`, 503 `STORAGE_UNAVAILABLE`. Con sesión, `deleteQuizSession` corre antes del webhook. La respuesta es `{ leadId, result }`.
- Hallazgos: G-02, G-07.

### `src/pages/api/draft-mode/enable.ts`
- Propósito: Enciende el preview de Presentation en staging. Valida el secreto de la URL de Sanity, firma la cookie de acceso y guarda la perspectiva.
- Por qué está así: `prerender = false`. Fuera de staging (`isStagingSite()` falso) responde 404. Hace falta `SANITY_API_READ_TOKEN` y `STAGING_PASSWORD`; si falta uno, 500 con el texto «Staging no tiene credenciales de preview.». `validatePreviewUrl` tiene que devolver `isValid`; si no, 401 `Invalid secret`. El redirect es el `redirectTo` de esa validación, o `/`, con 307.
- Exporta: `prerender = false` y `GET`. La ruta es `/api/draft-mode/enable`.
- Depende de: `createClient` de `@sanity/client`, `validatePreviewUrl` y `perspectiveCookieName` de `@sanity/preview-url-secret`, `PREVIEW_ACCESS_COOKIE`, `PREVIEW_ACCESS_MAX_AGE` y `signPreviewAccess` de `src/lib/preview-auth.ts`, `readBinding` de `src/lib/runtime-env.ts`, `isStagingSite` de `src/lib/site-env.ts`, y `SANITY_API_VERSION`, `SANITY_DATASET`, `SANITY_PROJECT_ID` de `src/sanity/client.ts`.
- Lo usan: la URL `/api/draft-mode/enable`. El middleware la excluye del Basic Auth de staging. No hay un `fetch` a esta ruta dentro de `src/`.
- Datos: el cliente de Sanity se crea con el token de lectura, `useCdn: false` y perspectiva `published`, solo para validar la URL. La cookie de perspectiva (`perspectiveCookieName`) no es HttpOnly y vale `studioPreviewPerspective` o `drafts`. La cookie `hiweb_preview` es HttpOnly, firmada con `signPreviewAccess(password)` y `maxAge` de `PREVIEW_ACCESS_MAX_AGE`. En HTTPS ambas usan `sameSite: 'none'` y `secure`; en HTTP, `sameSite: 'lax'` y `secure` falso. `path: '/'`.

### `src/pages/api/draft-mode/disable.ts`
- Propósito: Apaga el preview en staging. Borra la cookie de perspectiva y la de acceso.
- Por qué está así: `prerender = false`. Fuera de staging, 404. No comprueba la cookie ni la contraseña. Con `?silent=1` responde JSON `{ ok: true }` y `Cache-Control: no-store`. Sin eso, redirige 307 a `redirect` del query, o a `/` si el parámetro no viene. El destino no se recorta a una ruta del mismo host.
- Exporta: `prerender = false` y `GET`. La ruta es `/api/draft-mode/disable`.
- Depende de: `perspectiveCookieName`, `PREVIEW_ACCESS_COOKIE` de `src/lib/preview-auth.ts`, `isStagingSite`.
- Lo usan: la URL `/api/draft-mode/disable`. `ClearStaleDraftMode` hace `fetch('/api/draft-mode/disable?silent=1')` cuando la página de staging no está en un iframe y todavía hay cookie de perspectiva. El middleware también excluye esta ruta del Basic Auth.
- Datos: `clearCookie` pone `maxAge: 0`, hace `cookies.set` vacío y `cookies.delete`. La cookie de perspectiva sale con `httpOnly: false`; `hiweb_preview` con `httpOnly: true`. Misma regla de `sameSite` / `secure` que enable.
- Hallazgos: G-05.

### `src/pages/api/sanity-webhook.ts`
- Propósito: Recibe el publish de Sanity y deja una fila pendiente de rebuild. No llama al deploy hook en esta petición.
- Por qué está así: `prerender = false`. El comentario del archivo fija la auth en `Authorization: Bearer <SANITY_REVALIDATE_SECRET>` y el retraso de diez minutos en el cron de `wrangler.jsonc`. Staging, o un worker donde `canDispatchRebuild` es falso, responde 200 `{ ok: true, skipped: true }` y no escribe la cola.
- Exporta: `prerender = false`, `POST` y `GET`. La ruta es `/api/sanity-webhook`.
- Depende de: `env` de `cloudflare:workers`, `getD1` de `src/lib/growth/db/d1.ts`, `canDispatchRebuild` de `src/lib/rebuild/dispatch.ts`, `markRebuildRequested` de `src/lib/rebuild/queue.ts`.
- Lo usan: la URL `/api/sanity-webhook`. No hay fetch en `src/`: la llama el webhook configurado en Sanity. `GET` no pide secreto.
- Datos: sin `SANITY_REVALIDATE_SECRET`, 500 `{ ok: false, error: 'Missing SANITY_REVALIDATE_SECRET' }`. El bearer se compara con `!==`. Si el header no empieza por `Bearer `, se usa el header entero. Si no coincide, 401. Sin D1, 500 `Missing D1 database`. Si `markRebuildRequested` lanza, el 500 incluye `error.message`. El éxito es `{ ok: true, queued: true }`. `GET` devuelve `{ ok: true, service: 'sanity-rebuild-webhook' }`.
- Hallazgos: A-13, G-09.

### `src/pages/api/rebuild-status.ts`
- Propósito: Estado público de la cola de deploy, y un `POST` que dispara el deploy en el acto.
- Por qué está así: `prerender = false`. Lee bindings del Worker (`CLOUDFLARE_DEPLOY_HOOK_URL`, `GITHUB_DISPATCH_TOKEN`, `GITHUB_DISPATCH_REPO`, `PUBLIC_SITE_ENV`). CORS solo si el `Origin` es `https://hiweb-web.sanity.studio`, `http://localhost:3333` o `http://127.0.0.1:3333`. Esos orígenes reciben `Access-Control-Allow-Headers: Authorization, Content-Type` y métodos `GET, POST, OPTIONS`, sin credenciales. El comentario del archivo dice que el `GET` es público y que el `POST` acepta un token de sesión de Sanity del proyecto `fxardjr1`. Staging no despacha: `canDispatchRebuild` falso responde 409.
- Exporta: `prerender = false`, `OPTIONS`, `GET` y `POST`. La ruta es `/api/rebuild-status`.
- Depende de: `env` de `cloudflare:workers`, `getD1`, `canDispatchRebuild` y `dispatchRebuild` de `src/lib/rebuild/dispatch.ts`, `clearPendingRebuild`, `readRebuildStatus` y `restorePendingRebuild` de `src/lib/rebuild/queue.ts`.
- Lo usan: la URL `/api/rebuild-status`. `StudioNavbar` hace `GET` a `https://www.hiwebmarketing.com/api/rebuild-status`. En `src/` no hay un `fetch` del `POST`.
- Datos: `OPTIONS` responde 204. `GET` devuelve `{ queued, deployAt }` de `readRebuildStatus`. Sin D1, o si la lectura lanza, `{ queued: false, deployAt: null }` (500 en el catch; el mensaje se queda en `console.error`). `POST` exige `Authorization: Bearer <token>`. El token vale si `GET https://api.sanity.io/v2021-06-07/projects/fxardjr1` con ese bearer responde OK. Si no, 401. Si vale, borra la fila pendiente, llama a `dispatchRebuild` y, si el disparo falla, restaura la fila y responde 502 `Deploy hook failed`. El éxito es `{ ok: true, fired: true }`. Este `POST` no aplica el debounce de diez minutos del webhook.
- Hallazgos: G-03, G-09.
