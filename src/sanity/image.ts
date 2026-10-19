import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { SANITY_DATASET, SANITY_PROJECT_ID } from './client';

const builder = createImageUrlBuilder({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
});

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/** An empty Studio image (`asset: null`) is not a URL. The builder throws on it. */
function isEmptyImage(source: SanityImageSource): boolean {
  if (typeof source !== 'object' || source === null) return false;
  return 'asset' in source && (source as { asset?: unknown }).asset == null;
}

export function urlForWidth(source: SanityImageSource | undefined | null, width: number) {
  if (!source || isEmptyImage(source)) return undefined;
  try {
    return urlFor(source).width(width).auto('format').url();
  } catch {
    return undefined;
  }
}
