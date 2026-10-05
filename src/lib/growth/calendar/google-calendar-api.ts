import {
  BOOKING_TIMEZONE,
  buildBookingEndIso,
  buildBookingStartIso,
} from "./calendar-rules";
import { getGoogleAccessToken } from "../google/service-account-auth";
import { getServerEnv } from "../shared/env";

export function getGoogleCalendarId(): string {
  return getServerEnv().googleCalendarId.trim() || "primary";
}

export async function getGoogleCalendarAccessToken(): Promise<string | null> {
  return getGoogleAccessToken([
    "https://www.googleapis.com/auth/calendar.readonly",
  ]);
}

export async function googleCalendarEventExistsForBooking(input: {
  bookingId: string;
  dateIso: string;
  time: string;
}): Promise<boolean> {
  const accessToken = await getGoogleCalendarAccessToken();
  if (!accessToken) {
    return true;
  }

  const calendarId = encodeURIComponent(getGoogleCalendarId());
  const timeMin = encodeURIComponent(
    buildBookingStartIso(input.dateIso, input.time),
  );
  const timeMax = encodeURIComponent(
    buildBookingEndIso(input.dateIso, input.time),
  );
  const query = encodeURIComponent(input.bookingId);

  const url =
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events` +
    `?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true` +
    `&timeZone=${encodeURIComponent(BOOKING_TIMEZONE)}&q=${query}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    console.error(
      "[google-calendar-api] events.list failed:",
      response.status,
      await response.text(),
    );
    return true;
  }

  const data = (await response.json()) as {
    items?: Array<{ id?: string; description?: string; summary?: string }>;
  };

  return (data.items ?? []).some((event) => {
    const haystack = `${event.summary ?? ""}\n${event.description ?? ""}`;
    return haystack.includes(input.bookingId);
  });
}
