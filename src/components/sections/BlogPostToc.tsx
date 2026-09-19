import { useEffect, useRef, useState } from 'react';
import type { PostHeading } from '../../lib/blog';
import './BlogPost.css';

type BlogPostTocProps = {
  headings: PostHeading[];
};

function getTocScroller(nav: HTMLElement): HTMLElement {
  if (nav.scrollHeight - nav.clientHeight > 2) return nav;
  const wrap = nav.closest<HTMLElement>('.blog-post__toc-wrap');
  if (wrap && wrap.scrollHeight - wrap.clientHeight > 2) return wrap;
  return nav;
}

function scrollTocToActive(container: HTMLElement, active: HTMLElement) {
  const containerRect = container.getBoundingClientRect();
  const itemRect = active.getBoundingClientRect();
  const zoneTop = containerRect.top + containerRect.height * 0.22;
  const zoneBottom = containerRect.bottom - containerRect.height * 0.22;

  if (itemRect.top >= zoneTop && itemRect.bottom <= zoneBottom) return;

  const delta =
    itemRect.top + itemRect.height / 2 - (containerRect.top + containerRect.height / 2);
  if (Math.abs(delta) < 2) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  container.scrollBy({ top: delta, behavior: reduced ? 'auto' : 'smooth' });
}

/**
 * Sticky left TOC — highlights the section in view and follows page scroll.
 */
export function BlogPostToc({ headings }: BlogPostTocProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? '');
  const tocRef = useRef<HTMLElement>(null);
  const activeIdRef = useRef(activeId);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    if (!headings.length) return;

    const body = document.querySelector('[data-blog-body]');
    if (body) {
      const nodes = body.querySelectorAll('h2, h3');
      nodes.forEach((node, index) => {
        const heading = headings[index];
        if (heading) node.id = heading.id;
      });
    }

    let frame = 0;
    const followActive = (id: string) => {
      const nav = tocRef.current;
      if (!nav || !id) return;
      const item = nav.querySelector<HTMLElement>(`a[href="#${CSS.escape(id)}"]`)?.closest('li');
      if (!item) return;
      scrollTocToActive(getTocScroller(nav), item);
    };

    const syncActive = () => {
      const marker = window.innerHeight * 0.28;
      let current = headings[0]?.id ?? '';
      for (const heading of headings) {
        const node = document.getElementById(heading.id);
        if (!node) continue;
        if (node.getBoundingClientRect().top - marker <= 0) current = heading.id;
      }

      if (current === activeIdRef.current) return;
      activeIdRef.current = current;
      setActiveId(current);
      followActive(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        syncActive();
      });
    };

    syncActive();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav ref={tocRef} className="blog-post__toc" aria-label="Contenido del artículo">
      <p className="blog-post__toc-title">Contenido</p>
      <ol className="blog-post__toc-list">
        {headings.map((item) => (
          <li
            key={item.id}
            className={[
              'blog-post__toc-item',
              item.depth === 3 ? 'blog-post__toc-item--sub' : '',
              activeId === item.id ? 'is-active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <a href={`#${item.id}`}>{item.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
