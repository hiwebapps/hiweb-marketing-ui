import { useState } from 'react';

export type PortalDoc = {
  id: string;
  type: string;
  title: string;
  date: string;
  pages: number;
  svc: string;
};

const DOCS: Record<'es' | 'en', PortalDoc[]> = {
  es: [
    { id: 'd1', type: 'Reporte', title: 'Reporte Mensual de Rendimiento Digital — Septiembre 2026', date: '1 octubre 2026', pages: 4, svc: 'Redes sociales y web' },
    { id: 'd2', type: 'Estrategia', title: 'Estrategia de Contenidos Q4: Campaña de Invierno y Suscripciones', date: '25 septiembre 2026', pages: 6, svc: 'Estrategia' },
    { id: 'd3', type: 'Brief', title: 'Brief de Marca y Tono de Comunicación — Aura Café', date: '15 agosto 2026', pages: 8, svc: 'General' },
  ],
  en: [
    { id: 'd1', type: 'Report', title: 'Monthly digital performance report — September 2026', date: '1 October 2026', pages: 4, svc: 'Social and web' },
    { id: 'd2', type: 'Strategy', title: 'Q4 content strategy: winter campaign and subscriptions', date: '25 September 2026', pages: 6, svc: 'Strategy' },
    { id: 'd3', type: 'Brief', title: 'Brand and tone brief — Aura Café', date: '15 August 2026', pages: 8, svc: 'General' },
  ],
};

const COPY = {
  es: {
    kicker: 'Recursos',
    title: 'Documentos y Reportes Mensuales',
    pages: 'páginas',
    uploaded: 'Subido el',
    open: 'Ver documento',
    download: 'Descargar',
    downloading: 'Descargando PDF…',
    back: 'Volver',
    pdf: 'Descargar PDF',
    reach: 'Alcance total',
    reachValue: '+38.4%',
    engagement: 'Interacciones',
    engagementValue: '4.9% CTR',
    summary: 'Resumen del mes en redes, búsqueda orgánica y la tienda.',
    findings: 'Hallazgos',
    points: [
      'Los reels de tueste y extracción concentraron la mayor parte del tráfico nuevo a la tienda.',
      'La guía de calibración de molienda subió en búsquedas de café de especialidad en México.',
      'La suscripción mensual mantuvo a la mayoría de los clientes activos.',
    ],
    doubt: '¿Dudas sobre este reporte?',
    doubtBody: 'Tu account manager en Hiweb puede agendar la llamada de análisis del mes.',
    period: 'Septiembre 2026',
    cut: 'Fecha de corte',
  },
  en: {
    kicker: 'Resources',
    title: 'Documents and monthly reports',
    pages: 'pages',
    uploaded: 'Uploaded',
    open: 'View document',
    download: 'Download',
    downloading: 'Downloading PDF…',
    back: 'Back',
    pdf: 'Download PDF',
    reach: 'Total reach',
    reachValue: '+38.4%',
    engagement: 'Engagement',
    engagementValue: '4.9% CTR',
    summary: 'A monthly snapshot of social, organic search, and the shop.',
    findings: 'Findings',
    points: [
      'Roast and brew reels drove most of the new traffic to the shop.',
      'The grind-calibration guide climbed in specialty-coffee searches in Mexico.',
      'The monthly subscription kept most customers active.',
    ],
    doubt: 'Questions about this report?',
    doubtBody: 'Your Hiweb account manager can book the monthly readout.',
    period: 'September 2026',
    cut: 'Cutoff date',
  },
} as const;

export function docsFor(locale: 'es' | 'en') {
  return DOCS[locale];
}

function Paper() {
  return (
    <span className="doc-paper" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

export function DocsBoard({
  locale,
  brand,
  onOpen,
}: {
  locale: 'es' | 'en';
  brand: string;
  onOpen: (id: string) => void;
}) {
  const copy = COPY[locale];
  const [toast, setToast] = useState('');
  const download = () => {
    setToast(copy.downloading);
    window.setTimeout(() => setToast(''), 1600);
  };
  return (
    <div className="docs-board">
      <header>
        <div className="kicker">
          <span className="badge b-ink">{copy.kicker}</span>
          <span className="small muted">{brand}</span>
        </div>
        <h1 className="h1">{copy.title}</h1>
      </header>
      {toast ? <p className="docs-toast" role="status">{toast}</p> : null}
      <div className="doc-grid">
        {DOCS[locale].map((doc) => (
          <article key={doc.id} className="doc-card">
            <div className="doc-card__cover"><Paper /></div>
            <div className="doc-card__body">
              <div className="doc-card__meta">
                <span className="badge sm">{doc.type}</span>
                <span className="small muted">{doc.pages} {copy.pages}</span>
              </div>
              <h2>{doc.title}</h2>
              <span className="small muted">{copy.uploaded} {doc.date}</span>
              <div className="doc-card__actions">
                <button type="button" className="rrss-solid" onClick={() => onOpen(doc.id)}>{copy.open}</button>
                <button type="button" className="doc-icon" aria-label={copy.download} onClick={download}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 4v11M7 11l5 5 5-5M5 20h14" /></svg>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function DocReader({
  doc,
  locale,
  onBack,
}: {
  doc: PortalDoc;
  locale: 'es' | 'en';
  onBack: () => void;
}) {
  const copy = COPY[locale];
  const [toast, setToast] = useState('');
  const download = () => {
    setToast(copy.downloading);
    window.setTimeout(() => setToast(''), 1600);
  };
  return (
    <div className="doc-read">
      <header>
        <button type="button" className="rrss-ghost" onClick={onBack}>{copy.back}</button>
        <div>
          <span className="small muted">{doc.type} · {doc.svc}</span>
          <strong>{doc.title}</strong>
        </div>
        <button type="button" className="rrss-solid" onClick={download}>{copy.pdf}</button>
      </header>
      {toast ? <p className="docs-toast" role="status">{toast}</p> : null}
      <div className="doc-read__body">
        <article className="doc-sheet">
          <header>
            <div>
              <span>{doc.type}</span>
              <h2>{copy.period}</h2>
            </div>
            <span className="badge b-ink sm">{doc.svc}</span>
          </header>
          <p>{copy.summary}</p>
          <div className="doc-kpis">
            <div><span>{copy.reach}</span><b>{copy.reachValue}</b></div>
            <div><span>{copy.engagement}</span><b>{copy.engagementValue}</b></div>
          </div>
          <div className="doc-findings">
            <b>{copy.findings}</b>
            <ul>
              {copy.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </div>
        </article>
        <aside>
          <span className="badge b-pur sm">{doc.type}</span>
          <h2>{doc.title}</h2>
          <span className="small muted">{copy.cut} · {doc.date}</span>
          <b>{copy.doubt}</b>
          <p>{copy.doubtBody}</p>
        </aside>
      </div>
    </div>
  );
}
