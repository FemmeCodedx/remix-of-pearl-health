## Goal
Add a "Maternal Health & Your Rights" deep-dive page based on the reviewed Maternal Health Dashboard, integrated into the Learn hub and surfaced as crisis hotlines in the Womb Care section.

## Changes

1. **New page `src/pages/MaternalHealthPage.tsx`** at route `/learn/maternal-health`. Sections:
   - **Crisis hotlines (top, sticky-feeling card)** — National Maternal Mental Health Hotline (1-833-TLC-MAMA), Postpartum Support International (1-800-944-4773), Crisis Text Line (text HOME to 741741). Each as `tel:` / `sms:` link with large tap targets.
   - **Key statistics** — mortality rate (17.9 per 100K), preventable deaths (87%), postpartum risk window (57% of deaths occur 1 week–1 year after delivery). Rendered as stat cards.
   - **Racial disparities** — Black women 3x higher mortality, Indigenous women 2x; brief context paragraph.
   - **Social & structural factors** — access to care, insurance gaps, bias in clinical settings, doula access (bullet list cards).
   - **Know your rights** — informed consent, refusal of treatment, birth plan advocacy, support person presence.
   - **Resource directory** — Federal: WIC, Medicaid/CHIP. Doula support: DONA, HealthConnect One. Advocacy: Black Mamas Matter Alliance, National Birth Equity Collaborative, Postpartum Support Intl. External links open in new tab.
   - Disclaimer footer: "Educational resource only — not medical advice. If in crisis, call 911."
   - Luxe palette, Playfair Display headings, mobile-first.

2. **Learn hub entry** — in `src/pages/LearnPage.tsx`, add a featured "Deep Dive: Maternal Health & Your Rights" card (Baby or HeartPulse icon) linking to `/learn/maternal-health`. Age-gated: hidden for "12-16" age group (visible for 17+).

3. **Womb Care crisis hotline strip** — in `src/components/womb/WombCareSection.tsx`, add a compact red/magenta-accent "Crisis support" mini-card above the categories grid showing the TLC-MAMA hotline + a link to `/learn/maternal-health` for the full list.

4. **Routing** — register `/learn/maternal-health` in `src/App.tsx`.

5. **i18n** — add EN + ES strings in `src/lib/i18n.tsx` for: card title/desc on Learn, page title, section headings, hotline labels, disclaimer, and the Womb Care crisis strip label. Body content (statistics, rights list, resources) stays English in v1 with a "Spanish translation coming soon" note when `lang === 'es'`.

## Technical notes
- Pure static content; no DB tables, hooks, or edge functions.
- All resource links use `<a target="_blank" rel="noopener noreferrer">`.
- Hotlines use `href="tel:18338526262"` and `href="sms:741741?body=HOME"` for native dialer/SMS launch on mobile.
- Reuse `Card`, `Accordion` from existing UI primitives.

## Out of scope
- Full Spanish clinical translation (deferred).
- Geolocated provider lookup (already covered by Womb Care "Near me").
- Personalized risk assessment.
