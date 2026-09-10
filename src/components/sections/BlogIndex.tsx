import { useMemo, useState } from 'react';

export type BlogCard = {
  id: string;
  title: string;
  description: string;
  keyword: string;
  autor: string;
  fecha: string;
  featured: boolean;
  industria?: string;
  servicio?: string;
};

type Option = { slug: string; nombre: string };

type BlogIndexProps = {
  posts: BlogCard[];
  industries: Option[];
  services: Option[];
};

export function BlogIndex({ posts, industries, services }: BlogIndexProps) {
  const [q, setQ] = useState('');
  const [industria, setIndustria] = useState('');
  const [servicio, setServicio] = useState('');

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return posts.filter((post) => {
      const textOk =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.keyword.toLowerCase().includes(query);
      const industryOk = !industria || post.industria === industria;
      const serviceOk = !servicio || post.servicio === servicio;
      return textOk && industryOk && serviceOk;
    });
  }, [posts, q, industria, servicio]);

  const featured = filtered.filter((post) => post.featured);

  return (
    <>
      <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
            Buscar
          </span>
          <input
            type="search"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Intención, industria, servicio…"
            className="rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-ink"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
            Industria
          </span>
          <select
            value={industria}
            onChange={(event) => setIndustria(event.target.value)}
            className="rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm"
          >
            <option value="">Todas</option>
            {industries.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
            Servicio
          </span>
          <select
            value={servicio}
            onChange={(event) => setServicio(event.target.value)}
            className="rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm"
          >
            <option value="">Todos</option>
            {services.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      {featured.length ? (
        <div className="mt-12">
          <p className="font-display text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
            Destacados
          </p>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {featured.map((post) => (
              <li key={`feat-${post.id}`}>
                <a
                  href={`/blog/${post.id}`}
                  className="block rounded-2xl border border-border bg-surface p-6 no-underline"
                >
                  <p className="font-display text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
                    {post.keyword}
                  </p>
                  <h2 className="mt-3 font-display text-2xl font-semibold text-ink">{post.title}</h2>
                  <p className="mt-2 !text-sm">{post.description}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <ul className="mt-12 divide-y divide-border border-y border-border">
        {filtered.map((post) => (
          <li key={post.id} className="py-5">
            <a href={`/blog/${post.id}`} className="no-underline">
              <p className="font-display text-lg font-semibold text-ink">{post.title}</p>
              <p className="mt-1 !text-sm">{post.description}</p>
              <p className="mt-2 !text-xs text-muted">
                {post.autor} · {post.fecha}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
