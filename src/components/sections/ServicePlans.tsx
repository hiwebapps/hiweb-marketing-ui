import { Badge, Button } from '../ui';
import { IconCheckCircle } from '../icons/PillarIcons';
import type { ServicePlans as ServicePlansContent } from '../../data/service-plans';
import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';
import './ServicePlans.css';

type ServicePlansProps = ServicePlansContent & {
  tone?: 'canvas' | 'surface';
  headingWidth?: string;
  includesLabel?: string;
};

export function ServicePlans({
  eyebrow,
  title,
  description,
  note,
  noteHref,
  noteLabel,
  ctaLabel,
  ctaHref,
  plans,
  tone = 'canvas',
  headingWidth,
  includesLabel = 'Incluye',
}: ServicePlansProps) {
  const noteBody = noteLabel && noteHref ? note.split(noteLabel) : null;

  return (
    <SectionBand id="precios" tone={tone}>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        badgeVariant="lime"
        align="center"
        headingWidth={headingWidth}
      />
      <ul className={`service-plans is-${plans.length === 1 ? 'one' : plans.length === 2 ? 'two' : 'many'}`}>
        {plans.map((plan, index) => {
          const badge = plan.badge?.trim();
          return (
          <li
            key={`${plan.name ?? plan.price}-${index}`}
            className={plan.featured ? 'service-plans__card is-featured' : 'service-plans__card'}
          >
            {plan.name || badge ? (
              <div className={plan.name ? 'service-plans__head' : 'service-plans__head is-badge-only'}>
                {plan.name ? <h3>{plan.name}</h3> : null}
                {badge ? <Badge variant="lime">{badge}</Badge> : null}
              </div>
            ) : null}
            <p className="service-plans__price">
              {plan.price}
              {plan.period ? <span>{plan.period}</span> : null}
            </p>
            <p className="service-plans__includes">{includesLabel}</p>
            <ul>
              {plan.includes.map((item) => (
                <li key={item}>
                  <IconCheckCircle />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button
              href={ctaHref}
              variant={plan.featured ? 'primary' : 'secondary'}
              size="md"
              className="service-plans__cta no-underline"
            >
              {ctaLabel}
            </Button>
          </li>
          );
        })}
      </ul>
      {noteBody && noteHref && noteLabel ? (
        <p className="service-plans__note">
          {noteBody[0]}
          <a href={noteHref}>{noteLabel}</a>
          {noteBody[1]}
        </p>
      ) : (
        <p className="service-plans__note">{note}</p>
      )}
    </SectionBand>
  );
}
