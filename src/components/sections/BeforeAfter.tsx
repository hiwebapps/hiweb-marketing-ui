import { useEffect, useRef, useState } from 'react';
import type { BadgeVariant } from '../ui';
import { SectionBand } from './primitives/SectionBand';
import { SectionHeader } from './primitives/SectionHeader';
import './BeforeAfter.css';

export type BeforeAfterPair = {
  title?: string;
  beforeLabel: string;
  afterLabel: string;
  beforeImage?: string;
  beforeVideo?: string;
  afterImage?: string;
  afterVideo?: string;
};

type BeforeAfterProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  badgeVariant?: BadgeVariant;
  headingWidth?: string;
  pairs: BeforeAfterPair[];
  tone?: 'canvas' | 'surface' | 'ink';
};

function Media({
  image,
  video,
  label,
}: {
  image?: string;
  video?: string;
  label: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      if (motion.matches) node.pause();
    };
    sync();
    motion.addEventListener('change', sync);
    return () => motion.removeEventListener('change', sync);
  }, [video]);
  if (video) {
    return (
      <video
        ref={videoRef}
        className="compare__media"
        src={video}
        poster={image}
        muted
        loop
        playsInline
        autoPlay
        aria-label={label}
      />
    );
  }
  if (image) {
    return <img className="compare__media" src={image} alt={label} />;
  }
  return <span className="compare__empty">{label}</span>;
}

function CompareCard({ pair }: { pair: BeforeAfterPair }) {
  const [position, setPosition] = useState(50);
  const before = pair.beforeLabel || 'Antes';
  const after = pair.afterLabel || 'Después';

  return (
    <article className="compare">
      {pair.title ? <h3 className="compare__title">{pair.title}</h3> : null}
      <div className="compare__stage">
        <div className="compare__after">
          <Media image={pair.afterImage} video={pair.afterVideo} label={after} />
        </div>
        <div className="compare__before" style={{ width: `${position}%` }}>
          <Media image={pair.beforeImage} video={pair.beforeVideo} label={before} />
        </div>
        <span className="compare__tag compare__tag--before">{before}</span>
        <span className="compare__tag compare__tag--after">{after}</span>
        <input
          className="compare__range"
          type="range"
          min={0}
          max={100}
          value={position}
          aria-valuetext={`${before} ${position}%, ${after} ${100 - position}%`}
          aria-label={`${before} / ${after}`}
          onChange={(event) => setPosition(Number(event.target.value))}
        />
        <span className="compare__handle" style={{ left: `${position}%` }} aria-hidden="true" />
      </div>
    </article>
  );
}

export function BeforeAfter({
  eyebrow,
  title = 'Antes y después',
  description,
  badgeVariant = 'orange',
  headingWidth,
  pairs,
  tone = 'canvas',
}: BeforeAfterProps) {
  if (!pairs.length) return null;
  return (
    <SectionBand tone={tone}>
      <div className="compare-band">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          badgeVariant={badgeVariant}
          headingWidth={headingWidth}
        />
        <div className="compare-band__grid">
          {pairs.map((pair, index) => (
            <CompareCard key={`${pair.title ?? pair.beforeLabel}-${index}`} pair={pair} />
          ))}
        </div>
      </div>
    </SectionBand>
  );
}
