/**
 * Published Spanish slug → published English slug. Keep in sync with Studio:
 * a slug changed there needs its pair here, or the language switch falls back to the old one.
 */
export const EN_SERVICE_SLUG: Record<string, string> = {
  'agencia-seo': 'seo-and-aeo-agency-rank-on-google-and-ai-search',
  'agencia-de-google-ads': 'google-ads-agency-and-management-company',
  'agencia-de-facebook-ads': 'meta-ads-agency-for-facebook-and-instagram-ads',
  'gestion-de-redes-sociales': 'social-media-management-agency',
  'agencia-de-branding': 'branding-agency-for-brand-identity-and-strategy',
  'servicio-de-community-manager': 'community-management-services-for-brands',
  'agencia-de-desarrollo-web': 'web-design-and-development',
  'crm-para-empresas': 'crm-implementation-and-automation-services',
  'marketing-con-inteligencia-artificial': 'ai-marketing-automation-and-chatbots-for-business',
  'desarrollo-de-ecommerce': 'custom-ecommerce-development',
  'agencia-de-inbound-marketing-mexico': 'inbound-marketing-agency-for-b2b-companies',
  'agencia-de-chatgpt-ads': 'chatgpt-ads-agency',
};

export const EN_INDUSTRY_SLUG: Record<string, string> = {
  'marketing-de-servicios-profesionales': 'professional-services-marketing',
  'agencia-de-marketing-automotriz': 'automotive-marketing-agency',
  'marketing-digital-inmobiliario': 'real-estate-marketing-agency',
  'agencia-de-marketing-industrial': 'manufacturing-marketing-agency',
  'marketing-digital-para-restaurantes': 'restaurant-marketing',
  'marketing-para-saas': 'saas-marketing-agency',
  'agencia-de-marketing-medico': 'healthcare-marketing-agency',
  'marketing-turistico': 'hospitality-marketing-agency',
};

/** Content key (photo and icon maps) → published Spanish slug. */
const SERVICE_KEY_SLUG: Record<string, string> = {
  seo: 'agencia-seo',
  'google-ads': 'agencia-de-google-ads',
  'meta-ads': 'agencia-de-facebook-ads',
  'redes-sociales': 'gestion-de-redes-sociales',
  branding: 'agencia-de-branding',
  'community-manager': 'servicio-de-community-manager',
  'desarrollo-web': 'agencia-de-desarrollo-web',
  'crm-automatizacion': 'crm-para-empresas',
  'ia-marketing': 'marketing-con-inteligencia-artificial',
};

function invert(map: Record<string, string>) {
  return new Map(Object.entries(map).map(([key, value]) => [value, key]));
}

const ES_SERVICE_SLUG = invert(EN_SERVICE_SLUG);
const ES_INDUSTRY_SLUG = invert(EN_INDUSTRY_SLUG);
const SERVICE_SLUG_KEY = invert(SERVICE_KEY_SLUG);

function clean(slug: string) {
  return slug.replace(/\u200b/g, '');
}

function spanishServicePublicSlug(slug: string) {
  const value = clean(slug);
  return ES_SERVICE_SLUG.get(value) ?? SERVICE_KEY_SLUG[value] ?? value;
}

export function englishServiceSlug(slug: string) {
  const spanish = spanishServicePublicSlug(slug);
  return EN_SERVICE_SLUG[spanish] ?? clean(slug);
}

export function spanishServiceSlug(slug: string) {
  return spanishServicePublicSlug(slug);
}

export function englishIndustrySlug(slug: string) {
  const value = clean(slug);
  return EN_INDUSTRY_SLUG[value] ?? value;
}

export function spanishIndustrySlug(slug: string) {
  const value = clean(slug);
  return ES_INDUSTRY_SLUG.get(value) ?? value;
}

/** Asset and copy maps are keyed by the short Spanish key. */
export function serviceContentKey(slug: string) {
  const spanish = spanishServicePublicSlug(slug);
  return SERVICE_SLUG_KEY.get(spanish) ?? spanish;
}
