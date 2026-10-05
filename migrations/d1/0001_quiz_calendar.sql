CREATE TABLE IF NOT EXISTS quiz_sessions (
  session_id TEXT PRIMARY KEY,
  current_step INTEGER NOT NULL DEFAULT 0,
  answers_json TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_quiz_sessions_updated_at ON quiz_sessions(updated_at);

CREATE TABLE IF NOT EXISTS quiz_leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  industry TEXT,
  score_total INTEGER NOT NULL,
  score_percentage REAL NOT NULL,
  result_level TEXT NOT NULL,
  recommended_services TEXT NOT NULL,
  answers_json TEXT NOT NULL,
  category_scores_json TEXT NOT NULL,
  pending_sync INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS calendar_bookings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT NOT NULL,
  selected_date TEXT NOT NULL,
  selected_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  pending_sync INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_calendar_bookings_email ON calendar_bookings(email);
CREATE INDEX IF NOT EXISTS idx_calendar_bookings_selected_date ON calendar_bookings(selected_date);
