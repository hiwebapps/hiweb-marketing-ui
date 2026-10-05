import { createQuizSession } from "./client";
import { createId } from "../shared/utils";

/**
 * Inicia sesión de quiz. Si la API falla (p. ej. Cloud sin SQLite),
 * genera un id local; las respuestas viven en el estado del cliente.
 */
export async function startQuizSession(): Promise<string> {
  try {
    const session = await createQuizSession();
    return session.sessionId;
  } catch {
    return createId();
  }
}
