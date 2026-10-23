import type { APIRoute } from 'astro';
import { calculateQuizScore } from '../../../lib/growth/quiz/scoring';
import type { QuizAnswers, QuizLeadInput } from '../../../lib/growth/quiz/types';
import { sanitizeSessionId, validateQuizAnswers, validateQuizLead } from '../../../lib/growth/quiz/validators';
import { countQuizLeadsForEmailSince, deleteQuizSession, insertQuizLead } from '../../../lib/growth/db/quiz';
import { dispatchQuizWebhook } from '../../../lib/growth/n8n/client';
import { buildQuizN8nPayload } from '../../../lib/growth/n8n/payloads';
import { jsonError } from '../../../lib/growth/api/response';
import { enforceRateLimit } from '../../../lib/growth/api/rate-limit';
import { AppError } from '../../../lib/growth/shared/errors';

export const prerender = false;

/** Per email, rolling 24 hours. Stops a script from flooding the lead list. */
const MAX_QUIZ_LEADS_PER_EMAIL = 2;
const QUIZ_LEADS_WINDOW_MS = 24 * 60 * 60 * 1000;

type SubmitBody = {
  sessionId?: string;
  lead?: QuizLeadInput;
  answers?: QuizAnswers;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await enforceRateLimit(request, 'FORM_RATE_LIMITER', 'quiz-submit');
    const body = (await request.json()) as SubmitBody;
    if (!body.lead || !body.answers) {
      throw new AppError('Faltan datos del diagnóstico.', { statusCode: 400, code: 'INVALID_BODY' });
    }

    const sessionId = body.sessionId ? sanitizeSessionId(body.sessionId) : '';
    const lead = validateQuizLead(body.lead);
    validateQuizAnswers(body.answers);

    const since = new Date(Date.now() - QUIZ_LEADS_WINDOW_MS).toISOString();
    if ((await countQuizLeadsForEmailSince(lead.email, since)) >= MAX_QUIZ_LEADS_PER_EMAIL) {
      throw new AppError('Ya recibimos tus diagnósticos de hoy. Te contactaremos pronto.', {
        statusCode: 429,
        code: 'QUIZ_LIMIT_REACHED',
      });
    }
    const result = calculateQuizScore(body.answers);
    const leadId = await insertQuizLead(lead, result, body.answers);

    if (!leadId) {
      throw new AppError('No pudimos guardar el diagnóstico. Intenta de nuevo en unos minutos.', {
        statusCode: 503,
        code: 'STORAGE_UNAVAILABLE',
      });
    }

    if (sessionId) {
      await deleteQuizSession(sessionId);
    }

    dispatchQuizWebhook(buildQuizN8nPayload({ leadId, lead, result }));
    return Response.json({ leadId, result });
  } catch (error) {
    return jsonError(error);
  }
};
