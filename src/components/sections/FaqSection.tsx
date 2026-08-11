import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';

type FaqItem = {
  question: string;
  answer: string;
};

const DEFAULT_FAQS: FaqItem[] = [
  {
    question: '¿Para qué tipo de empresa es Hiweb?',
    answer:
      'Marcas B2B y equipos de crecimiento que ya invierten en marketing pero necesitan un sistema: mensaje claro, web que convierte y paid con señal. Si buscas “agencia full-service genérica”, no somos el fit.',
  },
  {
    question: '¿Cuánto tarda ver resultados?',
    answer:
      'En discovery cerramos un mapa en días. Los primeros experimentos de performance suelen salir en 2–4 semanas según stack y creatividades. Los outcomes de pipeline se leen en ciclos de 60–90 días.',
  },
  {
    question: '¿Solo hacen ads o también marca y web?',
    answer:
      'Integramos mensaje, web y paid. Separar marca de performance es lo que suele romper la conversión — lo evitamos a propósito.',
  },
  {
    question: '¿Hay un mínimo de inversión o proyecto?',
    answer:
      'Sí. Trabajamos con un mínimo de engagement para proteger calidad y foco. Lo compartimos en la llamada — califica conversaciones sin pricing teatro en la home.',
  },
  {
    question: '¿Cómo se ve el día a día del engagement?',
    answer:
      'Ciclos cortos, board compartido y métricas acordadas. Sin reportes teatro: decisiones con evidencia.',
  },
];

type FaqSectionProps = {
  items?: FaqItem[];
};

/**
 * 06 · FAQ — objeciones reales del ICP.
 */
export function FaqSection({ items = DEFAULT_FAQS }: FaqSectionProps) {
  return (
    <SectionBand id="faq" tone="surface">
      <SectionHeader
        eyebrow="FAQ"
        title="Objeciones antes de agendar"
        description="Si falta la tuya, la resolvemos en la llamada."
      />

      <div className="mx-auto mt-12 max-w-3xl divide-y divide-border border-y border-border">
        {items.map((item) => (
          <details key={item.question} className="group py-5">
            <summary className="cursor-pointer list-none font-display text-base font-semibold tracking-tight text-ink marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                {item.question}
                <span className="text-muted transition-transform duration-150 group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 max-w-2xl !text-sm !leading-relaxed">{item.answer}</p>
          </details>
        ))}
      </div>
    </SectionBand>
  );
}
