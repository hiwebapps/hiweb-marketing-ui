import { useMemo, useState } from 'react';
import { Badge, Button } from '../ui';
import { CasePreview } from '../sections/CasePreview';
import { FaqSection } from '../sections/FaqSection';
import { IndustryGrid } from '../sections/IndustryGrid';
import { MetricsBand } from '../sections/MetricsBand';
import { PillarGrid } from '../sections/PillarGrid';
import { PortalShowcase } from '../sections/PortalShowcase';
import { ProcessPhases } from '../sections/ProcessPhases';
import { SectionBand } from '../sections/primitives/SectionBand';
import { SectionHeader } from '../sections/primitives/SectionHeader';
import { TeamGrid } from '../sections/TeamGrid';
import { FinalCta } from '../sections/FinalCta';
import type { LpSection } from '../../lib/content/lp-types';

export function LogoMarquee({ label, logos }: Extract<LpSection, { _type: 'logoMarquee' }>) {
  const loop = [...logos, ...logos];
  return (
    <section className="border-y border-border bg-canvas py-8" aria-label={label}>
      <p className="mb-5 text-center font-display text-xs font-semibold tracking-[0.16em] text-muted uppercase">{label}</p>
      <div className="lp-marquee">
        <div className="lp-marquee__track">
          {loop.map((logo, index) => (
            <img key={`${logo.alt}-${index}`} src={logo.src} alt={index < logos.length ? logo.alt : ''} height="44" />
          ))}
        </div>
      </div>
    </section>
  );
}

const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

export function RoiCalculator({
  eyebrow,
  title,
  description,
  ctaLabel,
  preset,
  industries,
}: Extract<LpSection, { _type: 'roiCalculator' }>) {
  const initial = industries.find((item) => item.slug === preset) ?? industries[0];
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [investment, setInvestment] = useState(40000);
  const [cpl, setCpl] = useState(initial?.cpl ?? 400);
  const [closeRate, setCloseRate] = useState(initial?.close ?? 10);
  const [ticket, setTicket] = useState(initial?.ticket ?? 20000);
  const [margin, setMargin] = useState(initial?.margin ?? 30);

  const select = (next: string) => {
    const industry = industries.find((item) => item.slug === next);
    setSlug(next);
    if (!industry) return;
    setCpl(industry.cpl);
    setCloseRate(industry.close);
    setTicket(industry.ticket);
    setMargin(industry.margin);
  };

  const result = useMemo(() => {
    const leads = cpl > 0 ? investment / cpl : 0;
    const clients = leads * (closeRate / 100);
    const revenue = clients * ticket;
    const profit = revenue * (margin / 100);
    const roi = investment ? ((profit - investment) / investment) * 100 : 0;
    return { leads, clients, revenue, roi };
  }, [investment, cpl, closeRate, ticket, margin]);

  return (
    <SectionBand id="roi" tone="ink">
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div>
          <Badge variant="lime" tone="on-ink">{eyebrow}</Badge>
          <SectionHeader title={title} description={description} tone="on-ink" className="mt-5" />
          <p className="mt-8 font-display text-xs font-semibold tracking-[0.14em] text-white/60 uppercase">Tu industria</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {industries.map((industry) => (
              <button
                key={industry.slug}
                type="button"
                aria-pressed={slug === industry.slug}
                onClick={() => select(industry.slug)}
                className={[
                  'rounded-full border px-3 py-2 text-sm',
                  slug === industry.slug ? 'border-white bg-white text-ink' : 'border-white/20 text-white',
                ].join(' ')}
              >
                {industry.name}
              </button>
            ))}
          </div>
          <label className="mt-8 block font-display text-xs font-semibold tracking-[0.14em] text-white/60 uppercase" htmlFor="lp-roi-inv">
            Inversión mensual en marketing
          </label>
          <p className="mt-2 font-display text-3xl font-semibold text-white">{money.format(investment)}</p>
          <input
            id="lp-roi-inv"
            type="range"
            min={10000}
            max={300000}
            step={5000}
            value={investment}
            onChange={(event) => setInvestment(Number(event.target.value))}
            className="mt-3 w-full"
          />
          <details className="mt-6 text-sm text-white/80">
            <summary className="cursor-pointer">Ajustar supuestos</summary>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label>Costo por lead (MXN)<input className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2" type="number" min={1} value={cpl} onChange={(event) => setCpl(Number(event.target.value))} /></label>
              <label>Tasa de cierre (%)<input className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2" type="number" min={0} max={100} step={0.5} value={closeRate} onChange={(event) => setCloseRate(Number(event.target.value))} /></label>
              <label>Venta promedio (MXN)<input className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2" type="number" min={0} value={ticket} onChange={(event) => setTicket(Number(event.target.value))} /></label>
              <label>Margen de utilidad (%)<input className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2" type="number" min={0} max={100} value={margin} onChange={(event) => setMargin(Number(event.target.value))} /></label>
            </div>
          </details>
        </div>
        <div className="rounded-3xl border border-white/15 bg-white/5 p-6 sm:p-8">
          <p className="font-display text-xs font-semibold tracking-[0.14em] text-white/60 uppercase">Retorno estimado sobre tu inversión</p>
          <p className="mt-3 font-display text-6xl font-semibold text-accent-lime">
            {result.roi >= 0 ? '+' : ''}
            {Math.round(result.roi).toLocaleString('es-MX')}%
          </p>
          <p className="mt-2 text-sm text-white/70">Calculado con la utilidad de las ventas, no solo con los ingresos.</p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            <div><dt className="text-sm text-white/60">Leads al mes</dt><dd className="font-display text-2xl font-semibold">{Math.round(result.leads).toLocaleString('es-MX')}</dd></div>
            <div><dt className="text-sm text-white/60">Clientes nuevos</dt><dd className="font-display text-2xl font-semibold">{result.clients.toLocaleString('es-MX', { maximumFractionDigits: 1 })}</dd></div>
            <div><dt className="text-sm text-white/60">Ventas estimadas</dt><dd className="font-display text-2xl font-semibold">{money.format(result.revenue)}</dd></div>
          </dl>
          <Button type="button" className="mt-8" data-cal="">{ctaLabel}</Button>
          <p className="mt-4 text-xs text-white/55">Estimación con fines ilustrativos. El resultado real depende de tu negocio, tu mercado y tu inversión.</p>
        </div>
      </div>
    </SectionBand>
  );
}

export function StatementBlock({ eyebrow, title, paragraphs }: Extract<LpSection, { _type: 'statement' }>) {
  return (
    <SectionBand>
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <div>
          <Badge variant="purple">{eyebrow}</Badge>
          <p className="mt-5 font-display text-3xl leading-tight font-semibold tracking-tight text-ink md:text-5xl">{title}</p>
        </div>
        <div className="grid gap-4">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-relaxed text-ink-soft">{paragraph}</p>
          ))}
        </div>
      </div>
    </SectionBand>
  );
}

export function ServiceSystem(section: Extract<LpSection, { _type: 'serviceSystem' }>) {
  return (
    <SectionBand id="servicios-lp">
      <SectionHeader eyebrow={section.eyebrow} title={section.title} description={section.description} />
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {section.quadrants.map((quadrant) => (
          <article key={quadrant.title} className="rounded-3xl border border-border bg-surface p-6">
            <h3 className="font-display text-xl font-semibold">{quadrant.title}</h3>
            <p className="mt-2 text-sm text-muted">{quadrant.description}</p>
            <ul className="mt-4 grid gap-2">
              {quadrant.services.map((service) => (
                <li key={service.slug}>
                  <a href={service.href} className="font-semibold text-ink underline-offset-4 hover:underline">{service.name}</a>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="mt-6 text-center font-display text-sm font-semibold tracking-[0.14em] text-muted uppercase">{section.coreLabel}</p>
      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-3xl bg-ink px-6 py-5 text-white md:flex-row md:items-center">
        <p className="max-w-2xl text-sm text-white/80">{section.foot}</p>
        <Button type="button" data-bundle="">{section.ctaLabel}</Button>
      </div>
      {section.combos?.length ? (
        <>
          {section.combosTitle ? <h3 className="mt-14 font-display text-2xl font-semibold">{section.combosTitle}</h3> : null}
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {section.combos.map((combo) => (
              <li key={combo.title} className="rounded-3xl border border-border p-6">
                <h3 className="font-display text-lg font-semibold">{combo.title}</h3>
                <p className="mt-2 text-sm text-muted">{combo.description}</p>
                <Button type="button" variant="secondary" className="mt-4" data-bundle={combo.services.join(',')}>
                  {combo.ctaLabel}
                </Button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </SectionBand>
  );
}

export function ServiceFocus(section: Extract<LpSection, { _type: 'lpServiceFocus' }>) {
  return (
    <SectionBand id="enfoque">
      <SectionHeader eyebrow={section.eyebrow} title={section.title} description={section.description} />
      {section.challenges?.length ? (
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {section.challenges.map((item) => (
            <li key={item.title} className="rounded-3xl border border-border p-5">
              <h3 className="font-display text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.description}</p>
            </li>
          ))}
        </ul>
      ) : null}
      {section.stepsTitle ? <h3 className="mt-12 font-display text-2xl font-semibold">{section.stepsTitle}</h3> : null}
      <ol className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {section.steps.map((step, index) => (
          <li key={step} className="rounded-3xl bg-surface p-5">
            <span className="font-display text-xs font-semibold tracking-[0.14em] text-muted">{String(index + 1).padStart(2, '0')}</span>
            <p className="mt-3 font-semibold text-ink">{step}</p>
          </li>
        ))}
      </ol>
      <h3 className="mt-12 font-display text-2xl font-semibold">{section.relatedTitle}</h3>
      {section.relatedDescription ? <p className="mt-2 text-muted">{section.relatedDescription}</p> : null}
      <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {section.related.map((service) => (
          <li key={service.slug}>
            <a href={service.href} className="block h-full rounded-3xl border border-border p-5 no-underline hover:border-ink">
              <h3 className="font-display text-lg font-semibold text-ink">{service.name}</h3>
              <p className="mt-2 text-sm text-muted">{service.short}</p>
            </a>
          </li>
        ))}
      </ul>
      {section.kpis ? <p className="mt-6 text-sm text-ink-soft"><strong>Lo que medimos:</strong> {section.kpis}</p> : null}
      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-3xl bg-ink px-6 py-5 text-white md:flex-row md:items-center">
        <p className="max-w-2xl text-sm text-white/80">{section.foot}</p>
        <Button type="button" data-bundle={section.bundle.join(',')}>{section.bundleLabel}</Button>
      </div>
    </SectionBand>
  );
}

export function CtaBand({ title, description, primaryLabel, secondaryLabel, whatsappHref }: Extract<LpSection, { _type: 'ctaBand' }>) {
  return (
    <section className="bg-surface">
      <div className="mx-auto flex max-w-[1300px] flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center lg:px-8">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          <p className="mt-3 max-w-xl text-muted">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" data-cal="">{primaryLabel}</Button>
          <Button href={whatsappHref} variant="secondary" target="_blank" rel="noopener">{secondaryLabel}</Button>
        </div>
      </div>
    </section>
  );
}

export function LpReusable(section: LpSection) {
  if (section._type === 'pillarGrid') {
    return (
      <PillarGrid
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description ?? ''}
        pillars={section.pillars}
        tone={section.tone}
        headingWidth={section.headingWidth}
      />
    );
  }
  if (section._type === 'industryGrid') {
    return (
      <IndustryGrid
        industries={section.industries}
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description}
        tone={section.tone}
        hrefPrefix={section.hrefPrefix}
        headingWidth={section.headingWidth}
      />
    );
  }
  if (section._type === 'lpPortal') {
    return (
      <PortalShowcase
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description}
        primaryLabel={section.primaryLabel}
        primaryHref={section.primaryHref}
        secondaryLabel={section.secondaryLabel}
        secondaryHref="#contacto"
        headingWidth={section.headingWidth}
      />
    );
  }
  if (section._type === 'metricsBand') {
    return (
      <MetricsBand
        metrics={section.metrics}
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description}
        primaryLabel=""
        secondaryLabel=""
        headingWidth={section.headingWidth}
      />
    );
  }
  if (section._type === 'casePreview') {
    return (
      <CasePreview
        cases={section.cases}
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description}
        tone={section.tone}
        headingWidth={section.headingWidth}
      />
    );
  }
  if (section._type === 'processPhases') {
    return (
      <ProcessPhases
        phases={section.phases}
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description ?? ''}
        tone={section.tone}
        headingWidth={section.headingWidth}
      />
    );
  }
  if (section._type === 'teamGrid') {
    return (
      <TeamGrid
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description}
        members={section.members}
        slider={section.layout !== 'grid'}
        ctaLabel={section.ctaLabel}
        ctaHref={section.ctaHref}
        headingWidth={section.headingWidth}
      />
    );
  }
  if (section._type === 'faqSection') {
    return (
      <FaqSection
        items={section.items}
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description}
        tone={section.tone}
        withSchema={false}
        headingWidth={section.headingWidth}
      />
    );
  }
  if (section._type === 'finalCta') {
    return (
      <FinalCta
        badge={section.badge}
        title={section.title}
        description={section.description}
        primaryLabel={section.primaryLabel}
        primaryHref={section.primaryHref}
        primaryOpensCalendar={section.primaryOpensCalendar}
        secondaryLabel={section.secondaryLabel}
        secondaryHref={section.secondaryHref}
        headingWidth={section.headingWidth}
        anchorId={section.anchorId}
      />
    );
  }
  return null;
}
