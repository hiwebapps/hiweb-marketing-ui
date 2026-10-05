import {
  ALL_SLOT_TIMES,
  isWeekday,
  parseDateIso,
  SLOT_END_HOUR,
  SLOT_START_HOUR,
} from "./calendar-rules";
import { getBookingNowParts } from "./booking-time";
import { getGoogleCalendarBusySlotTimes } from "./google-busy";
import { reconcileBookingsWithGoogleCalendar } from "./reconcile-google";
import { getBookedTimesForDate } from "../db/calendar";
import type { TimeSlot } from "./types";

function isPastSlot(dateIso: string, time: string): boolean {
  const { dateIso: todayIso, hour, minute } = getBookingNowParts();

  if (dateIso < todayIso) {
    return true;
  }

  if (dateIso > todayIso) {
    return false;
  }

  const [slotHour, slotMinute] = time.split(":").map(Number);
  const slotMinutes = slotHour * 60 + slotMinute;
  const nowMinutes = hour * 60 + minute;
  return slotMinutes <= nowMinutes;
}

export async function getAvailabilityForDate(
  dateIso: string,
): Promise<TimeSlot[]> {
  const date = parseDateIso(dateIso);

  if (!isWeekday(date)) {
    return [];
  }

  await reconcileBookingsWithGoogleCalendar(dateIso);

  const [bookedD1, bookedGCal] = await Promise.all([
    getBookedTimesForDate(dateIso),
    getGoogleCalendarBusySlotTimes(dateIso),
  ]);

  const occupied = new Set([...bookedD1, ...bookedGCal]);

  return ALL_SLOT_TIMES.filter((time) => {
    const [h] = time.split(":").map(Number);
    return h >= SLOT_START_HOUR && h < SLOT_END_HOUR;
  }).map((time) => ({
    time,
    available: !occupied.has(time) && !isPastSlot(dateIso, time),
  }));
}

export async function isSlotAvailable(
  dateIso: string,
  time: string,
): Promise<boolean> {
  const slots = await getAvailabilityForDate(dateIso);
  const slot = slots.find((s) => s.time === time);
  return Boolean(slot?.available);
}
