// -----------------------------
// 定数・初期設定
// -----------------------------
const TILE = window.GMAP?.tile ?? 64;
const GRID = window.GMAP?.grid ?? [];
const ROWS = GRID.length;
const COLS = GRID[0]?.length ?? 0;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');

// ✅ マップサイズに合わせてキャンバスを調整
canvas.width = COLS * TILE;
canvas.height = ROWS * TILE;

function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
  console.log(msg);
}

// -----------------------------
// プレイヤー情報
// -----------------------------
const player = {
  x: 1,
  y: 1,
  hearts: 3,
  maxHearts: 3
};

// スタート位置(S)があれば設定
for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    if (GRID[y][x] === 'S') {
      player.x = x;
      player.y = y;
    }
  }
}

// -----------------------------
// 画像読み込み
// -----------------------------
function loadImage(src) {
  const img = new Image();
  img.src = src;
  img.onload = () => setStatus(`✅ loaded: ${src}`);
  img.onerror = () => setStatus(`❌ error: ${src}`);
  return img;
}

const images = {
  floor: loadImage('./assets/images/tanbo.png'), // 床
  wall: loadImage('./assets/images/wall.png'),   // 壁
  enemy: loadImage('./assets/images/enemy.png'), // 敵
  item: loadImage('./assets/images/item.png'),   // アイテム
  ally: loadImage('./assets/images/ally.png'),   // 味方
  goal: loadImage('./assets/images/goal.png'),   // ゴール
  pl: loadImage('./assets/images/noumin.png')    // プレイヤー
};

// -----------------------------
// 移動判定
// -----------------------------
function walkable(x, y) {
  return !(x < 0 || x >= COLS || y < 0 || y >= ROWS) && GRID[y][x] !== '#';
}

// -----------------------------
// HP管理
// -----------------------------
function takeDamage(amount = 1) {
  player.hearts -= amount;
  if (player.hearts < 0) player.hearts = 0;
  draw();
  setStatus(`💔 HP: ${player.hearts}/${player.maxHearts}`);
}

function heal(amount = 1) {
  player.hearts += amount;
  if (player.hearts > player.maxHearts) player.hearts = player.maxHearts;
  draw();
  setStatus(`❤️ HP: ${player.hearts}/${player.maxHearts}`);
}

// -----------------------------
// タイル接触処理
// -----------------------------
function onTile(x, y) {
  const t = GRID[y][x];
  if (t === 'E') {
    setStatus('👹 敵に遭遇！クイズへ…（仮）');
    takeDamage(1);
  } else if (t === 'I') {
    setStatus('🎁 アイテムを取得！ハート+1');
    heal(1);
    GRID[y][x] = '0'; // アイテム消滅
  } else if (t === 'A') {
    setStatus('🤝 味方に会った！');
  } else if (t === 'G') {
    setStatus('🏁 ゴール！');
  }
}

// -----------------------------
// キー入力
// -----------------------------
window.addEventListener('keydown', e => {
  let nx = player.x, ny = player.y;
  let handled = true;

  if (e.key === 'ArrowUp') ny--;
  else if (e.key === 'ArrowDown') ny++;
  else if (e.key === 'ArrowLeft') nx--;
  else if (e.key === 'ArrowRight') nx++;
  else handled = false;

  if (handled) e.preventDefault();

  if (handled && walkable(nx, ny)) {
    player.x = nx;
    player.y = ny;
    onTile(nx, ny);
    draw();
  }
});

// -----------------------------
// ライフゲージ描画
// -----------------------------
function drawLifeGauge() {
  const startX = 10;
  const startY = 10;
  const size = 16;
  const gap = 4;
  for (let i = 0; i < player.maxHearts; i++) {
    ctx.fillStyle = (i < player.hearts) ? 'red' : 'gray';
    ctx.fillRect(startX + i * (size + gap), startY, size, size);
  }
}

// -----------------------------
// 描画
// -----------------------------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // マップタイル
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const t = GRID[y][x];
      const dx = x * TILE, dy = y * TILE;

      // 床は常に敷く
      if (images.floor.complete && images.floor.naturalWidth) {
        ctx.drawImage(images.floor, dx, dy, TILE, TILE);
      } else {
        ctx.fillStyle = '#cfeec0';
        ctx.fillRect(dx, dy, TILE, TILE);
      }

      // タイルごとの上書き
      if (t === '#') {
        ctx.drawImage(images.wall, dx, dy, TILE, TILE);
      } else if (t === 'E') {
        ctx.drawImage(images.enemy, dx, dy, TILE, TILE);
      } else if (t === 'I') {
        ctx.drawImage(images.item, dx, dy, TILE, TILE);
      } else if (t === 'A') {
        ctx.drawImage(images.ally, dx, dy, TILE, TILE);
      } else if (t === 'G') {
        ctx.drawImage(images.goal, dx, dy, TILE, TILE);
      }
    }
  }

  // プレイヤー
  const dx = player.x * TILE, dy = player.y * TILE;
  if (images.pl.complete && images.pl.naturalWidth) {
    ctx.drawImage(images.pl, dx, dy, TILE, TILE);
  } else {
    ctx.fillStyle = '#2b8a3e';
    ctx.fillRect(dx + 8, dy + 8, TILE - 16, TILE - 16);
  }

  // HPライフゲージ
  drawLifeGauge();
}

setStatus('画像読み込み中…');
draw(); // 最初に1回描画
