import { apiRequest } from '../shared/api-request';
import type { AvailabilityResponse, BookResponse, BookingInput, BookingRecord } from './types';

export async function fetchAvailability(date: string, service: string) {
  const params = new URLSearchParams({ date, service });
  return apiRequest<AvailabilityResponse>(`/api/calendar/availability?${params.toString()}`);
}

export async function bookAppointment(input: BookingInput) {
  return apiRequest<BookResponse>('/api/calendar/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export async function cancelAppointment(bookingId: string) {
  return apiRequest<{ booking: BookingRecord }>('/api/calendar/cancel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId }),
  });
}
