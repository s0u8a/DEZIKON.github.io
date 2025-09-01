// ===== 田んぼデモ（背景＋プレイヤー移動） =====

// 定数
const TILE_SIZE = 64;   // 1マスのピクセル
const MAP_COLS = 8;
const MAP_ROWS = 8;

// 要素取得
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// プレイヤー座標（タイル座標）
let player = { x: 2, y: 2 };

// 画像ロード
const images = {
  player: loadImage("assets/noumin.png"),
  background: loadImage("assets/tanbo.png"),
};

function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

// 入力（矢印キー）
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      player.y = Math.max(0, player.y - 1);
      break;
    case "ArrowDown":
      player.y = Math.min(MAP_ROWS - 1, player.y + 1);
      break;
    case "ArrowLeft":
      player.x = Math.max(0, player.x - 1);
      break;
    case "ArrowRight":
      player.x = Math.min(MAP_COLS - 1, player.x + 1);
      break;
  }
});

// 描画ループ
function draw() {
  // 背景描画（キャンバス全面にフィット）
  ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);

  // プレイヤー描画（1タイル分のサイズで描画）
  ctx.drawImage(
    images.player,
    player.x * TILE_SIZE,
    player.y * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE
  );

  requestAnimationFrame(draw);
}

// 画像ロード完了後に開始
Promise.all([
  waitForImage(images.background),
  waitForImage(images.player),
]).then(draw);

function waitForImage(img) {
  return new Promise((resolve) => {
    if (img.complete) resolve();
    else img.onload = resolve;
  });
}

