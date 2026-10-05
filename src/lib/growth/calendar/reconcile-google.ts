import {
  cancelBooking,
  getConfirmedBookingsForDate,
} from "../db/calendar";
import { getGoogleServiceAccountConfig } from "../google/service-account-auth";
import { googleCalendarEventExistsForBooking } from "./google-calendar-api";

export async function reconcileBookingsWithGoogleCalendar(
  dateIso: string,
): Promise<number> {
  if (!getGoogleServiceAccountConfig()) {
    return 0;
  }

  const bookings = await getConfirmedBookingsForDate(dateIso);
  let cancelled = 0;

  for (const booking of bookings) {
    const exists = await googleCalendarEventExistsForBooking({
      bookingId: booking.id,
      dateIso: booking.selectedDate,
      time: booking.selectedTime,
    });

    if (!exists) {
      const result = await cancelBooking(booking.id);
      if (result) {
        cancelled++;
      }
    }
  }

  return cancelled;
}
