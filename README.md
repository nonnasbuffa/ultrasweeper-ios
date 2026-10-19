# Offline Minesweeper — Android & iOS

This folder wraps the desktop game (`../Offline Minesweeper/resources/app`) into phone apps with
[Capacitor](https://capacitorjs.com). Both apps run the exact same game code as the Windows exe.

```
www/              copy of the game (do not edit here, it is overwritten)
android/          Android Studio / Gradle project
ios/              Xcode project
resources-src/    app icon and splash artwork (SVG)
scripts/          sync-web.js (copies the game in), render-assets.js (icons + splash)
```

## After changing the game

Edit the game in `../Offline Minesweeper/resources/app`, then from this folder:

```
npm run sync
```

That copies the game into `www/` and updates both the Android and iOS projects.

## Android (APK)

Requirements: JDK 21 and the Android SDK (platform 36). On the PC this was built on they live in
`%LOCALAPPDATA%\MinesweeperBuild`.

```
cd android
gradlew assembleDebug
```

The APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`.
It is signed with a debug key, which is fine for installing on your own phones but not for the Play Store.
For the Play Store, create a release keystore and run `gradlew bundleRelease`.

**Installing on a phone:** copy the APK to the phone, open it, and allow "Install unknown apps" for the
app you opened it with when Android asks.

## iOS (iPhone / iPad)

An iOS app can only be built on a Mac with Xcode, and an iPhone only installs apps signed with an
Apple ID. Steps on a Mac:

1. Install Xcode from the App Store, and Node.js.
2. Copy `Minesweeper-iOS-project.zip` to the Mac and unzip it (it already contains the game in `www/`).
3. In the unzipped `Minesweeper-iOS` folder run `npm install` and then `npx cap sync ios`.
4. Run `npx cap open ios` to open the project in Xcode.
5. In Xcode select the **App** target → **Signing & Capabilities** → choose your Apple ID team
   (a free Apple ID works for testing on your own iPhone; apps signed this way expire after 7 days).
6. Plug in the iPhone, select it as the run destination, and press **Run**.
   On the iPhone, trust the developer in Settings → General → VPN & Device Management.

To produce an `.ipa` file for others, you need a paid Apple Developer account:
Xcode → Product → Archive → Distribute App.

## Phone-specific behaviour

- Tap to reveal, long-press to flag, tap a number to clear its neighbours.
- The board grows to fill the screen unless you resize it yourself with the lock unlocked.
- Admin tools are unlocked by a secret on the main menu plus a password (same on every version).
- Android back button: closes dialogs and panels, then returns to the menu, then exits.
