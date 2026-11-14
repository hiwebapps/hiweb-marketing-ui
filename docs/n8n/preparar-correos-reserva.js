// n8n · flujo "Hiweb — Calendario" · nodo Code "Preparar correos de reserva1"
// Modo: Run Once for All Items · Lenguaje: JavaScript
// Entrada: el payload calendar.booked que manda el Worker (src/lib/growth/n8n/payloads.ts).
// Salida: mismas claves que usan los nodos Resend (clientTo, adminTo, clientSubject,
// clientText, clientHtml, adminSubject, adminText, adminHtml).

const SITE_URL = 'https://www.hiwebmarketing.com';
const BOOKING_URL = SITE_URL + '/calendario';
const LOGO_URL = SITE_URL + '/images/isotipo-hiweb.png'; // isotipo blanco, 53x58, solo sobre fondo oscuro
const BRAND = 'Hiweb';
const SIGNER_NAME = 'David Gallegos'; // quien firma el correo y recibe las respuestas (reply_to = HIWEB_ADMIN_EMAIL)
const YEAR = new Date().getFullYear();

const C = {
  bg: '#f5f5f5',
  card: '#ffffff',
  ink: '#111111',
  inkSoft: '#3a3a3a',
  muted: '#6b7280',
  border: '#e5e5e5',
  dark: '#070902',
  darkText: '#f5f5f5',
  darkMuted: '#a3a3a3',
};

const FONT = "font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;";

function esc(value) {
  return String(value ?? '—')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

// "lunes, 16 de noviembre de 2026" a partir de la fecha ISO del payload.
function longDate(dateIso, fallback) {
  try {
    const d = new Date(dateIso + 'T12:00:00');
    if (Number.isNaN(d.getTime())) return fallback;
    return capitalize(
      d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    );
  } catch {
    return fallback;
  }
}

// "el lunes 16 de noviembre" para la despedida.
function shortDate(dateIso, fallback) {
  try {
    const d = new Date(dateIso + 'T12:00:00');
    if (Number.isNaN(d.getTime())) return fallback;
    return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' }).replace(',', '');
  } catch {
    return fallback;
  }
}

function row(label, value) {
  return (
    '<tr>' +
    '<td style="padding:0 16px 12px 0;font-size:13px;line-height:1.4;color:' + C.muted + ';vertical-align:top;white-space:nowrap;' + FONT + '">' + esc(label) + '</td>' +
    '<td style="padding:0 0 12px;font-size:15px;line-height:1.4;color:' + C.ink + ';font-weight:600;' + FONT + '">' + esc(value) + '</td>' +
    '</tr>'
  );
}

function message(paragraphs, signature) {
  const body = paragraphs
    .map((text) => '<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:' + C.inkSoft + ';' + FONT + '">' + text + '</p>')
    .join('');
  const sign = signature
    ? '<p style="margin:4px 0 0;font-size:15px;line-height:1.5;color:' + C.ink + ';' + FONT + '">' + signature + '</p>'
    : '';
  return '<div style="margin-top:28px;">' + body + sign + '</div>';
}

// Botón a prueba de clientes de correo: tabla + estilos inline, sin depender de CSS externo.
function button(label, href) {
  return (
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:28px auto 0;">' +
    '<tr><td align="center" bgcolor="' + C.ink + '" style="border-radius:999px;background:' + C.ink + ';">' +
    '<a href="' + esc(href) + '" target="_blank" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;line-height:1;color:#ffffff;text-decoration:none;border-radius:999px;' + FONT + '">' + esc(label) + '</a>' +
    '</td></tr></table>'
  );
}

function emailHtml(input) {
  const preheader = input.preheader
    ? '<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px;">' + esc(input.preheader) + '&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>'
    : '';
  const note2 = input.message ? message(input.message, input.signature) : '';
  const note = input.note
    ? '<div style="margin-top:12px;background:' + C.bg + ';border-radius:12px;padding:16px 18px;">' +
      '<div style="font-size:11px;letter-spacing:0.1em;font-weight:700;color:' + C.muted + ';' + FONT + '">' + esc(input.noteLabel || 'NOTA') + '</div>' +
      '<p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:' + C.inkSoft + ';' + FONT + '">' + input.note + '</p>' +
      '</div>'
    : '';
  const cta = input.buttonLabel ? button(input.buttonLabel, input.buttonHref) : '';

  return (
    '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>' + esc(input.title) + '</title></head>' +
    '<body style="margin:0;padding:0;background:' + C.bg + ';">' +
    preheader +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:' + C.bg + ';">' +
    '<tr><td align="center" style="padding:32px 12px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:' + C.card + ';border-radius:16px;overflow:hidden;">' +
    // Cabecera oscura con el isotipo
    '<tr><td align="center" bgcolor="' + C.dark + '" style="background:' + C.dark + ';padding:32px 28px 28px;">' +
    '<img src="' + LOGO_URL + '" width="40" height="44" alt="' + BRAND + '" style="display:block;margin:0 auto 12px;border:0;outline:none;width:40px;height:44px;">' +
    '<div style="font-size:18px;font-weight:700;letter-spacing:0.02em;color:' + C.darkText + ';' + FONT + '">' + BRAND + '</div>' +
    '<div style="font-size:13px;color:' + C.darkMuted + ';margin-top:4px;' + FONT + '">' + esc(input.eyebrow) + '</div>' +
    '</td></tr>' +
    // Cuerpo
    '<tr><td style="padding:32px 28px 28px;">' +
    '<h1 style="margin:0 0 10px;font-size:24px;line-height:1.25;font-weight:700;color:' + C.ink + ';' + FONT + '">' + esc(input.title) + '</h1>' +
    '<p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:' + C.inkSoft + ';' + FONT + '">' + input.intro + '</p>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fafafa;border:1px solid ' + C.border + ';border-radius:12px;">' +
    '<tr><td style="padding:18px 18px 6px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' + input.rows + '</table></td></tr>' +
    '</table>' +
    note2 +
    cta +
    note +
    '</td></tr>' +
    // Pie
    '<tr><td style="padding:18px 28px;border-top:1px solid ' + C.border + ';">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' +
    '<td style="font-size:12px;line-height:1.5;color:' + C.muted + ';' + FONT + '">© ' + YEAR + ' ' + BRAND + ' Marketing</td>' +
    '<td align="right" style="font-size:12px;line-height:1.5;' + FONT + '"><a href="' + SITE_URL + '" style="color:' + C.muted + ';text-decoration:underline;">hiwebmarketing.com</a></td>' +
    '</tr></table>' +
    (input.footnote ? '<p style="margin:10px 0 0;font-size:11px;line-height:1.5;color:#a3a3a3;' + FONT + '">' + esc(input.footnote) + '</p>' : '') +
    '</td></tr>' +
    '</table>' +
    '</td></tr></table>' +
    '</body></html>'
  );
}

// ───────────────────────── Datos de la reserva ─────────────────────────
const payload = $input.first().json;
const summary = payload.summary;
const origin = summary.source || '—';
const adminTo = String($env.HIWEB_ADMIN_EMAIL || '').trim();
if (!adminTo) {
  throw new Error('Falta HIWEB_ADMIN_EMAIL en las variables de entorno de n8n');
}

const firstName = String(summary.name || '').trim().split(/\s+/)[0] || summary.name;
const dateLabel = longDate(summary.date, summary.scheduleLabel);
const dateShort = shortDate(summary.date, summary.scheduleLabel);
const timeLabel = (summary.timeLabel || summary.time || '') + ' · Ciudad de México';
const durationMinutes = (payload.calendar && payload.calendar.durationMinutes) || 30;

const detail = [
  'Servicio: ' + summary.serviceLabel,
  'Fecha: ' + dateLabel,
  'Hora: ' + timeLabel,
  'Duración: ' + durationMinutes + ' minutos',
  'Modalidad: videollamada por Google Meet',
  'Nombre: ' + summary.name,
  'Email: ' + summary.email,
  'Teléfono: ' + (summary.phone || '—'),
  'Empresa: ' + (summary.company || '—'),
  'Sitio web: ' + (summary.website || '—'),
  'ID de reserva: ' + payload.bookingId,
].join('\n');

const clientRows =
  row('Servicio', summary.serviceLabel) +
  row('Fecha', dateLabel) +
  row('Hora', timeLabel) +
  row('Duración', durationMinutes + ' minutos') +
  row('Modalidad', 'Videollamada por Google Meet');

// Frase de apertura según el servicio elegido (coincidencia por palabra clave en la etiqueta).
const SERVICE_TOPICS = [
  { match: /seo|aeo|posicionamiento/i, name: 'SEO', topic: 'cómo está posicionado tu sitio hoy, qué está frenando su visibilidad y qué conviene atender primero' },
  { match: /meta|facebook|instagram/i, name: 'Meta Ads', topic: 'cómo están funcionando tus campañas, qué costo por cliente estás pagando y qué margen hay para mejorarlo' },
  { match: /google ads|sem\b|adwords/i, name: 'Google Ads', topic: 'qué campañas te traen clientes, en cuáles se va el presupuesto y qué ajustar primero' },
  { match: /redes|social|community/i, name: 'redes sociales', topic: 'cómo se ve hoy tu marca ahí, qué quieres lograr y cómo convertirlo en clientes' },
  { match: /brand|marca|identidad/i, name: 'branding', topic: 'qué comunica hoy tu marca, qué debería comunicar y qué piezas hacen falta primero' },
  { match: /crm|automatiz/i, name: 'CRM y automatización', topic: 'cómo llegan y se atienden hoy tus prospectos y qué parte del proceso conviene automatizar' },
  { match: /\bia\b|ai\b|inteligencia/i, name: 'IA aplicada al marketing', topic: 'qué tareas se pueden resolver con IA hoy y cuáles no vale la pena tocar todavía' },
  { match: /web|sitio|desarrollo|landing/i, name: 'tu sitio web', topic: 'en qué estado está, qué necesitas que logre y qué cambios conviene hacer primero' },
];
function serviceOpening(serviceLabel) {
  const label = String(serviceLabel || '');
  const parts = label.split(/\s*[,+\/]\s*|\s+y\s+/).filter(Boolean);
  const hits = [];
  for (const part of parts) {
    const hit = SERVICE_TOPICS.find((t) => t.match.test(part));
    if (hit && !hits.includes(hit)) hits.push(hit);
  }
  if (hits.length === 1) {
    return 'Hablaremos de ' + hits[0].name + ': ' + hits[0].topic + '.';
  }
  if (hits.length > 1) {
    const names = hits.map((h) => h.name);
    const list = names.slice(0, -1).join(', ') + ' y ' + names[names.length - 1];
    return 'Hablaremos de ' + list + ': cómo está cada área hoy, qué quieres lograr y qué conviene atender primero.';
  }
  return 'Hablaremos de tu marketing: qué estás haciendo hoy, qué quieres lograr y qué conviene atender primero.';
}

const clientMessage = [
  serviceOpening(summary.serviceLabel),
  'Si puedes, ten a la mano tu sitio web y tus objetivos para los próximos meses.',
  'La invitación de Google Calendar, con el enlace de Meet, llega en unos minutos a este correo. Para cualquier cambio, responde a este mensaje.',
];
const clientSignature = 'Hasta el ' + dateShort + '.<br><strong>' + SIGNER_NAME + '</strong> · Hiweb';

const adminRows =
  row('Origen', origin) +
  row('Servicio', summary.serviceLabel) +
  row('Fecha', dateLabel) +
  row('Hora', timeLabel) +
  row('Nombre', summary.name) +
  row('Email', summary.email) +
  row('Teléfono', summary.phone || '—') +
  row('Empresa', summary.company || '—') +
  row('Sitio web', summary.website || '—') +
  row('Reserva', payload.bookingId);

return [{
  json: {
    clientTo: summary.email,
    adminTo,

    clientSubject: 'Tu cita con Hiweb está confirmada · ' + summary.scheduleLabel,
    clientText:
      'Hola ' + firstName + ',\n\n' +
      'Gracias por agendar. Tu cita quedó registrada:\n\n' +
      detail + '\n\n' +
      clientMessage.map((p) => p.replace(/<[^>]+>/g, '')).join('\n\n') + '\n\n' +
      'Si cambian tus planes, pulsa No en la invitación y el horario se libera solo. ' +
      'Si prefieres otra fecha, agenda de nuevo en ' + BOOKING_URL + '\n\n' +
      'Hasta el ' + dateShort + '.\n' + SIGNER_NAME + ' · Hiweb\n' + SITE_URL + '\n',
    clientHtml: emailHtml({
      preheader: summary.serviceLabel + ' · ' + dateLabel + ', ' + (summary.timeLabel || summary.time) + '. El enlace de Meet llega en la invitación de calendario.',
      eyebrow: 'Cita confirmada',
      title: 'Hola, ' + firstName + '. Tu cita está lista.',
      intro: 'Gracias por agendar. Tu cita quedó registrada:',
      rows: clientRows,
      message: clientMessage,
      signature: clientSignature,
      buttonLabel: 'Ver casos de éxito',
      buttonHref: SITE_URL + '/portafolio',
      noteLabel: 'SI CAMBIAN TUS PLANES',
      note:
        'Pulsa <strong>No</strong> en la invitación y el horario se libera solo, sin escribirnos. ' +
        'Si prefieres otra fecha, <a href="' + BOOKING_URL + '" style="color:' + C.ink + ';font-weight:600;">agenda de nuevo aquí</a>.',
      footnote: 'Recibes este correo porque agendaste una cita en hiwebmarketing.com. Reserva ' + payload.bookingId + '.',
    }),

    adminSubject: 'Nueva cita: ' + summary.name + ' — ' + summary.serviceLabel + ' (' + origin + ')',
    adminText: 'Nueva cita agendada en hiwebmarketing.com.\n\nOrigen: ' + origin + '\n' + detail + '\n',
    adminHtml: emailHtml({
      preheader: summary.name + ' · ' + summary.serviceLabel + ' · ' + dateLabel + ', ' + (summary.timeLabel || summary.time),
      eyebrow: 'Nueva cita',
      title: summary.name,
      intro: 'Quedó agendada una cita en hiwebmarketing.com. El evento ya está en la agenda de ' + adminTo + '.',
      rows: adminRows,
      buttonLabel: 'Escribir al cliente',
      buttonHref: 'mailto:' + summary.email,
      footnote: 'Reserva ' + payload.bookingId + '. Si el cliente pulsa No en la invitación, el horario se libera solo en el sitio.',
    }),
  },
}];
