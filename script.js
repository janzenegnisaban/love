const views = {
  question: document.getElementById("questionView"),
  menu: document.getElementById("menuView"),
  photos: document.getElementById("photosView"),
  love: document.getElementById("loveView"),
};

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const openPhotos = document.getElementById("openPhotos");
const openLoveNote = document.getElementById("openLoveNote");
const menuBack = document.getElementById("menuBack");
const menuButtons = document.querySelectorAll(".goMenu");

const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let animationId = null;
const noButtonTexts = [
  "Nope",
  "No, you can't click this",
  "No, find other choice",
  "No, look for yes",
  "No, the answer hides elsewhere",
  "No, patience brings the yes",
  "No, almost but not quite",
  "No, the yes is waiting",
];
let noTextIndex = 0;

function showView(viewName) {
  Object.values(views).forEach((view) => view.classList.remove("active"));
  views[viewName].classList.add("active");

  if (viewName === "question") {
    startNoButtonOrbit();
  } else {
    stopNoButtonOrbit();
    resetNoButtonPosition();
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function makeHeartPath(x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(x - size, y - size, x - size * 1.8, y + size * 0.6, x, y + size * 1.7);
  ctx.bezierCurveTo(x + size * 1.8, y + size * 0.6, x + size, y - size, x, y);
}

function launchRomanticCelebration() {
  particles = [];
  const colors = ["#ff5ca7", "#ff7abb", "#ffd1ea", "#ffffff", "#ff3f9f"];

  for (let i = 0; i < 220; i += 1) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height,
      speedY: 1.2 + Math.random() * 2.8,
      speedX: -1 + Math.random() * 2,
      size: 4 + Math.random() * 7,
      alpha: 0.7 + Math.random() * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: Math.random() > 0.3 ? "heart" : "circle",
      wobble: Math.random() * Math.PI * 2,
    });
  }

  const durationMs = 4200;
  const start = performance.now();

  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  function animate(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const elapsed = now - start;

    particles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX + Math.sin((p.wobble += 0.03)) * 0.5;

      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      if (p.type === "heart") {
        makeHeartPath(p.x, p.y, p.size);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
    });

    if (elapsed < durationMs) {
      animationId = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animationId = requestAnimationFrame(animate);
}

function resetNoButtonPosition() {
  noBtn.style.position = "";
  noBtn.style.left = "";
  noBtn.style.top = "";
  noBtn.style.right = "";
  noBtn.style.bottom = "";
  noBtn.style.zIndex = "";
}

function getNoButtonPathMetrics() {
  const padding = 28;
  const questionRect = views.question.getBoundingClientRect();
  const centerX = questionRect.left + questionRect.width / 2;
  const centerY = questionRect.top + questionRect.height / 2;

  // Keep motion around the middle of the card while staying inside bounds.
  const radiusX = Math.max(20, questionRect.width / 2 - noBtn.offsetWidth / 2 - padding);
  const radiusY = Math.max(20, questionRect.height / 2 - noBtn.offsetHeight / 2 - padding);

  return {
    centerX,
    centerY,
    radiusX,
    radiusY,
  };
}

function positionNoButtonOnOrbit() {
  const { centerX, centerY, radiusX, radiusY } = getNoButtonPathMetrics();
  const orbitX = centerX + Math.cos(noPathProgress) * radiusX - noBtn.offsetWidth / 2;
  const orbitY = centerY + Math.sin(noPathProgress) * radiusY - noBtn.offsetHeight / 2;

  noBtn.style.position = "fixed";
  noBtn.style.left = `${orbitX}px`;
  noBtn.style.top = `${orbitY}px`;
  noBtn.style.right = "auto";
  noBtn.style.bottom = "auto";
  noBtn.style.zIndex = "10";
}

function moveNoButtonToRandomPathPoint() {
  noPathProgress = Math.random() * Math.PI * 2;
  positionNoButtonOnOrbit();
}

function stopNoButtonOrbit() {
  // No continuous orbit animation now.
}

function startNoButtonOrbit() {
  moveNoButtonToRandomPathPoint();
}

function updateNoButtonText() {
  noBtn.textContent = noButtonTexts[noTextIndex % noButtonTexts.length];
  noTextIndex += 1;
}

yesBtn.addEventListener("click", () => {
  launchRomanticCelebration();
  showView("menu");
});

["mouseenter", "touchstart", "click"].forEach((eventName) => {
  noBtn.addEventListener(eventName, (event) => {
    event.preventDefault();
    updateNoButtonText();
    moveNoButtonToRandomPathPoint();
  });
});

openPhotos.addEventListener("click", () => showView("photos"));
openLoveNote.addEventListener("click", () => showView("love"));
menuBack.addEventListener("click", () => showView("question"));
menuButtons.forEach((button) => {
  button.addEventListener("click", () => showView("menu"));
});

window.addEventListener("resize", () => {
  resizeCanvas();
  if (views.question.classList.contains("active")) {
    positionNoButtonOnOrbit();
  }
});

resizeCanvas();
updateNoButtonText();
startNoButtonOrbit();
