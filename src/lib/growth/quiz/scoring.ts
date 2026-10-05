import { QUIZ_QUESTIONS, QUIZ_CATEGORY_LABELS } from "./questions";
import { getResultLevel } from "./result-levels";
import {
  buildServiceRecommendations,
  buildStrengthsAndOpportunities,
} from "./service-recommendations";
import type { CategoryScore, QuizAnswers, QuizScoreResult } from "./types";

function getQuestionMaxScore(questionId: string): number {
  const question = QUIZ_QUESTIONS.find((q) => q.id === questionId);
  if (!question) {
    return 0;
  }
  return Math.max(...question.options.map((o) => o.score));
}

export function calculateQuizScore(answers: QuizAnswers): QuizScoreResult {
  const categoryTotals = new Map<
    string,
    { score: number; maxScore: number }
  >();

  let scoreTotal = 0;
  let scoreMax = 0;

  for (const question of QUIZ_QUESTIONS) {
    const optionId = answers[question.id];
    const option = question.options.find((o) => o.id === optionId);
    const points = option?.score ?? 0;
    const max = getQuestionMaxScore(question.id);

    scoreTotal += points;
    scoreMax += max;

    const current = categoryTotals.get(question.category) ?? {
      score: 0,
      maxScore: 0,
    };
    current.score += points;
    current.maxScore += max;
    categoryTotals.set(question.category, current);
  }

  const categoryScores: CategoryScore[] = Array.from(
    categoryTotals.entries(),
  ).map(([category, { score, maxScore }]) => ({
    category: category as CategoryScore["category"],
    label: QUIZ_CATEGORY_LABELS[category as keyof typeof QUIZ_CATEGORY_LABELS],
    score,
    maxScore,
    percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
  }));

  const scorePercentage =
    scoreMax > 0 ? Math.round((scoreTotal / scoreMax) * 100) : 0;

  const level = getResultLevel(scorePercentage);
  const { strengths, opportunities } =
    buildStrengthsAndOpportunities(categoryScores);

  return {
    scoreTotal,
    scoreMax,
    scorePercentage,
    resultLevel: level.id,
    resultLevelLabel: level.label,
    resultSummary: level.summary,
    categoryScores,
    strengths,
    opportunities,
    recommendedServices: buildServiceRecommendations(categoryScores),
  };
}
