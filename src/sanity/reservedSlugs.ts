/** Slugs that belong to file-based Astro routes. Landing pages cannot reuse them. */
export const RESERVED_SLUGS = [
  'servicios',
  'industrias',
  'portafolio',
  'blog',
  'nosotros',
  'contacto',
  'design-system',
  'sections',
  'terminos',
  'aviso-de-privacidad',
  'work',
  'contact',
  'api',
  'studio',
  'sitemap.xml',
  'robots.txt',
] as const;

export function isReservedSlug(slug: string | undefined): boolean {
  if (!slug) return false;
  return (RESERVED_SLUGS as readonly string[]).includes(slug);
}
