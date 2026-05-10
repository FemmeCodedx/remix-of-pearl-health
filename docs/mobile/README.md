# Pearl Femme — Native Mobile Submission

This folder is the single source of truth for taking Pearl Femme from a Lovable web app to a published native app on the **Apple App Store** and **Google Play Store**.

The codebase is already Capacitor-ready (`@capacitor/core`, `@capacitor/ios`, `@capacitor/android`, `@capacitor/assets` installed; `capacitor.config.ts` and `resources/` icon + splash present). What remains is a sequence of **local + store-side** steps that cannot run inside Lovable's sandbox.

## Read in order

1. [01 — Prerequisites](./01-prerequisites.md)
2. [02 — Local setup](./02-local-setup.md)
3. [03 — Production config](./03-production-config.md)
4. [04 — iOS submission](./04-ios-submission.md)
5. [05 — Android submission](./05-android-submission.md)
6. [06 — Store assets & listings](./06-store-assets.md)
7. [07 — Review readiness](./07-review-readiness.md)
8. [08 — Updates & OTA](./08-updates-and-ota.md)

## Or jump to the master list

➡ **[CHECKLIST.md](./CHECKLIST.md)** — printable, phase-by-phase checkboxes.

## High-level path

```
Lovable web build
   │
   ├──► Export to GitHub ──► clone locally ──► npm install
   │
   ├──► npx cap add ios     ──► Xcode  ──► Archive ──► TestFlight ──► App Store
   │
   └──► npx cap add android ──► Studio ──► AAB     ──► Internal   ──► Play Store
```

Estimated time, first time through: **2–4 weeks** end-to-end (mostly waiting on Apple/Google review and screenshot prep, not coding).
