import type { ReactNode } from 'react';
import type { LegalBlock, LegalSection } from '../../lib/content/from-sanity';
import './LegalDocument.css';

type LegalDocumentProps = {
  updatedLabel?: string;
  updatedOn?: string;
  sections: LegalSection[];
};

function linkedText(value: string): ReactNode[] {
  const parts = value.split(/([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\+?\d[\d\s-]{6,}\d)/gi);
  return parts.map((part, index) => {
    if (!part) return null;
    if (part.includes('@')) {
      return (
        <a key={index} href={`mailto:${part}`}>
          {part}
        </a>
      );
    }
    if (/^\+?\d[\d\s-]{6,}\d$/.test(part)) {
      return (
        <a key={index} href={`tel:${part.replace(/[^\d+]/g, '')}`}>
          {part}
        </a>
      );
    }
    return part;
  });
}

function Blocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block._type === 'legalParagraph') {
          return <p key={index}>{linkedText(block.text)}</p>;
        }
        if (block._type === 'legalBullets') {
          return (
            <ul key={index} className="legal-doc__list">
              {block.items.map((item) => (
                <li key={item}>{linkedText(item)}</li>
              ))}
            </ul>
          );
        }
        if (block._type === 'legalTerms') {
          return (
            <dl key={index} className="legal-doc__terms">
              {block.items.map((item) => (
                <div key={item.term}>
                  <dt>{item.term}</dt>
                  <dd>{linkedText(item.text)}</dd>
                </div>
              ))}
            </dl>
          );
        }
        if (block._type === 'legalLines') {
          return (
            <dl key={index} className="legal-doc__lines">
              {block.items.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{linkedText(item.value)}</dd>
                </div>
              ))}
            </dl>
          );
        }
        return (
          <div key={block.title} className="legal-doc__subsection">
            <h3>{block.title}</h3>
            <Blocks blocks={block.blocks} />
          </div>
        );
      })}
    </>
  );
}

export function LegalDocument({ updatedLabel, updatedOn, sections }: LegalDocumentProps) {
  const updated = [updatedLabel?.replace(/:\s*$/, ''), updatedOn].filter(Boolean).join(': ');

  return (
    <article className="legal-doc">
      {updated ? <p className="legal-doc__updated">{updated}</p> : null}
      {sections.map((section) => (
        <section key={section.title} className="legal-doc__section">
          <h2>{section.title}</h2>
          <Blocks blocks={section.blocks} />
        </section>
      ))}
    </article>
  );
}
