import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/**
 * 1. DATOS REALES, SIN ADIVINAR
 * Business Intelligence: gráfica de barras y curva analítica pura línea.
 */
export function IconDatosReales(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M3 20h18" />
      <path d="M7 16v4" />
      <path d="M12 11v9" />
      <path d="M17 7v13" />
      <polyline points="4 14 9 9 14 13 20 5" />
      <polyline points="15 5 20 5 20 10" />
    </svg>
  );
}

/**
 * 2. TRANSPARENCIA EN CADA REPORTE
 * Transparencia & Auditoría: documento ejecutivo con sello de verificación.
 */
export function IconTransparenciaReporte(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="12" y2="13" />
      <line x1="8" y1="17" x2="11" y2="17" />
      <circle cx="16" cy="16" r="3" />
      <polyline points="14.8 16 15.8 17 17.5 15.2" />
    </svg>
  );
}

/**
 * 3. AJUSTES A TIEMPO
 * Agilidad y optimización: cronómetro de precisión con aceleración y loop de iteración.
 */
export function IconAjustesTiempo(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <line x1="10" y1="2" x2="14" y2="2" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <circle cx="12" cy="14" r="8" />
      <polyline points="12 9 12 14 15.5 12" />
      <path d="M6.5 10a7 7 0 0 1 11-2" strokeDasharray="2 3" />
    </svg>
  );
}

/**
 * 4. UN EQUIPO, NO CINCO PROVEEDORES
 * Ecosistema 360° unificado: nodo central conectado a 5 disciplinas integradas.
 */
export function IconEquipoIntegrado(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="4" r="2" />
      <circle cx="19.5" cy="9.5" r="2" />
      <circle cx="16.5" cy="19.5" r="2" />
      <circle cx="7.5" cy="19.5" r="2" />
      <circle cx="4.5" cy="9.5" r="2" />
      <line x1="12" y1="6" x2="12" y2="9" />
      <line x1="17.7" y1="10.2" x2="14.6" y2="11.2" />
      <line x1="15.2" y1="17.8" x2="13.1" y2="14.7" />
      <line x1="8.8" y1="17.8" x2="10.9" y2="14.7" />
      <line x1="6.3" y1="10.2" x2="9.4" y2="11.2" />
    </svg>
  );
}

/**
 * 5. ESPAÑOL E INGLÉS
 * Cross-border bilingüe nativo: globo terráqueo internacional con paralelos y meridianos.
 */
export function IconEspanolIngles(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <line x1="2.8" y1="8.5" x2="21.2" y2="8.5" />
      <line x1="2.8" y1="15.5" x2="21.2" y2="15.5" />
      <path d="M12 2.5a13.5 13.5 0 0 1 4 9.5 13.5 13.5 0 0 1-4 9.5 13.5 13.5 0 0 1-4-9.5 13.5 13.5 0 0 1 4-9.5z" />
    </svg>
  );
}

/**
 * 6. VIDEO VERTICAL / REELS / TIKTOK
 * Dispositivo móvil vertical con botón play y barra de subtítulos/audio.
 */
export function IconVideoVertical(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <rect x="5.5" y="2" width="13" height="20" rx="3" />
      <circle cx="12" cy="5" r="0.75" fill="currentColor" />
      <polygon points="10 9.5 15.5 12.5 10 15.5 10 9.5" />
      <line x1="8.5" y1="18.5" x2="15.5" y2="18.5" />
    </svg>
  );
}

/**
 * 7. CÓDIGO TÉCNICO / DESARROLLO WEB / INTEGRACIONES
 * Ventana de código / terminal con controles superiores y sintaxis < / >.
 */
export function IconCodigoTecnico(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <rect x="2.5" y="3.5" width="19" height="17" rx="2.5" />
      <line x1="2.5" y1="8" x2="21.5" y2="8" />
      <circle cx="5.8" cy="5.8" r="0.8" fill="currentColor" />
      <circle cx="8.5" cy="5.8" r="0.8" fill="currentColor" />
      <circle cx="11.2" cy="5.8" r="0.8" fill="currentColor" />
      <polyline points="9 11.5 6.5 14 9 16.5" />
      <polyline points="15 11.5 17.5 14 15 16.5" />
      <line x1="13" y1="11" x2="11" y2="17" />
    </svg>
  );
}

/**
 * 8. DISEÑO / CREATIVOS / BRANDING / SISTEMAS VISUALES
 * Paleta de artista y diseño con selecciones cromáticas armónicas.
 */
export function IconDisenoIdentidad(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M12 3a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9 1.5 0 2.5-1 2.5-2.2 0-.6-.3-1.1-.6-1.5-.4-.4-.6-.9-.6-1.3 0-1.1.9-2 2-2h1.7c2.8 0 5-2.2 5-5 0-4.42-4.03-6-10-6z" />
      <circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" />
      <circle cx="16.5" cy="10.5" r="1" fill="currentColor" />
      <circle cx="8.5" cy="15" r="1" fill="currentColor" />
    </svg>
  );
}

/**
 * 9. MENSAJERÍA / ATENCIÓN / CHATBOTS / WHATSAPP
 * Burbuja de diálogo interactivo con puntos de conversación.
 */
export function IconMensajesChat(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M14 19v-2.5h3a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h3l4 2z" />
      <circle cx="8.5" cy="10" r="0.8" fill="currentColor" />
      <circle cx="12" cy="10" r="0.8" fill="currentColor" />
      <circle cx="15.5" cy="10" r="0.8" fill="currentColor" />
    </svg>
  );
}

/**
 * 10. E-COMMERCE / TIENDA / CHECKOUT / PASARELAS DE PAGO
 * Carrito de compras dinámico y moderno con ruedas y estructura geométrica.
 */
export function IconTiendaEcommerce(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M3 4h2.5l2.4 10.2a1.8 1.8 0 0 0 1.8 1.4h8.8a1.8 1.8 0 0 0 1.8-1.4L21.5 7H6" />
      <line x1="10" y1="10.5" x2="16" y2="10.5" />
    </svg>
  );
}

/**
 * 11. SEGURIDAD / RESPALDOS / PROTOCOLO / PROPIEDAD DE CUENTAS
 * Escudo de protección verificado con insignia de seguridad técnica.
 */
export function IconSeguridadEscudo(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M12 2.5 4.5 6v6.2c0 5.4 3.2 9.8 7.5 11.3 4.3-1.5 7.5-5.9 7.5-11.3V6L12 2.5z" />
      <polyline points="9 12 11.2 14.2 15.5 9.8" />
    </svg>
  );
}

/**
 * 12. BÚSQUEDA / TÉRMINOS / INTENCIÓN COMERCIAL / SEO
 * Lente de exploración focal con centro de precisión para keywords.
 */
export function IconBusquedaIntencion(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <circle cx="11" cy="11" r="7.5" />
      <line x1="16.5" y1="16.5" x2="21.5" y2="21.5" />
      <circle cx="11" cy="11" r="2.5" />
    </svg>
  );
}

/**
 * 13. OBJETIVO / ROI / CONVERSIONES / COSTO DE ADQUISICIÓN
 * Diana de puntería con círculos concéntricos y mira de precisión.
 */
export function IconObjetivoConversion(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="12" r="5.5" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
      <line x1="12" y1="2.5" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="21.5" />
      <line x1="2.5" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="21.5" y2="12" />
    </svg>
  );
}

/**
 * 14. COMUNIDAD / EQUIPO / ADOPCIÓN / VENTAS
 * Dos personas colaborando en sinergia para adopción y comunidad.
 */
export function IconComunidadUsuarios(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7.5" r="3.5" />
      <path d="M20 21v-2a3.5 3.5 0 0 0-2.8-3.4" />
      <path d="M14.5 4.2a3.5 3.5 0 0 1 0 6.6" />
    </svg>
  );
}

/**
 * 15. INTELIGENCIA ARTIFICIAL / SPARK / MODELOS
 * Destello de tecnología inteligente y generación computacional.
 */
export function IconInteligenciaArtificial(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M12 2.5 14.4 8.6 20.5 11 14.4 13.4 12 19.5 9.6 13.4 3.5 11 9.6 8.6 12 2.5z" />
      <path d="m18.5 17.5.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z" />
    </svg>
  );
}

export const PROPOSED_MAIN_ICONS = {
  datosReales: IconDatosReales,
  transparenciaReporte: IconTransparenciaReporte,
  ajustesTiempo: IconAjustesTiempo,
  equipoIntegrado: IconEquipoIntegrado,
  espanolIngles: IconEspanolIngles,
  videoVertical: IconVideoVertical,
  codigoTecnico: IconCodigoTecnico,
  disenoIdentidad: IconDisenoIdentidad,
  mensajesChat: IconMensajesChat,
  tiendaEcommerce: IconTiendaEcommerce,
  seguridadEscudo: IconSeguridadEscudo,
  busquedaIntencion: IconBusquedaIntencion,
  objetivoConversion: IconObjetivoConversion,
  comunidadUsuarios: IconComunidadUsuarios,
  inteligenciaArtificial: IconInteligenciaArtificial,
};
