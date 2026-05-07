## Add iOS & Android app icons + splash screens (Capacitor native)

Source artwork already generated and previewed (luxe `pf` monogram on magenta→tangerine gradient + cream/rose splash). Now wire it into a Capacitor native build.

### What I'll add

**1. Capacitor scaffolding** (already installed: `@capacitor/core`, `@capacitor/ios`, `@capacitor/android`, `@capacitor/cli`, `@capacitor/assets`)

`capacitor.config.ts` at project root:
- `appId: app.lovable.2888f9cd7a0a4c6cab4f666ed29728dd`
- `appName: "Pearl Femme"`
- `webDir: "dist"`
- `server.url` pointing at the Lovable sandbox preview (hot-reload during dev)
- `SplashScreen` plugin config (2s duration, cream `#FFF7F0` background, no spinner)

**2. Source assets** in `resources/`
- `resources/icon.png` — 1024×1024 master icon (the AI-generated `pf` monogram)
- `resources/splash.png` — 2732×2732 light splash (cream/rose gradient)
- `resources/splash-dark.png` — 2732×2732 dark splash variant

**3. `resources/README.md`** with the exact `npx capacitor-assets generate` command the user runs locally (after `npx cap add ios` / `npx cap add android`) to fan these out into all required platform-specific sizes:
- iOS: `Assets.xcassets/AppIcon.appiconset/*` (every required pt size) + `Splash.imageset`
- Android: `mipmap-mdpi…xxxhdpi` launcher icons, adaptive icon foreground/background XML, and `drawable*/splash.png`

### Local steps the user runs (documented in README)

```bash
npm install
npx cap add ios          # macOS only
npx cap add android
npx capacitor-assets generate
npx cap sync
npx cap run ios          # or: npx cap run android
```

### Out of scope
- Actually committing the per-size generated platform files (those live inside `ios/` and `android/` folders that only exist after the user runs `npx cap add` on their machine — Lovable's sandbox doesn't keep them).
- App Store / Play Store listing assets (screenshots, feature graphic) — separate task.
- Push notification icons (already handled by web `sw.js`).

### Note for the user
After approval I'll save the icon preview to `/mnt/documents/pearl-femme-icon-preview.png` so you can review/share it. If you want to swap the artwork later, replace `resources/icon.png` and re-run `npx capacitor-assets generate`.