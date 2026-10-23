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
};

/** Current Spanish URL for an old one, or undefined when the path is already current. */
export function legacySpanishPath(path: string): string | undefined {
  if (PAGES[path]) return PAGES[path];
  if (path.startsWith('/blogs/')) return `/blog/${path.slice('/blogs/'.length)}`;
  return undefined;
}
