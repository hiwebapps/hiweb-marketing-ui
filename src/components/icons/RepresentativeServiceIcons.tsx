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

export const PROPOSED_MAIN_ICONS = {
  datosReales: IconDatosReales,
  transparenciaReporte: IconTransparenciaReporte,
  ajustesTiempo: IconAjustesTiempo,
  equipoIntegrado: IconEquipoIntegrado,
  espanolIngles: IconEspanolIngles,
};
