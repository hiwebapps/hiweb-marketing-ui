import type { InputHTMLAttributes } from 'react';

type ToggleProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string;
};

/**
 * Switch nativo — light theme, sin hidratación React.
 */
export function Toggle({ label, id, className = '', ...props }: ToggleProps) {
  const toggleId = id ?? props.name ?? 'toggle';

  return (
    <label
      htmlFor={toggleId}
      className={[
        'inline-flex cursor-pointer items-center gap-3 text-sm text-muted',
        'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="relative inline-flex h-6 w-11 shrink-0">
        <input
          id={toggleId}
          type="checkbox"
          className="peer sr-only"
          {...props}
        />
        <span className="absolute inset-0 rounded-full border border-border-strong bg-surface transition-colors duration-150 peer-checked:border-ink peer-checked:bg-ink" />
        <span className="absolute top-0.5 left-0.5 size-[1.125rem] rounded-full bg-canvas shadow transition-transform duration-150 peer-checked:translate-x-5" />
      </span>
      <span>{label}</span>
    </label>
  );
}
