import type { InputHTMLAttributes, ReactNode } from 'react';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  icon?: ReactNode;
  suffix?: ReactNode;
};

export function TextField({
  label,
  hint,
  error,
  icon,
  suffix,
  id,
  className = '',
  disabled,
  ...props
}: TextFieldProps) {
  const inputId = id ?? props.name;

  return (
    <label className="flex w-full flex-col gap-2">
      {label ? (
        <span className="font-display text-xs font-medium tracking-[0.14em] text-ink uppercase">
          {label}
        </span>
      ) : null}

      <span className="relative block">
        {icon ? (
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted">
            {icon}
          </span>
        ) : null}

        <input
          id={inputId}
          disabled={disabled}
          className={[
            'w-full rounded-xl border bg-canvas px-4 py-3 font-sans text-sm text-ink',
            'placeholder:text-muted/70',
            'transition-[border-color,box-shadow,background-color] duration-150',
            'focus:border-border-strong focus:shadow-[0_0_0_3px_rgba(17,17,17,0.08)] focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-40',
            error ? 'border-accent-red/70' : 'border-border hover:border-border-strong',
            icon ? 'pl-11' : '',
            suffix ? 'pr-14' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />

        {suffix ? (
          <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-sans text-xs font-medium text-muted">
            {suffix}
          </span>
        ) : null}
      </span>

      {error ? (
        <span className="text-xs text-accent-red">{error}</span>
      ) : hint ? (
        <span className="text-xs text-muted">{hint}</span>
      ) : null}
    </label>
  );
}
