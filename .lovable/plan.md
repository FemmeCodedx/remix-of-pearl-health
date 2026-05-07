## Rename app to Pearl (Femme) Health (PFH App) + update legal entity

### Naming summary

- **Front-facing brand:** Pearl Swan Health
- **Short/abbreviation:** PSH App
- **Legal entity (policies, footer):** Gorgeous Girls Heal INC

Note: "Pearl" and "Swan" are also existing subscription tier names. Tier names will stay as-is (Pearl, Swan, Ruby) — they're distinct from the app brand.

### Files to update

**1. `src/lib/i18n.tsx**` — change all user-facing copy (EN + ES)

- `appName`: `"Pearl Health"` → `"Pearl Swan Health"` (both EN line 13 and ES line 567)
- Onboarding `enter`: `"Enter Pearl Health"` → `"Enter Pearl Swan Health"` (and ES "Entrar a Pearl Swan Health")
- `disclaimerCurate` (care + womb, EN+ES): replace "Pearl Health" → "Pearl Swan Health"
- iOS push hint + iOS step copy (EN+ES): "Pearl Health" → "Pearl Swan Health"
- `vetted` label (EN+ES): "Vetted by Pearl Health" → "Vetted by Pearl Swan Health" / "Verificado por Pearl Swan Health"

**2. `index.html**` — title, description, author, og:title metatags: "Pearl Health" → "Pearl Swan Health"

**3. `public/sw.js**` — push notification title + comment: "Pearl Health" → "Pearl Swan Health"

**4. Legal entity update** (separate from front-facing name):

- `src/pages/TermsPage.tsx` — `SELLER = "Gorgeous Girls Heal INC"`
- `src/pages/PrivacyPage.tsx` — `SELLER = "Gorgeous Girls Heal INC"`
- `src/components/LegalFooter.tsx` — `© {year} Gorgeous Girls Heal INC.`
- `src/pages/RefundPage.tsx` line 19 — "We want you to love Pearl Health" → "We want you to love Pearl Swan Health" (front-facing in body, legal entity already not referenced here)
- In Terms/Privacy bodies: where it currently uses `{SELLER}` it will now correctly say "Gorgeous Girls Heal INC". Add a short trading-name clause in Terms section 1: "Gorgeous Girls Heal INC, trading as Pearl Swan Health (PSH App)."

### Out of scope

- Tier names (Pearl/Swan/Ruby) stay unchanged
- Internal CSS tokens like `gradient-femme`, `bg-pearl` remain
- No logo/image regeneration
- Email address (`support@pearlhealth.app`) — flagging: do you want this changed too? If so, tell me the new address; otherwise it stays.