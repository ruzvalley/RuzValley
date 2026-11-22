# Ruz Valley POS – GitHub PWA

This package wraps the supplied existing Google Apps Script POS in an installable PWA.
It deliberately keeps the POS page running inside its Apps Script origin, so the existing
`google.script.run` calls continue to work. The supplied Apps Script `doGet()` already sets
`XFrameOptionsMode.ALLOWALL`, which permits the GitHub-hosted wrapper to frame the app.

## Files
- `index.html` – full-screen PWA wrapper around your existing POS.
- `config.js` – the only place to set/change the Apps Script deployment URL.
- `manifest.json` – installable app name, display mode and icons.
- `sw.js` – caches only the PWA shell. It does not cache POS data or order requests.
- `icons/` – generated placeholder Ruz Valley POS icons.

## Setup
1. Open `config.js`.
2. Replace `PASTE_YOUR_POS_APPS_SCRIPT_EXEC_URL_HERE` with the deployed POS URL ending in `/exec`.
3. Create a new GitHub repository, e.g. `ruzvalley-pos`.
4. Upload the contents of this folder to the repository root (not just the ZIP).
5. In repository Settings → Pages, choose Deploy from a branch, branch `main`, folder `/ (root)`, then Save.
6. Open the published GitHub Pages HTTPS address in Chrome on Android.
7. Use Chrome menu → Install app / Add to Home screen.

## Change the backend URL later
Edit only `APP_URL` in `config.js`, commit the change, and reload the PWA. The GitHub Pages address and app icon stay the same.

## Important
- This is a PWA wrapper, not a rewrite of your POS. Your original Apps Script and Google Sheet remain the backend.
- The uploaded POS HTML uses `google.script.run` extensively. Hosting that HTML directly on GitHub would break those calls; the iframe approach avoids that change.
- The Apps Script deployment must be accessible to the staff using the POS. If it requires Google sign-in, test it on each device/account; third-party iframe cookie or sign-in restrictions may require opening the POS separately using the provided link.
- Test a menu load, one test order, order history, kitchen status update, admin PIN, image upload and receipt printing before live use.
- Offline billing is not supported: order creation and updates require the Apps Script backend and internet.
- Do not upload your private spreadsheet data or PIN into GitHub. The existing admin PIN remains in the Settings sheet.
