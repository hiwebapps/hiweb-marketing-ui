export const HEADING_WIDTH_OPTIONS = [
  { title: 'Chico · 640px', value: 'sm' },
  { title: 'Mediano · 768px', value: 'md' },
  { title: 'Grande · 960px', value: 'lg' },
  { title: 'Extra grande · 1300px', value: 'xl' },
] as const;

export type HeadingWidth = (typeof HEADING_WIDTH_OPTIONS)[number]['value'];

const HEADING_MAX: Record<HeadingWidth, string> = {
  sm: '640px',
  md: '768px',
  lg: '960px',
  xl: '1300px',
};

export function asHeadingWidth(value: unknown): HeadingWidth | undefined {
  if (value === 'sm' || value === 'md' || value === 'lg' || value === 'xl') return value;
  return undefined;
}

export function headingMaxWidth(value?: string | null): string | undefined {
  const key = asHeadingWidth(value);
  return key ? HEADING_MAX[key] : undefined;
}

/** Título de una sola línea para <title>, schema y etiquetas accesibles. */
export function headingPlain(value?: string | null): string {
  return (value ?? '').replace(/\s*\n\s*/g, ' ').replace(/\s+/g, ' ').trim();
}
