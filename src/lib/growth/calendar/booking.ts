import { validateBookingInput } from "./validators";
import { isSlotAvailable } from "./availability";
import { getBookingNowParts } from "./booking-time";
import { countActiveBookingsForEmail, insertBooking } from "../db/calendar";
import type { BookingInput, BookingRecord } from "./types";
import { AppError } from "../shared/errors";

export async function createBooking(
  input: BookingInput,
): Promise<BookingRecord> {
  const validated = await validateBookingInput(input);

  // One upcoming booking per email, so a script cannot fill the calendar.
  const { dateIso: todayIso } = getBookingNowParts();
  if ((await countActiveBookingsForEmail(validated.email, todayIso)) > 0) {
    throw new AppError(
      input.locale === "en"
        ? "You already have an upcoming meeting with us. If you need to change it, contact us."
        : "Ya tienes una cita agendada con nosotros. Si necesitas cambiarla, escríbenos.",
      { statusCode: 409, code: "ACTIVE_BOOKING_EXISTS" },
    );
  }

  const booking = await insertBooking(validated);

  if (!booking) {
    if (
      !(await isSlotAvailable(validated.selectedDate, validated.selectedTime))
    ) {
      throw new AppError("Ese horario ya no está disponible.", {
        statusCode: 409,
        code: "SLOT_UNAVAILABLE",
      });
    }

    throw new AppError(
      "No pudimos guardar la reserva. Intenta de nuevo en unos minutos.",
      { statusCode: 503, code: "STORAGE_UNAVAILABLE" },
    );
  }

  return booking;
}
