import type { ButtonHTMLAttributes, ReactNode } from 'react';
import BorderGlow from '../effects/BorderGlow.jsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'orange' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  /** Soft BorderGlow on hover — default on for primary */
  glow?: boolean;
};

const GLOW_COLORS = ['#927AFE', '#01E7FF', '#E8FBFF'];

const sizePad: Record<ButtonSize, string> = {
  sm: 'ui-btn--sm',
  md: 'ui-btn--md',
  lg: 'ui-btn--lg',
};

const plainVariants: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-canvas hover:bg-ink/90',
  secondary:
    'border border-border-strong bg-canvas text-ink hover:bg-surface',
  outline:
    'border border-border-strong bg-transparent text-ink hover:bg-surface',
  ghost: 'bg-transparent text-muted hover:bg-surface hover:text-ink',
  orange: 'bg-accent-orange text-canvas hover:bg-accent-orange/90',
};

const plainSizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-7 py-3.5 text-sm',
  lg: 'px-8 py-4 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  type = 'button',
  glow,
  ...props
}: ButtonProps) {
  const useGlow = glow ?? variant === 'primary';

  if (useGlow && !disabled && (variant === 'primary' || variant === 'secondary')) {
    const isPrimary = variant === 'primary';
    return (
      <button
        type={type}
        disabled={disabled}
        className={[
          'ui-btn-reset inline-flex appearance-none border-0 bg-transparent p-0',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
          'disabled:pointer-events-none disabled:opacity-40',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        <BorderGlow
          className={[
            'ui-btn',
            isPrimary ? 'ui-btn--primary' : 'ui-btn--secondary',
            sizePad[size],
          ].join(' ')}
          backgroundColor={isPrimary ? '#111111' : '#ffffff'}
          borderRadius={10}
          glowRadius={22}
          glowIntensity={0.55}
          edgeSensitivity={22}
          coneSpread={26}
          animated={false}
          fillOpacity={0.22}
          glowColor={isPrimary ? '210 80 78' : '260 70 72'}
          colors={GLOW_COLORS}
        >
          {children}
        </BorderGlow>
      </button>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg font-display font-semibold tracking-wide',
        'transition-[transform,background-color,border-color,color] duration-150',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
        'disabled:pointer-events-none disabled:opacity-40',
        'active:scale-[0.98]',
        plainVariants[variant],
        plainSizes[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
