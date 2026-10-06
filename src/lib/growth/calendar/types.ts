export type BookingStatus = "confirmed" | "cancelled";

export type CalendarServiceOption = {
  id: string;
  label: string;
  asksForWebsite?: boolean;
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
  /** Etiquetas listas para guardar y mostrar, separadas por coma. */
  service: string;
  /** Ids de Sanity. Si viene vacío, se usa `service`. */
  services?: string[];
  selectedDate: string;
  selectedTime: string;
  locale?: 'es' | 'en';
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
