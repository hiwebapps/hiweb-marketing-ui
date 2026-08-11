import type { SelectHTMLAttributes } from 'react';

type Option = { value: string; label: string };

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
  options: Option[];
};

export function SelectField({
  label,
  hint,
  options,
  id,
  className = '',
  disabled,
  ...props
}: SelectFieldProps) {
  const selectId = id ?? props.name;

  return (
    <label className="flex w-full flex-col gap-2">
      {label ? (
        <span className="font-display text-xs font-medium tracking-[0.14em] text-ink uppercase">
          {label}
        </span>
      ) : null}

      <select
        id={selectId}
        disabled={disabled}
        className={[
          'w-full appearance-none rounded-xl border border-border bg-canvas px-4 py-3 font-sans text-sm text-ink',
          'transition-[border-color,box-shadow,background-color] duration-150',
          'focus:border-border-strong focus:shadow-[0_0_0_3px_rgba(17,17,17,0.08)] focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-40',
          'hover:border-border-strong',
          'bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-canvas text-ink">
            {opt.label}
          </option>
        ))}
      </select>

      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
}
