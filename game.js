const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function gameLoop() {
  ctx.fillStyle = "#18251c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#f5d98b";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "center";

  ctx.fillText(
    "CHRONICLES OF ELDORIA",
    canvas.width / 2,
    canvas.height / 2 - 20
  );

  ctx.font = "16px Arial";
  ctx.fillText(
    "Game sedang dimulai...",
    canvas.width / 2,
    canvas.height / 2 + 20
  );

  requestAnimationFrame(gameLoop);
}

gameLoop();
