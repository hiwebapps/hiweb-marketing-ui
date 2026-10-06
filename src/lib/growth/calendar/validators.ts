import {
  formatDateIso,
  isBookableDate,
  parseDateIso,
  serviceRequiresWebsite,
} from "./calendar-rules";
import { loadCalendarServices } from "./services";
import { isSlotAvailable } from "./availability";
import type { BookingInput, CalendarServiceOption } from "./types";
import { AppError } from "../shared/errors";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

function normalizeWebsiteInput(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

function isValidWebsiteInput(value: string): boolean {
  const normalized = normalizeWebsiteInput(value);
  if (!normalized) {
    return false;
  }
  try {
    const url = new URL(normalized);
    return Boolean(url.hostname) && url.hostname.includes(".");
  } catch {
    return false;
  }
}

export async function validateBookingInput(
  input: BookingInput,
): Promise<BookingInput> {
  const locale = input.locale === "en" ? "en" : "es";
  const t = (es: string, en: string) => (locale === "en" ? en : es);
  const name = input.name?.trim();
  const email = input.email?.trim().toLowerCase();
  const selectedDate = input.selectedDate?.trim();
  const selectedTime = input.selectedTime?.trim();
  const requested = Array.isArray(input.services) && input.services.length > 0
    ? input.services
    : (input.service ?? "").split(",");

  if (!name || name.length < 2) {
    throw new AppError(t("El nombre es obligatorio.", "Name is required."), {
      statusCode: 400,
      code: "INVALID_NAME",
    });
  }

  if (!email || !EMAIL_RE.test(email)) {
    throw new AppError(t("Introduce un email válido.", "Enter a valid email."), {
      statusCode: 400,
      code: "INVALID_EMAIL",
    });
  }

  const catalog = await loadCalendarServices();
  const resolved = resolveSelectedServices(requested, catalog, locale, input.service ?? "");
  if (resolved.length === 0) {
    throw new AppError(t("Selecciona al menos un servicio.", "Choose at least one service."), {
      statusCode: 400,
      code: "INVALID_SERVICE",
    });
  }

  if (!selectedDate || !DATE_RE.test(selectedDate)) {
    throw new AppError(t("Fecha inválida.", "Invalid date."), {
      statusCode: 400,
      code: "INVALID_DATE",
    });
  }

  if (!selectedTime || !TIME_RE.test(selectedTime)) {
    throw new AppError(t("Horario inválido.", "Invalid time."), {
      statusCode: 400,
      code: "INVALID_TIME",
    });
  }

  if (!isBookableDate(parseDateIso(selectedDate))) {
    throw new AppError(t("La fecha seleccionada no está disponible.", "That date is not available."), {
      statusCode: 400,
      code: "DATE_NOT_BOOKABLE",
    });
  }

  if (selectedDate < formatDateIso(new Date())) {
    throw new AppError(t("No puedes reservar en el pasado.", "You cannot book a time in the past."), {
      statusCode: 400,
      code: "DATE_IN_PAST",
    });
  }

  if (!(await isSlotAvailable(selectedDate, selectedTime))) {
    throw new AppError(t("Ese horario ya no está disponible.", "That time is no longer available."), {
      statusCode: 409,
      code: "SLOT_UNAVAILABLE",
    });
  }

  const phone = input.phone?.trim();
  if (!phone || phone.length < 7) {
    throw new AppError(t("El teléfono es obligatorio.", "Phone is required."), {
      statusCode: 400,
      code: "INVALID_PHONE",
    });
  }

  let website: string | undefined;

  if (resolved.some(serviceRequiresWebsite)) {
    const websiteInput = input.website?.trim();
    if (!websiteInput || !isValidWebsiteInput(websiteInput)) {
      throw new AppError(t("Introduce la URL de tu sitio web actual.", "Enter your current website URL."), {
        statusCode: 400,
        code: "INVALID_WEBSITE",
      });
    }
    website = normalizeWebsiteInput(websiteInput);
  }

  return {
    name,
    email,
    company: input.company?.trim() || undefined,
    phone,
    website,
    service: resolved.map((item) => item.label).join(", "),
    services: resolved.map((item) => item.id),
    selectedDate,
    selectedTime,
  };
}

function resolveSelectedServices(
  requested: string[],
  catalog: CalendarServiceOption[],
  locale: "es" | "en",
  submittedLabel: string,
): CalendarServiceOption[] {
  const t = (es: string, en: string) => (locale === "en" ? en : es);
  const submitted = submittedLabel.split(",").map((item) => item.trim()).filter(Boolean);
  const resolved: CalendarServiceOption[] = [];
  for (const value of requested) {
    const token = value.trim();
    if (!token) continue;
    const matches = catalog.filter((item) => item.id === token || item.label === token);
    const match = matches.find((item) => submitted.includes(item.label)) ?? matches[0];
    if (!match) {
      throw new AppError(t("Selecciona un servicio válido.", "Choose a valid service."), {
        statusCode: 400,
        code: "INVALID_SERVICE",
      });
    }
    if (resolved.some((item) => item.id === match.id)) continue;
    resolved.push(match);
  }
  return resolved;
}

export function validateBookingId(bookingId: unknown): string {
  if (typeof bookingId !== "string" || !/^[a-f0-9-]{36}$/i.test(bookingId)) {
    throw new AppError("Reserva inválida.", {
      statusCode: 400,
      code: "INVALID_BOOKING_ID",
    });
  }
  return bookingId;
}
