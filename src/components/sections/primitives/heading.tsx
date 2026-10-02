import { Fragment, type CSSProperties } from 'react';
import { headingMaxWidth } from '../../../lib/heading';

export function HeadingText({ text }: { text: string }) {
  const lines = text.replace(/\n+$/, '').split(/\r?\n/);
  return lines.map((line, index) => (
    <Fragment key={index}>
      {index > 0 ? <br /> : null}
      {line}
    </Fragment>
  ));
}

export function headingProps(width?: string) {
  const max = headingMaxWidth(width);
  if (!max) return {};
  return {
    className: 'hw-heading-block',
    'data-heading-width': '',
    style: { maxWidth: max } as CSSProperties,
  };
}
