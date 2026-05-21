# Mental Health Hub

Replace the broken Mental Health tile destination on Home (currently routes to `/care`, which is the brand/shop Care Finder) with a dedicated Mental Health page that lets users:

1. Journal how they feel today
2. Read short articles tailored to the cycle phase they're in

## What the user will see

A new page at `/mental-health` with three sections:

- **How are you feeling today?** — a free-text journal box plus four quick-pick mood chips (Great / Good / Okay / Not great). One entry per day; previous entries for the past 7 days are listed below so the user can see their week at a glance.
- **For your current phase** — a small set of phase-aware mental-health reads (Menstruation, Follicular, Ovulation, Luteal). Each phase shows 3–4 short cards (title, 1-line summary, 2–3 min read). Tapping a card expands the full text inline (no new routes needed).
- **General mental wellness** — 2 evergreen cards (boundaries, when to seek help) shown under all phases.

Bilingual (EN/ES), uses existing FEMME design tokens, mobile-first.

## Wiring

- HomePage Mental Health quick action: change `path` from `/care` to `/mental-health`.
- Add `/mental-health` route in `src/App.tsx` inside the existing authed `AppShell` block.
- Add the page to `public/sitemap.xml`.

## Technical details

- **New file** `src/pages/MentalHealthPage.tsx` — page UI, mood chips, journal textarea, phase-article accordion.
- **New file** `src/data/mentalHealthArticles.ts` — small typed array `{ slug, phase, en, es, readTime }` with curated short reads per phase. No DB, no AI calls.
- **Journal storage** — reuse `symptom_logs` (no migration needed):
  - `symptom_key = "journal"`, `intensity = 2`, `note = <user text>`, `logged_on = today`.
  - One entry per day: on save, delete today's existing `journal` row then insert.
  - Past-7-days list queries `symptom_logs` where `symptom_key = "journal"` ordered by `logged_on desc limit 7`.
- **Current phase** — compute from `profiles.last_period_date` + `avg_cycle_length` (same convention used on Home/Sync). Fallback to Follicular if unknown.
- Free tier (Pearl). No tier gating.

## Out of scope

- No changes to Care Finder, Insights, Reports, Pricing, auth, or AI features.
- No new DB tables or migrations.
- No edits to the existing `articles.ts` library.
