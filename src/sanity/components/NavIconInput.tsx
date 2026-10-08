import { Flex, Text } from '@sanity/ui';
import { type StringInputProps } from 'sanity';
import { NavIcon } from '../../components/sections/NavIcon';

const frame = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.25rem',
  height: '2.25rem',
  border: '1px solid var(--card-border-color)',
  borderRadius: '0.4rem',
  color: 'var(--card-fg-color)',
} as const;

/** Shows the icon from the list, under the selector. */
export function NavIconInput(props: StringInputProps) {
  const name = typeof props.value === 'string' && props.value ? props.value : '';
  const usesServiceIcon = props.schemaType.name !== 'cardIcon';
  return (
    <Flex direction="column" gap={3}>
      {props.renderDefault(props)}
      {!name && usesServiceIcon ? (
        <Text size={1} muted>
          Vacío: se usa el icono del servicio.
        </Text>
      ) : (
      <Flex align="center" gap={3}>
        <span style={frame}>
          <style>{`.hiweb-nav-icon-preview svg{width:1.15rem;height:1.15rem;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}`}</style>
          <span className="hiweb-nav-icon-preview">
            <NavIcon name={name || 'grid'} />
          </span>
        </span>
        <Text size={1} muted>
          Icono actual
        </Text>
      </Flex>
      )}
    </Flex>
  );
}
