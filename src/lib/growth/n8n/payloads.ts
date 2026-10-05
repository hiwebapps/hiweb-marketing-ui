import {
  BOOKING_TIMEZONE,
  buildBookingEndIso,
  buildBookingStartIso,
  formatScheduleSummary,
  formatTime12h,
  getServiceLabel,
  SLOT_INTERVAL_MINUTES,
  splitPersonName,
} from "../calendar/calendar-rules";
import type { BookingRecord } from "../calendar/types";
import type { QuizLeadInput, QuizScoreResult } from "../quiz/types";

export function buildQuizN8nPayload(input: {
  leadId: string;
  lead: QuizLeadInput;
  result: QuizScoreResult;
}) {
  return {
    event: "quiz.submitted",
    leadId: input.leadId,
    lead: input.lead,
    score: {
      total: input.result.scoreTotal,
      max: input.result.scoreMax,
      percentage: input.result.scorePercentage,
      level: input.result.resultLevel,
      levelLabel: input.result.resultLevelLabel,
    },
    categoryScores: input.result.categoryScores,
    recommendedServices: input.result.recommendedServices,
    submittedAt: new Date().toISOString(),
  };
}

function buildCalendarSlackText(
  event: "calendar.booked" | "calendar.cancelled",
  booking: BookingRecord,
  scheduleLabel: string,
  serviceLabel: string,
): string {
  if (event === "calendar.cancelled") {
    return [
      "❌ *Cita cancelada*",
      `• Servicio: ${serviceLabel}`,
      `• Horario: ${scheduleLabel}`,
      `• Nombre: ${booking.name}`,
      `• Email: ${booking.email}`,
      `• ID: ${booking.id}`,
    ].join("\n");
  }

  const lines = [
    "📅 *Nueva cita agendada*",
    `• Servicio: ${serviceLabel}`,
    `• Horario: ${scheduleLabel}`,
    `• Nombre: ${booking.name}`,
    `• Email: ${booking.email}`,
  ];

  if (booking.company) {
    lines.push(`• Empresa: ${booking.company}`);
  }
  if (booking.phone) {
    lines.push(`• Teléfono: ${booking.phone}`);
  }
  if (booking.website) {
    lines.push(`• Sitio web: ${booking.website}`);
  }

  lines.push(`• ID: ${booking.id}`);
  return lines.join("\n");
}

function buildCalendarEventDescription(booking: BookingRecord): string {
  const lines = [
    `Reserva ID: ${booking.id}`,
    `Cliente: ${booking.name}`,
    `Email: ${booking.email}`,
  ];
  if (booking.company) {
    lines.push(`Empresa: ${booking.company}`);
  }
  if (booking.phone) {
    lines.push(`Teléfono: ${booking.phone}`);
  }
  if (booking.website) {
    lines.push(`Sitio web: ${booking.website}`);
  }
  return lines.join("\n");
}

export function buildCalendarN8nPayload(input: {
  event: "calendar.booked" | "calendar.cancelled";
  booking: BookingRecord;
}) {
  const { booking, event } = input;
  const serviceLabel = getServiceLabel(booking.service);
  const scheduleLabel = formatScheduleSummary(
    booking.selectedDate,
    booking.selectedTime,
  );

  const payload: {
    event: typeof event;
    bookingId: string;
    booking: BookingRecord;
    summary: {
      service: string;
      serviceLabel: string;
      scheduleLabel: string;
      date: string;
      time: string;
      timeLabel: string;
      timezone: string;
      name: string;
      email: string;
      company: string | null;
      phone: string | null;
      website: string | null;
    };
    slack: {
      channel: string;
      text: string;
    };
    calendar?: {
      title: string;
      description: string;
      start: string;
      end: string;
      timeZone: string;
      attendeeEmail: string;
      durationMinutes: number;
    };
    hubspot?: {
      contact: {
        email: string;
        firstName: string;
        lastName: string;
        phone?: string;
        company?: string;
        website?: string;
      };
      meeting: {
        title: string;
        body: string;
        start: string;
        end: string;
        startTimeMs: number;
        endTimeMs: number;
      };
      properties: {
        leadSource: string;
        bookingId: string;
        serviceLabel: string;
        scheduleLabel: string;
      };
    };
    submittedAt: string;
  } = {
    event,
    bookingId: booking.id,
    booking,
    summary: {
      service: booking.service,
      serviceLabel,
      scheduleLabel,
      date: booking.selectedDate,
      time: booking.selectedTime,
      timeLabel: formatTime12h(booking.selectedTime),
      timezone: BOOKING_TIMEZONE,
      name: booking.name,
      email: booking.email,
      company: booking.company ?? null,
      phone: booking.phone ?? null,
      website: booking.website ?? null,
    },
    slack: {
      channel: "leads-landing-page",
      text: buildCalendarSlackText(
        event,
        booking,
        scheduleLabel,
        serviceLabel,
      ),
    },
    submittedAt: new Date().toISOString(),
  };

  const calendarTitle = `${serviceLabel} — ${booking.name}`;
  const calendarDescription = buildCalendarEventDescription(booking);
  const startIso = buildBookingStartIso(
    booking.selectedDate,
    booking.selectedTime,
  );
  const endIso = buildBookingEndIso(
    booking.selectedDate,
    booking.selectedTime,
  );

  payload.calendar = {
    title: calendarTitle,
    description: calendarDescription,
    start: startIso,
    end: endIso,
    timeZone: BOOKING_TIMEZONE,
    attendeeEmail: booking.email,
    durationMinutes: SLOT_INTERVAL_MINUTES,
  };

  if (event === "calendar.booked") {
    const { firstName, lastName } = splitPersonName(booking.name);

    payload.hubspot = {
      contact: {
        email: booking.email,
        firstName,
        lastName,
        ...(booking.phone ? { phone: booking.phone } : {}),
        ...(booking.company ? { company: booking.company } : {}),
        ...(booking.website ? { website: booking.website } : {}),
      },
      meeting: {
        title: calendarTitle,
        body: calendarDescription,
        start: startIso,
        end: endIso,
        startTimeMs: Date.parse(startIso),
        endTimeMs: Date.parse(endIso),
      },
      properties: {
        leadSource: "Calendario Hiweb",
        bookingId: booking.id,
        serviceLabel,
        scheduleLabel,
      },
    };
  }

  return payload;
}
