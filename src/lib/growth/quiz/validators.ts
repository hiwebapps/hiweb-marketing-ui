import { QUIZ_QUESTIONS } from "./questions";
import type { QuizAnswers, QuizLeadInput } from "./types";
import { AppError } from "../shared/errors";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateQuizAnswers(answers: QuizAnswers): void {
  if (!answers || typeof answers !== "object") {
    throw new AppError("Respuestas inválidas.", {
      statusCode: 400,
      code: "INVALID_ANSWERS",
    });
  }

  for (const question of QUIZ_QUESTIONS) {
    const optionId = answers[question.id];
    if (!optionId) {
      throw new AppError(`Falta respuesta para: ${question.id}`, {
        statusCode: 400,
        code: "INCOMPLETE_ANSWERS",
      });
    }

    const valid = question.options.some((o) => o.id === optionId);
    if (!valid) {
      throw new AppError(`Opción inválida para: ${question.id}`, {
        statusCode: 400,
        code: "INVALID_OPTION",
      });
    }
  }
}

/** Keeps only known questions with a valid option; drops anything else a client sends. */
export function sanitizeQuizAnswers(answers: unknown): QuizAnswers {
  if (!answers || typeof answers !== "object") return {};
  const clean: QuizAnswers = {};
  for (const question of QUIZ_QUESTIONS) {
    const optionId = (answers as Record<string, unknown>)[question.id];
    if (typeof optionId === "string" && question.options.some((o) => o.id === optionId)) {
      clean[question.id] = optionId;
    }
  }
  return clean;
}

function clip(value: string | undefined, max: number): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

export function validateQuizLead(lead: QuizLeadInput): QuizLeadInput {
  const name = clip(lead.name, 120);
  const email = clip(lead.email, 200)?.toLowerCase();

  if (!name || name.length < 2) {
    throw new AppError("El nombre es obligatorio.", {
      statusCode: 400,
      code: "INVALID_NAME",
    });
  }

  if (!email || !EMAIL_RE.test(email)) {
    throw new AppError("Introduce un email válido.", {
      statusCode: 400,
      code: "INVALID_EMAIL",
    });
  }

  const phone = clip(lead.phone, 40);
  if (phone && phone.length > 0 && phone.length < 7) {
    throw new AppError("El teléfono no parece válido.", {
      statusCode: 400,
      code: "INVALID_PHONE",
    });
  }

  return {
    name,
    email,
    company: clip(lead.company, 120),
    phone: phone || undefined,
    website: clip(lead.website, 300),
    industry: clip(lead.industry, 80),
  };
}

export function sanitizeSessionId(sessionId: unknown): string {
  if (typeof sessionId !== "string" || !/^[a-f0-9-]{36}$/i.test(sessionId)) {
    throw new AppError("Sesión inválida.", {
      statusCode: 400,
      code: "INVALID_SESSION",
    });
  }
  return sessionId;
}
