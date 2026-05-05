## Goal

Rename the app brand from "Pearl (FEMME) Health" to **Pearl Health** everywhere it appears in user-facing copy and metadata.

## Scope: text-only rename

Replace `Pearl (FEMME) Health` → `Pearl Health` (and `Pearl FEMME Health` → `Pearl Health`) in:

- `index.html` — `<title>`, description, author, og:title (4 spots)
- `src/lib/i18n.tsx` — EN + ES copies of `appName`, onboarding `enter`, care/womb `disclaimerCurate`, push notification `iosHint` + setup steps, `vetted` label (~10 spots total)
- `public/sw.js` — comment + default push notification title (2 spots)

## Out of scope (intentionally NOT changing)

- **CSS class `gradient-femme` / CSS var `--gradient-femme`** in `src/index.css` and ~10 components — internal style token, not user-facing. Renaming risks breaking styling with no user benefit.
- **Subscription tier `pearl`** — that's the free-tier name, unrelated to the app brand.
- **Memory file** `mem://style/visual-identity` — references "FEMME visual design" as an internal aesthetic label; will leave as-is unless you want it updated too.

## Verification

After edits, re-run `rg -n "FEMME"` to confirm only the intentional CSS token usages remain.
