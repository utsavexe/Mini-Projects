import QrScanner from "https://cdn.jsdelivr.net/npm/qr-scanner@1.4.2/qr-scanner.min.js";

QrScanner.WORKER_PATH =
  "https://cdn.jsdelivr.net/npm/qr-scanner@1.4.2/qr-scanner-worker.min.js";

const beep = document.getElementById("beep");
const video = document.getElementById("video");
const resultEl = document.getElementById("result");
const scanSuccess = document.getElementById("scanSuccess");
const historyEl = document.getElementById("history");
const clearBtn = document.getElementById("clearHistory");
const startBtn = document.getElementById("start");
const installBtn = document.getElementById("installBtn");
const stopBtn = document.getElementById("stop");
const fileInput = document.getElementById("fileInput");

let scanner = null;

function showResult(text) {
  resultEl.textContent = text;
  saveHistory(text);

  triggerScanAnimation();

  if (navigator.vibrate) {
    navigator.vibrate(200);
  }

  beep.currentTime = 0;
  beep.play().catch(() => {});

  if (isValidUrl(text)) {
    window.open(text, "_blank", "noopener,noreferrer");
  }
}

function isValidUrl(text) {
  try {
    const url = new URL(text);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}


function enableImageFallback() {
  fileInput.style.display = "block";
}

const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
if (isIOS) {
  showResult("iOS detected. If camera fails, upload QR image.");
  enableImageFallback();
}

startBtn.onclick = async () => {
  try {
    if (scanner) return;

    scanner = new QrScanner(
      video,
      result => showResult(result.data),
      { highlightScanRegion: true }
    );

    await scanner.start();
  } catch (err) {
    console.error(err);
    showResult("Camera access failed. Please upload an image.");
    enableImageFallback();
  }
};

stopBtn.onclick = () => {
  if (!scanner) return;

  scanner.stop();
  scanner.destroy();
  scanner = null;
};

fileInput.onchange = async event => {
  const file = event.target.files?.[0];
  if (!file) return;

  const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
  showResult(result.data);
};

const HISTORY_KEY = "qr-history";

function saveHistory(text) {
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  history.unshift({ text, time: new Date().toISOString() });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 10)));
  renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");

  historyEl.innerHTML = history
    .map(h => {
      const isLink = isValidUrl(h.text);
      const content = isLink
        ? `<a href="${h.text}" target="_blank" rel="noopener">${h.text}</a>`
        : h.text;

      return `
        <li>
          ${content}
          <br>
          <small>${new Date(h.time).toLocaleString()}</small>
        </li>
      `;
    })
    .join("");
}

renderHistory();
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

clearBtn.onclick = () => {
  localStorage.removeItem("qr-history");
  renderHistory();
};

let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredPrompt = event;
  installBtn.hidden = false;
});

installBtn.onclick = async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.hidden = true;
};

function triggerScanAnimation() {
  scanSuccess.classList.add("active");
  setTimeout(() => {
    scanSuccess.classList.remove("active");
  }, 400);
}
