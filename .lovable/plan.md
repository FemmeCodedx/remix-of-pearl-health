## Goal

Add clear, consistent "Not medical advice — consult a medical professional" disclaimers everywhere AI symptom analysis and symptom tracking appear, satisfying Paddle's wellness-scope eligibility note for the Ruby tier.

## Changes

1. **New reusable component** `src/components/MedicalDisclaimer.tsx`
   - Two variants: `inline` (small muted text) and `banner` (Alert with icon).
   - Bilingual (EN/ES) via existing `useI18n()`.
   - Copy (EN): "This app provides wellness and educational information only. It is not medical advice, diagnosis, or treatment. Always consult a qualified medical professional for any health concerns."
   - Copy (ES): equivalent translation.

2. **i18n strings** `src/lib/i18n.tsx`
   - Add `medicalDisclaimerTitle`, `medicalDisclaimerBody`, `medicalDisclaimerShort` keys for EN + ES.

3. **Place disclaimers** (banner where AI is featured, inline elsewhere):
   - `PricingPage.tsx` — banner under the Ruby tier card; also append "(wellness only, not medical advice)" to the "AI symptom analysis" feature line.
   - `TrackPage.tsx` — banner above the Symptoms section.
   - Phase pages (`MenstruationPhasePage`, `FollicularPhasePage`, `OvulationPhasePage`, `LutealPhasePage`) — inline disclaimer at bottom of content.
   - `MaternalHealthPage.tsx`, `EggFreezingPage.tsx` — inline disclaimer near top.
   - `HomePage.tsx` — inline disclaimer in footer area of the main scroll.
   - `OnboardingPage.tsx` — inline disclaimer on the final/health screen.
   - `SubscriptionPage.tsx` — inline note under Ruby benefits if displayed.

4. **Future-proofing**
   - When the actual AI symptom analysis edge function / UI is built for Ruby, the same `MedicalDisclaimer` component will be required as a banner above any AI output and prepended to AI prompt system instructions ("respond with wellness/educational framing, never diagnose, always recommend consulting a medical professional"). Noted here so it isn't forgotten.

## Out of scope

- Legal Terms / Privacy policy pages (separate Paddle go-live task).
- Building the actual AI symptom analysis backend.
