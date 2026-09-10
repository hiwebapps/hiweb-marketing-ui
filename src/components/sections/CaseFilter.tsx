import { useMemo, useState } from 'react';
import { CaseCard, type CaseItem } from './CasePreview';

export type FilterableCase = CaseItem & {
  id: string;
  industrySlug: string;
  serviceSlugs: string[];
};

type FilterOption = { slug: string; nombre: string };

type CaseFilterProps = {
  cases: FilterableCase[];
  industries: FilterOption[];
  services: FilterOption[];
};

export function CaseFilter({ cases, industries, services }: CaseFilterProps) {
  const [industry, setIndustry] = useState('all');
  const [service, setService] = useState('all');

  const filtered = useMemo(
    () =>
      cases.filter((item) => {
        const industryOk = industry === 'all' || item.industrySlug === industry;
        const serviceOk = service === 'all' || item.serviceSlugs.includes(service);
        return industryOk && serviceOk;
      }),
    [cases, industry, service],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <label className="flex min-w-[180px] flex-1 flex-col gap-1.5">
          <span className="font-display text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
            Industria
          </span>
          <select
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
            className="rounded-lg border border-border bg-canvas px-3 py-2.5 font-sans text-sm text-ink"
          >
            <option value="all">Todas</option>
            {industries.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-[180px] flex-1 flex-col gap-1.5">
          <span className="font-display text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
            Servicio
          </span>
          <select
            value={service}
            onChange={(event) => setService(event.target.value)}
            className="rounded-lg border border-border bg-canvas px-3 py-2.5 font-sans text-sm text-ink"
          >
            <option value="all">Todos</option>
            {services.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 !text-sm text-muted">
          No hay casos publicados con ese cruce todavía. Prueba otro filtro o{' '}
          <a href="/contacto">agenda una auditoría</a>.
        </p>
      ) : (
        <ul className="mt-10 grid gap-6 lg:grid-cols-3">
          {filtered.map((item) => (
            <li key={item.id}>
              <CaseCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
