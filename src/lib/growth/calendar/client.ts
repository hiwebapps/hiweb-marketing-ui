import { apiRequest } from '../shared/api-request';
import type { AvailabilityResponse, BookResponse, BookingInput, BookingRecord } from './types';

export async function fetchAvailability(date: string) {
  const params = new URLSearchParams({ date });
  return apiRequest<AvailabilityResponse>(`/api/calendar/availability?${params.toString()}`);
}

/** `guard` carries the Turnstile token and the honeypot value. */
export async function bookAppointment(input: BookingInput, guard: Record<string, string> = {}) {
  return apiRequest<BookResponse>('/api/calendar/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...input, ...guard }),
  });
}

export async function cancelAppointment(bookingId: string) {
  return apiRequest<{ booking: BookingRecord }>('/api/calendar/cancel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId }),
  });
}
