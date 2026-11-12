import { useEffect, useRef } from 'react';
import { LP_PICKER_ICONS } from '../../data/lp/picker-icons';
import { withAttribution } from '../../lib/attribution';
import { CalendarTool } from '../growth/CalendarTool';
import { NavIcon } from '../sections/NavIcon';
import type { CalendarPageCopy } from '../../lib/content/calendar-page';
import type { LpCalendarCopy, LpPicker } from '../../lib/content/lp-types';
import type { SiteIdentity } from '../../lib/site-identity';

type LpChromeProps = {
  picker?: LpPicker;
  autoOpen?: boolean;
  calendarCopy: LpCalendarCopy;
  calendar: CalendarPageCopy;
  site: SiteIdentity;
};

export function LpChrome({ picker, autoOpen = false, calendarCopy, calendar, site }: LpChromeProps) {
  const calendarRef = useRef<HTMLDialogElement>(null);
  const pickerRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest('[data-cal]')) {
        event.preventDefault();
        calendarRef.current?.showModal();
      }
      if (target.closest('[data-open-picker]')) {
        event.preventDefault();
        pickerRef.current?.showModal();
      }
      const bundle = target.closest('[data-bundle]');
      if (bundle) {
        event.preventDefault();
        const slugs = (bundle.getAttribute('data-bundle') ?? '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
        window.dispatchEvent(new CustomEvent('lp-set-interests', { detail: slugs }));
        document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      const dialog = target.closest('dialog');
      if (dialog && target === dialog) dialog.close();
    };
    // Runs before the browser follows the link, including Ctrl+click and middle click.
    const carryAttribution = (event: Event) => {
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const next = withAttribution(anchor.href);
      if (next !== anchor.href) anchor.href = next;
    };
    document.addEventListener('pointerdown', carryAttribution, true);
    document.addEventListener('click', carryAttribution, true);
    document.addEventListener('click', onClick);
    const timer = autoOpen ? window.setTimeout(() => pickerRef.current?.showModal(), 350) : 0;
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('pointerdown', carryAttribution, true);
      document.removeEventListener('click', carryAttribution, true);
      document.removeEventListener('click', onClick);
    };
  }, [autoOpen]);

  return (
    <>
      <dialog ref={calendarRef} className="lp-dialog lp-dialog--calendar" aria-labelledby="lp-cal-title">
        <div className="max-h-[86vh] overflow-y-auto p-5 sm:p-8">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 id="lp-cal-title" className="font-display text-2xl font-medium tracking-[-0.03em]">{calendarCopy.title}</h2>
              <p className="mt-1 text-sm text-muted">{calendarCopy.description}</p>
            </div>
            <button type="button" className="text-2xl leading-none" aria-label="Cerrar" onClick={() => calendarRef.current?.close()}>×</button>
          </div>
          <CalendarTool copy={calendar} site={site} embedded successHref="/gracias?origen=agenda" />
        </div>
      </dialog>

      {picker ? (
        <dialog ref={pickerRef} className="lp-dialog lp-dialog--picker" aria-labelledby="lp-picker-title">
          <div className="lp-picker-dialog">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 id="lp-picker-title" className="font-display text-2xl font-medium tracking-[-0.03em]">{picker.title}</h2>
                <p className="mt-1 text-sm text-muted">{picker.subtitle}</p>
              </div>
              <button type="button" className="text-2xl leading-none" aria-label="Cerrar" onClick={() => pickerRef.current?.close()}>×</button>
            </div>
            <div className="lp-picker-grid">
              {picker.options.map((option) => (
                <a key={option.slug} href={option.href} className="lp-picker-card">
                  <span className="lp-picker-card__icon" aria-hidden="true">
                    <NavIcon name={option.icon || LP_PICKER_ICONS[option.slug] || 'grid'} />
                  </span>
                  <span className="lp-picker-card__title">{option.title}</span>
                  <span className="lp-picker-card__text">{option.description}</span>
                </a>
              ))}
            </div>
            <a href={picker.allHref} className="lp-picker-all">
              {picker.allLabel}
            </a>
          </div>
        </dialog>
      ) : null}
    </>
  );
}
