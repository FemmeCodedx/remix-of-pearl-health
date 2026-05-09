## Ruby AI Features

Ship three Ruby-tier AI surfaces powered by the Lovable AI Gateway (Gemini 3 Flash). All model calls live in Supabase Edge Functions — `LOVABLE_API_KEY` never reaches the client. Each feature is gated by `hasRuby`; Pearl/Swan see an `<UpgradeGate>` upsell.

> **Rate limiting note:** Lovable's backend has no first-class rate-limiting primitive yet, so caps are ad-hoc — a small `ai_usage_log` table that each function checks before spending tokens. Good enough for cost control on Ruby; can be hardened later.

### 1. Database

New table `ai_usage_log`:
- `user_id uuid`, `feature text`, `used_on date default today`, `created_at timestamptz`
- RLS: users see/insert own rows; service role full access
- Index on `(user_id, feature, used_on)` for fast counting

New table `ai_meal_plans` (persisted Ruby outputs):
- `user_id`, `phase cycle_phase`, `plan_json jsonb` (7-day structured plan), `notes text`, `created_at`, `updated_at`
- RLS: owner-only CRUD

New table `ai_grocery_lists`:
- `user_id`, `source text` ('meal_plan' | 'recipe_list' | 'manual'), `source_id uuid nullable`, `items_json jsonb` (grouped by aisle), `created_at`
- RLS: owner-only CRUD

### 2. Edge functions (3 new)

All share a `_shared/ai-gateway.ts` helper using `@ai-sdk/openai-compatible` per Lovable AI Gateway docs, plus a `_shared/ruby-guard.ts` that:
- Validates JWT, extracts user_id
- Verifies the user has Ruby via `subscriptions` table (server-side, env-filtered)
- Counts today's `ai_usage_log` rows for `(user_id, feature)` and rejects 429 if over cap
- Inserts a usage row on success

**`ai-meal-plan`** (cap: 3/day)
- Input: `{ phase, dietary_prefs?, goals? }` (defaults pulled from profile)
- Uses `generateText` + `Output.object` with Zod schema → `{ days: [{ day, breakfast, lunch, dinner, snack, notes }] }`
- Optionally saves to `ai_meal_plans` if `save: true`
- Returns the plan + remaining quota

**`ai-grocery-list`** (cap: 10/day)
- Input: `{ source: 'meal_plan' | 'recipe_list', source_id }` OR `{ items: string[] }`
- Server fetches the source (validates ownership), passes ingredients to model
- Structured output: `{ aisles: [{ name, items: [{ name, qty }] }] }`
- Saves to `ai_grocery_lists`, returns list + quota

**`ai-daily-insight`** (cap: 1/day, idempotent — same call returns cached result for the day)
- Input: none (server reads user's profile + last 14 days of `symptom_logs` + current cycle phase from `cycle_logs`)
- Single short paragraph (≤80 words) tip + 1 actionable suggestion
- Cached in `ai_usage_log` row's optional `result_json` column (added to the table) so subsequent calls today are free

### 3. Frontend

**`useRubyAi` hook** — small wrapper around `supabase.functions.invoke` with toast handling for 429/402, returns `{ generate, loading, quotaRemaining }`.

**`/ai-meals` page** (new route, in `App.tsx`)
- `<UpgradeGate tier="ruby">` wrapper
- Phase picker (defaults to current), "Generate plan" button
- Renders 7-day plan as expandable day cards
- "Save plan" + "Build grocery list from this" actions
- Lists saved plans below

**`/ai-grocery` page** (new route)
- Picks source (existing meal plan, recipe list, or paste ingredients)
- Renders aisle-grouped checklist with check-off (local state only)
- "Email/copy" button (clipboard)
- Lists saved grocery lists

**HomePage daily insight card**
- New `<DailyInsightCard />` rendered above the existing premium tile when `hasRuby`
- Auto-fetches once on mount; shows loading skeleton, then insight text
- Small "✨ AI insight for today" header with refresh icon (re-runs if quota allows)

**Profile + HomePage premium grid**
- Update `i18nSwan.ts` `home` block: add Ruby labels (`mealPlan`, `groceryList`)
- HomePage Swan/Ruby grid becomes a 2x3 (or scrolls) when Ruby — adds Meal Plan + Grocery
- ProfilePage premium grid: same treatment

**PricingPage Ruby copy**
- Replace placeholder "AI features (coming soon)" with: "AI meal planning", "AI grocery lists", "Daily AI insights", "Priority support"

### 4. i18n

Extend `src/lib/i18nSwan.ts` with `ruby` block (EN + ES):
- `mealPlan.{title, subtitle, generate, saving, day, breakfast, lunch, dinner, snack, savePlan, makeGrocery, quotaLeft}`
- `grocery.{title, subtitle, source, fromMeal, fromRecipes, manual, generate, copy, copied, savedLists}`
- `insight.{title, refresh, fallback, quotaUsed}`
- `home.{mealPlan, groceryList}`
- `errors.{quotaExceeded, creditsExhausted, generic}`

### 5. Files

**New:**
- `supabase/functions/_shared/ai-gateway.ts`, `_shared/ruby-guard.ts`
- `supabase/functions/ai-meal-plan/index.ts`
- `supabase/functions/ai-grocery-list/index.ts`
- `supabase/functions/ai-daily-insight/index.ts`
- `src/hooks/useRubyAi.ts`
- `src/components/DailyInsightCard.tsx`
- `src/pages/AiMealsPage.tsx`
- `src/pages/AiGroceryPage.tsx`

**Edited:**
- `src/App.tsx` (2 routes)
- `src/pages/HomePage.tsx` (insight card + 2 grid items for Ruby)
- `src/pages/ProfilePage.tsx` (2 grid items for Ruby)
- `src/pages/PricingPage.tsx` (Ruby feature list)
- `src/lib/i18nSwan.ts` (ruby block)
- `src/components/UpgradeGate.tsx` (accept `tier="ruby"` variant if not already)

**DB migration:** 3 tables + RLS + index.

**Deps:** `ai`, `@ai-sdk/openai-compatible`, `zod` for the edge functions (Deno `npm:` imports — no client bundle impact).

### 6. Build order

1. Migration (3 tables, RLS) → 2. Shared edge helpers + `ai-daily-insight` (smallest, validates pattern) → 3. HomePage `<DailyInsightCard />` → 4. `ai-meal-plan` + `/ai-meals` page → 5. `ai-grocery-list` + `/ai-grocery` page → 6. Nav grids, PricingPage copy, memory update.

### Out of scope

- AI symptom analysis (deferred — needs careful medical-disclaimer review)
- Streaming UI (server returns full result; meal plans are short enough)
- Sharing meal plans / grocery lists with friends
- Native push notifications for daily insights