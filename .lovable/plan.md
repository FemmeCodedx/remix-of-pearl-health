# Diagnosed Conditions: Physical/Hormonal + Mental Health

## Goal
Let users log diagnosed conditions so Pearl (FEMME) Health can personalize content (e.g., IBS flares by cycle phase, PCOS-aware nutrition, PMDD mood tracking). Editable later from a Profile page.

## Conditions Lists

### Physical / Hormonal / Chronic
PCOS, Endometriosis, Adenomyosis, Fibroids, PMDD, PMS (severe), Thyroid (hypo), Thyroid (hyper), Hashimoto's, Graves', Insulin resistance, Type 1 Diabetes, Type 2 Diabetes, IBS, IBD (Crohn's/UC), GERD/Reflux, Gastroparesis, Celiac, **POTS**, **hEDS / EDS**, **Fibromyalgia**, **Chronic Fatigue Syndrome (ME/CFS)**, **Lupus**, Rheumatoid Arthritis, Multiple Sclerosis, Migraine (chronic), Interstitial Cystitis, Vulvodynia, Lipedema, Perimenopause, Menopause, Long COVID, Mast Cell Activation Syndrome (MCAS), Hidradenitis Suppurativa, Psoriasis, Eczema, Asthma

### Mental Health (diagnosed)
Anxiety, Depression, Bipolar I, Bipolar II, ADHD, Autism (ASD), OCD, PTSD, C-PTSD, Eating Disorder — Anorexia, Eating Disorder — Bulimia, Eating Disorder — Binge Eating, ARFID, BPD, Panic Disorder, Postpartum Depression, Postpartum Anxiety, Seasonal Affective Disorder

Plus **custom add** for both lists (free text chips).

## Database Migration
Add to `profiles`:
- `physical_conditions text[] default '{}'`
- `mental_conditions text[] default '{}'`
- `custom_physical_conditions text[] default '{}'`
- `custom_mental_conditions text[] default '{}'`

## Onboarding
Insert **Step 7b — Health Conditions** (after Health Focus, before Notifications). Two grouped multi-select sections with chips, "Add your own" input per section, prominent skip, and privacy reassurance: *"Private to you. Used only to personalize your experience. Not medical advice."*

## Profile Editor
New `src/pages/ProfilePage.tsx` (route `/profile`, linked from `UserMenu`) with the same two sections so users can edit anytime. Saves through `useOnboarding`-style update.

## Files
- `supabase/migrations/<new>.sql` — schema additions
- `src/hooks/useOnboarding.ts` — extend `OnboardingData` + save
- `src/pages/OnboardingPage.tsx` — new step component, renumber, update progress
- `src/pages/ProfilePage.tsx` — new
- `src/components/UserMenu.tsx` — link to profile
- `src/App.tsx` — route
- `src/lib/i18n.tsx` — EN + ES strings for every condition + section copy
- `src/integrations/supabase/types.ts` — auto-regenerated

## Out of scope
- Phase-aware content rules per condition (next pass — needs your editorial input)
- Symptom severity tracking per condition
