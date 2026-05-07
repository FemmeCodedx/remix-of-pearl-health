# Pearl Femme — Mobile App Icons & Splash

Source assets used by `@capacitor/assets` to generate every iOS & Android icon and splash variant.

## Files

- `icon.png` — 1024×1024 master app icon (luxe pink→tangerine gradient, `pf` monogram).
- `splash.png` — 2732×2732 light-mode splash background (cream/rose).
- `splash-dark.png` — 2732×2732 dark-mode splash background.

To swap artwork later, replace these files (same dimensions) and re-run the generate command below.

## Local setup (run on your own machine)

After exporting to GitHub and `git pull`-ing the project:

```bash
npm install
npx cap add ios          # macOS + Xcode required
npx cap add android      # Android Studio required
npx capacitor-assets generate \
  --iconBackgroundColor '#F8D7DD' \
  --iconBackgroundColorDark '#2A0F1A' \
  --splashBackgroundColor '#FFF7F0' \
  --splashBackgroundColorDark '#2A0F1A'
npm run build
npx cap sync
npx cap run ios          # or: npx cap run android
```

`capacitor-assets generate` produces:
- **iOS** — `ios/App/App/Assets.xcassets/AppIcon.appiconset/*` and `Splash.imageset/*`
- **Android** — `android/app/src/main/res/mipmap-*/ic_launcher*.png`, adaptive-icon XML, and `drawable*/splash.png`
