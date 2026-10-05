import type { APIRoute } from 'astro';
import { createBooking } from '../../../lib/growth/calendar/booking';
import type { BookingInput } from '../../../lib/growth/calendar/types';
import { dispatchCalendarWebhook } from '../../../lib/growth/n8n/client';
import { buildCalendarN8nPayload } from '../../../lib/growth/n8n/payloads';
import { jsonError } from '../../../lib/growth/api/response';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as BookingInput;
    const booking = await createBooking(body);

    try {
      await dispatchCalendarWebhook(buildCalendarN8nPayload({ event: 'calendar.booked', booking }));
    } catch (webhookError) {
      console.error('[calendar/book] n8n dispatch failed:', webhookError);
    }

    return Response.json({ booking });
  } catch (error) {
    return jsonError(error);
  }
};
