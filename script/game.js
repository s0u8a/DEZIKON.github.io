import { map, tile } from "./map.js";
import { player, initPlayer, takeDamage, drawLifeGauge, updatePlayer } from "./player.js";
import { initEnemies, updateEnemies, drawEnemies } from "./enemy.js";
import { checkGoal, checkGameOver } from "./ending.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false; // タイル間の隙間防止

const statusEl = document.getElementById("messageBox");
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
  floor: loadImage("./assets/images/tanbo3.png"),
  wall:  loadImage("./assets/images/mizu_big.png"),
  enemy: loadImage("./assets/images/enemy.png"),
  item:  loadImage("./assets/images/komebukuro.png"),
  ally:  loadImage("./assets/images/murabitopng.png"),
  goal:  loadImage("./assets/images/goal.png"),
  pl:    loadImage("./assets/images/noumin.png"),
  heart: loadImage("./assets/images/ha-to.png")
};

// Retina対応
const dpr = window.devicePixelRatio || 1;
canvas.width = map[0].length * tile * dpr;
canvas.height = map.length * tile * dpr;
canvas.style.width = map[0].length * tile + "px";
canvas.style.height = map.length * tile + "px";
ctx.scale(dpr, dpr);

// 移動判定
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
    player.x = nx;
    player.y = ny;

    if (checkGoal(map, player.x, player.y)) setStatus("🏁 ゴール！");

    updateEnemies(walkable, player, amt => takeDamage(amt, setStatus));
    if (checkGameOver(player, setStatus)) return;
  }
});

// -----------------------------
// 描画ループ（壁と床を分離）
// -----------------------------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const dx = x * tile;
      const dy = y * tile;
      const cell = map[y][x];

      if (cell === '0' || cell === 'S') {
        // 床だけ
        ctx.drawImage(images.floor, dx, dy, tile, tile);
      } else if (cell === '#') {
        // 壁だけ
        ctx.drawImage(images.wall, dx, dy, tile, tile);
      } else if (cell === 'I') {
        // アイテム + 床
        ctx.drawImage(images.floor, dx, dy, tile, tile);
        ctx.drawImage(images.item, dx, dy, tile, tile);
      } else if (cell === 'A') {
        // 村人 + 床
        ctx.drawImage(images.floor, dx, dy, tile, tile);
        ctx.drawImage(images.ally, dx, dy, tile, tile);
      } else if (cell === 'G') {
        // ゴール + 床
        ctx.drawImage(images.floor, dx, dy, tile, tile);
        ctx.drawImage(images.goal, dx, dy, tile, tile);
      }
    }
  }

  // 敵描画
  drawEnemies(ctx, images.enemy, tile, 0, 0, map[0].length * tile, map.length * tile);

  // プレイヤー描画
  ctx.drawImage(images.pl, player.x * tile, player.y * tile, tile, tile);

  // ハート描画
  drawLifeGauge(ctx, images.heart);

  // 無敵時間カウントダウン
  updatePlayer();

  requestAnimationFrame(draw);
}

// -----------------------------
// スタート画面から呼ばれる関数
// -----------------------------
window.startGame = function() {
  initPlayer(map);
  initEnemies(map);
  setStatus("✅ ゲーム開始");
  draw();
};
