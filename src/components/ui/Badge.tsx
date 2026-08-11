import type { ReactNode } from 'react';

type BadgeVariant = 'cyan' | 'orange' | 'purple' | 'lime' | 'neutral' | 'success' | 'danger';

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variants: Record<BadgeVariant, string> = {
  cyan: 'border-accent-cyan/40 bg-accent-cyan/10 text-ink',
  orange: 'border-accent-orange/40 bg-accent-orange/10 text-accent-orange',
  purple: 'border-accent-purple/40 bg-accent-purple/10 text-accent-purple',
  lime: 'border-accent-lime/50 bg-accent-lime/15 text-ink-soft',
  neutral: 'border-border bg-surface text-muted',
  success: 'border-accent-green/40 bg-accent-green/10 text-accent-green',
  danger: 'border-accent-red/40 bg-accent-red/10 text-accent-red',
};

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-md border px-2.5 py-1',
        'font-display text-[11px] font-semibold tracking-[0.12em] uppercase',
        variants[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}
