import { englishIndustrySlug, englishServiceSlug } from './en-slugs';
import { DEFAULT_ABOUT_EN_SLUG } from './page-meta';

/** Old English URLs: Spanish prefixes, hiwebmarketing.com slugs and Spanish slugs. */
const PREFIXES: [string, string][] = [
  ['/en/servicios', '/en/services'],
  ['/en/industrias', '/en/industries'],
  ['/en/portafolio', '/en/success-stories'],
  ['/en/portfolio', '/en/success-stories'],
];

const PAGES: Record<string, string> = {
  '/en/servicios': '/en',
  '/en/services': '/en',
  '/en/industrias': '/en',
  '/en/industries': '/en',
  '/en/portafolio': '/en/success-stories',
  '/en/portfolio': '/en/success-stories',
  '/en/marketing-portafolio': '/en/success-stories',
  '/en/calendario': '/en/calendar',
  '/en/contacto': '/en/contact',
  '/en/terminos': '/en/terms',
  '/en/aviso-de-privacidad': '/en/privacy-policy',
  '/en/nosotros': `/en/${DEFAULT_ABOUT_EN_SLUG}`,
  '/en/blog': '/en/blogs',
  // Spanish-only post that the Webflow sitemap listed under /en.
  '/en/blogs/las-mejores-herramientas-de-marketing-digital': '/blog/las-mejores-herramientas-de-marketing-digital',
};

/** hiwebmarketing.com/en service slugs → content key. */
const SERVICE_ALIASES: Record<string, string> = {
  'google-ads-management-services': 'google-ads',
  'social-media': 'redes-sociales',
  'agencia-redes-sociales': 'redes-sociales',
  'web-design': 'desarrollo-web',
  'web-development': 'desarrollo-web',
  'crm-automation': 'crm-automatizacion',
  'crm-automatizacion-empresas': 'crm-automatizacion',
  'ai-tools-for-marketing': 'ia-marketing',
};

/** Short industry keys used in old menus → published Spanish slug. */
const INDUSTRY_ALIASES: Record<string, string> = {
  manufactura: 'agencia-de-marketing-industrial',
  salud: 'agencia-de-marketing-medico',
  inmobiliarias: 'marketing-digital-inmobiliario',
  restaurantes: 'marketing-digital-para-restaurantes',
  restaurants: 'marketing-digital-para-restaurantes',
  saas: 'marketing-para-saas',
  'turismo-hoteleria': 'marketing-turistico',
  automotive: 'agencia-de-marketing-automotriz',
  'servicios-profesionales': 'marketing-de-servicios-profesionales',
};

/** Previous English post slug → current English post slug. */
const POST_SLUGS: Record<string, string> = {
  'agencias-de-publicidad-en-merida': 'advertising-agencies-in-merida',
  'aranceles-a-textiles': 'textile-tariffs-marketing-mexico',
  'campanas-publicitarias-en-redes-sociales': 'social-media-advertising-campaigns',
  'como-ser-la-primera-opcion-de-busqueda-en-google': 'how-to-rank-first-on-google',
  'diseno-ux-and-ui': 'ux-ui-design',
  'estructura-de-una-pagina-web': 'website-structure',
  'la-mejor-empresa-de-seo-en-mexico': 'best-seo-agency-in-mexico',
  'leads-marketing-ventas-b2b': 'lead-generation-b2b-sales-leads',
  'marketing-turistico-hoteles-destinos': 'travel-marketing-hotels-destinations',
  'para-que-sirve-una-pagina-web': 'what-is-a-website-for',
  'pasos-para-hacer-una-campana-publicitaria-en-redes-sociales': 'steps-to-create-a-social-media-ad-campaign',
  'por-que-usar-ia-en-tu-sitio-web': 'why-use-ai-on-your-website',
  'que-debes-considerar-al-contratar-un-servicio-de-diseno-web': 'what-to-consider-when-hiring-web-design',
  'que-se-considera-un-gasto-de-mercadotecnia': 'what-counts-as-a-marketing-expense',
  'san-valentin-marketing': 'valentines-day-marketing',
  'seo-local': 'local-seo-google-business-profile',
};

/** Current English URL for an old one, or undefined when the path is already current. */
export function legacyEnglishPath(path: string): string | undefined {
  if (PAGES[path]) return PAGES[path];
  let next = path;
  for (const [from, to] of PREFIXES) {
    if (next.startsWith(`${from}/`)) next = to + next.slice(from.length);
  }
  const service = next.match(/^\/en\/services\/([^/]+)$/);
  if (service) next = `/en/services/${englishServiceSlug(SERVICE_ALIASES[service[1]] ?? service[1])}`;
  const industry = next.match(/^\/en\/industries\/([^/]+)$/);
  if (industry) next = `/en/industries/${englishIndustrySlug(INDUSTRY_ALIASES[industry[1]] ?? industry[1])}`;
  const post = next.match(/^\/en\/blogs\/([^/]+)$/);
  if (post && POST_SLUGS[post[1]]) next = `/en/blogs/${POST_SLUGS[post[1]]}`;
  return next === path ? undefined : next;
}
