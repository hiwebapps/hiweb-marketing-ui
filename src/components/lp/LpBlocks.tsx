import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Badge, Button, TextField } from '../ui';
import { CasePreview } from '../sections/CasePreview';
import { FaqSection } from '../sections/FaqSection';
import { IndustryGrid } from '../sections/IndustryGrid';
import { MetricsBand } from '../sections/MetricsBand';
import { PillarGrid } from '../sections/PillarGrid';
import { PortalShowcase } from '../sections/PortalShowcase';
import { ProcessPhases } from '../sections/ProcessPhases';
import { SectionBand } from '../sections/primitives/SectionBand';
import { SectionHeader } from '../sections/primitives/SectionHeader';
import { HeadingText } from '../sections/primitives/heading';
import { TeamGrid } from '../sections/TeamGrid';
import { FinalCta } from '../sections/FinalCta';
import { NavIcon } from '../sections/NavIcon';
import { LP_PICKER_ICONS } from '../../data/lp/picker-icons';
import type { LpSection, LpServiceCard } from '../../lib/content/lp-types';

export function LogoMarquee({ label, logos }: Extract<LpSection, { _type: 'logoMarquee' }>) {
  const loop = [...logos, ...logos];
  return (
    <section className="lp-logo-band" aria-label={label}>
      <p className="relative z-10 mb-5 text-center font-display text-xs font-medium tracking-[0.16em] text-white/60 uppercase">{label}</p>
      <div className="lp-marquee">
        <div className="lp-marquee__track">
          {loop.map((logo, index) => (
            <img key={`${logo.alt}-${index}`} src={logo.src} alt={index < logos.length ? logo.alt : ''} height="44" decoding="async" loading="lazy" />
          ))}
        </div>
      </div>
    </section>
  );
}

const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
const count = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 });

function useTween(value: number, duration = 450) {
  const [shown, setShown] = useState(value);
  const current = useRef(value);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      current.current = value;
      setShown(value);
      return;
    }
    const origin = current.current;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const next = origin + (value - origin) * (1 - (1 - progress) ** 3);
      current.current = next;
      setShown(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return shown;
}

function formatClients(value: number) {
  return `≈ ${value >= 1 ? Math.round(value) : value.toFixed(1)}`;
}

function formatRoi(value: number) {
  const rounded = Math.round(value);
  return `${rounded >= 0 ? '+' : ''}${count.format(rounded)}%`;
}

function Chevron() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RoiCalculator(section: Extract<LpSection, { _type: 'roiCalculator' }>) {
  const { eyebrow, title, description, ctaLabel, preset, industries } = section;
  const minInvestment = Math.max(section.investment.min, 0);
  const maxInvestment = Math.max(section.investment.max, minInvestment + 1);
  const initial = industries.find((item) => item.slug === preset) ?? industries[0];
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [investment, setInvestment] = useState(section.investment.initial);
  const [amountDraft, setAmountDraft] = useState<string | null>(null);
  const [cpl, setCpl] = useState(initial?.cpl ?? 400);
  const [closeRate, setCloseRate] = useState(initial?.close ?? 10);
  const [ticket, setTicket] = useState(initial?.ticket ?? 20000);
  const [margin, setMargin] = useState(initial?.margin ?? 30);

  const industry = industries.find((item) => item.slug === slug);
  const edited = Boolean(
    industry &&
      (industry.cpl !== cpl || industry.close !== closeRate || industry.ticket !== ticket || industry.margin !== margin),
  );

  const applyIndustry = (next: string) => {
    const match = industries.find((item) => item.slug === next);
    setSlug(next);
    if (!match) return;
    setCpl(match.cpl);
    setCloseRate(match.close);
    setTicket(match.ticket);
    setMargin(match.margin);
  };

  const result = useMemo(() => {
    const leads = cpl > 0 ? investment / cpl : 0;
    const clients = leads * (closeRate / 100);
    const revenue = clients * ticket;
    const profit = revenue * (margin / 100);
    const roi = investment ? ((profit - investment) / investment) * 100 : 0;
    return { leads, clients, revenue, profit, roi };
  }, [investment, cpl, closeRate, ticket, margin]);

  const roiShown = useTween(result.roi);
  const leadsShown = useTween(result.leads);
  const clientsShown = useTween(result.clients);
  const revenueShown = useTween(result.revenue);
  const profitShown = useTween(result.profit);

  const sliderValue = Math.min(Math.max(investment, minInvestment), maxInvestment);
  const fill = ((sliderValue - minInvestment) / (maxInvestment - minInvestment)) * 100;
  const negative = result.roi < 0;

  const funnel = [
    { label: section.funnelInvestment, value: money.format(investment) },
    { label: section.funnelLeads, value: count.format(leadsShown) },
    { label: section.funnelClients, value: formatClients(clientsShown) },
    { label: section.funnelRevenue, value: money.format(revenueShown) },
    { label: section.funnelProfit, value: money.format(profitShown), highlight: true },
  ];

  const review = () => {
    const summary = [
      `Calculadora de ROI: ${industry?.name ?? 'Sin industria'}`,
      `inversión ${money.format(investment)}/mes`,
      `CPL ${money.format(cpl)}`,
      `cierre ${closeRate}%`,
      `venta promedio ${money.format(ticket)}`,
      `margen ${margin}%`,
      `→ ${count.format(result.leads)} leads, ${formatClients(result.clients)} clientes, ventas ${money.format(result.revenue)}, ROI ${formatRoi(result.roi)}`,
    ].join(' · ');
    window.dispatchEvent(new CustomEvent('lp-roi-scenario', { detail: { summary, investment } }));
    const form = document.getElementById('contacto');
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else document.querySelector<HTMLElement>('[data-cal]')?.click();
  };

  return (
    <SectionBand id="roi">
      <div className="lp-roi">
        <div className="lp-roi__controls">
          <Badge variant="lime">{eyebrow}</Badge>
          <SectionHeader title={title} description={description} className="mt-5" />

          <fieldset className="lp-roi__group">
            <legend className="lp-roi__step">
              <span className="lp-roi__step-num">1</span>
              {section.industryLabel}
            </legend>
            <div className="lp-roi__industries">
              {industries.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  className="lp-roi__industry"
                  aria-pressed={slug === item.slug}
                  onClick={() => applyIndustry(item.slug)}
                >
                  <span className="lp-roi__industry-icon" aria-hidden="true">
                    <NavIcon name={item.icon || LP_PICKER_ICONS[item.slug] || 'grid'} />
                  </span>
                  {item.name}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="lp-roi__group">
            <div className="lp-roi__invest-head">
              <label className="lp-roi__step" htmlFor="lp-roi-inv">
                <span className="lp-roi__step-num">2</span>
                {section.investmentLabel}
              </label>
              <input
                className="lp-roi__amount"
                type="text"
                inputMode="numeric"
                aria-label="Inversión mensual en pesos"
                value={amountDraft ?? money.format(investment)}
                onFocus={(event) => {
                  setAmountDraft(String(investment));
                  requestAnimationFrame(() => event.target.select());
                }}
                onChange={(event) => {
                  const digits = event.target.value.replace(/\D/g, '').slice(0, 8);
                  setAmountDraft(digits);
                  if (Number(digits) > 0) setInvestment(Number(digits));
                }}
                onBlur={() => {
                  setInvestment((value) => Math.max(value, 1000));
                  setAmountDraft(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') event.currentTarget.blur();
                }}
              />
            </div>
            <input
              id="lp-roi-inv"
              type="range"
              className="lp-roi__range"
              min={minInvestment}
              max={maxInvestment}
              step={Math.max(section.investment.step, 1)}
              value={sliderValue}
              aria-valuetext={money.format(investment)}
              style={{ '--fill': `${fill}%` } as CSSProperties}
              onChange={(event) => setInvestment(Number(event.target.value))}
            />
            <div className="lp-roi__range-scale" aria-hidden="true">
              <span>{money.format(minInvestment)}</span>
              <span>{money.format(maxInvestment)}</span>
            </div>
          </div>

          <details className="lp-roi__assumptions">
            <summary>
              <span className="lp-roi__step-num">3</span>
              <span className="min-w-0">
                <span className="lp-roi__assumptions-title">
                  {section.assumptionsLabel} {industry?.name.toLowerCase() ?? ''}
                </span>
                <span className="lp-roi__assumptions-meta">
                  CPL {money.format(cpl)} · Cierre {closeRate}% · Venta {money.format(ticket)} · Margen {margin}%
                </span>
              </span>
              <span className="lp-roi__chevron">
                <Chevron />
              </span>
            </summary>
            <div className="lp-roi__assumptions-body">
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label={section.cplLabel} type="number" min={1} suffix="MXN" value={cpl} onChange={(event) => setCpl(Number(event.target.value))} />
                <TextField label={section.closeLabel} type="number" min={0} max={100} step={0.5} suffix="%" value={closeRate} onChange={(event) => setCloseRate(Number(event.target.value))} />
                <TextField label={section.ticketLabel} type="number" min={0} suffix="MXN" value={ticket} onChange={(event) => setTicket(Number(event.target.value))} />
                <TextField label={section.marginLabel} type="number" min={0} max={100} suffix="%" value={margin} onChange={(event) => setMargin(Number(event.target.value))} />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-muted">{section.assumptionsHint}</p>
                {edited ? (
                  <button type="button" className="lp-roi__reset" onClick={() => applyIndustry(slug)}>
                    {section.resetLabel}
                  </button>
                ) : null}
              </div>
            </div>
          </details>

          <a href="#lp-roi-result" className="lp-roi__dock">
            <span className="lp-roi__dock-label">ROI</span>
            <span className="lp-roi__dock-value">{formatRoi(roiShown)}</span>
            <span className="lp-roi__dock-meta">{section.funnelRevenue} {money.format(revenueShown)}</span>
            <span className="lp-roi__dock-cta">{section.dockCta}</span>
          </a>
        </div>

        <aside id="lp-roi-result" className="lp-roi__result" aria-labelledby="lp-roi-result-title">
          <p id="lp-roi-result-title" className="font-display text-xs font-medium tracking-[0.16em] text-canvas/55 uppercase">
            {section.resultLabel}
          </p>
          <p className="lp-roi__value">{formatRoi(roiShown)}</p>
          {negative ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="orange" tone="on-ink">{section.negativeBadge}</Badge>
              <span className="text-sm text-canvas/65">{section.negativeHint}</span>
            </div>
          ) : (
            <p className="mt-3 text-sm text-canvas/65">{section.formula}</p>
          )}

          <ol className="lp-roi__funnel">
            {funnel.map((item) => (
              <li key={item.label} className={item.highlight ? 'is-highlight' : undefined}>
                <span className="lp-roi__funnel-label">{item.label}</span>
                <span className="lp-roi__funnel-value">{item.value}</span>
              </li>
            ))}
          </ol>

          <p className="sr-only" aria-live="polite">
            {`ROI estimado ${formatRoi(result.roi)}. ${count.format(result.leads)} leads, ${formatClients(result.clients)} clientes, ventas de ${money.format(result.revenue)} y utilidad de ${money.format(result.profit)} al mes.`}
          </p>

          <Button type="button" className="lp-roi__cta mt-7" onClick={review}>{ctaLabel}</Button>
          <p className="mt-4 text-xs text-canvas/45">{section.disclaimer}</p>
        </aside>
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
          <h2 className="hw-section-title mt-5 text-ink">{title}</h2>
        </div>
        <div className="grid gap-4">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="!text-sm !leading-relaxed text-muted md:!text-base">{paragraph}</p>
          ))}
        </div>
      </div>
    </SectionBand>
  );
}

function serviceCardCopy(service: LpServiceCard) {
  return {
    icon: service.icon || LP_PICKER_ICONS[service.slug] || 'grid',
    label: service.name,
    title: service.title || service.name,
    text: service.short,
  };
}

export function ServiceSystem(section: Extract<LpSection, { _type: 'serviceSystem' }>) {
  const [active, setActive] = useState(0);
  const quadrant = section.quadrants[active] ?? section.quadrants[0];

  return (
    <SectionBand id="servicios-lp" tone="canvas">
      <div className="lp-service-intro">
        <div>
          <Badge variant="purple">{section.eyebrow}</Badge>
          <h2 className="hw-section-title mt-4 text-ink" data-split="">
            <HeadingText text={section.title} />
          </h2>
        </div>
        {section.description ? <p className="lp-service-intro__text !text-sm !leading-relaxed text-muted md:!text-base">{section.description}</p> : null}
      </div>
      <div className="lp-service-layout">
        <div className="lp-service-tabs" role="tablist" aria-label={section.eyebrow}>
          {section.quadrants.map((item, index) => (
            <button
              key={item.title}
              type="button"
              role="tab"
              id={`lp-service-tab-${index}`}
              aria-selected={index === active}
              aria-controls="lp-service-panel"
              className="lp-service-tab"
              onClick={() => setActive(index)}
            >
              <span className="lp-service-tab__icon" aria-hidden="true">
                <NavIcon name={item.icon || 'grid'} />
              </span>
              {item.title}
            </button>
          ))}
        </div>
        <div className="lp-service-grid" id="lp-service-panel" role="tabpanel" aria-labelledby={`lp-service-tab-${active}`}>
        {quadrant?.services.map((service) => {
          const card = serviceCardCopy(service);
          return (
            <a key={service.slug} className="lp-service-card" href={service.href}>
              <span className="lp-service-card__head">
                <span className="lp-service-card__icon" aria-hidden="true">
                  <NavIcon name={card.icon} />
                </span>
                <span className="lp-service-card__label">{card.label}</span>
                <span className="lp-service-card__arrow" aria-hidden="true">
                  <svg viewBox="0 0 20 20" width="18" height="18">
                    <path d="M4 10h12M11 5l5 5-5 5" />
                  </svg>
                </span>
              </span>
              <span className="lp-service-card__title">{card.title}</span>
              <span className="lp-service-card__text">{card.text}</span>
            </a>
          );
        })}
        <button type="button" className="lp-service-cta" data-cal="">
          <span className="lp-service-cta__title">{section.ctaTitle}</span>
          <span className="lp-service-cta__text">{section.ctaText}</span>
        </button>
        </div>
      </div>
      {section.combos?.length ? (
        <>
          {section.combosTitle ? <h3 className="mt-14 font-sans text-2xl font-medium tracking-tight">{section.combosTitle}</h3> : null}
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {section.combos.map((combo) => (
              <li key={combo.title} className="rounded-3xl border border-border p-6">
                <h3 className="font-sans text-lg font-semibold tracking-tight">{combo.title}</h3>
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
              <h3 className="font-sans text-lg font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.description}</p>
            </li>
          ))}
        </ul>
      ) : null}
      {section.stepsTitle ? <h3 className="mt-12 font-sans text-2xl font-medium tracking-tight">{section.stepsTitle}</h3> : null}
      <ol className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {section.steps.map((step, index) => (
          <li key={step} className="rounded-3xl bg-surface p-5">
            <span className="font-display text-xs font-medium tracking-[0.16em] text-muted">{String(index + 1).padStart(2, '0')}</span>
            <p className="mt-3 font-sans font-semibold tracking-tight text-ink">{step}</p>
          </li>
        ))}
      </ol>
      <h3 className="mt-12 font-sans text-2xl font-medium tracking-tight">{section.relatedTitle}</h3>
      {section.relatedDescription ? <p className="mt-2 !text-sm !leading-relaxed text-muted md:!text-base">{section.relatedDescription}</p> : null}
      <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {section.related.map((service) => (
          <li key={service.slug}>
            <a href={service.href} className="block h-full rounded-3xl border border-border p-5 no-underline hover:border-ink">
              <h3 className="font-sans text-lg font-semibold tracking-tight text-ink">{service.name}</h3>
              <p className="mt-2 text-sm text-muted">{service.short}</p>
            </a>
          </li>
        ))}
      </ul>
      {section.kpis ? (
        <p className="mt-6 text-sm text-ink-soft">
          {section.kpisLabel ? <strong>{section.kpisLabel}</strong> : null} {section.kpis}
        </p>
      ) : null}
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
          <h2 className="hw-section-title text-ink">{title}</h2>
          <p className="mt-3 max-w-xl !text-sm !leading-relaxed text-muted md:!text-base">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" data-cal="">{primaryLabel}</Button>
          <Button href={whatsappHref} variant="secondary" target="_blank" rel="noopener">{secondaryLabel}</Button>
        </div>
      </div>
    </section>
  );
}

export function LpReusable(section: LpSection & { images?: string[] }) {
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
        ctaLabel={section.ctaLabel}
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
        secondaryHref={section.secondaryHref || '#contacto'}
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
        portfolio={section.portfolio}
        cardCtaLabel={section.cardCtaLabel}
        portfolioLabel={section.portfolioLabel}
        portfolioHref={section.portfolioHref}
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
        align="center"
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
        images={section.images}
      />
    );
  }
  return null;
}
