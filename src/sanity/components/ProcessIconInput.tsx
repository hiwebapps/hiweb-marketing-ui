import { Flex, Text } from '@sanity/ui';
import { set, unset, type StringInputProps } from 'sanity';
import { PROCESS_ICONS, ProcessIcon } from '../../components/icons/ProcessIcons';

const glyph = {
  display: 'inline-flex',
  width: '1.15rem',
  height: '1.15rem',
} as const;

/** Four drawings from the process timeline, plus “by position”. */
export function ProcessIconInput(props: StringInputProps) {
  const value = typeof props.value === 'string' ? props.value : '';
  const readOnly = Boolean(props.readOnly);

  function choose(next: string | undefined) {
    if (readOnly) return;
    props.onChange(next ? set(next) : unset());
  }

  return (
    <Flex className="hiweb-process-icon-input" direction="column" gap={3}>
      <style>{`
        .hiweb-process-icon-input button {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.6rem;
          border: 1px solid var(--card-border-color);
          border-radius: 0.4rem;
          background: var(--card-bg-color);
          color: var(--card-fg-color);
          cursor: pointer;
          font: inherit;
        }
        .hiweb-process-icon-input button[data-selected="true"] {
          border-color: var(--card-focus-ring-color, #2276fc);
          box-shadow: inset 0 0 0 1px var(--card-focus-ring-color, #2276fc);
        }
        .hiweb-process-icon-input button:disabled {
          cursor: default;
          opacity: 0.6;
        }
        .hiweb-process-icon-input svg {
          width: 1.15rem;
          height: 1.15rem;
        }
      `}</style>
      <Flex gap={2} wrap="wrap">
        <button type="button" data-selected={value ? 'false' : 'true'} disabled={readOnly} onClick={() => choose(undefined)}>
          Por posición
        </button>
        {PROCESS_ICONS.map((option) => (
          <button
            key={option.value}
            type="button"
            data-selected={value === option.value ? 'true' : 'false'}
            disabled={readOnly}
            onClick={() => choose(option.value)}
          >
            <span style={glyph}>
              <ProcessIcon name={option.value} />
            </span>
            {option.title}
          </button>
        ))}
      </Flex>
      <Text size={1} muted>
        Por posición usa el dibujo de esa columna. Un archivo en «Icono propio» lo reemplaza.
      </Text>
    </Flex>
  );
}
