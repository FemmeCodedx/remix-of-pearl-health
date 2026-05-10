# 08 — Updates & OTA

How Pearl Femme behaves after launch, and when you need a new binary vs. when web changes ship instantly.

## How Capacitor loads the app

A Capacitor build bundles your `dist/` (the compiled React app) inside the native shell. By default, the WebView loads from the local bundle. That means:

- Changing **JS / CSS / HTML / React components** still requires `npm run build && npx cap sync` and a **new store submission**.
- Changing **edge functions, database migrations, RLS, AI prompts** is server-side — it ships **instantly** the moment you deploy in Lovable. No app update needed.

So: bug fix in `HomePage.tsx` = new store release. New AI prompt in `supabase/functions/ai-daily-insight/index.ts` = live immediately for everyone.

## Versioning rule of thumb

| Change | iOS `CFBundleShortVersionString` | iOS `CFBundleVersion` | Android `versionName` | Android `versionCode` |
|---|---|---|---|---|
| Bug fix only | 1.0.0 → 1.0.1 | +1 | 1.0.0 → 1.0.1 | +1 |
| New feature | 1.0.x → 1.1.0 | +1 | 1.0.x → 1.1.0 | +1 |
| Major redesign | 1.x.x → 2.0.0 | +1 | 1.x.x → 2.0.0 | +1 |
| Re-upload after rejection | unchanged | +1 | unchanged | +1 |

**Build numbers must always increase.** Reusing one is auto-rejected.

## Release cadence

Recommended:
- **Backend / AI / content**: ship as needed (Lovable Cloud auto-deploys edge functions).
- **Native binary**: every 2–4 weeks max, bundling several frontend improvements. Each native release re-triggers App Review (1–3 days iOS, 1–7 days Play).

## Optional: live-update OTA via Capgo / Capacitor Live Updates

If you want to push frontend changes between store releases, integrate one of:
- **Capgo** (open-source, self-hostable) — https://capgo.app
- **Capacitor Live Updates** by Ionic (paid) — https://ionic.io/products/live-updates

Both Apple and Google **allow** OTA updates as long as you only change JS/HTML/CSS, not native code or app behavior in policy-violating ways. Out of scope for v1.

## Monitoring after launch

Add later:
- Crash reporting: `@capacitor-community/sentry` or Firebase Crashlytics
- Analytics: PostHog or Plausible (already used? check current setup)
- App ratings: `@capacitor-community/in-app-review` — prompt users 30 days after install

## Pulling new Lovable changes

Whenever you push something from Lovable to GitHub:

```bash
git pull
npm install                # if package.json changed
CAP_ENV=production npm run build
npx cap sync
# then archive (iOS) or bundleRelease (Android) and upload
```

## Rolling back

- **iOS**: cannot roll back a released version. Submit a fix as a new build.
- **Android**: in Play Console → Production → Releases → halt rollout if <100%, then publish a previous AAB.

➡ See the master [CHECKLIST.md](./CHECKLIST.md).
