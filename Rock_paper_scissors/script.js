const buttons = document.querySelectorAll(".choice");
const resultEl = document.getElementById("result");
const computerEl = document.getElementById("computer");
const playerScoreEl = document.getElementById("playerScore");
const computerScoreEl = document.getElementById("computerScore");
const themeToggle = document.getElementById("themeToggle");

const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");

let playerScore = 0;
let computerScore = 0;

const choices = ["rock", "paper", "scissors"];

function vibrate() {
  if (navigator.vibrate) navigator.vibrate(100);
}

function randomChoice() {
  return choices[Math.floor(Math.random() * choices.length)];
}

function decide(p, c) {
  if (p === c) return "draw";
  if (
    (p === "rock" && c === "scissors") ||
    (p === "paper" && c === "rock") ||
    (p === "scissors" && c === "paper")
  ) return "win";
  return "lose";
}

function play(playerChoice) {
  clickSound.play();
  vibrate();

  buttons.forEach(b => b.classList.add("shake"));

  setTimeout(() => {
    buttons.forEach(b => b.classList.remove("shake"));

    const computerChoice = randomChoice();
    const result = decide(playerChoice, computerChoice);

    computerEl.textContent = `Computer: ${computerChoice}`;

    if (result === "win") {
      playerScore++;
      resultEl.textContent = "You Win!";
      resultEl.style.color = "#22c55e";
      winSound.play();
    } else if (result === "lose") {
      computerScore++;
      resultEl.textContent = "You Lose!";
      resultEl.style.color = "#ef4444";
      loseSound.play();
    } else {
      resultEl.textContent = "Draw!";
      resultEl.style.color = "#facc15";
    }

    playerScoreEl.textContent = playerScore;
    computerScoreEl.textContent = computerScore;
  }, 800);
}

buttons.forEach(btn => {
  btn.addEventListener("click", () => play(btn.dataset.choice));
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeToggle.textContent =
    document.body.classList.contains("light") ? "☀️" : "🌙";
});
