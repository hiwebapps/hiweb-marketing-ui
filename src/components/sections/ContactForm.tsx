import type { ContactField, ContactPageCopy } from '../../lib/content/contact';
import type { SiteIdentity } from '../../lib/site-identity';
import { Button, TextArea, TextField } from '../ui';
import './ContactForm.css';

const INPUTS: Record<string, { type: string; autoComplete?: string }> = {
  firstName: { type: 'text', autoComplete: 'given-name' },
  lastName: { type: 'text', autoComplete: 'family-name' },
  email: { type: 'email', autoComplete: 'email' },
  phone: { type: 'tel', autoComplete: 'tel' },
  website: { type: 'url', autoComplete: 'url' },
};

type ContactFormProps = {
  copy: ContactPageCopy;
  site: SiteIdentity;
};

export function ContactForm({ copy, site }: ContactFormProps) {
  const project = copy.fields.find((field) => field.kind === 'project');
  const left = groupFields(copy.fields.filter((field) => field.kind !== 'project'));
  const customBudget = copy.budgets.some((option) => option.custom);

  return (
    <section className="contact-page">
      <div className="contact-page__inner">
        <div className="contact-banner">
          <h1>
            {copy.bannerTitle}
            {copy.bannerSubtitle ? (
              <>
                <br />
                {copy.bannerSubtitle}
              </>
            ) : null}
          </h1>
          <div className="contact-banner__links">
            <a className="contact-banner__link" href={`mailto:${site.email}`}>
              <span className="contact-banner__icon" aria-hidden="true">
                <MailIcon />
              </span>
              {site.email}
            </a>
            <a className="contact-banner__link" href={site.phoneHref}>
              <span className="contact-banner__icon" aria-hidden="true">
                <PhoneIcon />
              </span>
              {site.phone}
            </a>
            {site.whatsapp ? (
              <a className="contact-banner__link" href={site.whatsapp}>
                WhatsApp
              </a>
            ) : null}
          </div>
        </div>

        <form
          className="contact-form"
          action={`mailto:${site.email}`}
          method="post"
          encType="text/plain"
          data-email={site.email}
          data-services-error={copy.servicesError}
          data-budget-error={copy.budgetError}
          data-custom-error={copy.customBudgetError}
        >
          <div className={project ? 'contact-form__grid contact-form__grid--split' : 'contact-form__grid'}>
            <div className="contact-form__fields">
              {left.map((row) => (
                <div key={row.map((field) => field.id).join('-')} className={row.length > 1 ? 'contact-form__pair' : undefined}>
                  {row.map((field) => (
                    <Field key={field.id} field={field} copy={copy} customBudget={customBudget} />
                  ))}
                </div>
              ))}
            </div>

            {project ? (
              <div className="contact-form__story">
                <TextArea
                  label={project.label}
                  name="project"
                  placeholder={project.placeholder}
                  rows={8}
                  required={project.required}
                />
              </div>
            ) : null}

            <div className="contact-form__submit">
              <Button type="submit" variant="primary">
                {copy.submitLabel}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  field,
  copy,
  customBudget,
}: {
  field: ContactField;
  copy: ContactPageCopy;
  customBudget: boolean;
}) {
  if (field.kind === 'services') {
    return (
      <fieldset className="contact-form__group" data-kind="services" data-required={field.required ? 'true' : 'false'}>
        <legend className="contact-form__label">{field.label}</legend>
        {field.hint ? <p className="contact-form__hint">{field.hint}</p> : null}
        <div className="contact-form__choices">
          {copy.services.map((service) => (
            <label key={service.id} className="contact-form__choice">
              <input type="checkbox" name="services" value={service.label} />
              <span>{service.label}</span>
            </label>
          ))}
        </div>
        <p className="contact-form__error" data-error="services" hidden />
      </fieldset>
    );
  }

  if (field.kind === 'budget') {
    return (
      <fieldset className="contact-form__group contact-form__budget" data-kind="budget" data-required={field.required ? 'true' : 'false'}>
        <legend className="contact-form__label">{field.label}</legend>
        {field.hint ? <p className="contact-form__hint">{field.hint}</p> : null}
        <div className="contact-form__choices">
          {copy.budgets.map((option) => (
            <label key={option.id} className="contact-form__choice">
              <input
                type="radio"
                name="budget"
                value={option.id}
                data-label={option.label}
                data-custom={option.custom ? 'true' : 'false'}
                required={field.required}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {customBudget ? (
          <div className="contact-form__custom">
            <TextField
              label={copy.amountLabel}
              name="customBudget"
              inputMode="decimal"
              placeholder={copy.amountPlaceholder}
              icon={<span className="font-display text-sm font-medium">$</span>}
            />
          </div>
        ) : null}
        <p className="contact-form__error" data-error="budget" hidden />
      </fieldset>
    );
  }

  const input = INPUTS[field.kind] ?? { type: 'text' };
  return (
    <TextField
      label={field.label}
      name={field.kind}
      type={input.type}
      placeholder={field.placeholder}
      autoComplete={input.autoComplete}
      required={field.required}
    />
  );
}

function groupFields(fields: ContactField[]) {
  const rows: ContactField[][] = [];
  let pending: ContactField | null = null;
  for (const field of fields) {
    if (field.width === 'half') {
      if (pending) {
        rows.push([pending, field]);
        pending = null;
      } else {
        pending = field;
      }
    } else {
      if (pending) {
        rows.push([pending]);
        pending = null;
      }
      rows.push([field]);
    }
  }
  if (pending) rows.push([pending]);
  return rows;
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.2 4.4 8 8.6l5.8-4.2" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6.2 2.6c.3-.7 1.2-.9 1.8-.4l1.1 1c.4.4.5 1 .2 1.5L8.6 6.2a8.2 8.2 0 0 0 1.2 1.2l1.5-.7c.5-.3 1.1-.2 1.5.2l1 1.1c.5.6.3 1.5-.4 1.8l-1.2.5c-.8.3-1.7.2-2.6-.3a11 11 0 0 1-3.4-3.4c-.5-.9-.6-1.8-.3-2.6l.5-1.2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
