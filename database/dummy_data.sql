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

-- =====================================================
-- Team Dummy Data
-- =====================================================

-- GB (Governing Body) Members
INSERT INTO csi_team (sno, name, position, role, image_url, linkedin, github, mail, is_active) VALUES
(1, 'Dr. John Smith', 'Chairperson', 'gb', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face', 'https://linkedin.com/in/johnsmith', 'https://github.com/johnsmith', 'john.smith@mjcollege.ac.in', true),
(2, 'Dr. Sarah Johnson', 'Vice Chairperson', 'gb', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&crop=face', 'https://linkedin.com/in/sarahjohnson', 'https://github.com/sarahjohnson', 'sarah.johnson@mjcollege.ac.in', true),
(3, 'Dr. Michael Chen', 'Secretary', 'gb', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face', 'https://linkedin.com/in/michaelchen', 'https://github.com/michaelchen', 'michael.chen@mjcollege.ac.in', true);

-- Core Team Members
INSERT INTO csi_team (sno, name, position, role, image_url, linkedin, github, mail, is_active) VALUES
(1, 'Alex Kumar', 'Technical Lead', 'core', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face', 'https://linkedin.com/in/alexkumar', 'https://github.com/alexkumar', 'alex.kumar@mjcollege.ac.in', true),
(2, 'Priya Sharma', 'Web Development Lead', 'core', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=face', 'https://linkedin.com/in/priyasharma', 'https://github.com/priyasharma', 'priya.sharma@mjcollege.ac.in', true),
(3, 'Rahul Mehta', 'Mobile Development Lead', 'core', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face', 'https://linkedin.com/in/rahulmehta', 'https://github.com/rahulmehta', 'rahul.mehta@mjcollege.ac.in', true),
(4, 'Anjali Patel', 'Design Lead', 'core', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face', 'https://linkedin.com/in/anjalipatel', 'https://github.com/anjalipatel', 'anjali.patel@mjcollege.ac.in', true),
(5, 'Vikram Singh', 'Content Lead', 'core', 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=500&fit=crop&crop=face', 'https://linkedin.com/in/vikramsingh', 'https://github.com/vikramsingh', 'vikram.singh@mjcollege.ac.in', true);

-- Execom (Executive Committee) Members
INSERT INTO csi_team (sno, name, position, role, image_url, linkedin, github, mail, is_active) VALUES
(1, 'Sneha Reddy', 'Event Coordinator', 'execom', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face', 'https://linkedin.com/in/snehareddy', 'https://github.com/snehareddy', 'sneha.reddy@mjcollege.ac.in', true),
(2, 'Arjun Nair', 'Marketing Head', 'execom', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop&crop=face', 'https://linkedin.com/in/arjunnair', 'https://github.com/arjunnair', 'arjun.nair@mjcollege.ac.in', true),
(3, 'Meera Iyer', 'Social Media Manager', 'execom', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=500&fit=crop&crop=face', 'https://linkedin.com/in/meeraiyer', 'https://github.com/meeraiyer', 'meera.iyer@mjcollege.ac.in', true),
(4, 'Karan Desai', 'Community Manager', 'execom', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face', 'https://linkedin.com/in/kardesai', 'https://github.com/kardesai', 'karan.desai@mjcollege.ac.in', true),
(5, 'Divya Agarwal', 'Outreach Coordinator', 'execom', 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400&h=500&fit=crop&crop=face', 'https://linkedin.com/in/divyaagarwal', 'https://github.com/divyaagarwal', 'divya.agarwal@mjcollege.ac.in', true);

-- Verification Query
SELECT 
  role,
  COUNT(*) as count,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_count
FROM csi_team
GROUP BY role
ORDER BY role;

