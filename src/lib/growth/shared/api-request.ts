const FRIENDLY_NETWORK_ERROR =
  'No pudimos conectar con el servidor. Recarga la página e inténtalo de nuevo.';

const FRIENDLY_REQUEST_ERROR =
  'No pudimos completar la solicitud. Inténtalo de nuevo en unos momentos.';

function friendlyHttpError(status: number): string {
  if (status === 404) return FRIENDLY_NETWORK_ERROR;
  return FRIENDLY_REQUEST_ERROR;
}

export async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new Error(FRIENDLY_NETWORK_ERROR);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error(friendlyHttpError(response.status));
  }

  let data: T & { error?: string };
  try {
    data = (await response.json()) as T & { error?: string };
  } catch {
    throw new Error(FRIENDLY_NETWORK_ERROR);
  }

  if (!response.ok) {
    throw new Error(data.error ?? friendlyHttpError(response.status));
  }

  return data;
}
