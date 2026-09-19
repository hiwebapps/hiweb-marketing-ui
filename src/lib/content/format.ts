export function formatCaseStat(metric: {
  valor: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}) {
  const value = `${metric.prefix ?? ''}${
    metric.decimals != null ? metric.valor.toFixed(metric.decimals) : metric.valor
  }${metric.suffix ?? ''}`;
  return { value, label: metric.label };
}

export function pageTitle(name: string, fallback?: string) {
  return fallback || `${name} — Hiweb Marketing`;
}
