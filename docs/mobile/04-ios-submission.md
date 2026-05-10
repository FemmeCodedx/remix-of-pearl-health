# 04 — iOS submission

End-to-end: from a clean Xcode project to a live App Store listing.

## 1. App Store Connect — create the app record

1. Sign in to https://appstoreconnect.apple.com → **My Apps** → **+** → **New App**.
2. Fill in:
   - **Platforms**: iOS
   - **Name**: `Pearl Femme` (must be unique on the App Store)
   - **Primary language**: English (U.S.)
   - **Bundle ID**: select the one you registered at https://developer.apple.com/account/resources/identifiers/list — must match `capacitor.config.ts` `appId`
   - **SKU**: `pearl-femme-ios-001` (internal, never shown)
   - **User access**: Full Access
3. After creation, go to **App Information** → add **Spanish (Mexico)** as a secondary language so you can localize the listing later.

## 2. Xcode — signing & capabilities

```bash
npx cap open ios
```

In Xcode, with the `App` target selected:

1. **Signing & Capabilities** → check *Automatically manage signing* → select your Team.
2. Confirm **Bundle Identifier** matches App Store Connect exactly.
3. Add capabilities only if used: Push Notifications, Sign in with Apple, etc. (For v1, none.)
4. **General** → confirm `Display Name`, `Version`, `Build`.

## 3. Archive + upload

1. In Xcode toolbar, select **Any iOS Device (arm64)** as the run destination (not a simulator).
2. **Product → Archive**. Wait 2–10 min.
3. Organizer window opens → select the archive → **Distribute App** → **App Store Connect** → **Upload**.
4. Accept defaults (automatic signing, include symbols, manage version).
5. Upload completes → it appears in App Store Connect under **TestFlight** within 5–30 min after Apple processes it.

## 4. TestFlight (internal test)

1. App Store Connect → **TestFlight** tab → wait until status is *Ready to Submit*.
2. Add yourself to **Internal Testing** group.
3. Install **TestFlight** app on your iPhone, accept the invite, install build, smoke-test:
   - Sign up + sign in
   - Cycle tracking + symptom logging
   - Pearl/Swan/Ruby tier gates
   - AI features (if Ruby)
   - Language toggle (EN/ES)
   - Sign out + account deletion (see [07 — Review readiness](./07-review-readiness.md))

## 5. Prepare the App Store listing

In App Store Connect → **App Store** tab → **iOS App 1.0**:

- **Screenshots** (see [06 — Store assets](./06-store-assets.md))
- **Description**, **Keywords**, **Support URL** (`https://thepearlhealth.lovable.app/privacy` works), **Marketing URL**
- **Promotional Text** (≤170 chars, editable without resubmission)
- **App Privacy** → Data Types collected → see [07](./07-review-readiness.md)
- **Age Rating** → questionnaire, expect **17+** because of health/medical info
- **App Review Information** → demo account credentials (mandatory for any login-gated app), review notes explaining the bilingual flow + tier system
- **Version Release** → Manually release after approval (recommended for first launch)

## 6. Submit for review

Click **Add for Review** → **Submit for Review**. Status moves through:

```
Waiting for Review (1–24h)  →  In Review (1–4h)  →  Pending Developer Release / Ready for Sale
```

Typical first-submission turnaround: **24–72 hours**. Rejections come with a message in the **Resolution Center** — read [07 — Review readiness](./07-review-readiness.md) to pre-empt the common ones.

## 7. Going live

When status is **Pending Developer Release**, click **Release This Version**. The app appears on the store within 1–4 hours globally.

➡ Next: [05 — Android submission](./05-android-submission.md)
