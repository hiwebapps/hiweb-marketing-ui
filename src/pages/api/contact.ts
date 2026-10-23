import type { APIRoute } from 'astro';
import { validateContactLead, type ContactLeadInput } from '../../lib/growth/contact/validators';
import { countContactLeadsForEmailSince, insertContactLead } from '../../lib/growth/db/contact';
import { dispatchContactWebhook } from '../../lib/growth/n8n/client';
import { buildContactN8nPayload } from '../../lib/growth/n8n/payloads';
import { jsonError } from '../../lib/growth/api/response';
import { enforceRateLimit } from '../../lib/growth/api/rate-limit';
import { AppError } from '../../lib/growth/shared/errors';

export const prerender = false;

/** Per email, rolling 24 hours. Stops a script from flooding the lead list. */
const MAX_CONTACT_LEADS_PER_EMAIL = 3;
const CONTACT_LEADS_WINDOW_MS = 24 * 60 * 60 * 1000;

export const POST: APIRoute = async ({ request }) => {
  try {
    await enforceRateLimit(request, 'FORM_RATE_LIMITER', 'contact');
    const body = (await request.json().catch(() => null)) as ContactLeadInput | null;
    if (!body || typeof body !== 'object') {
      throw new AppError('Faltan datos del formulario.', { statusCode: 400, code: 'INVALID_BODY' });
    }

    const lead = validateContactLead(body);

    const since = new Date(Date.now() - CONTACT_LEADS_WINDOW_MS).toISOString();
    if ((await countContactLeadsForEmailSince(lead.email, since)) >= MAX_CONTACT_LEADS_PER_EMAIL) {
      throw new AppError('Ya recibimos tus mensajes de hoy. Te contactaremos pronto.', {
        statusCode: 429,
        code: 'CONTACT_LIMIT_REACHED',
      });
    }

    const leadId = await insertContactLead(lead);
    if (!leadId) {
      throw new AppError('No pudimos enviar tu mensaje. Intenta de nuevo en unos minutos.', {
        statusCode: 503,
        code: 'STORAGE_UNAVAILABLE',
      });
    }

    await dispatchContactWebhook(buildContactN8nPayload({ leadId, lead }));
    return Response.json({ leadId });
  } catch (error) {
    return jsonError(error);
  }
};
