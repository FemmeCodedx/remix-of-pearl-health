
# Enable Paddle Payments + Real Checkout for Pearl/Swan/Ruby

Eligibility check already passed — Paddle is the recommended provider. This plan enables Paddle, creates the three subscription products in the test environment, and replaces the current placeholder logic in `useUpgradeSubscription` with real Paddle checkout sessions and webhook-driven status sync.

## What will happen

### 1. Enable Paddle
- Call the Paddle enable flow. You'll fill out a short form (email, name, business name) — the email defaults to your Lovable account email but is editable.
- A **test (sandbox) environment** is provisioned immediately. No real money moves until you verify your business and switch to live mode.
- Lovable Cloud is already enabled ✓. Note: enabling payments requires a **Pro plan or higher** on your Lovable account.

### 2. Create the three subscription products (test mode)
Using batch product creation:
- **Pearl** — Free, $0/month (kept as the default tier; no Paddle product needed, handled in-app)
- **Swan** — $8.00 USD / month, recurring
- **Ruby** — $12.00 USD / month, recurring

Only Swan and Ruby become real Paddle products. Pearl stays as the free fallback in your `subscriptions` table.

### 3. Replace placeholder logic with real checkout
Update `src/hooks/useSubscription.ts`:
- `useUpgradeSubscription` for Swan/Ruby will open a **Paddle checkout session** instead of fake-updating the DB.
- Switching **down to Pearl** will call a "cancel at period end" flow against Paddle (and immediately update local UI state to reflect the canceled status).
- Switching between Swan and Ruby will trigger a Paddle subscription update (proration handled by Paddle).

### 4. Add a webhook edge function
New edge function `supabase/functions/paddle-webhook/index.ts`:
- Listens for `subscription.created`, `subscription.updated`, `subscription.canceled`, `transaction.completed`
- Validates Paddle's webhook signature
- Updates the `subscriptions` table: `tier`, `status`, `stripe_customer_id` → renamed conceptually to customer id, `stripe_subscription_id` → subscription id, `current_period_start`, `current_period_end`
- Deployed automatically with `verify_jwt = false` (Paddle calls it without a Supabase JWT)

### 5. Update the PricingPage confirm dialog
- Confirm dialog wording stays the same, but the action now redirects to the Paddle hosted checkout (or opens the Paddle.js overlay) instead of immediately mutating the DB.
- After successful checkout, user returns to `/profile/subscription` and the webhook has already synced their tier.
- Bilingual EN/ES copy already in place — minor tweaks for "Redirecting to secure checkout…" string.

### 6. Subscription page touch-ups
- Show real renewal date from Paddle-synced `current_period_end`
- "Manage subscription" button opens the Paddle **customer portal** (hosted by Paddle) for payment-method updates and invoices

## Technical details

**Files created**
- `supabase/functions/paddle-webhook/index.ts` — webhook handler with signature verification
- `supabase/functions/create-paddle-checkout/index.ts` — creates a checkout session for a given tier, returns checkout URL
- `supabase/functions/paddle-customer-portal/index.ts` — generates a portal link for the current user

**Files edited**
- `src/hooks/useSubscription.ts` — `useUpgradeSubscription`, `useCancelSubscription`, `useResumeSubscription` now invoke edge functions instead of mutating the DB directly
- `src/pages/PricingPage.tsx` — handle redirect-to-checkout flow + loading state
- `src/pages/SubscriptionPage.tsx` — use real Paddle data; "Manage" button calls customer portal function
- `src/lib/i18n.tsx` — add "Redirecting to checkout", "Opening billing portal", and Paddle-related error strings (EN/ES)

**No DB schema changes needed** — your existing `subscriptions` table already has all required columns (`stripe_customer_id` and `stripe_subscription_id` will be reused to store Paddle's customer/subscription IDs; we'll keep the column names to avoid a migration but they'll hold Paddle IDs going forward).

**Secrets** — Paddle's API key and webhook signing secret are configured automatically by the enable flow. No manual `add_secret` calls needed.

## What you'll do vs what I'll do

**You:**
1. Confirm you want to enable Paddle
2. Fill out the Paddle enable form when it appears
3. (Later, when ready for live payments) verify your business with Paddle

**I'll do everything else** — product creation, edge functions, hook rewrites, UI updates, i18n strings, and QA against your existing Pearl/Swan/Ruby flow.

## After this plan ships

You'll be able to:
- Click any tier on `/pricing` → land on Paddle's secure checkout → return with an active subscription
- See your real renewal date on `/profile/subscription`
- Cancel/resume through Paddle's customer portal
- Test end-to-end with Paddle's test cards before going live

Ready to proceed? Approving this plan will start the enable flow — the Paddle form will appear for you to fill out, then I'll build out steps 2–6.
