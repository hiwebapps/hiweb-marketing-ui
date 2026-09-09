import { BackgroundMesh } from './BackgroundMesh';
import { CardGlass } from './CardGlass';
import {
  Badge,
  Button,
  Checkbox,
  SelectField,
  TextArea,
  TextField,
  Toggle,
} from './ui';

const COLORS = [
  { name: 'canvas', hex: '#ffffff', className: 'bg-canvas border-b border-border' },
  { name: 'surface', hex: '#f5f5f5', className: 'bg-surface' },
  { name: 'surface-elevated', hex: '#eeeeee', className: 'bg-surface-elevated' },
  { name: 'ink', hex: '#111111', className: 'bg-ink' },
  { name: 'ink-soft', hex: '#3a3a3a', className: 'bg-ink-soft' },
  { name: 'muted', hex: '#6b7280', className: 'bg-muted' },
  { name: 'hiweb-dark', hex: '#070902', className: 'bg-hiweb-dark' },
  { name: 'accent-orange', hex: '#fe621c', className: 'bg-accent-orange' },
  { name: 'accent-cyan', hex: '#01e7ff', className: 'bg-accent-cyan' },
  { name: 'accent-purple', hex: '#927afe', className: 'bg-accent-purple' },
  { name: 'accent-lime', hex: '#dbe64c', className: 'bg-accent-lime' },
  { name: 'accent-red', hex: '#a91e23', className: 'bg-accent-red' },
  { name: 'accent-green', hex: '#74c465', className: 'bg-accent-green' },
] as const;

const SECTIONS = [
  { id: 'colores', label: 'Colores' },
  { id: 'tipografia', label: 'Tipografía' },
  { id: 'botones', label: 'Botones' },
  { id: 'formularios', label: 'Formularios' },
  { id: 'badges', label: 'Badges' },
  { id: 'surfaces', label: 'Surfaces' },
  { id: 'enlaces', label: 'Enlaces' },
] as const;

function SectionTitle({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div id={id} className="scroll-mt-28 mb-8">
      <p className="mb-2 font-display text-xs font-medium tracking-[0.2em] text-muted uppercase">
        {eyebrow}
      </p>
      <h2 className="!text-3xl md:!text-4xl">{title}</h2>
      <p className="mt-3 max-w-2xl !text-base">{description}</p>
    </div>
  );
}

export function DesignSystem() {
  return (
    <div className="relative min-h-dvh">
      <BackgroundMesh />

      <div className="relative z-10">
        {/* Section jump links — SiteNav global está en Layout */}
        <div className="border-b border-border bg-canvas/60 backdrop-blur-md">
          <nav className="mx-auto flex max-w-6xl flex-wrap gap-1 px-6 py-2.5">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-md px-2.5 py-1.5 font-display text-[11px] font-medium tracking-wide text-muted no-underline uppercase transition-colors hover:bg-surface hover:text-ink"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>

        <main className="mx-auto max-w-6xl space-y-16 px-6 py-14 md:space-y-20 md:py-20">
          <section className="animate-hero-rise max-w-3xl">
            <Badge>Design System</Badge>
            <h1 className="mt-5 !text-4xl !leading-[1.2] md:!text-6xl md:!leading-[1.2]">
              Light Product-<span className="text-ink">Tool</span>
            </h1>
            <p className="mt-5 !text-lg">
              Cal (luz) + Linear (disciplina) + Raycast (ritmo). Tipografía:
              Clash Display (headings), Inter (body).
            </p>
          </section>

          <section>
            <SectionTitle
              id="colores"
              eyebrow="01 · Tokens"
              title="Paleta de color"
              description="Escalera light para estructura. Accents solo para énfasis puntual — el CTA primario es ink negro."
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {COLORS.map((c) => (
                <div
                  key={c.name}
                  className="overflow-hidden rounded-xl border border-border bg-canvas"
                >
                  <div className={`h-20 ${c.className}`} />
                  <div className="space-y-0.5 p-3">
                    <p className="!text-xs !leading-snug font-medium text-ink">{c.name}</p>
                    <p className="font-mono !text-[11px] !leading-snug text-muted">{c.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle
              id="tipografia"
              eyebrow="02 · Type"
              title="Tipografía"
              description="Familias locales en /fonts — Clash Display (headings) e Inter (body)."
            />
            <CardGlass className="space-y-10 bg-surface p-6 sm:p-10">
              <div className="space-y-4 border-b border-border pb-8">
                <p className="font-display text-xs tracking-[0.16em] text-muted uppercase">
                  Display · Clash Display · /fonts/clash-display
                </p>
                <h1 className="!text-5xl !leading-[1.2] md:!text-7xl md:!leading-[1.2]">Heading 1</h1>
                <h2 className="!text-4xl !leading-[1.25] md:!text-5xl md:!leading-[1.25]">Heading 2</h2>
                <h3 className="font-display text-2xl font-semibold text-ink md:text-3xl">
                  Heading 3
                </h3>
                <p className="font-display text-xl font-medium text-ink">
                  Heading 4 / Lead display
                </p>
              </div>

              <div className="space-y-4 border-b border-border pb-8">
                <p className="font-display text-xs tracking-[0.16em] text-muted uppercase">
                  Body · Inter · /fonts/inter
                </p>
                <p className="!text-lg text-ink-soft">
                  Párrafo large — Claridad, respiración y precisión. El producto habla;
                  el color no grita.
                </p>
                <p className="!text-base">
                  Párrafo base — Acentos como{' '}
                  <span className="font-medium text-ink">keywords</span> o estados. El
                  cuerpo vive en muted / ink-soft.
                </p>
                <p className="!text-sm text-muted">
                  Párrafo small — Meta, captions y ayuda contextual.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="mb-2 font-display text-xs tracking-[0.16em] text-muted uppercase">
                    Eyebrow
                  </p>
                  <p className="font-display text-sm font-medium tracking-[0.2em] text-muted uppercase">
                    Universo Hiweb
                  </p>
                </div>
                <div>
                  <p className="mb-2 font-display text-xs tracking-[0.16em] text-muted uppercase">
                    Mono / Token
                  </p>
                  <p className="font-mono text-sm text-ink">#111111 · ink</p>
                </div>
              </div>
            </CardGlass>
          </section>

          <section>
            <SectionTitle
              id="botones"
              eyebrow="03 · Actions"
              title="Botones"
              description="Primary ink negro con BorderGlow sutil al hover (React Bits). Secondary/outline con hairline. Motion rápida tipo Raycast (scale 0.98)."
            />
            <CardGlass className="space-y-10 bg-surface p-6 sm:p-10">
              <div>
                <p className="mb-4 font-display text-xs tracking-[0.16em] text-muted uppercase">
                  Variantes
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="orange">Accent Orange</Button>
                  <Button variant="primary" disabled>
                    Disabled
                  </Button>
                </div>
                <p className="mt-4 !text-sm text-muted">
                  Acerca el cursor al borde del Primary/Secondary para ver el glow mesh
                  (cyan · purple · soft white). Intensidad baja a propósito.
                </p>
              </div>

              <div>
                <p className="mb-4 font-display text-xs tracking-[0.16em] text-muted uppercase">
                  Tamaños
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-[#070912] p-6">
                <p className="mb-4 font-display text-xs tracking-[0.16em] text-white/45 uppercase">
                  Sobre hero oscuro
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Agendar llamada</Button>
                  <Button variant="secondary" glow={false}>
                    Ver casos
                  </Button>
                </div>
              </div>
            </CardGlass>
          </section>

          <section>
            <SectionTitle
              id="formularios"
              eyebrow="04 · Forms"
              title="Inputs y controles"
              description="Campos blancos, borde hairline, focus ring ink. Labels Clash Display uppercase."
            />
            <CardGlass className="bg-surface p-6 sm:p-10">
              <div className="grid gap-6 md:grid-cols-2">
                <TextField
                  label="Nombre"
                  name="name"
                  placeholder="Tu marca o proyecto"
                  hint="Texto de ayuda opcional"
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="hola@hiweb.mx"
                />
                <TextField
                  label="Con error"
                  name="error-demo"
                  placeholder="Campo inválido"
                  defaultValue="dato@"
                  error="Introduce un email válido."
                />
                <SelectField
                  label="Servicio"
                  name="service"
                  options={[
                    { value: 'branding', label: 'Branding digital' },
                    { value: 'performance', label: 'Performance' },
                    { value: 'web', label: 'Producto web' },
                  ]}
                  hint="Selecciona una vertical"
                />
                <div className="md:col-span-2">
                  <TextArea
                    label="Mensaje"
                    name="message"
                    placeholder="Cuéntanos el objetivo..."
                    rows={4}
                  />
                </div>
                <div className="flex flex-col gap-4 md:col-span-2">
                  <Checkbox
                    label="Acepto recibir actualizaciones de Hiweb"
                    name="newsletter"
                    defaultChecked
                  />
                  <Toggle
                    label="Notificaciones activas"
                    name="notifications"
                    defaultChecked
                  />
                </div>
              </div>
            </CardGlass>
          </section>

          <section>
            <SectionTitle
              id="badges"
              eyebrow="05 · Status"
              title="Badges"
              description="Etiquetas compactas. Neutral por defecto; color solo para estado."
            />
            <CardGlass className="bg-surface p-6 sm:p-10">
              <div className="flex flex-wrap gap-2">
                <Badge variant="neutral">Neutral</Badge>
                <Badge variant="cyan">Cyan</Badge>
                <Badge variant="orange">Orange</Badge>
                <Badge variant="purple">Purple</Badge>
                <Badge variant="lime">Lime</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="danger">Danger</Badge>
              </div>
            </CardGlass>
          </section>

          <section>
            <SectionTitle
              id="surfaces"
              eyebrow="06 · Surfaces"
              title="Cards"
              description="Superficie blanca o surface #f5f5f5, borde hairline, sombra mínima — sin glass oscuro."
            />
            <div className="grid gap-4 md:grid-cols-2">
              <CardGlass className="p-8">
                <Badge>Default</Badge>
                <h3 className="mt-4 font-display text-2xl font-semibold text-ink">
                  Card canvas
                </h3>
                <p className="mt-3 !text-sm">
                  Contenedor limpio sobre el grid. Ideal para contenido y formularios.
                </p>
              </CardGlass>
              <CardGlass className="bg-surface p-8">
                <Badge variant="neutral">Surface</Badge>
                <h3 className="mt-4 font-display text-2xl font-semibold text-ink">
                  Why Less Is More
                </h3>
                <p className="mt-3 !text-sm">
                  UI estructurada: tipografía sobria, espaciado generoso, un CTA negro.
                </p>
                <div className="mt-6">
                  <Button size="sm" variant="secondary">
                    Explorar
                  </Button>
                </div>
              </CardGlass>
            </div>
          </section>

          <section>
            <SectionTitle
              id="enlaces"
              eyebrow="07 · Inline"
              title="Enlaces y énfasis"
              description="Links en ink. Keywords con peso, no con glow."
            />
            <CardGlass className="space-y-4 bg-surface p-6 sm:p-10">
              <p className="!text-base text-ink-soft">
                Visita el{' '}
                <a href="/" className="font-medium text-ink underline">
                  inicio del demo
                </a>{' '}
                o revisa la{' '}
                <a href="#colores" className="font-medium text-ink underline">
                  paleta de color
                </a>{' '}
                para construir nuevas vistas.
              </p>
              <p className="!text-base text-ink-soft">
                Hiweb combina{' '}
                <span className="font-medium text-ink">claridad de producto</span> con{' '}
                <span className="font-medium text-ink">ritmo de interfaz</span>.
              </p>
            </CardGlass>
          </section>

          <footer className="border-t border-border pt-8 pb-4 text-center">
            <p className="!text-sm text-muted">
              Hiweb Marketing · Light Product-Tool · Clash Display + Inter
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
