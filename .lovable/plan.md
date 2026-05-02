## Goal

Add the uploaded "Luteal Phase Symptoms: Research Overview" PDF as in-app educational content inside the Learn tab — readable natively, with the PDF available for download.

## Changes

1. **New page `src/pages/LutealPhasePage.tsx`** at route `/learn/luteal-phase`. Renders the 11 sections of the report as styled cards:
   - What is the luteal phase + hormonal profile table (early/mid/late luteal/menses)
   - Symptom prevalence & epidemiology
   - Symptom-by-symptom comparison
   - Severity by cycle day (rendered as a colored intensity grid for mobile readability instead of literal dots)
   - Age & BMI differences
   - Evidence-based management (diet, exercise, sleep, CBT)
   - Supplements evidence summary
   - Lifestyle quick-reference tips
   - PMS vs PMDD vs Luteal Phase Defect comparison
   - Consensus vs controversies
   - References (collapsed in an Accordion)
   - Persistent "Educational resource only" disclaimer footer
   - Playfair Display headings, Luxe palette per FEMME visual identity

2. **PDF download** — copy source to `public/resources/luteal-phase-report.pdf` and add a "Download full PDF" button at the top of the page.

3. **Learn page entry** — in `src/pages/LearnPage.tsx`, add a featured card above Hormone Education titled "Deep Dive: Luteal Phase Report" (Moon icon) linking to `/learn/luteal-phase`. Hidden for the 12–16 age group.

4. **Routing** — register the new route in `src/App.tsx` inside `AppShell`.

5. **i18n** — add English + Spanish strings in `src/lib/i18n.tsx` for the entry card, page title, section headings, and disclaimer. Body clinical content stays in English in v1 with a small "Spanish translation coming soon" note when `lang === 'es'` (full clinical translation deferred).

6. **Cross-link from Track** — on `TrackPage`, when current phase = luteal, show a subtle "Learn about luteal symptoms →" link to the new page.

## Technical notes

- Pure static content — no new DB tables, hooks, or edge functions.
- Tables: Tailwind `<table>` wrapped in `overflow-x-auto` for mobile.
- Reference list inside `Accordion` to keep page scannable.

## Out of scope

- Full Spanish translation of clinical body text (follow-up).
- Personalized matching against the user's tracked symptoms.
