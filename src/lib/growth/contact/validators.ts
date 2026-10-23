import { AppError } from '../shared/errors';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactLeadInput = {
  locale?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  website?: string;
  services?: unknown;
  budget?: string;
  project?: string;
};

export type ContactLead = {
  locale: 'es' | 'en';
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  website?: string;
  services: string[];
  budget?: string;
  project?: string;
};

function text(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

export function validateContactLead(input: ContactLeadInput): ContactLead {
  const firstName = text(input.firstName, 80);
  const email = text(input.email, 200)?.toLowerCase();

  if (!firstName || firstName.length < 2) {
    throw new AppError('El nombre es obligatorio.', { statusCode: 400, code: 'INVALID_NAME' });
  }

  if (!email || !EMAIL_RE.test(email)) {
    throw new AppError('Introduce un email válido.', { statusCode: 400, code: 'INVALID_EMAIL' });
  }

  const phone = text(input.phone, 40);
  if (phone && phone.replace(/\D/g, '').length < 7) {
    throw new AppError('El teléfono no parece válido.', { statusCode: 400, code: 'INVALID_PHONE' });
  }

  const services = Array.isArray(input.services)
    ? input.services
        .map((item) => text(item, 80))
        .filter((item): item is string => Boolean(item))
        .slice(0, 20)
    : [];

  return {
    locale: input.locale === 'en' ? 'en' : 'es',
    firstName,
    lastName: text(input.lastName, 80),
    email,
    phone,
    website: text(input.website, 300),
    services,
    budget: text(input.budget, 80),
    project: text(input.project, 4000),
  };
}
