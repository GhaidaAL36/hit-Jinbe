let score = 0;
let timeLeft = 30;
let gameRunning = false; // flag for game running
let currentMole = null; //urrent mole
let gameTimeout;

// DOM elements
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const moles = document.querySelectorAll(".mole"); // All mole elements
const gameMessage = document.getElementById("game-message");
const restartBtn = document.getElementById("restartBtn");
const progressBar = document.getElementById("progressBar");
const floatingHammer = document.getElementById("floatingHammer");

// mole imgs
const goodMoleImg = "jinbe.jpg"; // basic mole-jinbe img
const goodMoleHitImg = "beat-Jinbe.png"; //another imgs
const badMoleImgs = [
  "Ace.jpg" ,
  "Brook.jpg",
  "Chopper.jpg" , 
  "Franky.jpg",
  "Luffy.jpg",
  "Nami.jpg" ,
  "Robin.jpg" ,
  "Sabo.jpg" ,
  "sanji.jpg",
  "Usopp.jpg" ,
  "zoro.jpg",
];

// choose place
function randomMole() {
  const index = Math.floor(Math.random() * moles.length);
  return moles[index];
}

// select random img
function randomBadMoleImg() {
  return badMoleImgs[Math.floor(Math.random() * badMoleImgs.length)]; // Return a random bad mole image
}

// Function to display a mole
function showMole() {
  if (!gameRunning) return;

  // to hide the current mole and reset its img
  if (currentMole) {
    currentMole.style.display = "none";
    currentMole.src = goodMoleImg;
    currentMole.onclick = null;
  }

  const mole = randomMole();
  currentMole = mole;

  const isGood = Math.random() < 0.5; // 70% chance for jinbe img

  // jinbe img
  if (isGood) {
    mole.src = goodMoleImg;
    mole.onclick = () => {
      if (!gameRunning || mole.src.includes(goodMoleHitImg)) return;

      mole.src = goodMoleHitImg;
      score++;
      scoreDisplay.textContent = score;
      hitSound.currentTime = 0;

      setTimeout(() => {
        mole.style.display = "none"; // how much mole stay
      }, 300);
    };

    // another imgs
  } else {
    mole.src = randomBadMoleImg();
    mole.onclick = () => {
      if (!gameRunning) return;

      score = score-5;
      scoreDisplay.textContent = score;
      mole.style.display = "none";
    };
  }

  mole.style.display = "block";

  setTimeout(() => {
    if (mole === currentMole) mole.style.display = "none"; // hide mole after 1 second
  }, 1000);
}

// start the game
function startGame() {
  gameRunning = true;
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  gameMessage.textContent = "";
  progressBar.style.width = "100%";

  let speed = 1000; // Initial speed

  function runLoop() {
    if (timeLeft <= 0) {
      endGame();
      return;
    }

    timeLeft--;
    timeDisplay.textContent = timeLeft;
    progressBar.style.width = `${(timeLeft / 30) * 100}%`; // progress bar

    // adjust speed
    if (timeLeft === 20) speed = 800;
    if (timeLeft === 10) speed = 600;

    showMole();
    gameTimeout = setTimeout(runLoop, speed);
  }

  clearTimeout(gameTimeout);
  runLoop();
}

function endGame() {
  gameRunning = false;
  if (currentMole) currentMole.style.display = "none";

  // Display message based on score
  if (score <= 0) {
    gameMessage.textContent = "Jinbe ran away 👎🏻";
  } else {
    gameMessage.textContent = "You killed fat Jinbe!! 😍👍🏻";
    document.getElementById("winSound").play();
  }

  clearTimeout(gameTimeout);
}

restartBtn.onclick = () => {
  startGame();
};

/* for small device */

// Detect if device is touch-only
const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

// If it's not a touch device, use custom cursor via CSS
if (!isTouchDevice) {
  document.body.style.cursor = "url('hammer.png'), auto";
  floatingHammer.style.display = "none";
} else {
  floatingHammer.style.display = "block";

  // Show + move on mobile
  document.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      floatingHammer.style.left = touch.clientX + "px";
      floatingHammer.style.top = touch.clientY + "px";
    }
  });

  document.addEventListener("touchend", () => {
    floatingHammer.style.display = "none";
  });

  document.addEventListener("touchstart", (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      floatingHammer.style.display = "block";
      floatingHammer.style.left = touch.clientX + "px";
      floatingHammer.style.top = touch.clientY + "px";
    }
  });
}



startGame();
