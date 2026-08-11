import type { ReactNode } from 'react';

type ProductFrameProps = {
  children: ReactNode;
  className?: string;
  /** label tipo FIG / caption de Linear */
  caption?: string;
};

/**
 * Marco del producto — la evidencia visual (Linear/Raycast/Cal).
 * Hairline + surface; el contenido es UI real o mock, no ilustración.
 */
export function ProductFrame({ children, className = '', caption }: ProductFrameProps) {
  return (
    <figure className={['w-full', className].filter(Boolean).join(' ')}>
      <div className="overflow-hidden rounded-2xl border border-border bg-canvas shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        {children}
      </div>
      {caption ? (
        <figcaption className="mt-3 font-display text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
