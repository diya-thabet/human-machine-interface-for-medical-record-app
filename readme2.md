# 📱 Mobile App Deployment Guide (0 to Hero)

This guide will walk you through compiling your Medical Record App into a standalone Android APK/AAB and an iOS app using **EAS Build** (Expo Application Services).

---

## 🚀 1. Prerequisites

Before you start, ensure you have the following installed/setup:

1.  **Expo Account**: [Sign up here](https://expo.dev/signup).
2.  **EAS CLI**: Install the command line tool globally.
    ```bash
    npm install -g eas-cli
    ```
3.  **Login**: Log in to your Expo account via terminal.
    ```bash
    eas login
    ```

---

## ⚙️ 2. Configuration (`eas.json`)

To build an APK (for testing on device) and an AAB (for Google Play Store), we need to configure the build profiles.

1.  **Initialize EAS** in your project root:
    ```bash
    eas build:configure
    ```
    *Select `All` or `Android/iOS` when prompted.*

2.  **Edit `eas.json`**: Replace the generated content with this configuration to enable APK generation for "preview".

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk" 
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

> **Note**: 
> *   `preview`: Generates a `.apk` file that you can install directly on your Android phone.
> *   `production`: Generates a `.aab` (Android App Bundle) required for the Google Play Store.

---

## 🤖 3. Building for Android

### Option A: Generate APK (For Testing)
This is what you probably want right now to test on your phone.

1.  Run the build command:
    ```bash
    eas build -p android --profile preview
    ```
2.  Wait for the build to finish in the cloud (it may take 10-20 mins).
3.  Once done, you will get a **QR Code** and a **Link** to download the `application-sign.apk`.
4.  Download and install it on your Android device.

### Option B: Generate AAB (For Play Store)
1.  Run the build command:
    ```bash
    eas build -p android --profile production
    ```
2.  Download the `.aab` file and upload it to the Google Play Console.

---

## 🍎 4. Building for iOS

> **Requirement**: You **MUST** have a paid Apple Developer Account ($99/year) to build for iOS devices.

### Option A: Simulator Build (No Account Needed)
If you just want to test on the iOS Simulator on a Mac:
```bash
eas build -p ios --profile development --local
```

### Option B: Ad-hoc / TestFlight (Requires Account)
1.  Run the build command:
    ```bash
    eas build -p ios --profile production
    ```
2.  EAS will ask you to log in with your Apple ID and handle certificates/provisioning profiles automatically.

---

## 📦 5. Common Issues & Tips

*   **App Icon/Splash**: Ensure your `assets/icon.png` and `assets/splash.png` are correctly set in `app.json`.
*   **Package Name**: In `app.json`, ensure `android.package` and `ios.bundleIdentifier` are unique (e.g., `com.yourname.medicalapp`).
*   **Env Variables**: If you are using `.env` files, make sure to add your secrets to EAS Secrets or `eas.json` env/configuration.

---

## 🦸 Hero Status Achieved!
You now have a compiled binary of your application ready for the world!
