## Goal
Make Pearl Femme installable on iOS and Android home screens with offline support via `vite-plugin-pwa`.

## Heads-up (important)
- **Will not work in the Lovable editor preview.** Service workers are disabled in the iframe. Test on the published `.lovable.app` URL after Publish.
- Your existing `public/sw.js` (push notifications) **conflicts** with the Workbox service worker that vite-plugin-pwa generates — both can't live at `/sw.js`. We'll merge push handling into the new Workbox SW via `injectManifest` mode so push still works.

## Changes

### 1. Generate brand icon
Use `imagegen` (premium) to create a single 1024×1024 PNG: oyster shell with pearl, brand pink/magenta/gold gradient on white. Save to `src/assets/pwa-icon.png`.

Then use a small Node script (sharp or already-available image tooling) to derive:
- `public/icons/icon-192.png`
- `public/icons/icon-512.png`
- `public/icons/icon-512-maskable.png` (with safe-zone padding for Android adaptive icons)
- `public/icons/apple-touch-icon.png` (180×180, no transparency)

### 2. Install + configure vite-plugin-pwa (`injectManifest` mode)
- `bun add -d vite-plugin-pwa`
- In `vite.config.ts` add `VitePWA({...})` with:
  - `strategies: "injectManifest"` (so we keep our push code)
  - `srcDir: "src"`, `filename: "sw.ts"` → output at `/sw.js`
  - `registerType: "autoUpdate"`
  - `devOptions: { enabled: false }` (per Lovable PWA rules)
  - `manifest`: name "Pearl Femme", short_name "Pearl", `display: "standalone"`, `theme_color: "#d1548a"`, `background_color: "#FFF7F0"`, `start_url: "/"`, `scope: "/"`, the icons above (incl. maskable)
  - `workbox.navigateFallbackDenylist: [/^\/~oauth/, /^\/api/]`
  - `injectManifest.globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"]`

### 3. New service worker: `src/sw.ts`
Single file that combines:
- Workbox precache: `precacheAndRoute(self.__WB_MANIFEST)`
- `NetworkFirst` for HTML navigations (3s timeout) — prevents stale-shell lock-in
- `CacheFirst` for fonts/images with expiration
- Existing push handler logic ported from `public/sw.js` (`push`, `notificationclick` events)
- `skipWaiting` + `clients.claim` on install/activate

### 4. Delete old `public/sw.js`
The new `/sw.js` (Workbox-built) replaces it.

### 5. Registration guard in `src/main.tsx`
Use `virtual:pwa-register` with the iframe/preview-host guard from Lovable's PWA spec — only register on the deployed origin, never inside the editor iframe. In preview, proactively unregister any existing SW so dev isn't broken.

### 6. Update `index.html`
- Add `<link rel="manifest" href="/manifest.webmanifest">` (auto-injected by plugin, but verify)
- Add `<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">`
- Keep existing theme-color and apple-mobile-web-app meta tags
- Update title-bar/iOS status style if needed

### 7. Optional install CTA (small)
Add a tiny `useInstallPrompt` hook that captures `beforeinstallprompt` and exposes `promptInstall()`. Surface a one-line "Install app" button in the `UserMenu` or profile page (Android shows native prompt; iOS users get a short instruction toast: "Tap Share → Add to Home Screen").

## Out of scope
- Background sync, push subscription changes, periodic sync.
- Replacing the existing push-subscription save flow (`save-push-subscription` edge function stays as-is).
- Native Capacitor build (separate path).

## Files touched
- `vite.config.ts` (edit)
- `src/sw.ts` (new)
- `src/main.tsx` (edit — register SW with guard)
- `src/hooks/useInstallPrompt.ts` (new)
- `src/components/UserMenu.tsx` (edit — add install button)
- `index.html` (edit — apple-touch-icon link)
- `public/sw.js` (delete)
- `src/assets/pwa-icon.png` + `public/icons/*.png` (new)
- `package.json` (vite-plugin-pwa dep)

## Test plan
1. Publish the app.
2. On Android Chrome: visit published URL → menu shows "Install app" / native prompt fires.
3. On iOS Safari: Share → Add to Home Screen → opens standalone with correct icon and splash color.
4. Toggle airplane mode after first load → app shell + last-visited pages still render.
5. Push notifications still deliver (regression check).
