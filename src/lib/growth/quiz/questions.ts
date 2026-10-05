import type { QuizCategoryId, QuizQuestion } from "./types";

export const QUIZ_CATEGORY_LABELS: Record<QuizCategoryId, string> = {
  seo: "SEO y visibilidad",
  advertising: "Publicidad digital",
  content: "Contenido y marca",
  analytics: "Datos y medición",
};

const scale = (category: QuizCategoryId, id: string, question: string) =>
  ({
    id,
    category,
    question,
    options: [
      { id: `${id}-0`, label: "No lo tenemos / no aplica", score: 0 },
      { id: `${id}-1`, label: "Nivel básico o incipiente", score: 1 },
      { id: `${id}-2`, label: "En marcha con resultados mixtos", score: 2 },
      { id: `${id}-3`, label: "Optimizado y generando resultados", score: 3 },
    ],
  }) satisfies QuizQuestion;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  scale(
    "seo",
    "seo-visibility",
    "¿Tu negocio aparece de forma consistente en búsquedas relevantes de Google?",
  ),
  scale(
    "seo",
    "seo-technical",
    "¿Tu sitio web tiene buena salud técnica (velocidad, móvil, indexación)?",
  ),
  scale(
    "advertising",
    "ads-channels",
    "¿Inviertes de forma planificada en canales pagados (Google, Meta, LinkedIn, etc.)?",
  ),
  scale(
    "advertising",
    "ads-optimization",
    "¿Mides y optimizas campañas con objetivos claros de costo y conversión?",
  ),
  scale(
    "content",
    "content-strategy",
    "¿Tienes una estrategia de contenidos alineada con tu buyer persona?",
  ),
  scale(
    "content",
    "content-distribution",
    "¿Distribuyes y reutilizas contenido en varios canales de forma regular?",
  ),
  scale(
    "analytics",
    "analytics-tracking",
    "¿Tienes tracking fiable de conversiones y embudos (web, formularios, CRM)?",
  ),
  scale(
    "analytics",
    "analytics-decisions",
    "¿Tomas decisiones de marketing basadas en datos y reportes recurrentes?",
  ),
];

export const QUIZ_TOTAL_STEPS = QUIZ_QUESTIONS.length;
