import { apiRequest } from '../shared/api-request';
import type { QuizAnswers, QuizLeadInput, QuizSubmitResponse } from './types';

export async function createQuizSession() {
  return apiRequest<{
    sessionId: string;
    currentStep: number;
    totalSteps: number;
    answers: QuizAnswers;
  }>('/api/quiz/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'create' }),
  });
}

export async function updateQuizSession(input: {
  sessionId: string;
  questionId: string;
  optionId: string;
  currentStep: number;
}) {
  return apiRequest<{
    sessionId: string;
    currentStep: number;
    totalSteps: number;
    answers: QuizAnswers;
  }>('/api/quiz/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'update',
      sessionId: input.sessionId,
      questionId: input.questionId,
      optionId: input.optionId,
      currentStep: input.currentStep,
    }),
  });
}

export async function submitQuiz(input: {
  sessionId: string;
  lead: QuizLeadInput;
  answers: QuizAnswers;
}) {
  return apiRequest<QuizSubmitResponse>('/api/quiz/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}
