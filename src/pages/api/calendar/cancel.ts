import type { APIRoute } from 'astro';
import { cancelBooking } from '../../../lib/growth/db/calendar';
import { validateBookingId } from '../../../lib/growth/calendar/validators';
import { dispatchCalendarWebhook } from '../../../lib/growth/n8n/client';
import { buildCalendarN8nPayload } from '../../../lib/growth/n8n/payloads';
import { jsonError } from '../../../lib/growth/api/response';
import { AppError } from '../../../lib/growth/shared/errors';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as { bookingId?: string };
    const bookingId = validateBookingId(body.bookingId);
    const booking = await cancelBooking(bookingId);

    if (!booking) {
      throw new AppError('Reserva no encontrada.', { statusCode: 404, code: 'BOOKING_NOT_FOUND' });
    }

    try {
      await dispatchCalendarWebhook(buildCalendarN8nPayload({ event: 'calendar.cancelled', booking }));
    } catch (webhookError) {
      console.error('[calendar/cancel] n8n dispatch failed:', webhookError);
    }

    return Response.json({ booking });
  } catch (error) {
    return jsonError(error);
  }
};
