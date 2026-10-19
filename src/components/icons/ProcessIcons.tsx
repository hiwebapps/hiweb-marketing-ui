import type { ComponentType } from 'react';

export const PROCESS_ICONS = [
  { title: 'Búsqueda', value: 'search' },
  { title: 'Chispa', value: 'spark' },
  { title: 'Play', value: 'play' },
  { title: 'Tendencia', value: 'trend' },
] as const;

export type ProcessIconName = (typeof PROCESS_ICONS)[number]['value'];

export function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16.5 20 20.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconSpark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4.5 13.4 9l4.6.4-3.5 3.1 1.1 4.5L12 14.7 8.4 17l1.1-4.5L6 9.4 10.6 9 12 4.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4.5" y="4.5" width="15" height="15" rx="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 8.8v6.4l5.4-3.2L10 8.8Z" fill="currentColor" />
    </svg>
  );
}

export function IconTrend() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 16.5 9 12l3.2 3.2 7.3-7.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14.5 7.5h5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const PROCESS_ICON_MEDIA: Record<ProcessIconName, ComponentType> = {
  search: IconSearch,
  spark: IconSpark,
  play: IconPlay,
  trend: IconTrend,
};

export function ProcessIcon({ name }: { name?: string }) {
  const Icon = name && name in PROCESS_ICON_MEDIA ? PROCESS_ICON_MEDIA[name as ProcessIconName] : null;
  if (!Icon) return null;
  return <Icon />;
}
