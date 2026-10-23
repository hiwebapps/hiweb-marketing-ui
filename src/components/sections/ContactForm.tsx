import type { ContactField, ContactPageCopy } from '../../lib/content/contact';
import type { SiteIdentity } from '../../lib/site-identity';
import { Button, TextArea, TextField } from '../ui';
import { ContactBanner } from './ContactBanner';
import './ContactForm.css';

const INPUTS: Record<string, { type: string; autoComplete?: string }> = {
  firstName: { type: 'text', autoComplete: 'given-name' },
  lastName: { type: 'text', autoComplete: 'family-name' },
  email: { type: 'email', autoComplete: 'email' },
  phone: { type: 'tel', autoComplete: 'tel' },
  website: { type: 'url', autoComplete: 'url' },
};

/** Submit states. Studio has no fields for these yet. */
const STATUS_COPY = {
  es: {
    sending: 'Enviando…',
    sent: 'Recibimos tu mensaje. Te contactamos en menos de un día hábil.',
    failed: 'No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos a',
  },
  en: {
    sending: 'Sending…',
    sent: 'We got your message. We will reach out within one business day.',
    failed: 'We could not send your message. Try again or email us at',
  },
} as const;

type ContactFormProps = {
  copy: ContactPageCopy;
  site: SiteIdentity;
  locale?: 'es' | 'en';
};

export function ContactForm({ copy, site, locale = 'es' }: ContactFormProps) {
  const status = STATUS_COPY[locale];
  const project = copy.fields.find((field) => field.kind === 'project');
  const left = groupFields(copy.fields.filter((field) => field.kind !== 'project'));
  const customBudget = copy.budgets.some((option) => option.custom);

  return (
    <section className="contact-page">
      <div className="contact-page__inner">
        <ContactBanner title={copy.bannerTitle} subtitle={copy.bannerSubtitle} site={site} />

        <form
          className="contact-form"
          action="/api/contact"
          method="post"
          data-locale={locale}
          data-email={site.email}
          data-services-error={copy.servicesError}
          data-budget-error={copy.budgetError}
          data-custom-error={copy.customBudgetError}
          data-sending={status.sending}
          data-sent={status.sent}
          data-failed={`${status.failed} ${site.email}.`}
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
              <p className="contact-form__status" role="status" aria-live="polite" hidden />
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

