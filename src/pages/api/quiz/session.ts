import type { APIRoute } from 'astro';
import { QUIZ_TOTAL_STEPS } from '../../../lib/growth/quiz/questions';
import type { QuizAnswers } from '../../../lib/growth/quiz/types';
import { sanitizeSessionId } from '../../../lib/growth/quiz/validators';
import { createQuizSession, getQuizSession, updateQuizSession } from '../../../lib/growth/db/quiz';
import { jsonError } from '../../../lib/growth/api/response';
import { createId } from '../../../lib/growth/shared/utils';

export const prerender = false;

type SessionBody = {
  action?: 'create' | 'update';
  sessionId?: string;
  questionId?: string;
  optionId?: string;
  answers?: QuizAnswers;
  currentStep?: number;
};

function mergeAnswersFromBody(existing: QuizAnswers, body: SessionBody): QuizAnswers {
  if (body.questionId && body.optionId) {
    return { ...existing, [body.questionId]: body.optionId };
  }
  if (body.answers) return { ...body.answers };
  return existing;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as SessionBody;
    const action = body.action ?? (body.sessionId ? 'update' : 'create');

    if (action === 'create') {
      const session = await createQuizSession();
      if (session) {
        return Response.json({
          sessionId: session.sessionId,
          currentStep: session.currentStep,
          totalSteps: QUIZ_TOTAL_STEPS,
          answers: session.answers,
        });
      }

      return Response.json({
        sessionId: createId(),
        currentStep: 0,
        totalSteps: QUIZ_TOTAL_STEPS,
        answers: {},
        ephemeral: true,
      });
    }

    const sessionId = sanitizeSessionId(body.sessionId);
    const existing = await getQuizSession(sessionId);

    if (existing) {
      const merged = mergeAnswersFromBody(existing.answers, body);
      const currentStep = typeof body.currentStep === 'number' ? body.currentStep : Object.keys(merged).length;
      const session = await updateQuizSession(sessionId, merged, currentStep);
      if (session) {
        return Response.json({
          sessionId: session.sessionId,
          currentStep: session.currentStep,
          totalSteps: QUIZ_TOTAL_STEPS,
          answers: session.answers,
        });
      }
    }

    const answers = mergeAnswersFromBody({}, body);
    const currentStep = typeof body.currentStep === 'number' ? body.currentStep : Object.keys(answers).length;

    return Response.json({
      sessionId,
      currentStep,
      totalSteps: QUIZ_TOTAL_STEPS,
      answers,
      ephemeral: true,
    });
  } catch (error) {
    return jsonError(error);
  }
};
