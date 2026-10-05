import type { QuizScoreResult } from "./types";

export const QUIZ_RESULT_STORAGE_KEY = "hiweb-quiz-result";

export type StoredQuizResult = {
  leadId: string;
  result: QuizScoreResult;
  savedAt: string;
};

export function saveQuizResult(payload: {
  leadId: string;
  result: QuizScoreResult;
}): void {
  if (typeof window === "undefined") {
    return;
  }

  const stored: StoredQuizResult = {
    ...payload,
    savedAt: new Date().toISOString(),
  };

  sessionStorage.setItem(QUIZ_RESULT_STORAGE_KEY, JSON.stringify(stored));
}

export function loadQuizResult(): StoredQuizResult | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(QUIZ_RESULT_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as StoredQuizResult;
  } catch {
    return null;
  }
}
