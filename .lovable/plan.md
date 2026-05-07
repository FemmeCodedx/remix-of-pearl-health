## Goal
Pass Paddle's domain readiness check by publishing the three required legal pages and linking them site-wide.

## New pages

Create three routes, each rendered inside the existing `AppShell` so the bottom nav and styling stay consistent. Each page is a long-form document with section headings, written in plain English, bilingual where practical (titles via `useI18n`, body content in English for v1 — Spanish translation can follow).

1. `src/pages/TermsPage.tsx` → `/legal/terms`
2. `src/pages/PrivacyPage.tsx` → `/legal/privacy`
3. `src/pages/RefundPage.tsx` → `/legal/refund`

### Terms & Conditions content (Paddle must-haves)
- Seller legal name + acceptance of terms
- Product description (Pearl Health: cycle tracking, education, AI wellness insights)
- Misuse clause (unlawful use, fraud, scraping, security interference)
- IP ownership retained by seller
- No uptime/error-free guarantee
- Payment & subscription terms — refer to Paddle Buyer Terms (https://www.paddle.com/legal/checkout-buyer-terms)
- **Paddle MoR disclosure** (verbatim required text)
- Suspension/termination rights
- **Generative AI clauses** (required because Ruby tier has AI symptom analysis):
  - Prohibited uses, user responsibility for prompts/outputs
  - Accuracy disclaimer + reinforce: not medical advice, consult a professional
  - Content moderation rights
- Governing law placeholder

### Privacy Notice content
- Seller legal name + controller status
- Categories collected: account info (name, email), cycle/symptom logs, device/usage telemetry, IP
- Purposes + legal basis (contract, legitimate interest, consent for health data)
- Sharing: hosting/backend (Lovable Cloud), Paddle as MoR, authorities if required
- Retention + deletion on account closure
- Security measures (encryption in transit/at rest, RLS)
- User rights (access, deletion, export, complaint)
- Cookies (essential only unless added later)
- Contact email for privacy requests

### Refund Policy content
- 30-day money-back guarantee
- How to request: via paddle.net or contact support
- No restrictive "all sales final" language

## Footer + auth links

Add a small `LegalFooter` component:
- `src/components/LegalFooter.tsx` — three links (Terms / Privacy / Refund) + © line
- Render inside `AppShell` below the bottom-nav spacer so it appears on every authenticated page
- Also add the same three links under the Sign In / Sign Up button on `AuthPage.tsx` (Paddle requires policies be discoverable from sign-up)

## Routing

Update `src/App.tsx`:
- Add three `<Route>` entries inside the `AppShell`-wrapped routes
- Pages are public-readable (still inside `OnboardingGate`, but that's fine — unauthed users hitting them will redirect to `/auth`; for Paddle's check we need them reachable without login, so register them OUTSIDE the `OnboardingGate` block alongside `/auth` and `/onboarding`)

## i18n

Add to `src/lib/i18n.tsx`:
- `terms`, `privacyPolicy`, `refundPolicy`, `legalFooterRights` keys (EN + ES)

## Out of scope
- Full Spanish translation of policy bodies (titles/nav only for v1; user can request later)
- Cookie consent banner (not currently using non-essential cookies)
