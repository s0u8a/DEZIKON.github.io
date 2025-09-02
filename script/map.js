// === map.js ===
// マップ管理と描画

const TILE_SIZE = 64;
const MAP_COLS = 12;
const MAP_ROWS = 8;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 画像ローダー
function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

// 画像
const images = {
  background: loadImage("./assets/images/tanbo.png"),
  player: loadImage("./assets/images/noumin.png"),
};

// プレイヤーの位置
export const player = { x: 1, y: 1 };

// 矢印キー操作
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":    player.y = Math.max(0, player.y - 1); break;
    case "ArrowDown":  player.y = Math.min(MAP_ROWS - 1, player.y + 1); break;
    case "ArrowLeft":  player.x = Math.max(0, player.x - 1); break;
    case "ArrowRight": player.x = Math.min(MAP_COLS - 1, player.x + 1); break;
  }
});

// 描画処理
export function drawMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 背景
  if (images.background.complete) {
    ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);
  }

  // プレイヤー
  if (images.player.complete) {
    ctx.drawImage(
      images.player,
      player.x * TILE_SIZE,
      player.y * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    );
  }
}


