# Native App Store & Play Store Submission Setup

Add complete documentation (no app code changes) so you can take Pearl Femme from its current Capacitor-ready state all the way to a live listing on Apple App Store and Google Play. Capacitor, iOS, Android, and `@capacitor/assets` are already installed; `capacitor.config.ts` and `resources/` (icon + splash) are in place. The gap is process, configuration, and store-side assets — not code.

## What gets created

1. **`docs/mobile/README.md`** — entry point + high-level checklist (web → TestFlight → App Store; web → Internal testing → Play Store).
2. **`docs/mobile/01-prerequisites.md`** — accounts, hardware, tooling.
3. **`docs/mobile/02-local-setup.md`** — export to GitHub, install, `cap add`, generate icons/splash, first device run.
4. **`docs/mobile/03-production-config.md`** — switch off the Lovable hot-reload `server.url` for release builds, bump versions, set bundle IDs, configure permissions (`Info.plist`, `AndroidManifest.xml`) — for now only the ones Pearl Femme actually uses (network + push if enabled later).
5. **`docs/mobile/04-ios-submission.md`** — Apple Developer enrollment, App Store Connect app record, signing & capabilities in Xcode, archive → upload → TestFlight → App Review.
6. **`docs/mobile/05-android-submission.md`** — Play Console setup, keystore creation + secure storage, signed AAB build, Internal testing → Closed → Production.
7. **`docs/mobile/06-store-assets.md`** — required screenshot sizes, listing copy (EN + ES, matching the bilingual app), privacy policy & support URLs (point to existing `/privacy`, `/terms`, `/refund`), age rating, data-safety form answers tailored to Supabase + Paddle + Lovable AI.
8. **`docs/mobile/07-review-readiness.md`** — common rejection causes for a health/wellness + subscription app: medical disclaimer (already present), demo account for reviewers, subscription metadata, restore-purchases requirement, account deletion requirement (Apple 5.1.1(v)), Ruby tier IAP consideration.
9. **`docs/mobile/08-updates-and-ota.md`** — release cadence, version bumping, when a new binary is required vs. when web changes ship instantly via the Capacitor webview.
10. **`docs/mobile/CHECKLIST.md`** — single printable master checklist (the “complete checklist” the user asked for), with checkboxes grouped by phase.

Each file is a focused markdown doc with copy-pasteable commands and links.

## Master checklist shape (preview of `CHECKLIST.md`)

```text
Phase 0 — Accounts & tools
  [ ] Apple Developer Program ($99/yr) enrolled
  [ ] Google Play Developer ($25 one-time) enrolled
  [ ] Mac with Xcode 15+ (iOS) / Android Studio Hedgehog+ (Android)
  [ ] Node 20+, CocoaPods, JDK 17

Phase 1 — Project export
  [ ] GitHub connected, repo cloned locally
  [ ] npm install
  [ ] npx cap add ios / npx cap add android
  [ ] npx capacitor-assets generate (icons + splash from resources/)

Phase 2 — Production config
  [ ] Remove server.url from capacitor.config.ts for release
  [ ] Set version + build numbers (iOS CFBundleShortVersionString / Android versionCode)
  [ ] Verify appId matches store record
  [ ] Privacy strings in Info.plist (only what's used)
  [ ] AndroidManifest permissions reviewed

Phase 3 — iOS submission
  [ ] App Store Connect app record (bundle id, SKU, primary lang EN, secondary ES)
  [ ] Signing team + provisioning in Xcode
  [ ] Archive → Distribute → App Store Connect
  [ ] TestFlight internal test pass
  [ ] Screenshots (6.7", 6.5", 5.5", iPad 12.9" if supported)
  [ ] Privacy nutrition label (Supabase auth, analytics, AI inputs)
  [ ] Demo account + review notes
  [ ] Submit for review

Phase 4 — Android submission
  [ ] Play Console app created
  [ ] Upload signing key created (keep .keystore + passwords in 1Password)
  [ ] ./gradlew bundleRelease → signed AAB
  [ ] Internal testing track upload
  [ ] Data safety form
  [ ] Content rating questionnaire
  [ ] Store listing EN + ES
  [ ] Promote Internal → Closed → Production

Phase 5 — Post-launch
  [ ] Crash reporting verified
  [ ] Rating prompts (later)
  [ ] Update cadence documented
```

## Technical notes (for the developer doing the local steps)

- **`capacitor.config.ts`** currently includes a `server.url` pointing at the Lovable preview. The doc instructs creating a `capacitor.config.release.ts` (or env-gated config) so production builds bundle the local `dist/` instead of pointing at Lovable. Without this, App Review will reject for being a wrapper of a website.
- **Icons/splash** are already present in `resources/` and `@capacitor/assets` is installed — `06-store-assets.md` only covers the *store-listing* graphics (feature graphic 1024×500 for Play, screenshots), not in-app icons.
- **Push notifications**: `src/lib/push.ts` exists and `send-phase-notifications` edge function is deployed. Doc flags that enabling native push requires `@capacitor/push-notifications`, APNs key in Apple Developer + Firebase project for Android — listed as *optional follow-up*, not in the v1 submission checklist, to keep the first submission lean.
- **Subscriptions**: Paddle is currently the web payment path. Apple requires StoreKit/IAP for digital subscriptions consumed inside the app. `07-review-readiness.md` calls this out explicitly with two options: (a) ship native build with subscription gating disabled and direct users to web for upgrades (risky — Apple 3.1.1), or (b) integrate `@revenuecat/purchases-capacitor` before submission. Recommends (b) and links to a follow-up plan rather than implementing it here.
- **Account deletion**: Apple guideline 5.1.1(v) requires in-app account deletion for any app that supports account creation. Doc notes whether `ProfilePage` already has this; if not, flags as a blocker before submission.
- All docs are pure markdown — no dependencies, no code changes, no risk to the running app.

## Out of scope (call out for follow-up)

- Implementing in-app purchases / RevenueCat integration.
- Implementing in-app account deletion if missing.
- Setting up native push notifications (APNs + FCM).
- CI/CD (Fastlane, EAS-style automation).
- Localized App Store screenshots automation.

## Build order

1. Create `docs/mobile/` directory and all 10 files in one pass.
2. Cross-link them from the existing `resources/README.md` and root `README.md`.
3. Final message points the user to `docs/mobile/CHECKLIST.md` as the single source of truth.
