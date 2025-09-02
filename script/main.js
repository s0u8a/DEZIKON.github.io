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
const images = {
  bg: new Image(),
  pl: new Image()
};

let loadedImages = 0;
function imageLoaded() {
  loadedImages++;
  if (loadedImages >= 2) {
    draw(); // 両方ロード完了で描画
    setStatus('✅ 画像読み込み完了');
  }
}

// 背景画像
images.bg.src = './assets/images/tanbo.png';
images.bg.onload = imageLoaded;
images.bg.onerror = () => setStatus('❌ 背景画像読み込み失敗');

// プレイヤー画像
images.pl.src = './assets/images/noumin.png';
images.pl.onload = imageLoaded;
images.pl.onerror = () => setStatus('❌ プレイヤー画像読み込み失敗');

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
    GRID[y][x] = '0';
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
  // 背景
  if (images.bg.complete && images.bg.naturalWidth) {
    ctx.drawImage(images.bg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#cfeec0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // マップ＆壁
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const t = GRID[y][x];
      if (t === '#') {
        ctx.fillStyle = '#556b2f';
        ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      }
      ctx.strokeStyle = 'rgba(0,0,0,.08)';
      ctx.strokeRect(x * TILE + .5, y * TILE + .5, TILE - 1, TILE - 1);

      if (t !== '0' && t !== '#') {
        ctx.fillStyle = 'rgba(0,0,0,.28)';
        ctx.font = '12px sans-serif';
        ctx.fillText(t, x * TILE + 6, y * TILE + 18);
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
