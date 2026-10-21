import { Badge, Button, type BadgeVariant } from '../ui';
import { ProcessPhases, type ProcessPhase, type ProcessAccent } from '../sections/ProcessPhases';
import { ServiceWhy } from '../sections/ServiceWhy';
import { FaqSection } from '../sections/FaqSection';
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
  if (cut < 0) {
    const slash = title.indexOf(' / ');
    if (slash >= 0) {
      return { lead: title.slice(0, slash).trim(), rest: title.slice(slash + 3).trim() };
    }
    return { lead: title.replace(/\.$/, '').trim(), rest: '' };
  }
  return {
    lead: title.slice(0, cut).replace(/\.$/, '').trim(),
    rest: title.slice(cut + 2).replace(/\.$/, '').trim(),
  };
}

function heroLabel(note: string | undefined, locale: 'es' | 'en') {
  const fallback = locale === 'en' ? 'Hiweb Client Portal' : 'Portal de Clientes Hiweb';
  const cleaned = (note || fallback).replace(/\s*2\.0\b/gi, '').replace(/\s+/g, ' ').trim();
  return cleaned || fallback;
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
          const headline = splitHeadline(
            section.title ||
              (locale === 'en'
                ? 'Approve in one click. Your projects never stop.'
                : 'Apruebas en un clic. Tus proyectos nunca se detienen.')
          );

          return (
            <section key={`hero-${index}`} className="portal-hero-band" id="portal-visor">
              <div className="portal-hero__inner">
                <Badge variant="lime">{heroLabel(section.badgeNote, locale)}</Badge>

                <h1 className="portal-hero__title">
                  {headline.lead}
                  {headline.rest ? (
                    <span className="block text-white/65 mt-1 sm:mt-2">{headline.rest}</span>
                  ) : null}
                </h1>

                {section.description ? (
                  <p className="portal-hero__sub">{section.description}</p>
                ) : null}

                <div className="portal-hero__actions">
                  <Button type="button" onClick={openTour} glow>
                    {section.tourLabel || (locale === 'en' ? 'Start Guided Tour' : 'Iniciar Tour Guiado')} →
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={openViewer}
                    className="!bg-white !text-ink !border-white hover:!bg-surface"
                  >
                    {section.viewerLabel || (locale === 'en' ? 'Full Viewer' : 'Modo Visor Completo')}
                  </Button>
                </div>

                <div className="portal-hero__demo-wrap">
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
              </div>
            </section>
          );
        }

        // Eliminado el separador inferior por solicitud del usuario
        if (section._type === 'portalStrip') {
          return null;
        }

        if (section._type === 'portalJourney') {
          const phases: ProcessPhase[] = (section.steps ?? []).map((step, i) => ({
            index: step.index || String(i + 1).padStart(2, '0'),
            title: step.title || '',
            description: step.panelText || step.description || '',
            accent: (['lime', 'purple', 'orange', 'cyan'][i % 4]) as ProcessAccent,
          }));

          const cleanJourneyTitle = (section.title || '')
            .replace(/\.\s*En 3 pasos simples\.?/gi, ' en 3 pasos simples')
            .replace(/\.\s*In 3 simple steps\.?/gi, ' in 3 simple steps')
            .replace(/\.$/, '')
            .trim() ||
            (locale === 'en'
              ? 'From delivery to sign-off in 3 simple steps'
              : 'De la entrega al visto bueno en 3 pasos simples');

          return (
            <ProcessPhases
              key={`journey-${index}`}
              eyebrow={
                section.eyebrow ||
                (locale === 'en' ? 'Transparent Collaboration' : 'Colaboración Transparente')
              }
              title={cleanJourneyTitle}
              description={section.description}
              headingWidth={section.headingWidth}
              tone="canvas"
              phases={phases}
            />
          );
        }

        // Sección "Por qué nuestros clientes nunca se van" -> ServiceWhy
        if (section._type === 'portalBento') {
          const whyCards = [
            {
              icon: 'chat',
              accent: '#01e7ff',
              title:
                locale === 'en'
                  ? 'Zero lost WhatsApps or email threads'
                  : 'Cero WhatsApps perdidos ni cadenas de correo',
              description:
                locale === 'en'
                  ? 'No more expired WeTransfer links or audio notes. All communication and versions live right next to the creative piece.'
                  : 'Olvídate de buscar enlaces caducados o audios donde pediste un cambio. Toda la conversación y versiones viven junto a la pieza gráfica correspondiente.',
            },
            {
              icon: 'target',
              accent: '#fe621c',
              title:
                locale === 'en'
                  ? 'Pin-point visual feedback'
                  : 'Feedback visual con precisión de pin',
              description:
                locale === 'en'
                  ? 'Click the exact pixel or word to request a change. Your creative team solves it on the first try without misunderstandings.'
                  : 'Haz clic en el punto exacto de la imagen, video o texto para pedir un ajuste. Tu equipo creativo lo resuelve a la primera, sin malentendidos.',
            },
            {
              icon: 'timer',
              accent: '#927afe',
              title:
                locale === 'en'
                  ? 'Your campaigns launch always on time'
                  : 'Tus campañas salen siempre a tiempo',
              description:
                locale === 'en'
                  ? 'Eliminating endless review loops means your product launches, ads, and promotions go live exactly when scheduled.'
                  : 'Al eliminar las cadenas de revisión interminables, tus lanzamientos, pautas y promociones se publican puntuales sin retrasos operativos.',
            },
            {
              icon: 'chart',
              accent: '#74c465',
              title:
                locale === 'en'
                  ? 'Real business metrics, zero vanity'
                  : 'Métricas de negocio, cero vanidad',
              description:
                locale === 'en'
                  ? 'Monitor conversions, actual sales, and ad spend in clean executive dashboards without inflated vanity metrics.'
                  : 'Supervisa conversiones, ventas e inversión publicitaria en resúmenes ejecutivos limpios, sin métricas infladas que solo sirven para adornar reportes.',
            },
            {
              icon: 'network',
              accent: '#01e7ff',
              title:
                locale === 'en'
                  ? 'One hub for your entire ecosystem'
                  : 'Un solo lugar para todo tu ecosistema',
              description:
                locale === 'en'
                  ? 'Social media, paid ads, web development, SEO articles, and reports on a single screen with zero friction.'
                  : 'Redes sociales, campañas de anuncios, desarrollo web, artículos SEO y reportes en una misma pantalla, accesible en 1 clic y sin contraseñas difíciles.',
            },
            {
              icon: 'report',
              accent: '#dbe64c',
              title:
                locale === 'en'
                  ? 'Formal approval with date and audit trail'
                  : 'Aprobación formal con fecha y respaldo',
              description:
                locale === 'en'
                  ? 'Every sign-off is logged with timestamp and user. Nothing goes live without your explicit, formal confirmation.'
                  : 'Cada visto bueno queda documentado con fecha, hora y usuario. Nadie publica nada sin tu consentimiento expreso y formal.',
            },
          ];

          const whyStats = [
            {
              valor: 20,
              prefix: '+',
              label:
                locale === 'en'
                  ? 'brands managed in Mexico and abroad'
                  : 'marcas en México y el extranjero',
            },
            {
              valor: 6,
              prefix: '+',
              suffix: locale === 'en' ? ' yrs' : ' años',
              label: locale === 'en' ? 'of experience' : 'de experiencia',
            },
          ];

          const rawBentoTitle = (section.title || '')
            .replace(/\.\s*En un solo lugar\.?/gi, '')
            .replace(/\.\s*In one place\.?/gi, '')
            .replace(/\.$/, '')
            .trim();

          const cleanBentoTitle =
            rawBentoTitle.toLowerCase().includes('supervisar') ||
            rawBentoTitle.toLowerCase().includes('oversee') ||
            !rawBentoTitle
              ? (locale === 'en' ? 'Why our clients never leave' : 'Por qué nuestros clientes nunca se van')
              : rawBentoTitle;

          const cleanBentoDescription =
            locale === 'en'
              ? 'The portal is not a software novelty: it is our operational standard ensuring speed, zero friction, and absolute control without chasing anyone.'
              : 'El portal no es un extra técnico: es el estándar con el que garantizamos agilidad, cero fricción y control absoluto de tu inversión sin perseguir a nadie.';

          return (
            <ServiceWhy
              key={`bento-${index}`}
              tone="canvas"
              title={cleanBentoTitle}
              description={cleanBentoDescription}
              ctaLabel={locale === 'en' ? 'Schedule a diagnostic' : 'Agenda un diagnóstico'}
              ctaHref={locale === 'en' ? '/en/calendar' : '/contacto'}
              cards={whyCards}
              stats={whyStats}
              headingWidth={section.headingWidth}
            />
          );
        }

        if (section._type === 'portalFaq') {
          const items = (section.items ?? []).map((item) => ({
            question: item.question,
            answer: item.answer,
          }));

          return (
            <FaqSection
              key={`faq-${index}`}
              eyebrow={section.eyebrow || (locale === 'en' ? 'FAQ' : 'Dudas Frecuentes')}
              title={
                section.title ||
                (locale === 'en' ? 'Questions & Answers' : 'Preguntas y Respuestas')
              }
              description={section.description}
              headingWidth={section.headingWidth}
              columns={2}
              tone="canvas"
              items={items}
            />
          );
        }

        if (section._type === 'portalCloser') {
          const cleanCloserTitle = (section.title || '')
            .replace(/\.$/, '')
            .trim() ||
            (locale === 'en'
              ? 'Approvals on the first try'
              : 'Agilidad, orden y transparencia total');

          return (
            <SectionBand key={`closer-${index}`} id="closer" tone="ink">
              <div className="py-16 md:py-24 text-center mx-auto max-w-3xl flex flex-col items-center">
                {section.lead ? <Badge variant="lime">{section.lead}</Badge> : null}
                <SectionHeader
                  title={cleanCloserTitle}
                  description={section.description}
                  tone="on-ink"
                  align="center"
                  className="mt-6"
                  headingWidth={section.headingWidth}
                />
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  {section.primaryLabel ? (
                    <Button type="button" onClick={openTour} glow>
                      {section.primaryLabel} →
                    </Button>
                  ) : null}
                  <Button
                    href={locale === 'en' ? '/en/calendar' : '/contacto'}
                    variant="secondary"
                  >
                    {locale === 'en' ? 'Book your audit' : 'Agenda tu auditoría'}
                  </Button>
                </div>
                {section.trust?.length ? (
                  <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs uppercase tracking-wider text-canvas/50 font-medium">
                    {section.trust.map((item, idx) => (
                      <span key={idx} className="flex items-center gap-2">
                        <span className="text-accent-lime">✓</span> {item}
                      </span>
                    ))}
                  </div>
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
