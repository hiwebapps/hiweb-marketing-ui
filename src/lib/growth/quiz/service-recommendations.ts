import type { CategoryScore, QuizCategoryId } from "./types";

const SERVICE_BY_CATEGORY: Record<QuizCategoryId, string[]> = {
  seo: [
    "Auditoría SEO técnica y de contenidos",
    "Estrategia de posicionamiento orgánico",
  ],
  advertising: [
    "Gestión de campañas Google Ads y Meta Ads",
    "Optimización de embudos y landing pages",
  ],
  content: [
    "Estrategia de contenidos y copywriting",
    "Producción de contenido para redes y blog",
  ],
  analytics: [
    "Implementación de tracking y GA4",
    "Dashboards y reporting de marketing",
  ],
};

const GENERAL_SERVICES = [
  "Consultoría de marketing digital integral",
  "Automatización de nutrición de leads",
];

export function buildServiceRecommendations(
  categoryScores: CategoryScore[],
  limit = 5,
): string[] {
  const weak = [...categoryScores]
    .sort((a, b) => a.percentage - b.percentage)
    .filter((c) => c.percentage < 70);

  const picked = new Set<string>();

  for (const cat of weak) {
    for (const service of SERVICE_BY_CATEGORY[cat.category]) {
      picked.add(service);
      if (picked.size >= limit) {
        return [...picked];
      }
    }
  }

  for (const service of GENERAL_SERVICES) {
    picked.add(service);
    if (picked.size >= limit) {
      break;
    }
  }

  return [...picked].slice(0, limit);
}

export function buildStrengthsAndOpportunities(
  categoryScores: CategoryScore[],
): { strengths: string[]; opportunities: string[] } {
  const strengths = categoryScores
    .filter((c) => c.percentage >= 70)
    .map((c) => `${c.label}: buen nivel (${c.percentage}%)`);

  const opportunities = categoryScores
    .filter((c) => c.percentage < 70)
    .map((c) => `${c.label}: margen de mejora (${c.percentage}%)`);

  return {
    strengths: strengths.length > 0 ? strengths : ["Base lista para escalar con un plan integral"],
    opportunities:
      opportunities.length > 0
        ? opportunities
        : ["Mantener optimización continua en todos los canales"],
  };
}
