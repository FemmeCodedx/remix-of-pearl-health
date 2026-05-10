# 07 — Review readiness

The most common rejection reasons for a health + subscription app, and how Pearl Femme handles each. Run this checklist before clicking *Submit for Review*.

## Apple guideline 5.1.1(v) — Account deletion

Any app with account creation **must** allow in-app account deletion (not "email us to delete"). Verify `ProfilePage` has a **Delete account** action that:
1. Asks for confirmation
2. Calls a Supabase edge function that removes the user from `auth.users` and cascades through `profiles`, `cycles`, `symptom_logs`, `ai_*` tables.
3. Signs the user out.

If this doesn't exist yet, build it before submission. **This is a hard blocker.**

## Apple guideline 3.1.1 — In-app purchase for digital subscriptions

Pearl Femme currently uses **Paddle** on the web. Apple **requires StoreKit / IAP** for any digital content or subscription consumed inside the iOS app. Google Play has the same requirement for Android.

You have two options:

### Option A — Web-only paid tiers (risky)

Strip all upgrade CTAs and paywall buttons from the iOS/Android build. Users can use Pearl tier only inside the app, but must upgrade on the website. Apple often rejects this if any in-app text mentions a price or premium feature ("Apple 3.1.3(b) — reader apps" exception is narrow and unlikely to apply).

### Option B — Add native IAP via RevenueCat (recommended)

Install `@revenuecat/purchases-capacitor`, create matching products in App Store Connect (subscriptions) + Play Console (subscriptions), and wire them to the existing `useTierAccess` / `useSubscription` hooks. Keep Paddle for the web checkout. RevenueCat unifies both stores' purchase events into a single subscriber object you can query from `useSubscription`.

This is a separate project (~3–5 days). **Plan for it before iOS submission.**

## Apple guideline 1.4.1 — Health & medical claims

Pearl Femme is not a medical device. Verify the medical disclaimer (`MedicalDisclaimer` component) is visible:
- During onboarding
- On every AI-generated screen (daily insight, meal plan, grocery list)
- In the Privacy and Terms pages

The Ruby AI features must never give a *diagnosis* or *treatment recommendation*. Re-read prompts in `supabase/functions/ai-*` and confirm they instruct the model to defer to healthcare providers.

## Apple guideline 5.1.1 + Play Data Safety — Privacy nutrition / data safety

Both stores require declaring what you collect. Pearl Femme's truthful answers:

| Data type | Collected? | Linked to user? | Used for tracking? |
|---|---|---|---|
| Email | Yes (Supabase auth) | Yes | No |
| Name | Yes if entered (profile) | Yes | No |
| Health & fitness — Cycle, symptoms | Yes | Yes | No |
| Sensitive info — Reproductive health | Yes | Yes | No |
| Purchase history | Yes (Paddle / IAP) | Yes | No |
| User content — AI prompts/responses | Yes (logged to `ai_usage_log`) | Yes | No |
| Crash data, diagnostics | Only if you add crash reporting | — | No |
| Identifiers — User ID | Yes | Yes | No |
| Location | No (browser geolocation only, not stored) | — | — |

Set both apps to **Data is encrypted in transit** (true — HTTPS/Supabase) and **Users can request data deletion** (true — see account deletion above).

## Demo account for reviewers

Create one in production:
- Email: `appreview@pearlfemme.app` (or similar)
- Password: a generated 16-char password
- Tier: **Ruby** so reviewer can exercise every feature

Paste credentials into:
- App Store Connect → App Review Information
- Play Console → App content → App access

Refresh AI rate limits the day before submission so the reviewer doesn't hit a daily cap.

## Restore purchases (if Option B)

iOS HIG requires a visible **Restore Purchases** button in any app with IAP. Add it to `SubscriptionPage` or `ProfilePage`.

## Bilingual review notes

Tell the reviewer how to switch languages: "Tap the EN/ES toggle in the top-right of the home screen." Otherwise reviewers may flag "incomplete localization."

## Asset truthfulness

Don't put features in screenshots that aren't in the build. Don't show "Free" if the feature is paid. Don't include competitor names.

## Final pre-submission gate

```text
[ ] Account deletion works in-app
[ ] Subscription path complies with 3.1.1 (IAP) or paywall removed (3.1.3)
[ ] Medical disclaimer visible on AI screens
[ ] Privacy / data-safety form completed truthfully
[ ] Demo account created, Ruby tier, AI quotas reset
[ ] Restore Purchases visible (if IAP)
[ ] Review notes mention EN/ES toggle
[ ] Screenshots match shipped build
```

➡ Next: [08 — Updates & OTA](./08-updates-and-ota.md)
