export type QuizCategoryId =
  | "seo"
  | "advertising"
  | "content"
  | "analytics";

export type QuizOption = {
  id: string;
  label: string;
  score: number;
};

export type QuizQuestion = {
  id: string;
  category: QuizCategoryId;
  question: string;
  helpText?: string;
  options: QuizOption[];
};

export type QuizAnswers = Record<string, string>;

export type CategoryScore = {
  category: QuizCategoryId;
  label: string;
  score: number;
  maxScore: number;
  percentage: number;
};

export type QuizResultLevelId =
  | "initial"
  | "developing"
  | "advanced"
  | "optimized";

export type QuizScoreResult = {
  scoreTotal: number;
  scoreMax: number;
  scorePercentage: number;
  resultLevel: QuizResultLevelId;
  resultLevelLabel: string;
  resultSummary: string;
  categoryScores: CategoryScore[];
  strengths: string[];
  opportunities: string[];
  recommendedServices: string[];
};

export type QuizLeadInput = {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  website?: string;
  industry?: string;
};

export type QuizSessionRecord = {
  sessionId: string;
  currentStep: number;
  answers: QuizAnswers;
  updatedAt: string;
};

export type QuizSubmitResponse = {
  leadId: string;
  result: QuizScoreResult;
};
