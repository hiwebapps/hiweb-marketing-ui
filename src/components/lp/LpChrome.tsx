import { useEffect, useRef } from 'react';
import { CalendarTool } from '../growth/CalendarTool';
import type { CalendarPageCopy } from '../../lib/content/calendar-page';
import type { LpPicker } from '../../lib/content/lp-types';
import type { SiteIdentity } from '../../lib/site-identity';

type LpChromeProps = {
  picker?: LpPicker;
  autoOpen?: boolean;
  calendar: CalendarPageCopy;
  site: SiteIdentity;
};

export function LpChrome({ picker, autoOpen = false, calendar, site }: LpChromeProps) {
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
        document.getElementById('lp-tab-message')?.click();
        document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      const dialog = target.closest('dialog');
      if (dialog && target === dialog) dialog.close();
    };
    document.addEventListener('click', onClick);
    const timer = autoOpen ? window.setTimeout(() => pickerRef.current?.showModal(), 350) : 0;
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('click', onClick);
    };
  }, [autoOpen]);

  return (
    <>
      <dialog ref={calendarRef} className="lp-dialog lp-dialog--calendar" aria-labelledby="lp-cal-title">
        <div className="max-h-[86vh] overflow-y-auto p-5 sm:p-8">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 id="lp-cal-title" className="font-display text-2xl font-semibold">Agenda tu diagnóstico</h2>
              <p className="mt-1 text-sm text-muted">Elige día y hora. La llamada es con el equipo que trabajaría tu cuenta.</p>
            </div>
            <button type="button" className="text-2xl leading-none" aria-label="Cerrar" onClick={() => calendarRef.current?.close()}>×</button>
          </div>
          <CalendarTool copy={calendar} site={site} embedded />
        </div>
      </dialog>

      {picker ? (
        <dialog ref={pickerRef} className="lp-dialog" aria-labelledby="lp-picker-title">
          <div className="max-h-[86vh] overflow-y-auto p-5 sm:p-8">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 id="lp-picker-title" className="font-display text-2xl font-semibold">{picker.title}</h2>
                <p className="mt-1 text-sm text-muted">{picker.subtitle}</p>
              </div>
              <button type="button" className="text-2xl leading-none" aria-label="Cerrar" onClick={() => pickerRef.current?.close()}>×</button>
            </div>
            <div className="grid gap-2">
              {picker.options.map((option) => (
                <a key={option.slug} href={option.href} className="rounded-2xl border border-border px-4 py-3 no-underline hover:border-ink">
                  <span className="block font-display text-base font-semibold text-ink">{option.title}</span>
                  <span className="mt-1 block text-sm text-muted">{option.description}</span>
                </a>
              ))}
              <a href={picker.allHref} className="mt-2 text-center font-display text-sm font-semibold text-ink underline">
                {picker.allLabel}
              </a>
            </div>
          </div>
        </dialog>
      ) : null}
    </>
  );
}
