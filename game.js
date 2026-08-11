const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");

let player = {
  x: 200,
  y: 200,
  size: 40,
  speed: 5
};

let moveX = 0;
let moveY = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ======================
// JOYSTICK
// ======================

joystick.addEventListener("touchstart", function(e) {
  e.preventDefault();
}, { passive: false });

joystick.addEventListener("touchmove", function(e) {
  e.preventDefault();

  const touch = e.touches[0];
  const rect = joystick.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  let dx = touch.clientX - centerX;
  let dy = touch.clientY - centerY;

  const maxDistance = 35;

  const distance = Math.sqrt(
    dx * dx + dy * dy
  );

  if (distance > maxDistance) {
    dx = (dx / distance) * maxDistance;
    dy = (dy / distance) * maxDistance;
  }

  stick.style.transform =
    `translate(${dx}px, ${dy}px)`;

  moveX = dx / maxDistance;
  moveY = dy / maxDistance;

}, { passive: false });

joystick.addEventListener("touchend", function(e) {
  e.preventDefault();

  moveX = 0;
  moveY = 0;

  stick.style.transform =
    "translate(0px, 0px)";
}, { passive: false });

// ======================
// UPDATE
// ======================

function update() {

  player.x += moveX * player.speed;
  player.y += moveY * player.speed;

  // Batas layar
  player.x = Math.max(
    0,
    Math.min(
      canvas.width - player.size,
      player.x
    )
  );

  player.y = Math.max(
    0,
    Math.min(
      canvas.height - player.size,
      player.y
    )
  );
}

// ======================
// DRAW
// ======================

function draw() {

  // Tanah
  ctx.fillStyle = "#4d7c45";
  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  // Player
  ctx.fillStyle = "#8b4513";
  ctx.fillRect(
    player.x,
    player.y,
    player.size,
    player.size
  );

  // Kepala
  ctx.fillStyle = "#f0c39b";
  ctx.fillRect(
    player.x + 10,
    player.y - 12,
    20,
    20
  );

  // Nama game
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px Arial";
  ctx.textAlign = "center";

  ctx.fillText(
    "CHRONICLES OF ELDORIA",
    canvas.width / 2,
    30
  );
}

// ======================
// GAME LOOP
// ======================

function gameLoop() {

  update();
  draw();

  requestAnimationFrame(gameLoop);
}

gameLoop();
