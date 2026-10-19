# n8n WhatsApp Webhook Integration — In-Depth Report

**Date:** 18 Oct 2026
**Scope:** Event registration form only — the only flow on the site where a ticket QR code is generated.

---

## 1. What this does

When a user successfully submits the **event registration form** (`/events/[id]/register`), the
website now delivers **one POST request** to your n8n webhook:

```
https://n8n-n8n.jchnju.easypanel.host/webhook/CSI_whatsapp_webhook
```

The request carries:

- **every field the user filled in** — the standard fields (name, email, phone, college, year,
  CSI-member claim) **plus every custom field** the admin built into that event's registration
  form (the dynamic form builder fields, flattened and flattened verbatim),
- **payment details** when the event is paid (mode, transaction ID, the uploaded payment
  screenshot's URL, fees),
- **event details** (title, date, end date, venue, category),
- **the registration's ID + status**, and
- **the ticket QR code as base64** — the *exact same* QR the ticket email uses
  (QuickChart PNG of the registration row's UUID).

From there, n8n does the WhatsApp automation — the website does nothing else.

## 2. Files changed (complete list — only 3)

| File | Change |
|---|---|
| `lib/webhook/registrationWebhook.ts` | **NEW** — the entire webhook logic, isolated in its own module |
| `app/api/events/[id]/register/route.ts` | 2 small touches (detailed in §4) |
| `.env.example` | 3 new optional override variables documented |

**Nothing else was touched.** No UI changes, no other API routes, no forms, no admin pages,
no database changes, no schema changes.

---

## 3. The new module — `lib/webhook/registrationWebhook.ts`

A single-purpose, self-contained module with two functions:

### `fetchQrCodeBase64(registrationId)`
- Fetches the QR PNG from QuickChart using the **exact same URL the ticket e-mail uses**
  (`https://quickchart.io/qr?text=<registration_id>&size=250&margin=2`) so the QR on WhatsApp
  is pixel-identical to the one in the emailed ticket and the scanner accepts it.
- Converts it to **raw base64** (not a data-URI — in n8n, prefix
  `data:image/png;base64,` or pass the string to a node that accepts raw base64).
- Has its own **8-second timeout** (`AbortController`).
- **Never throws** — on any failure (timeout, non-200, empty body, network error) it returns
  `null` + a human-readable `error` string describing exactly what went wrong.

### `sendRegistrationWebhook(...)`
- Builds the JSON payload (shape in §5).
- Adds **Basic auth**: user `CSI_webhook`, password `CSI2026`, sent as the standard
  `Authorization: Basic <base64(user:pass)>` header — matching your n8n Basic Auth credential
  exactly.
- POSTs with `Content-Type: application/json` and a **10-second timeout**.
- **Never throws.** Every failure mode is caught and logged to the server console under the
  tag `[registration-webhook]` with the registration ID and a diagnostic reason:
  - `[registration-webhook] QR generation failed, sending without QR: <reason>` — the webhook
    is **still delivered**, just with `qr_code_base64: null` and `qr_code_error` explaining why
    (an automation can still proceed using the registration ID / webhook data without the image).
  - `[registration-webhook] Webhook responded with HTTP <status> ...` — includes the first 500
    characters of n8n's response body in the log for easy debugging (e.g. auth failures show up here).
  - `[registration-webhook] Failed to deliver registration <id>: <reason>` — network/timeout failures.

### Deliberate design decisions
- **No retry.** A retry that succeeds twice = duplicate WhatsApp message to a real person.
  One attempt, one hard timeout, one clear log line if it fails. The registration itself is
  already safely in the database long before the webhook is attempted.
- **Credentials**: taken from environment variables **with built-in fallbacks** equal to the
  values in your screenshot, so the webhook works immediately in dev and production without
  configuring anything. If you ever rotate the password, set the env vars (§7) instead of
  editing code.

---

## 4. Changes inside the register route — `app/api/events/[id]/register/route.ts`

Two changes, both inert to the existing logic:

1. **The event SELECT now also reads 7 more columns** — `event_date, event_end_date, venue,
   category, is_paid, entry_fee, csi_entry_fee`. This is read-only: the same row that was
   already being fetched, just with more columns included, purely so the webhook can describe
   the event. No validation, condition, or query-parameter changed.

2. **After the successful database insert (and the participant counter increment), the webhook
   is scheduled with Next.js `after()`** (`import { after } from 'next/server'`):

   ```ts
   after(() => sendRegistrationWebhook(...));
   return successResponse({ registration_id: registration.id, ... });
   ```

   `after()` runs the webhook **after the HTTP response has already been sent** to the user.
   Consequences:
   - the user's registration success screen is **not delayed** by the webhook or the QR fetch,
     and
   - even a webhook that hangs for its full 10-second timeout cannot affect the registration
     response in any way.
   - the payload is assembled **before** the response is returned (all form data was already
     parsed into the DB payload and `additional_info`), so no request re-reads are needed.

   The trigger point is strictly: **successful insert → counter updated → webhook fires**.
   If registration fails for any reason (duplicate, closed, full, membership error, upload
   error, validation error) the webhook is **never fired** — exactly as you specified.

---

## 5. The exact payload n8n receives

```jsonc
{
  "type": "event_registration",
  "source": "csi-website",
  "webhook_sent_at": "2026-10-18T12:34:56.789Z",

  "event": {
    "id": "<event uuid>",
    "title": "Hack Revolution",
    "event_date": "2026-10-25T09:00:00+00:00",
    "event_end_date": "2026-10-25T17:00:00+00:00",
    "venue": "Auditorium, MJCET",
    "category": "hackathon"
  },

  "registration": {
    "id": "<registration uuid>",        // the same UUID encoded in the QR
    "status": "pending",                 // 'pending' | 'confirmed' | ...
    "submitted_at": "2026-10-18T12:34:56.500Z"
  },

  "form_data": {
    // Every field the user filled, flattened:
    "user_name": "Affan Ahmed",
    "user_email": "affan@example.com",
    "user_phone": "+918000000000",
    "user_college": "MJCET",
    "user_year": "3rd Year",
    "is_csi_member": true,               // boolean (parsed from Yes/true)
    // ...plus EVERY custom field from the admin's form builder, verbatim:
    "linkedin_profile": "https://linkedin.com/in/...",
    "team_size": "4",
    "github_username": "..."             // etc. — whatever fields that event's form has
  },

  "payment": {
    "is_paid": true,
    "entry_fee": 100,
    "csi_entry_fee": 50,
    "mode": "online",                    // 'online' | 'cash' | null
    "transaction_id": "UTR123456",       // | null
    "screenshot_url": "https://<supabase>/storage/v1/object/public/media/registrations/..." 
                                         // the uploaded proof-of-payment | null
  },

  "qr_code_base64": "iVBORw0KGgoAAAANSUhEUg...",   // raw base64 PNG (registration-id QR)
  "qr_code_error": null                             // or a reason string when QR failed
}
```

Optional-field guarantees:

| Situation | What n8n gets |
|---|---|
| Optional field left blank | the key with its value as submitted (`""` or whatever the browser sent) |
| Custom form field | key + value verbatim inside `form_data` |
| No payment screenshot uploaded | `payment.screenshot_url: null` |
| Free event | `payment` still present with `is_paid: false`, fees `null` |
| Cash payment | `mode: "cash"`, screenshot `null` is normal — not an error |
| QuickChart down / QR fetch failed | `qr_code_base64: null` **and** `qr_code_error: "<reason>"` — the webhook still arrives |
| Webhook itself unreachable / auth wrong | nothing crashes; logged in server console; registration unaffected |

---

## 6. Failure isolation — why nothing else can break

- The webhook lives **only** in `after()` on the success path of a single route.
- `sendRegistrationWebhook` has top-to-bottom try/catch: every await is guarded
  (QR fetch → try/catch, webhook POST → try/catch, even reading the response body is `.catch`ed).
- It cannot throw into the route, cannot roll back the registration, and cannot return an
  error to the user. Worst case of a total webhook outage: **a red log line in the Vercel
  function logs** and n8n misses one event — the website behaves identically to before.
- Registration failures (duplicates, closed events, membership problems) **never** trigger the
  webhook, because the trigger sits strictly after the successful DB insert.

---

## 7. Configuration (optional)

The webhook works with **zero configuration** — the URL and Basic auth credentials from your
screenshot are the code's defaults. If they ever need to be changed without a code edit, set
these in `.env.local` and in **Vercel → Settings → Environment Variables**:

```
CSI_WEBHOOK_URL=https://n8n-n8n.jchnju.easypanel.host/webhook/CSI_whatsapp_webhook
CSI_WEBHOOK_USERNAME=CSI_webhook
CSI_WEBHOOK_PASSWORD=CSI2026
```

(`.env.example` documents all three. They were also added there for new developers.)

⚠️ One honest security note: because the credentials also exist as code fallbacks, they are
visible to anyone with repo read access. That is normal for a student-club repo, but if you
prefer to keep them out of git, delete the fallback literals in
`lib/webhook/registrationWebhook.ts` (lines 15–17) and rely on the env vars alone.

---

## 8. How to test end-to-end

1. `npm run dev`, open an event with `is_registration_open = true`, and submit a registration.
2. Watch the terminal — on success you should see:
   `[registration-webhook] Delivered registration <uuid> (HTTP 200)`
3. In n8n, the `CSI_whatsapp_webhook` workflow receives the JSON from §5; build the WhatsApp
   message from `form_data` + `event` and attach the image by converting `qr_code_base64`
   (raw base64 PNG) with a **file-conversion / move-binary-data** step
   (mimeType `image/png`, encoding base64).
4. Failure drills (all safe):
   - Stop the n8n container → registrations keep succeeding; logs show the timeout/error line.
   - Break QuickChart temporarily → webhook arrives with `qr_code_base64: null`.
   - Use a wrong password in n8n's Basic Auth node → log shows `HTTP 401` with the body.

---

## 9. What was intentionally NOT changed

- Membership form, recruitment form, SIH form — no webhook (they never generate a QR).
- Ticket e-mail flow, QR scanner, participants table, registration validation — untouched.
- Database schema, RLS, storage — untouched.
- UI pages, styling, admin portal — untouched.
- The ticket e-mail's QR and this webhook's QR are identical because they encode the same
  registration UUID with the same generator, so whichever the user sees first (email or
  WhatsApp) gets scanned the same way at the venue.