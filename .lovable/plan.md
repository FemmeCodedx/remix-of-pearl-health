## Goal
Let demo users recover their account if they forget their password.

## Changes

### 1. Add "Forgot password?" link on `AuthPage`
- In `src/pages/AuthPage.tsx`, under the password field (login mode only), add a small link that opens an inline "Forgot password" view.
- Inline view collects email and calls:
  ```ts
  supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })
  ```
- Show toast: "Check your email for a reset link."
- Bilingual EN/ES strings via existing `i18n` pattern.

### 2. New page: `src/pages/ResetPasswordPage.tsx`
- Public route `/reset-password` (no auth gate, like `/auth`).
- On mount, Supabase auto-creates a recovery session from the URL hash (`type=recovery`). Listen via `onAuthStateChange` for the `PASSWORD_RECOVERY` event to confirm the user landed from a valid link.
- Form: new password + confirm password (min 6 chars, must match).
- Submit calls `supabase.auth.updateUser({ password })`.
- On success: toast + sign out + redirect to `/auth` so they log in fresh with the new password.
- If no recovery session detected, show "Invalid or expired reset link" with a link back to `/auth`.

### 3. Register route in `src/App.tsx`
- Add `<Route path="/reset-password" element={<ResetPasswordPage />} />` alongside `/auth` (outside the `OnboardingGate`).

## Out of scope
- Custom-branded auth email templates. Default Lovable auth emails will deliver the reset link — fine for demo. We can scaffold branded templates later if you want.
- Social login (Google/Apple) — separate task.

## Files touched
- `src/pages/AuthPage.tsx` (edit)
- `src/pages/ResetPasswordPage.tsx` (new)
- `src/App.tsx` (add route)
- `src/lib/i18n.tsx` (add a few strings)
