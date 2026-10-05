import { validateBookingInput } from "./validators";
import { isSlotAvailable } from "./availability";
import { insertBooking } from "../db/calendar";
import type { BookingInput, BookingRecord } from "./types";
import { AppError } from "../shared/errors";

export async function createBooking(
  input: BookingInput,
): Promise<BookingRecord> {
  const validated = await validateBookingInput(input);
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
