export type SocialStatus = 'pendiente' | 'programado' | 'publicado' | 'idea';
export type SocialFmt = 'carrusel' | 'reel' | 'post' | 'story';
export type SocialTab = 'rev' | 'prog' | 'pub' | 'plan';
export type SocialView = 'lista' | 'cal' | 'ig';

export type SocialPiece = {
  id: string;
  title: string;
  fmt: SocialFmt;
  month: string;
  date: string;
  day?: number;
  status: SocialStatus;
  round: number;
  notes?: number;
};

const COPY = {
  es: {
    kicker: 'Redes sociales',
    channel: 'Instagram y TikTok',
    title: 'Parrilla de Contenido',
    month: 'Octubre 2026',
    review: 'Revisión',
    scheduled: 'Programado',
    published: 'Publicado',
    planning: 'Planeación',
    list: 'Lista',
    calendar: 'Calendario',
    feed: 'Feed Instagram',
    waiting: (n: number) => `${n} piezas por revisar · Cierre el 24 oct`,
    approveAll: (n: number) => `Aprobar las ${n} piezas`,
    detail: 'Ver detalle',
    approve: 'Aprobar',
    est: 'Publicación estimada',
    notes: (n: number) => (n === 1 ? '1 nota' : `${n} notas`),
    reviewBadge: (round: number) => `En revisión · R${round}`,
    scheduledBadge: 'Programado',
    ideaBadge: 'Propuesta',
    planNote: 'Parrilla de Noviembre en planeación. El equipo de Hiweb está preparando estos temas antes de pasarlos a diseño.',
    emptySched: 'Sin piezas programadas',
    emptySchedBody: 'Cuando apruebes piezas en revisión, aparecerán aquí listas para publicación.',
    empty: 'Nada en esta bandeja.',
    week: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    inReview: 'En revisión',
    close: 'Cierre revisión',
    feedEyebrow: 'Simulación de feed',
    feedTitle: 'Previsualiza la armonía visual de tu cuenta',
    feedBody: 'Las piezas marcadas con punto naranja están en revisión. Puedes tocarlas para abrirlas.',
    posts: 'posts',
    followers: 'seguidores',
    following: 'seguidos',
    bioName: 'Aura Café & Roastery',
    bio: 'Tueste artesanal de origen mexicano. Barra en Roma Norte, CDMX.',
  },
  en: {
    kicker: 'Social',
    channel: 'Instagram & TikTok',
    title: 'Content grid',
    month: 'October 2026',
    review: 'Review',
    scheduled: 'Scheduled',
    published: 'Published',
    planning: 'Planning',
    list: 'List',
    calendar: 'Calendar',
    feed: 'Instagram feed',
    waiting: (n: number) => `${n} pieces to review · Close on 24 Oct`,
    approveAll: (n: number) => `Approve all ${n}`,
    detail: 'View detail',
    approve: 'Approve',
    est: 'Estimated publish',
    notes: (n: number) => (n === 1 ? '1 note' : `${n} notes`),
    reviewBadge: (round: number) => `In review · R${round}`,
    scheduledBadge: 'Scheduled',
    ideaBadge: 'Proposal',
    planNote: 'November grid in planning. The Hiweb team is shaping these topics before they go to design.',
    emptySched: 'Nothing is scheduled',
    emptySchedBody: 'Approved pieces show up here, ready to publish.',
    empty: 'Nothing in this tray.',
    week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    inReview: 'In review',
    close: 'Review close',
    feedEyebrow: 'Feed preview',
    feedTitle: 'See how the grid will sit on the account',
    feedBody: 'Pieces with an orange dot are still in review. Tap one to open it.',
    posts: 'posts',
    followers: 'followers',
    following: 'following',
    bioName: 'Aura Café & Roastery',
    bio: 'Craft roasting from Mexican origins. Bar in Roma Norte, Mexico City.',
  },
} as const;

function Thumb({ fmt }: { fmt: SocialFmt }) {
  const path = fmt === 'reel'
    ? 'M9 7.5v9l8-4.5z'
    : fmt === 'carrusel'
      ? 'M8 5h6l4 4v10H8zM14 5v4h4'
      : 'M6 7h12v10H6zM8 15l2.5-3 2 2 1.5-1.5L16 15';
  return (
    <span className="rrss-thumb" aria-hidden="true">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d={path} />
      </svg>
    </span>
  );
}

function PieceRow({
  piece,
  locale,
  onOpen,
  onApprove,
}: {
  piece: SocialPiece;
  locale: 'es' | 'en';
  onOpen: (id: string) => void;
  onApprove: (id: string) => void;
}) {
  const copy = COPY[locale];
  const pending = piece.status === 'pendiente';
  return (
    <article className="rrss-piece">
      <Thumb fmt={piece.fmt} />
      <div className="rrss-piece__body">
        <div className="rrss-piece__badges">
          <span className="badge sm rrss-fmt-badge">{piece.fmt}</span>
          {pending ? <span className="badge sm rrss-rev-badge">{copy.reviewBadge(piece.round)}</span> : null}
          {piece.status === 'programado' ? <span className="badge sm b-cyan">{copy.scheduledBadge}</span> : null}
          {piece.status === 'idea' ? <span className="badge sm b-lime">{copy.ideaBadge}</span> : null}
          {piece.notes ? <span className="badge sm">{copy.notes(piece.notes)}</span> : null}
        </div>
        <strong>{piece.title}</strong>
        <span className="small muted">{copy.est} · {piece.date}</span>
      </div>
      <div className="rrss-piece__actions">
        <button type="button" className="rrss-ghost" onClick={() => onOpen(piece.id)}>{copy.detail}</button>
        {pending ? <button type="button" className="rrss-solid" onClick={() => onApprove(piece.id)}>{copy.approve}</button> : null}
      </div>
    </article>
  );
}

function Calendar({
  pieces,
  locale,
  onOpen,
}: {
  pieces: SocialPiece[];
  locale: 'es' | 'en';
  onOpen: (id: string) => void;
}) {
  const copy = COPY[locale];
  const offset = (new Date(2026, 9, 1).getDay() + 6) % 7;
  const byDay = new Map(pieces.filter((piece) => piece.day).map((piece) => [piece.day, piece]));
  const cells = [...Array.from({ length: offset }, () => 0), ...Array.from({ length: 31 }, (_, index) => index + 1)];
  return (
    <section className="rrss-cal">
      <header>
        <h2>{copy.month}</h2>
        <span><i className="dot pur" /> {copy.inReview}</span>
        <span><i className="dot cyan" /> {copy.scheduled}</span>
      </header>
      <div className="rrss-cal__scroll">
        <div className="rrss-cal__grid">
          {copy.week.map((day) => <p key={day} className="eyebrow">{day}</p>)}
          {cells.map((day, index) => {
            const piece = day ? byDay.get(day) : undefined;
            return (
              <div key={`${day}-${index}`} className="rrss-cal__cell">
                {day ? <b>{day}</b> : null}
                {day === 24 ? <span className="rrss-cal__close">{copy.close}</span> : null}
                {piece ? (
                  <button type="button" onClick={() => onOpen(piece.id)}>{piece.title}</button>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Feed({
  pieces,
  locale,
  onOpen,
}: {
  pieces: SocialPiece[];
  locale: 'es' | 'en';
  onOpen: (id: string) => void;
}) {
  const copy = COPY[locale];
  return (
    <div className="rrss-feed">
      <div className="rrss-ig">
        <div className="rrss-ig__screen">
          <div className="rrss-ig__head">
            <b>@auracafemx</b>
            <span>Especialidad</span>
          </div>
          <div className="rrss-ig__meta">
            <span className="rrss-ig__avatar">A</span>
            <span><b>48</b>{copy.posts}</span>
            <span><b>12.4k</b>{copy.followers}</span>
            <span><b>340</b>{copy.following}</span>
          </div>
          <p><b>{copy.bioName}</b><br />{copy.bio}</p>
          <div className="rrss-ig__grid">
            {pieces.slice(0, 9).map((piece) => (
              <button key={piece.id} type="button" onClick={() => onOpen(piece.id)} aria-label={piece.title}>
                <Thumb fmt={piece.fmt} />
                {piece.status === 'pendiente' ? <i /> : null}
              </button>
            ))}
          </div>
        </div>
      </div>
      <article className="rrss-feed__note">
        <p className="eyebrow">{copy.feedEyebrow}</p>
        <h2>{copy.feedTitle}</h2>
        <p>{copy.feedBody}</p>
      </article>
    </div>
  );
}

export function SocialBoard({
  locale,
  brand,
  pieces,
  tab,
  view,
  onTab,
  onView,
  onOpen,
  onApprove,
  onApproveAll,
}: {
  locale: 'es' | 'en';
  brand: string;
  pieces: SocialPiece[];
  tab: SocialTab;
  view: SocialView;
  onTab: (tab: SocialTab) => void;
  onView: (view: SocialView) => void;
  onOpen: (id: string) => void;
  onApprove: (id: string) => void;
  onApproveAll: () => void;
}) {
  const copy = COPY[locale];
  const counts = {
    rev: pieces.filter((piece) => piece.status === 'pendiente').length,
    prog: pieces.filter((piece) => piece.status === 'programado').length,
    plan: pieces.filter((piece) => piece.status === 'idea').length,
  };
  const listed = view !== 'lista' ? [] : pieces.filter((piece) => (
    tab === 'rev' ? piece.status === 'pendiente'
      : tab === 'prog' ? piece.status === 'programado'
        : tab === 'plan' ? piece.status === 'idea'
          : false
  ));
  const published = pieces.filter((piece) => piece.status === 'publicado');

  return (
    <div className="rrss-board">
      <header className="rrss-board__head">
        <div className="kicker">
          <span className="badge rrss-kicker">{copy.kicker}</span>
          <span className="small muted">{brand} · {copy.channel}</span>
        </div>
        <h1 className="h1">{copy.title} <span className="gray">— {copy.month}</span></h1>
      </header>
      <div className="rrss-board__tools">
        <div className="rrss-seg" role="tablist">
          <button type="button" className={tab === 'rev' ? 'is-on' : ''} onClick={() => onTab('rev')}>{copy.review} · {counts.rev}</button>
          <button type="button" className={tab === 'prog' ? 'is-on' : ''} onClick={() => onTab('prog')}>{copy.scheduled} · {counts.prog}</button>
          <button type="button" className={tab === 'pub' ? 'is-on' : ''} onClick={() => onTab('pub')}>{copy.published}</button>
          <button type="button" className={tab === 'plan' ? 'is-on' : ''} onClick={() => onTab('plan')}>{copy.planning} · {counts.plan}</button>
        </div>
        <div className="rrss-seg is-dark" role="tablist">
          <button type="button" className={view === 'lista' ? 'is-on' : ''} onClick={() => onView('lista')}>{copy.list}</button>
          <button type="button" className={view === 'cal' ? 'is-on' : ''} onClick={() => onView('cal')}>{copy.calendar}</button>
          <button type="button" className={view === 'ig' ? 'is-on' : ''} onClick={() => onView('ig')}>{copy.feed}</button>
        </div>
      </div>
      {view === 'cal' ? <Calendar pieces={pieces} locale={locale} onOpen={onOpen} /> : null}
      {view === 'ig' ? <Feed pieces={pieces} locale={locale} onOpen={onOpen} /> : null}
      {view === 'lista' && tab === 'rev' ? (
        <>
          <div className="rrss-board__bar">
            <div>
              <h2>{copy.month}</h2>
              <span className="small muted">{copy.waiting(counts.rev)}</span>
            </div>
            {counts.rev ? <button type="button" className="rrss-solid" onClick={onApproveAll}>{copy.approveAll(counts.rev)}</button> : null}
          </div>
          <div className="rrss-list">
            {listed.map((piece) => <PieceRow key={piece.id} piece={piece} locale={locale} onOpen={onOpen} onApprove={onApprove} />)}
          </div>
        </>
      ) : null}
      {view === 'lista' && tab === 'prog' ? (
        listed.length ? (
          <div className="rrss-list">
            {listed.map((piece) => <PieceRow key={piece.id} piece={piece} locale={locale} onOpen={onOpen} onApprove={onApprove} />)}
          </div>
        ) : (
          <div className="rrss-empty">
            <h2>{copy.emptySched}</h2>
            <p>{copy.emptySchedBody}</p>
          </div>
        )
      ) : null}
      {view === 'lista' && tab === 'pub' ? (
        <div className="rrss-pub">
          {published.map((piece) => (
            <button key={piece.id} type="button" className="rrss-pub__card" onClick={() => onOpen(piece.id)}>
              <Thumb fmt={piece.fmt} />
              <span>{piece.title}</span>
              <small>{copy.published} · {piece.date}</small>
            </button>
          ))}
        </div>
      ) : null}
      {view === 'lista' && tab === 'plan' ? (
        <>
          <p className="rrss-plan">{copy.planNote}</p>
          <div className="rrss-list">
            {listed.length ? listed.map((piece) => <PieceRow key={piece.id} piece={piece} locale={locale} onOpen={onOpen} onApprove={onApprove} />) : <p className="muted">{copy.empty}</p>}
          </div>
        </>
      ) : null}
    </div>
  );
}
