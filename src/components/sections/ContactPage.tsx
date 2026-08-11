import { Button, TextArea, TextField, SelectField } from '../ui';
import { FinalCta } from './FinalCta';
import { SiteNav } from './SiteNav';
import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';

/**
 * /contact — enquiry de baja fricción (Cal-style).
 */
export function ContactPage() {
  return (
    <div className="min-h-dvh bg-canvas">
      <SiteNav />
      <main>
        <SectionBand>
          <div className="grid gap-12 md:grid-cols-2 md:items-start">
            <SectionHeader
              eyebrow="Contacto"
              title="Cuéntanos el objetivo"
              description="Respuesta en 24h. Trae ICP, canal actual y qué outcome buscas en 90 días."
            />
            <form
              className="space-y-4 rounded-2xl border border-border bg-surface p-6 md:p-8"
              action="mailto:hola@hiweb.marketing"
              method="get"
              encType="text/plain"
            >
              <TextField
                label="Nombre"
                name="name"
                placeholder="Tu nombre"
                required
              />
              <TextField
                label="Email de trabajo"
                name="email"
                type="email"
                placeholder="tu@empresa.com"
                required
              />
              <TextField
                label="Empresa"
                name="company"
                placeholder="Nombre de la empresa"
              />
              <SelectField
                label="Qué necesitas"
                name="need"
                options={[
                  { value: 'sprint', label: 'Sprint de sistema' },
                  { value: 'retainer', label: 'Retainer de growth' },
                  { value: 'scope', label: 'Hablar de scope / presupuesto' },
                  { value: 'other', label: 'Otra consulta' },
                ]}
              />
              <TextArea
                label="Contexto"
                name="context"
                placeholder="ICP, canal actual, fricción principal…"
                rows={4}
              />
              <Button type="submit" variant="primary" className="w-full sm:w-auto">
                Agendar llamada
              </Button>
              <p className="!text-xs text-muted">
                Mismo verbo que en la home. Sin compromiso.
              </p>
            </form>
          </div>
        </SectionBand>
        <FinalCta
          title="¿Prefieres ir directo?"
          description="Escríbenos a hola@hiweb.marketing o usa el formulario arriba."
          primaryHref="mailto:hola@hiweb.marketing"
          primaryLabel="Escribir ahora"
          secondaryLabel="Volver al home"
          secondaryHref="/"
        />
      </main>
    </div>
  );
}
