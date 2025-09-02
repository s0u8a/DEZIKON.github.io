// ===== 田んぼデモ（背景＋プレイヤー移動）=====
// 画像ロード状態を #status とコンソールに表示して原因を特定しやすくしています。

const TILE_SIZE = 64;   // 1マスのピクセル
const MAP_COLS = 8;
const MAP_ROWS = 8;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("status");

function setStatus(msg) {
  statusEl.textContent = msg;
  console.log(msg);
}

// 画像ローダ（onload / onerror を必ず登録）
function loadImage(src, label) {
  const img = new Image();
  img.onload = () => setStatus(`✅ loaded: ${label} → ${src}`);
  img.onerror = () => setStatus(`❌ error: ${label} が読み込めません → ${src}`);
  img.src = src;
  return img;
}

// index.html からの相対パスで指定（images フォルダ必須）
const images = {
  background: loadImage("./assets/images/tanbo.png",  "background"),
  player:     loadImage("./assets/images/noumin.png", "player"),
};

// プレイヤー（タイル座標）
const player = { x: 2, y: 2 };

// 入力（矢印キー）
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
  // 背景：読み込めていなければグリッドを表示
  if (images.background.complete && images.background.naturalWidth > 0) {
    ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#e6e6e6";
    for (let x = 0; x <= canvas.width; x += TILE_SIZE) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += TILE_SIZE) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
  }

  // プレイヤー：読み込めていなければ矩形で代替
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
setStatus("画像を読み込み中… .assets/images/tanbo.png, .assets/images/noumin.png");
