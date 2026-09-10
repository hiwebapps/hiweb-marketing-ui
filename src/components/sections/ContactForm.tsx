import { Button, TextArea, TextField, SelectField } from '../ui';

export function ContactForm() {
  return (
    <form
      className="space-y-4 rounded-2xl border border-border bg-surface p-6 md:p-8"
      action="mailto:hola@hiweb.marketing"
      method="get"
      encType="text/plain"
    >
      <TextField label="Nombre" name="name" placeholder="Tu nombre" required />
      <TextField
        label="Email de trabajo"
        name="email"
        type="email"
        placeholder="tu@empresa.com"
        required
      />
      <TextField label="Empresa" name="company" placeholder="Nombre de la empresa" />
      <SelectField
        label="Industria"
        name="industry"
        options={[
          { value: 'manufactura', label: 'Manufactura' },
          { value: 'salud', label: 'Sector Salud' },
          { value: 'inmobiliarias', label: 'Inmobiliarias' },
          { value: 'turismo', label: 'Turismo / Hotelería' },
          { value: 'restaurantes', label: 'Restaurantes' },
          { value: 'saas', label: 'Software (SaaS)' },
          { value: 'otra', label: 'Otra' },
        ]}
      />
      <TextArea
        label="Contexto"
        name="context"
        placeholder="Objetivo a 90 días, canales actuales, fricción principal…"
        rows={4}
      />
      <Button type="submit" variant="primary" className="w-full sm:w-auto">
        Agenda tu auditoría
      </Button>
      <p className="!text-xs text-muted">Respuesta en 24h. Sin compromiso de retainer.</p>
    </form>
  );
}
