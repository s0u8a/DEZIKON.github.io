// script/game.js
import { map, tile } from "./map.js";
import { player, initPlayer, takeDamage, drawLifeGauge } from "./player.js";
import { initEnemies, updateEnemies, drawEnemies } from "./enemy.js";
import { checkGoal, checkGameOver } from "./ending.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("messageBox");

// ステータス表示
function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
  console.log(msg);
}

// 画像読み込み
function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

const images = {
  floor: loadImage("./assets/images/tanbo.png"),
  wall:  loadImage("./assets/images/mizu.png"),
  enemy: loadImage("./assets/images/enemy.png"),
  item:  loadImage("./assets/images/komebukuro.png"),
  ally:  loadImage("./assets/images/murabitopng.png"),
  goal:  loadImage("./assets/images/goal.png"),
  pl:    loadImage("./assets/images/noumin.png"),
  heart: loadImage("./assets/images/ha-to.png")
};

// 初期化
initPlayer(map);
initEnemies(map);

canvas.width = map[0].length * tile;
canvas.height = map.length * tile;

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

      ctx.drawImage(images.floor, dx, dy, tile, tile);

      const cell = map[y][x];
      if (cell === '#') ctx.drawImage(images.wall, dx, dy, tile, tile);
      if (cell === 'I') ctx.drawImage(images.item, dx, dy, tile, tile);
      if (cell === 'A') ctx.drawImage(images.ally, dx, dy, tile, tile);
      if (cell === 'G') ctx.drawImage(images.goal, dx, dy, tile, tile);
    }
  }

  // 敵描画
  drawEnemies(ctx, images.enemy, tile, 0, 0, canvas.width, canvas.height);

  // プレイヤー描画
  ctx.drawImage(images.pl, player.x * tile, player.y * tile, tile, tile);

  // ハート描画（鼓動アニメ）
  drawLifeGauge(ctx, images.heart);

  requestAnimationFrame(draw);
}

setStatus("✅ ゲーム開始");
draw();
