import { CONTACT_NEXT_STEPS, SITE } from '../../data/site';
import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';

export function ContactDetails() {
  return (
    <>
      <SectionBand tone="surface" id="directo">
        <SectionHeader
          eyebrow="Contacto directo"
          title="Teléfono, email y WhatsApp"
          description="Si ya tienes contexto, escríbenos. El formulario nos ayuda a llegar con brief."
          badgeVariant="purple"
        />
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { label: 'Teléfono', value: SITE.phone, href: SITE.phoneHref },
            { label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
            { label: 'WhatsApp', value: 'Mensaje directo', href: SITE.whatsapp },
          ].map((item) => (
            <li key={item.label} data-reveal className="rounded-2xl border border-border bg-canvas p-6">
              <p className="font-display text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
                {item.label}
              </p>
              <a href={item.href} className="mt-3 block font-display text-lg font-semibold text-ink no-underline">
                {item.value}
              </a>
            </li>
          ))}
        </ul>
      </SectionBand>

      <SectionBand id="despues">
        <SectionHeader
          eyebrow="Qué pasa después"
          title="Tres pasos, sin teatro de propuesta de 80 páginas"
          badgeVariant="cyan"
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {CONTACT_NEXT_STEPS.map((step) => (
            <li key={step.title} data-reveal className="rounded-2xl border border-border bg-canvas p-6">
              <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{step.title}</h3>
              <p className="mt-2 !text-sm">{step.description}</p>
            </li>
          ))}
        </ol>
      </SectionBand>

      <SectionBand tone="surface" id="ubicacion">
        <SectionHeader
          eyebrow="Presencia"
          title="Mérida, Cancún y Monterrey"
          description="Operamos cross-border. La auditoría puede ser remota o en sede."
          badgeVariant="orange"
        />
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {SITE.locales.map((city) => (
            <li key={city} data-reveal className="rounded-2xl border border-border bg-canvas p-6">
              <p className="font-display text-xl font-semibold text-ink">{city}</p>
              <p className="mt-1 !text-sm text-muted">México</p>
            </li>
          ))}
        </ul>
      </SectionBand>
    </>
  );
}

export function CalendarPlaceholder() {
  return (
    <div
      data-reveal
      className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong bg-canvas p-8 text-center"
    >
      <p className="font-display text-sm font-semibold text-ink">Agenda tu auditoría</p>
      <p className="mt-2 max-w-sm !text-sm">
        El calendario se conecta aquí. Mientras tanto, usa el formulario o escribe a {SITE.email}.
      </p>
      <a
        href={`mailto:${SITE.email}?subject=Auditoría Hiweb`}
        className="mt-5 font-display text-sm font-semibold text-ink"
      >
        Escribir ahora →
      </a>
    </div>
  );
}
