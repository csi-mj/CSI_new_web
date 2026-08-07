-- SIH page content settings - run once in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "settings public read" ON site_settings;
CREATE POLICY "settings public read" ON site_settings FOR SELECT USING (TRUE);
