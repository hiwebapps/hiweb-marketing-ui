import { useState } from 'react';
import { jsonLdString } from '../../lib/json-ld';
import { faqAnswerText, renderFaqAnswer } from '../../lib/content/faq-answer';
import type { FaqItem } from '../../lib/content/types';
import './BlogFaq.css';

export type BlogFaqProps = {
  items?: readonly FaqItem[];
  title?: string | null;
  id?: string;
  description?: string;
  className?: string;
  allowMultiple?: boolean;
  initialOpenIndex?: number;
  withSchema?: boolean;
};

function IconChevron({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6 3.5 11 8l-5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * FAQ para artículos de blog — sigue los tokens del design kit de Hiweb.
 * Soporta respuestas con texto plano, Markdown y bloques de Sanity con enlaces.
 */
export function BlogFaq({
  items,
  title = 'Preguntas frecuentes',
  id = 'preguntas-frecuentes',
  description,
  className = '',
  allowMultiple = false,
  initialOpenIndex = 0,
  withSchema = false,
}: BlogFaqProps) {
  if (!items || items.length === 0) return null;

  const [openIndices, setOpenIndices] = useState<number[]>(
    initialOpenIndex >= 0 && initialOpenIndex < items.length ? [initialOpenIndex] : [],
  );

  const toggle = (index: number) => {
    setOpenIndices((prev) => {
      const isOpen = prev.includes(index);
      if (allowMultiple) {
        return isOpen ? prev.filter((i) => i !== index) : [...prev, index];
      }
      return isOpen ? [] : [index];
    });
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faqAnswerText(item.answer),
      },
    })),
  };

  return (
    <section className={['blog-faq', className].filter(Boolean).join(' ')} aria-labelledby={title ? id : undefined}>
      {withSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(schema) }} />
      ) : null}

      {(title || description) ? (
        <header className="blog-faq__header">
          {title ? (
            <h2 id={id} className="blog-faq__title">
              {title}
            </h2>
          ) : null}
          {description ? <p className="blog-faq__description">{description}</p> : null}
        </header>
      ) : null}

      <div className="blog-faq__list" role="presentation">
        {items.map((item, index) => {
          const isOpen = openIndices.includes(index);
          const questionId = `${id}-q-${index}`;
          const panelId = `${id}-a-${index}`;

          return (
            <div key={`${item.question}-${index}`} className={isOpen ? 'blog-faq__item is-open' : 'blog-faq__item'}>
              <button
                type="button"
                id={questionId}
                className="blog-faq__question"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
              >
                <span>{item.question}</span>
                <IconChevron className="blog-faq__chevron" />
              </button>

              <div
                id={panelId}
                className={isOpen ? 'blog-faq__panel is-open' : 'blog-faq__panel'}
                role="region"
                aria-labelledby={questionId}
                aria-hidden={!isOpen}
              >
                <div className="blog-faq__panel-inner">
                  <div className="blog-faq__answer">{renderFaqAnswer(item.answer)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
