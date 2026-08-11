import type { InputHTMLAttributes } from 'react';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string;
};

export function Checkbox({ label, id, className = '', ...props }: CheckboxProps) {
  const checkId = id ?? props.name;

  return (
    <label
      htmlFor={checkId}
      className="group inline-flex cursor-pointer items-center gap-3 text-sm text-muted"
    >
      <span className="relative inline-flex size-4 shrink-0">
        <input
          id={checkId}
          type="checkbox"
          className={[
            'peer size-4 appearance-none rounded border border-border-strong bg-canvas',
            'checked:border-ink checked:bg-ink',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
            'transition-colors duration-150',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        <svg
          className="pointer-events-none absolute inset-0 m-auto size-2.5 text-canvas opacity-0 peer-checked:opacity-100"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 6.2 4.6 9 10 3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="group-hover:text-ink">{label}</span>
    </label>
  );
}
