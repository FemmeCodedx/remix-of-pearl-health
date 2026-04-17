# Rename App to "Pearl Health"

## Scope

Update the app name across all user-facing surfaces. The current name "FEMME" appears in the browser title, meta tags, and the `appName` i18n string used on the Home/Welcome screens.

## Changes

1. `**index.html**`
  - `<title>`: `Pearl (FEMME) Health — Women's Wellness`
  - `<meta name="description">`: update to lead with "Pearl (FEMME) Health"
  - `<meta name="author">`: `Pearl (FEMME) Health`
  - `og:title` / `twitter` tags: `Pearl (FEMME) Health — Women's Wellness`
2. `**src/lib/i18n.tsx**`
  - `en.appName`: `"Pearl (FEMME) Health"`
  - `es.appName`: `"Pearl (FEMME) Health"` (brand name kept identical in Spanish)
3. **Audit other references**
  - Quickly check `OnboardingPage.tsx`, `HomePage.tsx`, `AuthPage.tsx`, and `PricingPage.tsx` for any hardcoded "FEMME" strings that should become "Pearl (FEMME) Health" (welcome copy, headers, plan summary). Update only the ones that read as the product name; keep the existing tier name "Pearl" (subscription) distinct — that is a separate concept and stays as-is.
4. **Memory update**
  - Update `mem://index.md` Core to note the official product name is "Pearl (FEMME) Health" so future copy stays consistent.

## Out of scope

- Logo/favicon changes (ask separately if you want a new mark)
- Renaming the "Pearl" subscription tier — it stays as the free tier name