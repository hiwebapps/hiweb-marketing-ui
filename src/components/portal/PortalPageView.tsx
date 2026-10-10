import { useMemo, useState } from 'react';
import { Badge, Button, type BadgeVariant } from '../ui';
import { BeforeAfter } from '../sections/BeforeAfter';
import { SectionBand } from '../sections/primitives/SectionBand';
import { SectionHeader } from '../sections/primitives/SectionHeader';
import type { PortalSection } from '../../lib/content/types';
import { PortalDemo } from './PortalDemo';
import './PortalPage.css';

const VARIANTS = ['cyan', 'orange', 'purple', 'lime', 'neutral'] as const;

function variant(value?: string): BadgeVariant {
  return (VARIANTS as readonly string[]).includes(value ?? '') ? (value as BadgeVariant) : 'neutral';
}

function openTour() {
  document.getElementById('portal-visor')?.scrollIntoView({ behavior: 'smooth' });
  window.dispatchEvent(new Event('portal-tour'));
}

function openViewer() {
  document.getElementById('portal-visor')?.scrollIntoView({ behavior: 'smooth' });
  window.dispatchEvent(new Event('portal-viewer'));
}

function splitHeadline(title: string) {
  const cut = title.indexOf('. ');
  if (cut < 0) return { lead: title, rest: '' };
  return { lead: title.slice(0, cut + 1), rest: title.slice(cut + 2) };
}

function heroLabel(note: string | undefined, locale: 'es' | 'en') {
  const fallback = locale === 'en' ? 'Hiweb Client Portal' : 'Portal de Clientes Hiweb';
  const cleaned = (note || fallback).replace(/\s*2\.0\b/gi, '').replace(/\s+/g, ' ').trim();
  return cleaned || fallback;
}

function Journey({ section }: { section: Extract<PortalSection, { _type: 'portalJourney' }> }) {
  const steps = section.steps ?? [];
  const [active, setActive] = useState(0);
  const step = steps[active];
  if (!steps.length) return null;
  return (
    <SectionBand id="flujo" tone="surface">
      <SectionHeader
        eyebrow={section.eyebrow || ''}
        title={section.title || ''}
        description={section.description}
        headingWidth={section.headingWidth}
      />
      <div className="portal-journey">
        <div className="portal-journey__tabs" role="tablist">
          {steps.map((item, index) => (
            <button
              key={`${item.index ?? index}-${item.title}`}
              type="button"
              role="tab"
              aria-selected={index === active}
              className={index === active ? 'is-on' : ''}
              onClick={() => setActive(index)}
            >
              <span>{item.index || String(index + 1).padStart(2, '0')}</span>
              <strong>{item.title}</strong>
              {item.description ? <small>{item.description}</small> : null}
            </button>
          ))}
        </div>
        {step ? (
          <article className="portal-journey__panel" role="tabpanel">
            {step.badge ? <Badge variant={variant(step.badgeVariant)}>{step.badge}</Badge> : null}
            {step.panelTitle ? <h3>{step.panelTitle}</h3> : null}
            {step.panelText ? <p>{step.panelText}</p> : null}
          </article>
        ) : null}
      </div>
    </SectionBand>
  );
}

function Faq({ section }: { section: Extract<PortalSection, { _type: 'portalFaq' }> }) {
  const items = section.items ?? [];
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) =>
      [item.question, item.answer, item.badge, item.category].some((value) =>
        value?.toLowerCase().includes(needle),
      ),
    );
  }, [items, query]);
  const [active, setActive] = useState(0);
  const current = filtered[Math.min(active, Math.max(filtered.length - 1, 0))];
  if (!items.length) return null;
  return (
    <SectionBand id="faq">
      <SectionHeader
        eyebrow={section.eyebrow || ''}
        title={section.title || ''}
        description={section.description}
        headingWidth={section.headingWidth}
      />
      <label className="portal-faq__search">
        <span className="sr-only">{section.searchPlaceholder || 'Buscar'}</span>
        <input
          type="search"
          value={query}
          placeholder={section.searchPlaceholder}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
        />
      </label>
      <div className="portal-faq">
        <div className="portal-faq__list" role="tablist">
          {filtered.map((item, index) => (
            <button
              key={item.question}
              type="button"
              role="tab"
              aria-selected={index === active}
              className={index === active ? 'is-on' : ''}
              onClick={() => setActive(index)}
            >
              {item.badge ? <Badge variant="cyan">{item.badge}</Badge> : null}
              <span>{item.question}</span>
            </button>
          ))}
        </div>
        {current ? (
          <article className="portal-faq__answer" role="tabpanel">
            {current.category ? <p className="portal-faq__cat">{current.category}</p> : null}
            <h3>{current.question}</h3>
            <p>{current.answer}</p>
          </article>
        ) : (
          <p className="portal-faq__empty">{query}</p>
        )}
      </div>
    </SectionBand>
  );
}

export function PortalPageView({
  sections,
  locale = 'es',
}: {
  sections: PortalSection[];
  locale?: 'es' | 'en';
}) {
  return (
    <>
      {sections.map((section, index) => {
        if (section._type === 'portalHero') {
          const headline = splitHeadline(section.title || '');
          return (
            <SectionBand id="portal-visor" key={`hero-${index}`} dense>
              <div className="portal-hero">
                <div className="portal-hero__copy">
                  <div className="portal-hero__tag">
                    <span>{heroLabel(section.badgeNote, locale)}</span>
                  </div>
                  <h1>
                    {headline.lead}
                    {headline.rest ? <em> {headline.rest}</em> : null}
                  </h1>
                  {section.description ? <p className="portal-hero__sub">{section.description}</p> : null}
                  <div className="portal-hero__actions">
                    <Button type="button" onClick={openTour}>
                      <span aria-hidden="true">▶</span>
                      {section.tourLabel || ''}
                    </Button>
                    <Button type="button" variant="secondary" onClick={openViewer}>
                      <span aria-hidden="true">✓</span>
                      {section.viewerLabel || ''}
                    </Button>
                  </div>
                  {section.proofTitle || section.proofText ? (
                    <div className="portal-hero__proof">
                      <span className="portal-hero__avatars" aria-hidden="true">
                        <span>☕</span>
                        <span>🎨</span>
                        <span>📈</span>
                        <span>✨</span>
                      </span>
                      <span>
                        {section.proofTitle ? <strong>{section.proofTitle}</strong> : null}
                        {section.proofText ? <small>{section.proofText}</small> : null}
                      </span>
                    </div>
                  ) : null}
                </div>
                <PortalDemo
                  locale={locale}
                  clientName={section.clientName}
                  windowTitle={section.windowTitle}
                  samples={section.samples}
                  tourLabel={section.tourLabel}
                  viewerLabel={section.viewerLabel}
                  coachLabel={section.coachLabel}
                  coachText={section.coachText}
                />
              </div>
            </SectionBand>
          );
        }
        if (section._type === 'portalStrip') {
          return (
            <SectionBand key={`strip-${index}`} tone="surface" dense>
              <p className="portal-strip">
                {section.text ? <span>{section.text}</span> : null}
                <span className="portal-strip__badges">
                  {(section.badges ?? []).map((badge) => (
                    <Badge key={badge.label} variant={variant(badge.variant)}>
                      {badge.label}
                    </Badge>
                  ))}
                </span>
              </p>
            </SectionBand>
          );
        }
        if (section._type === 'portalJourney') return <Journey key={`journey-${index}`} section={section} />;
        if (section._type === 'portalBento') {
          return (
            <SectionBand id="caracteristicas" key={`bento-${index}`}>
              <SectionHeader
                eyebrow={section.eyebrow || ''}
                title={section.title || ''}
                description={section.description}
                headingWidth={section.headingWidth}
              />
              <div className="portal-bento">
                {(section.cards ?? []).map((card) => (
                  <article key={card.title} className="portal-bento__card">
                    {card.eyebrow ? <p>{card.eyebrow}</p> : null}
                    <h3>{card.title}</h3>
                    {card.description ? <p>{card.description}</p> : null}
                  </article>
                ))}
              </div>
            </SectionBand>
          );
        }
        if (section._type === 'portalFaq') return <Faq key={`faq-${index}`} section={section} />;
        if (section._type === 'portalCloser') {
          return (
            <SectionBand id="closer" key={`closer-${index}`} tone="ink">
              <div className="portal-closer">
                {section.lead ? <p>{section.lead}</p> : null}
                <SectionHeader
                  title={section.title || ''}
                  description={section.description}
                  tone="on-ink"
                  align="center"
                  headingWidth={section.headingWidth}
                />
                <div className="portal-hero__actions">
                  {section.primaryLabel ? (
                    <Button type="button" onClick={openTour}>
                      {section.primaryLabel}
                    </Button>
                  ) : null}
                  {section.secondaryLabel ? (
                    <Button type="button" variant="secondary" onClick={openViewer}>
                      {section.secondaryLabel}
                    </Button>
                  ) : null}
                </div>
                {section.trust?.length ? (
                  <p className="portal-closer__trust">{section.trust.join(' · ')}</p>
                ) : null}
              </div>
            </SectionBand>
          );
        }
        if (section._type === 'beforeAfter') {
          return (
            <BeforeAfter
              key={`compare-${index}`}
              eyebrow={section.eyebrow}
              title={section.title}
              description={section.description}
              badgeVariant={variant(section.badgeVariant)}
              headingWidth={section.headingWidth}
              pairs={section.pairs}
            />
          );
        }
        return null;
      })}
    </>
  );
}
