import { d1First, d1Run, type GrowthD1 } from '../growth/db/d1';

const PENDING_ID = 'pending';
/** Quiet period after the last Publish. A newer publish restarts the clock. */
export const REBUILD_DEBOUNCE_MS = 10 * 60 * 1000;

export async function markRebuildRequested(db: GrowthD1, now = new Date()) {
  await d1Run(
    db,
    `INSERT INTO rebuild_requests (id, requested_at) VALUES (?, ?)
     ON CONFLICT(id) DO UPDATE SET requested_at = excluded.requested_at`,
    PENDING_ID,
    now.toISOString(),
  );
}

export async function flushRebuildIfDue(db: GrowthD1, fire: () => Promise<boolean>, now = Date.now()) {
  const row = await d1First<{ requested_at: string }>(
    db,
    'SELECT requested_at FROM rebuild_requests WHERE id = ?',
    PENDING_ID,
  );
  if (!row?.requested_at) return 'idle' as const;

  const requestedAt = Date.parse(row.requested_at);
  if (!Number.isFinite(requestedAt) || now - requestedAt < REBUILD_DEBOUNCE_MS) return 'waiting' as const;

  const deleted = await d1Run(
    db,
    'DELETE FROM rebuild_requests WHERE id = ? AND requested_at = ?',
    PENDING_ID,
    row.requested_at,
  );
  if (!deleted.meta?.changes) return 'superseded' as const;

  let fired = false;
  try {
    fired = await fire();
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Rebuild dispatch failed');
    fired = false;
  }
  if (!fired) {
    await d1Run(
      db,
      `INSERT INTO rebuild_requests (id, requested_at) VALUES (?, ?)
       ON CONFLICT(id) DO NOTHING`,
      PENDING_ID,
      row.requested_at,
    );
    return 'retry' as const;
  }
  return 'fired' as const;
}

export async function readRebuildStatus(db: GrowthD1) {
  const row = await d1First<{ requested_at: string }>(
    db,
    'SELECT requested_at FROM rebuild_requests WHERE id = ?',
    PENDING_ID,
  );
  const requestedAt = Date.parse(row?.requested_at ?? '');
  if (!row?.requested_at || !Number.isFinite(requestedAt)) {
    return { queued: false, deployAt: null as string | null };
  }
  return {
    queued: true,
    deployAt: new Date(requestedAt + REBUILD_DEBOUNCE_MS).toISOString(),
  };
}

/** Removes the pending row so a manual deploy is not also fired by the cron. */
export async function clearPendingRebuild(db: GrowthD1) {
  const row = await d1First<{ requested_at: string }>(
    db,
    'SELECT requested_at FROM rebuild_requests WHERE id = ?',
    PENDING_ID,
  );
  if (!row?.requested_at) return null;
  const deleted = await d1Run(
    db,
    'DELETE FROM rebuild_requests WHERE id = ? AND requested_at = ?',
    PENDING_ID,
    row.requested_at,
  );
  if (!deleted.meta?.changes) return null;
  return row.requested_at;
}

export async function restorePendingRebuild(db: GrowthD1, requestedAt: string) {
  await d1Run(
    db,
    `INSERT INTO rebuild_requests (id, requested_at) VALUES (?, ?)
     ON CONFLICT(id) DO NOTHING`,
    PENDING_ID,
    requestedAt,
  );
}
