import { getServiceLabel } from '../calendar/calendar-rules';
import type { BookingInput, BookingRecord, BookingStatus } from '../calendar/types';
import { createId } from '../shared/utils';
import { d1All, d1First, d1Run, getD1 } from './d1';

type BookingDbRow = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  website: string | null;
  service: string;
  selected_date: string;
  selected_time: string;
  status: BookingStatus;
  created_at: string;
};

function mapBookingRow(row: BookingDbRow): BookingRecord {
  return {
    id: row.id,
    name: row.name,
    company: row.company ?? undefined,
    email: row.email,
    phone: row.phone ?? undefined,
    website: row.website ?? undefined,
    service: row.service,
    selectedDate: row.selected_date,
    selectedTime: row.selected_time,
    status: row.status,
    createdAt: row.created_at,
  };
}

function isUniqueConstraint(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes('UNIQUE');
}

export async function getBookedTimesForDate(dateIso: string): Promise<string[]> {
  const rows = await getConfirmedBookingsForDate(dateIso);
  return rows.map((booking) => booking.selectedTime);
}

export async function getConfirmedBookingsForDate(dateIso: string): Promise<BookingRecord[]> {
  const d1 = getD1();
  if (!d1) return [];

  const rows = await d1All<BookingDbRow>(
    d1,
    `SELECT id, name, company, email, phone, website, service,
            selected_date, selected_time, status, created_at
     FROM calendar_bookings
     WHERE selected_date = ? AND status = 'confirmed'`,
    dateIso,
  );
  return rows.map(mapBookingRow);
}

export async function insertBooking(input: BookingInput): Promise<BookingRecord | null> {
  const id = createId();
  const createdAt = new Date().toISOString();
  const serviceLabel = getServiceLabel(input.service);
  const bookedTimes = await getBookedTimesForDate(input.selectedDate);
  if (bookedTimes.includes(input.selectedTime)) return null;

  const d1 = getD1();
  if (!d1) return null;

  try {
    await d1Run(
      d1,
      `INSERT INTO calendar_bookings (
        id, name, company, email, phone, website, service,
        selected_date, selected_time, status, pending_sync, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', 1, ?)`,
      id,
      input.name,
      input.company ?? null,
      input.email,
      input.phone ?? null,
      input.website ?? null,
      serviceLabel,
      input.selectedDate,
      input.selectedTime,
      createdAt,
    );
  } catch (error) {
    if (isUniqueConstraint(error)) return null;
    throw error;
  }

  return {
    id,
    name: input.name,
    company: input.company,
    email: input.email,
    phone: input.phone,
    website: input.website,
    service: serviceLabel,
    selectedDate: input.selectedDate,
    selectedTime: input.selectedTime,
    status: 'confirmed',
    createdAt,
  };
}

export async function getBookingById(id: string): Promise<BookingRecord | null> {
  const d1 = getD1();
  if (!d1) return null;

  const row = await d1First<BookingDbRow>(
    d1,
    `SELECT id, name, company, email, phone, website, service,
            selected_date, selected_time, status, created_at
     FROM calendar_bookings WHERE id = ?`,
    id,
  );
  return row ? mapBookingRow(row) : null;
}

export async function cancelBooking(id: string): Promise<BookingRecord | null> {
  const existing = await getBookingById(id);
  if (!existing || existing.status === 'cancelled') return null;

  const d1 = getD1();
  if (!d1) return null;

  await d1Run(d1, `UPDATE calendar_bookings SET status = 'cancelled' WHERE id = ?`, id);
  return { ...existing, status: 'cancelled' };
}
