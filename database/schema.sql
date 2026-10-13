-- =====================================================
-- CSI Events Database Schema - Complete Setup
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  email_template TEXT,
  poster_url TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  event_date TIMESTAMPTZ NOT NULL,
  event_end_date TIMESTAMPTZ,
  venue TEXT,
  category TEXT,
  is_paid BOOLEAN DEFAULT FALSE,
  entry_fee INTEGER,
  csi_entry_fee INTEGER,
  payment_qr_url TEXT,
  is_registration_open BOOLEAN DEFAULT FALSE,
  registration_start_date TIMESTAMPTZ,
  registration_end_date TIMESTAMPTZ,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT,
  user_college TEXT,
  user_year TEXT,
  is_csi_member BOOLEAN DEFAULT FALSE,
  payment_screenshot_url TEXT,
  transaction_id TEXT,
  additional_info JSONB,
  registration_status TEXT DEFAULT 'pending' CHECK (registration_status IN ('pending', 'confirmed', 'rejected', 'waitlisted')),
  is_attended BOOLEAN DEFAULT FALSE,
  ticket_sent BOOLEAN DEFAULT FALSE,
  payment_mode TEXT DEFAULT 'online' CHECK (payment_mode IN ('online', 'cash')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_email)
);

-- 3. Create event_registration_forms table (for custom form fields)
CREATE TABLE IF NOT EXISTS event_registration_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  form_fields JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id)
);

-- 4. Create csi_team table
CREATE TABLE IF NOT EXISTS csi_team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sno INTEGER,
  name TEXT NOT NULL,
  position TEXT,
  role TEXT NOT NULL CHECK (role IN ('gb', 'core', 'execom')),
  image_url TEXT,
  linkedin TEXT,
  github TEXT,
  mail TEXT,
  portfolio TEXT,
  gb_position TEXT,
  team_year TEXT DEFAULT '2025-26',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_event_end_date ON events(event_end_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_is_active ON events(is_active);
CREATE INDEX IF NOT EXISTS idx_events_status_date ON events(status, event_date);

CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user_email ON event_registrations(user_email);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON event_registrations(registration_status);

CREATE INDEX IF NOT EXISTS idx_registration_forms_event_id ON event_registration_forms(event_id);

CREATE INDEX IF NOT EXISTS idx_team_role ON csi_team(role);
CREATE INDEX IF NOT EXISTS idx_team_is_active ON csi_team(is_active);
CREATE INDEX IF NOT EXISTS idx_team_role_active ON csi_team(role, is_active);
CREATE INDEX IF NOT EXISTS idx_team_sno ON csi_team(sno);

-- 6. Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Create triggers to auto-update updated_at
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registrations_updated_at BEFORE UPDATE ON event_registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registration_forms_updated_at BEFORE UPDATE ON event_registration_forms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_updated_at BEFORE UPDATE ON csi_team
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Create platform_settings table (Singleton)
CREATE TABLE IF NOT EXISTS platform_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  platform_name TEXT NOT NULL DEFAULT 'CSI Chapter',
  logo_url TEXT,
  default_payment_qr_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert the single default row
INSERT INTO platform_settings (id, platform_name) 
VALUES (1, 'CSI Chapter') 
ON CONFLICT (id) DO NOTHING;

CREATE TRIGGER update_platform_settings_updated_at BEFORE UPDATE ON platform_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Create csi_memberships table
CREATE TABLE IF NOT EXISTS csi_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  contact TEXT,
  roll_no TEXT,
  branch TEXT,
  year TEXT,
  about_yourself TEXT,
  queries TEXT,
  payment_mode TEXT DEFAULT 'online' CHECK (payment_mode IN ('online', 'cash')),
  payment_screenshot_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for csi_memberships
CREATE INDEX IF NOT EXISTS idx_csi_memberships_email ON csi_memberships(email);
CREATE INDEX IF NOT EXISTS idx_csi_memberships_status ON csi_memberships(status);

-- Create trigger for csi_memberships
CREATE TRIGGER update_csi_memberships_updated_at BEFORE UPDATE ON csi_memberships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- RECRUITMENTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS recruitments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  roll_no TEXT NOT NULL,
  branch TEXT NOT NULL,
  year TEXT NOT NULL,
  
  -- Application Details
  team TEXT NOT NULL, -- 'Execom' or 'Core'
  portfolio_1 TEXT NOT NULL,
  portfolio_2 TEXT, -- Optional second choice
  resume_url TEXT,
  
  -- Additional Info
  is_csi_member BOOLEAN DEFAULT false,
  other_clubs TEXT,
  
  -- Admin Tracking
  status TEXT DEFAULT 'pending' NOT NULL, -- pending, shortlisted, rejected, interviewed, selected
  is_email_sent BOOLEAN DEFAULT false NOT NULL,
  interview_time TIMESTAMPTZ,
  interview_venue TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create a trigger to automatically update the 'updated_at' column
CREATE TRIGGER update_recruitments_updated_at
  BEFORE UPDATE ON recruitments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Setup Row Level Security (RLS)
ALTER TABLE recruitments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit an application (Insert)
CREATE POLICY "Allow public insert on recruitments"
  ON recruitments FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow admins (authenticated users) to view and update applications
CREATE POLICY "Allow authenticated full access on recruitments"
  ON recruitments FOR ALL
  TO authenticated
  USING (true);
