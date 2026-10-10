import { useEffect, useMemo, useRef, useState } from 'react';
import { PortalTour } from './PortalTour';
import { HiLinksBoard } from './PortalHiLinks';
import { DocsBoard, DocReader, docsFor } from './PortalDocs';
import { SeoArticle, SeoBoard, type SeoArticleData, type SeoComment } from './PortalSeo';
import { SocialBoard, type SocialTab, type SocialView } from './PortalSocial';
import { WebBoard, WebPageViewer, type WebPage, type WebPin } from './PortalWebView';
import './PortalDemo.css';

export type PortalModule = 'rrss' | 'web' | 'seo' | 'docs' | 'hilinks';

export type PortalSample = {
  module: PortalModule;
  title: string;
  detail?: string;
};

type PortalDemoProps = {
  locale?: 'es' | 'en';
  clientName?: string;
  windowTitle?: string;
  samples?: PortalSample[];
  tourLabel?: string;
  viewerLabel?: string;
  coachLabel?: string;
  coachText?: string;
};

type Route = 'inicio' | PortalModule;
type Fmt = 'carrusel' | 'reel' | 'post' | 'story';

type Piece = {
  id: string;
  title: string;
  fmt: Fmt;
  month: string;
  date: string;
  status: 'pendiente' | 'programado' | 'publicado' | 'idea';
  day?: number;
  notes?: number;
  round: number;
  caption: string;
  tags: string;
  note?: string;
};

type Deliverable = {
  id: string;
  kind: 'web' | 'seo';
  label: string;
  title: string;
  meta: string;
  status: 'revision' | 'correccion' | 'aprobado' | 'publicado';
  round?: number;
  updated?: string;
  checks?: { desktop: boolean; mobile: boolean };
  pins?: WebPin[];
  num?: string;
  readTime?: string;
  date?: string;
  paras?: string[];
  comments?: SeoComment[];
  note?: string;
};

const COPY = {
  es: {
    pending: 'Pendientes',
    services: 'Servicios',
    resources: 'Recursos',
    rrss: 'RRSS',
    web: 'Sitio web',
    seo: 'SEO',
    docs: 'Documentos',
    faq: 'Preguntas frecuentes',
    prefs: 'Preferencias',
    hilinks: 'HiLinks',
    active: '3 servicios activos',
    hello: 'Buenas tardes, Sofia',
    waiting: (n: number) => (n ? `— ${n} cosas esperan tu visto bueno` : '— todo al día'),
    social: 'Redes sociales',
    pieces: 'piezas en revisión',
    pages: 'páginas por validar',
    articles: 'artículos redactados',
    close: 'Próximo cierre de revisión',
    closeMeta: (n: number) => `Viernes 24 oct · ${n} entregables de redes`,
    days: '2d',
    socialHead: 'Redes Sociales',
    socialSub: 'Cierre próximo',
    business: '2 días hábiles',
    webHead: 'Sitio Web & Blog SEO',
    webSub: 'En espera de visto bueno',
    review: 'En revisión',
    approved: 'Aprobado',
    approve: 'Aprobar',
    comment: 'Comentar',
    back: 'Volver',
    history: 'Historial',
    pieceOf: (index: number, total: number) => `Pieza ${index} de ${total}`,
    video: 'Vídeo',
    cover: 'Portada',
    download: 'Descargar',
    copyLabel: 'Copy',
    comments: 'Comentarios',
    noComments: 'Sin comentarios.',
    published: 'Publicación',
    pendingOne: 'Pendiente',
    notePrompt: 'Escribe el comentario',
    role: 'Sofia (Aprobador)',
    empty: 'No hay entregables pendientes en este módulo.',
    replay: 'Repetir Tour',
  },
  en: {
    pending: 'Pending',
    services: 'Services',
    resources: 'Resources',
    rrss: 'Social',
    web: 'Website',
    seo: 'SEO',
    docs: 'Documents',
    faq: 'FAQs',
    prefs: 'Preferences',
    hilinks: 'HiLinks',
    active: '3 active services',
    hello: 'Good afternoon, Sofia',
    waiting: (n: number) => (n ? `— ${n} things are waiting for your sign-off` : '— all caught up'),
    social: 'Social',
    pieces: 'pieces in review',
    pages: 'pages to validate',
    articles: 'articles written',
    close: 'Next review close',
    closeMeta: (n: number) => `Friday 24 Oct · ${n} social deliverables`,
    days: '2d',
    socialHead: 'Social',
    socialSub: 'Close coming up',
    business: '2 business days',
    webHead: 'Website & SEO blog',
    webSub: 'Waiting for sign-off',
    review: 'In review',
    approved: 'Approved',
    approve: 'Approve',
    comment: 'Comment',
    back: 'Back',
    history: 'History',
    pieceOf: (index: number, total: number) => `Piece ${index} of ${total}`,
    video: 'Video',
    cover: 'Cover',
    download: 'Download',
    copyLabel: 'Copy',
    comments: 'Comments',
    noComments: 'No comments.',
    published: 'Published',
    pendingOne: 'Pending',
    notePrompt: 'Write a comment',
    role: 'Sofia (Approver)',
    empty: 'Nothing is waiting in this module.',
    replay: 'Replay tour',
  },
} as const;

const PIECES: Record<'es' | 'en', Piece[]> = {
  es: [
    { id: 'p1', title: 'Guía de Extracción V60: Proporción 1:16, molienda y vertido', fmt: 'carrusel', month: 'Octubre', date: '14 oct 2026', day: 14, status: 'pendiente', round: 1, notes: 1, caption: 'Proporción 1:16, molienda media y un vertido lento. La guía para preparar el V60 en casa.', tags: '#AuraCafé #V60 #CaféDeEspecialidad' },
    { id: 'p2', title: 'Detrás de Barra: Tueste Artesanal de Origen Chiapas', fmt: 'reel', month: 'Octubre', date: '19 oct 2026', day: 19, status: 'pendiente', round: 1, notes: 1, caption: 'El tueste de origen Chiapas, visto desde la barra.', tags: '#AuraCafé #Tueste #Chiapas' },
    { id: 'p3', title: 'Lanzamiento de Temporada: Café Gesha Lavado Finca Santa Anita', fmt: 'post', month: 'Octubre', date: '24 oct 2026', day: 24, status: 'pendiente', round: 1, caption: 'Llega el Gesha lavado de Finca Santa Anita. Temporada limitada.', tags: '#AuraCafé #Gesha #SantaAnita' },
    { id: 'p4', title: 'Historias de Barista: Agenda de Catas Guiadas este Fin de Semana', fmt: 'story', month: 'Octubre', date: '28 oct 2026', day: 28, status: 'pendiente', round: 1, caption: 'Catas guiadas este fin de semana. Los cupos están en la barra.', tags: '#AuraCafé #Cata #Barista' },
    { id: 'p5', title: '3 errores comunes al almacenar café en grano en casa', fmt: 'carrusel', month: 'Septiembre', date: '18 sept 2026', status: 'publicado', round: 1, caption: 'Evita el refrigerador, usa un frasco hermético y muele solo lo que vas a preparar.', tags: '#AuraCafé #Almacenaje' },
    { id: 'p6', title: 'Diferencia en taza: proceso lavado y proceso natural', fmt: 'reel', month: 'Septiembre', date: '25 sept 2026', status: 'publicado', round: 1, caption: 'El lavado deja la taza más clara. El natural concentra el dulzor de la fruta.', tags: '#AuraCafé #Proceso' },
    { id: 'i1', title: 'Parrilla de noviembre, semana 1: tueste medio y tueste oscuro', fmt: 'carrusel', month: 'Noviembre', date: 'Semana 1 · nov', status: 'idea', round: 1, caption: 'Tema en planeación. Todavía no hay copy.', tags: '' },
    { id: 'i2', title: 'Parrilla de noviembre, semana 2: maridaje con repostería', fmt: 'post', month: 'Noviembre', date: 'Semana 2 · nov', status: 'idea', round: 1, caption: 'Tema en planeación. Todavía no hay copy.', tags: '' },
  ],
  en: [
    { id: 'p1', title: 'V60 brew guide: 1:16 ratio, grind and pour', fmt: 'carrusel', month: 'October', date: '14 Oct 2026', day: 14, status: 'pendiente', round: 1, notes: 1, caption: 'A 1:16 ratio, a medium grind, and a slow pour. The guide for brewing V60 at home.', tags: '#AuraCafe #V60 #SpecialtyCoffee' },
    { id: 'p2', title: 'Behind the bar: Chiapas origin roast', fmt: 'reel', month: 'October', date: '19 Oct 2026', day: 19, status: 'pendiente', round: 1, notes: 1, caption: 'The Chiapas origin roast, seen from behind the bar.', tags: '#AuraCafe #Roast #Chiapas' },
    { id: 'p3', title: 'Season launch: washed Gesha, Finca Santa Anita', fmt: 'post', month: 'October', date: '24 Oct 2026', day: 24, status: 'pendiente', round: 1, caption: 'The washed Gesha from Finca Santa Anita is here. A limited season.', tags: '#AuraCafe #Gesha #SantaAnita' },
    { id: 'p4', title: 'Barista stories: guided cupping this weekend', fmt: 'story', month: 'October', date: '28 Oct 2026', day: 28, status: 'pendiente', round: 1, caption: 'Guided cuppings this weekend. Seats are at the bar.', tags: '#AuraCafe #Cupping #Barista' },
    { id: 'p5', title: '3 mistakes when storing whole-bean coffee at home', fmt: 'carrusel', month: 'September', date: '18 Sep 2026', status: 'publicado', round: 1, caption: 'Skip the fridge, use an airtight jar, and grind only what you will brew.', tags: '#AuraCafe #Storage' },
    { id: 'p6', title: 'In the cup: washed process and natural process', fmt: 'reel', month: 'September', date: '25 Sep 2026', status: 'publicado', round: 1, caption: 'Washed coffees taste clearer. Naturals concentrate the fruit sweetness.', tags: '#AuraCafe #Process' },
    { id: 'i1', title: 'November grid, week 1: medium roast and dark roast', fmt: 'carrusel', month: 'November', date: 'Week 1 · Nov', status: 'idea', round: 1, caption: 'Still in planning. No caption yet.', tags: '' },
    { id: 'i2', title: 'November grid, week 2: pairing with pastry', fmt: 'post', month: 'November', date: 'Week 2 · Nov', status: 'idea', round: 1, caption: 'Still in planning. No caption yet.', tags: '' },
  ],
};

const DELIVERABLES: Record<'es' | 'en', Deliverable[]> = {
  es: [
    { id: 'w1', kind: 'web', label: 'Sitio Web', title: 'Homepage / Hero, Barra de Tueste y Catálogo', meta: 'Ronda 2 · 2 pines', status: 'revision', round: 2, updated: '12 oct', checks: { desktop: false, mobile: false }, pins: [
      { id: 'wc1', vp: 'desktop', x: 28, y: 36, text: 'Hacer el botón Comprar en grano con mayor contraste en el hero.' },
      { id: 'wc2', vp: 'mobile', x: 50, y: 44, text: 'El espacio entre el titular y el badge de origen se ve muy ajustado en móvil.' },
    ] },
    { id: 'w2', kind: 'web', label: 'Sitio Web', title: 'Nuestra Carta y Métodos de Extracción en Barra', meta: 'Ronda 1', status: 'aprobado', round: 1, updated: '28 sept', checks: { desktop: true, mobile: true }, pins: [] },
    { id: 'w3', kind: 'web', label: 'Sitio Web', title: 'Historia, Fincas Cafetaleras y Comercio Directo', meta: 'Ronda 1', status: 'revision', round: 1, updated: '05 oct', checks: { desktop: false, mobile: false }, pins: [] },
    { id: 'w4', kind: 'web', label: 'Sitio Web', title: 'Suscripciones Mensuales de Café y Tienda Online', meta: 'Ronda 1', status: 'aprobado', round: 1, updated: '20 sept', checks: { desktop: true, mobile: true }, pins: [] },
    { id: 'a1', kind: 'seo', label: 'SEO · Blog', num: 'Blog 01', title: 'Guía completa del café de especialidad: variedades, procesos y tueste', meta: 'Ronda 1 · 10 oct 2026', status: 'revision', round: 1, readTime: '5 min de lectura', date: '10 oct 2026', paras: [
      'El café de especialidad no es solo una etiqueta. Es una cadena de trazabilidad en la que cada grano supera 80 puntos según la Specialty Coffee Association.',
      'En México, Chiapas, Oaxaca y Veracruz tienen microclimas bajo sombra que maduran la cereza despacio y concentran azúcares y aroma.',
      'Bourbon, Typica y Gesha, y la diferencia entre lavado y natural, cambian por completo lo que llega a la taza.',
      'En Aura tostamos lotes pequeños cada semana para que el café se beba en su mejor momento, con notas florales y acidez brillante.',
    ], comments: [{ id: 'sc1', para: 1, quote: 'En México, Chiapas, Oaxaca…', text: 'Mencionar también los microlotes de la Sierra Mixteca de Oaxaca.' }] },
    { id: 'a2', kind: 'seo', label: 'SEO · Blog', num: 'Blog 02', title: 'Cómo calibrar tu molino en casa para una extracción limpia en V60', meta: 'Ronda 1 · 02 oct 2026', status: 'correccion', round: 1, readTime: '4 min de lectura', date: '02 oct 2026', paras: [
      'La molienda decide la extracción. Demasiado fina amarga la taza. Demasiado gruesa la deja ácida y vacía.',
      'Esta guía calibra molinos cónicos, manuales y eléctricos, con una referencia simple de tamaño.',
    ], comments: [{ id: 'sc2', para: -1, quote: '', text: 'El equipo está agregando la tabla comparativa por marca de molino.' }] },
    { id: 'a3', kind: 'seo', label: 'SEO · Blog', num: 'Blog 03', title: 'Café de sombra y comercio directo: el impacto en fincas de Chiapas', meta: 'Ronda 1 · 24 sept 2026', status: 'aprobado', round: 1, readTime: '6 min de lectura', date: '24 sept 2026', paras: [
      'El comercio directo acorta intermediarios y hace que más del valor de la taza regrese a las familias de Finca El Triunfo.',
    ], comments: [] },
    { id: 'a4', kind: 'seo', label: 'SEO · Blog', num: 'Blog 04', title: 'Las 5 notas de cata más comunes y cómo identificarlas', meta: 'Ronda 1 · 15 sept 2026', status: 'publicado', round: 1, readTime: '3 min de lectura', date: '15 sept 2026', paras: [
      'De la acidez málica de la manzana verde al jazmín y la miel: un ejercicio corto para entrenar el paladar.',
    ], comments: [] },
  ],
  en: [
    { id: 'w1', kind: 'web', label: 'Website', title: 'Homepage / hero, brew bar and catalog', meta: 'Round 2 · 2 pins', status: 'revision', round: 2, updated: '12 Oct', checks: { desktop: false, mobile: false }, pins: [
      { id: 'wc1', vp: 'desktop', x: 28, y: 36, text: 'Give the Buy whole bean button more contrast in the hero.' },
      { id: 'wc2', vp: 'mobile', x: 50, y: 44, text: 'The gap between the headline and the origin badge is too tight on mobile.' },
    ] },
    { id: 'w2', kind: 'web', label: 'Website', title: 'Bar menu and brew methods', meta: 'Round 1', status: 'aprobado', round: 1, updated: '28 Sep', checks: { desktop: true, mobile: true }, pins: [] },
    { id: 'w3', kind: 'web', label: 'Website', title: 'Story, farms and direct trade', meta: 'Round 1', status: 'revision', round: 1, updated: '05 Oct', checks: { desktop: false, mobile: false }, pins: [] },
    { id: 'w4', kind: 'web', label: 'Website', title: 'Monthly coffee subscriptions and shop', meta: 'Round 1', status: 'aprobado', round: 1, updated: '20 Sep', checks: { desktop: true, mobile: true }, pins: [] },
    { id: 'a1', kind: 'seo', label: 'SEO · Blog', num: 'Blog 01', title: 'A complete guide to specialty coffee: varieties, process and roast', meta: 'Round 1 · 10 Oct 2026', status: 'revision', round: 1, readTime: '5 min read', date: '10 Oct 2026', paras: [
      'Specialty coffee is a traceable chain. Each lot scores above 80 points on the Specialty Coffee Association scale.',
      'In Mexico, Chiapas, Oaxaca and Veracruz ripen cherries slowly under shade, and that builds sugar and aroma.',
      'Bourbon, Typica and Gesha, and the gap between washed and natural, change what lands in the cup.',
      'At Aura we roast small lots every week so the coffee is drunk at its best, floral and bright.',
    ], comments: [{ id: 'sc1', para: 1, quote: 'In Mexico, Chiapas, Oaxaca…', text: 'Also mention the micro-lots from the Sierra Mixteca in Oaxaca.' }] },
    { id: 'a2', kind: 'seo', label: 'SEO · Blog', num: 'Blog 02', title: 'How to calibrate a home grinder for a clean V60', meta: 'Round 1 · 02 Oct 2026', status: 'correccion', round: 1, readTime: '4 min read', date: '02 Oct 2026', paras: [
      'Grind size decides the extraction. Too fine and the cup turns bitter. Too coarse and it stays sour and thin.',
      'This guide calibrates cone grinders, hand and electric, against a simple size reference.',
    ], comments: [{ id: 'sc2', para: -1, quote: '', text: 'The team is adding a comparison table by grinder brand.' }] },
    { id: 'a3', kind: 'seo', label: 'SEO · Blog', num: 'Blog 03', title: 'Shade-grown coffee and direct trade in Chiapas', meta: 'Round 1 · 24 Sep 2026', status: 'aprobado', round: 1, readTime: '6 min read', date: '24 Sep 2026', paras: [
      'Direct trade shortens the chain and sends more of the cup’s value back to the families at Finca El Triunfo.',
    ], comments: [] },
    { id: 'a4', kind: 'seo', label: 'SEO · Blog', num: 'Blog 04', title: 'Five common cupping notes and how to spot them', meta: 'Round 1 · 15 Sep 2026', status: 'publicado', round: 1, readTime: '3 min read', date: '15 Sep 2026', paras: [
      'From green-apple acidity to jasmine and honey: a short drill for training your palate.',
    ], comments: [] },
  ],
};

function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    home: 'M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z',
    ig: 'M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zm5 4.2A3.8 3.8 0 1 0 15.8 12 3.8 3.8 0 0 0 12 8.2zM17.2 7.3h.01',
    globe: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm-8 8h16M12 4c2.2 2.2 3.3 4.8 3.3 8S14.2 17.8 12 20C9.8 17.8 8.7 15.2 8.7 12S9.8 6.2 12 4z',
    search: 'M11 6a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5 11.5-2.4-2.4',
    link: 'M10 13a4 4 0 0 0 5.7 0l2-2a4 4 0 0 0-5.7-5.7l-1 1M14 11a4 4 0 0 0-5.7 0l-2 2a4 4 0 0 0 5.7 5.7l1-1',
    doc: 'M8 4h6l4 4v12H8zM14 4v4h4',
    help: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 11.2h.01M9.8 9.5a2.2 2.2 0 0 1 4.2.8c0 1.4-2 1.6-2 2.7',
    gear: 'M12 9.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6zM12 4.5v1.6M12 17.9V19.5M4.5 12H6.1M17.9 12h1.6M6.7 6.7l1.1 1.1M16.2 16.2l1.1 1.1M17.3 6.7l-1.1 1.1M7.8 16.2l-1.1 1.1',
    arrow: 'M6 12h12M13 7l5 5-5 5',
  };
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d={paths[name] || paths.doc} />
    </svg>
  );
}

function fmtLabel(fmt: Fmt, locale: 'es' | 'en') {
  if (locale === 'en') {
    return { carrusel: 'Carousel', reel: 'Reel', post: 'Post', story: 'Story' }[fmt];
  }
  return { carrusel: 'Carrusel', reel: 'Reel', post: 'Post', story: 'Story' }[fmt];
}

export function PortalDemo({
  locale = 'es',
  clientName,
  windowTitle,
  coachLabel,
  coachText,
}: PortalDemoProps) {
  const copy = COPY[locale];
  const brand = clientName || 'Aura Café & Roastery';
  const [pieces, setPieces] = useState<Piece[]>(() => PIECES[locale].map((item) => ({ ...item })));
  const [items, setItems] = useState<Deliverable[]>(() => DELIVERABLES[locale].map((item) => ({ ...item })));
  const [route, setRoute] = useState<Route>('inicio');
  const [openId, setOpenId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [rrssTab, setRrssTab] = useState<SocialTab>('rev');
  const [rrssView, setRrssView] = useState<SocialView>('lista');
  const [docId, setDocId] = useState<string | null>(null);
  const [tourOn, setTourOn] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [tourSession, setTourSession] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const rrss = pieces.filter((piece) => piece.status === 'pendiente').length;
    const web = items.filter((item) => item.kind === 'web' && item.status === 'revision').length;
    const seo = items.filter((item) => item.kind === 'seo' && item.status === 'revision').length;
    return { rrss, web, seo, total: rrss + web + seo };
  }, [pieces, items]);

  const go = (next: Route) => {
    setRoute(next);
    setOpenId(null);
    setDocId(null);
    setMenuOpen(false);
  };

  const approvePiece = (id: string) => {
    setPieces((current) => current.map((piece) => (piece.id === id && piece.status === 'pendiente' ? { ...piece, status: 'programado' } : piece)));
  };

  const approveAllPieces = () => {
    setPieces((current) => current.map((piece) => (piece.status === 'pendiente' ? { ...piece, status: 'programado' } : piece)));
  };

  const approveItem = (id: string) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, status: 'aprobado' } : item)));
  };

  const toggleWebCheck = (id: string, key: 'desktop' | 'mobile') => {
    setItems((current) => current.map((item) => (item.id === id && item.checks ? { ...item, checks: { ...item.checks, [key]: !item.checks[key] } } : item)));
  };

  const addWebPin = (id: string, pin: Omit<WebPin, 'id'>) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, pins: [...(item.pins ?? []), { ...pin, id: `pin-${Date.now()}` }] } : item)));
  };

  const addSeoComment = (id: string, para: number, quote: string, text: string, toCorrection = false) => {
    setItems((current) => current.map((item) => (item.id === id ? {
      ...item,
      status: toCorrection && item.status === 'revision' ? 'correccion' : item.status,
      comments: [...(item.comments ?? []), { id: `sc-${Date.now()}`, para, quote, text }],
    } : item)));
  };

  const commentPiece = (id: string) => {
    const note = window.prompt(copy.notePrompt);
    if (!note?.trim()) return;
    setPieces((current) => current.map((piece) => (piece.id === id ? { ...piece, note: note.trim() } : piece)));
  };

  const commentItem = (id: string) => {
    const note = window.prompt(copy.notePrompt);
    if (!note?.trim()) return;
    setItems((current) => current.map((item) => (item.id === id ? { ...item, note: note.trim() } : item)));
  };

  const startTour = () => {
    setExpanded(false);
    setMenuOpen(false);
    setOpenId(null);
    setDocId(null);
    setRoute('inicio');
    setTourStep(0);
    setTourOn(true);
    setTourSession((value) => value + 1);
  };

  const startTourRef = useRef(startTour);
  startTourRef.current = startTour;
  useEffect(() => {
    const onTour = () => startTourRef.current();
    const onViewer = () => setExpanded(true);
    window.addEventListener('portal-tour', onTour);
    window.addEventListener('portal-viewer', onViewer);
    return () => {
      window.removeEventListener('portal-tour', onTour);
      window.removeEventListener('portal-viewer', onViewer);
    };
  }, []);

  const activeRoute = tourOn ? 'inicio' : route;
  const tourPieceId = tourOn && tourStep === 4 ? pieces[0]?.id ?? null : null;
  const activeOpenId = tourOn ? tourPieceId : openId;
  const pendingPieces = pieces.filter((piece) => piece.status === 'pendiente');
  const pendingWeb = items.filter((item) => item.kind === 'web' && item.status === 'revision');
  const pendingSeo = items.filter((item) => item.kind === 'seo' && item.status === 'revision');
  const openedPiece = pieces.find((piece) => piece.id === activeOpenId);
  const openedItem = tourOn ? undefined : items.find((item) => item.id === activeOpenId);
  const openedWeb = openedItem?.kind === 'web' ? openedItem : undefined;
  const webPages = items.filter((item) => item.kind === 'web');
  const showWebBoard = !openedPiece && !openedItem && activeRoute === 'web';
  const showHiLinks = !openedPiece && !openedItem && activeRoute === 'hilinks';
  const showSeoBoard = !openedPiece && !openedItem && activeRoute === 'seo';
  const openedSeo = openedItem?.kind === 'seo' ? openedItem : undefined;
  const seoArticles = items.filter((item) => item.kind === 'seo');
  const asWeb = (item: Deliverable): WebPage => ({
    id: item.id,
    title: item.title,
    status: item.status === 'aprobado' ? 'aprobado' : 'revision',
    round: item.round ?? 1,
    updated: item.updated ?? '',
    checks: item.checks ?? { desktop: false, mobile: false },
    pins: item.pins ?? [],
  });
  const asSeo = (item: Deliverable): SeoArticleData => ({
    id: item.id,
    num: item.num ?? 'Blog',
    title: item.title,
    readTime: item.readTime ?? '',
    date: item.date ?? item.meta,
    status: item.status,
    round: item.round ?? 1,
    paras: item.paras ?? [],
    comments: item.comments ?? [],
  });

  return (
    <div className={['portal-demo', expanded ? 'is-expanded' : ''].filter(Boolean).join(' ')}>
      <div className="hero-embed-wrap">
        <div className="mw-window" ref={frameRef}>
          <div className="mw-window-bar">
            <div className="mw-traffic" aria-hidden="true">
              <i className="red" />
              <i className="yel" />
              <i className="grn" />
            </div>
            <div className="mw-window-title">
              <span>{windowTitle || (locale === 'en' ? 'Client Portal' : 'Portal de Clientes')}</span>
              <span>/</span>
              <span className="title-brand">{brand}</span>
            </div>
            <div className="mw-window-actions">
              <span className="mw-role">{copy.role}</span>
            </div>
          </div>
          <div className="mw-window-body">
            <div className={['app', openedPiece || showHiLinks ? 'has-board' : '', menuOpen ? 'is-menu' : ''].filter(Boolean).join(' ')}>
              <button type="button" className="menu-scrim" aria-label={locale === 'en' ? 'Close menu' : 'Cerrar menú'} onClick={() => setMenuOpen(false)} />
              <aside className="side">
                <button type="button" className="menu-close" aria-label={locale === 'en' ? 'Close menu' : 'Cerrar menú'} onClick={() => setMenuOpen(false)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
                </button>
                <div className="logo">
                  <span className="tile">
                    <img src="/images/isotipo-hiweb.png" width="18" height="18" alt="" />
                  </span>
                  <span>Hiweb</span>
                </div>
                <div className="brand-sw">
                  <span className="avatar">A</span>
                  <span>{brand}</span>
                </div>
                <nav className="nav" aria-label={copy.pending}>
                  <button type="button" data-tour="pending" className={activeRoute === 'inicio' ? 'on' : ''} onClick={() => go('inicio')}>
                    <Icon name="home" />
                    <span>{copy.pending}</span>
                    {counts.total ? <span className="cnt">{counts.total}</span> : null}
                  </button>
                </nav>
                <nav className="nav" aria-label={copy.services}>
                  <p className="eyebrow">{copy.services}</p>
                  <button type="button" className={activeRoute === 'rrss' ? 'on' : ''} onClick={() => go('rrss')}>
                    <Icon name="ig" />
                    <span>{copy.rrss}</span>
                    {counts.rrss ? <span className="cnt pur">{counts.rrss}</span> : null}
                  </button>
                  <button type="button" className={activeRoute === 'web' ? 'on' : ''} onClick={() => go('web')}>
                    <Icon name="globe" />
                    <span>{copy.web}</span>
                    {counts.web ? <span className="cnt ora">{counts.web}</span> : null}
                  </button>
                  <button type="button" className={activeRoute === 'seo' ? 'on' : ''} onClick={() => go('seo')}>
                    <Icon name="search" />
                    <span>{copy.seo}</span>
                    {counts.seo ? <span className="cnt cyan">{counts.seo}</span> : null}
                  </button>
                  <button type="button" className={activeRoute === 'hilinks' ? 'on' : ''} onClick={() => go('hilinks')}>
                    <Icon name="link" />
                    <span>{copy.hilinks}</span>
                  </button>
                </nav>
                <nav className="nav" aria-label={copy.resources}>
                  <p className="eyebrow">{copy.resources}</p>
                  <button type="button" className={activeRoute === 'docs' ? 'on' : ''} onClick={() => go('docs')}>
                    <Icon name="doc" />
                    <span>{copy.docs}</span>
                  </button>
                  <button type="button" onClick={() => { setMenuOpen(false); document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }); }}>
                    <Icon name="help" />
                    <span>{copy.faq}</span>
                  </button>
                  <button type="button" onClick={() => go('inicio')}>
                    <Icon name="gear" />
                    <span>{copy.prefs}</span>
                  </button>
                </nav>
              </aside>
              <div className="main">
                <div className="mobile-bar">
                  <span className="logo">
                    <span className="tile">
                      <img src="/images/isotipo-hiweb.png" width="18" height="18" alt="" />
                    </span>
                    <span>Hiweb</span>
                  </span>
                  <span className="brand-name">{brand}</span>
                  <button type="button" className="menu-btn" aria-label={locale === 'en' ? 'Open menu' : 'Abrir menú'} onClick={() => setMenuOpen(true)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
                  </button>
                </div>
                {openedPiece ? (
                  <SocialViewer
                    piece={openedPiece}
                    pieces={pieces}
                    index={pieces.findIndex((item) => item.id === openedPiece.id)}
                    total={pieces.length}
                    locale={locale}
                    copy={copy}
                    onBack={() => setOpenId(null)}
                    onOpen={setOpenId}
                    onApprove={() => approvePiece(openedPiece.id)}
                    onComment={() => commentPiece(openedPiece.id)}
                  />
                ) : null}
                {openedWeb ? (
                  <WebPageViewer
                    page={asWeb(openedWeb)}
                    locale={locale}
                    onBack={() => setOpenId(null)}
                    onPin={(pin) => addWebPin(openedWeb.id, pin)}
                    onCheck={(key) => toggleWebCheck(openedWeb.id, key)}
                    onChanges={(text) => addWebPin(openedWeb.id, { vp: 'desktop', x: 18, y: 18, text })}
                    onApprove={() => approveItem(openedWeb.id)}
                  />
                ) : null}
                {openedSeo ? (
                  <SeoArticle
                    article={asSeo(openedSeo)}
                    locale={locale}
                    onBack={() => setOpenId(null)}
                    onComment={(para, quote, text) => addSeoComment(openedSeo.id, para, quote, text)}
                    onSend={(text) => addSeoComment(openedSeo.id, -1, '', text, true)}
                    onApprove={() => approveItem(openedSeo.id)}
                  />
                ) : null}
                {showSeoBoard ? (
                  <SeoBoard
                    locale={locale}
                    brand={brand}
                    articles={seoArticles.map(asSeo)}
                    onOpen={setOpenId}
                  />
                ) : null}
                {openedItem && openedItem.kind !== 'web' && openedItem.kind !== 'seo' ? (
                  <Detail
                    title={openedItem.title}
                    meta={openedItem.meta}
                    status={openedItem.status === 'aprobado' ? copy.approved : copy.review}
                    note={openedItem.note}
                    back={copy.back}
                    approve={copy.approve}
                    comment={copy.comment}
                    onBack={() => setOpenId(null)}
                    onApprove={() => approveItem(openedItem.id)}
                    onComment={() => commentItem(openedItem.id)}
                  />
                ) : null}
                {showWebBoard ? (
                  <WebBoard
                    locale={locale}
                    brand={brand}
                    pages={webPages.map(asWeb)}
                    onOpen={setOpenId}
                  />
                ) : null}
                {!openedPiece && !openedItem && activeRoute === 'inicio' ? (
                  <>
                    <div>
                      <div className="kicker">
                        <span className="badge b-ink">{copy.pending}</span>
                        <span className="small muted">{brand} · {copy.active}</span>
                      </div>
                      <h2 className="h1">
                        {copy.hello} <span className="gray">{copy.waiting(counts.total)}</span>
                      </h2>
                    </div>
                    <div className="band" data-tour="band">
                      <button type="button" onClick={() => go('rrss')}>
                        <span className="lab"><i className="dot" style={{ background: 'var(--pur)' }} />{copy.social}</span>
                        <span className="num">{counts.rrss}</span>
                        <span className="txt">{copy.pieces}</span>
                      </button>
                      <button type="button" onClick={() => go('web')}>
                        <span className="lab"><i className="dot" style={{ background: 'var(--ora)' }} />{copy.web}</span>
                        <span className="num">{counts.web}</span>
                        <span className="txt">{copy.pages}</span>
                      </button>
                      <button type="button" onClick={() => go('seo')}>
                        <span className="lab"><i className="dot" style={{ background: 'var(--cyan)' }} />SEO · Blog</span>
                        <span className="num">{counts.seo}</span>
                        <span className="txt">{copy.articles}</span>
                      </button>
                      <div className="dl">
                        <div>
                          <span className="badge b-lime sm">{copy.close}</span>
                          <span className="txt">{copy.closeMeta(counts.rrss)}</span>
                        </div>
                        <span className="num">{copy.days}</span>
                      </div>
                    </div>
                    <section className="card" data-tour={pendingPieces.length ? undefined : 'social'}>
                      <div className="card-head">
                        <strong>{copy.socialHead} <span>· {copy.socialSub}</span></strong>
                        <span className="badge b-lime sm">{copy.business}</span>
                      </div>
                      {pendingPieces.map((piece, index) => (
                        <button key={piece.id} type="button" className="lrow" data-tour={index === 0 ? 'social' : undefined} onClick={() => setOpenId(piece.id)}>
                          <span className="hide-m">
                            <span className="badge b-pur sm">{fmtLabel(piece.fmt, locale)}</span>
                            <span className="small muted" style={{ display: 'block' }}>{piece.month}</span>
                          </span>
                          <span>
                            <span className="piece-title">{piece.title}</span>
                            <span className="small muted" style={{ display: 'block' }}>
                              {locale === 'en' ? 'Publish date' : 'Fecha de publicación'} · {piece.date}
                            </span>
                          </span>
                          <span className="badge b-neu sm hide-m">{copy.review} · R{piece.round}</span>
                          <span className="arrow" aria-hidden="true"><Icon name="arrow" /></span>
                        </button>
                      ))}
                    </section>
                    <section className="card" data-tour="web">
                      <div className="card-head soft">
                        <strong>{copy.webHead} <span>· {copy.webSub}</span></strong>
                      </div>
                      {[...pendingWeb, ...pendingSeo].map((item) => (
                        <button key={item.id} type="button" className="lrow" onClick={() => setOpenId(item.id)}>
                          <span className="hide-m">
                            <span className={`badge sm ${item.kind === 'web' ? 'b-ora' : 'b-cyan'}`}>{item.label}</span>
                          </span>
                          <span>
                            <span className="piece-title">{item.title}</span>
                            <span className="small muted" style={{ display: 'block' }}>{item.meta}</span>
                          </span>
                          <span className={`badge sm hide-m ${item.kind === 'web' ? 'b-ora' : 'b-neu'}`}>{copy.review}</span>
                          <span className="arrow" aria-hidden="true"><Icon name="arrow" /></span>
                        </button>
                      ))}
                    </section>
                  </>
                ) : null}
                {!openedPiece && !openedItem && activeRoute === 'rrss' ? (
                  <SocialBoard
                    locale={locale}
                    brand={brand}
                    pieces={pieces}
                    tab={rrssTab}
                    view={rrssView}
                    onTab={setRrssTab}
                    onView={setRrssView}
                    onOpen={setOpenId}
                    onApprove={approvePiece}
                    onApproveAll={approveAllPieces}
                  />
                ) : null}
                {!openedPiece && !openedItem && activeRoute === 'docs' && !docId ? (
                  <DocsBoard locale={locale} brand={brand} onOpen={setDocId} />
                ) : null}
                {!openedPiece && !openedItem && activeRoute === 'docs' && docId ? (
                  <DocReader
                    doc={docsFor(locale).find((doc) => doc.id === docId) || docsFor(locale)[0]}
                    locale={locale}
                    onBack={() => setDocId(null)}
                  />
                ) : null}
                {showHiLinks ? <HiLinksBoard locale={locale} onBack={() => go('inicio')} /> : null}
              </div>
            </div>
          </div>
          <PortalTour
            open={tourOn}
            step={tourStep}
            session={tourSession}
            locale={locale}
            frameRef={frameRef}
            onStep={setTourStep}
            onClose={() => {
              setTourOn(false);
              setOpenId(null);
              setRoute('inicio');
            }}
          />
        </div>
        <div className="hero-coach-wrap">
          <div className="hero-coach">
            <span className="coach-icon" aria-hidden="true">▶</span>
            <span className="coach-label">{coachLabel || (locale === 'en' ? 'Guided tour' : 'Tour Guiado')}</span>
            <span className="coach-desc">{coachText || (locale === 'en' ? 'Watch how a client approves, or click anywhere to explore.' : 'Observa cómo aprueba un cliente o haz clic en cualquier lugar para explorar.')}</span>
            <span className="coach-dots" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((index) => (
                <i key={index} className={tourOn ? (tourStep - 1 === index ? 'on' : '') : index === 0 ? 'on' : ''} />
              ))}
            </span>
            <button type="button" className="coach-replay-btn" onClick={startTour}>
              ↻ {copy.replay}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialViewer({
  piece,
  pieces,
  index,
  total,
  locale,
  copy,
  onBack,
  onOpen,
  onApprove,
  onComment,
}: {
  piece: Piece;
  pieces: Piece[];
  index: number;
  total: number;
  locale: 'es' | 'en';
  copy: (typeof COPY)['es'] | (typeof COPY)['en'];
  onBack: () => void;
  onOpen: (id: string) => void;
  onApprove: () => void;
  onComment: () => void;
}) {
  const [mode, setMode] = useState<'video' | 'cover'>('video');
  const [playing, setPlaying] = useState(false);
  const [history, setHistory] = useState(false);
  const signedOff = piece.status === 'programado' || piece.status === 'publicado';
  const commentCount = piece.note ? 1 : 0;

  useEffect(() => {
    setMode('video');
    setPlaying(false);
    setHistory(false);
  }, [piece.id]);

  return (
    <div className="rrss-view">
      <header className="rrss-view__bar">
        <button type="button" className="rrss-back" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M15 6 9 12l6 6" />
          </svg>
          <span>RRSS · {piece.month}</span>
        </button>
        <div className="rrss-view__tools">
          <button type="button" className={history ? 'rrss-pill is-on' : 'rrss-pill'} onClick={() => setHistory((open) => !open)}>
            {copy.history} · {piece.round}
          </button>
          <span className="rrss-pager">
            <button type="button" aria-label={locale === 'en' ? 'Previous piece' : 'Pieza anterior'} disabled={index <= 0} onClick={() => pieces[index - 1] && onOpen(pieces[index - 1].id)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M15 6 9 12l6 6" /></svg>
            </button>
            <span>{copy.pieceOf(index + 1, total)}</span>
            <button type="button" aria-label={locale === 'en' ? 'Next piece' : 'Pieza siguiente'} disabled={index >= total - 1} onClick={() => pieces[index + 1] && onOpen(pieces[index + 1].id)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            </button>
          </span>
        </div>
      </header>
      {history ? <p className="rrss-history">{copy.review} · R{piece.round} · {piece.date}</p> : null}
      <div className="rrss-view__body">
        <div className="rrss-stage">
          <div className="rrss-toggle" role="group" aria-label={copy.video}>
            <button type="button" className={mode === 'video' ? 'is-on' : ''} onClick={() => setMode('video')}>{copy.video}</button>
            <button type="button" className={mode === 'cover' ? 'is-on' : ''} onClick={() => { setMode('cover'); setPlaying(false); }}>{copy.cover}</button>
          </div>
          <div className={`rrss-phone is-${piece.fmt}`}>
            <div className="rrss-screen" />
            {mode === 'video' ? (
              <button type="button" className="rrss-play" aria-label={copy.video} onClick={() => setPlaying((value) => !value)}>
                {playing ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z" /></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l12-7z" /></svg>
                )}
              </button>
            ) : null}
            {piece.fmt === 'carrusel' ? (
              <span className="rrss-dots" aria-hidden="true"><i className="is-on" /><i /><i /></span>
            ) : null}
          </div>
          {mode === 'video' ? (
            <div className={playing ? 'rrss-scrub is-playing' : 'rrss-scrub'}>
              <i />
              <span>0:00</span>
              <span>0:43</span>
            </div>
          ) : null}
          <button type="button" className="rrss-download">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 4v11M7 11l5 5 5-5M5 20h14" /></svg>
            {copy.download}
          </button>
        </div>
        <aside className="rrss-side">
          <div className="rrss-badges">
            <span className="rrss-fmt">{fmtLabel(piece.fmt, locale)}</span>
            <span className={signedOff ? 'rrss-status is-ok' : 'rrss-status'}>
              {signedOff ? copy.approved : `${copy.pendingOne} · R${piece.round}`}
            </span>
          </div>
          <h2>{piece.title}</h2>
          <p className="rrss-date">{copy.published} · {piece.date}</p>
          <p className="rrss-kicker">{copy.copyLabel}</p>
          <div className="rrss-copy">
            <p>{piece.caption}</p>
            <p className="rrss-tags">{piece.tags}</p>
          </div>
          <p className="rrss-kicker">{copy.comments} · {commentCount}</p>
          {piece.note ? <p className="rrss-note">{piece.note}</p> : <p className="rrss-empty">{copy.noComments}</p>}
          <div className="rrss-actions">
            <button type="button" onClick={onComment}>{copy.comment}</button>
            <button type="button" className="is-primary" data-tour="approve" onClick={onApprove} disabled={piece.status !== 'pendiente'}>
              {signedOff ? copy.approved : copy.approve}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Detail({
  title,
  meta,
  status,
  note,
  back,
  approve,
  comment,
  onBack,
  onApprove,
  onComment,
}: {
  title: string;
  meta: string;
  status: string;
  note?: string;
  back: string;
  approve: string;
  comment: string;
  onBack: () => void;
  onApprove: () => void;
  onComment: () => void;
}) {
  return (
    <div className="detail">
      <button type="button" className="back" onClick={onBack}>{back}</button>
      <h2 className="h1">{title}</h2>
      <p className="muted">{meta}</p>
      <span className="badge">{status}</span>
      {note ? <p className="note">{note}</p> : null}
      <div className="detail-actions">
        <button type="button" onClick={onComment}>{comment}</button>
        <button type="button" className="is-primary" data-tour="approve" onClick={onApprove}>{approve}</button>
      </div>
    </div>
  );
}

