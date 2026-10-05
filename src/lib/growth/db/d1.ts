import { env } from 'cloudflare:workers';

type D1ResultMeta = { changes?: number };

export type D1Prepared = {
  bind(...values: unknown[]): D1Prepared;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results?: T[] }>;
  run(): Promise<{ meta?: D1ResultMeta }>;
};

export type GrowthD1 = {
  prepare(sql: string): D1Prepared;
};

export function getD1(): GrowthD1 | null {
  const database = (env as { DATABASE?: GrowthD1 }).DATABASE;
  return database ?? null;
}

export async function d1Run(db: GrowthD1, sql: string, ...params: unknown[]) {
  return db.prepare(sql).bind(...params).run();
}

export async function d1First<T>(db: GrowthD1, sql: string, ...params: unknown[]) {
  return db.prepare(sql).bind(...params).first<T>();
}

export async function d1All<T>(db: GrowthD1, sql: string, ...params: unknown[]) {
  const result = await db.prepare(sql).bind(...params).all<T>();
  return result.results ?? [];
}
