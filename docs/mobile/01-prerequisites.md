# 01 — Prerequisites

Get these in place **before** you touch the code. Apple enrollment in particular can take 24–48h (sometimes longer for organizations).

## Developer accounts

| Account | Cost | Purpose | Sign up |
|---|---|---|---|
| Apple Developer Program | $99 / year | Required to publish to App Store + TestFlight | https://developer.apple.com/programs/ |
| Google Play Console | $25 one-time | Required to publish to Play Store | https://play.google.com/console/signup |

For Apple, choose **Individual** (faster, uses your name) or **Organization** (requires D-U-N-S number, takes 1–3 weeks, but lists your company name on the listing).

## Hardware

- **iOS**: a Mac running macOS 14+ — there is no supported way to ship to the App Store from Windows or Linux.
- **Android**: any Mac, Windows, or Linux machine.

## Tooling

Install on your local machine (not in Lovable):

```bash
# All platforms
node --version    # need 20.x or newer
npm --version

# macOS — install Xcode 15+ from the Mac App Store, then:
xcode-select --install
sudo gem install cocoapods

# Android — install Android Studio Hedgehog (2023.1.1) or newer:
# https://developer.android.com/studio
# Inside Studio: SDK Manager → install Android 14 (API 34) SDK + Build-Tools 34
# Install JDK 17 (Studio bundles one, or `brew install --cask temurin@17`)
```

## Accounts to have credentials for

- The Lovable Cloud (Supabase) project — already connected.
- Paddle dashboard — for subscription product IDs.
- A password manager (1Password, Bitwarden) — you'll be storing **Android keystore + passwords** there. Losing the keystore means you can never update your Android app again.

## Repository access

You need write access to a GitHub repo for the project. If you haven't already, connect via Lovable's **Plus (+) → GitHub → Connect project**.

➡ Next: [02 — Local setup](./02-local-setup.md)
