import { createId } from '../shared/utils';
import type { QuizAnswers, QuizLeadInput, QuizScoreResult } from '../quiz/types';
import { d1First, d1Run, getD1 } from './d1';

export type QuizSessionRow = {
  sessionId: string;
  currentStep: number;
  answers: QuizAnswers;
  updatedAt: string;
};

type SessionDbRow = {
  session_id: string;
  current_step: number;
  answers_json: string;
  updated_at: string;
};

function mapSessionRow(row: SessionDbRow): QuizSessionRow {
  return {
    sessionId: row.session_id,
    currentStep: row.current_step,
    answers: JSON.parse(row.answers_json) as QuizAnswers,
    updatedAt: row.updated_at,
  };
}

export async function createQuizSession(): Promise<QuizSessionRow | null> {
  const sessionId = createId();
  const updatedAt = new Date().toISOString();
  const row = { sessionId, currentStep: 0, answers: {}, updatedAt };
  const d1 = getD1();
  if (!d1) return null;

  await d1Run(
    d1,
    `INSERT INTO quiz_sessions (session_id, current_step, answers_json, updated_at)
     VALUES (?, 0, '{}', ?)`,
    sessionId,
    updatedAt,
  );
  return row;
}

export async function getQuizSession(sessionId: string): Promise<QuizSessionRow | null> {
  const d1 = getD1();
  if (!d1) return null;

  const row = await d1First<SessionDbRow>(
    d1,
    `SELECT session_id, current_step, answers_json, updated_at
     FROM quiz_sessions WHERE session_id = ?`,
    sessionId,
  );
  return row ? mapSessionRow(row) : null;
}

export async function updateQuizSession(
  sessionId: string,
  answers: QuizAnswers,
  currentStep: number,
): Promise<QuizSessionRow | null> {
  const updatedAt = new Date().toISOString();
  const answersJson = JSON.stringify(answers);
  const d1 = getD1();
  if (!d1) return null;

  const result = await d1Run(
    d1,
    `UPDATE quiz_sessions
     SET answers_json = ?, current_step = ?, updated_at = ?
     WHERE session_id = ?`,
    answersJson,
    currentStep,
    updatedAt,
    sessionId,
  );
  if ((result.meta?.changes ?? 0) === 0) {
    throw new Error('SESSION_NOT_FOUND');
  }
  return { sessionId, currentStep, answers, updatedAt };
}

export async function deleteQuizSession(sessionId: string): Promise<void> {
  const d1 = getD1();
  if (!d1) return;
  await d1Run(d1, `DELETE FROM quiz_sessions WHERE session_id = ?`, sessionId);
}

export async function insertQuizLead(
  lead: QuizLeadInput,
  result: QuizScoreResult,
  answers: QuizAnswers,
): Promise<string | null> {
  const id = createId();
  const createdAt = new Date().toISOString();
  const d1 = getD1();
  if (!d1) return null;

  await d1Run(
    d1,
    `INSERT INTO quiz_leads (
      id, name, company, email, phone, website, industry,
      score_total, score_percentage, result_level, recommended_services,
      answers_json, category_scores_json, pending_sync, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
    id,
    lead.name,
    lead.company ?? null,
    lead.email,
    lead.phone ?? null,
    lead.website ?? null,
    lead.industry ?? null,
    result.scoreTotal,
    result.scorePercentage,
    result.resultLevel,
    JSON.stringify(result.recommendedServices),
    JSON.stringify(answers),
    JSON.stringify(result.categoryScores),
    createdAt,
  );
  return id;
}
