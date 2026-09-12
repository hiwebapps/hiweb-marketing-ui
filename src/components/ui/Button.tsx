import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import BorderGlow from '../effects/BorderGlow.jsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'orange' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

type SharedButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  /** Soft BorderGlow on hover — default on for primary */
  glow?: boolean;
};

type ButtonAsButton = SharedButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = SharedButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'type'> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

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
  sm: 'h-[44px] px-5 text-sm',
  md: 'h-[50px] px-6 text-base',
  lg: 'h-[56px] px-8 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  glow,
  href,
  ...props
}: ButtonProps) {
  const useGlow = glow ?? variant === 'primary';
  const isLink = typeof href === 'string';
  const resetClass = [
    'ui-btn-reset inline-flex appearance-none border-0 bg-transparent p-0',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
    disabled ? 'pointer-events-none opacity-40' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const plainClass = [
    'ui-btn-popup inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold tracking-wide',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
    disabled ? 'pointer-events-none opacity-40' : '',
    plainVariants[variant],
    plainSizes[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (useGlow && !disabled && (variant === 'primary' || variant === 'secondary')) {
    const isPrimary = variant === 'primary';
    const glowInner = (
      <BorderGlow
        className={[
          'ui-btn',
          isPrimary ? 'ui-btn--primary' : 'ui-btn--secondary',
          sizePad[size],
        ].join(' ')}
        backgroundColor={isPrimary ? '#111111' : '#ffffff'}
        borderRadius={isPrimary ? 999 : 10}
        glowRadius={isPrimary ? 18 : 22}
        glowIntensity={isPrimary ? 0.72 : 0.55}
        edgeSensitivity={isPrimary ? 12 : 22}
        coneSpread={isPrimary ? 32 : 26}
        animated={false}
        loop={isPrimary}
        fillOpacity={isPrimary ? 0.3 : 0.22}
        glowColor={isPrimary ? '210 80 78' : '260 70 72'}
        colors={GLOW_COLORS}
      >
        {children}
      </BorderGlow>
    );

    if (isLink) {
      return (
        <a href={href} className={resetClass} aria-disabled={disabled} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {glowInner}
        </a>
      );
    }

    const { type = 'button', ...buttonProps } = props as ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button type={type} disabled={disabled} className={resetClass} {...buttonProps}>
        {glowInner}
      </button>
    );
  }

  if (isLink) {
    return (
      <a href={href} className={plainClass} aria-disabled={disabled} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  const { type = 'button', ...buttonProps } = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type} disabled={disabled} className={plainClass} {...buttonProps}>
      {children}
    </button>
  );
}
