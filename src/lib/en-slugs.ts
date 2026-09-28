/**
 * Public English service slugs on hiwebmarketing.com/en.
 * Spanish documents keep the left-hand slug; English documents use the right-hand one.
 */
export const EN_SERVICE_SLUG: Record<string, string> = {
  'google-ads': 'google-ads-management-services',
  'redes-sociales': 'social-media',
  'desarrollo-web': 'web-development',
  'crm-automatizacion': 'crm-automation',
  'ia-marketing': 'ai-tools-for-marketing',
};

const SPANISH_SERVICE_SLUG = new Map(
  Object.entries(EN_SERVICE_SLUG).map(([spanish, english]) => [english, spanish]),
);

export function englishServiceSlug(slug: string) {
  return EN_SERVICE_SLUG[slug] ?? slug;
}

/** Asset and copy maps are keyed by the Spanish slug. */
export function serviceContentKey(slug: string) {
  return SPANISH_SERVICE_SLUG.get(slug) ?? slug;
}
