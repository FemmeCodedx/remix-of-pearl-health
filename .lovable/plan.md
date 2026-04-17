

# Thorough, Inclusive Onboarding Flow

## Goal
Replace the bare email/password signup with a guided, multi-step onboarding that welcomes women and non-binary users, gathers what's needed to personalize the app, and ends with them landing on a tailored Home screen.

## Flow (what the user sees after downloading)

```text
[1 Welcome] → [2 Account] → [3 Identity] → [4 Age Group] →
[5 Goals] → [6 Cycle Basics] → [7 Health Focus] →
[8 Notifications] → [9 Plan Pick] → [10 You're In]
```

### Step-by-step

1. **Welcome carousel (3 slides)** — Brand intro: "Your body. Your rhythm. Your power." Inclusive imagery, "Built for women & non-binary people." CTA: *Get Started* / *I already have an account*.

2. **Create account** — Email + password + full name (or chosen name). Apple/Google sign-in buttons (placeholder if not wired). Link to Terms & Privacy.

3. **Identity & pronouns** (optional, skippable)
   - Gender identity: Woman, Non-binary, Genderfluid, Trans woman, Trans man, Prefer to self-describe, Prefer not to say
   - Pronouns: she/her, they/them, he/him, custom, prefer not to say
   - Clear note: "This helps us speak to you respectfully. You can change this anytime."

4. **Age group** — The existing 7 brackets (12–16 … 55–65). Drives content filtering already built.

5. **What brings you here?** (multi-select goals)
   - Understand my cycle, Track symptoms, Plan for pregnancy, Avoid pregnancy, Egg freezing / IVF, Manage PCOS/endo, Perimenopause/menopause support, Mental & emotional wellness, Cycle-synced nutrition & fitness, Just exploring

6. **Cycle basics** (skippable for users who don't menstruate)
   - "Do you currently have a menstrual cycle?" Yes / No / Not sure / Prefer not to say
   - If Yes: last period start date, average cycle length (default 28), period length (default 5)
   - If No: reason chips (menopause, hormonal BC, post-partum, medical, trans/non-menstruating, prefer not to say) — unlocks alternate content paths

7. **Health focus** (multi-select, age-aware)
   - Hormones, Mood, Sleep, Energy, Skin, Libido, Fertility, Bone health, Heart health, HRT/perimenopause (only shown 35+)

8. **Notifications & privacy**
   - Toggle: period reminders, ovulation window, daily check-in, learn digest
   - Privacy reassurance copy + link to privacy policy

9. **Choose your plan** — Pearl (Free) / Swan ($8) / Ruby ($12) with "Start free, upgrade anytime."

10. **You're all set** — Personalized summary ("Hi [name], here's what we'll focus on…") → CTA *Enter FEMME* → Home.

## Technical Plan

### Database
New migration adds optional columns to `profiles`:
- `display_name`, `gender_identity`, `pronouns`, `goals text[]`, `health_focus text[]`
- `has_cycle` (text: yes/no/unsure/private), `no_cycle_reason`, `last_period_date`, `avg_cycle_length int`, `avg_period_length int`
- `notif_period`, `notif_ovulation`, `notif_checkin`, `notif_digest` (booleans)
- `onboarding_completed boolean default false`, `onboarding_step int default 0`

### New files
- `src/pages/OnboardingPage.tsx` — stepper container, progress bar, back/next, saves to Supabase per step (resumable)
- `src/components/onboarding/` — one component per step (Welcome, Account, Identity, AgeGroup, Goals, Cycle, HealthFocus, Notifications, Plan, Done)
- `src/hooks/useOnboarding.ts` — load/save profile progress

### Routing & gating (`App.tsx`)
- `/auth` stays for returning users (login)
- `/onboarding` new route, public for the Welcome+Account steps, then auth-required
- After login/signup: if `onboarding_completed === false` → redirect to `/onboarding` at the saved step; else → `/`

### i18n
Add EN/ES strings for every step, identity options, goals, focus areas, and the inclusive copy.

### Design
Reuse the luxe palette + Playfair Display headings. Each step is a full-screen card with progress dots, soft gradient background, large tap targets (mobile-first, 44px+), big "Skip" affordance for optional steps.

### Mobile preview
After build I'll open `/onboarding` in a 390×844 viewport so you can walk through every step and we can refine copy, options, and the order.

## Out of scope (suggest after)
- Real Apple/Google OAuth wiring
- Email verification UX polish
- Importing cycle history from Apple Health / Google Fit

