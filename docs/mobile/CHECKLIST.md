# Pearl Femme — Master Submission Checklist

Print this. Tick boxes as you go. Each phase links to the doc with the *how*.

---

## Phase 0 — Accounts & tools  · [01](./01-prerequisites.md)

- [ ] Apple Developer Program enrolled ($99/yr)
- [ ] Google Play Console enrolled ($25 one-time)
- [ ] Mac with Xcode 15+ (iOS only)
- [ ] Android Studio Hedgehog+ installed (any OS)
- [ ] Node 20+, npm, CocoaPods, JDK 17 installed
- [ ] GitHub repo connected to Lovable
- [ ] Password manager ready for keystore + secrets

## Phase 1 — Project export & local run  · [02](./02-local-setup.md)

- [ ] `git clone` + `npm install`
- [ ] `npx cap add ios`
- [ ] `npx cap add android`
- [ ] `ios/` and `android/` committed to repo
- [ ] `npx capacitor-assets generate` produced all icon + splash variants
- [ ] App runs on a physical iPhone via Xcode
- [ ] App runs on a physical Android phone or emulator via Studio

## Phase 2 — Production config  · [03](./03-production-config.md)

- [ ] `server.url` removed (or env-gated) in `capacitor.config.ts`
- [ ] `appId` changed from `app.lovable.*` to your own reverse-DNS
- [ ] `appId` matches Xcode Bundle Identifier and `android/app/build.gradle` `applicationId`
- [ ] iOS `CFBundleShortVersionString` + `CFBundleVersion` set
- [ ] Android `versionName` + `versionCode` set
- [ ] No unused privacy strings in `Info.plist`
- [ ] Only `INTERNET` permission in `AndroidManifest.xml` (or others justified)
- [ ] `CAP_ENV=production npm run build && npx cap sync` produces clean iOS archive + Android AAB

## Phase 3 — iOS submission  · [04](./04-ios-submission.md)

- [ ] App Store Connect record created (bundle ID matches)
- [ ] Spanish (Mexico) added as secondary language
- [ ] Xcode signing team selected, automatic signing on
- [ ] Archive uploaded successfully
- [ ] TestFlight smoke test passed (signup, tracking, tiers, AI, EN/ES)
- [ ] Screenshots produced for 6.7" (and 6.5", 5.5" if time)
- [ ] Listing copy entered in EN + ES
- [ ] Privacy nutrition label completed
- [ ] Age rating questionnaire completed (expect 17+)
- [ ] Demo account + review notes provided
- [ ] **Submitted for Review**
- [ ] Approved → released

## Phase 4 — Android submission  · [05](./05-android-submission.md)

- [ ] Play Console app created
- [ ] Upload keystore generated and **backed up to 1Password + offline drive**
- [ ] `android/key.properties` configured, gitignored
- [ ] `signingConfigs.release` wired in `android/app/build.gradle`
- [ ] Signed AAB built (`./gradlew bundleRelease`)
- [ ] Internal testing release uploaded
- [ ] Play App Signing accepted on first upload
- [ ] Internal testers smoke-tested via Play Store install
- [ ] App content pages all green (Privacy, App access, Ads, Content rating, Target audience, News, Health, Government, Data safety, Financial features)
- [ ] Main store listing complete (graphics + EN + ES copy)
- [ ] Closed testing run (1–2 weeks, optional)
- [ ] Production release created, rollout started at 20%
- [ ] Approved → 100% rollout

## Phase 5 — Review readiness  · [07](./07-review-readiness.md)

- [ ] In-app account deletion implemented and tested
- [ ] Subscription strategy decided: web-only (Option A) **or** RevenueCat IAP (Option B)
- [ ] If Option B: products created in App Store Connect + Play Console, wired via `@revenuecat/purchases-capacitor`, "Restore Purchases" button added
- [ ] Medical disclaimer visible on every AI screen
- [ ] AI prompts reviewed — never diagnose or prescribe
- [ ] Demo account on Ruby tier, AI quotas fresh
- [ ] Review notes explain EN/ES toggle
- [ ] Screenshots match the shipped build exactly

## Phase 6 — Post-launch  · [08](./08-updates-and-ota.md)

- [ ] Crash reporting (Sentry / Crashlytics) — optional v1
- [ ] In-app review prompt — 30+ days post-install
- [ ] Cadence agreed: native binary every 2–4 weeks
- [ ] Process documented for `git pull → build → cap sync → upload`
- [ ] Rollback plan known (iOS: new build only; Android: halt rollout + republish previous)

---

**You're done when**: both store listings are *Live*, demo account works for reviewers' future checks, and your team has the keystore + Apple credentials backed up.
