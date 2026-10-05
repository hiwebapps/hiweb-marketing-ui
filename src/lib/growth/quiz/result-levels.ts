import type { QuizResultLevelId } from "./types";

export type ResultLevelDefinition = {
  id: QuizResultLevelId;
  label: string;
  minPercentage: number;
  summary: string;
};

export const QUIZ_RESULT_LEVELS: ResultLevelDefinition[] = [
  {
    id: "initial",
    label: "Nivel inicial",
    minPercentage: 0,
    summary:
      "Tu marketing digital está en una etapa temprana. Hay una gran oportunidad de construir bases sólidas.",
  },
  {
    id: "developing",
    label: "En desarrollo",
    minPercentage: 35,
    summary:
      "Ya tienes piezas activas, pero faltan integración, medición y optimización para escalar resultados.",
  },
  {
    id: "advanced",
    label: "Avanzado",
    minPercentage: 60,
    summary:
      "Tu operación de marketing es sólida en varias áreas. El siguiente paso es afinar y escalar lo que funciona.",
  },
  {
    id: "optimized",
    label: "Optimizado",
    minPercentage: 82,
    summary:
      "Tienes una base madura de marketing digital. Podemos ayudarte a innovar y maximizar el retorno.",
  },
];

export function getResultLevel(
  scorePercentage: number,
): ResultLevelDefinition {
  const sorted = [...QUIZ_RESULT_LEVELS].sort(
    (a, b) => b.minPercentage - a.minPercentage,
  );
  return (
    sorted.find((level) => scorePercentage >= level.minPercentage) ??
    QUIZ_RESULT_LEVELS[0]
  );
}
