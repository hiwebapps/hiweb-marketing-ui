import type { ReactNode } from 'react';

type CardGlassProps = {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article';
};

/**
 * Superficie light product-tool.
 * Hairline border + surface gray (Cal/Linear light) — sin glass oscuro.
 */
export function CardGlass({
  children,
  className = '',
  as: Tag = 'div',
}: CardGlassProps) {
  return (
    <Tag
      className={[
        'relative overflow-visible rounded-2xl',
        'border border-border bg-canvas',
        'shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="relative z-10">{children}</div>
    </Tag>
  );
}
