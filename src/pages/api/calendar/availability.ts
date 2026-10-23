import type { APIRoute } from 'astro';
import { getAvailabilityForDate } from '../../../lib/growth/calendar/availability';
import { getServiceLabel, isBookableDate, parseDateIso } from '../../../lib/growth/calendar/calendar-rules';
import { jsonError } from '../../../lib/growth/api/response';
import { enforceRateLimit } from '../../../lib/growth/api/rate-limit';
import { AppError } from '../../../lib/growth/shared/errors';

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  try {
    await enforceRateLimit(request, 'API_RATE_LIMITER', 'calendar-availability');
    const date = url.searchParams.get('date')?.trim();
    const service = url.searchParams.get('service')?.trim();

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new AppError('Parámetro date inválido.', { statusCode: 400, code: 'INVALID_DATE' });
    }

    // Only dates someone can book: no Google Calendar lookups for past or far-off days.
    const parsed = parseDateIso(date);
    if (Number.isNaN(parsed.getTime()) || !isBookableDate(parsed)) {
      throw new AppError('La fecha seleccionada no está disponible.', { statusCode: 400, code: 'DATE_NOT_BOOKABLE' });
    }

    const slots = await getAvailabilityForDate(date);
    return Response.json({
      date,
      service: service ? getServiceLabel(service) : '',
      slots,
    });
  } catch (error) {
    return jsonError(error);
  }
};
