import type { ReactNode } from 'react';
import './Badge.css';

export type BadgeVariant = 'cyan' | 'orange' | 'purple' | 'lime' | 'neutral' | 'success' | 'danger';

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  tone?: 'default' | 'on-ink';
  className?: string;
};

export function Badge({
  children,
  variant = 'neutral',
  tone = 'default',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'ui-badge',
        `ui-badge--${variant}`,
        tone === 'on-ink' ? 'ui-badge--on-ink' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}
