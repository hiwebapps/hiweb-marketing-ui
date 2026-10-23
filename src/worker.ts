import astroWorker from '@astrojs/cloudflare/entrypoints/server';
import { flushDueRebuild, type RebuildCronEnv } from './lib/rebuild/flush';

type CronContext = {
  waitUntil(promise: Promise<unknown>): void;
};

/** Unfinished quiz sessions older than this are deleted by the cron. */
const QUIZ_SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

async function purgeOldQuizSessions(env: RebuildCronEnv) {
  if (!env.DATABASE) return;
  const cutoff = new Date(Date.now() - QUIZ_SESSION_TTL_MS).toISOString();
  await env.DATABASE.prepare('DELETE FROM quiz_sessions WHERE updated_at < ?').bind(cutoff).run();
}

export default {
  fetch: astroWorker.fetch,
  async scheduled(_event: unknown, env: RebuildCronEnv, context: CronContext) {
    context.waitUntil(flushDueRebuild(env));
    context.waitUntil(purgeOldQuizSessions(env));
  },
};
