const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let player = {
  x: 200,
  y: 200,
  size: 40,
  speed: 4
};

const keys = {};

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function update() {
  if (keys["ArrowUp"] || keys["w"]) {
    player.y -= player.speed;
  }

  if (keys["ArrowDown"] || keys["s"]) {
    player.y += player.speed;
  }

  if (keys["ArrowLeft"] || keys["a"]) {
    player.x -= player.speed;
  }

  if (keys["ArrowRight"] || keys["d"]) {
    player.x += player.speed;
  }

  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));
}

function draw() {
  // Background
  ctx.fillStyle = "#18251c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Ground
  ctx.fillStyle = "#4d7c45";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = "#8b4513";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Player head
  ctx.fillStyle = "#f0c39b";
  ctx.fillRect(
    player.x + 10,
    player.y - 12,
    20,
    20
  );

  // Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px Arial";
  ctx.textAlign = "center";

  ctx.fillText(
    "CHRONICLES OF ELDORIA",
    canvas.width / 2,
    30
  );
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
