/** Validates the contact form and posts it to /api/contact. Shared by /contacto and /en/contact. */
const form = document.querySelector('.contact-form');

if (form instanceof HTMLFormElement) {
  const status = form.querySelector('.contact-form__status');
  const submit = form.querySelector('button[type="submit"]');

  const showError = (key: string, message: string) => {
    const node = form.querySelector(`[data-error="${key}"]`);
    if (!(node instanceof HTMLElement)) return;
    node.hidden = message.length === 0;
    node.textContent = message;
  };

  const showStatus = (message: string, tone: 'info' | 'error' = 'info') => {
    if (!(status instanceof HTMLElement)) return;
    status.hidden = message.length === 0;
    status.textContent = message;
    status.dataset.tone = tone;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const servicesField = form.querySelector('[data-kind="services"]');
    const budgetField = form.querySelector('[data-kind="budget"]');
    const services = data.getAll('services').map(String).filter(Boolean);
    const selected = form.querySelector('input[name="budget"]:checked');
    const budget = selected instanceof HTMLInputElement ? selected : null;
    const custom = String(data.get('customBudget') ?? '').trim();
    let valid = form.reportValidity();

    if (servicesField?.getAttribute('data-required') === 'true' && services.length === 0) {
      showError('services', form.dataset.servicesError || 'Elige al menos un servicio.');
      valid = false;
    } else {
      showError('services', '');
    }

    if (budgetField?.getAttribute('data-required') === 'true' && !budget) {
      showError('budget', form.dataset.budgetError || 'Elige un presupuesto.');
      valid = false;
    } else if (budget?.dataset.custom === 'true' && !custom) {
      showError('budget', form.dataset.customError || 'Escribe el monto en MXN.');
      valid = false;
    } else {
      showError('budget', '');
    }

    if (!valid) return;

    const budgetLabel =
      budget?.dataset.custom === 'true' ? `${budget.dataset.label}: $${custom} MXN` : budget?.dataset.label;

    if (submit instanceof HTMLButtonElement) submit.disabled = true;
    showStatus(form.dataset.sending || '');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale: form.dataset.locale,
          firstName: data.get('firstName'),
          lastName: data.get('lastName'),
          email: data.get('email'),
          phone: data.get('phone'),
          website: data.get('website'),
          services,
          budget: budgetLabel,
          project: data.get('project'),
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        // The API answers in Spanish; English visitors get the generic message.
        const message = form.dataset.locale === 'es' && result.error ? result.error : form.dataset.failed;
        showStatus(message || '', 'error');
        return;
      }
      form.reset();
      showStatus(form.dataset.sent || '');
    } catch {
      showStatus(form.dataset.failed || '', 'error');
    } finally {
      if (submit instanceof HTMLButtonElement) submit.disabled = false;
    }
  });
}
