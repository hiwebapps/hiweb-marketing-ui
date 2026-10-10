import { useMemo, useState } from 'react';

type Locale = 'es' | 'en';
type Tab = 'perfil' | 'links' | 'diseno' | 'clics';
type Chip = 'all' | 'social';

type LinkItem = {
  id: string;
  kind: 'social' | 'web';
  network: string;
  handle: string;
  clicks: number;
  on: boolean;
};

const COPY = {
  es: {
    back: 'Pendientes',
    title: 'Tu link en bio',
    published: 'Publicado',
    draft: 'Borrador',
    available: 'Disponible',
    unavailable: 'No disponible',
    copy: 'Copiar URL',
    copied: 'Copiado',
    save: 'Guardar',
    saved: 'Guardado',
    profile: 'Perfil',
    links: 'Links',
    design: 'Diseño',
    clicks: 'Clics',
    name: 'Nombre',
    initials: 'Iniciales',
    bio: 'Bio',
    avatarBg: 'Fondo del avatar',
    photo: 'Foto',
    changePhoto: 'Cambiar foto',
    avatarText: 'Texto del avatar',
    shape: 'Forma del avatar',
    circle: 'Círculo',
    rounded: 'Redondeado',
    square: 'Cuadrado',
    preview: 'Vista previa en vivo',
    all: 'Todos',
    social: 'Redes',
    pageBg: 'Fondo de la página',
    total: 'Clics en total',
    empty: 'Nada publicado. Activa el interruptor para mostrar la bio.',
  },
  en: {
    back: 'Pending',
    title: 'Your link in bio',
    published: 'Published',
    draft: 'Draft',
    available: 'Available',
    unavailable: 'Unavailable',
    copy: 'Copy URL',
    copied: 'Copied',
    save: 'Save',
    saved: 'Saved',
    profile: 'Profile',
    links: 'Links',
    design: 'Design',
    clicks: 'Clicks',
    name: 'Name',
    initials: 'Initials',
    bio: 'Bio',
    avatarBg: 'Avatar background',
    photo: 'Photo',
    changePhoto: 'Change photo',
    avatarText: 'Avatar text',
    shape: 'Avatar shape',
    circle: 'Circle',
    rounded: 'Rounded',
    square: 'Square',
    preview: 'Live preview',
    all: 'All',
    social: 'Social',
    pageBg: 'Page background',
    total: 'Total clicks',
    empty: 'Nothing is published. Turn the switch on to show the bio.',
  },
} as const;

const LINKS: Record<Locale, LinkItem[]> = {
  es: [
    { id: 'ig', kind: 'social', network: 'Instagram', handle: 'auracafemx', clicks: 128, on: true },
    { id: 'fb', kind: 'social', network: 'Facebook', handle: 'Aura Café', clicks: 46, on: true },
    { id: 'shop', kind: 'web', network: 'Tienda', handle: 'Café recién tostado', clicks: 89, on: true },
    { id: 'cup', kind: 'web', network: 'Reservar', handle: 'Cata sensorial', clicks: 37, on: true },
  ],
  en: [
    { id: 'ig', kind: 'social', network: 'Instagram', handle: 'auracafemx', clicks: 128, on: true },
    { id: 'fb', kind: 'social', network: 'Facebook', handle: 'Aura Café', clicks: 46, on: true },
    { id: 'shop', kind: 'web', network: 'Shop', handle: 'Freshly roasted coffee', clicks: 89, on: true },
    { id: 'cup', kind: 'web', network: 'Book', handle: 'Guided cupping', clicks: 37, on: true },
  ],
};

const BACKGROUNDS = ['#5b4bdb', '#e85d4c', '#f0a202', '#2ec4b6', '#111111'];
const INKS = ['#ffffff', '#111111'];
const PAGES = ['#ffffff', '#f6f1e7', '#16161c'];

function wrap(text: string, size: number) {
  const lines: string[] = [];
  let line = '';
  text.split(' ').forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (line && next.length > size) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function PhonePreview({
  name,
  initials,
  bio,
  avatarBg,
  avatarFg,
  radius,
  pageBg,
  mark,
  links,
  empty,
}: {
  name: string;
  initials: string;
  bio: string;
  avatarBg: string;
  avatarFg: string;
  radius: number;
  pageBg: string;
  mark: 'letters' | 'mark';
  links: LinkItem[];
  empty?: string;
}) {
  const ink = pageBg === '#16161c' ? '#f4f4f5' : '#111111';
  const muted = pageBg === '#16161c' ? '#a1a1aa' : '#5c5c66';
  const card = pageBg === '#16161c' ? '#22222a' : '#ffffff';
  const lines = wrap(bio, 32);
  const rx = 6 + (radius / 100) * 26;
  const top = 168 + lines.length * 16;

  return (
    <svg className="hl-svg" viewBox="0 0 280 540" role="img" aria-label={name}>
      <rect width="280" height="540" rx="32" fill="#0c0c0e" />
      <rect x="10" y="10" width="260" height="520" rx="26" fill={pageBg} />
      <rect x="118" y="22" width="44" height="6" rx="3" fill="#d0d0d4" />
      {radius > 82 ? (
        <circle cx="140" cy="78" r="30" fill={avatarBg} />
      ) : (
        <rect x="110" y="48" width="60" height="60" rx={rx} fill={avatarBg} />
      )}
      {mark === 'letters' ? (
        <text x="140" y="84" textAnchor="middle" fill={avatarFg} fontSize="16" fontWeight="700">{initials.slice(0, 3) || 'AC'}</text>
      ) : (
        <path d="M140 62l12 14-12 18-12-18z" fill={avatarFg} />
      )}
      <text x="140" y="128" textAnchor="middle" fill={ink} fontSize="15" fontWeight="700">{name.slice(0, 22)}</text>
      {lines.map((line, index) => (
        <text key={line} x="140" y={148 + index * 15} textAnchor="middle" fill={muted} fontSize="11">{line}</text>
      ))}
      {empty ? wrap(empty, 26).map((line, index) => (
        <text key={line} x="140" y={210 + index * 16} textAnchor="middle" fill={muted} fontSize="12">{line}</text>
      )) : links.map((link, index) => {
        const y = top + index * 52;
        return (
          <g key={link.id}>
            <rect x="24" y={y} width="232" height="44" rx="12" fill={card} stroke={pageBg === '#16161c' ? '#333' : '#ececf0'} />
            <text x="40" y={y + 18} fill={muted} fontSize="9">{link.network}</text>
            <text x="40" y={y + 34} fill={ink} fontSize="13" fontWeight="600">{link.handle.slice(0, 24)}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function HiLinksBoard({ locale, onBack }: { locale: Locale; onBack: () => void }) {
  const copy = COPY[locale];
  const [tab, setTab] = useState<Tab>('perfil');
  const [published, setPublished] = useState(true);
  const [name, setName] = useState('Aura Café');
  const [initials, setInitials] = useState('AC');
  const [bio, setBio] = useState(locale === 'en'
    ? 'Specialty coffee. Brew bar, catalog, and cuppings.'
    : 'Café de especialidad. Barra de tueste, catálogo y catas.');
  const [avatarBg, setAvatarBg] = useState(BACKGROUNDS[0]);
  const [avatarFg, setAvatarFg] = useState('#ffffff');
  const [radius, setRadius] = useState(100);
  const [mark, setMark] = useState<'letters' | 'mark'>('letters');
  const [pageBg, setPageBg] = useState(PAGES[0]);
  const [links, setLinks] = useState<LinkItem[]>(() => LINKS[locale].map((item) => ({ ...item })));
  const [chip, setChip] = useState<Chip>('all');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const url = 'hiweb.mx/auracafe';
  const active = links.filter((link) => link.on);
  const shown = active.filter((link) => chip === 'all' || link.kind === 'social');
  const totalClicks = useMemo(() => links.reduce((sum, link) => sum + link.clicks, 0), [links]);
  const shape = radius > 82 ? copy.circle : radius < 28 ? copy.square : copy.rounded;

  const flash = (set: (value: boolean) => void) => {
    set(true);
    window.setTimeout(() => set(false), 1400);
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(`https://${url}`);
    } catch {
      /* The button still confirms the copy in this demo. */
    }
    flash(setCopied);
  };

  return (
    <div className="hl">
      <button type="button" className="web-back" onClick={onBack}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M15 6 9 12l6 6" /></svg>
        {copy.back}
      </button>
      <div className="hl-top">
        <div>
          <div className="hl-badges">
            <span className="hl-badge is-lime">HiLinks</span>
            <span className={published ? 'hl-badge is-ok' : 'hl-badge'}>{published ? copy.published : copy.draft}</span>
            <span className="hl-client">Aura Café</span>
          </div>
          <h2>{copy.title}</h2>
        </div>
        <div className="hl-url">
          <span>{url}</span>
          <small>{published ? copy.available : copy.unavailable}</small>
          <button type="button" onClick={copyUrl}>{copied ? copy.copied : copy.copy}</button>
          <button type="button" className="is-save" onClick={() => flash(setSaved)}>{saved ? copy.saved : copy.save}</button>
        </div>
      </div>
      <div className="hl-body">
        <section className="hl-card">
          <div className="hl-tabs">
            <button type="button" className={tab === 'perfil' ? 'is-on' : ''} onClick={() => setTab('perfil')}>{copy.profile}</button>
            <button type="button" className={tab === 'links' ? 'is-on' : ''} onClick={() => setTab('links')}>{copy.links} · {active.length}</button>
            <button type="button" className={tab === 'diseno' ? 'is-on' : ''} onClick={() => setTab('diseno')}>{copy.design}</button>
            <button type="button" className={tab === 'clics' ? 'is-on' : ''} onClick={() => setTab('clics')}>{copy.clicks}</button>
          </div>
          {tab === 'perfil' ? (
            <div className="hl-form">
              <label className="hl-switch">
                <input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} />
                <i />
                <span>
                  <strong>{copy.published}</strong>
                  <small>https://{url}</small>
                </span>
              </label>
              <div className="hl-grid">
                <label>{copy.name}<input value={name} onChange={(event) => setName(event.target.value)} /></label>
                <label>{copy.initials}<input value={initials} maxLength={3} onChange={(event) => setInitials(event.target.value.toUpperCase())} /></label>
              </div>
              <label>{copy.bio}<textarea rows={3} value={bio} onChange={(event) => setBio(event.target.value)} /></label>
              <p className="hl-label">{copy.avatarBg}</p>
              <div className="hl-swatches">
                {BACKGROUNDS.map((color) => (
                  <button key={color} type="button" className={avatarBg === color ? 'is-on' : ''} style={{ background: color }} aria-label={color} onClick={() => setAvatarBg(color)} />
                ))}
                <span>{avatarBg}</span>
              </div>
              <div className="hl-photo">
                <span className="hl-avatar" style={{ background: avatarBg, color: avatarFg, borderRadius: `${radius}%` }}>
                  {mark === 'letters' ? initials.slice(0, 3) || 'AC' : (
                    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l5 6-5 12L7 9z" fill="currentColor" /></svg>
                  )}
                </span>
                <div>
                  <p className="hl-label">{copy.photo}</p>
                  <button type="button" className="hl-ghost" onClick={() => setMark((current) => (current === 'letters' ? 'mark' : 'letters'))}>{copy.changePhoto}</button>
                </div>
                <div>
                  <p className="hl-label">{copy.avatarText}</p>
                  <div className="hl-swatches">
                    {INKS.map((color) => (
                      <button key={color} type="button" className={avatarFg === color ? 'is-on' : ''} style={{ background: color }} aria-label={color} onClick={() => setAvatarFg(color)} />
                    ))}
                    <span>{avatarFg}</span>
                  </div>
                </div>
              </div>
              <label className="hl-range">{copy.shape} · {shape}
                <input type="range" min={0} max={100} value={radius} onChange={(event) => setRadius(Number(event.target.value))} />
              </label>
            </div>
          ) : null}
          {tab === 'links' ? (
            <ul className="hl-links">
              {links.map((link) => (
                <li key={link.id}>
                  <span>
                    <strong>{link.network}</strong>
                    <small>{link.handle}</small>
                  </span>
                  <label className="hl-switch">
                    <input
                      type="checkbox"
                      checked={link.on}
                      onChange={(event) => setLinks((current) => current.map((item) => (item.id === link.id ? { ...item, on: event.target.checked } : item)))}
                    />
                    <i />
                  </label>
                </li>
              ))}
            </ul>
          ) : null}
          {tab === 'diseno' ? (
            <div className="hl-form">
              <p className="hl-label">{copy.pageBg}</p>
              <div className="hl-swatches">
                {PAGES.map((color) => (
                  <button key={color} type="button" className={pageBg === color ? 'is-on' : ''} style={{ background: color }} aria-label={color} onClick={() => setPageBg(color)} />
                ))}
                <span>{pageBg}</span>
              </div>
            </div>
          ) : null}
          {tab === 'clics' ? (
            <div className="hl-clicks">
              <p>{copy.total}<strong>{totalClicks}</strong></p>
              <svg className="hl-bars" viewBox="0 0 320 140" role="img" aria-label={copy.clicks}>
                {links.map((link, index) => {
                  const height = Math.max(8, (link.clicks / 128) * 100);
                  return (
                    <g key={link.id}>
                      <rect x={24 + index * 74} y={120 - height} width="40" height={height} rx="6" fill="#dbe64c" />
                      <text x={44 + index * 74} y="136" textAnchor="middle" fill="#a1a1aa" fontSize="10">{link.clicks}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          ) : null}
        </section>
        <aside className="hl-preview">
          <p>{copy.preview}</p>
          <div className="hl-chips">
            <button type="button" className={chip === 'all' ? 'is-on' : ''} onClick={() => setChip('all')}>{copy.all}</button>
            <button type="button" className={chip === 'social' ? 'is-on' : ''} onClick={() => setChip('social')}>{copy.social}</button>
          </div>
          <PhonePreview
            name={name || 'Aura'}
            initials={initials}
            bio={bio}
            avatarBg={avatarBg}
            avatarFg={avatarFg}
            radius={radius}
            pageBg={pageBg}
            mark={mark}
            links={published ? shown : []}
            empty={published ? undefined : copy.empty}
          />
        </aside>
      </div>
    </div>
  );
}
