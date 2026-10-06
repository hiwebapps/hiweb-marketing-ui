import { useEffect, useMemo, useState, type FormEvent } from 'react';
import type { SiteIdentity } from '../../lib/site-identity';
import {
  canNavigateMonth,
  formatMonthYear,
  formatScheduleSummary,
  formatTime12h,
  getMonthCells,
  serviceRequiresWebsite,
} from '../../lib/growth/calendar/calendar-rules';
import { bookAppointment, cancelAppointment, fetchAvailability } from '../../lib/growth/calendar/client';
import type { CalendarPageCopy } from '../../lib/content/calendar-page';
import type { BookingRecord, TimeSlot } from '../../lib/growth/calendar/types';
import { ContactBanner } from '../sections/ContactBanner';
import { Button } from '../ui/Button';
import { TextField } from '../ui/TextField';
import '../sections/ContactForm.css';
import './CalendarTool.css';

const today = new Date();

type CalendarToolProps = {
  copy: CalendarPageCopy;
  site: SiteIdentity;
};

export function CalendarTool({ copy, site }: CalendarToolProps) {
  const services = copy.services;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsError, setSlotsError] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [cancelled, setCancelled] = useState(false);

  const cells = useMemo(() => getMonthCells(year, month), [year, month]);
  const selected = services.filter((item) => selectedIds.includes(item.id));
  const needsWebsite = selected.some(serviceRequiresWebsite);

  useEffect(() => {
    if (!date) return;
    let cancelledRequest = false;
    setLoadingSlots(true);
    setSlotsError('');
    setTime('');
    fetchAvailability(date)
      .then((response) => {
        if (!cancelledRequest) setSlots(response.slots);
      })
      .catch((loadError) => {
        if (!cancelledRequest) {
          setSlots([]);
          setSlotsError(
            loadError instanceof Error
              ? loadError.message
              : copy.locale === 'en'
                ? 'We could not load the times.'
                : 'No pudimos cargar los horarios.',
          );
        }
      })
      .finally(() => {
        if (!cancelledRequest) setLoadingSlots(false);
      });
    return () => {
      cancelledRequest = true;
    };
  }, [date]);

  function shiftMonth(direction: -1 | 1) {
    if (!canNavigateMonth(year, month, direction)) return;
    const next = new Date(year, month + direction, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  }

  function toggleService(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
    setError('');
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (selected.length === 0) {
      setError(copy.servicesError);
      return;
    }
    setPending(true);
    setError('');
    try {
      const response = await bookAppointment({
        name,
        email,
        phone,
        company: company || undefined,
        website: needsWebsite ? website : undefined,
        service: selected.map((item) => item.label).join(', '),
        services: selected.map((item) => item.id),
        selectedDate: date,
        selectedTime: time,
        locale: copy.locale,
      });
      setBooking(response.booking);
    } catch (bookError) {
      setError(
        bookError instanceof Error
          ? bookError.message
          : copy.locale === 'en'
            ? 'We could not book that time.'
            : 'No pudimos reservar ese horario.',
      );
    } finally {
      setPending(false);
    }
  }

  async function cancel() {
    if (!booking) return;
    setPending(true);
    setError('');
    try {
      await cancelAppointment(booking.id);
      setCancelled(true);
    } catch (cancelError) {
      setError(
        cancelError instanceof Error
          ? cancelError.message
          : copy.locale === 'en'
            ? 'We could not cancel the appointment.'
            : 'No pudimos cancelar la cita.',
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="contact-page calendar-page">
      <div className="contact-page__inner">
        <ContactBanner title={copy.bannerTitle} subtitle={copy.bannerSubtitle} site={site} />

        {booking ? (
          <div className="calendar-done">
            <p className="font-display text-xs font-medium tracking-[0.14em] text-muted uppercase">
              {cancelled ? copy.cancelledLabel : copy.confirmedLabel}
            </p>
            <h2 className="text-3xl">{booking.service}</h2>
            <p className="mt-3 text-lg">{formatScheduleSummary(booking.selectedDate, booking.selectedTime, copy.locale)}</p>
            <p className="calendar-note">{copy.timezoneNote.replace('{email}', booking.email)}</p>
            {error ? <p className="calendar-error mt-4">{error}</p> : null}
            {cancelled ? null : (
              <div className="mt-8">
                <Button type="button" variant="secondary" disabled={pending} onClick={cancel}>
                  {pending ? copy.cancellingLabel : copy.cancelLabel}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <form className="calendar-layout" onSubmit={submit}>
            <div className="calendar-layout__schedule">
              <div className="calendar-month">
                <h2>{formatMonthYear(year, month, copy.locale)}</h2>
                <div className="calendar-month__nav">
                  <Button type="button" variant="secondary" size="sm" onClick={() => shiftMonth(-1)} disabled={!canNavigateMonth(year, month, -1)}>
                    {copy.previousLabel}
                  </Button>
                  <Button type="button" variant="secondary" size="sm" onClick={() => shiftMonth(1)} disabled={!canNavigateMonth(year, month, 1)}>
                    {copy.nextLabel}
                  </Button>
                </div>
              </div>
              <div className="calendar-weekdays">
                {copy.weekdays.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
              <div className="calendar-days">
                {cells.map((cell) => {
                  const active = date === cell.iso;
                  return (
                    <button
                      key={cell.iso}
                      type="button"
                      disabled={!cell.bookable}
                      onClick={() => setDate(cell.iso)}
                      className={[
                        'calendar-day',
                        !cell.inCurrentMonth ? 'calendar-day--outside' : '',
                        active ? 'calendar-day--selected' : '',
                      ].join(' ')}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="calendar-layout__details">
              <div className="calendar-times">
                <p className="font-display text-xs font-medium tracking-[0.14em] text-muted uppercase">{copy.scheduleLabel}</p>
                {!date ? (
                  <p className="calendar-note">{copy.scheduleHint}</p>
                ) : null}
                {loadingSlots ? <p className="calendar-note">{copy.loadingLabel}</p> : null}
                {slotsError ? <p className="calendar-error">{slotsError}</p> : null}
                {date && !loadingSlots && slots.length > 0 && slots.every((slot) => !slot.available) ? (
                  <p className="calendar-note">{copy.fullDayLabel}</p>
                ) : null}
                {date && !loadingSlots ? (
                  <div className="calendar-times__grid">
                    {slots.map((slot) => {
                      const active = time === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          aria-pressed={active}
                          onClick={() => setTime(slot.time)}
                          className={['calendar-slot', active ? 'calendar-slot--selected' : ''].join(' ')}
                        >
                          {formatTime12h(slot.time, copy.locale)}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <div className="calendar-fields">
                <fieldset className="contact-form__group">
                  <legend className="contact-form__label">{copy.fields.services.label}</legend>
                  <p className="contact-form__hint">{copy.fields.services.hint}</p>
                  <div className="contact-form__choices">
                    {services.map((item) => (
                      <label key={item.id} className="contact-form__choice">
                        <input
                          type="checkbox"
                          name="services"
                          value={item.id}
                          checked={selectedIds.includes(item.id)}
                          onChange={() => toggleService(item.id)}
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                  {services.length === 0 ? <p className="calendar-error">{copy.servicesEmpty}</p> : null}
                </fieldset>

                <div className="calendar-fields__pair">
                  <TextField label={copy.fields.name.label} name="name" placeholder={copy.fields.name.placeholder} required value={name} onChange={(event) => setName(event.target.value)} />
                  <TextField label={copy.fields.email.label} name="email" type="email" placeholder={copy.fields.email.placeholder} required value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>
                <div className="calendar-fields__pair">
                  <TextField label={copy.fields.phone.label} name="phone" type="tel" placeholder={copy.fields.phone.placeholder} required value={phone} onChange={(event) => setPhone(event.target.value)} />
                  <TextField label={copy.fields.company.label} name="company" placeholder={copy.fields.company.placeholder} value={company} onChange={(event) => setCompany(event.target.value)} />
                </div>
                {needsWebsite ? (
                  <TextField
                    label={copy.fields.website.label}
                    name="website"
                    placeholder={copy.fields.website.placeholder}
                    required
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                  />
                ) : null}
              </div>
              {error ? <p className="calendar-error mt-4">{error}</p> : null}
              <div className="mt-6">
                <Button type="submit" disabled={pending || selected.length === 0 || !date || !time}>
                  {pending ? copy.pendingLabel : copy.confirmLabel}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
