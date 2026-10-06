import type { CalendarServiceOption } from '../growth/calendar/types';

export type CalendarField = {
  label: string;
  placeholder: string;
  hint: string;
};

export type CalendarPageCopy = {
  locale: 'es' | 'en';
  title: string;
  bannerTitle: string;
  bannerSubtitle: string;
  services: CalendarServiceOption[];
  fields: {
    services: CalendarField;
    name: CalendarField;
    email: CalendarField;
    phone: CalendarField;
    company: CalendarField;
    website: CalendarField;
  };
  weekdays: string[];
  previousLabel: string;
  nextLabel: string;
  scheduleLabel: string;
  scheduleHint: string;
  loadingLabel: string;
  fullDayLabel: string;
  servicesEmpty: string;
  servicesError: string;
  confirmLabel: string;
  pendingLabel: string;
  confirmedLabel: string;
  cancelledLabel: string;
  timezoneNote: string;
  cancelLabel: string;
  cancellingLabel: string;
  metaTitle: string;
  metaDescription: string;
};

const SPANISH_SERVICES: CalendarServiceOption[] = [
  { id: 'redes-sociales', label: 'Redes Sociales' },
  { id: 'seo', label: 'SEO' },
  { id: 'meta-ads', label: 'Meta Ads' },
  { id: 'google-ads', label: 'Google Ads' },
  { id: 'branding', label: 'Branding' },
  { id: 'crm-automatizacion', label: 'CRM & Automatización' },
  { id: 'community-manager', label: 'Community Manager' },
  { id: 'ia-marketing', label: 'IA Marketing' },
  { id: 'desarrollo-web', label: 'Desarrollo Web', asksForWebsite: true },
];

const ENGLISH_SERVICES: CalendarServiceOption[] = [
  { id: 'social-media', label: 'Social Networks' },
  { id: 'seo', label: 'SEO/AEO (Local and National)' },
  { id: 'meta-ads', label: 'Meta Ads' },
  { id: 'google-ads-management-services', label: 'Google Ads' },
  { id: 'branding', label: 'Brand Identity & Branding' },
  { id: 'crm-automation', label: 'CRM & Automation' },
  { id: 'community-manager', label: 'Community Manager' },
  { id: 'ai-tools-for-marketing', label: 'AI Marketing' },
  { id: 'web-development', label: 'Web Design and Development', asksForWebsite: true },
];

export const DEFAULT_CALENDAR: Record<'es' | 'en', CalendarPageCopy> = {
  es: {
    locale: 'es',
    title: 'Agenda una cita',
    bannerTitle: '¿Tienes una idea?',
    bannerSubtitle: 'La construimos bien.',
    services: SPANISH_SERVICES,
    fields: {
      services: { label: 'Servicio', placeholder: '', hint: 'Puedes elegir uno o varios.' },
      name: { label: 'Nombre', placeholder: 'Tu nombre', hint: '' },
      email: { label: 'Email', placeholder: 'tu@empresa.com', hint: '' },
      phone: { label: 'Teléfono', placeholder: '+52 999 000 0000', hint: '' },
      company: { label: 'Empresa', placeholder: 'Nombre de la empresa', hint: '' },
      website: { label: 'Sitio web', placeholder: 'https://tuempresa.com', hint: '' },
    },
    weekdays: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    previousLabel: 'Anterior',
    nextLabel: 'Siguiente',
    scheduleLabel: 'Horario',
    scheduleHint: 'Elige un día hábil. Los horarios son de 9:00 a 17:00, cada 30 minutos.',
    loadingLabel: 'Cargando horarios…',
    fullDayLabel: 'Este día ya no tiene horarios libres.',
    servicesEmpty: 'No hay servicios disponibles.',
    servicesError: 'Elige al menos un servicio.',
    confirmLabel: 'Confirmar cita',
    pendingLabel: 'Reservando…',
    confirmedLabel: 'Cita confirmada',
    cancelledLabel: 'Cita cancelada',
    timezoneNote: 'Horario de Ciudad de México. Te escribimos a {email}.',
    cancelLabel: 'Cancelar cita',
    cancellingLabel: 'Cancelando…',
    metaTitle: 'Agenda una cita — Hiweb Marketing',
    metaDescription: 'Elige servicio, día y horario. Lunes a viernes, de 9:00 a 17:00, hora de Ciudad de México.',
  },
  en: {
    locale: 'en',
    title: 'Schedule a meeting',
    bannerTitle: 'Have an idea?',
    bannerSubtitle: 'We build it well.',
    services: ENGLISH_SERVICES,
    fields: {
      services: { label: 'Service', placeholder: '', hint: 'You can choose one or more.' },
      name: { label: 'Name', placeholder: 'Your name', hint: '' },
      email: { label: 'Email', placeholder: 'you@company.com', hint: '' },
      phone: { label: 'Phone', placeholder: '+52 999 000 0000', hint: '' },
      company: { label: 'Company', placeholder: 'Company name', hint: '' },
      website: { label: 'Website', placeholder: 'https://yourcompany.com', hint: '' },
    },
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    previousLabel: 'Previous',
    nextLabel: 'Next',
    scheduleLabel: 'Time',
    scheduleHint: 'Choose a weekday. Times are from 9:00 to 17:00, every 30 minutes.',
    loadingLabel: 'Loading times…',
    fullDayLabel: 'This day has no open times left.',
    servicesEmpty: 'No services available.',
    servicesError: 'Choose at least one service.',
    confirmLabel: 'Confirm appointment',
    pendingLabel: 'Booking…',
    confirmedLabel: 'Appointment confirmed',
    cancelledLabel: 'Appointment cancelled',
    timezoneNote: 'Mexico City time. We will write to {email}.',
    cancelLabel: 'Cancel appointment',
    cancellingLabel: 'Cancelling…',
    metaTitle: 'Schedule a meeting — Hiweb Marketing',
    metaDescription: 'Choose a service, day, and time. Monday to Friday, 9:00 to 17:00, Mexico City time.',
  },
};

const FIELD_KINDS = ['services', 'name', 'email', 'phone', 'company', 'website'] as const;

type FieldKind = (typeof FIELD_KINDS)[number];

function isKind(value: unknown): value is FieldKind {
  return typeof value === 'string' && (FIELD_KINDS as readonly string[]).includes(value);
}

function text(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function weekdays(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  const labels = value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  return labels.length === 7 ? labels.map((item) => item.trim()) : fallback;
}

export function mapCalendarPage(data: Record<string, unknown> | null, locale: 'es' | 'en'): CalendarPageCopy | null {
  if (!data) return null;
  const fallback = DEFAULT_CALENDAR[locale];
  const fields = { ...fallback.fields };
  if (Array.isArray(data.fields)) {
    for (const item of data.fields) {
      if (!item || typeof item !== 'object') continue;
      const row = item as Record<string, unknown>;
      if (!isKind(row.kind) || typeof row.label !== 'string' || !row.label.trim()) continue;
      fields[row.kind] = {
        label: row.label.trim(),
        placeholder: typeof row.placeholder === 'string' ? row.placeholder : '',
        hint: typeof row.hint === 'string' ? row.hint : '',
      };
    }
  }

  const services = Array.isArray(data.services)
    ? data.services.flatMap((item) => {
        if (!item || typeof item !== 'object') return [];
        const row = item as Record<string, unknown>;
        if (typeof row.label !== 'string' || !row.label.trim()) return [];
        const label = row.label.trim();
        const id =
          (typeof row.serviceId === 'string' && row.serviceId.trim()) ||
          (typeof row._key === 'string' && row._key) ||
          label;
        const asksForWebsite =
          typeof row.asksForWebsite === 'boolean'
            ? row.asksForWebsite
            : `${id} ${label}`.toLowerCase().includes('web');
        return [{ id, label, ...(asksForWebsite ? { asksForWebsite: true } : {}) }];
      })
    : [];

  return {
    locale,
    title: text(data.title, fallback.title),
    bannerTitle: text(data.bannerTitle, fallback.bannerTitle),
    bannerSubtitle: typeof data.bannerSubtitle === 'string' ? data.bannerSubtitle : fallback.bannerSubtitle,
    services: services.length ? services : fallback.services,
    fields,
    weekdays: weekdays(data.weekdays, fallback.weekdays),
    previousLabel: text(data.previousLabel, fallback.previousLabel),
    nextLabel: text(data.nextLabel, fallback.nextLabel),
    scheduleLabel: text(data.scheduleLabel, fallback.scheduleLabel),
    scheduleHint: text(data.scheduleHint, fallback.scheduleHint),
    loadingLabel: text(data.loadingLabel, fallback.loadingLabel),
    fullDayLabel: text(data.fullDayLabel, fallback.fullDayLabel),
    servicesEmpty: text(data.servicesEmpty, fallback.servicesEmpty),
    servicesError: text(data.servicesError, fallback.servicesError),
    confirmLabel: text(data.confirmLabel, fallback.confirmLabel),
    pendingLabel: text(data.pendingLabel, fallback.pendingLabel),
    confirmedLabel: text(data.confirmedLabel, fallback.confirmedLabel),
    cancelledLabel: text(data.cancelledLabel, fallback.cancelledLabel),
    timezoneNote: text(data.timezoneNote, fallback.timezoneNote),
    cancelLabel: text(data.cancelLabel, fallback.cancelLabel),
    cancellingLabel: text(data.cancellingLabel, fallback.cancellingLabel),
    metaTitle: text(data.metaTitle, fallback.metaTitle),
    metaDescription: text(data.metaDescription, fallback.metaDescription),
  };
}
