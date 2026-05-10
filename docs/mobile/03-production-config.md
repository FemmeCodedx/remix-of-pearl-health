# 03 — Production config

Anything in this doc must be done **before** you upload a build to App Store Connect or Play Console. Skipping any of it is the #1 cause of automatic rejection.

## 1. Stop loading from the Lovable preview URL

Open `capacitor.config.ts`. The current `server.url` points at Lovable for hot-reload — App Review will reject this as a "wrapper around a website" (Apple guideline 4.2).

Two approaches:

### Option A — Manual toggle (simple)

Comment out the `server` block before each release build:

```ts
// server: {
//   url: 'https://2888f9cd-7a0a-4c6c-ab4f-666ed29728dd.lovableproject.com?forceHideBadge=true',
//   cleartext: true,
// },
```

### Option B — Env-gated (recommended)

```ts
const isDev = process.env.CAP_ENV !== 'production';

const config: CapacitorConfig = {
  appId: 'app.lovable.2888f9cd7a0a4c6cab4f666ed29728dd',
  appName: 'Pearl Femme',
  webDir: 'dist',
  ...(isDev && {
    server: {
      url: 'https://2888f9cd-7a0a-4c6c-ab4f-666ed29728dd.lovableproject.com?forceHideBadge=true',
      cleartext: true,
    },
  }),
  // plugins: { ... }
};
```

Then before a release build:

```bash
CAP_ENV=production npm run build && npx cap sync
```

## 2. Set bundle identifier

The current `appId` is `app.lovable.2888f9cd7a0a4c6cab4f666ed29728dd`. **Change this** to your own reverse-DNS identifier *before* creating the App Store Connect / Play Console listing — it cannot be changed later.

Example: `health.pearlfemme.app`

Update in three places:
1. `capacitor.config.ts` → `appId`
2. `ios/App/App.xcodeproj` → Signing & Capabilities → Bundle Identifier
3. `android/app/build.gradle` → `applicationId`

Then run `npx cap sync`.

## 3. Version + build numbers

Bump these for **every** submission. Stores reject duplicate build numbers.

### iOS — `ios/App/App/Info.plist`

```xml
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>          <!-- user-visible, semver -->
<key>CFBundleVersion</key>
<string>1</string>              <!-- monotonic integer, +1 per upload -->
```

### Android — `android/app/build.gradle`

```gradle
defaultConfig {
    versionCode 1                 // monotonic integer, +1 per upload
    versionName "1.0.0"           // user-visible, semver
}
```

## 4. iOS privacy strings (`Info.plist`)

Pearl Femme today only makes network calls. **Add a string only if you actually use the capability** — adding unused strings is itself a rejection cause.

| Capability | Key | When to add |
|---|---|---|
| Push notifications | (none — capability flag in Xcode) | When `@capacitor/push-notifications` is integrated |
| Camera | `NSCameraUsageDescription` | If you add profile photo upload |
| Photo library | `NSPhotoLibraryUsageDescription` | Same |
| Location | `NSLocationWhenInUseUsageDescription` | If "Near me" womb-care/care-finder uses native geolocation instead of browser API |

For v1, **do not add any** unless the feature ships natively.

## 5. Android permissions (`AndroidManifest.xml`)

`android/app/src/main/AndroidManifest.xml` already declares `INTERNET`. Don't add others unless you ship the feature.

## 6. ATS / cleartext

For release iOS builds, ensure `NSAllowsArbitraryLoads` is **false** (default). Pearl Femme talks only to HTTPS endpoints (Supabase, Paddle, Lovable AI), so no exception is needed.

## 7. Sanity build

```bash
CAP_ENV=production npm run build
npx cap sync
npx cap open ios       # then: Product → Archive
npx cap open android   # then: Build → Generate Signed Bundle / APK
```

If both produce a binary without signing errors, you're ready for the platform-specific submission docs.

➡ Next: [04 — iOS submission](./04-ios-submission.md) · [05 — Android submission](./05-android-submission.md)
