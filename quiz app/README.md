Quiz App — quick guide

What's included
- `index.html`, `style.css`, `script.js` — single-page quiz app with timer, progress, theme toggle, score history (localStorage), keyboard navigation, and Android-style button ripples.

How to preview locally
1. Open `index.html` in your browser (double-click or drag into the browser).

Keyboard controls
- Arrow Right / Arrow Down: move focus to next answer
- Arrow Left / Arrow Up: move focus to previous answer
- Enter / Space: select focused answer or activate Next/Restart

Making a short GIF recording (Windows)
Option A — ShareX (recommended):
1. Install ShareX: https://getsharex.com/
2. Run ShareX, choose "Capture -> Screen recording (GIF)" and select the app area.
3. Save the GIF and share.

Option B — OBS + ffmpeg conversion:
1. Record a short MP4 using OBS Studio.
2. Convert MP4 to GIF using ffmpeg:

```bash
ffmpeg -i recording.mp4 -vf "fps=15,scale=960:-1:flags=lanczos" -loop 0 out.gif
```

Notes on APK / WebView packaging
- You can wrap this web app in an Android WebView using Android Studio:
  - Create a new Android project, add a simple Activity with WebView, enable JavaScript, and load `file:///android_asset/index.html` after bundling the web files under `app/src/main/assets/`.
  - Alternatively use trusted wrappers like Capacitor or Cordova for easier builds and access to native APIs.

If you want, I can:
- Create the Android WebView starter code (Java/Kotlin) you can paste into Android Studio,
- Produce a short animated GIF preview (I can generate an HTML/CSS-based demo GIF-like animation, or guide you through recording locally).

Enjoy — tell me which next step you'd like.