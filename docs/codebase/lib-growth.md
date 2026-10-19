# `src/lib/growth`

Calendario de citas y diagnóstico de marketing. Los dos escriben en el binding D1 `DATABASE` y, si hay URL, avisan a n8n. El calendario además lee Google Calendar con una cuenta de servicio de solo lectura. Nada de esta carpeta se prerenderiza: lo llaman las rutas `src/pages/api/calendar/*` y `src/pages/api/quiz/*`, y las islas `CalendarTool` y `MarketingQuiz`.

El mismo `DATABASE` lo usa la cola de rebuild (`src/lib/rebuild`). Las tablas salen de `migrations/d1/`: `quiz_sessions`, `quiz_leads`, `calendar_bookings` (más el índice único del slot confirmado y la columna `website`) y, en otra migración, `rebuild_requests`.

## Flujo de una reserva

`CalendarTool` pide el copy a `getCalendarPage` y los huecos a `fetchAvailability` (`GET /api/calendar/availability`). Esa ruta llama a `getAvailabilityForDate`: si el día es hábil, `reconcileBookingsWithGoogleCalendar` recorre las citas confirmadas del día en D1 y cancela las cuyo id no aparece en `events.list`; después se cruzan los horarios ocupados de D1, los de `freeBusy` y los slots ya pasados en `America/Mexico_City`. Al confirmar, `bookAppointment` hace `POST /api/calendar/book`, que valida con `validateBookingInput`, inserta en `calendar_bookings` y espera `dispatchCalendarWebhook` (`calendar.booked`, con bloque de calendario y de HubSpot). Cancelar es `POST /api/calendar/cancel`: basta el UUID. El Worker no crea el evento de Google; el id que la reconciliación busca lo escribe n8n en la descripción, si el webhook está configurado.

## Flujo del diagnóstico

`MarketingQuiz` llama a `startQuizSession`, que intenta `POST /api/quiz/session` con `action: create` y, si esa llamada falla, guarda un id local. Cada respuesta vuelve a esa ruta con `action: update`. Al terminar, `submitQuiz` hace `POST /api/quiz/submit`: valida lead y las ocho respuestas, calcula el puntaje, inserta en `quiz_leads`, borra la sesión si el id era válido y dispara `dispatchQuizWebhook` sin esperarlo. El submit no exige que la sesión exista en D1. El resultado que ve la persona sale en el JSON; `result-storage.ts` sabe guardarlo en `sessionStorage`, y ningún componente lo importa.

## Fichas

### `src/lib/growth/api/response.ts`

- Propósito: convierte un error de las rutas de calendario y quiz en JSON `{ error, code }` con status.
- Por qué está así: los validadores lanzan `AppError` y las rutas solo hacen `return jsonError(error)`. Un 500 no devuelve el mensaje interno.
- Exporta: `jsonError`.
- Depende de: `shared/errors.ts` (`isAppError`).
- Lo usan: `src/pages/api/calendar/availability.ts`, `book.ts`, `cancel.ts`, `src/pages/api/quiz/session.ts`, `submit.ts`.
- Datos: `AppError` conserva su status y su `code`. El mensaje `SESSION_NOT_FOUND` (lo lanza `updateQuizSession`) sale como 404. Cualquier otra cosa se registra con `console.error` y responde 500 `INTERNAL_ERROR`.
- Hallazgos: —

### `src/lib/growth/calendar/types.ts`

- Propósito: contratos compartidos por la isla, la API y D1.
- Por qué está así: el cliente y el Worker tienen que mandar el mismo cuerpo. El servicio se guarda dos veces: ids (`services`) y etiquetas unidas por coma (`service`), porque la fila de D1 tiene una sola columna de texto.
- Exporta: `BookingStatus`, `CalendarServiceOption`, `TimeSlot`, `AvailabilityResponse`, `BookingInput`, `BookingRecord`, `BookResponse`.
- Depende de: nada.
- Lo usan: `CalendarTool.tsx`, `calendar-page.ts`, `availability.ts`, `booking.ts`, `calendar-rules.ts`, `client.ts`, `services.ts`, `validators.ts`, `db/calendar.ts`, `n8n/payloads.ts`, `src/pages/api/calendar/book.ts`.
- Datos: status `confirmed` o `cancelled`. `CalendarServiceOption.asksForWebsite` obliga el campo de URL. `BookingInput.locale` es `es` o `en` y solo afecta los mensajes de validación.
- Hallazgos: —

### `src/lib/growth/calendar/calendar-rules.ts`

- Propósito: reglas de agenda que comparten la isla y el servidor: zona, horario, horizonte y el formato de las fechas que ve n8n.
- Por qué está así: el copy de Sanity puede cambiar etiquetas; el horario no sale del CMS. Las fechas hacia Google llevan offset fijo `-06:00` porque Ciudad de México no usa horario de verano desde 2022. `CALENDAR_SERVICES` es un catálogo viejo de cinco ids (`consulting`, `seo-audit`, …) que `getServiceLabel` todavía traduce; la oferta actual la carga `services.ts`.
- Exporta: `CALENDAR_SERVICES`, `BOOKING_TIMEZONE`, `SLOT_START_HOUR` (9), `SLOT_END_HOUR` (17), `SLOT_INTERVAL_MINUTES` (30), `TIME_LIST_VISIBLE_SLOTS` (8), `BOOKING_HORIZON_DAYS` (21), `ALL_SLOT_TIMES`, `WEEKDAY_LABELS_SHORT`, `CalendarMonthCell`, `getServiceLabel`, `serviceRequiresWebsite`, `isWeekday`, `formatDateIso`, `parseDateIso`, `getTodayAtNoon`, `isBookableDate`, `getBookableDates`, `getMonthCells`, `formatMonthYear`, `formatTime12h`, `buildBookingStartIso`, `buildBookingEndIso`, `splitPersonName`, `formatScheduleSummary`, `getBookableMonthBounds`, `canNavigateMonth`.
- Depende de: `types.ts`.
- Lo usan: `CalendarTool.tsx`, `availability.ts`, `booking-time.ts`, `google-busy.ts`, `google-calendar-api.ts`, `validators.ts`, `db/calendar.ts`, `n8n/payloads.ts`, `src/pages/api/calendar/availability.ts`.
- Datos: slots de 09:00 a 16:30 inclusive, lunes a viernes, 21 días hacia adelante. `isBookableDate` y `getTodayAtNoon` usan el reloj local del proceso (`new Date()`). En el Worker ese reloj es UTC. El «slot ya pasó» lo decide `booking-time.ts` en `America/Mexico_City`. `serviceRequiresWebsite` respeta el booleano y, si no viene, busca la subcadena `web` en id o label. `getServiceLabel` devuelve el texto original cuando no está en `CALENDAR_SERVICES`.
- Hallazgos: —

### `src/lib/growth/calendar/booking-time.ts`

- Propósito: partes de «ahora» en `America/Mexico_City` para marcar slots pasados.
- Por qué está así: `Date#getHours()` seguiría la zona del isolate. El formateador `en-US` con `hour12: false` fija año, mes, día, hora y minuto en la zona de la cita.
- Exporta: `getBookingNowParts`.
- Depende de: `calendar-rules.ts` (`BOOKING_TIMEZONE`).
- Lo usan: `availability.ts`.
- Datos: devuelve `dateIso` `YYYY-MM-DD`, `hour` y `minute`.
- Hallazgos: —

### `src/lib/growth/calendar/services.ts`

- Propósito: catálogo que la validación acepta al reservar.
- Por qué está así: los ids vivos están en el documento de calendario (ES y EN), no en `CALENDAR_SERVICES`. Se piden los dos idiomas y se unen para que un id inglés sea válido aunque el POST no mande locale de catálogo.
- Exporta: `loadCalendarServices`.
- Depende de: `src/data/site.ts` (`NAV_SERVICES`), `src/lib/content` (`getCalendarPage`), `types.ts`.
- Lo usan: `validators.ts`.
- Datos: clave única `id + label`. Si las dos páginas fallan o vienen sin servicios, el respaldo es `NAV_SERVICES`; el slug que contiene `web` marca `asksForWebsite`.
- Hallazgos: —

### `src/lib/growth/calendar/validators.ts`

- Propósito: normaliza el POST de reserva y el id de cancelación. Rechaza con `AppError` y un `code`.
- Por qué está así: el índice único de D1 cubre la carrera de dos citas en el mismo slot; esta capa cubre forma, catálogo, día hábil y hueco. Los mensajes salen en el `locale` del cuerpo.
- Exporta: `validateBookingInput`, `validateBookingId`.
- Depende de: `calendar-rules.ts`, `services.ts`, `availability.ts`, `types.ts`, `shared/errors.ts`.
- Lo usan: `booking.ts` (`validateBookingInput`), `src/pages/api/calendar/cancel.ts` (`validateBookingId`).
- Datos: nombre con al menos 2 caracteres, email con un regex simple y en minúsculas, teléfono con al menos 7 caracteres, fecha `YYYY-MM-DD`, hora `HH:MM`. El servicio tiene que existir en el catálogo unido. Varios servicios se guardan como ids y como labels unidos por coma. Website obligatorio si algún servicio lo pide; se antepone `https://` si falta el esquema. `validateBookingId` exige 36 caracteres hex y guiones. No hay tope de longitud ni límite de intentos.
- Hallazgos: G-02, G-04 (`validateBookingId` es la única comprobación de la cancelación).

### `src/lib/growth/calendar/availability.ts`

- Propósito: lista los slots de un día y dice si uno sigue libre.
- Por qué está así: la isla no calcula ocupación. El GET público es también el momento en que el servidor compara D1 con Google, porque no hay otro cron de calendario.
- Exporta: `getAvailabilityForDate`, `isSlotAvailable`.
- Depende de: `calendar-rules.ts`, `booking-time.ts`, `google-busy.ts`, `reconcile-google.ts`, `db/calendar.ts`, `types.ts`.
- Lo usan: `booking.ts` y `validators.ts` (`isSlotAvailable`), `src/pages/api/calendar/availability.ts`.
- Datos: fin de semana → lista vacía. En un hábil, primero la reconciliación, luego en paralelo los horarios confirmados de D1 y los de `freeBusy`. Un slot es `available` si no está en ese set y su inicio es posterior a «ahora» en Ciudad de México. `isSlotAvailable` vuelve a pedir el día entero.
- Hallazgos: G-01 (la reconciliación corre dentro de este GET).

### `src/lib/growth/calendar/booking.ts`

- Propósito: valida e inserta una cita. No llama a n8n; eso lo hace `book.ts` después de recibir el registro.
- Por qué está así: si el `INSERT` choca con el índice único, hay que distinguir «ese hueco ya se fue» de «D1 no está».
- Exporta: `createBooking`.
- Depende de: `validators.ts`, `availability.ts`, `db/calendar.ts`, `types.ts`, `shared/errors.ts`.
- Lo usan: `src/pages/api/calendar/book.ts`.
- Datos: `insertBooking` null y slot ya no libre → 409 `SLOT_UNAVAILABLE`. `insertBooking` null con el slot todavía libre → 503 `STORAGE_UNAVAILABLE`.
- Hallazgos: G-02 (esta función acepta cualquier cliente que pase la validación).

### `src/lib/growth/calendar/client.ts`

- Propósito: `fetch` del navegador hacia las tres rutas del calendario.
- Por qué está así: la isla no conoce D1 ni Google. Los errores HTTP se traducen en `api-request.ts`.
- Exporta: `fetchAvailability`, `bookAppointment`, `cancelAppointment`.
- Depende de: `shared/api-request.ts`, `types.ts`.
- Lo usan: `CalendarTool.tsx`.
- Datos: GET con `?date=`. POST JSON a `/api/calendar/book` y `/api/calendar/cancel` (`{ bookingId }`).
- Hallazgos: —

### `src/lib/growth/calendar/google-calendar-api.ts`

- Propósito: id del calendario y dos lecturas: token de solo lectura, y si un evento del slot contiene el id de la reserva.
- Por qué está así: el scope es `calendar.readonly`. Este repo no hace `events.insert`. Si no hay token, o si `events.list` no responde OK, `googleCalendarEventExistsForBooking` devuelve `true` para no cancelar a ciegas.
- Exporta: `getGoogleCalendarId`, `getGoogleCalendarAccessToken`, `googleCalendarEventExistsForBooking`.
- Depende de: `calendar-rules.ts`, `google/service-account-auth.ts`, `shared/env.ts`.
- Lo usan: `google-busy.ts`, `reconcile-google.ts`.
- Datos: el id vacío se sustituye por `primary`. La búsqueda es `events.list` con `timeMin`/`timeMax` del slot, `singleEvents=true` y `q` igual al UUID. Hay coincidencia si `summary` o `description` incluyen ese id.
- Hallazgos: G-01.

### `src/lib/growth/calendar/google-busy.ts`

- Propósito: traduce los intervalos `freeBusy` del día a slots de 30 minutos.
- Por qué está así: un evento que pisa el slot, aunque sea de otro origen, tiene que verse ocupado en la isla. Sin token, el set vuelve vacío y solo cuenta D1.
- Exporta: `busyPeriodsToSlotTimes`, `getGoogleCalendarBusySlotTimes`.
- Depende de: `calendar-rules.ts`, `google-calendar-api.ts`.
- Lo usan: `availability.ts`.
- Datos: POST a `https://www.googleapis.com/calendar/v3/freeBusy` de 09:00 a 16:30, zona `America/Mexico_City`. Un fallo HTTP se registra y devuelve un set vacío. `busyPeriodsToSlotTimes` marca el slot si los intervalos se solapan.
- Hallazgos: —

### `src/lib/growth/calendar/reconcile-google.ts`

- Propósito: cancela en D1 las citas confirmadas del día que Google no devuelve.
- Por qué está así: se escribió para reflejar un evento borrado en Google Calendar. Corre en cada consulta de disponibilidad, antes de armar los slots.
- Exporta: `reconcileBookingsWithGoogleCalendar`.
- Depende de: `db/calendar.ts`, `google/service-account-auth.ts`, `google-calendar-api.ts`.
- Lo usan: `availability.ts`.
- Datos: sin cuenta de servicio configurada, devuelve 0 y no toca filas. Con cuenta, lista confirmadas del día y llama a `cancelBooking` cuando `googleCalendarEventExistsForBooking` es falso. Devuelve cuántas filas cambió.
- Hallazgos: G-01.

### `src/lib/growth/google/service-account-auth.ts`

- Propósito: JWT de cuenta de servicio y canje por access token en `https://oauth2.googleapis.com/token`.
- Por qué está así: el Worker no tiene el SDK de Google. La firma es WebCrypto RS256 sobre el PEM PKCS8. El token se cachea en memoria del isolate hasta un minuto antes de expirar.
- Exporta: `getGoogleServiceAccountConfig`, `getGoogleAccessToken`.
- Depende de: `shared/env.ts`.
- Lo usan: `google-calendar-api.ts`, `reconcile-google.ts`.
- Datos: hacen falta `GOOGLE_SERVICE_ACCOUNT_EMAIL` y `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`. El PEM acepta saltos escapados `\n`. Sin los dos valores, la config es `null` y el calendario sigue solo con D1. Un fallo del canje se registra (status y cuerpo) y devuelve `null`; la clave no va en ese log a propósito del código, el cuerpo es la respuesta de Google.
- Hallazgos: —

### `src/lib/growth/db/d1.ts`

- Propósito: acceso al binding `DATABASE` con consultas parametrizadas.
- Por qué está así: quiz, calendario y la cola de rebuild comparten el mismo D1. `prepare().bind(...)` evita concatenar la entrada en el SQL.
- Exporta: tipos `D1Prepared` y `GrowthD1`, `getD1`, `d1Run`, `d1First`, `d1All`.
- Depende de: `cloudflare:workers` (`env`).
- Lo usan: `db/calendar.ts`, `db/quiz.ts`, `src/lib/rebuild/flush.ts`, `src/lib/rebuild/queue.ts`, `src/pages/api/rebuild-status.ts`, `src/pages/api/sanity-webhook.ts`.
- Datos: `getD1()` es `null` si el binding no está (dev local sin D1). `d1All` devuelve `[]` si no hay `results`.
- Hallazgos: —

### `src/lib/growth/db/calendar.ts`

- Propósito: leer, insertar y cancelar filas de `calendar_bookings`.
- Por qué está así: el índice único parcial del slot confirmado es la carrera real; el `SELECT` previo es un atajo para devolver `null` sin esperar la excepción. `pending_sync` se inserta en 1 y este archivo no lo vuelve a 0: el aviso a n8n vive en la ruta, no aquí.
- Exporta: `getBookedTimesForDate`, `getConfirmedBookingsForDate`, `insertBooking`, `getBookingById`, `cancelBooking`.
- Depende de: `calendar-rules.ts` (`getServiceLabel`), `types.ts`, `shared/utils.ts` (`createId`), `d1.ts`.
- Lo usan: `availability.ts`, `booking.ts`, `reconcile-google.ts`, `src/pages/api/calendar/cancel.ts`.
- Datos: la fila guarda el label que devuelve `getServiceLabel(input.service)`. Id con `crypto.randomUUID` cuando existe. Choque `UNIQUE` → `null`. Sin D1 → `null`. `cancelBooking` no cambia una fila que ya está `cancelled` y devuelve el registro completo, con nombre, email, teléfono, web y empresa.
- Hallazgos: G-01 (lo llama la reconciliación), G-04.

### `src/lib/growth/db/quiz.ts`

- Propósito: sesiones y leads del diagnóstico en `quiz_sessions` y `quiz_leads`.
- Por qué está así: la sesión permite retomar el paso; el lead es el registro que se queda. Igual que la cita, `pending_sync` nace en 1 y este módulo no lo apaga.
- Exporta: `QuizSessionRow`, `createQuizSession`, `getQuizSession`, `updateQuizSession`, `deleteQuizSession`, `insertQuizLead`.
- Depende de: `shared/utils.ts` (`createId`), `quiz/types.ts`, `d1.ts`.
- Lo usan: `src/pages/api/quiz/session.ts`, `src/pages/api/quiz/submit.ts`.
- Datos: sesión nueva en paso 0 y `answers_json` `{}`. Un update con 0 filas tocadas lanza `Error('SESSION_NOT_FOUND')`. El lead guarda puntaje, nivel, servicios recomendados, respuestas y puntajes por categoría en JSON. Sin D1, crear sesión o lead devuelve `null`.
- Hallazgos: G-02.

### `src/lib/growth/n8n/client.ts`

- Propósito: POST JSON al webhook de n8n, con el secreto en la query y en la cabecera.
- Por qué está así: hay flujos de n8n que leen `?secret=`. El calendario espera la respuesta porque en Workers un `fetch` suelto puede morir al terminar el request. El quiz usa la variante que no espera.
- Exporta: `buildN8nWebhookUrl`, `sendN8nWebhook`, `dispatchN8nWebhook`, `dispatchQuizWebhook`, `dispatchCalendarWebhook`.
- Depende de: `shared/env.ts`.
- Lo usan: `src/pages/api/calendar/book.ts` y `cancel.ts` (`dispatchCalendarWebhook`), `src/pages/api/quiz/submit.ts` (`dispatchQuizWebhook`).
- Datos: URL vacía → warning y return. Secreto vacío → warning y el POST sale igual. El secreto se agrega como `secret` si la URL todavía no lo trae, y se repite en `X-Webhook-Secret`. Un HTTP de error se registra (status y 200 caracteres del cuerpo) y no se relanza en `sendN8nWebhook`. `dispatchN8nWebhook` traga el rechazo. Quiz lee `N8N_WEBHOOK_QUIZ_URL`; calendario, `N8N_WEBHOOK_CALENDAR_URL`.
- Hallazgos: G-07.

### `src/lib/growth/n8n/payloads.ts`

- Propósito: cuerpo que n8n espera para el diagnóstico y para la cita (Slack, evento de calendario y, al reservar, HubSpot).
- Por qué está así: el Worker no habla con Slack, Google Calendar ni HubSpot. Deja el contrato en un JSON. La descripción del evento incluye `Reserva ID:` más el UUID: es el texto que `events.list` tiene que encontrar.
- Exporta: `buildQuizN8nPayload`, `buildCalendarN8nPayload`.
- Depende de: `calendar-rules.ts`, `calendar/types.ts`, `quiz/types.ts`.
- Lo usan: `src/pages/api/calendar/book.ts`, `cancel.ts`, `src/pages/api/quiz/submit.ts`.
- Datos: quiz manda `event: quiz.submitted`, puntaje, nivel, categorías y servicios. Calendario manda `calendar.booked` o `calendar.cancelled`, el `BookingRecord`, un resumen, `slack.channel` `leads-landing-page` y `slack.text` armado con el nombre y el email sin escape. El bloque `calendar` lleva inicio y fin con offset `-06:00` y `attendeeEmail`. `hubspot` solo va en `calendar.booked` (contacto, meeting y `leadSource: Calendario Hiweb`). `getServiceLabel` se aplica al texto ya guardado en la fila.
- Hallazgos: G-01 (el id viaja en la descripción; el Worker no crea el evento), G-02 (el texto de Slack).

### `src/lib/growth/quiz/types.ts`

- Propósito: preguntas, respuestas, puntaje, lead y la respuesta del submit.
- Por qué está así: el cliente manda `QuizAnswers` (id de pregunta → id de opción) y el servidor devuelve `QuizScoreResult` ya cerrado, para que la isla no recalcule.
- Exporta: `QuizCategoryId`, `QuizOption`, `QuizQuestion`, `QuizAnswers`, `CategoryScore`, `QuizResultLevelId`, `QuizScoreResult`, `QuizLeadInput`, `QuizSessionRecord`, `QuizSubmitResponse`.
- Depende de: nada.
- Lo usan: `MarketingQuiz.tsx`, `db/quiz.ts`, `n8n/payloads.ts`, `quiz/client.ts`, `questions.ts`, `result-levels.ts`, `result-storage.ts`, `scoring.ts`, `service-recommendations.ts`, `validators.ts`, `src/pages/api/quiz/session.ts`, `submit.ts`.
- Datos: categorías `seo`, `advertising`, `content`, `analytics`. Niveles `initial`, `developing`, `advanced`, `optimized`. El lead pide nombre y email; empresa, teléfono, web e industria son opcionales.
- Hallazgos: —

### `src/lib/growth/quiz/questions.ts`

- Propósito: las ocho preguntas y la escala 0–3, fijas en código.
- Por qué está así: el diagnóstico no es un documento de Sanity. Cambiar una pregunta es un deploy. La misma lista valida el POST, así que un cliente no puede inventar ids.
- Exporta: `QUIZ_CATEGORY_LABELS`, `QUIZ_QUESTIONS`, `QUIZ_TOTAL_STEPS`.
- Depende de: `types.ts`.
- Lo usan: `MarketingQuiz.tsx`, `scoring.ts`, `validators.ts`, `src/pages/api/quiz/session.ts`.
- Datos: dos preguntas por categoría. Opciones `${id}-0` … `${id}-3` con puntaje 0, 1, 2 y 3. Ids: `seo-visibility`, `seo-technical`, `ads-channels`, `ads-optimization`, `content-strategy`, `content-distribution`, `analytics-tracking`, `analytics-decisions`.
- Hallazgos: —

### `src/lib/growth/quiz/result-levels.ts`

- Propósito: cuatro bandas de resultado según el porcentaje.
- Por qué está así: el umbral vive junto al copy del resultado, no en el componente.
- Exporta: `ResultLevelDefinition`, `QUIZ_RESULT_LEVELS`, `getResultLevel`.
- Depende de: `types.ts`.
- Lo usan: `scoring.ts`.
- Datos: inicial desde 0, en desarrollo desde 35, avanzado desde 60, optimizado desde 82. Gana la banda de `minPercentage` más alta que el puntaje alcanza.
- Hallazgos: —

### `src/lib/growth/quiz/service-recommendations.ts`

- Propósito: textos de fortaleza, oportunidad y servicios a ofrecer, a partir de los porcentajes por categoría.
- Por qué está así: son frases de venta fijas, no slugs del catálogo del sitio. Van al JSON del lead y al webhook.
- Exporta: `buildServiceRecommendations`, `buildStrengthsAndOpportunities`.
- Depende de: `types.ts`.
- Lo usan: `scoring.ts`.
- Datos: por debajo de 70 % la categoría es débil y aporta hasta dos servicios, con tope de 5. Si no se llena, entran «Consultoría de marketing digital integral» y «Automatización de nutrición de leads». Una categoría en 70 % o más es fortaleza. Si todas están altas, o todas bajas, hay una frase genérica de respaldo.
- Hallazgos: —

### `src/lib/growth/quiz/scoring.ts`

- Propósito: de respuestas a `QuizScoreResult`.
- Por qué está así: el puntaje máximo sale de las opciones declaradas, no de un 3 fijo, por si una pregunta cambia de escala. Una pregunta sin respuesta suma 0 y sigue en el máximo.
- Exporta: `calculateQuizScore`.
- Depende de: `questions.ts`, `result-levels.ts`, `service-recommendations.ts`, `types.ts`.
- Lo usan: `src/pages/api/quiz/submit.ts`.
- Datos: porcentaje global y por categoría, redondeado. El nivel, el resumen, fortalezas, oportunidades y servicios recomendados salen de los otros dos módulos.
- Hallazgos: —

### `src/lib/growth/quiz/validators.ts`

- Propósito: comprueba que el submit traiga una opción válida por pregunta, un lead usable y, si viene, un id de sesión con forma de UUID.
- Por qué está así: el submit acepta el cuerpo aunque la sesión no esté en D1. La sesión solo se sanitiza cuando el cliente la manda, y luego la ruta la borra.
- Exporta: `validateQuizAnswers`, `validateQuizLead`, `sanitizeSessionId`.
- Depende de: `questions.ts`, `types.ts`, `shared/errors.ts`.
- Lo usan: `src/pages/api/quiz/session.ts`, `src/pages/api/quiz/submit.ts`.
- Datos: cada pregunta de `QUIZ_QUESTIONS` tiene que tener una opción de su lista. Nombre ≥ 2, email con el mismo regex que la cita. Teléfono, si viene, ≥ 7. Empresa, web e industria se recortan y no tienen máximo. Códigos: `INVALID_ANSWERS`, `INCOMPLETE_ANSWERS`, `INVALID_OPTION`, `INVALID_NAME`, `INVALID_EMAIL`, `INVALID_PHONE`, `INVALID_SESSION`.
- Hallazgos: G-02.

### `src/lib/growth/quiz/client.ts`

- Propósito: `fetch` del navegador a `/api/quiz/session` y `/api/quiz/submit`.
- Por qué está así: la isla no importa D1. Crear y actualizar sesión son el mismo POST, distinguido por `action`.
- Exporta: `createQuizSession`, `updateQuizSession`, `submitQuiz`.
- Depende de: `shared/api-request.ts`, `types.ts`.
- Lo usan: `MarketingQuiz.tsx` (update y submit, vía este módulo) y `quiz/session.ts` (`createQuizSession`).
- Datos: create manda `{ action: 'create' }`. Update manda `sessionId`, `questionId`, `optionId`, `currentStep`. Submit manda `sessionId`, `lead` y `answers`.
- Hallazgos: —

### `src/lib/growth/quiz/session.ts`

- Propósito: arranca la sesión desde la isla y sobrevive a un API caído.
- Por qué está así: sin D1 el diagnóstico todavía se puede contestar; el id local solo vive en el estado del cliente. El submit posterior puede mandarlo, y el servidor lo ignora si no es un UUID de una fila real (`deleteQuizSession` no falla si no existe: el sanitize sí exige forma de UUID, y `createId` en el navegador sí es un UUID).
- Exporta: `startQuizSession`.
- Depende de: `quiz/client.ts`, `shared/utils.ts` (`createId`).
- Lo usan: `MarketingQuiz.tsx`.
- Datos: devuelve `sessionId` remoto o, en cualquier error de red, un id nuevo.
- Hallazgos: —

### `src/lib/growth/quiz/result-storage.ts`

- Propósito: guardar y leer el resultado del diagnóstico en `sessionStorage`.
- Por qué está así: se escribió para rehidratar la pantalla del resultado si el componente se volvía a montar. Hoy ningún archivo lo importa; el resultado vive en el estado de `MarketingQuiz` y en la respuesta del POST.
- Exporta: `QUIZ_RESULT_STORAGE_KEY` (`hiweb-quiz-result`), `StoredQuizResult`, `saveQuizResult`, `loadQuizResult`.
- Depende de: `types.ts`.
- Lo usan: nadie en el repo. El grafo coincide.
- Datos: en el servidor (`window` ausente) guardar no hace nada y leer devuelve `null`. Un JSON roto también devuelve `null`. El objeto guardado añade `savedAt`.
- Hallazgos: —

### `src/lib/growth/shared/env.ts`

- Propósito: lee en el servidor las URLs de n8n, el secreto y la cuenta de Google.
- Por qué está así: el orden es binding del Worker, luego `import.meta.env`, luego `process.env`. Un string vacío significa integración apagada; la cita y el lead igual pueden guardarse en D1.
- Exporta: `ServerEnv`, `getServerEnv`.
- Depende de: `cloudflare:workers`.
- Lo usan: `google-calendar-api.ts`, `google/service-account-auth.ts`, `n8n/client.ts`.
- Datos: `N8N_WEBHOOK_QUIZ_URL`, `N8N_WEBHOOK_CALENDAR_URL`, `N8N_WEBHOOK_SECRET`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`, `GOOGLE_CALENDAR_ID`. No llevan prefijo `PUBLIC_`.
- Hallazgos: G-07 (de aquí salen la URL y el secreto que el cliente de n8n pone en la query).

### `src/lib/growth/shared/errors.ts`

- Propósito: error con status HTTP y código estable para el JSON.
- Por qué está así: un `Error` genérico se volvería 500. Los validadores necesitan 400 y 409 sin armar la `Response` ellos mismos.
- Exporta: `AppError`, `isAppError`.
- Depende de: nada.
- Lo usan: `api/response.ts`, `calendar/booking.ts`, `calendar/validators.ts`, `quiz/validators.ts`, `src/pages/api/calendar/availability.ts`, `cancel.ts`, `src/pages/api/quiz/submit.ts`.
- Datos: status por defecto 500, código por defecto `INTERNAL_ERROR`. `name` es `AppError`.
- Hallazgos: —

### `src/lib/growth/shared/utils.ts`

- Propósito: id opaco y dos helpers de UI que ya no llama nadie.
- Por qué está así: el UUID de la cita y del lead es el secreto de cancelación (G-04). `cn` y `navigateToUrl` quedaron de un helper de clases y de navegación que el crecimiento ya no usa.
- Exporta: `cn`, `createId`, `navigateToUrl`.
- Depende de: nada.
- Lo usan: `createId` en `db/calendar.ts`, `db/quiz.ts`, `quiz/session.ts`, `src/pages/api/quiz/session.ts`. `cn` y `navigateToUrl` no tienen imports.
- Datos: `createId` usa `crypto.randomUUID` y, si no existe, un id con timestamp y `Math.random`. `navigateToUrl` asigna `window.location.href` si hay ventana y la URL trae texto.
- Hallazgos: G-04 (el id sale de `createId`).

### `src/lib/growth/shared/api-request.ts`

- Propósito: `fetch` JSON del navegador con mensajes fijos en español.
- Por qué está así: la isla no debe mostrar el cuerpo de un HTML de error ni un stack. Si la respuesta no es JSON, se sustituye el mensaje.
- Exporta: `apiRequest`.
- Depende de: nada.
- Lo usan: `calendar/client.ts`, `quiz/client.ts`.
- Datos: fallo de red o JSON ilegible → «No pudimos conectar con el servidor…». Status distinto de OK → el campo `error` del JSON, o «No pudimos completar la solicitud…». Un 404 sin JSON usa el mensaje de red.
- Hallazgos: —
