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

function unused<T extends Element>(selector: string) {
  return Array.from(
    document.querySelectorAll<T>(`${selector}:not([data-motion]):not([data-motion-pending])`),
  );
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

function scanMotion() {
  bindSplits();
  bindReveals();
  bindCounters();
  bindExtras();
  ScrollTrigger.refresh();
}

let observerBound = false;

function observeLateIslands() {
  if (observerBound) return;
  observerBound = true;

  let scheduled = 0;
  const schedule = () => {
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
}

export function initMotion() {
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
  ScrollTrigger.refresh();
});
