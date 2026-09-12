import type { ReactNode } from 'react';
import './Badge.css';

type BadgeVariant = 'cyan' | 'orange' | 'purple' | 'lime' | 'neutral' | 'success' | 'danger';

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
  const skin = tone === 'on-ink' ? 'on-ink' : variant;

  return (
    <span className={['ui-badge', `ui-badge--${skin}`, className].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
}
