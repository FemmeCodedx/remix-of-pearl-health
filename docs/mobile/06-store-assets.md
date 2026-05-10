# 06 — Store assets & listings

Graphics, copy, and URLs you need to produce **outside** the codebase. Plan a full day for this.

## Graphics requirements

| Asset | Apple App Store | Google Play |
|---|---|---|
| App icon | 1024×1024 PNG, no transparency | 512×512 PNG, 32-bit |
| Feature graphic | — | 1024×500 PNG/JPG |
| Phone screenshots (required) | 6.7" (1290×2796) ×3–10 | 1080×1920 to 1920×1080, ×2–8 |
| Phone screenshots (recommended also) | 6.5" (1284×2778), 5.5" (1242×2208) | — |
| Tablet screenshots | iPad 12.9" (2048×2732) ×3–10 if iPad supported | 7" + 10" tablet if you opt in |
| Preview video | optional, 15–30s | optional, YouTube link |

The 1024×1024 app icon already exists at `resources/icon.png` — reuse it for both stores.

### Producing screenshots

Easiest path for a Capacitor app:
1. Run on the largest iPhone simulator (iPhone 15 Pro Max → 6.7").
2. ⌘S to save a screenshot to Desktop.
3. Repeat in Spanish (toggle language in app) — Apple lets you upload localized screenshots.
4. For Android, use the Pixel 7 emulator (1080×2400) or any physical phone, screenshot via power+volume-down.

Capture at minimum:
- Onboarding / cycle setup
- Home with phase + daily insight
- Tracking screen
- Reports screen
- Care / community
- Pricing (Pearl / Swan / Ruby)
- Ruby AI feature (meal plan or grocery list)

## Listing copy — English

**Subtitle (iOS, ≤30 chars):**
> Your cycle, your power.

**Short description (Play, ≤80 chars):**
> Cycle tracking, phase insights, and AI wellness for women.

**Promotional text (iOS, ≤170 chars):**
> Track your cycle, log symptoms, and get AI-powered nutrition and wellness insights tailored to every phase. Pearl Femme — your body, your rhythm.

**Full description (≤4000 chars):**
> Pearl Femme is a luxe, science-backed companion for your menstrual health. Track your cycle, log symptoms, and unlock personalized insights for every phase — follicular, ovulatory, luteal, and menstrual.
>
> FREE (Pearl)
> • Cycle + period tracking
> • Phase calendar
> • Symptom logging
> • Bilingual: English & Spanish
>
> SWAN — Premium
> • Detailed phase reports (PDF)
> • Recipes and food swaps per phase
> • Egg-freezing & maternal health guides
> • Care finder & womb-care directory
> • Friends & community
>
> RUBY — AI
> • Daily AI insight tailored to your phase + recent symptoms
> • AI 7-day meal plan generated for your current phase
> • AI grocery list builder grouped by aisle
>
> Pearl Femme is not a medical device and does not provide medical advice. Always consult a qualified healthcare professional.

## Listing copy — Spanish

**Subtitle:**
> Tu ciclo, tu poder.

**Short description:**
> Seguimiento del ciclo, insights de fase y bienestar con IA para mujeres.

(Translate the full description — match tone, keep the same tier breakdown.)

## URLs (already live)

- Privacy policy: `https://thepearlhealth.lovable.app/privacy`
- Terms: `https://thepearlhealth.lovable.app/terms`
- Refund policy: `https://thepearlhealth.lovable.app/refund`
- Support / marketing URL: `https://thepearlhealth.lovable.app`
- Support email: pick one and put it on the privacy page if not already there.

## Categories

- Apple: Primary **Health & Fitness**, Secondary **Medical**
- Play: **Health & Fitness**

## Age rating

Both stores will rate this **17+ / Mature** because of:
- Medical / treatment information
- Sexual / reproductive health references
- Frequent mature themes

Answer the questionnaires honestly — wrong answers cause re-review delays.

➡ Next: [07 — Review readiness](./07-review-readiness.md)
