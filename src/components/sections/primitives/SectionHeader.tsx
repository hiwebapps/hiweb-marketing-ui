import type { ReactNode } from 'react';
import { Badge, type BadgeVariant } from '../../ui';
import { HeadingText, headingProps } from './heading';

type SectionHeaderProps = {
  eyebrow?: string;
  index?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  /** false quita el tope de 48rem para que el bloque use el ancho de la sección */
  constrained?: boolean;
  tone?: 'default' | 'on-ink';
  badgeVariant?: BadgeVariant;
  className?: string;
  actions?: ReactNode;
  split?: boolean;
  headingWidth?: string;
};

/**
 * Cabecera de sección: eyebrow (opcional) + H2 outcome + 1 subtítulo.
 * Una sección = un trabajo mental (Linear/Cal).
 * Por defecto el título usa SplitText vía [data-split] en motion.ts.
 */
export function SectionHeader({
  eyebrow,
  index,
  title,
  description,
  align = 'left',
  constrained = true,
  tone = 'default',
  badgeVariant = 'purple',
  className = '',
  actions,
  split = true,
  headingWidth,
}: SectionHeaderProps) {
  const titleColor = tone === 'on-ink' ? 'text-canvas' : 'text-ink';
  const descColor = tone === 'on-ink' ? 'text-canvas/65' : 'text-muted';
  const width = headingProps(headingWidth);

  return (
    <div
      className={[
        align === 'center' ? 'mx-auto text-center' : '',
        constrained ? 'max-w-3xl' : 'w-full max-w-none',
        width.className,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={width.style}
      data-heading-width={width['data-heading-width']}
    >
      {eyebrow ? (
        <div className={align === 'center' ? 'flex justify-center' : ''}>
          <Badge variant={badgeVariant} tone={tone === 'on-ink' ? 'on-ink' : 'default'}>
            {index ? `${index} · ${eyebrow}` : eyebrow}
          </Badge>
        </div>
      ) : null}

      <h2
        data-split={split ? '' : undefined}
        className={[
          'mt-3 !text-3xl !leading-[1.2] tracking-[-0.02em] md:!text-5xl',
          titleColor,
        ].join(' ')}
      >
        {typeof title === 'string' ? <HeadingText text={title} /> : title}
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
