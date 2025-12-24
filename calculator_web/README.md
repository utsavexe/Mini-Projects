# Scientific Calculator (Web)

A lightweight, mobile-first scientific calculator built with plain HTML, CSS and JavaScript. The app is optimized for touch devices, avoids bringing up the iPhone keyboard, and includes a small set of progressive web app (PWA) features.

---

## Demo

Open `index.html` in a browser for a quick local demo. For full PWA/service-worker behavior, run a local HTTP server (instructions below).

## Key Features

- On-screen numeric and scientific keypad (sin, cos, tan, sqrt, parentheses, percent, π)
- History panel saved to `localStorage`
- Light / dark theme toggle
- Mobile touch fixes: readonly display with `inputmode="none"` and click-suppression to avoid double input
- Simple service-worker registration (PWA-ready)

## Repository files

- `index.html` — app UI and logic
- `manifest.json` — PWA manifest
- `sw.js` — service worker registration
- `README.md` — this file

## Run locally

This is a static project. For best results (service worker + PWA) run a local server.

Using Python 3:

```bash
# from the project folder
python -m http.server 8000
# open http://localhost:8000
```

Using Node (http-server):

```bash
npm install -g http-server
http-server -c-1
# open the printed URL
```

## Upload to GitHub (quick steps)

1. Create a new repository on GitHub (no README needed if you push an existing one).
2. From the project folder run:

```bash
git init
git add .
git commit -m "Initial commit: scientific calculator"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Replace `<your-username>` and `<repo-name>` with your GitHub info. If you prefer SSH, use the SSH remote URL.

## Notes & Security

- The expression evaluator uses `Function()` to evaluate expressions entered into the display. Do not accept untrusted input on a public site without additional sanitization or a safer parser.
- The app disables the native iOS keyboard by using a readonly display and `inputmode="none"`. Buttons provide all input.

## Accessibility

- Buttons use `type="button"` and pointer handlers for reliable touch behavior.
- The display includes `aria-readonly="true"` for assistive tech.

## Contributing

Contributions are welcome. Suggested improvements:

- Move inline `onclick` attributes to JS event listeners
- Improve expression parsing to avoid `Function()` for safety
- Add tests and CI for builds

## License

If you'd like, I can add an MIT `LICENSE` file — tell me if you want that included.

---

If you want I can also:

- Add a repository `LICENSE` (MIT)
- Add a screenshot and badges to this README
- Create a `.gitignore` and small release notes

Tell me which of these you'd like next.
