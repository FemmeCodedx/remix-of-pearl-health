

# Age-Specific Content System

## Overview
Add an age group selector to the app that personalizes content across the Learn page (and eventually other pages). Users set their age group once in their profile, and content is filtered/tagged accordingly. We'll also create a database table for manageable resources.

## Age Groups
12–16, 17–24, 25–30, 30–35, 35–45, 45–55, 55–65

## What Gets Built

### 1. Database Changes (2 migrations)

**Migration A — Add age group to profiles:**
- Add `age_group` column (text, nullable) to `profiles` table
- Allowed values: `12-16`, `17-24`, `25-30`, `30-35`, `35-45`, `45-55`, `55-65`

**Migration B — Create `learn_resources` table:**
- Columns: `id`, `title`, `description`, `content`, `category` (hormones, fertility, mental_health, birth_control), `age_groups` (text array — which groups see it), `lang` (en/es), `icon`, `order`, `created_at`
- RLS: readable by all authenticated users
- Seed with starter content per age group (e.g., teens get puberty/period basics; 35+ gets perimenopause, egg freezing emphasis; 45+ gets menopause content)

### 2. Age Group Onboarding Flow
- **AgeGroupSelector component**: A modal/screen shown on first use (or accessible from profile) where user picks their age range
- Saves to `profiles.age_group` via Supabase
- Stored in AuthContext so it's available app-wide

### 3. Learn Page — Content Filtering
- Fetch resources from `learn_resources` filtered by user's age group
- Keep existing hardcoded sections but show/hide based on age group (e.g., hide "Fertility & Family Planning > Egg Freezing" for 12–16, hide perimenopause for under-35)
- Add age-appropriate starter content:
  - **12–16**: Puberty basics, first period guide, understanding your cycle, emotional changes
  - **17–24**: Hormones deep dive, birth control guide, mental health tools, nutrition
  - **25–30**: Fertility awareness intro, cycle syncing, career + wellness balance
  - **30–35**: Fertility planning, egg freezing awareness, hormone optimization
  - **35–45**: Advanced fertility, perimenopause intro, preventive health
  - **45–55**: Perimenopause management, HRT info, bone health, emotional wellness
  - **55–65**: Menopause support, post-menopause health, vitality tips

### 4. i18n Updates
- Add translations for age group labels, onboarding prompts, and new content categories in both English and Spanish

### 5. Files Changed/Created
- `supabase/migrations/` — 2 new migration files
- `src/components/AgeGroupSelector.tsx` — new picker component
- `src/pages/LearnPage.tsx` — filter content by age group
- `src/contexts/AuthContext.tsx` — expose `ageGroup` + `setAgeGroup`
- `src/lib/i18n.tsx` — new translation keys
- `src/hooks/useLearnResources.ts` — new hook to fetch from `learn_resources`

### Content Upload
Yes — once this is built, you can start uploading age-specific resources. I'll seed starter content, and you can tell me what to add, change, or replace per age group. The database structure will make it easy to manage over time.

