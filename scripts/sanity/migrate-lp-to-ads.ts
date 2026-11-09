/**
 * Campaign landings moved from /lp to /ads. Rewrites every string that starts with /lp/
 * (paths, card links, picker links, URL prefixes) in lpPage documents and their drafts.
 * Each change is a `set` on that exact field, so other edits stay untouched.
 *
 * Dry run:  npx sanity exec scripts/sanity/migrate-lp-to-ads.ts --with-user-token
 * Write:    npx sanity exec scripts/sanity/migrate-lp-to-ads.ts --with-user-token -- --write
 */
import { getCliClient } from 'sanity/cli';

type Doc = Record<string, unknown> & { _id: string; _rev: string };

const write = process.argv.includes('--write');
const client = getCliClient({ apiVersion: '2024-01-01', useCdn: false });

function moved(value: string) {
  if (value === '/lp') return '/ads';
  return value.startsWith('/lp/') ? `/ads/${value.slice(4)}` : null;
}

/** Sanity patch paths address array items by _key when they have one. */
function collect(value: unknown, path: string, out: Record<string, string>) {
  if (typeof value === 'string') {
    const next = moved(value);
    if (next) out[path] = next;
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const key = item && typeof item === 'object' && typeof (item as { _key?: unknown })._key === 'string'
        ? `[_key=="${(item as { _key: string })._key}"]`
        : `[${index}]`;
      collect(item, `${path}${key}`, out);
    });
    return;
  }
  if (value && typeof value === 'object') {
    for (const [name, item] of Object.entries(value)) {
      if (name.startsWith('_')) continue;
      collect(item, path ? `${path}.${name}` : name, out);
    }
  }
}

const docs = await client.fetch<Doc[]>('*[_type == "lpPage"]', {}, { perspective: 'raw' });
let total = 0;
for (const doc of docs) {
  const changes: Record<string, string> = {};
  collect(doc, '', changes);
  const count = Object.keys(changes).length;
  if (!count) continue;
  total += count;
  console.log(`${doc._id}: ${count} campos${write ? '' : ' (simulación)'}`);
  if (write) await client.patch(doc._id).ifRevisionId(doc._rev).set(changes).commit();
}
console.log(`${write ? 'Listo' : 'Simulación'}: ${total} campos en ${docs.length} documentos.`);
