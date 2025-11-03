# API Testing Documentation

This document contains all API endpoint requests and responses for testing the CSI Events system.

**Base URL:** `http://localhost:3001`

---

## 1. GET /api/events - Event Metadata

### Request
```bash
curl http://localhost:3001/api/events
```

### Response
```json
{
  "success": true,
  "data": {
    "total_events": 6,
    "upcoming_count": 1,
    "completed_count": 2,
    "ongoing_count": 3,
    "cancelled_count": 0,
    "total_registrations": 527,
    "upcoming_with_registration_open": 0,
    "last_updated": "2025-11-03T10:09:25.733Z"
  }
}
```

---

## 2. GET /api/events/upcoming - Upcoming Events

### Request
```bash
curl http://localhost:3001/api/events/upcoming
```

### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "cf51f448-1de4-45e1-b483-812663658d03",
      "title": "React Masterclass",
      "description": "Master React.js with advanced concepts including hooks, context API, state management, and performance optimization. For developers with intermediate React experience.",
      "poster_url": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop",
      "status": "upcoming",
      "event_date": "2025-11-28T10:08:30.119521+00:00",
      "event_end_date": "2025-11-28T17:08:30.119521+00:00",
      "venue": "Tech Hub, Building B",
      "category": "workshop",
      "is_registration_open": false,
      "registration_start_date": "2025-10-29T10:08:30.119521+00:00",
      "registration_end_date": "2025-11-23T10:08:30.119521+00:00",
      "max_participants": 75,
      "current_participants": 75,
      "tags": ["react", "javascript", "frontend", "intermediate"],
      "spots_remaining": 0,
      "days_until_event": 25
    }
  ]
}
```

**Scenario:** Upcoming event with registration closed (event full - 75/75 participants)

---

## 3. GET /api/events/ongoing - Ongoing Events

### Request
```bash
curl http://localhost:3001/api/events/ongoing
```

### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "db21ef9d-7a52-47c6-9e4a-0d7ff13e8683",
      "title": "Open Source Contribution Meetup",
      "description": "Join us for an informal meetup about contributing to open source projects. No registration limit - everyone is welcome!",
      "poster_url": "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=600&fit=crop",
      "status": "ongoing",
      "event_date": "2025-11-03T09:08:30.119521+00:00",
      "event_end_date": "2025-11-03T13:08:30.119521+00:00",
      "venue": "Community Room, Building A",
      "category": "meetup",
      "current_participants": 28,
      "max_participants": null,
      "tags": ["open-source", "community", "meetup", "collaboration"],
      "started_at": "2025-11-03T09:08:30.119521+00:00",
      "ends_at": "2025-11-03T13:08:30.119521+00:00",
      "hours_remaining": 3,
      "registration_status": "closed",
      "try_on_spot": true
    },
    {
      "id": "96c23541-43f7-4af2-97c8-80f31e7fb3ce",
      "title": "Python Programming Workshop",
      "description": "Learn Python from scratch! Covering basics, data structures, OOP, and practical projects. Bring your laptop for hands-on coding.",
      "poster_url": "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=600&fit=crop",
      "status": "ongoing",
      "event_date": "2025-11-03T08:08:30.119521+00:00",
      "event_end_date": "2025-11-03T14:08:30.119521+00:00",
      "venue": "Programming Lab, Building C",
      "category": "workshop",
      "current_participants": 45,
      "max_participants": 60,
      "tags": ["python", "programming", "beginner", "coding"],
      "started_at": "2025-11-03T08:08:30.119521+00:00",
      "ends_at": "2025-11-03T14:08:30.119521+00:00",
      "hours_remaining": 4,
      "registration_status": "closed",
      "try_on_spot": true
    },
    {
      "id": "37a37422-62ca-4800-bdf5-562130a7aea2",
      "title": "DevOps Conference 2024",
      "description": "Learn CI/CD, Docker, Kubernetes, and cloud deployment strategies. Industry experts share best practices and real-world experiences.",
      "poster_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      "status": "ongoing",
      "event_date": "2025-11-03T06:08:30.119521+00:00",
      "event_end_date": "2025-11-03T12:08:30.119521+00:00",
      "venue": "Conference Hall, Main Building",
      "category": "conference",
      "current_participants": 150,
      "max_participants": 150,
      "tags": ["devops", "docker", "kubernetes", "ci-cd", "cloud"],
      "started_at": "2025-11-03T06:08:30.119521+00:00",
      "ends_at": "2025-11-03T12:08:30.119521+00:00",
      "hours_remaining": 2,
      "registration_status": "closed",
      "try_on_spot": false
    }
  ]
}
```

**Scenarios:**
1. **try_on_spot: true (No max limit)** - Open Source Meetup (28 participants, no max limit)
2. **try_on_spot: true (Has spots)** - Python Workshop (45/60 participants, 15 spots available)
3. **try_on_spot: false (Event full)** - DevOps Conference (150/150 participants, event full)

---

## 4. GET /api/events/completed - Completed Events

### Request
```bash
curl http://localhost:3001/api/events/completed
```

### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "44bb7089-bb67-4ce1-a73a-a79e6a69d028",
      "title": "AI & Machine Learning Summit",
      "description": "An advanced conference on artificial intelligence, machine learning, and deep learning. Features talks from industry experts and hands-on coding sessions.",
      "poster_url": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
      "status": "completed",
      "event_date": "2025-10-19T10:08:30.119521+00:00",
      "event_end_date": "2025-10-19T18:08:30.119521+00:00",
      "venue": "Grand Hall, Convention Center",
      "category": "conference",
      "current_participants": 187,
      "max_participants": 200,
      "tags": ["ai", "machine-learning", "deep-learning", "data-science", "advanced"],
      "completed_at": "2025-10-19T18:08:30.119521+00:00",
      "days_since_completed": 14
    },
    {
      "id": "c1c3c09f-8683-4cb4-987c-2fed88bed734",
      "title": "Web Development Basics",
      "description": "A comprehensive workshop covering HTML, CSS, and JavaScript fundamentals. Perfect for beginners starting their web development journey.",
      "poster_url": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
      "status": "completed",
      "event_date": "2025-10-04T10:08:30.119521+00:00",
      "event_end_date": "2025-10-04T16:08:30.119521+00:00",
      "venue": "Computer Lab, Building A",
      "category": "workshop",
      "current_participants": 42,
      "max_participants": 50,
      "tags": ["web-development", "html", "css", "javascript", "beginner"],
      "completed_at": "2025-10-04T16:08:30.119521+00:00",
      "days_since_completed": 29
    }
  ]
}
```

**Scenarios:**
1. **Completed event with custom form fields** - AI & Machine Learning Summit (187/200 participants)
2. **Completed event without custom form** - Web Development Basics (42/50 participants)

---

## 5. GET /api/events/[id]/registration-form - Get Registration Form

### Scenario 5.1: Event with Custom Form Fields

**Event ID:** `44bb7089-bb67-4ce1-a73a-a79e6a69d028` (AI & Machine Learning Summit)

#### Request
```bash
curl http://localhost:3001/api/events/44bb7089-bb67-4ce1-a73a-a79e6a69d028/registration-form
```

#### Response
```json
{
  "success": true,
  "data": {
    "event_id": "44bb7089-bb67-4ce1-a73a-a79e6a69d028",
    "form_fields": [
      {
        "name": "user_name",
        "type": "text",
        "label": "Full Name",
        "required": true,
        "placeholder": "Enter your full name"
      },
      {
        "name": "user_email",
        "type": "email",
        "label": "Email Address",
        "required": true,
        "placeholder": "Enter your email"
      },
      {
        "name": "user_phone",
        "type": "tel",
        "label": "Phone Number",
        "required": false,
        "placeholder": "+1234567890"
      },
      {
        "name": "linkedin_profile",
        "type": "text",
        "label": "LinkedIn Profile URL",
        "required": true,
        "placeholder": "https://linkedin.com/in/yourprofile"
      },
      {
        "name": "github_username",
        "type": "text",
        "label": "GitHub Username",
        "required": false,
        "placeholder": "your-github-username"
      },
      {
        "name": "experience_level",
        "type": "select",
        "label": "Experience Level",
        "options": ["Beginner", "Intermediate", "Advanced", "Expert"],
        "required": true,
        "placeholder": "Select your level"
      },
      {
        "name": "portfolio_url",
        "type": "text",
        "label": "Portfolio Website",
        "required": false,
        "placeholder": "https://yourportfolio.com"
      },
      {
        "name": "why_attend",
        "type": "textarea",
        "label": "Why do you want to attend?",
        "required": true,
        "placeholder": "Tell us about your interest in AI/ML..."
      }
    ]
  }
}
```

### Scenario 5.2: Event with Default Form Fields

**Event ID:** `c1c3c09f-8683-4cb4-987c-2fed88bed734` (Web Development Basics)

#### Request
```bash
curl http://localhost:3001/api/events/c1c3c09f-8683-4cb4-987c-2fed88bed734/registration-form
```

#### Response
```json
{
  "success": true,
  "data": {
    "event_id": "c1c3c09f-8683-4cb4-987c-2fed88bed734",
    "form_fields": [
      {
        "name": "user_name",
        "label": "Full Name",
        "type": "text",
        "required": true,
        "placeholder": "Enter your full name"
      },
      {
        "name": "user_email",
        "label": "Email",
        "type": "email",
        "required": true,
        "placeholder": "Enter your email address"
      },
      {
        "name": "user_phone",
        "label": "Phone Number",
        "type": "tel",
        "required": false,
        "placeholder": "Enter your phone number"
      },
      {
        "name": "user_college",
        "label": "College Name",
        "type": "text",
        "required": false,
        "placeholder": "Enter your college name"
      },
      {
        "name": "user_year",
        "label": "Year of Study",
        "type": "select",
        "required": false,
        "options": ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate"],
        "placeholder": "Select your year"
      }
    ]
  }
}
```

### Scenario 5.3: Upcoming Event Form

**Event ID:** `cf51f448-1de4-45e1-b483-812663658d03` (React Masterclass)

#### Request
```bash
curl http://localhost:3001/api/events/cf51f448-1de4-45e1-b483-812663658d03/registration-form
```

#### Response
Same structure as Scenario 5.2 (default form fields)

---

## 6. POST /api/events/[id]/register - Register for Event

### Scenario 6.1: Register for Completed Event (Should Fail)

**Event ID:** `44bb7089-bb67-4ce1-a73a-a79e6a69d028` (AI & Machine Learning Summit - Completed)

**Note:** First, get the registration form to see what fields are required:
```bash
curl http://localhost:3001/api/events/44bb7089-bb67-4ce1-a73a-a79e6a69d028/registration-form
```

This event has custom form fields. Registration request should include ALL form fields:

#### Request (Complete Form Data with Custom Fields)
```bash
curl -X POST http://localhost:3001/api/events/44bb7089-bb67-4ce1-a73a-a79e6a69d028/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "Test User",
    "user_email": "test@example.com",
    "user_phone": "+1234567890",
    "linkedin_profile": "https://linkedin.com/in/testuser",
    "github_username": "testuser",
    "experience_level": "Intermediate",
    "portfolio_url": "https://testuser.dev",
    "why_attend": "I want to learn about AI and machine learning from experts"
  }'
```

#### Response
```json
{
  "success": false,
  "error": {
    "code": "REGISTRATION_CLOSED",
    "message": "Registration is not open for this event"
  }
}
```

**Note:** Registration fails because the event is completed and `is_registration_open = false`

---

### Scenario 6.2: Register for Upcoming Event with Registration Closed (Should Fail)

**Event ID:** `cf51f448-1de4-45e1-b483-812663658d03` (React Masterclass - Upcoming)

**Note:** First, get the registration form to see what fields are required:
```bash
curl http://localhost:3001/api/events/cf51f448-1de4-45e1-b483-812663658d03/registration-form
```

This event uses default form fields. Registration request should include all form fields:

#### Request (Complete Default Form Data)
```bash
curl -X POST http://localhost:3001/api/events/cf51f448-1de4-45e1-b483-812663658d03/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "Test User",
    "user_email": "test@example.com",
    "user_phone": "+1234567890",
    "user_college": "MJCET",
    "user_year": "3rd Year"
  }'
```

#### Response
```json
{
  "success": false,
  "error": {
    "code": "REGISTRATION_CLOSED",
    "message": "Registration is not open for this event"
  }
}
```

**Note:** Registration fails because `is_registration_open = false` and the event is already full (75/75)

---

### Scenario 6.3: Register for Ongoing Event (Should Fail)

**Event ID:** `db21ef9d-7a52-47c6-9e4a-0d7ff13e8683` (Open Source Meetup - Ongoing)

**Note:** First, get the registration form to see what fields are required:
```bash
curl http://localhost:3001/api/events/db21ef9d-7a52-47c6-9e4a-0d7ff13e8683/registration-form
```

This event uses default form fields. Registration request should include all form fields:

#### Request (Complete Form Data)
```bash
curl -X POST http://localhost:3001/api/events/db21ef9d-7a52-47c6-9e4a-0d7ff13e8683/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "John Doe",
    "user_email": "john.doe@example.com",
    "user_phone": "+1234567890",
    "user_college": "MJCET",
    "user_year": "3rd Year"
  }'
```

#### Response
```json
{
  "success": false,
  "error": {
    "code": "REGISTRATION_CLOSED",
    "message": "Registration is not open for this event"
  }
}
```

**Note:** Registration fails because ongoing events always have `is_registration_open = false`. Users need to register on-the-spot at the venue. However, the request shows the proper format with all form fields filled.

---

### Scenario 6.4: Register for Event with Custom Form Fields (Complete Example)

**Event ID:** `44bb7089-bb67-4ce1-a73a-a79e6a69d028` (AI & Machine Learning Summit - Completed, has custom form)

**Step 1:** Get the registration form to see all required fields:
```bash
curl http://localhost:3001/api/events/44bb7089-bb67-4ce1-a73a-a79e6a69d028/registration-form
```

The form returns custom fields including: LinkedIn profile, GitHub username, experience level, portfolio URL, and why_attend (textarea).

**Step 2:** Register with ALL form fields filled (matching the form structure):

#### Request (Complete Custom Form Data)
```bash
curl -X POST http://localhost:3001/api/events/44bb7089-bb67-4ce1-a73a-a79e6a69d028/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "Jane Smith",
    "user_email": "jane.smith@example.com",
    "user_phone": "+1234567890",
    "linkedin_profile": "https://linkedin.com/in/janesmith",
    "github_username": "janesmith",
    "experience_level": "Intermediate",
    "portfolio_url": "https://janesmith.dev",
    "why_attend": "I am passionate about AI and machine learning. I want to learn from industry experts and network with like-minded professionals. This conference will help me advance my career in data science."
  }'
```

#### Response
```json
{
  "success": false,
  "error": {
    "code": "REGISTRATION_CLOSED",
    "message": "Registration is not open for this event"
  }
}
```

**Note:** This example shows how to properly fill out ALL form fields from the registration form endpoint. The custom fields (linkedin_profile, github_username, experience_level, portfolio_url, why_attend) would be stored in the `additional_info` JSONB column. In a real scenario with registration open, this would succeed.

---

### Scenario 6.5: Successful Registration Example (If Registration Was Open)

**Note:** This is a hypothetical example showing what a successful registration looks like with complete form data.

#### Request
```bash
curl -X POST http://localhost:3001/api/events/EVENT_ID_WITH_OPEN_REGISTRATION/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "John Doe",
    "user_email": "john.doe@example.com",
    "user_phone": "+1234567890",
    "user_college": "MJCET",
    "user_year": "3rd Year",
    "linkedin_profile": "https://linkedin.com/in/johndoe",
    "github_username": "johndoe",
    "experience_level": "Intermediate",
    "portfolio_url": "https://johndoe.dev",
    "why_attend": "Want to learn and contribute to open source projects"
  }'
```

#### Expected Success Response
```json
{
  "success": true,
  "data": {
    "registration_id": "8a462336-463b-4f8a-a546-d27e647e6ad4",
    "status": "pending",
    "message": "Registration successful! Confirmation details will be sent to your email."
  }
}
```

**Data Storage:**
- Standard fields → Database columns: `user_name`, `user_email`, `user_phone`, `user_college`, `user_year`
- Extra fields → `additional_info` JSONB: `{"linkedin_profile": "...", "github_username": "...", "experience_level": "...", "portfolio_url": "...", "why_attend": "..."}`

---

### Scenario 6.6: Duplicate Registration (Should Fail)

**Event ID:** `db21ef9d-7a52-47c6-9e4a-0d7ff13e8683` (After successful registration in 6.5)

#### Request (Trying to register again with same email)
```bash
curl -X POST http://localhost:3001/api/events/db21ef9d-7a52-47c6-9e4a-0d7ff13e8683/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "Jane Smith",
    "user_email": "jane.smith@example.com",
    "user_phone": "+1234567890",
    "user_college": "MJCET",
    "user_year": "3rd Year"
  }'
```

#### Response
```json
{
  "success": false,
  "error": {
    "code": "ALREADY_REGISTERED",
    "message": "You are already registered for this event"
  }
}
```

---

## Error Codes Reference

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `EVENT_NOT_FOUND` | 404 | Event with given ID does not exist or is inactive |
| `REGISTRATION_CLOSED` | 400 | Registration is not open for this event |
| `REGISTRATION_NOT_STARTED` | 400 | Registration period has not started yet |
| `REGISTRATION_ENDED` | 400 | Registration period has ended |
| `EVENT_COMPLETED` | 400 | Cannot register for a completed event |
| `EVENT_FULL` | 400 | Event has reached maximum capacity |
| `ALREADY_REGISTERED` | 409 | User with this email is already registered |
| `VALIDATION_ERROR` | 400 | Request body validation failed |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Summary of Test Scenarios

### Completed Events (2)
- ✅ Web Development Basics - Default form, no custom fields
- ✅ AI & Machine Learning Summit - Custom form with LinkedIn, GitHub, experience level, portfolio, etc.

### Upcoming Events (1)
- ✅ React Masterclass - Registration closed, event full (75/75)

### Ongoing Events (3)
- ✅ Open Source Meetup - `try_on_spot: true` (no max limit, 28 participants)
- ✅ Python Workshop - `try_on_spot: true` (45/60 participants, 15 spots available)
- ✅ DevOps Conference - `try_on_spot: false` (150/150 participants, event full)

### Registration Scenarios Tested
- ✅ Get form for event with custom fields
- ✅ Get form for event with default fields
- ✅ Try to register for completed event (fails)
- ✅ Try to register when registration is closed (fails)
- ✅ Try to register for ongoing event (fails - registration always closed)
- ✅ Duplicate registration prevention (fails)

---

## Notes

1. **Registration for Ongoing Events:** Online registration is always closed for ongoing events. Users must register on-the-spot at the venue if `try_on_spot: true` and spots are available.

2. **Custom Form Fields:** Events can have custom form fields stored in the `event_registration_forms` table. If no custom form exists, default form fields are returned.

3. **Extra Fields:** Any fields beyond standard ones (user_name, user_email, user_phone, user_college, user_year) are automatically stored in the `additional_info` JSONB column.

4. **Status Calculation:**
   - **Upcoming:** `event_date > NOW()`
   - **Ongoing:** `event_date <= NOW() AND event_end_date >= NOW()`
   - **Completed:** `event_end_date < NOW()`

5. **Try On Spot Logic:**
   - `true` if `max_participants IS NULL` OR `current_participants < max_participants`
   - `false` if `current_participants >= max_participants`

