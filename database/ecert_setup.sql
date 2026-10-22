-- =====================================================
-- E-Certificate feature - run once in Supabase SQL Editor
-- Additive only. Touches no existing tables or data.
-- =====================================================

-- updated_at trigger function (same pattern as schema.sql; IF NOT EXISTS safe)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ---------- Templates ----------
CREATE TABLE IF NOT EXISTS ecert_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  event_title TEXT,                 -- snapshot, survives event deletion
  event_poster_url TEXT,            -- snapshot
  name TEXT NOT NULL DEFAULT 'Untitled certificate',
  background_url TEXT,              -- public URL of the stored (rasterized) background
  background_mime TEXT,             -- image/png | image/jpeg | application/pdf (the SOURCE mime)
  source_url TEXT,                  -- original uploaded file (PDF kept for reference)
  storage_path TEXT,                -- bucket 'media' path of the background (canonical for byte loading)
  width INTEGER NOT NULL,           -- canonical background pixel width
  height INTEGER NOT NULL,          -- canonical background pixel height
  layers JSONB NOT NULL DEFAULT '[]'::jsonb,      -- layer document v1
  layers_fingerprint TEXT NOT NULL DEFAULT '',    -- stable hash of normalized layers (staleness check)
  data_columns JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{name, role}] role: 'name' | null
  email_subject TEXT NOT NULL DEFAULT 'Your e-certificate',
  email_body TEXT NOT NULL DEFAULT '',
  format TEXT NOT NULL DEFAULT 'pdf' CHECK (format IN ('pdf', 'jpg', 'jpeg')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'sent')),
  use_letterhead BOOLEAN NOT NULL DEFAULT TRUE, -- branded header/footer around the email body
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE ecert_templates ENABLE ROW LEVEL SECURITY;
-- No policies: all access goes through requireAdmin routes + the service-role client.

CREATE INDEX IF NOT EXISTS idx_ecert_templates_event ON ecert_templates(event_id);
CREATE INDEX IF NOT EXISTS idx_ecert_templates_status ON ecert_templates(status);

CREATE TRIGGER update_ecert_templates_updated_at BEFORE UPDATE ON ecert_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ---------- Recipients ----------
CREATE TABLE IF NOT EXISTS ecert_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES ecert_templates(id) ON DELETE CASCADE,
  source TEXT NOT NULL DEFAULT 'sheet' CHECK (source IN ('sheet', 'participants')),
  row_index INTEGER NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  row_data JSONB NOT NULL DEFAULT '{}'::jsonb,    -- ALL parsed columns, original casing
  overrides JSONB NOT NULL DEFAULT '{}'::jsonb,   -- per-recipient layer overrides { layerId: {...} }
  render_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (render_status IN ('pending', 'rendered', 'failed')),
  render_error TEXT,
  rendered_fingerprint TEXT NOT NULL DEFAULT '',  -- fingerprint of layers when rendered (staleness check)
  rendered_path TEXT,                             -- bucket path of the rendered file
  rendered_url TEXT,
  rendered_at TIMESTAMPTZ,
  email_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (email_status IN ('pending', 'sent', 'failed')),
  email_error TEXT,
  email_sent_at TIMESTAMPTZ,
  brevo_message_id TEXT,
  send_count INTEGER NOT NULL DEFAULT 0,          -- how many times an email actually went out to this recipient
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- makes sheet re-uploads idempotent (same row updates in place instead of duplicating)
  UNIQUE(template_id, source, row_index)
);

ALTER TABLE ecert_recipients ENABLE ROW LEVEL SECURITY;
-- No policies: all access goes through requireAdmin routes + the service-role client.

CREATE INDEX IF NOT EXISTS idx_ecert_recipients_template ON ecert_recipients(template_id, row_index);
CREATE INDEX IF NOT EXISTS idx_ecert_recipients_email_status ON ecert_recipients(email_status);
CREATE INDEX IF NOT EXISTS idx_ecert_recipients_render_status ON ecert_recipients(render_status);

CREATE TRIGGER update_ecert_recipients_updated_at BEFORE UPDATE ON ecert_recipients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();