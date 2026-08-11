import type { ReactNode } from 'react';
import { Eyebrow } from './Eyebrow';

type SectionHeaderProps = {
  eyebrow?: string;
  index?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'default' | 'on-ink';
  className?: string;
  actions?: ReactNode;
};

/**
 * Cabecera de sección: eyebrow (opcional) + H2 outcome + 1 subtítulo.
 * Una sección = un trabajo mental (Linear/Cal).
 */
export function SectionHeader({
  eyebrow,
  index,
  title,
  description,
  align = 'left',
  tone = 'default',
  className = '',
  actions,
}: SectionHeaderProps) {
  const titleColor = tone === 'on-ink' ? 'text-canvas' : 'text-ink';
  const descColor = tone === 'on-ink' ? 'text-canvas/65' : 'text-muted';

  return (
    <div
      className={[
        align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {eyebrow ? (
        <Eyebrow index={index} tone={tone} className={align === 'center' ? 'justify-center' : ''}>
          {eyebrow}
        </Eyebrow>
      ) : null}

      <h2
        className={[
          'mt-3 !text-3xl !leading-[1.2] tracking-[-0.02em] md:!text-5xl',
          titleColor,
        ].join(' ')}
      >
        {title}
      </h2>

      {description ? (
        <p className={['mt-4 !text-base md:!text-lg', descColor].join(' ')}>{description}</p>
      ) : null}

      {actions ? (
        <div
          className={[
            'mt-8 flex flex-wrap gap-3',
            align === 'center' ? 'justify-center' : '',
          ].join(' ')}
        >
          {actions}
        </div>
      ) : null}
    </div>
  );
}
