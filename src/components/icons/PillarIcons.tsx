import type { ComponentType, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** Extracted from src/assets/iconografia-hiweb.svg (Lucide-style Hiweb set).
 *  Geometry stays inset from the viewBox so strokeWidth doesn't clip. */
export function IconUsers({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="133 327 26 26"
      aria-hidden="true"
      className={className}
      overflow="visible"
      {...stroke}
      {...props}
    >
      <path d="M149.8,350.6v-2c0-2.2-1.8-4-4-4h-6c-2.2,0-4,1.8-4,4v2" />
      <path d="M149.8,332.7c2.1.6,3.4,2.7,2.9,4.9-.4,1.4-1.5,2.5-2.9,2.9" />
      <path d="M155.8,350.6v-2c0-1.8-1.2-3.4-3-3.9" />
      <circle cx="142.8" cy="336.6" r="4" />
    </svg>
  );
}

export function IconGlobe({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
  );
}

export function IconTarget({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke} {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export function IconCheckCircle({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/** Definition / architecture — “Qué es” */
export function IconLayers({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke} {...props}>
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 12.58-9.17 4.16a2 2 0 0 1-1.66 0L2 12.58" />
      <path d="m22 17.58-9.17 4.16a2 2 0 0 1-1.66 0L2 17.58" />
    </svg>
  );
}

/** System / process — “Cómo funciona” */
export function IconWorkflow({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke} {...props}>
      <rect width="8" height="8" x="3" y="3" rx="2" />
      <path d="M7 11v4a2 2 0 0 0 2 2h4" />
      <rect width="8" height="8" x="13" y="13" rx="2" />
    </svg>
  );
}

export const PILLAR_ICON_NAMES = ['users', 'globe', 'target', 'check', 'layers', 'workflow'] as const;
export type PillarIconName = (typeof PILLAR_ICON_NAMES)[number];

const ICONS: Record<PillarIconName, ComponentType<IconProps>> = {
  users: IconUsers,
  globe: IconGlobe,
  target: IconTarget,
  check: IconCheckCircle,
  layers: IconLayers,
  workflow: IconWorkflow,
};

export function PillarIcon({ name, className }: { name: PillarIconName; className?: string }) {
  const Icon = ICONS[name] ?? IconUsers;
  return <Icon className={className} />;
}

/** Pick a semantic icon from a service overview card title. */
export function iconForServiceOverviewCard(title: string, index = 0): PillarIconName {
  const key = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  if (key.includes('que es') || key.includes('definicion') || key.includes('que incluye')) {
    return 'layers';
  }
  if (key.includes('como funciona') || key.includes('proceso') || key.includes('sistema')) {
    return 'workflow';
  }
  if (key.includes('que cambia') || key.includes('resultado') || key.includes('beneficio')) {
    return 'check';
  }

  return PILLAR_ICON_NAMES[index % PILLAR_ICON_NAMES.length];
}
