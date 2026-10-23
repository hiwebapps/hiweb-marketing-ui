import { createId } from '../shared/utils';
import type { ContactLead } from '../contact/validators';
import { d1First, d1Run, getD1 } from './d1';

/** Contact leads saved for this email since the given ISO timestamp. */
export async function countContactLeadsForEmailSince(email: string, sinceIso: string): Promise<number> {
  const d1 = getD1();
  if (!d1) return 0;

  const row = await d1First<{ total: number }>(
    d1,
    `SELECT COUNT(*) AS total FROM contact_leads WHERE email = ? AND created_at >= ?`,
    email,
    sinceIso,
  );
  return row?.total ?? 0;
}

export async function insertContactLead(lead: ContactLead): Promise<string | null> {
  const id = createId();
  const createdAt = new Date().toISOString();
  const d1 = getD1();
  if (!d1) return null;

  await d1Run(
    d1,
    `INSERT INTO contact_leads (
      id, locale, first_name, last_name, email, phone, website,
      services, budget, project, pending_sync, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
    id,
    lead.locale,
    lead.firstName,
    lead.lastName ?? null,
    lead.email,
    lead.phone ?? null,
    lead.website ?? null,
    JSON.stringify(lead.services),
    lead.budget ?? null,
    lead.project ?? null,
    createdAt,
  );
  return id;
}
