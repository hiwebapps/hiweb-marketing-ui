import {
  ALL_SLOT_TIMES,
  BOOKING_TIMEZONE,
  SLOT_END_HOUR,
  SLOT_INTERVAL_MINUTES,
  SLOT_START_HOUR,
  buildBookingEndIso,
  buildBookingStartIso,
} from "./calendar-rules";
import {
  getGoogleCalendarAccessToken,
  getGoogleCalendarId,
} from "./google-calendar-api";

type BusyPeriod = {
  start: string;
  end: string;
};

function getCalendarId(): string {
  return getGoogleCalendarId();
}

function slotOverlapsBusy(
  dateIso: string,
  slotTime: string,
  busyStartMs: number,
  busyEndMs: number,
): boolean {
  const slotStartMs = Date.parse(buildBookingStartIso(dateIso, slotTime));
  const slotEndMs =
    slotStartMs + SLOT_INTERVAL_MINUTES * 60 * 1000;
  return slotStartMs < busyEndMs && slotEndMs > busyStartMs;
}

export function busyPeriodsToSlotTimes(
  dateIso: string,
  busyPeriods: BusyPeriod[],
): Set<string> {
  const occupied = new Set<string>();

  for (const slotTime of ALL_SLOT_TIMES) {
    const [hour] = slotTime.split(":").map(Number);
    if (hour < SLOT_START_HOUR || hour >= SLOT_END_HOUR) {
      continue;
    }

    for (const period of busyPeriods) {
      const busyStartMs = Date.parse(period.start);
      const busyEndMs = Date.parse(period.end);
      if (slotOverlapsBusy(dateIso, slotTime, busyStartMs, busyEndMs)) {
        occupied.add(slotTime);
        break;
      }
    }
  }

  return occupied;
}

export async function getGoogleCalendarBusySlotTimes(
  dateIso: string,
): Promise<Set<string>> {
  const accessToken = await getGoogleCalendarAccessToken();

  if (!accessToken) {
    return new Set();
  }

  const calendarId = getCalendarId();
  const timeMin = buildBookingStartIso(dateIso, "09:00");
  const timeMax = buildBookingEndIso(dateIso, "16:30");

  const response = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timeMin,
      timeMax,
      timeZone: BOOKING_TIMEZONE,
      items: [{ id: calendarId }],
    }),
  });

  if (!response.ok) {
    console.error(
      "[google-busy] freeBusy failed:",
      response.status,
      await response.text(),
    );
    return new Set();
  }

  const data = (await response.json()) as {
    calendars?: Record<string, { busy?: BusyPeriod[] }>;
  };

  const busy =
    data.calendars?.[calendarId]?.busy ??
    Object.values(data.calendars ?? {})[0]?.busy ??
    [];

  return busyPeriodsToSlotTimes(dateIso, busy);
}
