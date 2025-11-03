-- =====================================================
-- CSI Events - Dummy Data for Testing
-- Run this AFTER running schema.sql
-- =====================================================

-- Clear existing data (optional - uncomment if needed)
-- TRUNCATE TABLE event_registrations CASCADE;
-- TRUNCATE TABLE event_registration_forms CASCADE;
-- TRUNCATE TABLE events CASCADE;

-- =====================================================
-- 1. COMPLETED EVENT (Regular - No Custom Form)
-- =====================================================
INSERT INTO events (
  title,
  description,
  poster_url,
  status,
  event_date,
  event_end_date,
  venue,
  category,
  is_registration_open,
  registration_start_date,
  registration_end_date,
  max_participants,
  current_participants,
  tags,
  is_active
) VALUES (
  'Web Development Basics',
  'A comprehensive workshop covering HTML, CSS, and JavaScript fundamentals. Perfect for beginners starting their web development journey.',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
  'completed',
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '30 days' + INTERVAL '6 hours',
  'Computer Lab, Building A',
  'workshop',
  false,
  NOW() - INTERVAL '45 days',
  NOW() - INTERVAL '32 days',
  50,
  42,
  ARRAY['web-development', 'html', 'css', 'javascript', 'beginner'],
  true
) RETURNING id AS completed_event_1_id;

-- =====================================================
-- 2. COMPLETED EVENT (With Custom Form Fields)
-- =====================================================
INSERT INTO events (
  title,
  description,
  poster_url,
  status,
  event_date,
  event_end_date,
  venue,
  category,
  is_registration_open,
  registration_start_date,
  registration_end_date,
  max_participants,
  current_participants,
  tags,
  is_active
) VALUES (
  'AI & Machine Learning Summit',
  'An advanced conference on artificial intelligence, machine learning, and deep learning. Features talks from industry experts and hands-on coding sessions.',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
  'completed',
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '15 days' + INTERVAL '8 hours',
  'Grand Hall, Convention Center',
  'conference',
  false,
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '17 days',
  200,
  187,
  ARRAY['ai', 'machine-learning', 'deep-learning', 'data-science', 'advanced'],
  true
) RETURNING id AS completed_event_2_id;

-- Insert custom form fields for the AI Summit event
INSERT INTO event_registration_forms (event_id, form_fields)
SELECT 
  id,
  '[
    {
      "name": "user_name",
      "label": "Full Name",
      "type": "text",
      "required": true,
      "placeholder": "Enter your full name"
    },
    {
      "name": "user_email",
      "label": "Email Address",
      "type": "email",
      "required": true,
      "placeholder": "Enter your email"
    },
    {
      "name": "user_phone",
      "label": "Phone Number",
      "type": "tel",
      "required": false,
      "placeholder": "+1234567890"
    },
    {
      "name": "linkedin_profile",
      "label": "LinkedIn Profile URL",
      "type": "text",
      "required": true,
      "placeholder": "https://linkedin.com/in/yourprofile"
    },
    {
      "name": "github_username",
      "label": "GitHub Username",
      "type": "text",
      "required": false,
      "placeholder": "your-github-username"
    },
    {
      "name": "experience_level",
      "label": "Experience Level",
      "type": "select",
      "required": true,
      "options": ["Beginner", "Intermediate", "Advanced", "Expert"],
      "placeholder": "Select your level"
    },
    {
      "name": "portfolio_url",
      "label": "Portfolio Website",
      "type": "text",
      "required": false,
      "placeholder": "https://yourportfolio.com"
    },
    {
      "name": "why_attend",
      "label": "Why do you want to attend?",
      "type": "textarea",
      "required": true,
      "placeholder": "Tell us about your interest in AI/ML..."
    }
  ]'::JSONB
FROM events
WHERE title = 'AI & Machine Learning Summit'
LIMIT 1;

-- =====================================================
-- 3. UPCOMING EVENT (Registration Closed)
-- =====================================================
INSERT INTO events (
  title,
  description,
  poster_url,
  status,
  event_date,
  event_end_date,
  venue,
  category,
  is_registration_open,
  registration_start_date,
  registration_end_date,
  max_participants,
  current_participants,
  tags,
  is_active
) VALUES (
  'React Masterclass',
  'Master React.js with advanced concepts including hooks, context API, state management, and performance optimization. For developers with intermediate React experience.',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
  'upcoming',
  NOW() + INTERVAL '25 days',
  NOW() + INTERVAL '25 days' + INTERVAL '7 hours',
  'Tech Hub, Building B',
  'workshop',
  false,
  NOW() - INTERVAL '5 days',
  NOW() + INTERVAL '20 days',
  75,
  75,
  ARRAY['react', 'javascript', 'frontend', 'intermediate'],
  true
);

-- =====================================================
-- 4. ONGOING EVENT (Try On Spot = True - Has Available Spots)
-- =====================================================
INSERT INTO events (
  title,
  description,
  poster_url,
  status,
  event_date,
  event_end_date,
  venue,
  category,
  is_registration_open,
  registration_start_date,
  registration_end_date,
  max_participants,
  current_participants,
  tags,
  is_active
) VALUES (
  'Python Programming Workshop',
  'Learn Python from scratch! Covering basics, data structures, OOP, and practical projects. Bring your laptop for hands-on coding.',
  'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=600&fit=crop',
  'ongoing',
  NOW() - INTERVAL '2 hours',
  NOW() + INTERVAL '4 hours',
  'Programming Lab, Building C',
  'workshop',
  false,
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '1 day',
  60,
  45,
  ARRAY['python', 'programming', 'beginner', 'coding'],
  true
);

-- =====================================================
-- 5. ONGOING EVENT (Try On Spot = False - Event Full)
-- =====================================================
INSERT INTO events (
  title,
  description,
  poster_url,
  status,
  event_date,
  event_end_date,
  venue,
  category,
  is_registration_open,
  registration_start_date,
  registration_end_date,
  max_participants,
  current_participants,
  tags,
  is_active
) VALUES (
  'DevOps Conference 2024',
  'Learn CI/CD, Docker, Kubernetes, and cloud deployment strategies. Industry experts share best practices and real-world experiences.',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
  'ongoing',
  NOW() - INTERVAL '4 hours',
  NOW() + INTERVAL '2 hours',
  'Conference Hall, Main Building',
  'conference',
  false,
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '3 days',
  150,
  150,
  ARRAY['devops', 'docker', 'kubernetes', 'ci-cd', 'cloud'],
  true
);

-- =====================================================
-- 6. ONGOING EVENT (Try On Spot = True - No Max Participants)
-- =====================================================
INSERT INTO events (
  title,
  description,
  poster_url,
  status,
  event_date,
  event_end_date,
  venue,
  category,
  is_registration_open,
  registration_start_date,
  registration_end_date,
  max_participants,
  current_participants,
  tags,
  is_active
) VALUES (
  'Open Source Contribution Meetup',
  'Join us for an informal meetup about contributing to open source projects. No registration limit - everyone is welcome!',
  'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=600&fit=crop',
  'ongoing',
  NOW() - INTERVAL '1 hour',
  NOW() + INTERVAL '3 hours',
  'Community Room, Building A',
  'meetup',
  false,
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '1 day',
  NULL,
  28,
  ARRAY['open-source', 'community', 'meetup', 'collaboration'],
  true
);

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check all events
SELECT 
  title,
  status,
  is_registration_open,
  event_date,
  event_end_date,
  current_participants,
  max_participants,
  CASE 
    WHEN status = 'ongoing' AND (max_participants IS NULL OR current_participants < max_participants) THEN true
    WHEN status = 'ongoing' AND current_participants >= max_participants THEN false
    ELSE NULL
  END AS try_on_spot
FROM events
ORDER BY status, event_date DESC;

-- Check events with custom forms
SELECT 
  e.title,
  e.status,
  erf.form_fields
FROM events e
LEFT JOIN event_registration_forms erf ON e.id = erf.event_id
WHERE erf.form_fields IS NOT NULL;

