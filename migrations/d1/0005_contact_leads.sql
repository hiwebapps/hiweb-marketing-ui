CREATE TABLE IF NOT EXISTS contact_leads (
  id TEXT PRIMARY KEY,
  locale TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  services TEXT NOT NULL,
  budget TEXT,
  project TEXT,
  pending_sync INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contact_leads_email_created ON contact_leads(email, created_at);
