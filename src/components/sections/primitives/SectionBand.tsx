import type { ReactNode } from 'react';

type SectionBandProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  /** surface = #f5f5f5 band; canvas = white; ink = dark closer; wash = sin fondo (deja ver el hero) */
  tone?: 'canvas' | 'surface' | 'ink' | 'wash';
  as?: 'section' | 'div' | 'footer';
  /** Sin padding vertical interno (trust strip, etc.) */
  dense?: boolean;
};

const tones = {
  canvas: 'bg-canvas text-ink',
  surface: 'bg-surface text-ink',
  ink: 'bg-ink text-canvas',
  wash: 'bg-transparent text-ink',
} as const;

/**
 * Contenedor de sección — separación por aire + cambio de superficie (Cal/Linear).
 * Sin divisores ornamentales.
 */
export function SectionBand({
  id,
  children,
  className = '',
  tone = 'canvas',
  as: Tag = 'section',
  dense = false,
}: SectionBandProps) {
  return (
    <Tag
      id={id}
      {...(id ? { 'data-scroll-section': id } : {})}
      className={['relative scroll-mt-24', tones[tone], className].filter(Boolean).join(' ')}
    >
      <div
        className={[
          'mx-auto w-full max-w-6xl px-6',
          dense ? 'py-0' : 'py-16 md:py-24',
        ].join(' ')}
      >
        {children}
      </div>
    </Tag>
  );
}
