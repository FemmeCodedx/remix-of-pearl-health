# 02 — Local setup

Bring the project from GitHub onto your machine, generate native iOS + Android folders, and run on a real device.

## 1. Clone

```bash
git clone https://github.com/<your-org>/<your-repo>.git pearl-femme
cd pearl-femme
npm install
```

## 2. Add native platforms (one-time)

```bash
# Mac only — iOS
npx cap add ios

# Any OS — Android
npx cap add android
```

This creates `ios/` and `android/` folders. **Commit them** — they hold native config that should be versioned.

## 3. Generate icons + splash from `resources/`

`resources/icon.png`, `resources/splash.png`, and `resources/splash-dark.png` already exist. Run:

```bash
npx capacitor-assets generate \
  --iconBackgroundColor '#F8D7DD' \
  --iconBackgroundColorDark '#2A0F1A' \
  --splashBackgroundColor '#FFF7F0' \
  --splashBackgroundColorDark '#2A0F1A'
```

This populates every required iOS `AppIcon.appiconset` and Android `mipmap-*` / `drawable-*` variant.

## 4. Build the web bundle and sync

```bash
npm run build      # produces dist/
npx cap sync       # copies dist/ + plugins into ios/ and android/
```

You will repeat **`npm run build && npx cap sync`** every time you want a new web build inside the native shell.

## 5. First device run

### iOS

```bash
npx cap open ios
```

Xcode opens. Plug in an iPhone, select it as the run target, click ▶. The first run will prompt you to enable Developer Mode on the device and trust the signing certificate.

### Android

```bash
npx cap open android
```

Android Studio opens. Either start an emulator (Tools → Device Manager) or plug in an Android phone with USB debugging enabled, then click ▶.

## 6. Verify the app loads

The app currently uses `server.url` in `capacitor.config.ts` to hot-reload from Lovable's preview. That's fine for development, but **must be removed before release builds** — see [03 — Production config](./03-production-config.md).

➡ Next: [03 — Production config](./03-production-config.md)
