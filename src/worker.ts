import astroWorker from '@astrojs/cloudflare/entrypoints/server';
import { flushDueRebuild, type RebuildCronEnv } from './lib/rebuild/flush';

type CronContext = {
  waitUntil(promise: Promise<unknown>): void;
};

export default {
  fetch: astroWorker.fetch,
  async scheduled(_event: unknown, env: RebuildCronEnv, context: CronContext) {
    context.waitUntil(flushDueRebuild(env));
  },
};
