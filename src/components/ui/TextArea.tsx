import type { TextareaHTMLAttributes } from 'react';

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function TextArea({
  label,
  hint,
  error,
  id,
  className = '',
  disabled,
  rows = 4,
  ...props
}: TextAreaProps) {
  const areaId = id ?? props.name;

  return (
    <label className="flex w-full flex-col gap-2">
      {label ? (
        <span className="font-display text-xs font-medium tracking-[0.14em] text-ink uppercase">
          {label}
        </span>
      ) : null}

      <textarea
        id={areaId}
        rows={rows}
        disabled={disabled}
        className={[
          'w-full resize-y rounded-xl border bg-canvas px-4 py-3 font-sans text-sm text-ink',
          'placeholder:text-muted/70',
          'transition-[border-color,box-shadow,background-color] duration-150',
          'focus:border-border-strong focus:shadow-[0_0_0_3px_rgba(17,17,17,0.08)] focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-40',
          error ? 'border-accent-red/70' : 'border-border hover:border-border-strong',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />

      {error ? (
        <span className="text-xs text-accent-red">{error}</span>
      ) : hint ? (
        <span className="text-xs text-muted">{hint}</span>
      ) : null}
    </label>
  );
}
