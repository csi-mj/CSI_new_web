# CSI Admin Portal — Setup Guide

The admin portal lives at **`/admin`**. Follow these steps once to activate it.

## 1. Run the database setup

1. Open your Supabase project → **SQL Editor**.
2. Open `database/admin_portal_setup.sql` from this repo.
3. **Edit line ~15**: replace `studyonaffan@gmail.com` if you want a different first admin.
4. Note: the seed section contains `DELETE FROM csi_team;` — comment it out if you already have team data in Supabase you want to keep.
5. Paste and run the whole file.

This creates: `admin_users`, `magazines`, `resources` tables, new columns on `csi_team`
(`portfolio`, `gb_position`, `team_year`), a public `media` storage bucket, and seeds all
current team members / magazines / resources from the old hardcoded data.

## 2. Enable Google login in Supabase

1. Supabase → **Authentication → Sign In / Up → Google** → Enable.
2. You need Google OAuth credentials:
   - Go to https://console.cloud.google.com → APIs & Services → Credentials.
   - Create an **OAuth client ID** (type: Web application).
   - Authorized redirect URI: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
     (shown in the Supabase Google provider settings).
   - Copy the Client ID + Secret into Supabase.
3. Supabase → **Authentication → URL Configuration**:
   - Site URL: `https://csi-mjcet.in`
   - Redirect URLs: add `https://csi-mjcet.in/auth/callback` and `http://localhost:3000/auth/callback`

## 3. Environment variables

Add to `.env.local` (and to Vercel → Project → Settings → Environment Variables):

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co   (already set)
SUPABASE_SERVICE_ROLE_KEY=...                                    (already set)
NEXT_PUBLIC_SUPABASE_ANON_KEY=...                                (NEW — Supabase → Settings → API → anon public key)
```

## 4. Test locally

```
npm install        # picks up @supabase/ssr
npm run dev
```

Visit `http://localhost:3000/admin` → you should be redirected to the login page →
sign in with the Google account you added in step 1.

## How it works

- **Access**: only emails in the `admin_users` table can use the portal. Manage them in the **Admins** tab.
- **Team**: add/edit/delete members, upload photos, set LinkedIn/GitHub. **Archive current team** marks everyone
  as previous team so you can add the new year's team. "Show previous teams" lets you view/restore archived members.
- **Events**: create events, upload posters, and move them between upcoming / ongoing / completed with one dropdown.
- **Magazines**: upload a cover image + PDF to publish a new edition.
- **Resources**: add/edit resource cards with image + PDF (or external link).
- All uploads go to the public `media` bucket in Supabase Storage.
- The public site (Team / Events / Magazine / Resources pages) reads from the database and
  falls back to the old bundled data only if the database is empty or unreachable.
