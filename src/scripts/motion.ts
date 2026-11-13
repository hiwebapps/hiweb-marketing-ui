import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { MOTION } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger, SplitText);

declare global {
  interface Window {
    __HIWEB_MOTION__?: boolean;
  }
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Astro drops `ssr` and fires `astro:hydrate` as soon as the React renderer
 * returns, but React 19 hydrates inside startTransition, so the island can
 * still hold the server HTML for a while. Splitting a title in that window
 * makes React throw #418 (hydration mismatch) and re-render the island.
 * The fiber key React attaches to the root element is the real signal.
 */
function islandStillHydrating(el: Element): boolean {
  const island = el.closest('astro-island');
  if (!island) return false;
  if (island.hasAttribute('ssr')) return true;
  const root = island.firstElementChild;
  return !!root && !Object.keys(root).some((key) => key.startsWith('__reactFiber'));
}

/**
 * Targets skipped in the last scan because Astro already fired `astro:hydrate`
 * but React has not committed yet. Islands still marked `ssr` (for example a
 * `client:visible` one below the fold) are not counted: their own
 * `astro:hydrate` schedules a new scan when they load.
 */
let deferredTargets = 0;

function unused<T extends Element>(selector: string) {
  return Array.from(
    document.querySelectorAll<T>(`${selector}:not([data-motion]):not([data-motion-pending])`),
  ).filter((el) => {
    if (!islandStillHydrating(el)) return true;
    if (!el.closest('astro-island[ssr]')) deferredTargets += 1;
    return false;
  });
}

function mark(el: HTMLElement, kind: string) {
  delete el.dataset.motionPending;
  el.dataset.motion = kind;
}

function bindSplits() {
  const targets = unused<HTMLElement>('[data-split]');
  if (!targets.length) return;

  const run = (els: HTMLElement[]) => {
    els.forEach((el) => {
      if (el.dataset.motion || el.dataset.motionPending != null) return;
      el.dataset.motionPending = '1';

      SplitText.create(el, {
        type: 'lines',
        autoSplit: true,
        aria: 'auto',
        onSplit(self) {
          gsap.set(self.lines, { y: 28, opacity: 0 });
          mark(el, 'split');
          return gsap.to(self.lines, {
            y: 0,
            opacity: 1,
            duration: MOTION.duration,
            ease: MOTION.ease,
            stagger: 0.07,
            overwrite: 'auto',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            },
          });
        },
      });
    });
  };

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => run(targets)).catch(() => run(targets));
  } else {
    run(targets);
  }
}

function bindReveals() {
  const fresh = unused<HTMLElement>('[data-reveal]');
  if (!fresh.length) return;
  fresh.forEach((el) => mark(el, 'reveal'));
  gsap.set(fresh, { opacity: 0, y: MOTION.revealY });

  ScrollTrigger.batch(fresh, {
    start: 'top 85%',
    once: true,
    interval: 0.12,
    batchMax: 6,
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: MOTION.duration,
        ease: MOTION.ease,
        stagger: MOTION.stagger,
        overwrite: true,
      });
    },
  });
}

let extrasBound = false;

function bindExtras() {
  if (extrasBound) return;
  extrasBound = true;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px)', () => {
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      const amount = Number.parseFloat(el.dataset.parallax || '0.2');
      gsap.to(el, {
        yPercent: amount * 40,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  });
}

function bindCounters() {
  unused<HTMLElement>('[data-counter]').forEach((el) => {
    mark(el, 'counter');
    const target = Number.parseFloat(el.dataset.counter || '0');
    const prefix = el.dataset.counterPrefix ?? '';
    const suffix = el.dataset.counterSuffix ?? '';
    const decimals = Number.parseInt(el.dataset.counterDecimals || '0', 10);
    const obj = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: MOTION.durationSlow,
          ease: MOTION.ease,
          onUpdate: () => {
            el.textContent = `${prefix}${obj.val.toFixed(decimals)}${suffix}`;
          },
        });
      },
    });
  });
}

const RETRY_MS = 100;
/** About 10 s. Past that, the island is not going to hydrate; show its text. */
const MAX_RETRIES = 100;
let retries = 0;
let retryTimer = 0;

/** The CSS hides `[data-split]`/`[data-reveal]` until `data-motion` is set. */
function showStuckTargets() {
  document
    .querySelectorAll<HTMLElement>('[data-split]:not([data-motion]), [data-reveal]:not([data-motion])')
    .forEach((el) => {
      if (islandStillHydrating(el) && !el.closest('astro-island[ssr]')) mark(el, 'static');
    });
}

function scanMotion() {
  deferredTargets = 0;
  const before = document.querySelectorAll('[data-motion], [data-motion-pending]').length;
  bindSplits();
  bindReveals();
  bindCounters();
  bindExtras();
  if (document.querySelectorAll('[data-motion], [data-motion-pending]').length !== before) {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }

  window.clearTimeout(retryTimer);
  if (deferredTargets === 0) return;
  if (retries >= MAX_RETRIES) {
    showStuckTargets();
    return;
  }
  retries += 1;
  retryTimer = window.setTimeout(scanMotion, RETRY_MS);
}

let observerBound = false;

function observeLateIslands() {
  if (observerBound) return;
  observerBound = true;

  let scheduled = 0;
  const schedule = () => {
    retries = 0;
    window.clearTimeout(scheduled);
    scheduled = window.setTimeout(() => {
      scanMotion();
    }, 80);
  };

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== 'childList' || mutation.addedNodes.length === 0) continue;
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (
          node.matches?.('[data-split], [data-reveal], [data-counter]') ||
          node.querySelector?.('[data-split]:not([data-motion]), [data-reveal]:not([data-motion]), [data-counter]:not([data-motion])')
        ) {
          schedule();
          return;
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener('astro:hydrate', schedule, true);
}

export function initMotion() {
  if (window.__HIWEB_MOTION__) return;
  window.__HIWEB_MOTION__ = true;

  if (prefersReducedMotion()) {
    document.documentElement.classList.remove('motion-ready');
    return;
  }

  document.documentElement.classList.add('motion-ready');
  scanMotion();
  observeLateIslands();
}

function boot() {
  try {
    initMotion();
  } catch {
    document.documentElement.classList.remove('motion-ready');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}

window.addEventListener('load', () => {
  boot();
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
});
