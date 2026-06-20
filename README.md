# Dama Dental — AI-powered dental clinic platform (Ethiopia)

A patient portal, doctor dashboard, and admin panel for a dental clinic, built as a single
deployable app: **React + TypeScript (Vite)** on the frontend, **Vercel serverless functions**
for AI features, and **Supabase** for auth, database, and row-level security.

This README is also your step-by-step deployment guide — read **Part 2** when you're ready to ship.

---

## What's actually wired up vs. what's a starting point

To be upfront, so you know exactly what you're getting:

**Fully wired and working once you connect your own Supabase project:**
- Email/password auth (+ a Google sign-in button, needs the provider enabled in Supabase)
- Patient: book appointments, view appointment list with live status, AI symptom checker, AI chat
- Doctor: today's appointment list, write diagnosis, AI-drafted treatment plan, save medical record
- Admin: user list with role management, appointment volume chart, status breakdown
- AI chatbot, symptom checker, and treatment-plan generator — calling Google Gemini's free tier
  via Vercel serverless functions, with system prompts tuned for Ethiopian dental patterns
  (khat/chat-related gum wear, fluorosis in groundwater regions, coffee staining)
- Full SQL schema with row-level security policies (patients only see their own records, etc.)- Bilingual UI (English / Amharic) with a language toggle
- Installable PWA (offline shell, works on a flaky connection — except AI features, which need network)

**Scaffolded but needs your decisions before going live:**
- **Chapa / Telebirr payments** — these need a registered merchant account with each provider.
  There's no fake "Pay now" button in this build because a non-functional payment button is worse
  than no payment button. Once you have merchant credentials, this is a contained addition: a
  `Payment.tsx` page that redirects to Chapa's hosted checkout and a webhook to mark appointments paid.
- **SMS appointment reminders** — needs a Supabase Edge Function on a cron schedule plus an SMS
  provider (e.g. AfricasTalking, which has Ethiopian coverage, or Twilio). Not included because it
  needs your provider account and phone number first.
- **Real X-ray/photo uploads** — Supabase Storage is the right tool (bucket + RLS policy), not yet wired
  into the doctor's record form. Straightforward to add once you confirm a bucket name and file-size limits.
- **AI chat history** — the `ai_chat_sessions` / `ai_chat_messages` tables exist with RLS policies
  ready, but the chat widget currently keeps conversation only in memory (it resets on page reload).
  Wiring it to persist is a small addition in `ChatWidget.tsx` once you decide how long to retain
  patient conversations.

---

## Part 1 — Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in the values, see Part 2
npm run dev
```

The app expects a Supabase project and a Gemini API key to actually do anything beyond the
landing page — see Part 2 for both.

```bash
npm run build      # type-checks then builds to dist/
npm run preview    # serve the production build locally
```

---

## Part 2 — Deploy: Supabase + Vercel

### Step 1 — Create your Supabase project
1. Go to **supabase.com** → New project. Pick a region close to Ethiopia (e.g. `eu-central` or
   `ap-south`) for lower latency, and a strong database password (save it somewhere).
2. Once it's provisioned, open **SQL Editor** → New query, paste the entire contents of
   `supabase/migrations/0001_init.sql`, and click **Run**. This creates every table, the enums,
   the row-level security policies, and a trigger that auto-creates a `profiles` row for each new
   signup.
3. (Optional) Open `supabase/seed.sql` for commented examples of promoting a user to `doctor` or
   `admin` and seeding sample appointments — uncomment and fill in real UUIDs after you've
   registered at least one account through the app itself.
4. Go to **Authentication → Providers** and confirm **Email** is enabled. If you want the "Continue
   with Google" button to work, enable the **Google** provider there too and follow Supabase's
   prompts to add OAuth credentials from Google Cloud Console.
5. Go to **Authentication → URL Configuration** and add your future Vercel URL (e.g.
   `https://dama-dental.vercel.app`) to **Site URL** and **Redirect URLs** once you have it (Step 3).
6. Go to **Project Settings → API**. Copy the **Project URL** and the **anon / public key** — you'll
   need both in Step 2.

### Step 2 — Get a free Gemini API key
1. Go to **aistudio.google.com/app/apikey** and create a free API key.
2. Keep it handy for Step 3. This key powers the chatbot, symptom checker, and treatment-plan
   generator. The free tier is enough for development and a low-traffic clinic site; check Google's
   current rate limits before high-volume production use.

### Step 3 — Deploy to Vercel
1. Push this project to a GitHub repository (Vercel deploys from Git).
2. Go to **vercel.com → Add New → Project**, import that repository. Vercel auto-detects Vite.
3. Before the first deploy, open **Environment Variables** and add:

   | Name | Value | Notes |
   |---|---|---|
   | `VITE_SUPABASE_URL` | from Supabase Step 1.6 | exposed to the browser — that's expected |
   | `VITE_SUPABASE_ANON_KEY` | from Supabase Step 1.6 | safe to expose; RLS is what actually protects data |
   | `GEMINI_API_KEY` | from Step 2 | **server-side only** — used by `/api/ai/*`, never sent to the browser |

4. Click **Deploy**. Vercel builds the Vite app and automatically turns everything in `/api` into
   serverless functions — no separate backend host needed.
5. Once deployed, copy your live URL and go back to Supabase → **Authentication → URL
   Configuration** to add it as an allowed redirect URL (Step 1.5) — otherwise login/signup
   redirects will fail in production.

### Step 4 — Promote your first doctor and admin
Registering through the app always creates a `patient` account (by design — doctor/admin access
shouldn't be self-service). After you've registered your own account:
1. In Supabase → **Table Editor → profiles**, find your row.
2. Change `role` from `patient` to `admin` (or `doctor`) directly in the table editor.
3. Log out and back in on the live site — you'll land on the matching dashboard.

After that, you can manage everyone else's roles from the **Admin Panel** in the app itself.

### Step 5 — Smoke-test the AI features
Open the deployed site, click the AI assistant bubble, and send a message. If you get an error:
- Check the Vercel function logs (**Vercel → your project → Deployments → Functions**) for the
  exact error — usually a missing/incorrect `GEMINI_API_KEY`.
- Confirm the key works directly: `curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_KEY" -H "Content-Type: application/json" -d '{"contents":[{"parts":[{"text":"hello"}]}]}'`

---

## Project structure

```
dental-clinic-ethiopia/
├── api/ai/                  # Vercel serverless functions (chat, symptom-check, treatment-plan)
│   └── _lib/gemini.ts       # shared Gemini API helper — swap for OpenAI here if you prefer
├── src/
│   ├── components/          # Navbar, Footer, ChatWidget, ArchMotif (signature visual), ui/
│   ├── pages/                # Landing, Login, Register, PatientDashboard, DoctorDashboard, AdminPanel
│   ├── hooks/                # useAuth, useAppointments, useAI
│   ├── services/              # supabaseClient, appointmentService, aiService, database.types
│   ├── store/                # authStore (zustand)
│   └── utils/translations.ts # English / Amharic strings
├── supabase/
│   ├── migrations/0001_init.sql   # full schema + RLS policies
│   └── seed.sql                    # commented examples for demo data
├── vercel.json                # SPA routing rewrite
└── .env.example
```

## Design notes

The visual identity leans into one signature motif — a rounded arch — used throughout as a
section divider, icon shape, and the hero illustration's silhouette. It's meant to read two ways at
once: the curve of a dental arch (a row of teeth, a smile), and the rock-hewn arches of Lalibela.
Typography pairs a warm serif (Fraunces) for headings with Inter for body text and Noto Sans
Ethiopic to render Amharic correctly. The palette is a deep teal (clinical trust) against a cool
off-white, with a small amount of warm gold reserved for calls to action and AI-related UI, so it
stands out as "the assistant is talking" without overwhelming the page.

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · React Router · TanStack Query · Zustand · Recharts ·
Supabase (Postgres, Auth, RLS) · Vercel serverless functions · Google Gemini API · vite-plugin-pwa
