import type { APIRoute } from 'astro';
import { createBooking } from '../../../lib/growth/calendar/booking';
import type { BookingInput } from '../../../lib/growth/calendar/types';
import { dispatchCalendarWebhook } from '../../../lib/growth/n8n/client';
import { buildCalendarN8nPayload } from '../../../lib/growth/n8n/payloads';
import { jsonError } from '../../../lib/growth/api/response';
import { enforceRateLimit } from '../../../lib/growth/api/rate-limit';
import { verifyTurnstile } from '../../../lib/growth/api/turnstile';
import { HONEYPOT_FIELD } from '../../../lib/growth/turnstile-client';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    await enforceRateLimit(request, 'FORM_RATE_LIMITER', 'calendar-book');
    const { turnstileToken, [HONEYPOT_FIELD]: trap, ...body } = (await request.json()) as BookingInput &
      Record<string, unknown>;

    // Only bots fill the hidden field. They get a normal answer and no slot is taken.
    if (typeof trap === 'string' && trap.trim()) {
      return Response.json({
        booking: {
          id: 'ok',
          name: body.name,
          email: body.email,
          service: body.service,
          selectedDate: body.selectedDate,
          selectedTime: body.selectedTime,
        },
      });
    }

    await verifyTurnstile(request, turnstileToken, body.locale === 'en' ? 'en' : 'es');
    const booking = await createBooking(body as BookingInput);

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
