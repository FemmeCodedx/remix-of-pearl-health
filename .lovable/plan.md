## Swan tier perks — implementation plan

Goal: turn the four advertised Swan perks into real, working features, gated cleanly so Pearl users see an upgrade prompt and Swan/Ruby users get full access.

### 1. Tier-access foundation (used by all perks)

- New hook `src/hooks/useTierAccess.ts` exposing `{ tier, hasSwan, hasRuby, isLoading }` (Ruby implicitly grants Swan).
- New component `src/components/UpgradeGate.tsx` — wraps premium content; if user lacks tier, shows a luxe upsell card with feature name + "Upgrade to Swan" button → `/pricing`.
- Add `swan`/`ruby` strings to `src/lib/i18n.tsx` (EN + ES) for all new copy.

### 2. Monthly plan saving (Swan)

What it is: at the end of each cycle phase, the user can save the day's nutrition / exercise / self‑care plan from the Sync page into a personal library, then browse / re‑open past plans.

- New table `monthly_plans` (user_id, phase, title, plan_json, notes, created_at). RLS: user owns own rows.
- "Save this plan" button on `SyncPage` (Swan‑gated). Captures current phase's nutrition/exercise/selfCare/seeds.
- New page `src/pages/SavedPlansPage.tsx` at `/plans` — list + detail view, delete, optional rename.
- Link from Profile page and a quick‑access tile on Home (gated for Pearl).

### 3. Recipe lists (Swan)

What it is: user can build their own named recipe lists (e.g. "Luteal comfort dinners") with simple recipe items (title, ingredients, notes, optional URL).

- New tables:
  - `recipe_lists` (user_id, name, phase nullable, created_at)
  - `recipes` (list_id, title, ingredients text[], notes, source_url, phase nullable, created_at)
  - RLS: user owns own lists/recipes.
- New page `src/pages/RecipesPage.tsx` at `/recipes`:
  - Lists view → list detail → add/edit recipe form.
  - Filter by phase.
- Swan‑gated entry. Ruby gets the same UI now (AI generation comes later).

### 4. Food swap library (Swan)

What it is: a curated, research‑backed library of "swap X for Y" cards (e.g. "swap refined sugar for date paste during luteal"). Filter by phase and by goal (energy, mood, cramps, bloating).

- New table `food_swaps` (slug, swap_from, swap_to, why_md, phase, goals text[], source_citation, source_url, lang, sort_order). Public read for authenticated; service‑role writes only.
- Seed ~30 curated entries (EN + ES) using the AI gateway script offline, with citations to known sources (e.g. Brighten, Vitti, Mosconi). I'll vet sources during build.
- New page `src/pages/FoodSwapsPage.tsx` at `/food-swaps` — searchable, filter chips by phase + goal, expandable card showing rationale + citation.
- Swan‑gated. Pearl users see 3 teaser cards then the upsell gate.

### 5. Tiered symptom reports + export (Swan)

What it is: real symptom logging persisted to the DB, plus a per‑cycle PDF report users can download or share.

- New tables:
  - `symptom_logs` (user_id, logged_on date, symptom_key, intensity 1‑3, note). RLS: user owns own rows. Index on (user_id, logged_on).
  - `cycle_logs` (user_id, started_on date, ended_on date nullable, flow text). RLS: user owns own rows.
- Update `TrackPage` to persist symptoms + period logs (replaces the current local‑state stub). Available to all tiers — logging is free.
- New page `src/pages/ReportsPage.tsx` at `/reports`:
  - **Pearl**: last 7 days summary view in‑app only. No export.
  - **Swan**: full cycle history + per‑cycle PDF export (jsPDF) with phase chart, symptom frequency, notes. Gate via `UpgradeGate`.
  - **Ruby**: same as Swan today (AI narrative summary added later).
- Generate PDF client‑side with `jspdf` + `jspdf-autotable` (already-common deps; will add).

### 6. Wiring + nav

- `App.tsx`: register `/plans`, `/recipes`, `/food-swaps`, `/reports`.
- `ProfilePage`: new "Premium" section linking to all four (gated icons show 🔒 for Pearl).
- `HomePage`: replace the static "Quick actions" tiles' `cycleSync` slot with a Swan badge promo when user is Pearl.
- Update `PricingPage` Swan feature list copy to match what's now real.

### 7. Memory + housekeeping

- Update `mem://features/subscription-model` to reflect what's actually implemented for Swan.
- Add `mem://features/tier-gating` describing `useTierAccess` + `UpgradeGate` pattern so future features stay consistent.

### Out of scope (Ruby‑only / later)

- AI grocery list, AI meal planning, AI symptom analysis, AI insights — these are Ruby perks; will be a follow‑up plan.
- Native share sheet for the PDF on iOS Capacitor — browser download for now.

### Files

**New**
- `src/hooks/useTierAccess.ts`
- `src/components/UpgradeGate.tsx`
- `src/pages/SavedPlansPage.tsx`
- `src/pages/RecipesPage.tsx`
- `src/pages/FoodSwapsPage.tsx`
- `src/pages/ReportsPage.tsx`
- `src/lib/reportPdf.ts` (PDF builder)

**Edited**
- `src/App.tsx` (routes)
- `src/pages/SyncPage.tsx` (save‑plan button)
- `src/pages/TrackPage.tsx` (persist logs)
- `src/pages/HomePage.tsx` (premium tiles)
- `src/pages/ProfilePage.tsx` (premium section)
- `src/pages/PricingPage.tsx` (truthful copy)
- `src/lib/i18n.tsx` (EN/ES strings)

**DB migration** — add tables: `monthly_plans`, `recipe_lists`, `recipes`, `food_swaps`, `symptom_logs`, `cycle_logs` (all with RLS).

**Deps** — `jspdf`, `jspdf-autotable`.

### Order of build

1. Migration + `useTierAccess` + `UpgradeGate`.
2. Symptom logging persistence + Reports page (highest user value, also unblocks export).
3. Monthly plan saving.
4. Recipe lists.
5. Food swap library + seed data.
6. Nav, pricing copy, memory update.
