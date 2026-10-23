# Cutover SEO (NO INDEX until ready)

El front se queda **noindex** hasta que cada ítem abajo esté hecho y alguien active el flag a propósito.

Estado al 23 de octubre de 2026: **cutover hecho.** `www.hiwebmarketing.com` es un Custom Domain del Worker `hiweb-marketing-ui`, indexable. La rama `cutover/www-hiwebmarketing` se mergeó a `master` (`939d5a3`). `hiweb.com.mx` solo sirvió para pruebas: se quitó del Worker sin redirect. `staging.hiweb.com.mx` sigue como staging.

**Workers Builds.** El Worker también está conectado a Workers Builds (lo usa el deploy hook del rebuild de Studio). Sus variables de build son aparte de `wrangler.jsonc`: tienen que decir `PUBLIC_SITE_URL=https://www.hiwebmarketing.com` y `PUBLIC_SITE_INDEXABLE=true`, o un rebuild vuelve a publicar HTML con noindex y canonical a otro host.

Los comandos remotos de wrangler necesitan `CLOUDFLARE_ACCOUNT_ID=3e168bad1930ad9393198eea20085c28` (cuenta `Web@hiwebmarketing.com`): el login también ve la cuenta Admin.

## Durante la migración (ahora)

- `PUBLIC_SITE_INDEXABLE` unset o `false` en todos los entornos.
- `robots.txt` → `Disallow: /`
- Meta robots + `X-Robots-Tag` vía `src/lib/seo.ts`, middleware y `public/_headers`.
- El sitio indexable sigue siendo Webflow en `www.hiwebmarketing.com`, no este Worker.
- Sitemap interno: `/sitemap.xml` (no enlazado desde robots).

## DNS antes de mover la zona

| Registro | Valor | Nota |
| --- | --- | --- |
| NS `hiwebmarketing.com` | `ns1/ns2.dns-parking.com` | Hostinger. Desde el 23 oct: `alice`/`chad.ns.cloudflare.com`. |
| A `hiwebmarketing.com` | `198.202.211.1` | Webflow. Redirige 301 a `www`. |
| CNAME `www` | `cdn.webflow.com` | Webflow. |
| MX | `mx.zoho.com`, `mx2.zoho.com`, `mx3.zoho.com` (10) | Correo Zoho. No tocar. |
| TXT apex | SPF `v=spf1 include:zoho.com ~all`, 2× `google-site-verification`, zoho, apple, openai, yandex | Copiar todos. |
| TXT `zmail._domainkey` | DKIM de Zoho | Copiar. |
| `_dmarc` | No existe | Conviene agregarlo después del cutover. |
| `hiweb.com.mx`, `www`, `staging` | Cloudflare (`yevgen`/`deborah`) → Worker | Ya en la cuenta. |

Un Custom Domain de Worker exige que la zona esté en la misma cuenta de Cloudflare. Por eso el primer paso es mover `hiwebmarketing.com` a Cloudflare. Se puede hacer días antes, sin cambiar lo que se ve.

## Fase A — Mover la zona a Cloudflare (sin cambio visible)

- [x] En Hostinger, exportar la zona DNS completa. La lista de arriba solo trae lo que se ve por `dig`. Puede haber más subdominios.
- [x] Cloudflare (cuenta `web@hiwebmarketing.com`) → **Add a site** → `hiwebmarketing.com`, plan Free.
- [x] Revisar el escaneo contra el export. Deben estar MX, SPF, DKIM, todas las verificaciones y cualquier subdominio extra.
- [x] `www` CNAME `cdn.webflow.com` y apex A `198.202.211.1` en **DNS only** (nube gris). Webflow no funciona detrás del proxy.
- [x] En Hostinger, cambiar los nameservers por los dos que da Cloudflare.
- [x] Esperar a que la zona quede **Active**. Probar: el sitio Webflow abre, llega correo a `@hiwebmarketing.com` y Search Console sigue verificado. Hecho el 23 oct: registros comparados contra Hostinger (MX, SPF, DKIM, 7 TXT, sin subdominios extra) y el correo de Zoho llega.

## Fase B — Bloqueos de código (antes del día del cutover)

- [x] Redirects 301 de las URLs viejas de Webflow (`/blogs/*` → `/blog/*`, 9 servicios, `/estados/*`, `/gracias`, `/cotiza-ahora/ads`): `src/lib/legacy-es-paths.ts`. Antes daban 404 en 84 de las 200 URLs del sitemap de Webflow.
- [x] Canonical sin barra final y assets con `html_handling: drop-trailing-slash`. Antes cada URL hacía 307 a la versión con `/` y el canonical no coincidía con el sitemap ni con hreflang.
- [x] **Analítica.** GTM `GTM-W3D8LHVV` y Clarity `ldracdhqpf`, igual que en el custom code de Webflow. Solo cargan cuando la página es indexable (host vivo y flag en `true`), así que antes del cutover no aparecen.
- [ ] Revisar en el contenedor de GTM las etiquetas y triggers que dependan del HTML de Webflow (envío de formularios, clases, URLs `/blogs/`). Remapear las conversiones al formulario de contacto, al diagnóstico y al calendario.
- [ ] Revisar Webflow → Integrations y el custom code por página.
- [x] **Contacto.** `/contacto` y `/en/contact` envían a `POST /api/contact` (D1 `contact_leads` + n8n). Se borraron en Sanity los redirects `/contacto` → `/calendario` y `/en/contacto` → `/en/calendar`.
- [x] Antes del deploy de contacto: `npx wrangler d1 migrations apply hiweb-marketing-quiz-calendar --remote` (crea `contact_leads`; staging: `--env staging`). Sin la tabla, el formulario responde 503.
- [x] Contacto y diagnóstico llegan a n8n: `N8N_WEBHOOK_CONTACT_URL` y `N8N_WEBHOOK_QUIZ_URL` apuntan al webhook del flujo "Hiweb — Calendario", que ahora tiene ramas para `contact.submitted` (Slack, HubSpot, correo al admin y al cliente) y `quiz.submitted` (Slack y HubSpot).
- [x] `/contacto` tiene dos pestañas, mensaje y calendario. `/contacto#agendar` y `/en/contact#book` abren el calendario.
- [x] Las páginas `/en` ya no enlazan a `/contacto` ni a `/calendario`.
- [ ] Cabeceras de seguridad en `public/_headers` (HSTS, nosniff, X-Frame-Options), auditoría G-06.
- [ ] Inter a woff2 con subset, auditoría P-01.

**De dónde sale el flag.** En el build, `PUBLIC_SITE_INDEXABLE` y `PUBLIC_SITE_URL` salen de `vars` en `wrangler.jsonc` y de `.env`, no de la variable de entorno del workflow. Por eso el revert de `2806181` tiene que cambiar `wrangler.jsonc`. Un `.env` local con `PUBLIC_SITE_INDEXABLE=false` deja el build en noindex.
- [ ] Volver a correr la paridad de URLs contra `hiweb.com.mx`: cada URL del sitemap de Webflow debe dar 200 o 301 a un 200.

## Fase C — Día del cutover (no reordenar)

1. Aprobación explícita de go-live.
2. Mergear la rama `cutover/www-hiwebmarketing` (el revert de `2806181`) y hacer push a `master`. El workflow despliega el Worker con `PUBLIC_SITE_URL=https://www.hiwebmarketing.com` e `PUBLIC_SITE_INDEXABLE=true`. Mientras `www` siga en Webflow, `hiweb.com.mx` sigue con noindex por `public/_headers` y por `shouldNoIndex`. Esperar a que termine el deploy.
3. Workers & Pages → `hiweb-marketing-ui` → Settings → Domains & Routes → **Add Custom Domain** `www.hiwebmarketing.com`. Cloudflare reemplaza el CNAME de Webflow y emite el certificado.
4. Apex → www: dejar un registro proxied en el apex (por ejemplo AAAA `100::`, nube naranja) y una Redirect Rule `hiwebmarketing.com/*` → `https://www.hiwebmarketing.com/${1}`, 301, conservando el query string.
5. Zona `hiweb.com.mx`: Redirect Rule para `hiweb.com.mx` y `www.hiweb.com.mx` (no `staging`) → `https://www.hiwebmarketing.com` + misma ruta, 301.
6. Studio: `npm run studio:deploy`. El revert cambia la API que llama Studio (sync de Instagram y barra de rebuild) a `www.hiwebmarketing.com`.
7. n8n, flujo "Hiweb — Calendario": cambiar el nodo "Liberar horario en el sitio" de `https://hiweb.com.mx/api/calendar/cancel` a `https://www.hiwebmarketing.com/api/calendar/cancel`.
8. Caché: la zona `hiweb.com.mx` guarda HTML en el borde (`cf-cache-status: HIT` con `max-age=0`). Revisar esa regla antes de copiarla a `hiwebmarketing.com`, y purgar la zona después del cambio para no servir páginas con noindex.
9. Verificar en `www.hiwebmarketing.com`:
   - `robots.txt` → `Allow: /` y `Sitemap: https://www.hiwebmarketing.com/sitemap.xml`
   - HTML con `index, follow`, sin `X-Robots-Tag`, canonical en `https://www.hiwebmarketing.com/...` sin barra final
   - URLs viejas de Webflow → 301 a 200
   - GTM y Clarity en el HTML
   - Formulario de contacto, diagnóstico, reserva en calendario y Studio (sync de Instagram y barra de rebuild), con su ejecución en n8n
10. Search Console (propiedad de dominio, ya verificada por TXT): enviar `https://www.hiwebmarketing.com/sitemap.xml` y pedir indexación de home, servicios e industrias.
11. Webflow: dejar el plan activo una o dos semanas para poder hacer rollback. Después quitar el dominio del proyecto.

## Rollback

1. Quitar el Custom Domain `www.hiwebmarketing.com` del Worker.
2. Volver a crear `www` CNAME `cdn.webflow.com` en **DNS only**. Webflow vuelve a servir en minutos.
3. Si el Worker va a seguir en `www` con un problema de indexación: `PUBLIC_SITE_INDEXABLE=false` y redeploy.
