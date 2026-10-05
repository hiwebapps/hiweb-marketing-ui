import { isAppError } from '../shared/errors';

export function jsonError(error: unknown): Response {
  if (isAppError(error)) {
    return Response.json({ error: error.message, code: error.code }, { status: error.statusCode });
  }

  if (error instanceof Error && error.message === 'SESSION_NOT_FOUND') {
    return Response.json({ error: 'Sesión no encontrada.', code: 'SESSION_NOT_FOUND' }, { status: 404 });
  }

  console.error(error);
  return Response.json({ error: 'Error interno del servidor.', code: 'INTERNAL_ERROR' }, { status: 500 });
}
