// script/game.js
import { map, tile } from "./map.js";
import { player, initPlayer, takeDamage, heal } from "./player.js";
import { initEnemies, updateEnemies, drawEnemies } from "./enemy.js";
import { checkGoal, nextMap, checkGameOver } from "./ending.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("messageBox");

function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
  console.log(msg);
}

// 初期化
initPlayer(map);
initEnemies(map);

const VIEW_COLS = 10;
const VIEW_ROWS = 8;
canvas.width = VIEW_COLS * tile;
canvas.height = VIEW_ROWS * tile;

// 移動可能判定
function walkable(x, y) {
  if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) return false;
  return map[y][x] !== '#';
}

// キー操作
document.addEventListener("keydown", e => {
  let nx = player.x, ny = player.y;
  if (e.key === "ArrowUp") ny--;
  else if (e.key === "ArrowDown") ny++;
  else if (e.key === "ArrowLeft") nx--;
  else if (e.key === "ArrowRight") nx++;
  else return;

  if (walkable(nx, ny)) {
    player.x = nx; player.y = ny;

    if (checkGoal(map, player.x, player.y)) {
      setStatus("🏁 ゴール！");
    }

    updateEnemies(walkable, player, amt => takeDamage(amt, setStatus));
    if (checkGameOver(player, setStatus)) return;
  }
});

// 描画ループ
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const dx = x * tile, dy = y * tile;
      ctx.fillStyle = (map[y][x] === '#') ? "black" : "lightgreen";
      ctx.fillRect(dx, dy, tile, tile);
    }
  }

  // 敵描画
  drawEnemies(ctx, new Image(), tile, 0, 0, canvas.width, canvas.height);

  // プレイヤー描画
  ctx.fillStyle = "red";
  ctx.fillRect(player.x * tile, player.y * tile, tile, tile);

  requestAnimationFrame(draw);
}

setStatus("✅ ゲーム開始");
draw();
