## Part 1 — Fix the blocking build error (must ship first)

`src/lib/i18n.tsx` is malformed. At line 383, a stray `},` closes both the `en` object **and** the outer `translations` object, leaving every Spanish key (lines 384–759) sitting at the wrong nesting level. Esbuild then chokes on the final `};` at line 761.

**Fix:** replace line 383 (`  },`) with `  es: {` so the Spanish block opens correctly. The existing closers at lines 759–761 (`}, }, };`) will then balance: end of `es` → end of `translations` → statement terminator. No other content needs to move.

After the edit I'll run `bunx tsc --noEmit` to confirm the file parses and the `Translations = typeof translations.en` type still resolves.

---

## Part 2 — Cycle-phase push notifications

Goal: when the user transitions into a new cycle phase (Menstrual → Follicular → Ovulation → Luteal), send them a push notification with phase-aware guidance ("You're entering your follicular phase — energy is rising, great time for new workouts").

### Clarifying assumption
You said "when someone in a different cycle phase" — I'm reading that as **the user themselves** entering a new phase (not a social/friends feature). If you actually meant notifying friends/community when *they* change phases, tell me and I'll re-plan around a friends graph + privacy controls.

### Delivery channel
Lovable apps run in the browser, so true OS-level push requires either:
- **Web Push (PWA + service worker + VAPID)** — works on Android/desktop Chrome/Firefox/Edge and iOS 16.4+ *only after the user installs the PWA to home screen*. Free, no vendor.
- **Capacitor + FCM/APNs** — only if you wrap the app natively (you haven't yet).

Recommended: **Web Push via VAPID + service worker**, since it works in-browser today and upgrades cleanly if you later add Capacitor. I'll warn in the UI that iOS users must "Add to Home Screen" first.

### Database (one migration)
- `push_subscriptions` table: `id`, `user_id` (fk auth.users), `endpoint` (unique), `p256dh`, `auth`, `user_agent`, `created_at`. RLS: users manage their own rows.
- `notification_log` table: `id`, `user_id`, `phase`, `sent_at`, `success`. Prevents duplicate sends for the same phase transition within 20 hours. RLS: select-own.
- Add `notif_phase_change boolean default true` to `profiles` so users can opt out.

### Edge functions (2)
1. **`save-push-subscription`** — authenticated, accepts the browser PushSubscription JSON, upserts into `push_subscriptions`. Validates with zod.
2. **`send-phase-notifications`** — service-role function run on a schedule. For every profile with `notif_phase_change=true`, `last_period_date`, and `avg_cycle_length`:
   - Compute today's phase (menstrual: days 1–5, follicular: 6–13, ovulation: 14–16, luteal: 17–end).
   - Compute yesterday's phase. If different and no `notification_log` row in last 20h for this phase, send web push to all the user's subscriptions and log it.
   - Uses `web-push` (Deno port) signed with VAPID keys from secrets. Drops 410/404 endpoints.

### Cron
Insert (not migration — uses secrets) a `pg_cron` job that calls `send-phase-notifications` once a day at 9am UTC via `pg_net`. I'll need `pg_cron` and `pg_net` enabled — I'll enable them in the migration.

### Secrets needed
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT` (a `mailto:` string)

I'll generate a keypair locally and ask you to paste the values into Lovable Cloud secrets via `add_secret`. (The public key is also embedded client-side — that's expected and safe.)

### Frontend
- Tiny `src/lib/push.ts` helper: registers `/sw.js`, requests Notification permission, subscribes via PushManager with the VAPID public key, posts the subscription to `save-push-subscription`.
- `public/sw.js` (minimal): handles `push` events and shows the notification with title/body/icon from the payload; handles `notificationclick` to focus/open the app.
- New `PhaseNotificationsCard` on **ProfilePage** with: status (granted/denied/default), enable button, opt-out toggle bound to `profiles.notif_phase_change`, and an iOS "Add to Home Screen first" hint when running in Safari without standalone display mode.
- i18n strings (en + es) for the card, the permission prompts, and the four phase-transition push bodies.

### What I'm explicitly NOT doing (tell me if you want any)
- No PWA install/manifest beyond the existing setup — push will only work where the browser already supports it.
- No SMS/email fallback.
- No friends-of-friends notifications.
- No notification of *other* event types (period predicted, ovulation predicted) — easy to add later by reusing the same pipeline.