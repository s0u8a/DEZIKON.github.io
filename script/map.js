// ===== 田んぼデモ（背景＋プレイヤー移動）=====

const TILE_SIZE = 64;    // タイル1マスの大きさ
const MAP_COLS = 12;     // 横のマス数
const MAP_ROWS = 12;     // 縦のマス数

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("status");

function setStatus(msg) {
  statusEl.textContent = msg;
  console.log(msg);
}

// 画像ロード関数
function loadImage(src, label) {
  const img = new Image();
  img.onload = () => setStatus(`✅ loaded: ${label} → ${src}`);
  img.onerror = () => setStatus(`❌ error: ${label} 読み込み失敗 → ${src}`);
  img.src = src;
  return img;
}

// 画像のロード（assets/images/ 内）
const images = {
  background: loadImage("./assets/images/tanbo2.png", "background"),
  player:     loadImage("./assets/images/noumin.png", "player"),
};

// プレイヤーの初期位置
const player = { x: 2, y: 2 };

// キー操作
window.addEventListener("keydown", (e) => {
  let handled = true;
  switch (e.key) {
    case "ArrowUp":    player.y = Math.max(0, player.y - 1); break;
    case "ArrowDown":  player.y = Math.min(MAP_ROWS - 1, player.y + 1); break;
    case "ArrowLeft":  player.x = Math.max(0, player.x - 1); break;
    case "ArrowRight": player.x = Math.min(MAP_COLS - 1, player.x + 1); break;
    default: handled = false;
  }
  if (handled) e.preventDefault();
});

// 描画ループ
function draw() {
  // 背景画像を拡大描画
  if (images.background.complete && images.background.naturalWidth > 0) {
    ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#d0f0c0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // プレイヤー
  if (images.player.complete && images.player.naturalWidth > 0) {
    ctx.drawImage(
      images.player,
      player.x * TILE_SIZE,
      player.y * TILE_SIZE,
      TILE_SIZE, TILE_SIZE
    );
  } else {
    ctx.fillStyle = "#2b8a3e";
    ctx.fillRect(
      player.x * TILE_SIZE + 8,
      player.y * TILE_SIZE + 8,
      TILE_SIZE - 16,
      TILE_SIZE - 16
    );
  }

  requestAnimationFrame(draw);
}

draw();
setStatus("画像を読み込み中… ./assets/images/tanbo2.png, ./assets/images/noumin.png");
