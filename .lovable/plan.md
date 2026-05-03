## Subscription Settings Screen

Add a dedicated screen at `/profile/subscription` where users can view and manage their plan.

### What it shows
- Current tier badge (Pearl / Swan / Ruby) with the tier's feature highlights
- Status (active / canceled) and renewal/period-end date (formatted, localized)
- Stripe IDs hidden; just human-friendly info
- "Manage plan" → links to `/pricing` for upgrade/downgrade
- "Cancel subscription" button (paid tiers only) — confirmation dialog, then sets `status: 'canceled'` in `subscriptions` (placeholder, matches existing Stripe-placeholder pattern in `useUpgradeSubscription`); access continues until `current_period_end`
- "Resume subscription" button when status is `canceled` and period hasn't ended → sets back to `active`
- Free (Pearl) tier: hides cancel; shows "Upgrade" CTA instead

### Files

**New**
- `src/pages/SubscriptionPage.tsx` — the screen, using existing `useSubscription` hook + new `useCancelSubscription` / `useResumeSubscription` mutations
- Add cancel/resume mutations inside `src/hooks/useSubscription.ts` (same placeholder pattern as `useUpgradeSubscription`, updating only `status` and `updated_at`)

**Edited**
- `src/App.tsx` — register `/profile/subscription` route inside the `AppShell` routes
- `src/pages/ProfilePage.tsx` — add a "Subscription" row card (similar styling to the existing Friends row) navigating to `/profile/subscription`, showing current tier badge inline
- `src/lib/i18n.tsx` — add `subscription` namespace (EN + ES): title, currentPlan, status, renewsOn, endsOn, manage, cancel, cancelConfirmTitle, cancelConfirmBody, resume, upgrade, canceledNotice, free, active, canceled

### Technical notes
- No DB migration needed — `subscriptions` table already has `status`, `current_period_end`, and RLS allows users to update their own row
- Cancel = soft-cancel: keep `tier` and `current_period_end`, only flip `status` to `'canceled'`. Resume flips back to `'active'`. A real Stripe integration would replace these in the future
- Use existing shadcn `AlertDialog` for the cancel confirmation
- Date formatting uses `toLocaleDateString` with the active i18n locale
- Keep visual style consistent with `ProfilePage` (rounded-2xl cards, `font-display` heading, back chevron)

No backend/edge-function changes; everything runs through the existing Supabase client and RLS policies.