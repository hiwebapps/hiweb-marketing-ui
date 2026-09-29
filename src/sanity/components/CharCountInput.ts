import { createElement, type ComponentType } from 'react';
import type { StringInputProps, TextInputProps } from 'sanity';
import { Badge, Flex } from '@sanity/ui';

/** Shows "length / ideal" under the field: neutral up to ideal, caution up to max, critical beyond. */
export function charCountInput(ideal: number, max: number): ComponentType<StringInputProps | TextInputProps> {
  return function CharCountInput(props) {
    const length = typeof props.value === 'string' ? props.value.length : 0;
    const tone = length > max ? 'critical' : length > ideal ? 'caution' : 'default';
    return createElement(
      Flex,
      { direction: 'column', gap: 2 },
      props.renderDefault(props),
      createElement(
        Flex,
        { justify: 'flex-end' },
        createElement(Badge, { tone, fontSize: 0 }, `${length} / ${ideal}`),
      ),
    );
  };
}
