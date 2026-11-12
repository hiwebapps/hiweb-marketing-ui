import { useEffect, useState, type FormEvent } from 'react';
import { LP_SERVICES } from '../../data/lp/catalog';
import { LP_FORM_DEFAULTS } from '../../data/lp/defaults';
import { readAttribution } from '../../lib/attribution';
import { getTurnstileToken, HONEYPOT_FIELD, HONEYPOT_STYLE, preloadTurnstile } from '../../lib/growth/turnstile-client';
import { Button } from '../ui/Button';
import { TextField } from '../ui/TextField';

/** Highest budget option whose amount fits the investment. Options without a number never match. */
function budgetFor(investment: number, budgets: string[]) {
  let match = '';
  let best = -1;
  for (const label of budgets) {
    const floor = Number(label.replace(/\D/g, ''));
    if (floor > 0 && floor <= investment && floor > best) {
      best = floor;
      match = label;
    }
  }
  return match;
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LpLeadFormProps = {
  landingName: string;
  interests?: string[];
  sizes?: string[];
  budgets?: string[];
};

export function LpLeadForm({
  landingName,
  interests = [],
  sizes = LP_FORM_DEFAULTS.formSizes,
  budgets = LP_FORM_DEFAULTS.formBudgets,
}: LpLeadFormProps) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [selected, setSelected] = useState<string[]>(interests);
  const [budget, setBudget] = useState('');
  const [scenario, setScenario] = useState('');
  const [trap, setTrap] = useState('');

  useEffect(() => {
    preloadTurnstile();
  }, []);

  useEffect(() => {
    const onSet = (event: Event) => {
      const detail = (event as CustomEvent<string[]>).detail;
      if (!Array.isArray(detail)) return;
      const known = new Set(LP_SERVICES.map((item) => item.slug));
      setSelected(detail.filter((slug) => known.has(slug)));
      setStep(1);
      setError('');
    };
    const onScenario = (event: Event) => {
      const detail = (event as CustomEvent<{ summary?: string; investment?: number }>).detail;
      if (!detail?.summary) return;
      setScenario(detail.summary);
      const match = budgetFor(Number(detail.investment) || 0, budgets);
      if (match) setBudget(match);
    };
    window.addEventListener('lp-set-interests', onSet);
    window.addEventListener('lp-roi-scenario', onScenario);
    return () => {
      window.removeEventListener('lp-set-interests', onSet);
      window.removeEventListener('lp-roi-scenario', onScenario);
    };
  }, [budgets]);

  const validate = (index = step) => {
    if (index === 0) {
      if (firstName.trim().length < 2) return 'Escribe tu nombre.';
      if (lastName.trim().length < 2) return 'Escribe tu apellido.';
      if (!EMAIL_RE.test(email.trim())) return 'Escribe un email válido.';
      if (phone.replace(/\D/g, '').length < 7) return 'Escribe un celular válido.';
      if (website.trim() && !/^https?:\/\/.+\..+/i.test(website.trim()) && !/^[^\s]+\.[^\s]+$/.test(website.trim())) {
        return 'El sitio web no parece una dirección válida.';
      }
    }
    if (index === 1) {
      if (!companySize) return 'Elige el tamaño de la empresa.';
      if (selected.length === 0) return 'Elige al menos un servicio.';
    }
    return '';
  };

  const next = () => {
    const message = validate();
    setError(message);
    if (!message) setStep(1);
  };

  const toggle = (slug: string) => {
    setSelected((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    );
    setError('');
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const message = validate(0) || validate(1);
    setError(message);
    if (message || sending) return;
    setSending(true);
    const utm = readAttribution();
    const site = website.trim();
    try {
      const turnstileToken = await getTurnstileToken();
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          turnstileToken,
          [HONEYPOT_FIELD]: trap,
          locale: 'es',
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          website: site ? (site.startsWith('http') ? site : `https://${site}`) : undefined,
          services: selected,
          budget: budget || undefined,
          project: scenario || undefined,
          companySize,
          landing: landingName,
          utm,
        }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || 'No pudimos enviar tus datos.');
      }
      const dataLayer = ((window as Window & { dataLayer?: Record<string, string>[] }).dataLayer ??= []);
      dataLayer.push({
        event: 'lead_form_submitted',
        form_type: 'ads_landing',
        landing_name: landingName,
        utm_source: utm.utm_source ?? '',
        utm_campaign: utm.utm_campaign ?? '',
      });
      window.location.href = '/gracias?origen=formulario';
    } catch (cause) {
      setSending(false);
      setError(cause instanceof Error ? cause.message : 'No pudimos enviar tus datos.');
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <div aria-hidden="true" style={HONEYPOT_STYLE}>
        <label>
          Deja este campo vacío
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" value={trap} onChange={(event) => setTrap(event.target.value)} />
        </label>
      </div>
      <p className="font-display text-xs font-medium tracking-[0.16em] text-muted uppercase">
        Paso {step + 1} de 2
      </p>
      <div className="mt-2 grid grid-cols-2 gap-1.5" aria-hidden="true">
        {[0, 1].map((index) => (
          <span key={index} className={['h-1 rounded-full', index <= step ? 'bg-ink' : 'bg-surface-elevated'].join(' ')} />
        ))}
      </div>

      {scenario ? (
        <p className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-2 font-sans text-xs text-ink-soft" role="status">
          <span>Adjuntamos tu escenario de la calculadora de ROI.</span>
          <button type="button" className="shrink-0 font-medium text-ink underline" onClick={() => setScenario('')}>
            Quitar
          </button>
        </p>
      ) : null}

      {step === 0 ? (
        <div className="mt-4 grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField label="Nombre" name="firstName" autoComplete="given-name" placeholder="Tu nombre" value={firstName} onChange={(event) => setFirstName(event.target.value)} required />
            <TextField label="Apellido" name="lastName" autoComplete="family-name" placeholder="Tu apellido" value={lastName} onChange={(event) => setLastName(event.target.value)} required />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField label="Email" name="email" type="email" autoComplete="email" placeholder="tu@empresa.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <TextField label="Celular" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+52 999 000 0000" value={phone} onChange={(event) => setPhone(event.target.value)} required />
          </div>
          <TextField label="Sitio web (opcional)" name="website" type="url" inputMode="url" autoComplete="url" placeholder="https://tuempresa.com" value={website} onChange={(event) => setWebsite(event.target.value)} />
        </div>
      ) : null}

      {step === 1 ? (
        <div className="mt-5 grid gap-5">
          <label className="flex flex-col gap-2">
            <span className="font-display text-xs font-medium tracking-[0.14em] text-ink uppercase">Tamaño de la empresa</span>
            <select
              name="companySize"
              value={companySize}
              required
              onChange={(event) => { setCompanySize(event.target.value); setError(''); }}
              className="w-full rounded-xl border border-border bg-canvas px-4 py-3 font-sans text-sm text-ink"
            >
              <option value="">Elige un tamaño</option>
              {sizes.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <fieldset>
            <legend className="font-sans text-sm text-ink-soft">Servicios que te interesan. Elige uno o varios.</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {LP_SERVICES.map((service) => {
                const on = selected.includes(service.slug);
                return (
                  <button
                    key={service.slug}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(service.slug)}
                    className={[
                      'rounded-full border px-3 py-2 font-sans text-sm',
                      on ? 'border-ink bg-ink text-canvas' : 'border-border bg-canvas text-ink',
                    ].join(' ')}
                  >
                    {service.name}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
      ) : null}

      {error ? (
        <p className="mt-4 font-sans text-sm text-accent-orange" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex items-center justify-between gap-3">
        {step > 0 ? (
          <Button type="button" variant="ghost" onClick={() => { setStep((value) => value - 1); setError(''); }}>
            Atrás
          </Button>
        ) : (
          <span />
        )}
        {step === 0 ? (
          <Button type="button" onClick={next}>Siguiente</Button>
        ) : (
          <Button type="submit" disabled={sending}>{sending ? 'Enviando…' : 'Enviar'}</Button>
        )}
      </div>
      <p className="mt-3 text-center font-sans text-xs text-muted">
        Al enviar aceptas nuestro <a href="/aviso-de-privacidad" className="underline">Aviso de privacidad</a>.
      </p>
    </form>
  );
}
