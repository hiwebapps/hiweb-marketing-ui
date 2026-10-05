import type { APIRoute } from 'astro';
import { calculateQuizScore } from '../../../lib/growth/quiz/scoring';
import type { QuizAnswers, QuizLeadInput } from '../../../lib/growth/quiz/types';
import { sanitizeSessionId, validateQuizAnswers, validateQuizLead } from '../../../lib/growth/quiz/validators';
import { deleteQuizSession, insertQuizLead } from '../../../lib/growth/db/quiz';
import { dispatchQuizWebhook } from '../../../lib/growth/n8n/client';
import { buildQuizN8nPayload } from '../../../lib/growth/n8n/payloads';
import { jsonError } from '../../../lib/growth/api/response';
import { AppError } from '../../../lib/growth/shared/errors';

export const prerender = false;

type SubmitBody = {
  sessionId?: string;
  lead?: QuizLeadInput;
  answers?: QuizAnswers;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as SubmitBody;
    if (!body.lead || !body.answers) {
      throw new AppError('Faltan datos del diagnóstico.', { statusCode: 400, code: 'INVALID_BODY' });
    }

    const sessionId = body.sessionId ? sanitizeSessionId(body.sessionId) : '';
    const lead = validateQuizLead(body.lead);
    validateQuizAnswers(body.answers);
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
