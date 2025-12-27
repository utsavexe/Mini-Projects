# 📷 QR Code Reader (Web App)

A modern, mobile-friendly **QR Code Reader** built using **HTML, CSS, and JavaScript**.

Supports:
- Live camera scanning
- Image upload scanning
- Scan history
- Auto-open URLs
- PWA (installable app)
- iPhone & Android support (HTTPS)

---

## 🚀 Live Demo
> Deploy using Netlify / Vercel to enable camera on iPhone (HTTPS required).

---

## ✨ Features

- 📸 Camera-based QR scanning  
- 🖼 Scan QR from uploaded images  
- 🔗 Auto-open scanned URLs (safe)  
- 🕘 Scan history (saved locally)  
- 📱 PWA support (installable)  
- 🔊 Sound + vibration feedback  
- ✅ Scan success animation  

---

## 🛠 Tech Stack

- HTML5
- CSS3
- JavaScript (ES6)
- Web Camera API
- `qr-scanner` library
- Service Workers (PWA)

---

## 📁 Project Structure

QR_Code_Reader/
├─ index.html
├─ styles.css
├─ app.js
├─ manifest.json
├─ sw.js
├─ README.md


---

## ▶️ How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/utsavexe/QR_Code_Reader.git
cd qr-code-reader

2. Start a local server
npx serve .
# OR
python -m http.server

3. Open in browser
http://localhost:3000

⚠️ Camera works on desktop only via HTTP.

🔐 Security Notes
Only http / https://qr-codereader.netlify.app URLs auto-open
No backend, no data leaves device
History stored locally in browser

📄 License
MIT License — free to use, modify, and distribute.

🙌 Author
Built for learning and production-ready use.
Feel free to contribute or improve 🚀