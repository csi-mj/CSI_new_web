# CSI MJCET Website

Official website of the **Computer Society of India — MJCET Student Chapter**, live at [csi-mjcet.in](https://csi-mjcet.in).

Built with **Next.js 15** (App Router) · **Supabase** (database, auth, storage) · **Tailwind CSS** · deployed on **Vercel**.

---

## 🔑 Accounts (important!)

All infrastructure runs under the club account **`csi@mjcollege.ac.in`**:

| Service  | What it holds                                             | Login                 |
| -------- | --------------------------------------------------------- | --------------------- |
| Supabase | Database (team, events, magazines, resources), file storage, Google login | csi@mjcollege.ac.in |
| Vercel   | Hosting + deployments + environment variables              | csi@mjcollege.ac.in |
| GitHub   | This repo (`csi-mj/CSI_new_web`)                           | org: csi-mj           |

> Credentials for the club account are handed over from each Chief Coordinator to the next. If you're a new coordinator and don't have them, ask your predecessor or the faculty coordinator.

---

## 🚀 Running locally

```bash
git clone https://github.com/csi-mj/CSI_new_web.git
cd CSI_new_web
npm install
```

Create your env file:

```bash
copy .env.example .env.local    # Windows (use cp on Mac/Linux)
```

Fill in the three values from **Supabase Dashboard → Project Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=        # https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # anon / public key
SUPABASE_SERVICE_ROLE_KEY=       # service_role key (SECRET — never commit, never expose)
```

Then:

```bash
npm run dev
```

Site: http://localhost:3000 · Admin portal: http://localhost:3000/admin

> **First-time Supabase setup** (new project only): run `database/schema.sql` then
> `database/admin_portal_setup.sql` in the Supabase SQL Editor, and enable the Google
> auth provider. Full walkthrough in [`ADMIN_SETUP.md`](./ADMIN_SETUP.md).

---

## 🛠 Admin Portal (`/admin`)

A private dashboard for managing the whole website **without touching code**. Changes go live immediately — no redeploy needed.

### Access
- Sign in with Google at `/admin/login`.
- Only emails listed in the `admin_users` table get in; everyone else sees "Access denied".
- Admins are managed from the portal itself (**Admins** tab) — add a Gmail address to grant access, remove to revoke. You cannot remove yourself.

### Team
- Add / edit / delete members in three groups: **Governing Body**, **Core Team**, **Executive Committee**.
- Upload member photos (stored in Supabase Storage).
- Set position, portfolio (used for grouping/tabs on the site), LinkedIn, GitHub, email, and team year.
- **Archive current team** — one click marks every active member as "previous team" so you can add the new year's team. Archived members are kept forever: view them with **Show previous teams**, restore anyone individually.

### Events
- Create events with poster upload, description, venue, category, and start/end dates.
- **Status is automatic from dates**: upcoming (before start) → ongoing (between start & end) → completed (after end). No manual moving needed.
- The only manual action is **Cancel event** (and Restore) — cancelled events disappear from the site.
- Filter tabs let you view events by computed status.

### Magazines
- Publish a new edition by uploading a cover image + the PDF.
- Edit titles/descriptions, control display order, delete old entries.

### Resources
- Add resource cards (title, description, card image) with either an uploaded PDF or an external link.
- Control display order; edit or remove existing cards.

### Admins
- Add/remove admin emails. Every admin can manage other admins.

### How data flows
Public pages (Team, Events, Magazine, Resources) read from Supabase through API routes.
If the database is unreachable, they fall back to bundled data in the repo (`app/*/_data/`)
so the site never breaks. Uploaded files live in the public `media` bucket in Supabase Storage.

---

## 📦 Deployment

- Pushing to the production branch on GitHub triggers a Vercel deploy automatically.
- The three environment variables must also be set in **Vercel → Project → Settings → Environment Variables** (same values as `.env.local`).
- After changing env vars in Vercel, redeploy for them to take effect.
- For Google login in production, make sure Supabase → Authentication → URL Configuration has Site URL `https://csi-mjcet.in` and redirect URL `https://csi-mjcet.in/auth/callback`.

## 🔍 SEO

- Metadata, Open Graph, and per-page titles are defined in `app/layout.tsx` and each page's `layout.tsx`.
- `app/sitemap.ts` and `app/robots.ts` auto-generate `/sitemap.xml` and `/robots.txt`.
- Organization JSON-LD structured data is embedded in the root layout.
- Search Console property is managed under the club Google account.

## 📁 Key folders

```
app/               pages (App Router)
app/admin/         admin portal UI
app/api/           public + admin API routes
components/        shared UI components
database/          SQL setup files for Supabase
lib/               Supabase clients, auth helpers, utilities
public/            static assets (images, PDFs, logos)
```

---

Maintained by the CSI MJCET tech team. Questions → csi@mjcollege.ac.in
