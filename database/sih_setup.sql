-- =====================================================
-- SIH Registration - run once in Supabase SQL Editor
-- =====================================================
CREATE TABLE IF NOT EXISTS sih_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name TEXT NOT NULL,
  team_leader TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sih_registrations ENABLE ROW LEVEL SECURITY;
-- No public policies: all reads/writes go through the server with the service role.
