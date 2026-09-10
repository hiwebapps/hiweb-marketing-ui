import type { ComponentType, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** Extracted from src/assets/iconografia-hiweb.svg (Lucide-style Hiweb set). */
export function IconUsers({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="133 327 26 26"
      aria-hidden="true"
      className={className}
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
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className} {...stroke} {...props}>
      <circle cx="10" cy="10" r="10" />
      <path d="M10,0c-5.3,5.6-5.3,14.4,0,20,5.3-5.6,5.3-14.4,0-20" />
      <path d="M0,10h20" />
    </svg>
  );
}

export function IconTarget({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className} {...stroke} {...props}>
      <circle cx="10" cy="10" r="10" />
      <circle cx="10" cy="10" r="6" />
      <circle cx="10" cy="10" r="2" />
    </svg>
  );
}

export function IconCheckCircle({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className} {...stroke} {...props}>
      <circle cx="10" cy="10" r="10" />
      <path d="M7,10l2,2,4-4" />
    </svg>
  );
}

export const PILLAR_ICON_NAMES = ['users', 'globe', 'target', 'check'] as const;
export type PillarIconName = (typeof PILLAR_ICON_NAMES)[number];

const ICONS: Record<PillarIconName, ComponentType<IconProps>> = {
  users: IconUsers,
  globe: IconGlobe,
  target: IconTarget,
  check: IconCheckCircle,
};

export function PillarIcon({ name, className }: { name: PillarIconName; className?: string }) {
  const Icon = ICONS[name] ?? IconUsers;
  return <Icon className={className} />;
}
