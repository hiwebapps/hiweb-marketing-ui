import { d1First, d1Run, type GrowthD1 } from '../growth/db/d1';

const PENDING_ID = 'pending';
const DEBOUNCE_MS = 60_000;

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
  if (!Number.isFinite(requestedAt) || now - requestedAt < DEBOUNCE_MS) return 'waiting' as const;

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
