import { useEffect, useState } from 'react';
import type { PostHeading } from '../../lib/blog';
import './BlogPost.css';

type BlogPostTocProps = {
  headings: PostHeading[];
};

/**
 * Sticky left TOC — highlights the section in view.
 */
export function BlogPostToc({ headings }: BlogPostTocProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? '');

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

    const observed = headings
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (!observed.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0]?.target;
        if (top?.id) setActiveId(top.id);
      },
      {
        rootMargin: '-18% 0px -62% 0px',
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    observed.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav className="blog-post__toc" aria-label="Contenido del artículo">
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
