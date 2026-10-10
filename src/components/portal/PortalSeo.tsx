import { useState } from 'react';

export type SeoStatus = 'revision' | 'correccion' | 'aprobado' | 'publicado';

export type SeoComment = {
  id: string;
  para: number;
  quote: string;
  text: string;
};

export type SeoArticleData = {
  id: string;
  num: string;
  title: string;
  readTime: string;
  date: string;
  status: SeoStatus;
  round: number;
  paras: string[];
  comments: SeoComment[];
};

const COPY = {
  es: {
    kicker: 'SEO · Blog',
    channel: 'Estrategia de contenidos',
    title: 'Artículos de Blog y SEO',
    review: 'En revisión',
    correction: 'En corrección',
    approved: 'Aprobado',
    published: 'Publicado',
    reviewBadge: (round: number) => `En revisión · R${round}`,
    read: 'Leer artículo',
    empty: 'Nada en esta bandeja.',
    back: 'Volver',
    modeRead: 'Leer',
    modeComment: 'Comentar',
    byline: 'Por redacción Hiweb',
    comments: (n: number) => `Comentarios en el texto (${n})`,
    emptyComments: 'Cambia a Comentar y toca un párrafo para dejar una nota al margen.',
    prompt: 'Escribe el comentario',
    send: 'Enviar comentarios',
    sendPrompt: 'Escribe el comentario para el equipo',
    approve: 'Aprobar artículo',
    done: 'Aprobado',
    topic: 'Café de especialidad',
  },
  en: {
    kicker: 'SEO · Blog',
    channel: 'Content strategy',
    title: 'Blog and SEO articles',
    review: 'In review',
    correction: 'In correction',
    approved: 'Approved',
    published: 'Published',
    reviewBadge: (round: number) => `In review · R${round}`,
    read: 'Read article',
    empty: 'Nothing in this tray.',
    back: 'Back',
    modeRead: 'Read',
    modeComment: 'Comment',
    byline: 'By the Hiweb desk',
    comments: (n: number) => `Comments in the text (${n})`,
    emptyComments: 'Switch to Comment and tap a paragraph to leave a margin note.',
    prompt: 'Write the comment',
    send: 'Send comments',
    sendPrompt: 'Write the note for the team',
    approve: 'Approve article',
    done: 'Approved',
    topic: 'Specialty coffee',
  },
} as const;

const TABS: SeoStatus[] = ['revision', 'correccion', 'aprobado', 'publicado'];

export function SeoBoard({
  locale,
  brand,
  articles,
  onOpen,
}: {
  locale: 'es' | 'en';
  brand: string;
  articles: SeoArticleData[];
  onOpen: (id: string) => void;
}) {
  const copy = COPY[locale];
  const [tab, setTab] = useState<SeoStatus>('revision');
  const labels: Record<SeoStatus, string> = {
    revision: copy.review,
    correccion: copy.correction,
    aprobado: copy.approved,
    publicado: copy.published,
  };
  const visible = articles.filter((article) => article.status === tab);
  return (
    <div className="blog-board">
      <header>
        <div className="kicker">
          <span className="badge blog-kicker">{copy.kicker}</span>
          <span className="small muted">{brand} · {copy.channel}</span>
        </div>
        <h1 className="h1">{copy.title}</h1>
      </header>
      <div className="rrss-seg" role="tablist">
        {TABS.map((key) => (
          <button key={key} type="button" className={tab === key ? 'is-on' : ''} onClick={() => setTab(key)}>
            {labels[key]}{key === 'revision' || key === 'correccion' ? ` · ${articles.filter((article) => article.status === key).length}` : ''}
          </button>
        ))}
      </div>
      {visible.length ? (
        <div className="blog-grid">
          {visible.map((article) => (
            <button key={article.id} type="button" className="blog-card" onClick={() => onOpen(article.id)}>
              <div>
                <span className="badge sm blog-kicker">{article.num}</span>
                <span className={article.status === 'revision' ? 'badge sm site-rev' : 'badge sm site-ok'}>
                  {article.status === 'revision' ? copy.reviewBadge(article.round) : labels[article.status]}
                </span>
                <span className="small muted">{article.readTime}</span>
              </div>
              <h2>{article.title}</h2>
              <p>{article.paras[0]?.slice(0, 160)}…</p>
              <footer>
                <span className="small muted">{locale === 'en' ? 'Round' : 'Ronda'} {article.round} · {article.date}</span>
                <span className="rrss-solid">{copy.read}</span>
              </footer>
            </button>
          ))}
        </div>
      ) : <p className="rrss-empty">{copy.empty}</p>}
    </div>
  );
}

export function SeoArticle({
  article,
  locale,
  onBack,
  onComment,
  onSend,
  onApprove,
}: {
  article: SeoArticleData;
  locale: 'es' | 'en';
  onBack: () => void;
  onComment: (para: number, quote: string, text: string) => void;
  onSend: (text: string) => void;
  onApprove: () => void;
}) {
  const copy = COPY[locale];
  const [mode, setMode] = useState<'read' | 'comment'>('read');
  const approved = article.status === 'aprobado' || article.status === 'publicado';
  const commentOn = (index: number, paragraph: string) => {
    if (mode !== 'comment' || approved) return;
    const text = window.prompt(copy.prompt);
    if (!text?.trim()) return;
    onComment(index, `${paragraph.slice(0, 42)}…`, text.trim());
  };
  const send = () => {
    const text = window.prompt(copy.sendPrompt);
    if (text?.trim()) onSend(text.trim());
  };
  return (
    <div className="blog-read">
      <header>
        <button type="button" className="rrss-ghost" onClick={onBack}>{copy.back}</button>
        <div>
          <span className="small muted">SEO · {article.num}</span>
          <strong>{article.title}</strong>
        </div>
        <div className="rrss-seg is-dark">
          <button type="button" className={mode === 'read' ? 'is-on' : ''} onClick={() => setMode('read')}>{copy.modeRead}</button>
          <button type="button" className={mode === 'comment' ? 'is-on' : ''} onClick={() => setMode('comment')}>{copy.modeComment}</button>
        </div>
        <span className="badge sm">{article.readTime}</span>
      </header>
      <div className="blog-read__body">
        <article className={mode === 'comment' ? 'is-comment' : ''}>
          <div className="site-browser__bar"><i /><i /><i /><span>blog.auracafe.mx · {article.id}</span></div>
          <div className="blog-sheet">
            <span>{article.num} · {copy.topic}</span>
            <h2>{article.title}</h2>
            <small>{article.date} · {copy.byline} · {article.readTime}</small>
            {article.paras.map((paragraph, index) => (
              <p key={paragraph.slice(0, 24)} onClick={() => commentOn(index, paragraph)}>{paragraph}</p>
            ))}
          </div>
        </article>
        <aside>
          <p className="eyebrow">{copy.comments(article.comments.length)}</p>
          {article.comments.length ? article.comments.map((comment, index) => (
            <p key={comment.id} className="site-note">
              <b>{index + 1}</b>
              <span>
                {comment.quote ? <em>“{comment.quote}”</em> : null}
                {comment.text}
              </span>
            </p>
          )) : <p className="site-note is-empty">{copy.emptyComments}</p>}
          <div className="site-view__actions">
            <button type="button" className="rrss-ghost" onClick={send} disabled={approved}>{copy.send}</button>
            <button type="button" className="rrss-solid" data-tour="approve" onClick={onApprove} disabled={approved}>
              {approved ? copy.done : copy.approve}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
