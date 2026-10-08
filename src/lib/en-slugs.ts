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

/** Public slugs on the service drafts, keyed back to the photo and icon maps. */
const SERVICE_SLUG_ALIAS: Record<string, string> = {
  'gestion-de-redes-sociales': 'redes-sociales',
  'agencia-seo': 'seo',
  'agencia-de-facebook-ads': 'meta-ads',
  'agencia-de-google-ads': 'google-ads',
  'agencia-de-branding': 'branding',
  'crm-para-empresas': 'crm-automatizacion',
  'servicio-de-community-manager': 'community-manager',
  'marketing-con-inteligencia-artificial': 'ia-marketing',
  'agencia-de-desarrollo-web': 'desarrollo-web',
  'web-design-and-development': 'desarrollo-web',
};

export function englishServiceSlug(slug: string) {
  return EN_SERVICE_SLUG[slug] ?? slug;
}

/** Asset and copy maps are keyed by the Spanish slug. */
export function serviceContentKey(slug: string) {
  const clean = slug.replace(/\u200b/g, '');
  return SPANISH_SERVICE_SLUG.get(clean) ?? SERVICE_SLUG_ALIAS[clean] ?? clean;
}
