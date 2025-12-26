let startTime, timerInterval;
let elapsedTime = 0;
let lapCount = 1;

const display = document.getElementById("display");
const laps = document.getElementById("laps");

document.getElementById("start").onclick = start;
document.getElementById("stop").onclick = stop;
document.getElementById("reset").onclick = reset;
document.getElementById("lap").onclick = lap;
document.getElementById("themeToggle").onclick = toggleTheme;

function timeToString(time) {
  let hrs = Math.floor(time / 3600000);
  let mins = Math.floor((time % 3600000) / 60000);
  let secs = Math.floor((time % 60000) / 1000);

  return `${hrs.toString().padStart(2,"0")}:${mins.toString().padStart(2,"0")}:${secs.toString().padStart(2,"0")}`;
}

function start() {
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    display.textContent = timeToString(elapsedTime);
  }, 1000);
}

function stop() {
  clearInterval(timerInterval);
}

function reset() {
  clearInterval(timerInterval);
  elapsedTime = 0;
  lapCount = 1;
  display.textContent = "00:00:00";
  laps.innerHTML = "";
}

function lap() {
  const li = document.createElement("li");
  li.textContent = `Lap ${lapCount++} : ${timeToString(elapsedTime)}`;
  laps.prepend(li);
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}
