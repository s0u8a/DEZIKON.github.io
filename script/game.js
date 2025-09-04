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

// 描画ループ
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const dx = x * tile;
      const dy = y * tile;

      // タイルを整数座標で描画して余白をなくす
      ctx.drawImage(images.floor, Math.floor(dx), Math.floor(dy), tile, tile);

      const cell = map[y][x];
      if (cell === '#') ctx.drawImage(images.wall, Math.floor(dx), Math.floor(dy), tile, tile);
      if (cell === 'I') ctx.drawImage(images.item, Math.floor(dx), Math.floor(dy), tile, tile);
      if (cell === 'A') ctx.drawImage(images.ally, Math.floor(dx), Math.floor(dy), tile, tile);
      if (cell === 'G') ctx.drawImage(images.goal, Math.floor(dx), Math.floor(dy), tile, tile);
    }
  }

  drawEnemies(ctx, images.enemy, tile, 0, 0, map[0].length * tile, map.length * tile);

  ctx.drawImage(images.pl, Math.floor(player.x * tile), Math.floor(player.y * tile), tile, tile);

  drawLifeGauge(ctx, images.heart); // 鼓動アニメ付き

  updatePlayer(); // 無敵時間減少

  requestAnimationFrame(draw);
}

setStatus("✅ ゲーム開始");
draw();
