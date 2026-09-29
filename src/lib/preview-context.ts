import { AsyncLocalStorage } from 'node:async_hooks';

export type PreviewState = {
  perspective: string;
  stega: boolean;
};

const storage = new AsyncLocalStorage<PreviewState>();

/** Keeps the Presentation perspective on this request without threading cookies through every loader. */
export function runWithPreview<T>(state: PreviewState | undefined, fn: () => T): T {
  if (!state?.stega) return fn();
  return storage.run(state, fn);
}

export function getPreviewState() {
  return storage.getStore();
}
