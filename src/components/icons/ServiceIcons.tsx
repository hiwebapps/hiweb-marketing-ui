import type { ComponentType, SVGProps } from 'react';
import { NavIcon } from '../sections/NavIcon';
import {
  IconDatosReales,
  IconTransparenciaReporte,
  IconAjustesTiempo,
  IconEquipoIntegrado,
  IconEspanolIngles,
  IconVideoVertical,
  IconCodigoTecnico,
  IconDisenoIdentidad,
  IconMensajesChat,
  IconTiendaEcommerce,
  IconSeguridadEscudo,
  IconBusquedaIntencion,
  IconObjetivoConversion,
  IconComunidadUsuarios,
  IconInteligenciaArtificial,
} from './RepresentativeServiceIcons';

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function Svg({ className, children, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke} {...props}>
      {children}
    </svg>
  );
}

export const SERVICE_ICON_NAMES = [
  'video',
  'activity',
  'users',
  'target',
  'badge',
  'box',
  'focus',
  'spark',
  'code',
  'chart',
  'report',
  'timer',
  'network',
  'globe',
  'palette',
  'chat',
  'cart',
  'shield',
  'search',
  'datosReales',
  'transparenciaReporte',
  'ajustesTiempo',
  'equipoIntegrado',
  'espanolIngles',
  'videoVertical',
  'codigoTecnico',
  'disenoIdentidad',
  'mensajesChat',
  'tiendaEcommerce',
  'seguridadEscudo',
  'busquedaIntencion',
  'objetivoConversion',
  'comunidadUsuarios',
  'inteligenciaArtificial',
] as const;

export type ServiceIconName = (typeof SERVICE_ICON_NAMES)[number];

const ICONS: Record<string, ComponentType<IconProps>> = {
  // Bespoke representative service icons
  chart: IconDatosReales,
  datosReales: IconDatosReales,
  activity: IconDatosReales,

  report: IconTransparenciaReporte,
  transparenciaReporte: IconTransparenciaReporte,
  badge: IconTransparenciaReporte,

  timer: IconAjustesTiempo,
  ajustesTiempo: IconAjustesTiempo,

  network: IconEquipoIntegrado,
  equipoIntegrado: IconEquipoIntegrado,

  globe: IconEspanolIngles,
  espanolIngles: IconEspanolIngles,

  video: IconVideoVertical,
  videoVertical: IconVideoVertical,

  code: IconCodigoTecnico,
  codigoTecnico: IconCodigoTecnico,

  palette: IconDisenoIdentidad,
  disenoIdentidad: IconDisenoIdentidad,

  chat: IconMensajesChat,
  mensajesChat: IconMensajesChat,

  cart: IconTiendaEcommerce,
  tiendaEcommerce: IconTiendaEcommerce,

  shield: IconSeguridadEscudo,
  seguridadEscudo: IconSeguridadEscudo,

  search: IconBusquedaIntencion,
  busquedaIntencion: IconBusquedaIntencion,

  target: IconObjetivoConversion,
  objetivoConversion: IconObjetivoConversion,

  users: IconComunidadUsuarios,
  comunidadUsuarios: IconComunidadUsuarios,

  spark: IconInteligenciaArtificial,
  inteligenciaArtificial: IconInteligenciaArtificial,

  // Standard legacy geometry
  box: (props) => (
    <Svg {...props}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </Svg>
  ),
  focus: (props) => (
    <Svg {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
    </Svg>
  ),
};

export function ServiceIcon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null;
  if (name.startsWith('http') || name.startsWith('/')) {
    return <img src={name} alt="" className={className} />;
  }
  if (name in ICONS) {
    const Icon = ICONS[name];
    return <Icon className={className} />;
  }
  return <NavIcon name={name} />;
}
