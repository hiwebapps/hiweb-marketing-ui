import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Button } from '../ui/Button';
import { TextField } from '../ui/TextField';
import {
  CALENDAR_SERVICES,
  WEEKDAY_LABELS_SHORT,
  canNavigateMonth,
  formatMonthYear,
  formatScheduleSummary,
  formatTime12h,
  getMonthCells,
  serviceRequiresWebsite,
} from '../../lib/growth/calendar/calendar-rules';
import { bookAppointment, cancelAppointment, fetchAvailability } from '../../lib/growth/calendar/client';
import type { BookingRecord, TimeSlot } from '../../lib/growth/calendar/types';

const today = new Date();

export function CalendarTool() {
  const [service, setService] = useState(CALENDAR_SERVICES[0].id);
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
  const needsWebsite = serviceRequiresWebsite(service);

  useEffect(() => {
    if (!date) return;
    let cancelledRequest = false;
    setLoadingSlots(true);
    setSlotsError('');
    setTime('');
    fetchAvailability(date, service)
      .then((response) => {
        if (!cancelledRequest) setSlots(response.slots);
      })
      .catch((loadError) => {
        if (!cancelledRequest) {
          setSlots([]);
          setSlotsError(loadError instanceof Error ? loadError.message : 'No pudimos cargar los horarios.');
        }
      })
      .finally(() => {
        if (!cancelledRequest) setLoadingSlots(false);
      });
    return () => {
      cancelledRequest = true;
    };
  }, [date, service]);

  function shiftMonth(direction: -1 | 1) {
    if (!canNavigateMonth(year, month, direction)) return;
    const next = new Date(year, month + direction, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError('');
    try {
      const response = await bookAppointment({
        name,
        email,
        phone,
        company: company || undefined,
        website: needsWebsite ? website : undefined,
        service,
        selectedDate: date,
        selectedTime: time,
      });
      setBooking(response.booking);
    } catch (bookError) {
      setError(bookError instanceof Error ? bookError.message : 'No pudimos reservar ese horario.');
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
      setError(cancelError instanceof Error ? cancelError.message : 'No pudimos cancelar la cita.');
    } finally {
      setPending(false);
    }
  }

  if (booking) {
    return (
      <section className="mx-auto w-full max-w-3xl px-6 pb-24">
        <div className="rounded-3xl border border-border bg-canvas p-6 md:p-10">
          <p className="font-display text-xs font-medium tracking-[0.14em] text-muted uppercase">
            {cancelled ? 'Cita cancelada' : 'Cita confirmada'}
          </p>
          <h2 className="mt-3 text-3xl">{booking.service}</h2>
          <p className="mt-3 text-lg">{formatScheduleSummary(booking.selectedDate, booking.selectedTime)}</p>
          <p className="mt-2 text-ink/70">Horario de Ciudad de México. Te escribimos a {booking.email}.</p>
          {error ? <p className="mt-4 text-sm text-accent-orange">{error}</p> : null}
          {cancelled ? null : (
            <div className="mt-8">
              <Button type="button" variant="secondary" disabled={pending} onClick={cancel}>
                {pending ? 'Cancelando…' : 'Cancelar cita'}
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-6 pb-24">
      <form className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]" onSubmit={submit}>
        <div className="rounded-3xl border border-border bg-canvas p-6 md:p-8">
          <p className="font-display text-xs font-medium tracking-[0.14em] text-muted uppercase">Servicio</p>
          <div className="mt-4 grid gap-2">
            {CALENDAR_SERVICES.map((item) => {
              const active = service === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setService(item.id)}
                  className={[
                    'rounded-2xl border px-4 py-3 text-left',
                    active ? 'border-ink bg-ink text-canvas' : 'border-border hover:bg-surface',
                  ].join(' ')}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <h2 className="text-2xl">{formatMonthYear(year, month)}</h2>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => shiftMonth(-1)} disabled={!canNavigateMonth(year, month, -1)}>
                Anterior
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={() => shiftMonth(1)} disabled={!canNavigateMonth(year, month, 1)}>
                Siguiente
              </Button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-muted">
            {WEEKDAY_LABELS_SHORT.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {cells.map((cell) => {
              const active = date === cell.iso;
              return (
                <button
                  key={cell.iso}
                  type="button"
                  disabled={!cell.bookable}
                  onClick={() => setDate(cell.iso)}
                  className={[
                    'h-10 rounded-xl text-sm',
                    !cell.inCurrentMonth ? 'text-muted/50' : '',
                    cell.bookable ? 'hover:bg-surface' : 'cursor-default opacity-40',
                    active ? 'bg-ink text-canvas' : '',
                  ].join(' ')}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-canvas p-6 md:p-8">
          <p className="font-display text-xs font-medium tracking-[0.14em] text-muted uppercase">Horario</p>
          {!date ? <p className="mt-4 text-ink/70">Elige un día hábil. Los horarios son de 9:00 a 17:00, cada 30 minutos.</p> : null}
          {loadingSlots ? <p className="mt-4">Cargando horarios…</p> : null}
          {slotsError ? <p className="mt-4 text-sm text-accent-orange">{slotsError}</p> : null}
          {date && !loadingSlots ? (
            <div className="mt-4 grid max-h-64 grid-cols-2 gap-2 overflow-auto">
              {slots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => setTime(slot.time)}
                  className={[
                    'rounded-xl border px-3 py-2 text-sm',
                    time === slot.time ? 'border-ink bg-ink text-canvas' : 'border-border',
                    slot.available ? 'hover:bg-surface' : 'cursor-default opacity-40',
                  ].join(' ')}
                >
                  {formatTime12h(slot.time)}
                </button>
              ))}
            </div>
          ) : null}

          <div className="mt-8 grid gap-4">
            <TextField label="Nombre" name="name" required value={name} onChange={(event) => setName(event.target.value)} />
            <TextField label="Email" name="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
            <TextField label="Teléfono" name="phone" required value={phone} onChange={(event) => setPhone(event.target.value)} />
            <TextField label="Empresa" name="company" value={company} onChange={(event) => setCompany(event.target.value)} />
            {needsWebsite ? (
              <TextField label="Sitio web" name="website" required value={website} onChange={(event) => setWebsite(event.target.value)} />
            ) : null}
          </div>
          {error ? <p className="mt-4 text-sm text-accent-orange">{error}</p> : null}
          <div className="mt-6">
            <Button type="submit" disabled={pending || !date || !time}>
              {pending ? 'Reservando…' : 'Confirmar cita'}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
