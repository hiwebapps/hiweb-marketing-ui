import { useEffect, useState, type MouseEvent } from 'react';

export type WebPin = {
  id: string;
  vp: 'desktop' | 'mobile';
  x: number;
  y: number;
  text: string;
};

export type WebPage = {
  id: string;
  title: string;
  status: 'revision' | 'aprobado';
  round: number;
  updated: string;
  checks: { desktop: boolean; mobile: boolean };
  pins: WebPin[];
};

const COPY = {
  es: {
    kicker: 'Sitio web',
    channel: 'Rediseño web',
    title: 'Revisión de Páginas Web',
    hint: 'Cada página se revisa en vista desktop y móvil. Puedes dejar pines de feedback directamente sobre el diseño.',
    band: 'Sitio web',
    official: 'Web oficial',
    progress: (done: number, total: number) => `${done} de ${total} páginas aprobadas`,
    roundBand: 'Ronda 2',
    approved: 'Aprobado',
    review: (round: number) => `En revisión · R${round}`,
    pins: (n: number) => (n === 1 ? '1 pin' : `${n} pines`),
    updated: 'Actualizado el',
    desktopOk: 'Desktop validado',
    desktopNo: 'Desktop pendiente',
    mobileOk: 'Móvil validado',
    mobileNo: 'Móvil pendiente',
    reviewBtn: 'Revisar',
    viewBtn: 'Ver',
    back: 'Volver',
    desktop: 'Desktop · 1440',
    mobile: 'Móvil · 390',
    round: (n: number) => `Ronda ${n}`,
    click: 'Haz clic en cualquier parte de la página para colocar un pin',
    pinPrompt: 'Escribe la nota del pin',
    pinsHere: (vp: string, n: number) => `Pines en vista ${vp} (${n})`,
    emptyPins: 'Haz clic en la página para dejar una nota.',
    must: 'Validación obligatoria',
    checkDesktop: 'Revisé la versión desktop (1440px)',
    checkMobile: 'Revisé la versión móvil (390px)',
    changes: 'Pedir cambios',
    changesPrompt: 'Describe los cambios',
    approve: 'Aprobar página',
    done: 'Aprobado',
    badge: 'Café de especialidad · Origen Chiapas',
    headline: 'Tueste artesanal en pequeños lotes semanales',
    body: 'Trazabilidad directa desde fincas seleccionadas hasta tu taza. Suscripciones mensuales con molienda calibrada para tu método.',
    buy: 'Comprar en grano',
    menu: 'Ver menú de barra',
    mobileBadge: 'Especialidad',
    mobileHeadline: 'Tueste artesanal en pequeños lotes',
    mobileBody: 'Café de origen con trazabilidad directa. Envíos a todo México.',
    preview: 'preview · staging.auracafe.mx',
  },
  en: {
    kicker: 'Website',
    channel: 'Web redesign',
    title: 'Website page review',
    hint: 'Each page is reviewed on desktop and mobile. Click the design to leave a pin.',
    band: 'Website',
    official: 'Official site',
    progress: (done: number, total: number) => `${done} of ${total} pages approved`,
    roundBand: 'Round 2',
    approved: 'Approved',
    review: (round: number) => `In review · R${round}`,
    pins: (n: number) => (n === 1 ? '1 pin' : `${n} pins`),
    updated: 'Updated',
    desktopOk: 'Desktop checked',
    desktopNo: 'Desktop pending',
    mobileOk: 'Mobile checked',
    mobileNo: 'Mobile pending',
    reviewBtn: 'Review',
    viewBtn: 'View',
    back: 'Back',
    desktop: 'Desktop · 1440',
    mobile: 'Mobile · 390',
    round: (n: number) => `Round ${n}`,
    click: 'Click anywhere on the page to drop a pin',
    pinPrompt: 'Write the pin note',
    pinsHere: (vp: string, n: number) => `Pins on ${vp} (${n})`,
    emptyPins: 'Click the page to leave a note.',
    must: 'Required check',
    checkDesktop: 'I reviewed the desktop version (1440px)',
    checkMobile: 'I reviewed the mobile version (390px)',
    changes: 'Request changes',
    changesPrompt: 'Describe the changes',
    approve: 'Approve page',
    done: 'Approved',
    badge: 'Specialty coffee · Chiapas origin',
    headline: 'Small-batch roasting, every week',
    body: 'Direct traceability from selected farms to your cup. Monthly subscriptions ground for your brew method.',
    buy: 'Buy whole bean',
    menu: 'See the bar menu',
    mobileBadge: 'Specialty',
    mobileHeadline: 'Small-batch roasting',
    mobileBody: 'Origin coffee with direct traceability. Shipping across Mexico.',
    preview: 'preview · staging.auracafe.mx',
  },
} as const;

function Check({ on }: { on: boolean }) {
  return on ? <i className="site-check is-on" aria-hidden="true" /> : <i className="site-check" aria-hidden="true" />;
}

export function WebBoard({
  locale,
  brand,
  pages,
  onOpen,
}: {
  locale: 'es' | 'en';
  brand: string;
  pages: WebPage[];
  onOpen: (id: string) => void;
}) {
  const copy = COPY[locale];
  const approved = pages.filter((page) => page.status === 'aprobado').length;
  const ratio = pages.length ? (approved / pages.length) * 100 : 0;
  return (
    <div className="site-board">
      <header>
        <div className="kicker">
          <span className="badge site-kicker">{copy.kicker}</span>
          <span className="small muted">{brand} · {copy.channel}</span>
        </div>
        <h1 className="h1">{copy.title}</h1>
        <p className="muted">{copy.hint}</p>
      </header>
      <section className="site-table">
        <div className="site-band">
          <div>
            <span>{copy.band}</span>
            <strong>{brand} — {copy.official}</strong>
          </div>
          <div className="site-progress">
            <p><span>{copy.progress(approved, pages.length)}</span><span>{copy.roundBand}</span></p>
            <i><b style={{ width: `${ratio}%` }} /></i>
          </div>
        </div>
        {pages.map((page, index) => (
          <div key={page.id} className="site-row">
            <b>{String(index + 1).padStart(2, '0')}</b>
            <div>
              <div className="site-row__badges">
                <span className={page.status === 'aprobado' ? 'badge sm site-ok' : 'badge sm site-rev'}>
                  {page.status === 'aprobado' ? copy.approved : copy.review(page.round)}
                </span>
                {page.pins.length ? <span className="badge sm">{copy.pins(page.pins.length)}</span> : null}
              </div>
              <strong>{page.title}</strong>
              <span className="small muted">{copy.updated} {page.updated}</span>
            </div>
            <div className="site-row__devices">
              <span><Check on={page.checks.desktop} />{page.checks.desktop ? copy.desktopOk : copy.desktopNo}</span>
              <span><Check on={page.checks.mobile} />{page.checks.mobile ? copy.mobileOk : copy.mobileNo}</span>
            </div>
            <button type="button" className="rrss-solid" onClick={() => onOpen(page.id)}>
              {page.status === 'revision' ? copy.reviewBtn : copy.viewBtn}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

export function WebPageViewer({
  page,
  locale,
  onBack,
  onPin,
  onCheck,
  onChanges,
  onApprove,
}: {
  page: WebPage;
  locale: 'es' | 'en';
  onBack: () => void;
  onPin: (pin: Omit<WebPin, 'id'>) => void;
  onCheck: (key: 'desktop' | 'mobile') => void;
  onChanges: (text: string) => void;
  onApprove: () => void;
}) {
  const copy = COPY[locale];
  const [vp, setVp] = useState<'desktop' | 'mobile'>('desktop');
  useEffect(() => { setVp('desktop'); }, [page.id]);
  const pins = page.pins.filter((pin) => pin.vp === vp);
  const ready = page.checks.desktop && page.checks.mobile;
  const approved = page.status === 'aprobado';
  const drop = (event: MouseEvent<HTMLElement>) => {
    if (approved) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const text = window.prompt(copy.pinPrompt);
    if (!text?.trim()) return;
    onPin({
      vp,
      x: Math.min(96, Math.max(4, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.min(96, Math.max(4, ((event.clientY - rect.top) / rect.height) * 100)),
      text: text.trim(),
    });
  };
  const askChanges = () => {
    const text = window.prompt(copy.changesPrompt);
    if (text?.trim()) onChanges(text.trim());
  };
  return (
    <div className="site-view">
      <header className="site-view__bar">
        <button type="button" className="rrss-ghost" onClick={onBack}>{copy.back}</button>
        <div>
          <span className="small muted">{copy.kicker}</span>
          <strong>{page.title}</strong>
        </div>
        <div className="rrss-seg is-dark">
          <button type="button" className={vp === 'desktop' ? 'is-on' : ''} onClick={() => setVp('desktop')}>{copy.desktop}</button>
          <button type="button" className={vp === 'mobile' ? 'is-on' : ''} onClick={() => setVp('mobile')}>{copy.mobile}</button>
        </div>
        <span className="badge sm site-rev">{copy.round(page.round)}</span>
      </header>
      <div className="site-view__body">
        <section>
          <p className="small muted">{copy.click}</p>
          {vp === 'desktop' ? (
            <div className="site-browser">
              <div className="site-browser__bar"><i /><i /><i /><span>{copy.preview}</span></div>
              <div className="site-mock" onClick={drop}>
                <span className="badge sm site-rev">{copy.badge}</span>
                <h2>{copy.headline}</h2>
                <p>{copy.body}</p>
                <div>
                  <span className="rrss-solid">{copy.buy}</span>
                  <span className="site-ghost">{copy.menu}</span>
                </div>
                {pins.map((pin, index) => <span key={pin.id} className="site-pin" style={{ left: `${pin.x}%`, top: `${pin.y}%` }}>{index + 1}</span>)}
              </div>
            </div>
          ) : (
            <div className="site-phone" onClick={drop}>
              <span className="badge sm site-rev">{copy.mobileBadge}</span>
              <h2>{copy.mobileHeadline}</h2>
              <p>{copy.mobileBody}</p>
              <span className="rrss-solid">{copy.buy}</span>
              {pins.map((pin, index) => <span key={pin.id} className="site-pin" style={{ left: `${pin.x}%`, top: `${pin.y}%` }}>{index + 1}</span>)}
            </div>
          )}
        </section>
        <aside>
          <p className="eyebrow">{copy.pinsHere(vp === 'desktop' ? 'Desktop' : locale === 'en' ? 'Mobile' : 'Móvil', pins.length)}</p>
          {pins.length ? pins.map((pin, index) => (
            <p key={pin.id} className="site-note"><b>{index + 1}</b><span>{pin.text}</span></p>
          )) : <p className="site-note is-empty">{copy.emptyPins}</p>}
          <p className="eyebrow">{copy.must}</p>
          <label><input type="checkbox" checked={page.checks.desktop} disabled={approved} onChange={() => onCheck('desktop')} />{copy.checkDesktop}</label>
          <label><input type="checkbox" checked={page.checks.mobile} disabled={approved} onChange={() => onCheck('mobile')} />{copy.checkMobile}</label>
          <div className="site-view__actions">
            <button type="button" className="rrss-ghost" onClick={askChanges} disabled={approved}>{copy.changes}</button>
            <button type="button" className="rrss-solid" data-tour="approve" disabled={!ready || approved} onClick={onApprove}>
              {approved ? copy.done : copy.approve}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
