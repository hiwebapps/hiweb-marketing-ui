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

export function validateQuizLead(lead: QuizLeadInput): QuizLeadInput {
  const name = lead.name?.trim();
  const email = lead.email?.trim().toLowerCase();

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

  const phone = lead.phone?.trim();
  if (phone && phone.length > 0 && phone.length < 7) {
    throw new AppError("El teléfono no parece válido.", {
      statusCode: 400,
      code: "INVALID_PHONE",
    });
  }

  return {
    name,
    email,
    company: lead.company?.trim() || undefined,
    phone: phone || undefined,
    website: lead.website?.trim() || undefined,
    industry: lead.industry?.trim() || undefined,
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
