# Insights Dashboard with Doctor-Flag Alerts

## What exists today

- **Reports page** (`/reports`, Swan+) — last 12 months of symptom + cycle logs, "top symptoms" list, and a PDF export.
- **Track page** — day-by-day logging UI.
- No monthly trend charts. No automated flags for things worth discussing with a doctor.

## What we'll add

A new **Insights** dashboard that turns the data already in `symptom_logs` and `cycle_logs` into:

1. Month-over-month trend visualizations.
2. A "Discuss with your doctor" panel that automatically flags clinically-notable patterns.
3. An option to include both sections in the existing PDF export so users can hand it to a provider.

The page is gated to Swan+ (matches the existing Reports gate). Pearl users see a teaser + upgrade prompt.

## Page layout

```text
┌───────────────────────────────────────────────────┐
│  Insights                          [Export PDF]   │
├───────────────────────────────────────────────────┤
│  Range: [3 mo] [6 mo] [12 mo]                     │
├───────────────────────────────────────────────────┤
│  Cycle length over time     Period length         │
│  ┌───────────────┐          ┌───────────────┐     │
│  │   line chart  │          │   line chart  │     │
│  └───────────────┘          └───────────────┘     │
├───────────────────────────────────────────────────┤
│  Symptom frequency by month (stacked bar)         │
│  ┌─────────────────────────────────────────┐      │
│  │                                         │      │
│  └─────────────────────────────────────────┘      │
├───────────────────────────────────────────────────┤
│  Discuss with your doctor                         │
│  • Cycles shorter than 21 days (2 in last 6 mo)   │
│  • Severe cramps logged 4+ months in a row        │
│  • Period missing for 45+ days                    │
│  [Add to PDF report]                              │
└───────────────────────────────────────────────────┘
```

## Flag rules (v1)

Pure client-side derivations from existing data. No new tables. Each flag has a short, neutral explanation and is labeled "informational, not medical advice."

| Flag | Trigger |
|---|---|
| Short cycles | 2+ cycles under 21 days in last 6 months |
| Long cycles | 2+ cycles over 35 days in last 6 months |
| Irregular cycles | Cycle-length stdev > 7 days over last 6 cycles |
| Missed period | >45 days since last period start (and user has cycles) |
| Heavy/long bleeding | Period length > 7 days, 2+ times in last 6 months |
| Persistent severe symptom | Same symptom logged at intensity 3 on 5+ days in a single month |
| Recurring severe symptom | Same symptom at intensity 3 in 3+ consecutive months |
| New symptom spike | Symptom that appears 5+ times in current month but 0 in prior 3 months |

Rules live in `src/lib/healthFlags.ts` so they're easy to tune.

## Navigation

- New route `/insights`.
- Add an "Insights" entry to the bottom nav (or move existing Reports entry to point at Insights and keep `/reports` as the export-only flow). Decision below.

## Technical notes

- Charts: `recharts` (already common in Lovable projects; add if not present).
- Data: reuse the same `symptom_logs` + `cycle_logs` queries from `ReportsPage`, just extend the window to 12 months and bucket by `YYYY-MM`.
- Flag engine: synchronous, deterministic, fully covered by unit-testable pure functions.
- PDF: extend `src/lib/reportPdf.ts` with an `insightsSection` + `flagsSection`.
- Gating: `useTierAccess().hasSwan` + `<UpgradeGate />`, same pattern as Reports.
- i18n: copy lives in `src/lib/i18n*` files, English + Spanish.

No schema changes. No new edge functions.

## Open questions for you

1. **Nav placement** — replace the current "Reports" tab with "Insights" (Reports becomes a button inside it), or keep both as separate tabs?
2. **Flag tone** — neutral medical (e.g. "Cycle length variability is high — consider mentioning to your provider") or warmer FEMME voice (e.g. "Your cycles have been a bit unpredictable lately — worth a chat with your doctor")?
3. **Should the doctor-flag section also appear on the Home page** as a small banner when something new triggers, or only inside Insights?
