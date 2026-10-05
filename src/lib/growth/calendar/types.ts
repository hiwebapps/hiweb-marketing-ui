export type BookingStatus = "confirmed" | "cancelled";

export type CalendarServiceId =
  | "consulting"
  | "seo-audit"
  | "website-audit"
  | "content-strategy"
  | "paid-ads";

export type CalendarService = {
  id: CalendarServiceId;
  label: string;
};

export type TimeSlot = {
  time: string;
  available: boolean;
};

export type AvailabilityResponse = {
  date: string;
  service: string;
  slots: TimeSlot[];
};

export type BookingInput = {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  website?: string;
  service: string;
  selectedDate: string;
  selectedTime: string;
};

export type BookingRecord = {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  website?: string;
  service: string;
  selectedDate: string;
  selectedTime: string;
  status: BookingStatus;
  createdAt: string;
};

export type BookResponse = {
  booking: BookingRecord;
};
