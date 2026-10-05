import { env } from 'cloudflare:workers';

export type ServerEnv = {
  n8nWebhookQuizUrl: string;
  n8nWebhookCalendarUrl: string;
  n8nWebhookSecret: string;
  googleServiceAccountEmail: string;
  googleServiceAccountPrivateKey: string;
  googleCalendarId: string;
};

function read(name: string): string {
  const runtime = env as Record<string, string | undefined>;
  const fromWorker = runtime[name];
  if (typeof fromWorker === 'string' && fromWorker.trim()) return fromWorker;

  const fromMeta = (import.meta.env as Record<string, string | undefined>)[name];
  if (typeof fromMeta === 'string' && fromMeta.trim()) return fromMeta;

  const fromProcess = typeof process === 'undefined' ? undefined : process.env[name];
  return typeof fromProcess === 'string' ? fromProcess : '';
}

/** Empty strings mean the integration stays off. Leads and bookings still save in D1. */
export function getServerEnv(): ServerEnv {
  return {
    n8nWebhookQuizUrl: read('N8N_WEBHOOK_QUIZ_URL'),
    n8nWebhookCalendarUrl: read('N8N_WEBHOOK_CALENDAR_URL'),
    n8nWebhookSecret: read('N8N_WEBHOOK_SECRET'),
    googleServiceAccountEmail: read('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
    googleServiceAccountPrivateKey: read('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY'),
    googleCalendarId: read('GOOGLE_CALENDAR_ID'),
  };
}
