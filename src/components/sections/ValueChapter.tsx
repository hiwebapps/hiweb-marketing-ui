import type { ReactNode } from 'react';
import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';
import { ProductFrame } from './primitives/ProductFrame';

type ValueChapterProps = {
  id?: string;
  index?: string;
  eyebrow: string;
  title: string;
  description: string;
  caption?: string;
  reverse?: boolean;
  tone?: 'canvas' | 'surface';
  children?: ReactNode;
};

/**
 * 04 · Value chapter (Linear)
 * Un outcome + una evidencia de producto. Una sección = un trabajo mental.
 */
export function ValueChapter({
  id,
  index,
  eyebrow,
  title,
  description,
  caption,
  reverse = false,
  tone = 'canvas',
  children,
}: ValueChapterProps) {
  return (
    <SectionBand id={id} tone={tone}>
      <div
        className={[
          'grid items-center gap-10 md:grid-cols-2 md:gap-14',
          reverse ? 'md:[&>*:first-child]:order-2' : '',
        ].join(' ')}
      >
        <SectionHeader
          eyebrow={eyebrow}
          index={index}
          title={title}
          description={description}
          badgeVariant="cyan"
        />
        <ProductFrame caption={caption}>{children}</ProductFrame>
      </div>
    </SectionBand>
  );
}

/** Mock UI — mensaje / oferta */
export function MockMessagePanel() {
  return (
    <div className="space-y-4 bg-surface p-5">
      <div className="rounded-xl border border-border bg-canvas p-4">
        <p className="font-display text-[11px] tracking-[0.14em] text-muted uppercase">
          Posicionamiento
        </p>
        <p className="mt-2 font-display text-lg font-semibold text-ink">
          Menos ruido. Más señal.
        </p>
        <p className="mt-2 !text-sm">
          Oferta clara para founders B2B que necesitan pipeline predecible.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {['Awareness', 'Consideración', 'Conversión', 'Retención'].map((stage) => (
          <div
            key={stage}
            className="rounded-xl border border-border bg-canvas px-3 py-3 text-sm font-medium text-ink"
          >
            {stage}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Mock UI — performance */
export function MockPerformancePanel() {
  return (
    <div className="bg-surface p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-[11px] tracking-[0.14em] text-muted uppercase">
            ROAS · 30d
          </p>
          <p className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">
            4.2×
          </p>
        </div>
        <p className="!text-xs text-muted">vs 2.8× baseline</p>
      </div>
      <div className="mt-6 flex h-28 items-end gap-1.5">
        {[40, 55, 48, 62, 70, 66, 78, 72, 85, 80, 92, 88].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-ink/80"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        {['Meta', 'Search', 'LinkedIn'].map((ch) => (
          <span
            key={ch}
            className="rounded-full border border-border bg-canvas px-2.5 py-1 text-[11px] text-ink-soft"
          >
            {ch}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Mock UI — web / producto */
export function MockWebPanel() {
  return (
    <div className="bg-surface p-5">
      <div className="overflow-hidden rounded-xl border border-border bg-canvas">
        <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
          <span className="size-2 rounded-full bg-ink/20" />
          <span className="size-2 rounded-full bg-ink/20" />
          <span className="size-2 rounded-full bg-ink/20" />
          <span className="ml-2 font-mono text-[10px] text-muted">hiweb.mx</span>
        </div>
        <div className="space-y-3 p-4">
          <div className="h-3 w-1/3 rounded bg-ink/10" />
          <div className="h-8 w-2/3 rounded bg-ink/15" />
          <div className="h-3 w-full rounded bg-ink/8" />
          <div className="h-3 w-5/6 rounded bg-ink/8" />
          <div className="mt-2 inline-flex rounded-lg bg-ink px-3 py-2 text-[11px] font-semibold text-canvas">
            CTA
          </div>
        </div>
      </div>
    </div>
  );
}
