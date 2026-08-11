import type { ReactNode } from 'react';

type EyebrowProps = {
  children: ReactNode;
  className?: string;
  /** index opcional estilo Linear/Cal: "01", "1.1" */
  index?: string;
  tone?: 'default' | 'on-ink';
};

/**
 * Taxonomía de sección — muted, tracking positivo.
 * No es decoración: orienta (“dónde estás”).
 */
export function Eyebrow({
  children,
  className = '',
  index,
  tone = 'default',
}: EyebrowProps) {
  const color = tone === 'on-ink' ? 'text-canvas/55' : 'text-muted';

  return (
    <p
      className={[
        'font-display text-xs font-medium tracking-[0.16em] uppercase',
        color,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {index ? <span className="mr-2 tabular-nums opacity-70">{index}</span> : null}
      {children}
    </p>
  );
}
