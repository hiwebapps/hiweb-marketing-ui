/** Old Spanish URLs from the Webflow sitemap on www.hiwebmarketing.com. */
const PAGES: Record<string, string> = {
  '/blogs': '/blog',
  '/gracias': '/',
  '/cotiza-ahora/ads': '/calendario',
  // Webflow ads landing, still linked from two English posts.
  '/ads/desarrollo-de-sitios-web': '/servicios/agencia-de-desarrollo-web',
  '/estados/agencia-de-marketing-digital-en-monterrey': '/',
  '/estados/agencia-de-marketing-digital-en-cancun': '/',
  '/servicios/agencia-posicionamiento-seo': '/servicios/agencia-seo',
  '/servicios/promocion-google-ads': '/servicios/agencia-de-google-ads',
  '/servicios/meta-ads-publicidad-redes-sociales': '/servicios/agencia-de-facebook-ads',
  '/servicios/agencia-redes-sociales': '/servicios/gestion-de-redes-sociales',
  '/servicios/diseno-desarrollo-web-mexico': '/servicios/agencia-de-desarrollo-web',
  '/servicios/crm-automatizacion-empresas': '/servicios/crm-para-empresas',
  '/servicios/branding': '/servicios/agencia-de-branding',
  '/servicios/ia-marketing': '/servicios/marketing-con-inteligencia-artificial',
  '/servicios/community-manager': '/servicios/servicio-de-community-manager',
  // Short slugs still linked from older posts.
  '/servicios/seo': '/servicios/agencia-seo',
  '/servicios/redes-sociales': '/servicios/gestion-de-redes-sociales',
  '/servicios/desarrollo-web': '/servicios/agencia-de-desarrollo-web',
  '/servicios/diseno-web': '/servicios/agencia-de-desarrollo-web',
  '/industrias/automotive-marketing-agency': '/industrias/agencia-de-marketing-automotriz',
  // Old post URLs with traffic in Search Console (typos and earlier slugs).
  '/blogs/cuanto-cobra-agencia-marketing': '/blog/cuanto-cobra-una-agencia-de-marketing-digital-en-mexico',
  '/blogs/cuanto-cobra-agencia-marketing-digital-mexico': '/blog/cuanto-cobra-una-agencia-de-marketing-digital-en-mexico',
  '/blogs/cuanto-cobra-instagram-por-pauta-en-mexico': '/blog/cuanto-cobra-instagram-por-publicidad-en-mexico',
  '/blogs/cuanto-cobra-instagram-por-publicidad-in-mexico': '/blog/cuanto-cobra-instagram-por-publicidad-en-mexico',
  '/blogs/cuanto-cuesta-un-anuncio-en-instagram-en-mexico': '/blog/cuanto-cobra-instagram-por-publicidad-en-mexico',
  '/blogs/consejodigital.mx/cuanto-cobra-facebook-por-publicidad-en-2025-guia-completa-para-pymes-en-mexico': '/blog/cuanto-cobra-instagram-por-publicidad-en-mexico',
  '/blogs/estandares-de-de-diseno-web-claves-para-un-sitio-efectivo-y-accesible': '/blog/estandares-de-diseno-web-claves-para-un-sitio-efectivo-y-accesible',
  '/blogs/estandares-diseno-web-claves-para-un-sitio-efectivo-y-accesible': '/blog/estandares-de-diseno-web-claves-para-un-sitio-efectivo-y-accesible',
  '/blogs/estudio-de-mercado-hierro-o-plata': '/blog/estudio-de-mercado-para-joyeria-claves-para-entender-el-sector-en-mexico-y-el-mundo',
  '/blogs/estudio-de-mercado-para-joyeria-claves-para-entender-el-sector-en-mexico-y-y-mundo': '/blog/estudio-de-mercado-para-joyeria-claves-para-entender-el-sector-en-mexico-y-el-mundo',
  '/blogs/pasos-para-campana-publicitaria-redes-sociales': '/blog/pasos-para-hacer-una-campana-publicitaria-en-redes-sociales',
  '/blogs/pasos-para-haced-una-campana-publicitaria-en-redes-sociales': '/blog/pasos-para-hacer-una-campana-publicitaria-en-redes-sociales',
  '/blogs/pasos-para-la-campana-publicitaria-en-redes-sociales': '/blog/pasos-para-hacer-una-campana-publicitaria-en-redes-sociales',
  '/blogs/que-se-considera-gasto-de-mercadotecnia': '/blog/que-se-considera-un-gasto-de-mercadotecnia',
};

/** Current Spanish URL for an old one, or undefined when the path is already current. */
export function legacySpanishPath(path: string): string | undefined {
  if (PAGES[path]) return PAGES[path];
  if (path.startsWith('/blogs/')) return `/blog/${path.slice('/blogs/'.length)}`;
  return undefined;
}
