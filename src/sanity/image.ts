import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { SANITY_DATASET, SANITY_PROJECT_ID } from './client';

const builder = createImageUrlBuilder({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
});

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export function urlForWidth(source: SanityImageSource | undefined | null, width: number) {
  if (!source) return undefined;
  return urlFor(source).width(width).auto('format').url();
}
