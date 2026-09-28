import { NAV_SERVICES } from '../../data/site';

export const CONTACT_FIELD_KINDS = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'website',
  'services',
  'budget',
  'project',
] as const;

export type ContactFieldKind = (typeof CONTACT_FIELD_KINDS)[number];

export type ContactField = {
  id: string;
  kind: ContactFieldKind;
  label: string;
  placeholder: string;
  hint: string;
  required: boolean;
  width: 'half' | 'full';
};

export type ContactOption = {
  id: string;
  label: string;
};

export type ContactBudget = ContactOption & {
  custom: boolean;
};

export type ContactPageCopy = {
  bannerTitle: string;
  bannerSubtitle: string;
  submitLabel: string;
  servicesError: string;
  amountLabel: string;
  amountPlaceholder: string;
  budgetError: string;
  customBudgetError: string;
  fields: ContactField[];
  services: ContactOption[];
  budgets: ContactBudget[];
  metaTitle: string;
  metaDescription: string;
};

const WIDE = new Set<ContactFieldKind>(['website', 'services', 'budget', 'project']);

export const DEFAULT_CONTACT: ContactPageCopy = {
  bannerTitle: '¿Tienes una idea?',
  bannerSubtitle: 'La construimos bien.',
  submitLabel: 'Enviar mensaje',
  servicesError: 'Elige al menos un servicio.',
  amountLabel: 'Monto',
  amountPlaceholder: 'Escribe cuánto',
  budgetError: 'Elige un presupuesto.',
  customBudgetError: 'Escribe el monto en MXN.',
  fields: [
    { id: 'firstName', kind: 'firstName', label: 'Nombre', placeholder: 'Tu nombre', hint: '', required: true, width: 'half' },
    { id: 'lastName', kind: 'lastName', label: 'Apellido', placeholder: 'Tu apellido', hint: '', required: true, width: 'half' },
    { id: 'email', kind: 'email', label: 'Email', placeholder: 'tu@empresa.com', hint: '', required: true, width: 'half' },
    { id: 'phone', kind: 'phone', label: 'Celular', placeholder: '+52 999 000 0000', hint: '', required: true, width: 'half' },
    { id: 'website', kind: 'website', label: 'Sitio web (opcional)', placeholder: 'https://tuempresa.com', hint: '', required: false, width: 'full' },
    { id: 'services', kind: 'services', label: 'Servicio de interés', placeholder: '', hint: 'Puedes elegir uno o varios.', required: true, width: 'full' },
    { id: 'budget', kind: 'budget', label: 'Presupuesto (MXN)', placeholder: '', hint: '', required: true, width: 'full' },
    { id: 'project', kind: 'project', label: 'Cuéntanos acerca de tu proyecto (opcional)', placeholder: 'Industria, objetivo y qué ya está en marcha.', hint: '', required: false, width: 'full' },
  ],
  services: NAV_SERVICES.map((service) => ({ id: service.slug, label: service.nombre })),
  budgets: [
    { id: '8k', label: '+ $8,000', custom: false },
    { id: '15k', label: '+ $15,000', custom: false },
    { id: '30k', label: '+ $30,000', custom: false },
    { id: '60k', label: '+ $60,000', custom: false },
    { id: 'custom', label: 'Personalizado', custom: true },
  ],
  metaTitle: 'Contacto — Hiweb Marketing',
  metaDescription: 'Cuéntanos tu proyecto. Nombre, servicio de interés y presupuesto. Respuesta en 24h.',
};

function isKind(value: unknown): value is ContactFieldKind {
  return typeof value === 'string' && (CONTACT_FIELD_KINDS as readonly string[]).includes(value);
}

export function mapContactPage(data: Record<string, unknown> | null): ContactPageCopy | null {
  if (!data) return null;
  const fields = Array.isArray(data.fields)
    ? data.fields.flatMap((item) => {
        if (!item || typeof item !== 'object') return [];
        const row = item as Record<string, unknown>;
        if (!isKind(row.kind) || typeof row.label !== 'string' || !row.label.trim()) return [];
        const wide = WIDE.has(row.kind);
        return [
          {
            id: typeof row._key === 'string' ? row._key : row.kind,
            kind: row.kind,
            label: row.label,
            placeholder: typeof row.placeholder === 'string' ? row.placeholder : '',
            hint: typeof row.hint === 'string' ? row.hint : '',
            required: row.required !== false,
            width: wide || row.width === 'full' ? 'full' : 'half',
          } satisfies ContactField,
        ];
      })
    : [];

  const services = Array.isArray(data.services)
    ? data.services.flatMap((item) => {
        if (!item || typeof item !== 'object') return [];
        const row = item as Record<string, unknown>;
        if (typeof row.label !== 'string' || !row.label.trim()) return [];
        return [{ id: typeof row._key === 'string' ? row._key : row.label, label: row.label }];
      })
    : [];

  const budgets = Array.isArray(data.budgets)
    ? data.budgets.flatMap((item) => {
        if (!item || typeof item !== 'object') return [];
        const row = item as Record<string, unknown>;
        if (typeof row.label !== 'string' || !row.label.trim()) return [];
        return [
          {
            id: typeof row._key === 'string' ? row._key : row.label,
            label: row.label,
            custom: row.custom === true,
          },
        ];
      })
    : [];

  if (!fields.length) return null;

  return {
    bannerTitle: typeof data.bannerTitle === 'string' && data.bannerTitle ? data.bannerTitle : DEFAULT_CONTACT.bannerTitle,
    bannerSubtitle: typeof data.bannerSubtitle === 'string' ? data.bannerSubtitle : '',
    submitLabel: typeof data.submitLabel === 'string' && data.submitLabel ? data.submitLabel : DEFAULT_CONTACT.submitLabel,
    servicesError: typeof data.servicesError === 'string' && data.servicesError ? data.servicesError : DEFAULT_CONTACT.servicesError,
    amountLabel: typeof data.amountLabel === 'string' && data.amountLabel ? data.amountLabel : DEFAULT_CONTACT.amountLabel,
    amountPlaceholder:
      typeof data.amountPlaceholder === 'string' && data.amountPlaceholder
        ? data.amountPlaceholder
        : DEFAULT_CONTACT.amountPlaceholder,
    budgetError: typeof data.budgetError === 'string' && data.budgetError ? data.budgetError : DEFAULT_CONTACT.budgetError,
    customBudgetError:
      typeof data.customBudgetError === 'string' && data.customBudgetError
        ? data.customBudgetError
        : DEFAULT_CONTACT.customBudgetError,
    fields,
    services: services.length ? services : DEFAULT_CONTACT.services,
    budgets: budgets.length ? budgets : DEFAULT_CONTACT.budgets,
    metaTitle: typeof data.metaTitle === 'string' && data.metaTitle ? data.metaTitle : DEFAULT_CONTACT.metaTitle,
    metaDescription:
      typeof data.metaDescription === 'string' && data.metaDescription
        ? data.metaDescription
        : DEFAULT_CONTACT.metaDescription,
  };
}
