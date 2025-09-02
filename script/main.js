// script/main.js
// ===== 田んぼデモ（背景＋プレイヤー移動）=====
// 画像ロード状態を #status とコンソールに表示します。

const TILE_SIZE = window.GMAP?.tile ?? 64;
const GRID      = window.GMAP?.grid ?? [];
const MAP_ROWS  = GRID.length;
const MAP_COLS  = GRID[0]?.length ?? 0;

const canvas   = document.getElementById("gameCanvas");   // ← idを一致
const ctx      = canvas.getContext("2d");
const statusEl = document.getElementById("status");

function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
  console.log(msg);
}

// 画像ローダ
function loadImage(src, label) {
  const img = new Image();
  img.onload  = () => setStatus(`✅ loaded: ${label} → ${src}`);
  img.onerror = () => setStatus(`❌ error: ${label} が読み込めません → ${src}`);
  img.src = src;
  return img;
}

// 画像（※パスはリポジトリ構成に合わせる）
const images = {
  background: loadImage("./assets/images/tanbo.png",  "background"),
  player:     loadImage("./assets/images/noumin.png", "player"),
};

// プレイヤー（スタート位置Sを探索）
const player = { x: 1, y: 1 };
for (let y = 0; y < MAP_ROWS; y++) {
  for (let x = 0; x < MAP_COLS; x++) {
    if (GRID[y][x] === 'S') { player.x = x; player.y = y; }
  }
}

// 入力（矢印キー）
window.addEventListener("keydown", (e) => {
  let handled = true;
  let nx = player.x, ny = player.y;
  if (e.key === "ArrowUp")    ny--;
  else if (e.key === "ArrowDown")  ny++;
  else if (e.key === "ArrowLeft")  nx--;
  else if (e.key === "ArrowRight") nx++;
  else handled = false;

  if (handled) e.preventDefault();

  if (handled && isWalkable(nx, ny)) {
    player.x = nx; player.y = ny;
    draw();
    checkTileEvent(nx, ny);
  }
});

function isWalkable(x, y) {
  if (y < 0 || y >= MAP_ROWS || x < 0 || x >= MAP_COLS) return false;
  return GRID[y][x] !== '#';
}

function checkTileEvent(x, y) {
  const t = GRID[y][x];
  if (t === 'E') setStatus('👹 敵に遭遇！クイズへ…（仮）');
  else if (t === 'I') setStatus('🎁 アイテムを見つけた！');
  else if (t === 'A') setStatus('🤝 味方に会った！');
  else if (t === 'G') setStatus('🏁 ゴール！');
  else setStatus('');
}

// 描画
function draw() {
  // 背景
  if (images.background.complete && images.background.naturalWidth > 0) {
    ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#cfeec0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // 壁＆グリッド
  for (let y = 0; y < MAP_ROWS; y++) {
    for (let x = 0; x < MAP_COLS; x++) {
      const t = GRID[y][x];
      if (t === '#') {
        ctx.fillStyle = '#556b2f';
        ctx.fillRect(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      ctx.strokeRect(x*TILE_SIZE + .5, y*TILE_SIZE + .5, TILE_SIZE - 1, TILE_SIZE - 1);

      // 目印（デバッグ）
      if (t !== '0' && t !== '#') {
        ctx.fillStyle = 'rgba(0,0,0,0.28)';
        ctx.font = '12px sans-serif';
        ctx.fillText(t, x*TILE_SIZE + 6, y*TILE_SIZE + 18);
      }
    }
  }

  // プレイヤー
  const dx = player.x * TILE_SIZE, dy = player.y * TILE_SIZE;
  if (images.player.complete && images.player.naturalWidth > 0) {
    ctx.drawImage(images.player, dx, dy, TILE_SIZE, TILE_SIZE);
  } else {
    ctx.fillStyle = "#2b8a3e";
    ctx.fillRect(dx + 8, dy + 8, TILE_SIZE - 16, TILE_SIZE - 16);
  }
}

// 初回描画
draw();
setStatus("画像を読み込み中… ./assets/images/tanbo.png, ./assets/images/noumin.png");

