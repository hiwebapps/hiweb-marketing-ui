import type { GrowthD1 } from '../growth/db/d1';
import { canDispatchRebuild, dispatchRebuild, type RebuildBindings } from './dispatch';
import { flushRebuildIfDue } from './queue';

export type RebuildCronEnv = RebuildBindings & {
  DATABASE?: GrowthD1;
};

export async function flushDueRebuild(env: RebuildCronEnv) {
  if (!canDispatchRebuild(env) || !env.DATABASE) return 'skipped' as const;
  return flushRebuildIfDue(env.DATABASE, () => dispatchRebuild(env));
}
