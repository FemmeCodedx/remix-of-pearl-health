## Goal
When a user lands on `/reset-password` with an invalid or expired link, give them a way to request a fresh reset email without going back to the sign-in page.

## Changes (single file: `src/pages/ResetPasswordPage.tsx`)

### Invalid-state UI
Replace the current "Invalid or expired reset link" block with:
- The same error message
- An email input (pre-filled if we can recover one from the URL, otherwise empty)
- A **"Resend reset link"** button that calls:
  ```ts
  supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  ```
- The existing "Back to sign in" link

### Behavior
- Disable the button while sending; show "Sending..." label.
- On success: toast "Check your email" + "We sent you a new reset link." and switch the view to a confirmation message ("Email sent — check your inbox").
- On error: destructive toast with the error message.

### Bilingual strings (EN/ES)
Add to the local `copy` object:
- `resendTitle`, `resendSubtitle`, `emailLabel`, `resend`, `resending`, `resent`, `resentDesc`

## Out of scope
- Rate-limiting UI (Supabase already throttles `resetPasswordForEmail`; surface its error if it fires).
- Changes to `AuthPage.tsx` or routing.
