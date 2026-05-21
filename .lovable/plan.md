# Fix Home & Track Page Click Bugs

## Problems found

1. **Home page — nothing is clickable**
   - The four **mood buttons** (😊 🙂 😐 😔) have no `onClick` handler.
   - The four **quick action tiles** (Log Period, Log Symptom, Cycle Sync, Mental Health) have no `onClick` handler either — they look interactive but do nothing.

2. **Track page — can't log symptoms outside the suggested list**
   - The symptom grid is hard-coded to 8 "suggested" symptoms (`cramps`, `fatigue`, `nausea`, `bloating`, `headache`, `mood_swings`, `cravings`, `anxiety`).
   - There is no UI to add a custom/other symptom, so tapping anything else does nothing.

## Fix

### HomePage.tsx
- Wire each **quick action** to navigate:
  - Log Period → `/track`
  - Log Symptom → `/track`
  - Cycle Sync → `/sync`
  - Mental Health → `/care`
- Wire **mood buttons** to save today's mood. Save to `symptom_logs` using a `mood_<key>` symptom key (matches existing schema, no migration needed), show a toast, and visually mark the selected mood for the day.

### TrackPage.tsx
- Add an **"Other symptom"** tile at the end of the grid that opens a small dialog/input where the user can type a custom symptom name.
- On submit, insert into `symptom_logs` with the typed key (slugified) and intensity 2, then show it as a selected chip alongside the suggested ones.
- Custom symptoms logged today appear inline with the suggested grid so they can be toggled off the same way.

## Technical notes
- No database schema changes. `symptom_logs.symptom_key` is already a free-form text column, so custom keys work today.
- Mood save reuses the existing `togglePeriod`/`toggleSymptom` pattern with Supabase + toast.
- All visuals stay within the existing FEMME design tokens (no new colors).

## Out of scope
- No changes to Insights, Reports, Pricing, or auth flows.
- No new tier gating — both fixes are free-tier (Pearl) features.
