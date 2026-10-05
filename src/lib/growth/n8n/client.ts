import { getServerEnv } from "../shared/env";

/** Añade ?secret= si falta — compatible con webhooks n8n que validan query string. */
export function buildN8nWebhookUrl(url: string, secret?: string): string {
  const trimmed = url.trim();
  if (!trimmed || !secret?.trim()) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (!parsed.searchParams.has("secret")) {
      parsed.searchParams.set("secret", secret.trim());
    }
    return parsed.toString();
  } catch {
    return trimmed;
  }
}

/** Envía el webhook y espera respuesta (necesario en Cloudflare Workers). */
export async function sendN8nWebhook(
  url: string,
  payload: unknown,
  secret?: string,
): Promise<void> {
  if (!url.trim()) {
    console.warn("[n8n] webhook skipped: empty URL");
    return;
  }

  const targetUrl = buildN8nWebhookUrl(url, secret);

  if (!secret?.trim()) {
    console.warn("[n8n] webhook dispatch without secret configured");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (secret?.trim()) {
    headers["X-Webhook-Secret"] = secret;
  }

  const response = await fetch(targetUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error(
      "[n8n] webhook HTTP error:",
      response.status,
      body.slice(0, 200),
    );
  }
}

export function dispatchN8nWebhook(
  url: string,
  payload: unknown,
  secret?: string,
): void {
  void sendN8nWebhook(url, payload, secret).catch((error) => {
    console.error("[n8n] webhook dispatch failed:", error);
  });
}

export function dispatchQuizWebhook(payload: unknown): void {
  const env = getServerEnv();
  dispatchN8nWebhook(
    env.n8nWebhookQuizUrl,
    payload,
    env.n8nWebhookSecret,
  );
}

export async function dispatchCalendarWebhook(payload: unknown): Promise<void> {
  const env = getServerEnv();
  await sendN8nWebhook(
    env.n8nWebhookCalendarUrl,
    payload,
    env.n8nWebhookSecret,
  );
}

