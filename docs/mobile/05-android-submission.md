# 05 — Android submission

End-to-end: from a Capacitor Android project to a live Play Store listing.

## 1. Play Console — create the app

1. Sign in to https://play.google.com/console → **Create app**.
2. Fill in:
   - **App name**: `Pearl Femme`
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free (subscriptions are sold inside the app)
   - Tick the two declarations.

## 2. Create the upload keystore (one-time, do not lose)

```bash
keytool -genkey -v \
  -keystore pearl-femme-release.keystore \
  -alias pearl-femme \
  -keyalg RSA -keysize 2048 -validity 10000
```

You will be asked for:
- **Keystore password** — store in 1Password
- **Key password** — store in 1Password
- Distinguished Name fields (CN, O, L, ST, C)

⚠️ **Back up `pearl-femme-release.keystore` to 1Password and an offline drive.** If you lose it, you can never publish updates to this app under the same package name. Google's *Play App Signing* helps, but only if enrolled — see step 4.

## 3. Wire the keystore into Gradle

Create `android/key.properties` (DO NOT commit):

```properties
storeFile=/absolute/path/to/pearl-femme-release.keystore
storePassword=...
keyAlias=pearl-femme
keyPassword=...
```

Add to `android/.gitignore`:
```
key.properties
```

Edit `android/app/build.gradle`, above `android { ... }`:

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Inside `android { ... }`:

```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
    }
}
```

## 4. Build a signed AAB

```bash
CAP_ENV=production npm run build
npx cap sync android
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

## 5. Internal testing track

In Play Console → your app → **Testing → Internal testing**:

1. **Create new release** → upload `app-release.aab`.
2. On first upload, Play offers **Play App Signing** — **accept it**. Google then re-signs your AAB with their managed key; you keep your upload key for future uploads. This is the safety net for keystore loss.
3. Add release notes (EN + ES).
4. **Testers** → create an email list, add yourself + teammates.
5. Save → Review release → **Start rollout**.
6. Open the opt-in URL on your Android phone, install via Play Store, smoke-test (same checklist as [04](./04-ios-submission.md) §4).

## 6. Set up store listing

Required pages in the left nav, all must be ✅ before you can promote to production:

- **App content**
  - Privacy policy URL: `https://thepearlhealth.lovable.app/privacy`
  - App access: provide demo account credentials for the reviewer
  - Ads: No
  - Content ratings: complete questionnaire (expect *Mature 17+* due to health content)
  - Target audience: 18+
  - News app: No
  - Health apps declaration: Yes (it's a health/wellness app), agree to policy
  - Government apps: No
  - Data safety: see [07 — Review readiness](./07-review-readiness.md)
  - Financial features: subscriptions only
- **Main store listing**
  - App name, short description (80 chars), full description (4000 chars) — see [06](./06-store-assets.md)
  - Graphics: app icon 512×512, feature graphic 1024×500, phone screenshots
- **Store settings** → Category: *Health & Fitness*

## 7. Promote Internal → Closed → Production

1. **Closed testing** (optional but recommended): copy the internal release, add 20–100 external testers via email list.
2. Run for 1–2 weeks, fix bugs.
3. **Production** → Create release → upload (or promote the same AAB) → Set rollout % (start at 20%, go to 100% after 48h).
4. First production release goes through manual review: **3–7 days** typical.

➡ Next: [06 — Store assets](./06-store-assets.md)
